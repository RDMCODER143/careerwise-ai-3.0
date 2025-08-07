
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ResumeUploadProps {
  onUploadSuccess?: () => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file || !user) return;

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

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Save resume metadata to database
      const { data: resumeData, error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_path: fileName,
          file_type: file.type,
          file_size: file.size,
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      // Send webhook notification
      try {
        const webhookPayload = {
          user_id: user.id,
          resume_id: resumeData.id,
          filename: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_at: resumeData.uploaded_at,
        };

        const response = await fetch('https://prakashgdg.app.n8n.cloud/webhook-test/resume-intake', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        });

        if (!response.ok) {
          console.warn('Webhook notification failed, but resume upload succeeded');
        }
      } catch (webhookError) {
        console.warn('Webhook notification failed:', webhookError);
        // Don't fail the entire upload if webhook fails
      }

      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been uploaded and is being processed.",
      });

      onUploadSuccess?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume. Please try again.",
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Uploading your resume...</p>
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
                </div>
                <Button variant="outline" disabled={uploading}>
                  Choose File
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
