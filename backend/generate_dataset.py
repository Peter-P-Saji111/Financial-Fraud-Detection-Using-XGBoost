import pandas as pd
import numpy as np

np.random.seed(42)

rows = 10000

merchant_categories = [
    "Grocery",
    "Electronics",
    "Fuel",
    "Restaurant",
    "Travel",
    "Shopping",
    "Entertainment",
    "Healthcare"
]

countries = [
    "India",
    "USA",
    "UAE",
    "Singapore",
    "UK"
]

data = []

for i in range(rows):

    amount = np.random.randint(100, 50000)

    merchant = np.random.choice(merchant_categories)

    merchant_risk = round(np.random.uniform(0, 1), 2)

    country = np.random.choice(
        countries,
        p=[0.75, 0.07, 0.06, 0.06, 0.06]
    )

    is_foreign = 0 if country == "India" else 1

    hour = np.random.randint(0, 24)

    device_trust = round(np.random.uniform(0, 1), 2)

    previous_fraud = np.random.choice([0, 1], p=[0.92, 0.08])

    transaction_velocity = np.random.randint(1, 15)

    fraud = 0

    # Fraud rules for generating labels
    if (
        amount > 20000
        and merchant_risk > 0.75
        and is_foreign == 1
    ):
        fraud = 1

    elif (
        device_trust < 0.30
        and previous_fraud == 1
    ):
        fraud = 1

    elif (
        transaction_velocity > 10
        and merchant_risk > 0.80
    ):
        fraud = 1

    data.append([
        i + 1,
        amount,
        merchant,
        merchant_risk,
        country,
        is_foreign,
        hour,
        device_trust,
        previous_fraud,
        transaction_velocity,
        fraud
    ])

columns = [
    "transaction_id",
    "amount",
    "merchant_category",
    "merchant_risk",
    "country",
    "is_foreign",
    "hour",
    "device_trust",
    "previous_fraud",
    "transaction_velocity",
    "fraud"
]

df = pd.DataFrame(data, columns=columns)

df.to_csv("data/transactions.csv", index=False)

print(df.head())
print(df["fraud"].value_counts())