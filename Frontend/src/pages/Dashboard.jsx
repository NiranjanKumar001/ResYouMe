/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumeUpload from '../components/ResumeUpload';
import ResumeEditor from '../components/ResumeEditor';
import PortfolioGenerate from '../components/PortfolioGenerate';
import StepIndicator from '../components/StepIndicator';
import { UserContext } from '../context/AuthContext';

function Dashboard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState(null);
  const [editedResumeData, setEditedResumeData] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('pending');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [showReloadAlert, setShowReloadAlert] = useState(false);
  
  const navigate = useNavigate();
  const { user, protect, loading: authLoading } = useContext(UserContext);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const steps = [
    { id: 1, title: 'Upload Resume', description: 'Upload your PDF or DOCX resume' },
    { id: 2, title: 'Review & Edit', description: 'Review and edit your information' },
    { id: 3, title: 'Portfolio Generation', description: 'AI generates your portfolio' },
    // { id: 4, title: 'Generate Portfolio', description: 'AI generates your portfolio' }
  ];

  // Detect page reload
  useEffect(() => {
    const handleLoad = () => {
      if (sessionStorage.getItem('pageVisited')) {
        setShowReloadAlert(true);
      } else {
        sessionStorage.setItem('pageVisited', 'true');
      }
    };
    
    window.addEventListener('load', handleLoad);
    
    // Add beforeunload event to warn before closing/refreshing
    const alertUser = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    
    window.addEventListener('beforeunload', alertUser);
    
    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('beforeunload', alertUser);
    };
  }, []);

  // Fetch user's resume data on component mount
  useEffect(() => {
    const fetchUserResume = async () => {
      if (!user) return;

      try {
        // Get user data with populated resume
        const response = await axios.get(`${API_BASE_URL}/api/users/${user.id}`, {
          withCredentials: true
        });

        if (response.data.resume) {
          setResumeData(response.data.resume.parsedData);
          setEditedResumeData(response.data.resume.parsedData);
          setCurrentStep(2); 
        }
      } catch (error) {
        console.error('Failed to fetch user resume:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchUserResume();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [API_BASE_URL, user, authLoading]);

  // Move to next step
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle resume upload completion
  const handleResumeUpload = (data) => {
    setResumeData(data);
    setEditedResumeData(data);
    nextStep();
  };

  // Handle resume edit completion
  const handleResumeEdit = (editedData) => {
    setEditedResumeData(editedData);

    // Update the resume data in the backend
    updateResumeData(editedData);

    nextStep();
  };

  // Function to update resume data
  const updateResumeData = async (data) => {
    if (!user) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${user.id}`, {
        withCredentials: true
      });

      if (response.data.resumeId) {
        await axios.patch(
          `${API_BASE_URL}/api/resumes/${response.data.resumeId}`,
          data,
          { withCredentials: true }
        );
        console.log('Resume data updated successfully');
      }
    } catch (error) {
      console.error('Failed to update resume data:', error);
    }
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    setPaymentComplete(true);
    nextStep();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background elements */}
      <div className="absolute inset-0 h-full w-full">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:linear-gradient(to_bottom,transparent_10%,#000_40%)]"></div>
      </div>

      {/* Centered gradient blur */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 to-purple-500/40 rounded-full filter blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className='mt-[4rem]'>
          
          {/* Reload Alert Banner */}
          {showReloadAlert && (
            <div className="mb-6 p-3 bg-[#2D2B1B] text-yellow-400 rounded-lg border border-yellow-800">
              <div className="flex items-center justify-between">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  The page has been reloaded. Your progress may have been reset.
                </p>
                <button 
                  onClick={() => setShowReloadAlert(false)} 
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step indicator */}
          <StepIndicator steps={steps} currentStep={currentStep} />

          <div className="max-w-3xl mx-auto mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            {currentStep === 1 && (
              <ResumeUpload onComplete={handleResumeUpload} />
            )}

            {currentStep === 2 && (
              <ResumeEditor
                initialData={resumeData}
                onComplete={handleResumeEdit}
                onBack={prevStep}
              />
            )}

            {currentStep === 3 && (
              <PortfolioGenerate
                onComplete={handlePaymentComplete}
                onBack={prevStep}
                resumeData={editedResumeData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
