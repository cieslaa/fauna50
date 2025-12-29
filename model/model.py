from transformers import ViTImageProcessor, ViTForImageClassification
import torch
import torch.nn.functional as F
from PIL import Image

MODEL_NAME = "google/vit-base-patch16-224"

print("Loading AI model...")
processor = ViTImageProcessor.from_pretrained(MODEL_NAME)
model = ViTForImageClassification.from_pretrained(MODEL_NAME)
print("Ready!")

def classify_image(image_object: Image.Image) -> list:

    inputs = processor(images=image_object, return_tensors="pt")

    # Turn off no_grad
    with torch.no_grad():
        outputs = model(**inputs)
    
    # softmax turns logits into probability
    logits = outputs.logits
    probs = F.softmax(logits, dim=-1)

    top_score, top_index = torch.max(probs, 1)
    
    score_percent = top_score.item() * 100
    class_id = top_index.item()
    
    label_name = model.config.id2label[class_id].split(',')[0]

    # In ImageNet, animal classes are labeled 0-397
    is_animal = class_id <= 397

    return {
        'name': label_name,
        'score': round(score_percent, 1),
        'is_animal': is_animal
    }
