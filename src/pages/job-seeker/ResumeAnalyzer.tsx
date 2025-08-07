
import React from 'react';
import AppSidebar from '@/components/AppSidebar';
import { ResumeAnalyzerUpload } from '@/components/ResumeAnalyzerUpload';

const ResumeAnalyzer: React.FC = () => {
  return (
    <div className="flex h-screen bg-gradient-subtle font-poppins">
      <AppSidebar userRole="job_seeker" />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-hero text-white p-6 shadow-elegant">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Resume Analyzer</h1>
            <p className="text-white/90 text-lg">
              Upload your resume for detailed analysis and feedback
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <ResumeAnalyzerUpload />
        </div>
      </main>
    </div>
  );
};

export default ResumeAnalyzer;
