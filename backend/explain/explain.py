def explain_prediction(transaction: dict) -> list:
    """
    Generate simple explanations for why a transaction was considered risky.

    Args:
        transaction: Dictionary containing transaction features

    Returns:
        List of explanation strings (max 3)
    """
    reasons = []

    if transaction["amount"] > 5000:
        reasons.append("High transaction amount")

    if transaction["merchant_risk"] > 0.8:
        reasons.append("High-risk merchant")

    if transaction["is_foreign"]:
        reasons.append("Foreign transaction")

    if transaction["device_trust"] < 0.3:
        reasons.append("Low device trust")

    if transaction["previous_fraud"]:
        reasons.append("Previous fraud history")

    if transaction["transaction_velocity"] > 10:
        reasons.append("High transaction velocity")

    if len(reasons) == 0:
        reasons.append("Transaction appears normal")

    return reasons[:3]