import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/AuthContext';

const PaymentSection = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resumeId, setResumeId] = useState(null);
  const [deploymentResult, setDeploymentResult] = useState(null);
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

  const handleDeployment = async () => {
    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }

    if (!resumeId) {
      setError('Resume information is missing. Please create a resume first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setDeploymentResult(null);

    try {
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
        throw new Error(errorData.message || 'Template build failed');
      }

      const buildData = await buildResponse.json();

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
        throw new Error(errorData.message || 'Deployment failed');
      }

      const result = await deployResponse.json();
      setDeploymentResult(result);

    } catch (err) {
      console.error('Deployment error:', err);
      setError(err.message || 'Failed to deploy portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Select Your Template</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {!resumeId && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
          No resume found. Please create a resume first.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {['template1', 'template2', 'template3', 'template4'].map((template) => (
          <div 
            key={template}
            onClick={() => resumeId && setSelectedTemplate(template)}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedTemplate === template 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-300'
            } ${!resumeId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <h3 className="font-bold capitalize">{template}</h3>
            <p className="text-sm text-gray-600">Description of {template}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleDeployment}
        disabled={isLoading || !selectedTemplate || !resumeId}
        className={`px-6 py-2 rounded-lg text-white ${
          isLoading || !selectedTemplate || !resumeId
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } mb-6`}
      >
        {isLoading ? 'Deploying...' : 'Deploy Portfolio'}
      </button>

      {deploymentResult && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Deployment Successful!</h3>
          <p className="text-green-700 mb-1">
            <span className="font-medium">Message:</span> {deploymentResult.message}
          </p>
          <p className="text-green-700 mb-1">
            <span className="font-medium">Portfolio URL:</span>{' '}
            <a 
              href={deploymentResult.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {deploymentResult.url}
            </a>
          </p>
          <p className="text-green-700">
            <span className="font-medium">GitHub Repository:</span>{' '}
            <a 
              href={deploymentResult.git} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {deploymentResult.git}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;