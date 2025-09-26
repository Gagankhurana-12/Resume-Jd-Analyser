# AI Resume JD Analyzer - FastAPI Backend

This folder contains a FastAPI reimplementation of the previous Node/Express backend located in `backend/`.

Features (parity with Node version):
- POST /api/analyze/extract-text — upload a PDF or DOCX and extract text (10MB limit)
- POST /api/analyze — send `resume` and `jd` form fields (text) and call Gemini API to get analysis

Notes:
- This backend intentionally mirrors the existing Node behavior and does not use a database by default.
- The Gemini API key must be set in environment as `GEMINI_API_KEY` (or set OpenAI if you extend it).

Quickstart
1. Create and activate a virtualenv and install requirements:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate; pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`.

3. Run the app:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Frontend
- Point your frontend's API URL to `http://localhost:8000/api/analyze` for extract-text and analyze endpoints.
