import io
from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from keras.preprocessing import image
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Input
from flask_cors import CORS  # Import CORS
# Initialize the Flask app
app = Flask(__name__)
CORS(app)
# Manually reconstruct the model architecture (adjust input shape)
model = Sequential([
    Input(shape=(200, 200, 3)),  # Explicitly define the input shape
    Conv2D(32, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Conv2D(32, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Conv2D(256, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Flatten(),
    Dense(1024, activation='relu'),
    Dense(512, activation='relu'),
    Dense(4, activation='softmax')  # Assuming you have 4 classes (Abyssian, Munchkin, Persian, Toyger)
])

# Load the weights from the HDF5 file
model.load_weights("model.h5")
print("Loaded model and weights from disk")

# Define a route for the default URL, which loads the home page
@app.route('/')
def index():
    return "Welcome to the Cat Breed Classifier API!"

# Route for predicting the breed
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Convert the uploaded file to a format that `image.load_img` can use
    img = image.load_img(io.BytesIO(file.read()), target_size=(200, 200))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    # Predict the breed
    classes = model.predict(img_array)

    # Define breed names in the same order as the model outputs
    breeds = ['Abyssian', 'Munchkin', 'Persian', 'Toyger']
    
    # Get the predicted breed
    predicted_breed = breeds[np.argmax(classes)]
    
    # Return the result as JSON
    return jsonify({"predicted_breed": predicted_breed})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
