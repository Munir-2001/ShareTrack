import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Load the trained credit scoring model
MODEL_PATH = "credit_model.pkl"

try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None  # Handle missing model gracefully

# Define the request schema
class CreditScoreInput(BaseModel):
    age: int
    gender: int  # 1 for Male, 0 for Female
    marital_status: int  # 1 for Married, 0 for Not Married
    education_level: str  # "Bachelor", "Master", etc.
    employment_status: int  # 1 for Employed, 0 for Unemployed
    total_lend_borrow_ratio: float
    timely_payment_score: float

# Define a mapping for categorical variables
EDUCATION_MAPPING = {"High School": 0, "Bachelor": 1, "Master": 2, "PhD": 3}

@app.post("/predict/")
def predict_credit_score(input_data: CreditScoreInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not available. Please retrain it.")

    # Convert categorical variables to numerical
    education_numeric = EDUCATION_MAPPING.get(input_data.education_level, 1)  # Default to Bachelor

    # Create the input feature array
    features = np.array([
        input_data.age, 
        input_data.gender, 
        input_data.marital_status, 
        education_numeric, 
        input_data.employment_status,
        input_data.total_lend_borrow_ratio, 
        input_data.timely_payment_score
    ]).reshape(1, -1)

    print("🚀 Input Features:", features)  # ✅ Debugging: Check input data

    # Make a prediction
    predicted_score = model.predict(features)[0]
    print("after api call the new score is", predicted_score)  # ✅ Also correct
    return {"credit_score": predicted_score}
