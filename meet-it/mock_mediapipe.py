# Mock mediapipe module to allow final_pred.py to run
import numpy as np

class MockHands:
    def __init__(self, **kwargs):
        pass
    
    def process(self, image):
        # Return mock hand landmarks
        class MockResult:
            def __init__(self):
                self.multi_hand_landmarks = None
                self.multi_handedness = None
        
        return MockResult()

# Add the Hands class attribute
MockHands.Hands = MockHands

class MockDrawingUtils:
    def draw_landmarks(self, image, landmark_list, connections=None, landmark_drawing_spec=None, connection_drawing_spec=None):
        return image

# Create mock module
class MockMediaPipe:
    def __init__(self):
        self.solutions = MockSolutions()
        self.drawing_utils = MockDrawingUtils()

class MockSolutions:
    def __init__(self):
        self.hands = MockHands
        self.drawing_utils = MockDrawingUtils()

# Create the mock module
mp = MockMediaPipe()

# Make it available as a module
import sys
sys.modules['mediapipe'] = mp
