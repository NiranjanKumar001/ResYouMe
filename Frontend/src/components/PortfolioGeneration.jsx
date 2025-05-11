import React from 'react';
import { Link } from 'react-router-dom';

const PortfolioGeneration = ({ status, portfolioUrl }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6 text-white">Generating Your Portfolio</h2>
      
      {status === 'processing' && (
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
          
          <p className="text-gray-300 mb-4">
            Our AI is analyzing your resume and creating your custom portfolio website.
          </p>
          <p className="text-gray-400 text-sm">
            This typically takes 1-2 minutes. Please don't close this page.
          </p>
          
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">What's happening now?</h3>
              <ul className="text-left text-gray-300 space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Extracting skills and experience</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Organizing content for optimal presentation</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 text-blue-500 mr-2 mt-0.5 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/30"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"></div>
                  </div>
                  <span>Generating portfolio design</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <div className="h-5 w-5 border-2 border-gray-600 rounded-full mr-2 mt-0.5"></div>
                  <span>Deploying to your custom URL</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {status === 'complete' && (
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">Your Portfolio is Ready!</h3>
          
          <p className="text-gray-300 mb-8">
            Your professional portfolio has been created and is now live at your custom URL.
          </p>
          
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 mb-8">
            <p className="text-gray-300 mb-2">Your portfolio URL:</p>
            <div className="flex items-center justify-center">
              <a 
                href={portfolioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
              >
                {portfolioUrl}
              </a>
              <button 
                onClick={() => navigator.clipboard.writeText(portfolioUrl)}
                className="ml-2 p-2 text-gray-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <a 
              href={portfolioUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View Portfolio
            </a>
            <Link 
              to="/dashboard/edit"
              className="bg-white/10 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Edit Portfolio
            </Link>
          </div>
        </div>
      )}
      
      {status === 'failed' && (
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">Generation Failed</h3>
          
          <p className="text-gray-300 mb-8">
            We encountered an issue while generating your portfolio. Please try again.
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioGeneration;
