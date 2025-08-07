
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Pick a date and time"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeValue, setTimeValue] = useState(
    value ? format(value, 'HH:mm') : '09:00'
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onChange(undefined);
      return;
    }

    // Combine selected date with current time
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(hours, minutes, 0, 0);
    
    onChange(newDateTime);
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    
    if (value) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDateTime = new Date(value);
      newDateTime.setHours(hours, minutes, 0, 0);
      onChange(newDateTime);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(value, "PPP 'at' HH:mm")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </div>
          <div className="p-3 space-y-2">
            <Label htmlFor="time" className="text-sm font-medium">Time</Label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={timeValue}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
