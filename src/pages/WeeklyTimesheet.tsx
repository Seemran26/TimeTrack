import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTimesheet, TimeEntry, Timesheet, calculateStatus } from '../contexts/TimesheetContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';

const WeeklyTimesheet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { getTimesheetById, updateTimesheet } = useTimesheet();
  
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [totalHours, setTotalHours] = useState(0);

  // Define generateDefaultEntries before it's used
  const generateDefaultEntries = (): TimeEntry[] => {
    const dates = ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5'];
    return dates.map((date, index) => ({
      id: `${timesheet?.id || 'temp'}-${index + 1}`,
      date,
      project: 'Bug Fixes',
      hours: 0,
      description: 'Fix authentication issues'
    }));
  };

  useEffect(() => {
    if (id) {
      const ts = getTimesheetById(id);
      if (ts) {
        setTimesheet(ts);
        setEntries(ts.entries.length > 0 ? ts.entries : generateDefaultEntries());
      }
    }
  }, [id, getTimesheetById]);

  useEffect(() => {
    const total = entries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    setTotalHours(total);
  }, [entries]);

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!timesheet) {
    return <div>Loading...</div>;
  }


  const addNewTask = (dayIndex: number) => {
    const newEntry: TimeEntry = {
      id: `${timesheet.id}-${Date.now()}`,
      date: entries[dayIndex]?.date || `Day ${dayIndex + 1}`,
      project: 'Bug Fixes',
      hours: 0,
      description: 'Fix authentication issues'
    };
    
    const newEntries = [...entries];
    newEntries.splice(dayIndex + 1, 0, newEntry);
    setEntries(newEntries);
  };

  const removeTask = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const updateEntry = (entryId: string, field: keyof TimeEntry, value: string | number) => {
    setEntries(entries.map(entry => 
      entry.id === entryId ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSave = () => {
    const status = calculateStatus(totalHours);
    
    const updatedTimesheet: Timesheet = {
      ...timesheet,
      entries,
      totalHours,
      status
    };
    
    updateTimesheet(updatedTimesheet);
    navigate('/dashboard');
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Timetrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {authState.user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header section */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">This week's timetracking</h2>
              <p className="text-muted-foreground">{timesheet.startDate}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{totalHours}/40</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
          </div>

          {/* Timesheet form */}
          <div className="bg-card rounded-lg border border-primary/20 p-6 space-y-6">
            {Object.entries(groupedEntries).map(([date, dayEntries]) => (
              <div key={date} className="space-y-4">
                <h3 className="font-medium text-foreground border-b border-border pb-2">
                  {date}
                </h3>
                
                {dayEntries.map((entry, entryIndex) => (
                  <div key={entry.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">
                      <Input
                        value={entry.description}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                        placeholder="Task description"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={entry.hours}
                        onChange={(e) => updateEntry(entry.id, 'hours', parseFloat(e.target.value) || 0)}
                        placeholder="Hours"
                        min="0"
                        max="24"
                        step="0.5"
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTask(entry.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Add new task button */}
                <Button
                  variant="link"
                  onClick={() => addNewTask(Object.keys(groupedEntries).indexOf(date))}
                  className="text-primary p-0 h-auto font-normal"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add new task
                </Button>
              </div>
            ))}

            {/* Action buttons */}
            <div className="flex justify-between pt-6 border-t border-border">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover">
                Save & Submit
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default WeeklyTimesheet;