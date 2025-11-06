from flask import Flask, url_for, render_template, jsonify, request
import time

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
        # Add Python ML prediction logic here
        
        # Symulujemy opóźnienie analizy ML
        time.sleep(2) 
        
        # ZReturn false prediction for testing 
        return jsonify({'prediction': 'Golden Retriever (Test)'})

    return jsonify({'error': 'Something went wrong'}), 500

if(__name__ == "__main__"):
    app.run(debug=True)