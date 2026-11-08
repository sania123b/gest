#!/usr/bin/env python3
"""
Test script to verify the model is working correctly
"""
import cv2
import numpy as np
from predictor import HandGesturePredictor

def test_model():
    print("Testing model initialization...")
    try:
        predictor = HandGesturePredictor()
        print("✅ Model loaded successfully")
        
        # Test with a simple white image
        print("Testing with white image...")
        white_image = np.ones((400, 400, 3), dtype=np.uint8) * 255
        
        # Test predict_frames
        frames = [white_image]
        accuracy = predictor.predict_frames(frames)
        print(f"✅ predict_frames returned: {accuracy}")
        
        # Test predict_letter
        letter, confidence, text = predictor.predict_letter(white_image)
        print(f"✅ predict_letter returned: letter={letter}, confidence={confidence}, text='{text}'")
        
        print("✅ All tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_model()
