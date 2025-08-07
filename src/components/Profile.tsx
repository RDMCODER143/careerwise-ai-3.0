
import React from 'react';
import { ResumeUpload } from './ResumeUpload';
import { ResumeList } from './ResumeList';

export const Profile: React.FC = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleUploadSuccess = () => {
    // Trigger a refresh of the resume list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your resume and profile information
        </p>
      </div>

      <div className="grid gap-6">
        <ResumeUpload onUploadSuccess={handleUploadSuccess} />
        <div key={refreshKey}>
          <ResumeList />
        </div>
      </div>
    </div>
  );
};
