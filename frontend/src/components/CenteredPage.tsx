import React from 'react';

interface CenteredPageProps {
  children: React.ReactNode;
}

const CenteredPage: React.FC<CenteredPageProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default CenteredPage; 