import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SignInWithToken = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, otp }),
      });

      if (!response.ok) {
        throw new Error('Invalid OTP. Please try again.');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      navigate('/trainee/123/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSignIn}>
          <div className="mt-4">
            <label htmlFor="otp" className="block text-gray-700">One-Time Password</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button type="submit" className="mt-4 w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInWithToken;
