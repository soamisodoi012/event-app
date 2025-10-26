import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading">
      <div>{message}</div>
    </div>
  );
};

export default LoadingSpinner;