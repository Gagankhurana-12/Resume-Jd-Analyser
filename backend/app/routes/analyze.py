from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Body
from fastapi import status
from fastapi.responses import JSONResponse
from .controllers import analyze_controller

router = APIRouter()


@router.post('/extract-text')
async def extract_text(file: UploadFile = File(...)):
    try:
        data = await analyze_controller.extract_text(file)
        return data
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"error": e.detail})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Internal server error"})


@router.post('/')
async def analyze(payload: dict = Body(...)):
    # Expecting JSON body { resume: string, jd: string }
    resume = payload.get('resume')
    jd = payload.get('jd')
    if resume is None or jd is None:
        return JSONResponse(status_code=400, content={"error": "resume and jd fields are required"})
    # Guard against extremely large JSON payloads (parity with express.json({ limit: '10mb' }))
    try:
        total_size = (len(resume.encode('utf-8')) if isinstance(resume, str) else 0) + (len(jd.encode('utf-8')) if isinstance(jd, str) else 0)
        if total_size > 10 * 1024 * 1024:
            return JSONResponse(status_code=400, content={"error": "Payload too large. Maximum size is 10MB."})
    except Exception:
        pass
    try:
        data = await analyze_controller.analyze_with_gemini(resume, jd)
        return data
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"error": e.detail})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Gemini API error"})
