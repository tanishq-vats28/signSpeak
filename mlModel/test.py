from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import math
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier

app = Flask(__name__)
CORS(app)

detector = HandDetector(maxHands=1)
classifier = Classifier("model/keras_model.h5", "model/labels.txt")

offset = 20
imgSize = 300
labels = ["call me", "good luck", "greetings", "hope", "i love you", "okay", "pointing down", 
          "pointing up", "raised hand", "rock on", "stop", "thumbs down", "thumbs up", 
          "victory", "wish to prosper"]

@app.route('/detect', methods=['POST'])
def detect():
    if 'frame' not in request.files:
        return jsonify({"error": "No frame provided"}), 400

    file = request.files['frame']
    np_img = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    imgOutput = img.copy()
    hands, img = detector.findHands(img)

    if hands:
        hand = hands[0]
        x, y, w, h = hand['bbox']

        imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255
        imgCrop = img[y - offset:y + h + offset, x - offset:x + w + offset]

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
            prediction, index = classifier.getPrediction(imgWhite, draw=False)
            detected_text = labels[index]
        except Exception as e:
            return jsonify({"error": f"Error in classification: {str(e)}"}), 500

        return jsonify({"text": detected_text})

    return jsonify({"text": "No hand detected"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)