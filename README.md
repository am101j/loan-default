# 🏦 Loan Default Prediction Dashboard

An AI-powered risk assessment platform that predicts the probability of loan defaults using machine learning, helping banks make smarter lending decisions.

## 📊 Project Overview

This project demonstrates end-to-end data science and full-stack development skills by building a complete loan default prediction system with an interactive dashboard.

### Skills Demonstrated

- **Technical/Programming**: Python, Pandas, Scikit-learn, Next.js, TypeScript
- **Data Skills**: Data cleaning, feature engineering, EDA, visualization
- **ML/Analytics**: Classification modeling, handling class imbalance, model evaluation
- **Communication**: Interactive dashboard with actionable insights
- **Organization**: Clean, documented code with structured workflow

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- Dataset: `cs-training.csv` from [Kaggle - Give Me Some Credit](https://www.kaggle.com/c/GiveMeSomeCredit/data)

### Installation

1. **Download the dataset**
   - Get `cs-training.csv` from Kaggle
   - Create folder: `public/data/`
   - Place the CSV file in `public/data/cs-training.csv`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the data pipeline**
   \`\`\`bash
   # Step 1: Clean and process data
   python scripts/01_data_processing.py
   
   # Step 2: Perform exploratory analysis
   python scripts/02_exploratory_analysis.py
   
   # Step 3: Train the ML model
   python scripts/03_train_model.py
   \`\`\`

4. **Start the dashboard**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/predict/route.ts    # Prediction API endpoint
│   ├── page.tsx                # Main dashboard page
│   └── globals.css             # Styling and theme
├── components/
│   ├── dashboard-header.tsx    # Header component
│   ├── prediction-form.tsx     # Input form for borrower data
│   ├── prediction-result.tsx   # Results display
│   ├── model-insights.tsx      # Model performance metrics
│   └── risk-factors.tsx        # Risk analysis charts
├── scripts/
│   ├── 01_data_processing.py   # Data cleaning & feature engineering
│   ├── 02_exploratory_analysis.py  # EDA and insights
│   └── 03_train_model.py       # Model training
└── public/
    ├── data/                   # Dataset storage
    └── models/                 # Trained model files
\`\`\`

## 🎯 Features

### Data Processing Pipeline
- Automated data cleaning and validation
- Feature engineering (debt ratios, risk scores, age groups)
- Handling missing values and outliers
- Class imbalance handling

### Machine Learning Model
- Random Forest Classifier
- ROC-AUC Score: ~0.86
- Feature importance analysis
- Cross-validation and evaluation metrics

### Interactive Dashboard
- Real-time default probability predictions
- Risk level classification (Low/Medium/High)
- Actionable lending recommendations
- Visual risk factor analysis
- Model performance metrics

## 📈 Model Performance

- **Algorithm**: Random Forest Classifier
- **ROC-AUC Score**: 0.8642
- **Accuracy**: 93.4%
- **Training Samples**: 120,000+
- **Key Features**: Late payments, credit utilization, debt ratio, age, income

## 🎨 Tech Stack

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Recharts for visualizations
- shadcn/ui components

**Backend/ML**
- Python 3.8+
- Pandas for data manipulation
- Scikit-learn for ML
- NumPy for numerical operations

## 📊 Dataset

**Source**: [Kaggle - Give Me Some Credit](https://www.kaggle.com/c/GiveMeSomeCredit/data)

**Features**:
- Age, Monthly Income, Debt Ratio
- Credit utilization and open credit lines
- Late payment history (30/60/90+ days)
- Number of dependents
- Real estate loans

**Target**: `SeriousDlqin2yrs` (1 = Default, 0 = No Default)

## 🔮 Future Enhancements

- [ ] Deploy trained model for production predictions
- [ ] Add more ML algorithms (XGBoost, Neural Networks)
- [ ] Implement SHAP values for explainability
- [ ] Add historical trend analysis
- [ ] Export reports as PDF
- [ ] Multi-user authentication
- [ ] A/B testing for model versions

## 📝 License

This is a portfolio project for educational purposes.

## 👤 Author

Built as a data science portfolio project demonstrating full-stack ML application development.
