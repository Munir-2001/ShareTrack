import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# ✅ Load dataset
file_path = "creditScoringService/clustered_data.csv"  # Ensure correct path
df = pd.read_csv(file_path)

# ✅ Define features and target
X = df.drop(columns=["Credit Score"])
y = df["Credit Score"]

# ✅ Standardize numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ✅ Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# ✅ Train Random Forest Model
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# ✅ Save trained model
joblib.dump(rf_model, "creditScoringService/credit_model.pkl")
joblib.dump(scaler, "creditScoringService/scaler.pkl")

print("✅ Model trained and saved successfully!")
