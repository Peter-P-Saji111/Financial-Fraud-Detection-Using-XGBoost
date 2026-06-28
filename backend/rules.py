def apply_rules(transaction: dict) -> dict:
    """
    Apply rule-based fraud detection to a transaction.

    Args:
        transaction: Dictionary containing transaction features

    Returns:
        Dictionary with rule_score and list of reasons
    """
    score = 0
    reasons = []

    if transaction["amount"] > 5000:
        score += 30
        reasons.append("High transaction amount")

    if transaction["merchant_risk"] > 0.8:
        score += 20
        reasons.append("High-risk merchant")

    if transaction["is_foreign"]:
        score += 15
        reasons.append("Foreign transaction")

    if transaction["device_trust"] < 0.3:
        score += 10
        reasons.append("Low device trust")

    if transaction["previous_fraud"]:
        score += 15
        reasons.append("Previous fraud history")

    if transaction["transaction_velocity"] > 10:
        score += 10
        reasons.append("High transaction velocity")

    return {
        "rule_score": score,
        "reasons": reasons
    }