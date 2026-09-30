import os
import pandas as pd
import numpy as np

def run_preprocessing(raw_path: str, output_path: str):
    print(f"Loading raw dataset from {raw_path}...")
    df = pd.read_csv(raw_path)

    # 1. Standardize column names & date formatting
    df["Transaction Date"] = pd.to_datetime(df["Transaction Date"], format="mixed", errors="coerce")
    
    # Drop rows with unparseable dates if any, or fill
    df = df.dropna(subset=["Transaction Date"])
    df = df.sort_values(by=["ATM Name", "Transaction Date"]).reset_index(drop=True)

    # 2. Extract Date Features
    df["Year"] = df["Transaction Date"].dt.year
    df["Month"] = df["Transaction Date"].dt.month
    df["Day"] = df["Transaction Date"].dt.day
    df["Day_of_Week"] = df["Transaction Date"].dt.dayofweek
    df["Is_Weekend"] = df["Day_of_Week"].apply(lambda x: 1 if x >= 5 else 0)
    df["Week_of_Year"] = df["Transaction Date"].dt.strftime("%U").astype(int)

    # 3. Outlier Detection using IQR on Total amount Withdrawn per ATM
    df["Demand_Outlier"] = 0
    for atm, group in df.groupby("ATM Name"):
        q1 = group["Total amount Withdrawn"].quantile(0.25)
        q3 = group["Total amount Withdrawn"].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        outlier_idx = group[(group["Total amount Withdrawn"] < lower_bound) | (group["Total amount Withdrawn"] > upper_bound)].index
        df.loc[outlier_idx, "Demand_Outlier"] = 1

    # 4. Create Lag and Rolling Features per ATM
    df["Lag_1_Day"] = df.groupby("ATM Name")["Total amount Withdrawn"].shift(1)
    df["Lag_7_Day"] = df.groupby("ATM Name")["Total amount Withdrawn"].shift(7)
    df["Lag_14_Day"] = df.groupby("ATM Name")["Total amount Withdrawn"].shift(14)
    df["Lag_30_Day"] = df.groupby("ATM Name")["Total amount Withdrawn"].shift(30)

    df["Rolling_7_Day_Mean"] = df.groupby("ATM Name")["Total amount Withdrawn"].transform(lambda x: x.shift(1).rolling(7, min_periods=1).mean())
    df["Rolling_14_Day_Mean"] = df.groupby("ATM Name")["Total amount Withdrawn"].transform(lambda x: x.shift(1).rolling(14, min_periods=1).mean())
    df["Rolling_30_Day_Mean"] = df.groupby("ATM Name")["Total amount Withdrawn"].transform(lambda x: x.shift(1).rolling(30, min_periods=1).mean())

    # Forward-fill / back-fill initial NaNs in time series lag columns to prevent nulls where possible
    lag_cols = ["Lag_1_Day", "Lag_7_Day", "Lag_14_Day", "Lag_30_Day", "Rolling_7_Day_Mean", "Rolling_14_Day_Mean", "Rolling_30_Day_Mean"]
    for col in lag_cols:
        df[col] = df.groupby("ATM Name")[col].bfill().ffill()

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Processed dataset saved successfully to {output_path}. Shape: {df.shape}")
    return df

if __name__ == "__main__":
    raw_csv = "ml/data/raw/transactions_in_usd.csv"
    processed_csv = "ml/data/processed/atm_model_ready.csv"
    run_preprocessing(raw_csv, processed_csv)
