/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import ResumeEditor from '../components/ResumeEditor';
import PaymentSection from '../components/PaymentSection';
import PortfolioGeneration from '../components/PortfolioGeneration';
import StepIndicator from '../components/StepIndicator';

function Dashboard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState(null);
  const [editedResumeData, setEditedResumeData] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('pending');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Upload Resume', description: 'Upload your PDF or DOCX resume' },
    { id: 2, title: 'Review & Edit', description: 'Review and edit your information' },
    { id: 3, title: 'Payment & Auth', description: 'Complete payment to continue' },
    { id: 4, title: 'Generate Portfolio', description: 'AI generates your portfolio' }
  ];

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
    setEditedResumeData(data); // Initialize edited data with parsed data
    nextStep();
  };

  // Handle resume edit completion
  const handleResumeEdit = (editedData) => {
    setEditedResumeData(editedData);
    nextStep();
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    setPaymentComplete(true);
    nextStep();
  };

  // Generate portfolio when payment is complete and we're on step 4
  useEffect(() => {
    if (paymentComplete && currentStep === 4 && editedResumeData) {
      setGenerationStatus('processing');
      
      // Simulate API call to generate portfolio
      const generatePortfolio = async () => {
        try {
          // In a real app, this would be an API call to your backend
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          setGenerationStatus('complete');
          setPortfolioUrl('https://your-portfolio-domain.com/username');
        } catch (error) {
          console.error('Portfolio generation failed:', error);
          setGenerationStatus('failed');
        }
      };
      
      generatePortfolio();
    }
  }, [paymentComplete, currentStep, editedResumeData]);

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
            <PaymentSection 
              onComplete={handlePaymentComplete} 
              onBack={prevStep}
              resumeData={editedResumeData}
            />
          )}
          
          {currentStep === 4 && (
            <PortfolioGeneration 
              status={generationStatus} 
              portfolioUrl={portfolioUrl}
            />
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
