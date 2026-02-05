import pandas as pd
import joblib

model = joblib.load("health_model.pkl")

def compute_biological_age(age, health_score):
    if age <= 25:
        max_diff = 1
    elif age <= 35:
        max_diff = 2
    elif age <= 50:
        max_diff = 4
    elif age <= 65:
        max_diff = 6
    else:
        max_diff = 8

    raw_bio_age = age + (5 - health_score) * 2
    return max(age - max_diff, min(age + max_diff, raw_bio_age))


profiles = {
    "good": {
        "age":20,
        "sleep_hours": 8, "sleep_quality": 2,
        "smoker": 0, "alcohol": 0, "bmi": 22, "resting_hr": 60,
        "systolic_bp": 110, "diastolic_bp": 70, "cholesterol": 165,
        "daily_steps": 12000, "family_history": 0, "water_intake": 3.0
    },
    "moderate": {
        "age":29,
        "sleep_hours": 6.5, "sleep_quality": 1,
        "smoker": 0, "alcohol": 1, "bmi": 24, "resting_hr": 72,
        "systolic_bp": 125, "diastolic_bp": 80, "cholesterol": 190,
        "daily_steps": 7000, "family_history": 1, "water_intake": 2.0
    },
    "bad": {
        "age":37,
        "sleep_hours": 5, "sleep_quality": 0,
        "smoker": 1, "alcohol": 1, "bmi": 29, "resting_hr": 88,
        "systolic_bp": 145, "diastolic_bp": 95, "cholesterol": 240,
        "daily_steps": 2500, "family_history": 1, "water_intake": 1.2
    }
}

if __name__ == "__main__":
    while True:
        choice = input("\nEnter good / moderate / bad / C (custom) / Q: ").lower()
        if choice == "q":
            break

        if choice == "c":
            # age = int(input("Age: "))
            data = {}
            for k in profiles["good"]:
                data[k] = float(input(f"{k}: "))
        else:
            data = profiles.get(choice)
            if not data:
                print("Invalid choice")
                continue

        age = data["age"]
        model_input = {k: v for k, v in data.items() if k != "age"}
        person = pd.DataFrame([model_input])

        score = model.predict(person)[0]
        bio_age = compute_biological_age(age, score)

        print("\nChronological Age:", age)
        print("Health Score:", round(score, 2))
        print("Biological Age:", round(bio_age, 2))
        print("Age Acceleration:", round(bio_age - age, 2))
        print("Enter q to stop the simulation")
