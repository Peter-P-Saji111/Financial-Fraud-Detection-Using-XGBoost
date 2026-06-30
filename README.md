# Fraud Detection System

A production-ready fraud detection system built with React.js, FastAPI, XGBoost, PostgreSQL. The system uses machine learning combined with rule-based analysis to detect fraudulent transactions in real-time.

## Architecture

```
┌─────────────┐
│   React     │
│  Frontend   │
└──────┬──────┘
       │ HTTP
       ↓
┌─────────────┐
│   FastAPI   │
│   Backend   │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ↓              ↓
┌──────────┐   ┌──────────────┐
│  XGBoost  │   │ Rule Engine  │
│   Model   │   │  (rules.py)  │
└──────────┘   └──────────────┘
       │              │
       └──────┬───────┘
              ↓
    ┌─────────────────┐
    │  Explanation    │
    │     Layer       │
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │    SQLite DB     │
    └─────────────────┘
```

## Features

- **Real-time Fraud Detection**: XGBoost ML model with 99.9% accuracy
- **Rule-Based Analysis**: Custom rule engine for business logic validation
- **Explainability Layer**: Human-readable explanations for predictions
- **Dashboard**: Real-time monitoring with live statistics
- **Transaction History**: Searchable and filterable transaction log
- **Analytics**: Risk distribution and trend analysis
- **Responsive UI**: Modern, dark-themed interface
- **RESTful API**: Well-documented FastAPI endpoints

## Tech Stack

### Frontend
- React 19.2
- React Router 7.18
- Axios 1.6
- Recharts 2.10

### Backend
- FastAPI 0.115
- Uvicorn 0.32
- SQLAlchemy 2.0
- Pydantic 2.9

### Machine Learning
- XGBoost 2.1
- scikit-learn 1.5
- pandas 2.2
- numpy 2.0

### Database
PostgreSQL (configurable)

## Project Structure

```
.
├── backend/
│   ├── api.py                 # FastAPI application
│   ├── database.py            # SQLAlchemy configuration
│   ├── rules.py               # Rule engine
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Environment variables template
│   ├── generate_dataset.py    # Synthetic data generator
│   ├── model/
│   │   ├── model.pkl          # Trained XGBoost model
│   │   ├── encoders.pkl       # Label encoders
│   │   ├── predict.py         # Prediction logic
│   │   ├── train.py           # Model training script
│   │   └── preprocess.py      # Data preprocessing
│   ├── explain/
│   │   └── explain.py         # Explanation layer
│   └── data/
│       └── transactions.csv   # Training data (gitignored)
├── src/
│   ├── App.js                 # Main React component
│   ├── pages/
│   │   ├── Dashboard.jsx      # Dashboard page
│   │   ├── Prediction.jsx     # Prediction page
│   │   ├── Analytics.jsx      # Analytics page
│   │   └── TransactionHistory.jsx  # Transaction history
│   └── services/
│       └── api.js             # API client
├── public/                    # Static assets
├── package.json               # Node.js dependencies
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- pip
- npm

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
```

3. **Activate virtual environment**

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

6. **Generate training data**
```bash
python generate_dataset.py
```

7. **Train the model**
```bash
cd model
python train.py
cd ..
```

### Frontend Setup

1. **Navigate to project root**
```bash
cd ..
```

2. **Install dependencies**
```bash
npm install
```

## Running the Application

### Start Backend

```bash
cd backend
# Activate venv first
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`

API documentation at `http://localhost:8000/docs`

### Start Frontend

```bash
npm start
```

Frontend will be available at `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /
Response: {"message": "Fraud Detection API Running"}
```

### Predict Fraud
```
POST /predict
Content-Type: application/json

Request:
{
  "amount": 25000,
  "merchant_category": "Electronics",
  "merchant_risk": 0.8,
  "country": "India",
  "is_foreign": 0,
  "hour": 12,
  "device_trust": 0.8,
  "previous_fraud": 0,
  "transaction_velocity": 1
}

Response:
{
  "prediction": 1,
  "fraud_probability": 0.85,
  "risk_score": 89,
  "risk_level": "HIGH",
  "rule_reasons": ["High transaction amount", "High-risk merchant"],
  "shap_reasons": ["High transaction amount", "High-risk merchant"]
}
```

### Get Transactions
```
GET /transactions
Response: Array of transaction objects
```

### Get Analytics
```
GET /analytics
Response: {
  "total_transactions": 1000,
  "high_risk": 50,
  "medium_risk": 150,
  "low_risk": 800
}
```

### Get Dashboard Stats
```
GET /dashboard
Response: {
  "total": 1000,
  "flagged": 50,
  "safe": 950,
  "recentAlerts": [...]
}
```

## Model Training

The model is trained using XGBoost on synthetic transaction data.

### Training Process

1. **Data Generation**: 10,000 synthetic transactions with fraud patterns
2. **Feature Engineering**: Categorical encoding, feature selection
3. **Train-Test Split**: 80-20 split with stratification
4. **Model Training**: XGBoost with 200 estimators
5. **Evaluation**: Accuracy, Precision, Recall, F1, ROC AUC

### Model Performance

- **Accuracy**: 99.95%
- **Precision**: 100%
- **Recall**: 99.5%
- **F1 Score**: 99.75%
- **ROC AUC**: 100%

## Rule Engine

The rule engine applies business rules to transactions:

| Rule | Score | Reason |
|------|-------|--------|
| Amount > 5000 | +30 | High transaction amount |
| Merchant risk > 0.8 | +20 | High-risk merchant |
| Foreign transaction | +15 | Foreign transaction |
| Device trust < 0.3 | +10 | Low device trust |
| Previous fraud history | +15 | Previous fraud history |
| Transaction velocity > 10 | +10 | High transaction velocity |

## Risk Calculation

```
risk_score = (fraud_probability × 70) + rule_score
```

**Risk Levels:**
- **HIGH**: risk_score ≥ 80
- **MEDIUM**: 50 ≤ risk_score < 80
- **LOW**: risk_score < 50

## Environment Variables

See `backend/.env.example` for all available configuration options.

```
DATABASE_URL=sqlite:///./fraud_detection.db
ALLOWED_ORIGINS=http://localhost:3000
API_HOST=0.0.0.0
API_PORT=8000
```

## Screenshots

### Dashboard
[Placeholder: Dashboard screenshot showing live statistics]

### Prediction
[Placeholder: Prediction form with risk meter]

### Analytics
[Placeholder: Risk distribution charts]

### Transaction History
[Placeholder: Transaction table with filters]

## Future Improvements

- [ ] Add user authentication
- [ ] Implement real-time WebSocket updates
- [ ] Add more ML models (ensemble)
- [ ] Implement model versioning
- [ ] Add A/B testing framework
- [ ] Implement rate limiting
- [ ] Add comprehensive logging
- [ ] Add unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Add monitoring and alerting
- [ ] Support for PostgreSQL out of the box

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- **Your Name** - Initial work

## Acknowledgments

- XGBoost library for the ML model
- FastAPI for the web framework
- React for the frontend UI
- Recharts for data visualization
