import cv2
import numpy as np
import math
from cvzone.HandTrackingModule import HandDetector
cap = cv2.VideoCapture(0)
detector = HandDetector(maxHands=1)
boundarySize = 20
imageSize = 300
folder = "data/stop"
counter = 0
while True:
    success, img = cap.read()
    if not success:
        print("Failed to capture image")
        break
    hands, img = detector.findHands(img)
    if hands:
        hand = hands[0]
        x, y, width, height = hand['bbox']
        y1, y2 = max(0, y - boundarySize), min(img.shape[0], y + height + boundarySize)
        x1, x2 = max(0, x - boundarySize), min(img.shape[1], x + width + boundarySize)
        imgCrop = img[y1:y2, x1:x2]
        imgWhite = np.ones((imageSize, imageSize, 3), np.uint8) * 255
        aspectRatio = height / width
        if imgCrop.size == 0:
            print("Empty crop, skipping frame")
            continue
        if aspectRatio > 1:
            const = imageSize / height
            widthCalculated = math.ceil(const * width)
            imgResize = cv2.resize(imgCrop, (widthCalculated, imageSize))
            widthGap = math.ceil((imageSize - widthCalculated) / 2)
            imgWhite[:, widthGap:widthGap + widthCalculated] = imgResize
        else:
            const = imageSize / width
            heightCalculated = math.ceil(const * height)
            imgResize = cv2.resize(imgCrop, (imageSize, heightCalculated))
            heightGap = math.ceil((imageSize - heightCalculated) / 2)
            imgWhite[heightGap:heightGap + heightCalculated, :] = imgResize
        cv2.imshow("Cropped Image", imgCrop)
        cv2.imshow("White Image", imgWhite)
    cv2.imshow("Image", img)
    key = cv2.waitKey(1)
    if key == ord("s") and hands:
        counter += 1
        cv2.imwrite(f'{folder}/{counter}.jpg', imgWhite)
        print(f"Saved Image {counter}")
    if key == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()