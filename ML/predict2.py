# import pandas as pd
# import numpy as np
# import joblib

# from sklearn.metrics import mean_absolute_error, mean_squared_error


# rf = joblib.load("rf_model.pkl")
# xgb = joblib.load("xgb_model.pkl")
# gb = joblib.load("gb_model.pkl")
# meta = joblib.load("meta_model.pkl")
# scaler = joblib.load("scaler.pkl")


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


# profiles = [

# {
# "name":"Athlete",
# "age":25,"sleep_hours":8,"sleep_quality":2,"smoker":0,"alcohol":0,
# "exercise_minutes":90,"daily_steps":15000,"diet_quality":2,"water_intake":3,
# "stress_level":0,"bmi":21,"resting_hr":55,"systolic_bp":108,"diastolic_bp":68,
# "cholesterol":160,"glucose":85,"oxygen_saturation":99,"family_history":0,
# "inflammation_index":1
# },

# {
# "name":"Healthy Adult",
# "age":30,"sleep_hours":7.5,"sleep_quality":2,"smoker":0,"alcohol":1,
# "exercise_minutes":45,"daily_steps":9000,"diet_quality":1,"water_intake":2.5,
# "stress_level":1,"bmi":23,"resting_hr":62,"systolic_bp":115,"diastolic_bp":75,
# "cholesterol":175,"glucose":90,"oxygen_saturation":98,"family_history":0,
# "inflammation_index":2
# },

# {
# "name":"Office Worker",
# "age":35,"sleep_hours":6.5,"sleep_quality":1,"smoker":0,"alcohol":1,
# "exercise_minutes":20,"daily_steps":6000,"diet_quality":1,"water_intake":2,
# "stress_level":2,"bmi":26,"resting_hr":72,"systolic_bp":125,"diastolic_bp":82,
# "cholesterol":200,"glucose":95,"oxygen_saturation":97,"family_history":1,
# "inflammation_index":3
# },

# {
# "name":"Smoker",
# "age":40,"sleep_hours":6,"sleep_quality":1,"smoker":1,"alcohol":1,
# "exercise_minutes":15,"daily_steps":5000,"diet_quality":0,"water_intake":1.8,
# "stress_level":2,"bmi":27,"resting_hr":80,"systolic_bp":135,"diastolic_bp":88,
# "cholesterol":220,"glucose":105,"oxygen_saturation":96,"family_history":1,
# "inflammation_index":4
# },

# {
# "name":"Obese",
# "age":45,"sleep_hours":6,"sleep_quality":1,"smoker":0,"alcohol":1,
# "exercise_minutes":10,"daily_steps":4000,"diet_quality":0,"water_intake":1.5,
# "stress_level":2,"bmi":32,"resting_hr":85,"systolic_bp":140,"diastolic_bp":90,
# "cholesterol":240,"glucose":115,"oxygen_saturation":96,"family_history":1,
# "inflammation_index":5
# },

# {
# "name":"Active Senior",
# "age":65,"sleep_hours":7,"sleep_quality":2,"smoker":0,"alcohol":0,
# "exercise_minutes":40,"daily_steps":8000,"diet_quality":2,"water_intake":2.5,
# "stress_level":1,"bmi":24,"resting_hr":65,"systolic_bp":120,"diastolic_bp":78,
# "cholesterol":185,"glucose":95,"oxygen_saturation":98,"family_history":0,
# "inflammation_index":2
# }

# ]


# true_vals = []
# pred_vals = []

# print("\nBIOLOGICAL AGE PREDICTIONS\n")

# for p in profiles:

#     age = p["age"]

#     input_data = {k:p[k] for k in features}

#     df = pd.DataFrame([input_data])

#     scaled = scaler.transform(df)

#     rf_p = rf.predict(scaled)
#     xgb_p = xgb.predict(scaled)
#     gb_p = gb.predict(scaled)

#     stack = np.column_stack((rf_p,xgb_p,gb_p))

#     acc = meta.predict(stack)[0]

#     bio_age = age + acc

#     true_vals.append(age)
#     pred_vals.append(bio_age)

#     print("Profile:",p["name"])
#     print("Chronological Age:",age)
#     print("Predicted Biological Age:",round(bio_age,2))
#     print("Age Acceleration:",round(acc,2))
#     print("-"*40)


# mae = mean_absolute_error(true_vals,pred_vals)
# rmse = np.sqrt(mean_squared_error(true_vals,pred_vals))

