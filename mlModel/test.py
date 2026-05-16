from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import math
from pathlib import Path
from tf_keras.models import load_model
from hand_detector import HandDetector

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "keras_model.h5"
LABELS_PATH = BASE_DIR / "model" / "labels.txt"
HAND_LANDMARKER_PATH = BASE_DIR / "model" / "hand_landmarker.task"
MIN_CONFIDENCE = 0.75


class SignClassifier:
    def __init__(self, model_path, labels_path):
        self.model = load_model(model_path, compile=False)
        self.labels = self._load_labels(labels_path)
        self.input_size = (224, 224)

    @staticmethod
    def _load_labels(labels_path):
        labels = []
        with open(labels_path, "r", encoding="utf-8") as label_file:
            for line in label_file:
                label = line.strip().split(" ", 1)
                if len(label) == 2:
                    labels.append(label[1])
        return labels

    def get_prediction(self, img):
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, tuple(self.input_size))
        image_array = np.asarray(img, dtype=np.float32)
        normalized_image = (image_array / 127.0) - 1
        data = np.expand_dims(normalized_image, axis=0)
        prediction = self.model.predict(data, verbose=0)[0]
        index = int(np.argmax(prediction))
        confidence = float(prediction[index])
        return prediction, index, confidence


classifier = SignClassifier(MODEL_PATH, LABELS_PATH)
detector = HandDetector(HAND_LANDMARKER_PATH, max_hands=1)

offset = 20
imgSize = 300
labels = classifier.labels

@app.route('/detect', methods=['POST'])
def detect():
    if 'frame' not in request.files:
        return jsonify({"error": "No frame provided"}), 400

    file = request.files['frame']
    np_img = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    imgOutput = img.copy()
    hands, img = detector.find_hands(img)

    if hands:
        hand = hands[0]
        x, y, w, h = hand['bbox']

        imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255
        y1, y2 = max(0, y - offset), min(img.shape[0], y + h + offset)
        x1, x2 = max(0, x - offset), min(img.shape[1], x + w + offset)
        imgCrop = img[y1:y2, x1:x2]

        if imgCrop.size == 0:
            print("Detection result: No hand detected")
            return jsonify({"text": "No hand detected", "detected": False})

        aspectRatio = h / w

        if aspectRatio > 1:
            k = imgSize / h
            wCal = math.ceil(k * w)
            imgResize = cv2.resize(imgCrop, (wCal, imgSize))
            wGap = math.ceil((imgSize - wCal) / 2)
            imgWhite[:, wGap:wCal + wGap] = imgResize
        else:
            k = imgSize / w
            hCal = math.ceil(k * h)
            imgResize = cv2.resize(imgCrop, (imgSize, hCal))
            hGap = math.ceil((imgSize - hCal) / 2)
            imgWhite[hGap:hCal + hGap, :] = imgResize

        try:
            prediction, index, confidence = classifier.get_prediction(imgWhite)
            detected_text = labels[index]
        except Exception as e:
            return jsonify({"error": f"Error in classification: {str(e)}"}), 500

        if confidence < MIN_CONFIDENCE:
            print(f"Detection result: Unknown ({confidence:.2%})")
            return jsonify({
                "text": "Unknown sign",
                "detected": False,
                "confidence": confidence,
            })

        print(f"Detection result: {detected_text} ({confidence:.2%})")
        return jsonify({
            "text": detected_text,
            "detected": True,
            "confidence": confidence,
        })

    print("Detection result: No hand detected")
    return jsonify({"text": "No hand detected", "detected": False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


