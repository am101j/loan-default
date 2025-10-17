"""
Prediction Service
Loads the trained model and provides predictions via HTTP API
"""

import pickle
import pandas as pd
import numpy as np
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from Next.js frontend

# Load model and scaler on startup
model_dir = Path('public/models')
model = None
scaler = None

def load_model():
    global model, scaler
    try:
        with open(model_dir / 'model.pkl', 'rb') as f:
            model = pickle.load(f)
        with open(model_dir / 'scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        print("✅ Model and scaler loaded successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return False

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract and prepare features in the same order as training
        features = {
            'RevolvingUtilizationOfUnsecuredLines': float(data['creditUtilization']),
            'NumberOfTime30-59DaysPastDueNotWorse': int(data['late30Days']),
            'DebtRatio': float(data['debtRatio']),
            'MonthlyIncome': float(data['monthlyIncome']),
            'NumberOfOpenCreditLinesAndLoans': int(data['openCreditLines']),
            'NumberOfTimes90DaysLate': int(data['late90Days']),
            'NumberRealEstateLoansOrLines': int(data['realEstateLoans']),
            'NumberOfTime60-89DaysPastDueNotWorse': int(data['late60Days']),
            'NumberOfDependents': int(data['dependents']),
        }
        
        # Calculate engineered features (same as training)
        features['DebtRatio_Capped'] = min(features['DebtRatio'], np.percentile([features['DebtRatio']], 95))
        features['TotalCreditLines'] = features['NumberOfOpenCreditLinesAndLoans'] + features['NumberRealEstateLoansOrLines']
        features['UtilizationRate'] = min(features['RevolvingUtilizationOfUnsecuredLines'], 1.5)
        features['LatePaymentRisk'] = (
            features['NumberOfTime30-59DaysPastDueNotWorse'] * 1 +
            features['NumberOfTime60-89DaysPastDueNotWorse'] * 2 +
            features['NumberOfTimes90DaysLate'] * 3
        )
        
        # Create feature array in correct order
        feature_order = [
            'RevolvingUtilizationOfUnsecuredLines', 'NumberOfTime30-59DaysPastDueNotWorse',
            'DebtRatio', 'MonthlyIncome', 'NumberOfOpenCreditLinesAndLoans',
            'NumberOfTimes90DaysLate', 'NumberRealEstateLoansOrLines',
            'NumberOfTime60-89DaysPastDueNotWorse', 'NumberOfDependents',
            'DebtRatio_Capped', 'TotalCreditLines', 'UtilizationRate', 'LatePaymentRisk'
        ]
        
        X = np.array([[features[col] for col in feature_order]])
        
        # Scale features
        X_scaled = scaler.transform(X)
        
        # Make prediction
        probabilities = model.predict_proba(X_scaled)[0]
        probability = probabilities[1]  # Probability of default
        
        # Calculate confidence score (how certain the model is)
        confidence = max(probabilities) * 100  # Higher when model is more certain
        
        # Calculate optimal interest rate based on risk
        base_rate = 5.5  # Base prime rate
        risk_premium = probability * 15  # Risk-based premium (0-15%)
        suggested_rate = base_rate + risk_premium
        
        # Determine risk level and pricing strategy
        if probability >= 0.6:
            risk_level = "High Risk"
            if probability >= 0.8:
                recommendation = f"✗ Decline - Default risk too high ({probability*100:.1f}%)"
                pricing_decision = "DECLINE"
                suggested_rate = None
            else:
                recommendation = f"⚠ High-Risk Approval - Approve at {suggested_rate:.1f}% APR"
                pricing_decision = "APPROVE_HIGH_RATE"
        elif probability >= 0.3:
            risk_level = "Medium Risk"
            recommendation = f"⚠ Standard Approval - Approve at {suggested_rate:.1f}% APR"
            pricing_decision = "APPROVE_STANDARD"
        else:
            risk_level = "Low Risk"
            recommendation = f"✓ Prime Approval - Approve at {suggested_rate:.1f}% APR"
            pricing_decision = "APPROVE_PRIME"
        
        # Identify top risk factors
        top_factors = []
        if features['NumberOfTimes90DaysLate'] > 0:
            top_factors.append({"factor": "90+ Days Late Payments", "impact": "high"})
        if features['RevolvingUtilizationOfUnsecuredLines'] > 0.5:
            top_factors.append({"factor": "High Credit Utilization", "impact": "high"})
        if features['DebtRatio'] > 0.5:
            top_factors.append({"factor": "High Debt-to-Income Ratio", "impact": "high"})
        if features['MonthlyIncome'] < 3000:
            top_factors.append({"factor": "Low Monthly Income", "impact": "medium"})

        
        if not top_factors:
            top_factors.append({"factor": "Clean Payment History", "impact": "low"})
            top_factors.append({"factor": "Healthy Credit Utilization", "impact": "low"})
        
        return jsonify({
            "defaultProbability": float(probability),
            "confidence": float(confidence),
            "riskLevel": risk_level,
            "recommendation": recommendation,
            "suggestedRate": float(suggested_rate) if suggested_rate else None,
            "pricingDecision": pricing_decision,
            "topFactors": top_factors[:5]
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": "Failed to generate prediction"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

if __name__ == '__main__':
    if load_model():
        print("🚀 Starting prediction service on http://localhost:5000")
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("❌ Cannot start service - model loading failed")