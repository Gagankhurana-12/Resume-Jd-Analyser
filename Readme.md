# 🚀 AI Resume JD Analyzer - FastAPI Edition

A modern full-stack application built with **FastAPI** backend that analyzes resumes against job descriptions using AI, providing intelligent matching insights and improvement suggestions. This high-performance Python API delivers blazing-fast resume analysis with Google Gemini AI integration.

## ✨ Features

### 🔥 **FastAPI-Powered Backend**
- **⚡ Lightning Fast**: Built with FastAPI for maximum performance and async processing
- **📚 Auto-Generated Docs**: Interactive API documentation at `/docs` endpoint
- **🔧 Type Safety**: Full Python type hints and Pydantic validation
- **🚀 Production Ready**: ASGI server with hot reload for development

### 🎯 **Core Functionality**
- **📄 File Upload Support**: Upload resumes and job descriptions in PDF or DOCX format
- **🤖 AI-Powered Analysis**: Uses Google Gemini AI for intelligent resume analysis  
- **📊 Match Percentage**: Get precise compatibility scores between resumes and job descriptions
- **🎯 Skills Analysis**: Identify strengths, gaps, and missing skills
- **💡 Smart Recommendations**: Receive actionable improvement suggestions
- **📱 Responsive Design**: Modern React UI with Tailwind CSS
- **🔄 CORS Enabled**: Seamless frontend-backend communication

## 🏗️ Tech Stack

### 🔥 Backend (FastAPI + Python)
- **FastAPI**: Ultra-modern, high-performance web framework with automatic OpenAPI docs
- **Python 3.8+**: Core backend language with full async/await support
- **Google Gemini AI**: Advanced AI model for text analysis
- **Pydantic**: Data validation using Python type annotations
- **pdfplumber**: Advanced PDF text extraction
- **mammoth**: Microsoft Word document processing
- **Uvicorn**: Lightning-fast ASGI server for production deployment

