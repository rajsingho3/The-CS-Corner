import React, { useState } from "react";
import { Button, TextInput, Label, Alert, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

function OtpVerify({ email }) {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setErrorMessage("OTP must be 6 digits long");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: localStorage.getItem('tempEmail'), 
          otp 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      const data = await response.json();
      localStorage.removeItem('tempEmail'); // Clean up
      navigate('/signin');
      
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-4">
          Please enter the verification code sent to your email
        </p>
        <div className="mb-4">
          <Label value="Enter OTP" />
          <TextInput
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={6}
          />
        </div>
        {errorMessage && (
          <Alert color="failure" className="mb-4">
            {errorMessage}
          </Alert>
        )}
        <Button 
          gradientDuoTone="purpleToPink" 
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="ml-2">Verifying...</span>
            </>
          ) : (
            'Verify OTP'
          )}
        </Button>
      </div>
    </div>
  );
}

export default OtpVerify;
