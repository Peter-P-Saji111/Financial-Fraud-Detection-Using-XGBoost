"""
preprocess.py
─────────────
Handles all data loading, cleaning, feature engineering,
class-imbalance handling (SMOTE), and train/test splitting.

Run standalone to verify the pipeline:
    python src/preprocess.py
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
import joblib
import os


# ── Feature columns used by the model ──────────────────────────────────────
FEATURE_COLS = [
    "log_amount",        # log-transformed transaction amount
    "hour",              # hour of day (0–23)
    "is_night",          # binary: 1 if hour is 10pm–6am
    "velocity_1h",       # no. of transactions in last 1 hour (same card)
    "merchant_risk",     # merchant category risk score (0–1)
    "country_risk",      # 0 = domestic, 1 = high-risk foreign
    "card_age_days",     # age of card in days
    "days_since_last_txn",  # days since last transaction on this card
    "address_match",     # 1 = billing address matched, 0 = mismatch
    "is_ecommerce",      # 1 = card-not-present / online transaction
    "prev_declined_24h", # no. of declined attempts in last 24 hours
    "risk_score",        # composite risk signal (engineered)
]

TARGET_COL = "is_fraud"


def load_data(path: str = "data/transactions.csv") -> pd.DataFrame:
    """Load transaction CSV. Generates synthetic data if file not found."""
    if os.path.exists(path):
        df = pd.read_csv(path)
        print(f"Loaded {len(df):,} transactions from {path}")
    else:
        print(f"{path} not found — generating synthetic dataset...")
        from data_generator import generate_fraud_dataset
        df = generate_fraud_dataset()
        os.makedirs("data", exist_ok=True)
        df.to_csv(path, index=False)
        print(f"Saved to {path}")
    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add/ensure all engineered features exist.
    Safe to call on raw generated data or on loaded CSVs.
    """
    df = df.copy()

    # Log-transform amount to reduce skew
    if "log_amount" not in df.columns:
        df["log_amount"] = np.log1p(df["amount"])

    # Binary night flag
    if "is_night" not in df.columns:
        df["is_night"] = df["hour"].apply(lambda h: 1 if (h < 6 or h >= 22) else 0)

    # Composite risk score: weighted blend of raw risk signals
    if "risk_score" not in df.columns:
        df["risk_score"] = (
            df["merchant_risk"]     * 0.40 +
            df["country_risk"]      * 0.30 +
            (df["velocity_1h"] / 20) * 0.20 +
            (df["prev_declined_24h"] / 3) * 0.10
        ).clip(0, 1)

    return df


def split_and_scale(
    df: pd.DataFrame,
    test_size: float = 0.20,
    apply_smote: bool = True,
    seed: int = 42,
):
    """
    Split into train/test, scale features, optionally apply SMOTE.

    Why SMOTE?
    ----------
    With 2% fraud rate, the model sees ~50x more legit examples than fraud.
    SMOTE (Synthetic Minority Over-sampling Technique) creates synthetic
    fraud samples in the training set ONLY — never touch test data.

    Returns:
        X_train, X_test, y_train, y_test, scaler
    """
    df = engineer_features(df)

    X = df[FEATURE_COLS].values
    y = df[TARGET_COL].values

    # Stratify ensures both splits maintain the 2% fraud ratio
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        stratify=y,
        random_state=seed,
    )

    print(f"\nTrain: {len(X_train):,} samples  |  Test: {len(X_test):,} samples")
    print(f"Train fraud rate: {y_train.mean()*100:.2f}%")

    # Scale features: zero mean, unit variance
    # CRITICAL: fit scaler on train only, transform both
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)   # ← no fit here — prevents data leakage

    if apply_smote:
        print("\nApplying SMOTE to training set...")
        before = np.bincount(y_train)
        smote = SMOTE(random_state=seed, k_neighbors=5)
        X_train, y_train = smote.fit_resample(X_train, y_train)
        after = np.bincount(y_train)
        print(f"  Before SMOTE — Legit: {before[0]:,}  Fraud: {before[1]:,}")
        print(f"  After  SMOTE — Legit: {after[0]:,}  Fraud: {after[1]:,}")

    return X_train, X_test, y_train, y_test, scaler


if __name__ == "__main__":
    df = load_data()
    X_train, X_test, y_train, y_test, scaler = split_and_scale(df)
    print("\nPreprocessing complete.")
    print(f"X_train shape: {X_train.shape}")
    print(f"X_test  shape: {X_test.shape}")
    print(f"Features: {FEATURE_COLS}")
