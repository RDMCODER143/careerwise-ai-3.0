
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Resume {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  parsed_at?: string;
}

export const ResumeList: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      setResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: "Error loading resumes",
        description: "There was an error loading your resumes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resume: Resume) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resume.file_path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = resume.filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your resume.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (resume: Resume) => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([resume.file_path]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully.",
      });

      // Refresh the list
      fetchResumes();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your resume.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          My Resumes ({resumes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {resumes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resumes uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium truncate">{resume.filename}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Uploaded {formatDistanceToNow(new Date(resume.uploaded_at))} ago
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(resume.file_size)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {resume.parsed_at && (
                    <Badge variant="secondary" className="text-xs">
                      Processed
                    </Badge>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(resume)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(resume)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
