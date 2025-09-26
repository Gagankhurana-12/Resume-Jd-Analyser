import { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [processingResume, setProcessingResume] = useState(false);
  const [processingJD, setProcessingJD] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const resumeFileRef = useRef(null);
  const jdFileRef = useRef(null);

  const handleFileUpload = async (file, setFile, setText, setProcessing, type) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      alert(`Please upload a valid ${type} file (PDF or DOCX)`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert(`File size should be less than 10MB`);
      return;
    }

    setFile(file);
    setProcessing(true);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      // Upload file to backend for text extraction
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/analyze/extract-text`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setText(response.data.text);
    } catch (error) {
      console.error('Error extracting text:', error);
      alert(`Error extracting text from ${type} file: ${error.response?.data?.error || error.message}`);
      setFile(null);
    } finally {
      setProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, setFile, setText, setProcessing, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file, setFile, setText, setProcessing, type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !jdFile) {
      alert('Please upload both resume and job description files.');
      return;
    }

    if (!resumeText || !jdText) {
      alert('Please wait for file processing to complete.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/analyze`, { 
        resume: resumeText, 
        jd: jdText 
      });
      setResult(res.data.result);
    } catch (err) {
      setResult('Error connecting to Gemini API.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const FileUploadArea = ({ file, setFile, setText, setProcessing, type, fileRef, onDrop, processing }) => (
    <div
      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
        processing 
          ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg' 
          : file 
            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg' 
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:shadow-md'
      }`}
      onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e, setFile, setText, setProcessing, type)}
    >
      {processing ? (
        <div className="space-y-3">
          <div className="text-4xl animate-pulse">⏳</div>
          <div className="font-bold text-gray-700">
            Processing {type === 'resume' ? 'Resume' : 'Job Description'}...
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-200 border-t-yellow-500"></div>
          </div>
        </div>
      ) : file ? (
        <div className="space-y-3">
          <div className="text-4xl">📄</div>
          <div className="font-bold text-gray-700">{file.name}</div>
          <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full inline-block">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setText('');
              if (fileRef.current) fileRef.current.value = '';
            }}
            className="text-red-600 hover:text-red-800 text-sm font-semibold bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
          >
            Remove file
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div className="space-y-2">
            <p className="text-lg font-bold text-gray-700">
              Upload {type === 'resume' ? 'Resume' : 'Job Description'}
            </p>
            <p className="text-gray-500 text-sm">
              Drag & drop or click to upload PDF or DOCX file
            </p>
            <p className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full inline-block">
              Maximum file size: 10MB
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Choose File
          </button>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            handleFileUpload(file, setFile, setText, setProcessing, type);
          }
        }}
        className="hidden"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <span className="text-3xl animate-pulse">🧠</span>
              Resume & JD AI Analyzer
            </h1>
            <p className="text-lg opacity-95 max-w-2xl mx-auto">
              Upload your resume and job description files for AI-powered analysis
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">📤 Upload Files</h2>
              <p className="text-gray-600 text-sm">Upload your documents to get started</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-lg font-bold text-gray-700">
                  📄 Resume File
                </label>
                <FileUploadArea
                  file={resumeFile}
                  setFile={setResumeFile}
                  setText={setResumeText}
                  setProcessing={setProcessingResume}
                  type="resume"
                  fileRef={resumeFileRef}
                  onDrop={handleDrop}
                  processing={processingResume}
                />
                {resumeText && !processingResume && (
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="text-xl">✅</div>
                      <p className="text-green-700 font-semibold text-sm">
                        Resume text extracted successfully
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <label className="block text-lg font-bold text-gray-700">
                  💼 Job Description File
                </label>
                <FileUploadArea
                  file={jdFile}
                  setFile={setJdFile}
                  setText={setJdText}
                  setProcessing={setProcessingJD}
                  type="jd"
                  fileRef={jdFileRef}
                  onDrop={handleDrop}
                  processing={processingJD}
                />
                {jdText && !processingJD && (
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="text-xl">✅</div>
                      <p className="text-green-700 font-semibold text-sm">
                        Job description text extracted successfully
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={loading || !resumeFile || !jdFile || !resumeText || !jdText || processingResume || processingJD}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing with AI...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🔍 Analyze Resume vs JD
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">📊 Analysis Results</h2>
              <p className="text-gray-600 text-sm">AI-powered insights and recommendations</p>
            </div>
            
            <div className="h-[600px]">
              {loading && (
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center h-full flex flex-col items-center justify-center">
                  <div className="text-5xl mb-4 animate-pulse">🔍</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Analyzing with Gemini AI...
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-sm text-sm">
                    Our AI is carefully analyzing your resume against the job description
                  </p>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden h-full flex flex-col">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between flex-shrink-0">
                    <div>
                      <h3 className="text-lg font-bold">Analysis Complete</h3>
                      <p className="opacity-90 text-sm">Here are your detailed results</p>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        copied 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                      }`}
                    >
                      {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm font-sans">
                        {result}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {!result && !loading && (
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center h-full flex flex-col items-center justify-center">
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Ready to Analyze
                  </h3>
                  <p className="text-gray-600 max-w-sm text-sm">
                    Upload your resume and job description files, then click analyze to see detailed insights and recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;