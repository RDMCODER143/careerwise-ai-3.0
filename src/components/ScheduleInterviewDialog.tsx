
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useInterviews } from '@/hooks/useInterviews';
import { DateTimePicker } from '@/components/DateTimePicker';
import { Calendar, Video, Phone, User } from 'lucide-react';

const formSchema = z.object({
  scheduled_at: z.date({
    message: "Please select a date and time for the interview.",
  }),
  interview_type: z.string({
    message: "Please select an interview type.",
  }),
  meeting_link: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

interface ScheduleInterviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  jobPostingId: string;
  candidateName: string;
}

export const ScheduleInterviewDialog: React.FC<ScheduleInterviewDialogProps> = ({
  isOpen,
  onClose,
  candidateId,
  jobPostingId,
  candidateName,
}) => {
  const { scheduleInterview, isScheduling } = useInterviews();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interview_type: 'Phone Screen',
      meeting_link: '',
      notes: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    scheduleInterview({
      candidate_id: candidateId,
      job_posting_id: jobPostingId,
      scheduled_at: values.scheduled_at.toISOString(),
      interview_type: values.interview_type,
      meeting_link: values.meeting_link || undefined,
      notes: values.notes || undefined,
      status: 'Scheduled',
    });

    form.reset();
    onClose();
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'Video Call': return <Video className="w-4 h-4" />;
      case 'Phone Screen': return <Phone className="w-4 h-4" />;
      case 'In-Person': return <User className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Interview - {candidateName}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="scheduled_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select date and time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interview_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interview type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Phone Screen" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Screen
                      </SelectItem>
                      <SelectItem value="Video Call" className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video Call
                      </SelectItem>
                      <SelectItem value="In-Person" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        In-Person
                      </SelectItem>
                      <SelectItem value="Technical Round">Technical Round</SelectItem>
                      <SelectItem value="Final Interview">Final Interview</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meeting_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Link (if applicable)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <input
                        {...field}
                        type="url"
                        placeholder="https://meet.google.com/..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Any additional notes for the interview..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isScheduling} className="flex-1">
                {isScheduling ? 'Scheduling...' : 'Schedule Interview'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
