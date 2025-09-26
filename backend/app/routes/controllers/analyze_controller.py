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
    prompt = f"""Analyze resume vs job description. Be concise.

Job: {jd}

Resume: {resume}

Return:
1. Match % (0-100)
2. Top 3 strengths
3. Top 3 gaps
4. 2 key improvements

Keep under 300 words."""

    GEMINI_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_KEY:
        raise HTTPException(status_code=500, detail='Gemini API key not configured')

    # Use gemini-flash-latest which we confirmed works with your API key
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GEMINI_KEY}"
    payload = {
        'contents': [
            {'parts': [{'text': prompt}]}
        ]
    }

    try:
        # Shorter timeout for faster user experience
        resp = requests.post(url, json=payload, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        result = data['candidates'][0]['content']['parts'][0]['text']
        return {'result': result}
    except requests.exceptions.HTTPError as e:
        # Log the exact HTTP error
        error_detail = f"HTTP {e.response.status_code}: {e.response.reason}"
        try:
            error_response = e.response.json()
            if 'error' in error_response:
                error_detail = error_response['error'].get('message', error_detail)
                # Check for quota exceeded specifically
                if 'quota' in error_detail.lower() or 'resource_exhausted' in str(error_response.get('error', {}).get('status', '')).lower():
                    error_detail = f"Quota exceeded. Please wait a few minutes or enable billing. Details: {error_detail}"
        except Exception:
            pass
        
        print(f'Gemini API HTTP Error: {error_detail}')
        
        # If DEBUG is enabled, return detailed error
        debug_mode = os.getenv('DEBUG', 'false').lower() in ('1', 'true', 'yes')
        if debug_mode:
            raise HTTPException(status_code=500, detail=error_detail)
        else:
            raise HTTPException(status_code=500, detail='Gemini API error')
    except Exception as e:
        # Log other errors
        print(f'Gemini API error: {str(e)}')
        debug_mode = os.getenv('DEBUG', 'false').lower() in ('1', 'true', 'yes')
        if debug_mode:
            raise HTTPException(status_code=500, detail=str(e))
        else:
            raise HTTPException(status_code=500, detail='Gemini API error')
    # If all endpoints failed, handle the error
    if last_error:
        # Log full response if available
        try:
            detail = getattr(last_error, 'response', None) and last_error.response.json() or str(last_error)
            print('Gemini API error:', detail)
        except Exception:
            detail = str(last_error)
            print('Gemini API error:', detail)

        # If DEBUG is enabled in environment, return the detailed error to the client (dev only)
        debug_mode = os.getenv('DEBUG', 'false').lower() in ('1', 'true', 'yes')
        if debug_mode:
            # Raise with the detailed message so the router will transform it into { error: detail }
            raise HTTPException(status_code=500, detail=str(detail))

        # Production: return a generic error message
        raise HTTPException(status_code=500, detail='Gemini API error')
    
    # Fallback error if no endpoints were tried
    raise HTTPException(status_code=500, detail='No valid Gemini API endpoints available')