### Frontend (React + Vite)
- **React 18**: Modern frontend framework
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **Google AI Studio API Key** (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/Gagankhurana-12/Resume-Jd-Analyser.git
cd Resume-Jd-Analyser
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
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

🎉 **Application will be running at:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000

## 📡 FastAPI API Endpoints

### 🔥 **Interactive API Documentation**
FastAPI automatically generates interactive API docs:
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8001/redoc

### **API Endpoints**

| Method | Endpoint | Description | Request Type |
|--------|----------|-------------|-------------|
| `GET` | `/` | Health check & API info | - |
| `POST` | `/api/analyze/extract-text` | Extract text from PDF/DOCX files | `multipart/form-data` |
| `POST` | `/api/analyze` | Analyze resume against job description | `application/json` |

#### Example API Usage:

**Extract Text from File:**
```bash
curl -X POST "http://127.0.0.1:8001/api/analyze/extract-text" \
  -F "file=@resume.pdf"
```

**Analyze Resume:**
```bash
curl -X POST "http://127.0.0.1:8001/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "Software Engineer with Python experience...",
    "jd": "Looking for Python developer..."
  }'
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Required
GEMINI_API_KEY=your_google_ai_studio_api_key

# Optional
DEBUG=true  # Enable detailed error messages
```

### Frontend Configuration

Update `frontend/src/App.jsx` if needed:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## 📦 Deployment

### Deploy Backend to Render.com

1. Push your code to GitHub
2. Connect Render to your repository
3. Use the provided `render.yaml` configuration
4. Set environment variables in Render dashboard

### Deploy Frontend to Netlify

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Update API URL in environment variables

## 🧪 Testing

### **FastAPI Interactive Testing**
1. Start your backend server
2. Visit http://127.0.0.1:8000/docs for **Swagger UI**
3. Test all endpoints directly from the browser!

### **Command Line Testing**
```bash
# Health check
curl http://127.0.0.1:8000

# Test analysis (with backend running)
python -c "
import requests
response = requests.post('http://127.0.0.1:8000/api/analyze', json={
    'resume': 'Software Engineer with Python experience',
    'jd': 'Looking for Python developer'
})
print(response.json())
"

# Access FastAPI auto-generated docs
# Swagger UI: http://127.0.0.1:8001/docs
# ReDoc: http://127.0.0.1:8001/redoc
```

## 📁 Project Structure

```
Resume-Jd-Analyser/
├── backend/                 # 🔥 FastAPI Backend
│   ├── app/
│   │   ├── main.py         # FastAPI app & CORS configuration
│   │   └── routes/
│   │       ├── analyze.py  # FastAPI route handlers
│   │       └── controllers/
│   │           └── analyze_controller.py  # Business logic & AI integration
│   ├── requirements.txt    # Python dependencies (FastAPI, uvicorn, etc.)
│   ├── Dockerfile         # Docker configuration for FastAPI
│   ├── render.yaml        # Render.com deployment for FastAPI
│   ├── .env.example       # Environment variables template
│   └── .gitignore         # Python/FastAPI gitignore
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── App.jsx        # Main React component (connects to FastAPI)
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Tailwind CSS styles
│   ├── package.json       # Node.js dependencies
│   ├── vite.config.js     # Vite configuration
│   └── netlify.toml       # Netlify deployment config
├── .gitignore             # Root gitignore (includes .venv/)
└── README.md              # This comprehensive guide
```

## 🔍 FastAPI Features in Detail

### 🚀 **Why FastAPI?**
This project leverages **FastAPI** for its backend, chosen for these key advantages:

- **⚡ Performance**: One of the fastest Python frameworks available, comparable to NodeJS and Go
- **📖 Auto Documentation**: Automatic interactive API documentation with Swagger UI and ReDoc
- **🔒 Type Safety**: Full Python type hints with automatic validation and serialization
- **🔄 Async Support**: Native async/await support for handling concurrent requests
- **🛡️ Security**: Built-in security utilities for authentication, CORS, and more
- **🐍 Modern Python**: Takes advantage of modern Python 3.6+ features

### 📄 **File Processing Engine**
- **PDF Support**: Advanced text extraction from multi-page PDF documents using `pdfplumber`
- **DOCX Support**: Microsoft Word document processing with `mammoth` library
- **File Size Limits**: Configurable 10MB maximum file size with proper error handling
- **Async Processing**: Non-blocking file upload and processing
- **Error Handling**: Comprehensive error responses with detailed messages

### 🤖 **AI Analysis Pipeline**
- **Google Gemini Integration**: Uses latest `gemini-flash-latest` model for optimal performance
- **Optimized Prompts**: Concise prompts designed for faster AI response times
- **Smart Caching**: Efficient request handling to minimize API calls
- **Error Recovery**: Robust error handling with quota management
- **Response Formatting**: Structured JSON responses with match percentages and recommendations

### User Experience
- **Real-time Feedback**: Loading states and progress indicators
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: User-friendly error messages
- **Copy to Clipboard**: Easy sharing of analysis results

## 🔧 Troubleshooting

### Common Issues:

**1. Backend won't start:**
- Check if Python 3.8+ is installed
- Ensure virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`

**2. Gemini API errors:**
- Verify your API key is correct in `.env`
- Check if you have quota remaining (free tier has limits)
- Ensure the Generative Language API is enabled in Google Cloud Console

**3. Frontend can't connect to backend:**
- Check if backend is running on port 8001
- Verify API URL in frontend matches backend port
- Check for CORS issues in browser console

**4. File upload fails:**
- Ensure file is PDF or DOCX format
- Check file size is under 10MB
- Verify file is not corrupted

## 🚀 FastAPI Performance Tips

### **Backend Optimization**
- **Production Server**: Use `uvicorn app.main:app --workers 4 --host 0.0.0.0 --port 8000` for production
- **Async Endpoints**: All endpoints are async for maximum concurrency
- **Connection Pooling**: Efficient HTTP client connection reuse
- **Memory Management**: Optimized file processing with streaming

### **Development vs Production**
```bash
# Development (with hot reload)
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Production (multi-worker)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# With Gunicorn (alternative)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### **Frontend Integration**
- **API Client**: Axios configured for FastAPI backend
- **Error Handling**: Proper FastAPI error response handling
- **Type Safety**: Frontend models that match FastAPI Pydantic schemas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for providing an exceptional Python web framework that makes building APIs a joy
- **Uvicorn** for the lightning-fast ASGI server implementation
- **Pydantic** for elegant data validation and serialization
- **Google AI Studio** for providing the Gemini AI API
- **React** and **Vite** for the modern frontend development experience
- **Tailwind CSS** for the beautiful utility-first styling system

## 📞 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/Gagankhurana-12/Resume-Jd-Analyser/issues) page
2. Ensure your API key is correctly configured
3. Verify all dependencies are installed
4. Check that both backend and frontend are running

## 🎯 Future Roadmap

- [ ] Add user authentication and profiles
- [ ] Store analysis history in database
- [ ] Support for additional file formats (TXT, RTF)
- [ ] Batch processing for multiple resumes
- [ ] Export analysis reports to PDF
- [ ] Integration with job boards APIs
- [ ] Resume builder with AI suggestions
- [ ] Interview question generator based on analysis

---

**Built with ❤️ by [Gagan Khurana](https://github.com/Gagankhurana-12)**

**⭐ If this project helped you, please give it a star on [GitHub](https://github.com/Gagankhurana-12/Resume-Jd-Analyser)!**



