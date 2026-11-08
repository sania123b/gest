# Importing Libraries
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import cv2
import base64
from typing import List
import io
import tempfile
import os
from PIL import Image
from predictor import HandGesturePredictor

# Create FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the predictor
learnit_predictor = HandGesturePredictor()
meetit_predictor = HandGesturePredictor(model_path='cnn8grps_rad1_model copy.h5')

class FramesRequest(BaseModel):
    frames: List[str]  # List of base64 encoded images

def base64_to_image(base64_string):
    try:
        # Decode base64 string to bytes
        image_bytes = base64.b64decode(base64_string)
        
        # Convert bytes to numpy array
        image_array = np.frombuffer(image_bytes, dtype=np.uint8)
        
        # Decode the numpy array as an image
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        
        return image
    except Exception as e:
        print(f"Error converting base64 to image: {str(e)}")
        return None

@app.post("/evaluate")
async def evaluate_frames(request: FramesRequest):
    if not request.frames:
        raise HTTPException(status_code=400, detail="No frames provided")
    
    try:
        # Convert base64 frames to images
        images = []
        for frame_base64 in request.frames:
            image = base64_to_image(frame_base64)
            if image is not None:
                images.append(image)
        
        if not images:
            raise HTTPException(status_code=400, detail="No valid images found")
        
        # Get prediction for frames
        accuracy = learnit_predictor.predict_frames(images)
        
        # Round the accuracy to a whole number
        accuracy = round(accuracy)
        
        return {"accuracy": accuracy}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate_video")
async def evaluate_video(file: UploadFile = File(...)):
    try:
        # Read the uploaded video file
        video_content = await file.read()
        
        # Save video to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
            temp_file.write(video_content)
            temp_file_path = temp_file.name
        
        try:
            # Open video file
            cap = cv2.VideoCapture(temp_file_path)
            frames = []
            
            # Extract frames from video
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                frames.append(frame)
            
            cap.release()
            
            if not frames:
                raise HTTPException(status_code=400, detail="No frames found in video")
            
            # Get prediction for frames
            accuracy = learnit_predictor.predict_frames(frames)
            
            # Round the accuracy to a whole number
            accuracy = round(accuracy)
            
            return {"accuracy": accuracy}
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict_letter")
async def predict_letter(file: UploadFile = File(...)):
    try:
        # Read the uploaded image file
        image_content = await file.read()
        
        # Convert bytes to numpy array
        image_array = np.frombuffer(image_content, dtype=np.uint8)
        
        # Decode the numpy array as an image
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # Get prediction for single frame
        letter, confidence, accumulated_text = meetit_predictor.predict_letter(image)
        
        return {
            "letter": letter,
            "confidence": confidence,
            "accumulated_text": accumulated_text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clear_text")
async def clear_text():
    try:
        meetit_predictor.clear_text()
        return {"message": "Text cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/accuracy")
async def get_accuracy():
    try:
        with open("accuracy.txt", "r") as f:
            value = f.read().strip()
            return {"accuracy": int(value) if value.isdigit() else 0}
    except Exception:
        return {"accuracy": 0}

# Main application entry point
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)