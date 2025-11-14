from flask import Flask, url_for, render_template, jsonify, request
from PIL import Image
from model.model import classify_image

app = Flask(__name__)

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
            
            # Use the classify_image function from model/model.py
            predictions = classify_image(img) 
            
            # Return the predictions as JSON
            return jsonify(predictions)

        except Exception as e:
            print(f"Error: {e}") 
            return jsonify({'error': 'Something went wrong during analysis'}), 500

    return jsonify({'error': 'Something went wrong'}), 500

if(__name__ == "__main__"):
    app.run(debug=True)