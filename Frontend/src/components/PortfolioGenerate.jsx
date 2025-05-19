import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/AuthContext';

const PaymentSection = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resumeId, setResumeId] = useState(null);
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showBiryaniModal, setShowBiryaniModal] = useState(false);
  const [deploymentSteps, setDeploymentSteps] = useState([
    { id: 1, name: 'Validating template', status: 'pending', time: '2-3s' },
    { id: 2, name: 'Building portfolio', status: 'pending', time: '10-15s' },
    { id: 3, name: 'Creating GitHub repository', status: 'pending', time: '5-8s' },
    { id: 4, name: 'Deploying to GitHub Pages', status: 'pending', time: '20-30s' }
  ]);
  const { user } = useContext(UserContext);

  // Get resumeId from localStorage when component mounts
  useEffect(() => {
    const storedResumeId = localStorage.getItem('resumeId');
    if (storedResumeId) {
      setResumeId(storedResumeId);
    } else {
      setError('No resume found. Please create a resume first.');
    }
  }, []);

  const updateStepStatus = (stepId, newStatus) => {
    setDeploymentSteps(steps =>
      steps.map(step =>
        step.id === stepId ? { ...step, status: newStatus } : step
      )
    );
  };

  const resetDeploymentSteps = () => {
    setDeploymentSteps(steps =>
      steps.map(step => ({ ...step, status: 'pending' }))
    );
  };

  const handleDeploymentClick = () => {
    setShowBiryaniModal(true);
  };

  const handleSkipBiryani = () => {
    setShowBiryaniModal(false);
    startDeployment();
  };

  const startDeployment = async () => {
    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }

    if (!resumeId) {
      setError('Resume information is missing. Please create a resume first.');
      return;
    }

    setIsDeploying(true);
    resetDeploymentSteps();
    setIsLoading(true);
    setError('');
    setDeploymentResult(null);

    try {
      // Step 1: Validating template
      updateStepStatus(1, 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate validation time
      updateStepStatus(1, 'completed');

      // Step 2: Building portfolio
      updateStepStatus(2, 'in-progress');

      // First request: Build template
      const buildResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/build-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          templateName: selectedTemplate
        }),
        credentials: 'include'
      });

      if (!buildResponse.ok) {
        const errorData = await buildResponse.json();
        updateStepStatus(2, 'failed');
        throw new Error(errorData.message || 'Template build failed');
      }

      const buildData = await buildResponse.json();
      updateStepStatus(2, 'completed');

      // Step 3: Creating GitHub repository
      updateStepStatus(3, 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate repo creation time
      updateStepStatus(3, 'completed');

      // Step 4: Deploying to GitHub Pages
      updateStepStatus(4, 'in-progress');

      // Second request: Deploy to GitHub
      const deployResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outputDir: buildData.outputDir,
          repoName: `portfolio-${user?.username || 'user'}-${Date.now()}`,
          resumeId
        }),
        credentials: 'include'
      });

      if (!deployResponse.ok) {
        const errorData = await deployResponse.json();
        updateStepStatus(4, 'failed');
        throw new Error(errorData.message || 'Deployment failed');
      }

      const result = await deployResponse.json();
      updateStepStatus(4, 'completed');
      setDeploymentResult(result);

    } catch (err) {
      console.error('Deployment error:', err);
      setError(err.message || 'Failed to deploy portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  // Templates data with images and descriptions
  const templates = [
    {
      id: 'template1',
      name: 'Onyx',
      description: 'Light glossy color with subtle tranlucent branded layers with toggle theme',
    },
    {
      id: 'template2',
      name: 'Duality',
      description: 'Contrasting element balance between light and dark with toggle theme',
    },
    {
      id: 'template3',
      name: 'Professional Corporate',
      description: 'Coming Soon',
    },
    {
      id: 'template4',
      name: 'Developer Showcase',
      description: 'Coming Soon',
    }
  ];

  return (
    <div className="container mx-auto p-4 bg-[#0F1524] text-white rounded-lg">
      {showBiryaniModal && (
        <div className="fixed inset-0 bg-gray-800 rounded-2xl bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1F2E] rounded-xl p-6 max-w-md w-full border border-[#2A3042] shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Support Our Work</h3>
              <button
                onClick={() => setShowBiryaniModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 rounded-full p-1 hover:bg-[#232836]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6 w-full">
              <div className="flex justify-center items-center mb-4">
                <img
                  src="./payment.jpeg"
                  alt="payment"
                  className="max-w-[200px] md:max-w-[300px] w-full h-auto object-contain rounded-lg border border-[#2A3042]"
                />
              </div>
              <p className="text-gray-300 text-sm text-center mb-4 leading-relaxed">
                Enjoying our service? Buy us a biryani to support our work and keep the service free for everyone!
              </p>
            </div>

            <div className="flex justify-between space-x-4">
              <button
                onClick={handleSkipBiryani}
                className="mt-4 px-4 h-[2rem] text-center bg-gray-600  text-gray-300 rounded-lg flex-1 transition-all duration-300 border border-[#2A3042] font-medium hover:bg-red-400"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

      {!isDeploying ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-white">Select Your Template</h2>

          {error && (
            <div className="mb-4 p-3 bg-[#2D1B1B] text-red-400 rounded-lg border border-red-800">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {!resumeId && (
            <div className="mb-4 p-3 bg-[#2D2B1B] text-yellow-400 rounded-lg border border-yellow-800">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                No resume found. Please create a resume first.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {templates.map((template) => {

              const isComingSoon = template.description === "Coming Soon";

              return (
                <div
                  key={template.id}
                  onClick={() => resumeId && !isComingSoon && setSelectedTemplate(template.id)}
                  className={`bg-[#1A1F2E] rounded-xl overflow-hidden transition-all duration-300 ${selectedTemplate === template.id
                    ? 'ring-2 ring-[#3B82F6] transform scale-[1.02]'
                    : 'hover:bg-[#232836] border border-[#2A3042]'
                    } ${!resumeId || isComingSoon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white">{template.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                    {selectedTemplate === template.id && (
                      <div className="mt-2 inline-block px-2 py-1 bg-[#1E3A8A] text-blue-300 text-xs font-medium rounded">
                        Selected
                      </div>
                    )}
                    {isComingSoon && (
                      <div className="mt-2 inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleDeploymentClick}
              disabled={isLoading || !selectedTemplate || !resumeId}
              className={`px-6 py-3 rounded-lg text-white font-medium text-lg transition-all duration-300 ${isLoading || !selectedTemplate || !resumeId
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-[#3B82F6] hover:bg-blue-600 shadow-md hover:shadow-lg'
                } mb-6`}
            >
              {isLoading ? 'Deploying...' : 'Deploy Portfolio'}
            </button>
          </div>
        </>
      ) : (
        <div className="max-w-md mx-auto bg-[#1A1F2E] rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Deploying Your Portfolio</h3>
            {!isLoading && (
              <button
                onClick={() => setIsDeploying(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="space-y-5 mb-6">
            {deploymentSteps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className="mr-4 flex-shrink-0">
                  {step.status === 'pending' && (
                    <div className="w-7 h-7 rounded-full border-2 border-gray-500"></div>
                  )}
                  {step.status === 'in-progress' && (
                    <div className="w-7 h-7 rounded-full border-2 border-[#3B82F6] border-t-transparent animate-spin"></div>
                  )}
                  {step.status === 'completed' && (
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {step.status === 'failed' && (
                    <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium truncate ${step.status === 'in-progress' ? 'text-[#3B82F6]' :
                      step.status === 'completed' ? 'text-green-400' :
                        step.status === 'failed' ? 'text-red-400' : 'text-gray-200'
                      }`}>{step.name}</span>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{step.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#2D1B1B] text-red-400 rounded-lg text-sm border border-red-800">
              {error}
            </div>
          )}

          {deploymentResult && (
            <div className="bg-[#1B2D1B] border border-green-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Deployment Successful!
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-medium text-sm text-gray-300 w-24 flex-shrink-0">Portfolio:</span>
                  <a
                    href={deploymentResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3B82F6] hover:underline text-sm truncate"
                  >
                    {deploymentResult.url}
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-sm text-gray-300 w-24 flex-shrink-0">Repository:</span>
                  <a
                    href={deploymentResult.git}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3B82F6] hover:underline text-sm truncate"
                  >
                    {deploymentResult.git}
                  </a>
                </div>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsDeploying(false)}
                className="px-5 py-2 rounded-lg bg-[#3B82F6] text-white hover:bg-blue-600"
              >
                {deploymentResult ? 'Back to Templates' : 'Cancel'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
