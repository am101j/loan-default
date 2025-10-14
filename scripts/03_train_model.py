"""
Machine Learning Model Training
Trains a Random Forest classifier to predict loan defaults
"""

import pandas as pd
import numpy as np
from pathlib import Path
import json
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
from sklearn.preprocessing import StandardScaler

def train_model():
    """Train the loan default prediction model"""
    
    data_path = Path('public/data/cleaned_data.csv')
    
    if not data_path.exists():
        print("❌ Cleaned data not found. Please run 01_data_processing.py first")
        return
    
    print("📚 Loading data...")
    df = pd.read_csv(data_path)
    
    # Select features for model
    feature_columns = [
        'RevolvingUtilizationOfUnsecuredLines',
        'age',
        'NumberOfTime30-59DaysPastDueNotWorse',
        'DebtToIncomeRatio',
        'MonthlyIncome',
        'NumberOfOpenCreditLinesAndLoans',
        'NumberOfTimes90DaysLate',
        'NumberRealEstateLoansOrLines',
        'NumberOfTime60-89DaysPastDueNotWorse',
        'NumberOfDependents',
        'DebtRatio_Capped',
        'TotalCreditLines',
        'UtilizationRate',
        'LatePaymentRisk'
    ]
    
    X = df[feature_columns]
    y = df['SeriousDlqin2yrs']
    
    print(f"✓ Features: {len(feature_columns)}")
    print(f"✓ Samples: {len(X):,}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\n📊 Data Split:")
    print(f"  Training: {len(X_train):,} samples")
    print(f"  Testing: {len(X_test):,} samples")
    
    # Scale features
    print("\n⚙️  Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    print("\n🤖 Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=20,
        min_samples_leaf=10,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train_scaled, y_train)
    print("✓ Model trained successfully!")
    
    # Evaluate model
    print("\n📈 Evaluating model...")
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    # Metrics
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    print(f"\n🎯 Model Performance:")
    print(f"  ROC-AUC Score: {roc_auc:.4f}")
    
    print("\n📊 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['No Default', 'Default']))
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\n📉 Confusion Matrix:")
    print(f"  True Negatives: {cm[0][0]:,}")
    print(f"  False Positives: {cm[0][1]:,}")
    print(f"  False Negatives: {cm[1][0]:,}")
    print(f"  True Positives: {cm[1][1]:,}")
    
    # Feature Importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n🔍 Top 10 Most Important Features:")
    for idx, row in feature_importance.head(10).iterrows():
        print(f"  {row['feature']}: {row['importance']:.4f}")
    
    # Save model and scaler
    model_dir = Path('public/models')
    model_dir.mkdir(parents=True, exist_ok=True)
    
    with open(model_dir / 'model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    with open(model_dir / 'scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save feature names and importance
    model_info = {
        'features': feature_columns,
        'feature_importance': feature_importance.to_dict('records'),
        'roc_auc_score': float(roc_auc),
        'test_samples': int(len(X_test))
    }
    
    with open(model_dir / 'model_info.json', 'w') as f:
        json.dump(model_info, f, indent=2)
    
    print(f"\n✅ Model saved to: {model_dir}")
    print(f"   - model.pkl")
    print(f"   - scaler.pkl")
    print(f"   - model_info.json")

if __name__ == "__main__":
    train_model()
