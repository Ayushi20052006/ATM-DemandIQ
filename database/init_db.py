import os
import sqlite3
import pandas as pd
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "atm_demandiq.db")
CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml", "data", "raw", "transactions_in_usd.csv")

def init_db():
    print(f"Initializing database at {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Default Admin User (admin / admin123)
    cursor.execute("""
    INSERT INTO users (username, password_hash, role)
    VALUES ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Admin')
    ON CONFLICT(username) DO NOTHING;
    """)

    # 2. ATMs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS atms (
        atm_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location_type TEXT NOT NULL,
        capacity_usd REAL NOT NULL,
        current_cash_usd REAL NOT NULL,
        min_threshold_usd REAL NOT NULL,
        status TEXT NOT NULL,
        time_to_empty TEXT DEFAULT '24h',
        last_replenished_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    atms_seed = [
        ('atm-1087', 'ATM-1087 (Ghaziabad Hub)', 'Transit & Retail', 50000.0, 8500.0, 12000.0, 'CRITICAL', '4.2h', '2026-09-29 08:00:00'),
        ('atm-2041', 'ATM-2041 (Connaught Place)', 'High-Density Commercial', 80000.0, 14200.0, 15000.0, 'WARNING', '8.5h', '2026-09-28 14:30:00'),
        ('atm-3092', 'ATM-3092 (Noida Sec 62)', 'IT Corridor', 60000.0, 42000.0, 8000.0, 'ACTIVE', '34h', '2026-09-29 11:15:00'),
        ('atm-4105', 'ATM-4105 (Cyber City GGN)', 'Corporate Hub', 90000.0, 68000.0, 12000.0, 'ACTIVE', '48h', '2026-09-27 16:00:00'),
        ('atm-5210', 'ATM-5210 (Nehru Place)', 'Commercial Electronics', 50000.0, 31000.0, 6000.0, 'ACTIVE', '26h', '2026-09-28 10:45:00')
    ]

    for item in atms_seed:
        cursor.execute("""
        INSERT INTO atms (atm_id, name, location_type, capacity_usd, current_cash_usd, min_threshold_usd, status, time_to_empty, last_replenished_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(atm_id) DO UPDATE SET
            current_cash_usd=excluded.current_cash_usd,
            status=excluded.status,
            time_to_empty=excluded.time_to_empty;
        """, item)

    # 3. Historical Transactions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        atm_name TEXT NOT NULL,
        transaction_date TEXT NOT NULL,
        num_withdrawals INTEGER,
        num_xyz_withdrawals INTEGER,
        num_other_withdrawals INTEGER,
        total_amount_usd REAL,
        amount_xyz_usd REAL,
        amount_other_usd REAL,
        weekday TEXT,
        festival_religion TEXT,
        working_day TEXT,
        holiday_sequence TEXT
    );
    """)

    # Seed transaction history from raw CSV if table is empty
    cursor.execute("SELECT COUNT(*) FROM transactions;")
    count = cursor.fetchone()[0]
    if count == 0 and os.path.exists(CSV_PATH):
        print(f"Seeding historical transactions from {CSV_PATH}...")
        df = pd.read_csv(CSV_PATH)
        df["Transaction Date"] = pd.to_datetime(df["Transaction Date"], format="mixed", errors="coerce").dt.strftime("%Y-%m-%d")
        df = df.dropna(subset=["Transaction Date"])
        
        records = []
        for _, row in df.iterrows():
            records.append((
                row["ATM Name"], row["Transaction Date"], int(row["No Of Withdrawals"]),
                int(row["No Of XYZ Card Withdrawals"]), int(row["No Of Other Card Withdrawals"]),
                float(row["Total amount Withdrawn"]), float(row["Amount withdrawn XYZ Card"]),
                float(row["Amount withdrawn Other Card"]), str(row["Weekday"]), str(row["Festival Religion"]),
                str(row["Working Day"]), str(row["Holiday Sequence"])
            ))

        cursor.executemany("""
        INSERT INTO transactions (atm_name, transaction_date, num_withdrawals, num_xyz_withdrawals, num_other_withdrawals, total_amount_usd, amount_xyz_usd, amount_other_usd, weekday, festival_religion, working_day, holiday_sequence)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, records)
        print(f"Successfully seeded {len(records)} transactions into SQLite database.")

    # 4. Forecasts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS forecasts (
        forecast_id INTEGER PRIMARY KEY AUTOINCREMENT,
        atm_id TEXT NOT NULL,
        forecast_date TEXT NOT NULL,
        predicted_amount_usd REAL NOT NULL,
        lower_bound_usd REAL,
        upper_bound_usd REAL,
        model_version TEXT DEFAULT 'RandomForest v3.2',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 5. Replenishment Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS replenishment_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        atm_id TEXT NOT NULL,
        route_priority INTEGER NOT NULL,
        recommended_refill_usd REAL NOT NULL,
        urgency_level TEXT NOT NULL,
        cost_estimate_usd REAL DEFAULT 175.0,
        status TEXT DEFAULT 'DISPATCHED',
        dispatched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()
    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
