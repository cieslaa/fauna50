from flask import Flask, url_for, render_template, jsonify, request
from PIL import Image
from model.model import classify_image
from duckduckgo_search import DDGS

app = Flask(__name__)

def get_animal_images(animal_name):
    """
    Takes 3 animal images from DuckDuckGo
    """
    results = []
    try:
        with DDGS() as ddgs:
            # For example, "Golden retriever animal photo"
            search_results = list(ddgs.images(f"{animal_name} animal photo", max_results=3))
            
            for item in search_results:
                results.append(item['image'])
                
    except Exception as e:
        print(f"Error while loading images: {e}")
        
    return results

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            img = Image.open(file.stream)

            prediction = classify_image(img) 
            
            if not prediction['is_animal']:
                return jsonify({
                    'success': True,  
                    'is_animal': False,
                    'name': prediction['name'],
                    'message': f"Found: {prediction['name']}. Could not identify as an animal. Try another image.",
                })
            
            print(f"Found animal: {prediction['name']}. Score: {prediction['score']}%, loading images...")
            gallery = get_animal_images(prediction['name'])

            return jsonify({
                'success': True,
                'is_animal': True,
                'name': prediction['name'],
                'score': prediction['score'],
                'images': gallery  
            })

        except Exception as e:
            print(f"Error: {e}") 
            return jsonify({'error': 'Błąd podczas analizy obrazu'}), 500

    return jsonify({'error': 'Unknown error'}), 500

if(__name__ == "__main__"):
    app.run(debug=True)