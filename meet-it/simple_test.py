import numpy as np
import cv2
from keras.models import load_model
from PIL import Image
import base64
import io

# Load the model
print("Loading model...")
model = load_model('cnn8grps_rad1_model.h5')
print("Model loaded successfully!")

def test_model_with_random_image():
    """Test the model with a random image to see how it responds"""
    # Create a random 400x400 RGB image (similar to what the model expects)
    random_image = np.random.randint(0, 255, (400, 400, 3), dtype=np.uint8)
    
    # Reshape for model input
    test_input = random_image.reshape(1, 400, 400, 3)
    
    # Get prediction
    prob = model.predict(test_input)[0]
    ch1 = np.argmax(prob)
    confidence = prob[ch1] * 100
    
    print(f"Random image prediction:")
    print(f"Class: {ch1}")
    print(f"Confidence: {confidence:.2f}%")
    print(f"All probabilities: {[f'{p:.3f}' for p in prob]}")
    
    return ch1, confidence

def test_model_with_webcam():
    """Test the model with webcam input"""
    print("Starting webcam test...")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open webcam")
        return
    
    print("Webcam opened. Press 'q' to quit, 's' to save and test image")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read from webcam")
            break
            
        # Resize frame to 400x400
        resized = cv2.resize(frame, (400, 400))
        
        # Show the frame
        cv2.imshow('Webcam - Press q to quit, s to test', resized)
        
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('s'):
            # Test with current frame
            test_input = resized.reshape(1, 400, 400, 3)
            prob = model.predict(test_input)[0]
            ch1 = np.argmax(prob)
            confidence = prob[ch1] * 100
            
            print(f"\nWebcam frame prediction:")
            print(f"Class: {ch1}")
            print(f"Confidence: {confidence:.2f}%")
            print(f"All probabilities: {[f'{p:.3f}' for p in prob]}")
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    print("Testing the sign language model...")
    print("=" * 50)
    
    # Test 1: Random image
    print("\n1. Testing with random image:")
    test_model_with_random_image()
    
    # Test 2: Webcam
    print("\n2. Testing with webcam (press 's' to test current frame):")
    test_model_with_webcam()
    
    print("\nTest completed!")
