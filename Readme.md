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

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Get Your Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the key and paste it in your `backend/.env` file:
```env
GEMINI_API_KEY=your_api_key_here
DEBUG=true
```

### 5. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
.venv\Scripts\activate  # Windows
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
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



