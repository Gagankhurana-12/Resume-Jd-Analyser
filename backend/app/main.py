from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env for local development (parity with Node dotenv.config())
# Check multiple locations for the .env file
env_paths = [
    ".env",  # Current directory
    "../.env",  # Parent directory
    os.path.join(os.path.dirname(__file__), ".env"),  # Same directory as main.py
    os.path.join(os.path.dirname(__file__), "../.env"),  # Parent of main.py directory
]

for env_path in env_paths:
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print(f"Loaded environment from: {env_path}")
        break

import importlib
import uvicorn

# Support both running as a package (uvicorn from backend root) and running directly
# with `python main.py` from the `app` folder.
try:
    # Preferred when running `uvicorn app.main:app` from project root
    from app.routes import analyze
except Exception:
    # Fallback when running `python main.py` from the `app` directory
    from routes import analyze

app = FastAPI(title="AI Resume JD Analyzer - FastAPI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'https://jdresumeanalyzer.netlify.app',
        'https://jdconnect.netlify.app',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/analyze", tags=["analyze"])


@app.get("/")
async def root():
    return {"message": "AI Resume JD Analyzer (FastAPI)"}


if __name__ == "__main__":
    # Allow starting the server with `python main.py` for convenience during local development
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
