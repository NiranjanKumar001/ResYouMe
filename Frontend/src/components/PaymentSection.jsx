import React, { useState } from 'react';
import biryaniImage from "../assets/react.svg"

const PaymentSection = ({ onComplete, onBack }) => {
  const [showBiryani, setShowBiryani] = useState(false);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Thank You!</h2>
      
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 mb-6">
        <p className="text-gray-300 mb-6 text-center">
          Your portfolio has been generated successfully!
        </p>
        
        <div className="text-center">
          <button
            onClick={() => setShowBiryani(!showBiryani)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Buy Me a Biryani 
          </button>
        </div>

        {showBiryani && (
          <div className="mt-6 text-center">
            <img 
              src={biryaniImage} 
              alt="Delicious Biryani" 
              className="mx-auto rounded-lg shadow-lg max-h-64"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PaymentSection;