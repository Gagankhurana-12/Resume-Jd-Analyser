# AI Resume - Job Description Analyzer

This project is a full-stack Resume vs Job Description analyzer. The frontend is a React (Vite) app and the backend has been implemented in Python using FastAPI to provide a fast, production-ready API that mirrors the original Node/Express behavior.

Key highlights:
- Backend: FastAPI (Python) — lightweight, high-performance ASGI framework
- Frontend: React + Vite
- AI integration: Gemini (or compatible generative language API)

This README focuses on quickly getting the FastAPI backend running locally and how to run the frontend.

---

## Repository layout

```
backend/                 # Original Node backend (reference)
backend_fastapi/         # FastAPI backend (Python) - main focus
frontend/                # React + Vite frontend
README.md                # This file
```

## FastAPI backend (Python) - setup & run (Windows PowerShell)

1. Open PowerShell and change to the backend folder:

```powershell
cd "C:\Users\Gagan\Desktop\Python Project\backend"
```

2. Create and activate a virtual environment:

```powershell
python -m venv .venv
. .venv\Scripts\Activate.ps1
```

3. Upgrade pip and install dependencies:

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

4. Configure environment variables:

```powershell
Copy-Item .env.example .env
# Open and edit backend\.env to set GEMINI_API_KEY, or set it in the session:
$env:GEMINI_API_KEY = 'your_gemini_api_key_here'
```

5. Run the FastAPI server:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API root will respond at `http://localhost:8000/`.

## Frontend (React + Vite) - setup & run

1. Open a new PowerShell window, change to the frontend folder and install dependencies:

```powershell
cd "C:\Users\Gagan\Desktop\Python Project\frontend"
npm install
```

2. Start the dev server:

```powershell
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`) to view the app.

If you need the frontend to target the FastAPI backend, set `VITE_API_URL=http://localhost:8000` in `frontend/.env`.

## API endpoints (FastAPI)

- POST /api/analyze/extract-text
	- multipart/form-data with field `file` (PDF or DOCX)
	- returns `{ text, filename, fileSize }` or `{ error }
- POST /api/analyze
	- application/json body `{ resume: string, jd: string }`
	- returns `{ result }` or `{ error }`

Both endpoints follow a 10MB limit for request sizes.

## Environment variables
- `GEMINI_API_KEY` — required to call the Gemini generative API. Place it in `backend/.env` or set it in the environment.



