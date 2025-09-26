import io
from fastapi import HTTPException
import pdfplumber
import mammoth
import os
import requests

MAX_FILE_SIZE = 10 * 1024 * 1024


async def extract_text(file):
    # Validate file
    if not file:
        raise HTTPException(status_code=400, detail='No file uploaded')

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail='File size too large. Maximum size is 10MB.')

    mimetype = file.content_type
    extracted_text = ''

    if mimetype == 'application/pdf':
        try:
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    extracted_text += page.extract_text() or ''
        except Exception:
            raise HTTPException(status_code=500, detail='Error extracting text from PDF')
    elif mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        try:
            res = mammoth.extract_raw_text(io.BytesIO(content))
            extracted_text = res.value
        except Exception:
            raise HTTPException(status_code=500, detail='Error extracting text from DOCX')
    else:
        raise HTTPException(status_code=400, detail='Invalid file type. Only PDF and DOCX files are allowed.')

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail='No text could be extracted from the file')

    return {'text': extracted_text, 'filename': file.filename, 'fileSize': len(content)}


async def analyze_with_gemini(resume: str, jd: str):
    prompt = f"""
You're a smart AI resume analyzer.

Compare the following resume and job description.

Return:
1. Match percentage (0–100)
2. List of strong/covered skills
3. List of missing skills
4. Suggestions for improving the resume

--- Job Description ---
{jd}

--- Resume ---
{resume}
"""

    GEMINI_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_KEY:
        raise HTTPException(status_code=500, detail='Gemini API key not configured')

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_KEY}"
    payload = {
        'contents': [
            {'parts': [{'text': prompt}]}
        ]
    }

    try:
        resp = requests.post(url, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        result = data['candidates'][0]['content']['parts'][0]['text']
        return {'result': result}
    except Exception as e:
        # Log full response if available (parity with Node: console.error(error.response?.data || error.message))
        try:
            print('Gemini API error:', getattr(e, 'response', None) and e.response.json() or str(e))
        except Exception:
            print('Gemini API error:', str(e))
        raise HTTPException(status_code=500, detail='Gemini API error')
