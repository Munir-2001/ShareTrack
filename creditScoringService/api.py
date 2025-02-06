# from fastapi import FastAPI
# from pydantic import BaseModel
# import joblib
# import numpy as np

# # ✅ Load trained model and scaler
# model = joblib.load("creditScoringService/credit_model.pkl")
# scaler = joblib.load("creditScoringService/scaler.pkl")

# # ✅ Initialize FastAPI
# app = FastAPI()

# # ✅ Define input data format
# class CreditScoreInput(BaseModel):
#     age: int
#     gender: int  # 1 for male, 0 for female
#     marital_status: int  # 1 for married, 0 otherwise
#     education_level: str  # "Bachelor", "Master", etc.
#     employment_status: int  # 1 for employed, 0 otherwise
#     total_lend_borrow_ratio: float
#     timely_payment_score: float

# # ✅ Encode categorical education level
# education_mapping = {"High School": 1, "Bachelor": 2, "Master": 3, "PhD": 4, "Other": 0}

# # ✅ Endpoint to get credit score
# @app.post("/predict_credit_score")
# def predict_credit_score(input_data: CreditScoreInput):
#     try:
#         # Convert input into model features
#         features = np.array([
#             input_data.age,
#             input_data.gender,
#             input_data.marital_status,
#             education_mapping.get(input_data.education_level, 0),  # Encode education level
#             input_data.employment_status,
#             input_data.total_lend_borrow_ratio,
#             input_data.timely_payment_score
#         ]).reshape(1, -1)

#         # Scale input data
#         features_scaled = scaler.transform(features)

#         # Predict credit score
#         predicted_score = model.predict(features_scaled)[0]

#         return {"credit_score": round(predicted_score, 2)}
    
#     except Exception as e:
#         return {"error": str(e)}



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
