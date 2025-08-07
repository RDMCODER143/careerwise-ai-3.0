
import React from 'react';
import { Navigate } from 'react-router-dom';

const ResumeAnalyzer: React.FC = () => {
  // Redirect to the new resume analyzer within the job seeker dashboard
  return <Navigate to="/resume-analyzer" replace />;
};

export default ResumeAnalyzer;
