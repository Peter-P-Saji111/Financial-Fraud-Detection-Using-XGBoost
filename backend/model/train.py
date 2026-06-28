import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)

from xgboost import XGBClassifier

# ----------------------------
# Load Dataset
# ----------------------------
df = pd.read_csv("../data/transactions.csv")

print(df.head())

# ----------------------------
# Encode Categorical Columns
# ----------------------------
label_encoders = {}

categorical_cols = [
    "merchant_category",
    "country"
]

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# ----------------------------
# Features and Target
# ----------------------------
X = df.drop(["transaction_id", "fraud"], axis=1)
y = df["fraud"]

# ----------------------------
# Train-Test Split
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ----------------------------
# XGBoost Model
# ----------------------------
model = XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.1,
    random_state=42,
    eval_metric="logloss"
)

model.fit(X_train, y_train)

# ----------------------------
# Prediction
# ----------------------------
y_pred = model.predict(X_test)

y_prob = model.predict_proba(X_test)[:,1]

# ----------------------------
# Evaluation
# ----------------------------
print("\nModel Performance")
print("---------------------------")

print("Accuracy :", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall   :", recall_score(y_test, y_pred))
print("F1 Score :", f1_score(y_test, y_pred))
print("ROC AUC  :", roc_auc_score(y_test, y_prob))

print("\nConfusion Matrix")

print(confusion_matrix(y_test, y_pred))

# ----------------------------
# Save Model
# ----------------------------
joblib.dump(model, "model.pkl")

joblib.dump(label_encoders, "encoders.pkl")

print("\nModel Saved Successfully!")