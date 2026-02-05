import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error

# -------------------- LOAD DATA --------------------
df = pd.read_csv(
    r"D:\MPS\MLAgeEstimator\balanced_dataset.csv"
)

# -------------------- STANDARDIZE COLUMN NAMES --------------------
df.columns = (
    df.columns.str.strip()
    .str.lower()
    .str.replace(" ", "_")
)

# FIX common typo
if "dialy_steps" in df.columns:
    df.rename(columns={"dialy_steps": "daily_steps"}, inplace=True)

# -------------------- SAFE ENCODING --------------------
df["smoker"] = df["smoker"].map({"Yes": 1, "No": 0}).fillna(df["smoker"])
df["alcohol"] = df["alcohol"].map({"Yes": 1, "No": 0}).fillna(df["alcohol"])
df["family_history"] = df["family_history"].map({"Yes": 1, "No": 0}).fillna(df["family_history"])

# df["stress_level"] = df["stress_level"].map({
#     "Low": 0, "Medium": 1, "High": 2
# })

df["sleep_quality"] = df["sleep_quality"].map({
    "Poor": 0, "Average": 1, "Good": 2
})

# -------------------- CONVERT TO NUMERIC --------------------
numeric_cols = [
    "age", "sleep_hours", "bmi", "resting_hr",
    "systolic_bp", "diastolic_bp", "cholesterol",
    "daily_steps", "water_intake",
    "sleep_quality",
    "smoker", "alcohol", "family_history"
]

for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# -------------------- HANDLE MISSING --------------------
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

# -------------------- HEALTH SCORE --------------------
# Higher Score = Better Health (Younger Biological Age)
df["health_score"] = (
    5 +                                     # Base Score
    df["sleep_quality"] * 1.5 +             # +0 to +3 (Good sleep improves score)
    (1 - df["smoker"]) * 2 +                # +2 if non-smoker
    (1 - df["alcohol"]) * 1 +               # +1 if non-drinker
    (df["daily_steps"] - 5000) / 2500 -     # Reward high steps, penalize low
    abs(df["bmi"] - 22) / 2.5 -             # Penalize BMI deviation
    (df["systolic_bp"] - 120) / 15 -        # Penalize High BP
    (df["cholesterol"] - 180) / 30          # Penalize High Cholesterol
)

df["health_score"] = df["health_score"].clip(0, 10)
df = df.dropna(subset=["health_score"])

# -------------------- FEATURES & TARGET --------------------
features = [
    "sleep_hours", "sleep_quality",
    "smoker", "alcohol", "bmi",
    "resting_hr", "systolic_bp", "diastolic_bp",
    "cholesterol", "daily_steps",
    "family_history", "water_intake"
]

X = df[features]
y = df["health_score"]

# -------------------- TRAIN TEST SPLIT --------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -------------------- MODEL --------------------
model = RandomForestRegressor(
    n_estimators=300,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# -------------------- EVALUATION --------------------
y_pred = model.predict(X_test)

print("Model R² Score:", round(r2_score(y_test, y_pred), 3))
print("Mean Absolute Error:", round(mean_absolute_error(y_test, y_pred), 2))

# -------------------- SAVE MODEL --------------------
joblib.dump(model, "health_model.pkl")
print("✅ Model saved successfully as health_model.pkl")
