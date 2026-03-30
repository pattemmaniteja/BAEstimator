# import pandas as pd
# import numpy as np
# import joblib

# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import StandardScaler
# from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
# from sklearn.linear_model import Ridge
# from xgboost import XGBRegressor


# df = pd.read_csv("synthetic_biological_age_dataset_50k.csv")

# df["age_acceleration"] = df["biological_age"] - df["age"]

# features = [
# "sleep_hours",
# "sleep_quality",
# "smoker",
# "alcohol",
# "exercise_minutes",
# "daily_steps",
# "diet_quality",
# "water_intake",
# "stress_level",
# "bmi",
# "resting_hr",
# "systolic_bp",
# "diastolic_bp",
# "cholesterol",
# "glucose",
# "oxygen_saturation",
# "family_history",
# "inflammation_index"
# ]

# X = df[features]
# y = df["age_acceleration"]

# X_train,X_test,y_train,y_test = train_test_split(
# X,y,test_size=0.2,random_state=42
# )

# scaler = StandardScaler()

# X_train = scaler.fit_transform(X_train)
# X_test = scaler.transform(X_test)

# rf = RandomForestRegressor(
# n_estimators=300,
# max_depth=12,
# random_state=42,
# n_jobs=-1
# )

# xgb = XGBRegressor(
# n_estimators=600,
# learning_rate=0.03,
# max_depth=6,
# subsample=0.9,
# colsample_bytree=0.9,
# random_state=42,
# n_jobs=-1
# )

# gb = GradientBoostingRegressor(
# n_estimators=400,
# learning_rate=0.04,
# max_depth=4,
# random_state=42
# )

# rf.fit(X_train,y_train)
# xgb.fit(X_train,y_train)
# gb.fit(X_train,y_train)

# rf_pred = rf.predict(X_test)
# xgb_pred = xgb.predict(X_test)
# gb_pred = gb.predict(X_test)

# stack_train = np.column_stack((rf_pred,xgb_pred,gb_pred))

# meta = Ridge()

# meta.fit(stack_train,y_test)

# final_pred = meta.predict(stack_train)

# r2 = r2_score(y_test,final_pred)
# mae = mean_absolute_error(y_test,final_pred)
# rmse = np.sqrt(mean_squared_error(y_test,final_pred))

# print("\nMODEL PERFORMANCE")
# print("R2 Score:",round(r2,3))
# print("MAE:",round(mae,2))
# print("RMSE:",round(rmse,2))

# X_all = scaler.transform(X)

# rf_all = rf.predict(X_all)
# xgb_all = xgb.predict(X_all)
# gb_all = gb.predict(X_all)

# stack_all = np.column_stack((rf_all,xgb_all,gb_all))

# final_all = meta.predict(stack_all)

# df["rf_prediction"] = rf_all
# df["xgb_prediction"] = xgb_all
# df["gb_prediction"] = gb_all
# df["stack_prediction"] = final_all

# df.to_csv("computed.csv",index=False)

# joblib.dump(rf,"rf_model.pkl")
# joblib.dump(xgb,"xgb_model.pkl")
# joblib.dump(gb,"gb_model.pkl")
# joblib.dump(meta,"meta_model.pkl")
# joblib.dump(scaler,"scaler.pkl")

# print("\nDataset with predictions saved as computed.csv")
# print("Models saved successfully")

import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, KFold
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge
from xgboost import XGBRegressor


df = pd.read_csv("synthetic_biological_age_dataset_50k.csv")

df["age_acceleration"] = df["biological_age"] - df["age"]

features = [
    "sleep_hours","sleep_quality","smoker","alcohol","exercise_minutes",
    "daily_steps","diet_quality","water_intake","stress_level","bmi",
    "resting_hr","systolic_bp","diastolic_bp","cholesterol","glucose",
    "oxygen_saturation","family_history","inflammation_index"
]

X = df[features].values
y = df["age_acceleration"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

rf = RandomForestRegressor(n_estimators=300, max_depth=12, random_state=42, n_jobs=-1)

xgb = XGBRegressor(
    n_estimators=600,
    learning_rate=0.03,
    max_depth=6,
    subsample=0.9,
    colsample_bytree=0.9,
    random_state=42,
    n_jobs=-1
)

gb = GradientBoostingRegressor(
    n_estimators=400,
    learning_rate=0.04,
    max_depth=4,
    random_state=42
)

kf = KFold(n_splits=5, shuffle=True, random_state=42)

oof_rf = np.zeros(len(X_train))
oof_xgb = np.zeros(len(X_train))
oof_gb = np.zeros(len(X_train))

for train_idx, val_idx in kf.split(X_train):
    X_tr, X_val = X_train[train_idx], X_train[val_idx]
    y_tr, y_val = y_train[train_idx], y_train[val_idx]

    rf.fit(X_tr, y_tr)
    xgb.fit(X_tr, y_tr)
    gb.fit(X_tr, y_tr)

    oof_rf[val_idx] = rf.predict(X_val)
    oof_xgb[val_idx] = xgb.predict(X_val)
    oof_gb[val_idx] = gb.predict(X_val)

stack_train = np.column_stack((oof_rf, oof_xgb, oof_gb))

meta = Ridge()
meta.fit(stack_train, y_train)

rf.fit(X_train, y_train)
xgb.fit(X_train, y_train)
gb.fit(X_train, y_train)

rf_test = rf.predict(X_test)
xgb_test = xgb.predict(X_test)
gb_test = gb.predict(X_test)

stack_test = np.column_stack((rf_test, xgb_test, gb_test))

final_pred = meta.predict(stack_test)

r2 = r2_score(y_test, final_pred)
mae = mean_absolute_error(y_test, final_pred)
rmse = np.sqrt(mean_squared_error(y_test, final_pred))

X_all = scaler.transform(X)

rf_all = rf.predict(X_all)
xgb_all = xgb.predict(X_all)
gb_all = gb.predict(X_all)

stack_all = np.column_stack((rf_all, xgb_all, gb_all))
final_all = meta.predict(stack_all)

df["rf_prediction"] = rf_all
df["xgb_prediction"] = xgb_all
df["gb_prediction"] = gb_all
df["stack_prediction"] = final_all

df.to_csv("computed.csv", index=False)

joblib.dump(rf, "rf_model.pkl")
joblib.dump(xgb, "xgb_model.pkl")
joblib.dump(gb, "gb_model.pkl")
joblib.dump(meta, "meta_model.pkl")
joblib.dump(scaler, "scaler.pkl")

log_lines = []
log_lines.append("MODEL PERFORMANCE")
log_lines.append(f"R2 Score: {round(r2,3)}")
log_lines.append(f"MAE: {round(mae,2)}")
log_lines.append(f"RMSE: {round(rmse,2)}")
log_lines.append("")
log_lines.append("Dataset saved as computed.csv")
log_lines.append("Models saved successfully")

with open("logs.txt", "w") as f:
    for line in log_lines:
        f.write(line + "\n")