# print("\nEvaluation Metrics")
# print("MAE:",round(mae,2),"years")
# print("RMSE:",round(rmse,2),"years")

import pandas as pd
import numpy as np
import joblib

rf = joblib.load("rf_model.pkl")
xgb = joblib.load("xgb_model.pkl")
gb = joblib.load("gb_model.pkl")
meta = joblib.load("meta_model.pkl")
scaler = joblib.load("scaler.pkl")

features = [
"sleep_hours","sleep_quality","smoker","alcohol","exercise_minutes",
"daily_steps","diet_quality","water_intake","stress_level","bmi",
"resting_hr","systolic_bp","diastolic_bp","cholesterol","glucose",
"oxygen_saturation","family_history","inflammation_index"
]

profiles = [
{"name":"Athlete","age":25,"sleep_hours":8,"sleep_quality":2,"smoker":0,"alcohol":0,"exercise_minutes":90,"daily_steps":15000,"diet_quality":2,"water_intake":3,"stress_level":0,"bmi":21,"resting_hr":55,"systolic_bp":108,"diastolic_bp":68,"cholesterol":160,"glucose":85,"oxygen_saturation":99,"family_history":0,"inflammation_index":1},
{"name":"Healthy Adult","age":30,"sleep_hours":7.5,"sleep_quality":2,"smoker":0,"alcohol":1,"exercise_minutes":45,"daily_steps":9000,"diet_quality":1,"water_intake":2.5,"stress_level":1,"bmi":23,"resting_hr":62,"systolic_bp":115,"diastolic_bp":75,"cholesterol":175,"glucose":90,"oxygen_saturation":98,"family_history":0,"inflammation_index":2},
{"name":"Office Worker","age":35,"sleep_hours":6.5,"sleep_quality":1,"smoker":0,"alcohol":1,"exercise_minutes":20,"daily_steps":6000,"diet_quality":1,"water_intake":2,"stress_level":2,"bmi":26,"resting_hr":72,"systolic_bp":125,"diastolic_bp":82,"cholesterol":200,"glucose":95,"oxygen_saturation":97,"family_history":1,"inflammation_index":3},
{"name":"Smoker","age":40,"sleep_hours":6,"sleep_quality":1,"smoker":1,"alcohol":1,"exercise_minutes":15,"daily_steps":5000,"diet_quality":0,"water_intake":1.8,"stress_level":2,"bmi":27,"resting_hr":80,"systolic_bp":135,"diastolic_bp":88,"cholesterol":220,"glucose":105,"oxygen_saturation":96,"family_history":1,"inflammation_index":4},
{"name":"Obese","age":45,"sleep_hours":6,"sleep_quality":1,"smoker":0,"alcohol":1,"exercise_minutes":10,"daily_steps":4000,"diet_quality":0,"water_intake":1.5,"stress_level":2,"bmi":32,"resting_hr":85,"systolic_bp":140,"diastolic_bp":90,"cholesterol":240,"glucose":115,"oxygen_saturation":96,"family_history":1,"inflammation_index":5},
{"name":"Active Senior","age":65,"sleep_hours":7,"sleep_quality":2,"smoker":0,"alcohol":0,"exercise_minutes":40,"daily_steps":8000,"diet_quality":2,"water_intake":2.5,"stress_level":1,"bmi":24,"resting_hr":65,"systolic_bp":120,"diastolic_bp":78,"cholesterol":185,"glucose":95,"oxygen_saturation":98,"family_history":0,"inflammation_index":2}
]

log_lines = []
log_lines.append("BIOLOGICAL AGE PREDICTIONS\n")

for p in profiles:
    age = p["age"]
    input_data = {k: p[k] for k in features}
    df = pd.DataFrame([input_data])
    scaled = scaler.transform(df.values)

    rf_p = rf.predict(scaled)
    xgb_p = xgb.predict(scaled)
    gb_p = gb.predict(scaled)

    stack = np.column_stack((rf_p, xgb_p, gb_p))
    acc = meta.predict(stack)[0]
    bio_age = age + acc

    log_lines.append(f"Profile: {p['name']}")
    log_lines.append(f"Chronological Age: {age}")
    log_lines.append(f"Predicted Biological Age: {round(bio_age,2)}")
    log_lines.append(f"Age Acceleration: {round(acc,2)}")
    log_lines.append("-" * 40)

with open("logs.txt", "a") as f:
    f.write("\n--- NEW RUN ---\n")
    for line in log_lines:
        f.write(line + "\n")