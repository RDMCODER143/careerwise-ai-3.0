import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { JobPosting, useJobPostings } from "@/hooks/useJobPostings";

interface EditJobDialogProps {
  job: JobPosting;
  isOpen: boolean;
  onClose: () => void;
}

export const EditJobDialog = ({ job, isOpen, onClose }: EditJobDialogProps) => {
  const { updateJobPosting, isUpdating } = useJobPostings();
  const [formData, setFormData] = useState({
    title: job.title,
    department: job.department,
    location: job.location,
    salary_min: job.salary_min?.toString() || "",
    salary_max: job.salary_max?.toString() || "",
    job_type: job.job_type,
    status: job.status,
    description: job.description || "",
    expires_at: job.expires_at ? new Date(job.expires_at).toISOString().split('T')[0] : "",
  });
  const [requirements, setRequirements] = useState(job.requirements || []);
  const [benefits, setBenefits] = useState(job.benefits || []);
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates = {
      ...formData,
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      requirements,
      benefits,
      expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
    };

    updateJobPosting({ id: job.id, updates }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Posting</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job_type">Job Type</Label>
              <Select value={formData.job_type} onValueChange={(value) => setFormData({ ...formData, job_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_min">Min Salary (₹)</Label>
              <Input
                id="salary_min"
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                placeholder="1200000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary_max">Max Salary (₹)</Label>
              <Input
                id="salary_max"
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                placeholder="1600000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_at">Expiry Date</Label>
            <Input
              id="expires_at"
              type="date"
              value={formData.expires_at}
              onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe the role, responsibilities, and what makes this position exciting..."
            />
          </div>

          {/* Requirements Section */}
          <div className="space-y-3">
            <Label>Requirements</Label>
            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requirements.map((req, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {req}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 ml-2"
                    onClick={() => removeRequirement(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-3">
            <Label>Benefits</Label>
            <div className="flex gap-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <Button type="button" onClick={addBenefit} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {benefit}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 ml-2"
                    onClick={() => removeBenefit(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isUpdating} className="flex-1">
              {isUpdating ? "Updating..." : "Update Job Posting"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
