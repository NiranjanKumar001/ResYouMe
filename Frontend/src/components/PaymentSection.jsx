import React, { useState } from 'react';
import axios from 'axios';

const PaymentSection = ({ onComplete, onBack, resumeData }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Mock payment form data
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    
    try {
      // In a real app, you would use a payment processor like Stripe
      // This is just a simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock API call to process payment
      const response = await axios.post('/api/payment/process', {
        paymentMethod,
        amount: 29.99,
        currency: 'USD',
        resumeId: resumeData?.id
      });
      
      if (response.data.success) {
        onComplete();
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment failed:', err);
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Complete Payment</h2>
      
      <div className="mb-6">
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 mb-4">
          <h3 className="text-lg font-medium text-white mb-2">Portfolio Generation</h3>
          <p className="text-gray-300 mb-2">Professional portfolio website created from your resume</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Price</span>
            <span className="text-white font-medium">$29.99</span>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-white">Total</span>
            <span className="text-xl font-bold text-white">$29.99</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              paymentMethod === 'card' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            Credit Card
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              paymentMethod === 'paypal' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setPaymentMethod('paypal')}
          >
            PayPal
          </button>
        </div>
        
        {paymentMethod === 'card' ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="card-number">
                Card Number
              </label>
              <input
                type="text"
                id="card-number"
                name="number"
                placeholder="1234 5678 9012 3456"
                className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={cardData.number}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="card-name">
                Cardholder Name
              </label>
              <input
                type="text"
                id="card-name"
                name="name"
                placeholder="John Doe"
                className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={cardData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="card-expiry">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="card-expiry"
                  name="expiry"
                  placeholder="MM/YY"
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={cardData.expiry}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="card-cvc">
                  CVC
                </label>
                <input
                  type="text"
                  id="card-cvc"
                  name="cvc"
                  placeholder="123"
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={cardData.cvc}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="w-1/3 bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={processing}
                className="w-2/3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Pay $29.99'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <button
              onClick={() => {
                setProcessing(true);
                // Simulate PayPal redirect
                setTimeout(() => {
                  onComplete();
                }, 2000);
              }}
              disabled={processing}
              className="bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Redirecting...' : 'Pay with PayPal'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSection;
