import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Cookies from 'js-cookie';

const ResumeUpload = ({ onComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError('');
      }
    },
    onDropRejected: () => {
      setError('Please upload a valid PDF file.');
    }
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      console.log('Starting upload for:', file.name);

      // Get authentication token from cookies
      const authToken = Cookies.get('authToken');
      
      const response = await axios.post(
        `${API_BASE_URL}/api/resumes/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Add authorization header if using token-based auth
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
          },
          withCredentials: true, // Important for sending cookies
          onUploadProgress: progressEvent => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          }
        }
      );

      console.log('Upload successful! Response:', response.data);
      
      // Store resumeId for later use
      if (response.data.resume && response.data.resume.id) {
        localStorage.setItem('resumeId', response.data.resume.id);
      }
      
      if (onComplete) onComplete(response.data.resume.parsedData);
    } catch (err) {
      console.error('Upload failed:', {
        error: err.response?.data || err.message,
        status: err.response?.status
      });
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(
          err.response?.data?.message ||
          `Upload failed: ${err.message}` ||
          'Unknown upload error'
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = e => {
    e.stopPropagation();
    setFile(null);
    setError('');
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
        onClick={open}
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
          <div>
            <p className="text-blue-400 font-medium">{file.name}</p>
            <button
              type="button"
              className="mt-2 text-xs text-red-400 underline"
              onClick={handleRemove}
              disabled={uploading}
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-300 mb-2">
              Drag & drop your PDF resume here, or click to browse
            </p>
            <p className="text-gray-400 text-sm">Supports <b>PDF files only</b></p>
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
          <p className="text-gray-400 text-sm mt-2 text-center">
            Uploading: {uploadProgress}%
          </p>
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
