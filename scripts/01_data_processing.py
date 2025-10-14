"""
Data Processing Pipeline for Loan Default Prediction
Loads, cleans, and prepares the cs-training.csv dataset
"""

import pandas as pd
import numpy as np
from pathlib import Path

def load_and_clean_data():
    """Load and perform initial data cleaning"""
    
    # Note: Users should place cs-training.csv in the /public/data/ folder
    data_path = Path('public/data/cs-training.csv')
    
    if not data_path.exists():
        print("⚠️  Dataset not found!")
        print("Please download cs-training.csv from:")
        print("https://www.kaggle.com/c/GiveMeSomeCredit/data")
        print("And place it in: public/data/cs-training.csv")
        return None
    
    # Load dataset
    df = pd.read_csv(data_path)
    print(f"✓ Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")
    
    # Display basic info
    print("\n📊 Dataset Overview:")
    print(df.head())
    print("\n📈 Column Info:")
    print(df.info())
    print("\n📉 Missing Values:")
    print(df.isnull().sum())
    
    # Remove unnamed index column if exists
    if 'Unnamed: 0' in df.columns:
        df = df.drop('Unnamed: 0', axis=1)
    
    # Handle missing values
    print("\n🔧 Cleaning data...")
    
    # MonthlyIncome: fill with median
    if df['MonthlyIncome'].isnull().sum() > 0:
        median_income = df['MonthlyIncome'].median()
        df['MonthlyIncome'].fillna(median_income, inplace=True)
        print(f"  - Filled {df['MonthlyIncome'].isnull().sum()} missing MonthlyIncome values with median: ${median_income:,.2f}")
    
    # NumberOfDependents: fill with 0 (assuming no dependents if not reported)
    if df['NumberOfDependents'].isnull().sum() > 0:
        df['NumberOfDependents'].fillna(0, inplace=True)
        print(f"  - Filled missing NumberOfDependents with 0")
    
    # Remove outliers (age > 100 or age < 18)
    original_size = len(df)
    df = df[(df['age'] >= 18) & (df['age'] <= 100)]
    print(f"  - Removed {original_size - len(df)} outlier records (age)")
    
    # Feature Engineering
    print("\n⚙️  Engineering features...")
    
    # Debt-to-Income Ratio
    df['DebtRatio_Capped'] = df['DebtToIncomeRatio'].clip(upper=df['DebtToIncomeRatio'].quantile(0.95))
    
    # Total Credit Lines
    df['TotalCreditLines'] = (df['NumberOfOpenCreditLinesAndLoans'] + 
                               df['NumberRealEstateLoansOrLines'])
    
    # Utilization Rate (how much of available credit is being used)
    df['UtilizationRate'] = df['RevolvingUtilizationOfUnsecuredLines'].clip(upper=1.5)
    
    # Age groups
    df['AgeGroup'] = pd.cut(df['age'], bins=[0, 25, 35, 45, 55, 65, 100], 
                            labels=['18-25', '26-35', '36-45', '46-55', '56-65', '65+'])
    
    # Risk score based on late payments
    df['LatePaymentRisk'] = (
        df['NumberOfTime30-59DaysPastDueNotWorse'] * 1 +
        df['NumberOfTime60-89DaysPastDueNotWorse'] * 2 +
        df['NumberOfTimes90DaysLate'] * 3
    )
    
    print(f"  - Created 5 new features")
    
    # Save cleaned data
    output_path = Path('public/data/cleaned_data.csv')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"\n✅ Cleaned data saved to: {output_path}")
    print(f"Final dataset: {df.shape[0]} rows, {df.shape[1]} columns")
    
    # Display class distribution
    print("\n📊 Target Variable Distribution:")
    print(df['SeriousDlqin2yrs'].value_counts())
    print(f"Default Rate: {df['SeriousDlqin2yrs'].mean()*100:.2f}%")
    
    return df

if __name__ == "__main__":
    df = load_and_clean_data()
