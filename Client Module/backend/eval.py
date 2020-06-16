#eval.py

import os
import pickle
import cv2
import face_recognition
from PIL import Image, ExifTags
from PIL.ExifTags import TAGS
import sys


# Load pretrained encodings into file.
fl = open("encodings.pkl", "rb")
encodings = pickle.load(fl)

fl = open("filenames.pkl", "rb")
filenames = pickle.load(fl)
# Load image to be compared

test_name = str(sys.argv[1])
test_image = cv2.imread(test_name)
#test_image = cv2.imread("test_image.jpg")


width = 1000
height = 1000
dim = (width, height)

test_image = cv2.resize(test_image, dim, cv2.INTER_AREA)

# Convert to RGB
rgb = cv2.cvtColor(test_image,cv2.COLOR_BGR2RGB)

# Identify face-boxes
boxes = face_recognition.face_locations(rgb,model = "cnn")

# Compute encodings
enc = face_recognition.face_encodings(rgb,boxes)

# Compare with our dataset.
try :
  results = face_recognition.compare_faces(enc[0], encodings)
except IndexError :
  results = []

answer = ""
found = False
for i in range(len(results)) :
  res = results[i]
  if res == True :
    found = True
    answer=''
    #print("Image match found !")
    answer += "#" + filenames[i] 
    img = Image.open("images/" + filenames[i])
    #exif = { ExifTags.TAGS[k]: v for k, v in img._getexif().items() if k in ExifTags.TAGS }
    #print(exif)
    #Extract Metadata from file
    exifdata = img.getexif()
    # iterating over all EXIF data fields
    for tag_id in exifdata:
      # get the tag name, instead of human unreadable tag id
      tag = TAGS.get(tag_id, tag_id)
      data = exifdata.get(tag_id)
      # decode bytes 
      if isinstance(data, bytes):
        try :
          data = data.decode()
        except : 
          continue
      try:
        if(tag == "DateTime"):
          answer += f"${data}"
        elif(tag.find("GPS") != -1):
          lat = data[2][0][0] / data[2][0][1] + data[2][1][0] / (data[2][1][1] * 60) + data[2][2][0] / (data[2][2][1] * 3600)
          lng = data[4][0][0] / data[4][0][1] + data[4][1][0] / (data[4][1][1] * 60) + data[4][2][0] / (data[4][2][1] * 3600)
          answer += "% Latitude : " + str(lat) + " Longitude: " + str(lng) 
      except :
        continue
    print(answer,flush=True)


if not found :
  print("~No matches found.")
# else :
#   print(answer,flush=True)