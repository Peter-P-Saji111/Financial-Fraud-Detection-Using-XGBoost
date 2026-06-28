import joblib
import pandas as pd

from rules import apply_rules

model = joblib.load("model/model.pkl")
encoders = joblib.load("model/encoders.pkl")


FEATURE_DESCRIPTIONS = {
    "amount": "High transaction amount",
    "merchant_risk": "High-risk merchant",
    "country": "Foreign transaction",
    "device_trust": "Low device trust",
    "previous_fraud": "Previous fraud history",
    "transaction_velocity": "High transaction velocity",
    "hour": "Unusual transaction time"
}


def predict(transaction):

    data = transaction.copy()

    # Handle unseen categories by using a default value
    try:
        data["merchant_category"] = encoders["merchant_category"].transform(
            [data["merchant_category"]]
        )[0]
    except ValueError:
        # If category not seen during training, use the most common one (index 0)
        data["merchant_category"] = 0

    try:
        data["country"] = encoders["country"].transform(
            [data["country"]]
        )[0]
    except ValueError:
        # If country not seen during training, use the most common one (index 0)
        data["country"] = 0

    df = pd.DataFrame([data])

    probability = float(model.predict_proba(df)[0][1])

    prediction = int(model.predict(df)[0])

    rule_result = apply_rules(transaction)
    rule_score = rule_result["rule_score"]
    rule_reasons = rule_result["reasons"]

    ml_score = probability * 100

    final_score = min(100, ml_score + rule_score)

    if final_score > 80:
        risk = "HIGH"
    elif final_score > 50:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "prediction": prediction,
        "fraud_probability": round(probability, 3),
        "risk_score": round(final_score),
        "risk_level": risk,
        "rule_reasons": rule_reasons,
        "shap_reasons": rule_reasons
    }