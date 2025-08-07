
import { Candidate } from "@/hooks/useCandidates";

export const exportCandidatesToCSV = (candidates: Candidate[], jobPostings: any[]) => {
  const headers = [
    'Full Name',
    'Email',
    'Phone',
    'Location',
    'Position Applied',
    'Status',
    'Match Score',
    'Experience Years',
    'Skills',
    'Applied Date',
    'Resume URL',
    'Cover Letter'
  ];

  const getJobTitle = (jobId: string) => {
    const job = jobPostings.find(j => j.id === jobId);
    return job?.title || 'Unknown Position';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const csvContent = [
    headers.join(','),
    ...candidates.map(candidate => [
      `"${candidate.full_name}"`,
      `"${candidate.email}"`,
      `"${candidate.phone || 'N/A'}"`,
      `"${candidate.location || 'N/A'}"`,
      `"${getJobTitle(candidate.job_posting_id)}"`,
      `"${candidate.status}"`,
      `${candidate.match_score}%`,
      `${candidate.experience_years || 'N/A'}`,
      `"${candidate.skills?.join(', ') || 'N/A'}"`,
      `"${formatDate(candidate.applied_at)}"`,
      `"${candidate.resume_url || 'N/A'}"`,
      `"${candidate.cover_letter ? candidate.cover_letter.substring(0, 100) + '...' : 'N/A'}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `candidates_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
