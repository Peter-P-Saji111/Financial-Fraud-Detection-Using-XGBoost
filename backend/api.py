from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os

from model.predict import predict
from rules import apply_rules
from explain.explain import explain_prediction

from database import SessionLocal, Transaction, get_db

app = FastAPI(
    title="Fraud Detection API",
    description="Real-time fraud detection using XGBoost and rule-based analysis",
    version="1.0.0"
)

# CORS configuration - allow specific origins in production
# Comma-separated list of allowed origins
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Input Model
# -----------------------------

class TransactionInput(BaseModel):
    amount: float
    merchant_category: str
    merchant_risk: float
    country: str
    is_foreign: int
    hour: int
    device_trust: float
    previous_fraud: int
    transaction_velocity: int


# -----------------------------
# Home
# -----------------------------

@app.get("/")
def home():
    return {"message": "Fraud Detection API Running"}


# -----------------------------
# Predict Endpoint
# -----------------------------

@app.post("/predict")
def predict_transaction(data: TransactionInput):

    # Convert request into dictionary
    transaction = data.dict()

    # ---------------- ML Prediction ----------------

    try:
        ml_result = predict(transaction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    fraud_probability = ml_result["fraud_probability"]

    prediction = 1 if fraud_probability >= 0.5 else 0

    # ---------------- Rule Engine ----------------

    rule_result = apply_rules(transaction)

    rule_score = rule_result["rule_score"]

    rule_reasons = rule_result["reasons"]

    # ---------------- Final Risk ----------------

    risk_score = int(fraud_probability * 70 + rule_score)

    if risk_score > 100:
        risk_score = 100

    if risk_score >= 80:
        risk_level = "HIGH"
    elif risk_score >= 50:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # ---------------- SHAP ----------------

    shap_reasons = explain_prediction(transaction)

    # ---------------- Save to Database ----------------

    with get_db() as db:
        txn = Transaction(
            amount=data.amount,
            merchant_category=data.merchant_category,
            merchant_risk=data.merchant_risk,
            country=data.country,
            is_foreign=bool(data.is_foreign),
            hour=data.hour,
            device_trust=data.device_trust,
            previous_fraud=bool(data.previous_fraud),
            transaction_velocity=data.transaction_velocity,
            fraud_probability=fraud_probability,
            risk_score=risk_score,
            risk_level=risk_level,
        )

        db.add(txn)
        db.flush()  # Flush to get ID without committing
        db.refresh(txn)

    # ---------------- Response ----------------

    return {
        "prediction": prediction,
        "fraud_probability": fraud_probability,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "rule_reasons": rule_reasons,
        "shap_reasons": shap_reasons,
    }


# -----------------------------
# Transaction History
# -----------------------------

@app.get("/transactions")
def get_transactions():
    """Get all transactions from the database."""
    with get_db() as db:
        transactions = db.query(Transaction).all()

        results = []

        for t in transactions:
            results.append({
                "id": t.id,
                "amount": t.amount,
                "merchant_category": t.merchant_category,
                "fraud_probability": t.fraud_probability,
                "risk_score": t.risk_score,
                "risk_level": t.risk_level,
                "created_at": t.created_at
            })

        return results


# -----------------------------
# Dashboard Analytics
# -----------------------------

@app.get("/analytics")
def analytics():
    """Get analytics data for the dashboard."""
    with get_db() as db:
        total = db.query(Transaction).count()

        high = db.query(Transaction).filter(
            Transaction.risk_level == "HIGH"
        ).count()

        medium = db.query(Transaction).filter(
            Transaction.risk_level == "MEDIUM"
        ).count()

        low = db.query(Transaction).filter(
            Transaction.risk_level == "LOW"
        ).count()

        return {
            "total_transactions": total,
            "high_risk": high,
            "medium_risk": medium,
            "low_risk": low
        }


# -----------------------------
# Dashboard Cards
# -----------------------------

@app.get("/dashboard")
def dashboard():
    """Get dashboard statistics."""
    with get_db() as db:
        total = db.query(Transaction).count()

        flagged = db.query(Transaction).filter(
            Transaction.risk_level == "HIGH"
        ).count()

        safe = total - flagged

        alerts = db.query(Transaction).order_by(
            Transaction.id.desc()
        ).limit(5).all()

        recent = []

        for a in alerts:
            recent.append({
                "transaction_id": a.id,
                "risk_score": a.risk_score
            })

        return {
            "total": total,
            "flagged": flagged,
            "safe": safe,
            "recentAlerts": recent
        }