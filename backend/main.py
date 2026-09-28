from fastapi import FastAPI

app = FastAPI(title="ATM Demand IQ")


@app.get("/")
def root():
    return {"message": "ATM Demand IQ API is running"}