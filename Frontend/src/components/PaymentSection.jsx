/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import biryaniImage from "../assets/react.svg";
import Modal from './Modal';
import Cookies from 'js-cookie';
import { UserContext } from '../context/AuthContext';

const TemplateSelectionSection = ({ onComplete, onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const { user } = useContext(UserContext);

  const templates = [
    { id: 'template1', name: 'Classic', description: 'Traditional professional layout' },
    { id: 'template2', name: 'Minimalistic', description: 'Clean and simple design' },
    { id: 'template3', name: 'Modern', description: 'Contemporary style with bold elements' },
    { id: 'template4', name: 'Creative', description: 'Unique layout for creative professionals' },
  ];

  // Get resumeId from multiple sources when component mounts
  useEffect(() => {
    const fetchResumeId = async () => {
      // 1. First try localStorage
      const localStorageResumeId = localStorage.getItem('resumeId');
      if (localStorageResumeId) {
        setResumeId(localStorageResumeId);
        return;
      }

      // 2. Then try cookies
      const cookieResumeId = Cookies.get('resumeId');
      if (cookieResumeId) {
        setResumeId(cookieResumeId);
        return;
      }

      // 3. If user context is available, check there
      if (user) {
        // 3a. Check if resumeId is in user object
        if (user.resumeId) {
          setResumeId(user.resumeId);
          return;
        }

        // 3b. If not in user object, fetch from API
        try {
          const authToken = Cookies.get('auth_token') || localStorage.getItem('auth_token');
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data.resumeId) {
            setResumeId(data.resumeId);
            // Optionally store it for future use
            localStorage.setItem('resumeId', data.resumeId);
          }
        } catch (error) {
          console.error('Error fetching resume ID:', error);
        }
      }
    };

    fetchResumeId();
  }, [user]);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }

    if (!resumeId) {
      alert('Resume ID not found. Please try refreshing the page.');
      return;
    }

    setIsLoading(true);
    
    try {
      const authToken = Cookies.get('auth_token') || localStorage.getItem('auth_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/build-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          resumeId: resumeId,
          templateName: selectedTemplate
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
      setShowSupportModal(true);
    } catch (error) {
      console.error('Error submitting template:', error);
      alert('Error submitting template selection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipSupport = () => {
    setShowSupportModal(false);
    onComplete();
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Select Your Template</h2>
      
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 mb-6">
        <p className="text-gray-300 mb-6 text-center">
          Choose the perfect design for your portfolio
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                selectedTemplate === template.id 
                  ? 'border-yellow-500 bg-white/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <h3 className="font-bold text-white">{template.name}</h3>
              <p className="text-gray-400 text-sm">{template.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowSupportModal(true)}
            className="text-gray-400 hover:text-gray-300 text-sm underline"
          >
            Support our work
          </button>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !selectedTemplate}
          className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ${
            isLoading || !selectedTemplate ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </div>

      {showSupportModal && (
        <Modal onClose={() => setShowSupportModal(false)}>
          <div className="text-center p-6">
            <h3 className="text-xl font-bold text-white mb-4">Support Our Work</h3>
            <p className="text-gray-300 mb-6">
              If you found this tool helpful, consider buying us a biryani to support our work!
            </p>
            
            <div className="mb-6">
              <img 
                src={biryaniImage} 
                alt="Delicious Biryani" 
                className="mx-auto rounded-lg shadow-lg max-h-64"
              />
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSkipSupport}
                className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                Skip
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TemplateSelectionSection;