import os
import pickle
import cv2
import face_recognition

# Images will be stored in a folder, the list of images scraped will be stored in image_names
image_names = os.listdir("images")

# List of all encodings of faces found will be stored in encodings
encodings = []
filenames = []
# Iterate through every image in the dataset
for img in image_names :
  # Read the image
  try :
    image = cv2.imread('images/' + img)
    
    width = 1000
    height = 1000
    dim = (width, height)

    image = cv2.resize(image, dim, cv2.INTER_AREA)
    # Convert to RGB
    rgb = cv2.cvtColor(image,cv2.COLOR_BGR2RGB)

    # Identify the boxes using a CNN
    boxes = face_recognition.face_locations(rgb,model = "cnn")

    # Encode the 128-dimensional vector
    encoding = face_recognition.face_encodings(rgb,boxes)

    # Add to final list
    encodings.extend(encoding)
    for i in range(len(encoding)):
      filenames.append(img)
  except :
    pass


# Write the entire data to a file.
fl = open("encodings.pkl", "wb")
pickle.dump(encodings, fl)

fl = open("filenames.pkl", "wb")
pickle.dump(filenames,fl)