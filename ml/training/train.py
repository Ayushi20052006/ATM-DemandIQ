import os
import json
import joblib
import pandas as pd
import numpy as np

from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error, r2_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

def train_pipeline(data_path: str, model_dir: str):
    print(f"Loading model-ready dataset from {data_path}...")
    df = pd.read_csv(data_path)
    df["Transaction Date"] = pd.to_datetime(df["Transaction Date"], errors="coerce")
    df = df.sort_values(by=["Transaction Date"]).reset_index(drop=True)

    target = "Total amount Withdrawn"

    features = [
        "ATM Name", "Lag_1_Day", "Lag_7_Day", "Lag_14_Day", "Lag_30_Day",
        "Rolling_7_Day_Mean", "Rolling_14_Day_Mean", "Rolling_30_Day_Mean",
        "Year", "Month", "Day", "Day_of_Week", "Is_Weekend", "Week_of_Year",
        "Working Day", "Holiday Sequence", "Festival Religion"
    ]

    categorical_features = ["ATM Name", "Festival Religion", "Working Day", "Holiday Sequence"]
    numerical_features = [f for f in features if f not in categorical_features]

    # Time-based split: 70% Train, 15% Validation, 15% Test
    n = len(df)
    train_end = int(n * 0.70)
    val_end = int(n * 0.85)

    train_df = df.iloc[:train_end]
    val_df = df.iloc[train_end:val_end]
    test_df = df.iloc[val_end:]

    X_train, y_train = train_df[features], train_df[target]
    X_val, y_val = val_df[features], val_df[target]
    X_test, y_test = test_df[features], test_df[target]

    # Robust preprocessor with SimpleImputer for numericals and OneHotEncoder for categoricals
    num_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median"))
    ])

    cat_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore"))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("categorical", cat_transformer, categorical_features),
            ("numerical", num_transformer, numerical_features)
        ]
    )

    models = {
        "LinearRegression": LinearRegression(),
        "RandomForest": RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42),
        "GradientBoosting": GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=6, random_state=42)
    }

    results = {}
    best_model_name = None
    best_r2 = -float("inf")
    best_pipeline = None

    for name, model in models.items():
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("model", model)
        ])
        
        pipeline.fit(X_train, y_train)
        preds = pipeline.predict(X_test)

        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        mape = mean_absolute_percentage_error(y_test, preds) * 100
        r2 = r2_score(y_test, preds)
        accuracy_score = max(0, 100 - mape)

        results[name] = {
            "MAE": round(float(mae), 2),
            "RMSE": round(float(rmse), 2),
            "MAPE": round(float(mape), 2),
            "R2": round(float(r2), 4),
            "Accuracy_Pct": round(float(accuracy_score), 2)
        }

        print(f"Model: {name} -> MAE: {mae:.2f}, RMSE: {rmse:.2f}, MAPE: {mape:.2f}%, R2: {r2:.4f}")

        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name
            best_pipeline = pipeline

    print(f"\nChampion Model Selected: {best_model_name} with R2 = {best_r2:.4f}")

    os.makedirs(model_dir, exist_ok=True)
    model_file = os.path.join(model_dir, "atm_demand_model.pkl")
    joblib.dump(best_pipeline, model_file)

    metadata_file = os.path.join(model_dir, "model_metadata.json")
    metadata = {
        "champion_model": best_model_name,
        "features": features,
        "categorical_features": categorical_features,
        "numerical_features": numerical_features,
        "evaluation_results": results,
        "atms": list(df["ATM Name"].unique())
    }
    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=4)

    print(f"Model saved to {model_file}")
    print(f"Metadata saved to {metadata_file}")

if __name__ == "__main__":
    processed_csv = "ml/data/processed/atm_model_ready.csv"
    model_dir = "ml/models"
    train_pipeline(processed_csv, model_dir)
