from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env for local development (parity with Node dotenv.config())
load_dotenv()

from app.routes import analyze

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
