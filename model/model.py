from transformers import pipeline, AutoConfig
from PIL import Image
import time

MODEL_NAME = "google/vit-base-patch16-224"


def imagenet_animal_labels():
    ...


def classify_image(image_object: Image.Image) -> list:

    time.sleep(1) 
    
    fake_predictions = [
        {'name': 'Lion', 'score': 92.1},
        {'name': 'Tiger', 'score': 5.4},
        {'name': 'Cat', 'score': 1.1}
    ]
    
    return fake_predictions
