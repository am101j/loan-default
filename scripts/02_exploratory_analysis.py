"""
Exploratory Data Analysis
Generates insights and statistics about the loan dataset
"""

import pandas as pd
import numpy as np
from pathlib import Path
import json

def perform_eda():
    """Perform exploratory data analysis and save insights"""
    
    data_path = Path('public/data/cleaned_data.csv')
    
    if not data_path.exists():
        print("❌ Cleaned data not found. Please run 01_data_processing.py first")
        return
    
    df = pd.read_csv(data_path)
    print(f"✓ Loaded cleaned dataset: {df.shape[0]} rows")
    
    # Separate defaulters and non-defaulters
    defaulters = df[df['SeriousDlqin2yrs'] == 1]
    non_defaulters = df[df['SeriousDlqin2yrs'] == 0]
    
    print("\n📊 Key Statistics:")
    print(f"Total Borrowers: {len(df):,}")
    print(f"Defaulters: {len(defaulters):,} ({len(defaulters)/len(df)*100:.2f}%)")
    print(f"Non-Defaulters: {len(non_defaulters):,} ({len(non_defaulters)/len(df)*100:.2f}%)")
    
    # Risk factor analysis
    insights = {
        "total_borrowers": int(len(df)),
        "defaulters": int(len(defaulters)),
        "non_defaulters": int(len(non_defaulters)),
        "default_rate": float(len(defaulters)/len(df)*100),
        "risk_factors": []
    }
    
    print("\n🔍 Risk Factor Analysis:")
    
    # Age analysis
    avg_age_default = defaulters['age'].mean()
    avg_age_no_default = non_defaulters['age'].mean()
    print(f"\n  Age:")
    print(f"    Defaulters: {avg_age_default:.1f} years")
    print(f"    Non-Defaulters: {avg_age_no_default:.1f} years")
    
    insights["risk_factors"].append({
        "factor": "Age",
        "defaulter_avg": float(avg_age_default),
        "non_defaulter_avg": float(avg_age_no_default),
        "impact": "lower" if avg_age_default < avg_age_no_default else "higher"
    })
    
    # Debt Ratio analysis
    avg_debt_default = defaulters['DebtToIncomeRatio'].mean()
    avg_debt_no_default = non_defaulters['DebtToIncomeRatio'].mean()
    print(f"\n  Debt-to-Income Ratio:")
    print(f"    Defaulters: {avg_debt_default:.2f}")
    print(f"    Non-Defaulters: {avg_debt_no_default:.2f}")
    
    insights["risk_factors"].append({
        "factor": "Debt-to-Income Ratio",
        "defaulter_avg": float(avg_debt_default),
        "non_defaulter_avg": float(avg_debt_no_default),
        "impact": "higher" if avg_debt_default > avg_debt_no_default else "lower"
    })
    
    # Monthly Income analysis
    avg_income_default = defaulters['MonthlyIncome'].mean()
    avg_income_no_default = non_defaulters['MonthlyIncome'].mean()
    print(f"\n  Monthly Income:")
    print(f"    Defaulters: ${avg_income_default:,.2f}")
    print(f"    Non-Defaulters: ${avg_income_no_default:,.2f}")
    
    insights["risk_factors"].append({
        "factor": "Monthly Income",
        "defaulter_avg": float(avg_income_default),
        "non_defaulter_avg": float(avg_income_no_default),
        "impact": "lower" if avg_income_default < avg_income_no_default else "higher"
    })
    
    # Late Payments analysis
    avg_late_default = defaulters['NumberOfTimes90DaysLate'].mean()
    avg_late_no_default = non_defaulters['NumberOfTimes90DaysLate'].mean()
    print(f"\n  90+ Days Late Payments:")
    print(f"    Defaulters: {avg_late_default:.2f}")
    print(f"    Non-Defaulters: {avg_late_no_default:.2f}")
    
    insights["risk_factors"].append({
        "factor": "90+ Days Late",
        "defaulter_avg": float(avg_late_default),
        "non_defaulter_avg": float(avg_late_no_default),
        "impact": "higher" if avg_late_default > avg_late_no_default else "lower"
    })
    
    # Revolving Utilization analysis
    avg_util_default = defaulters['RevolvingUtilizationOfUnsecuredLines'].mean()
    avg_util_no_default = non_defaulters['RevolvingUtilizationOfUnsecuredLines'].mean()
    print(f"\n  Credit Utilization:")
    print(f"    Defaulters: {avg_util_default*100:.1f}%")
    print(f"    Non-Defaulters: {avg_util_no_default*100:.1f}%")
    
    insights["risk_factors"].append({
        "factor": "Credit Utilization",
        "defaulter_avg": float(avg_util_default*100),
        "non_defaulter_avg": float(avg_util_no_default*100),
        "impact": "higher" if avg_util_default > avg_util_no_default else "lower"
    })
    
    # Save insights
    output_path = Path('public/data/insights.json')
    with open(output_path, 'w') as f:
        json.dump(insights, f, indent=2)
    
    print(f"\n✅ Analysis complete! Insights saved to: {output_path}")

if __name__ == "__main__":
    perform_eda()
