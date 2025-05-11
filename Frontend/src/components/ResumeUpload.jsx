import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const ResumeUpload = ({ onComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError('');
      }
    },
    onDropRejected: () => {
      setError('Please upload a valid PDF or DOCX file.');
    }
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await axios.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      // In a real app, the server would parse the resume and return structured data
      onComplete(response.data);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
      // Clear the file input after submission
      setFile(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Upload Your Resume</h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-600 hover:border-blue-400 hover:bg-blue-500/5'
        }`}
      >
        <input {...getInputProps()} />
        
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 mx-auto text-gray-400 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        
        {file ? (
          <p className="text-blue-400 font-medium">{file.name}</p>
        ) : (
          <>
            <p className="text-gray-300 mb-2">Drag & drop your resume here, or click to browse</p>
            <p className="text-gray-400 text-sm">Supports PDF and DOCX files</p>
          </>
        )}
      </div>
      
      {uploading && (
        <div className="mt-4">
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm mt-2 text-center">Uploading: {uploadProgress}%</p>
        </div>
      )}
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
      
      <div className="mt-6">
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
