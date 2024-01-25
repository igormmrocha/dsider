import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const QrCodeValidator = ({ question, userEmail, userPhoto, userName}) => {
  
  useEffect(() => {
    validateQrCode();
  }, [userEmail]);

  
  const validateQrCode = async () => {
    try {
      const response = await fetch('/api/validateQrCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({question, userEmail, userPhoto, userName}),
        
      });
      const data = await response.json();
      console.log('Response from validateQrCode:', data);
      // You can handle the response data here
    } catch (error) {
      console.error('Error validating QR code:', error);
    }
  };

  return (
    <div className="mt-8">
      <p>Received Question: {question}</p>
      <p>Received email: {userEmail}</p>
      <p>Received Photo: {userPhoto}</p>
      <p>Received Name: {userName}</p>
    </div>
  );
};


export default QrCodeValidator;
