import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision


class HandDetector:
    def __init__(self, model_path, max_hands=1, detection_confidence=0.5):
        if not model_path.exists():
            raise FileNotFoundError(f"MediaPipe hand landmarker model not found: {model_path}")

        options = vision.HandLandmarkerOptions(
            base_options=python.BaseOptions(model_asset_path=str(model_path)),
            running_mode=vision.RunningMode.IMAGE,
            num_hands=max_hands,
            min_hand_detection_confidence=detection_confidence,
        )
        self.landmarker = vision.HandLandmarker.create_from_options(options)

    def find_hands(self, img):
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_img)
        result = self.landmarker.detect(mp_image)

        hands = []
        height, width = img.shape[:2]
        for hand_landmarks in result.hand_landmarks:
            x_values = [int(landmark.x * width) for landmark in hand_landmarks]
            y_values = [int(landmark.y * height) for landmark in hand_landmarks]
            xmin, xmax = min(x_values), max(x_values)
            ymin, ymax = min(y_values), max(y_values)
            hands.append({"bbox": (xmin, ymin, xmax - xmin, ymax - ymin)})

        return hands, img
