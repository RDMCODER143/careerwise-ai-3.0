import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const ResumeAnalyzerUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const MAX_RETRIES = 2;
  const WEBHOOK_URL = 'https://prakashgdg.app.n8n.cloud/webhook/resume-intake';

  const handleFiles = async (files: FileList, isRetry: boolean = false) => {
    const file = files[0];
    if (!file || !user || !profile) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    if (!isRetry) {
      setAnalysisComplete(false);
      setRetryCount(0);
    }

    try {
      // Generate unique resume ID for tracking
      const resumeId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('Attempting upload:', {
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        userEmail: user.email,
        userName: profile.full_name,
        resumeId,
        attempt: retryCount + 1,
        webhookUrl: WEBHOOK_URL
      });

      // Create FormData for efficient file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.id);
      formData.append('user_email', user.email || '');
      formData.append('user_name', profile?.full_name || '');
      formData.append('resume_id', resumeId);
      formData.append('filename', file.name);
      formData.append('file_type', file.type);
      formData.append('file_size', file.size.toString());
      formData.append('uploaded_at', new Date().toISOString());
      formData.append('action', 'upload_resume');

      // Send to webhook endpoint with timeout and proper headers
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeoutId);

      console.log('Upload response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No response body');
        console.error(`Upload failed:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
      }

      let result;
      try {
        result = await response.json();
        console.log('Upload successful:', result);
      } catch (e) {
        console.log('Response was not JSON, but upload succeeded');
        result = { success: true };
      }

      setAnalysisComplete(true);
      setRetryCount(0);
      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been sent for analysis. You'll receive feedback shortly.",
      });

    } catch (error) {
      console.error('Resume upload error:', {
        error,
        attempt: retryCount + 1,
        maxRetries: MAX_RETRIES,
        isAbortError: error instanceof Error && error.name === 'AbortError',
        isNetworkError: error instanceof TypeError && error.message.includes('fetch')
      });

      // Handle specific error types
      let errorMessage = "There was an error uploading your resume. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Upload timed out. Please check your internet connection and try again.";
        } else if (error.message.includes('fetch')) {
          errorMessage = "Network error: Unable to connect to the upload server. Please check your internet connection.";
        } else {
          errorMessage = error.message;
        }
      }

      // Retry logic for network errors
      if (retryCount < MAX_RETRIES && (
        error instanceof TypeError || 
        (error instanceof Error && error.name === 'AbortError')
      )) {
        setRetryCount(prev => prev + 1);
        toast({
          title: `Upload failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`,
          description: `Retrying in 2 seconds... ${errorMessage}`,
          variant: "destructive",
        });
        
        setTimeout(() => {
          handleFiles(files, true);
        }, 2000);
        return;
      }

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const resetUpload = () => {
    setAnalysisComplete(false);
    setRetryCount(0);
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Authentication Required</p>
          <p className="text-muted-foreground">Please sign in to analyze your resume.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analysisComplete ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analysis Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Your resume has been successfully submitted for analysis. You'll receive detailed feedback and insights shortly.
            </p>
            <Button onClick={resetUpload} variant="outline">
              Analyze Another Resume
            </Button>
          </div>
        ) : (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            } ${uploading ? "pointer-events-none opacity-50" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleInputChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center gap-4">
              {uploading ? (
                <>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uploading your resume...
                    {retryCount > 0 && ` (Retry ${retryCount}/${MAX_RETRIES})`}
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, DOC, and DOCX files up to 10MB
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your resume will be analyzed and you'll receive detailed feedback
                    </p>
                  </div>
                  <Button variant="outline" disabled={uploading}>
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
