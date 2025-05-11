import React from 'react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step.id < currentStep 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : step.id === currentStep 
                      ? 'border-blue-500 text-blue-500' 
                      : 'border-gray-600 text-gray-400'
                }`}
              >
                {step.id < currentStep ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <p className={`mt-2 text-sm ${
                step.id === currentStep ? 'text-blue-400 font-medium' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                {step.description}
              </p>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 mx-2 ${
                  step.id < currentStep ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
