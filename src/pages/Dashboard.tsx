import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTimesheet } from '../contexts/TimesheetContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const Dashboard = () => {
  const { state: authState, logout } = useAuth();
  const { state: timesheetState } = useTimesheet();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'COMPLETED': { text: 'COMPLETED', className: 'bg-status-completed text-white' },
      'INCOMPLETE': { text: 'INCOMPLETE', className: 'bg-status-incomplete text-white' },
      'MISSING': { text: 'MISSING', className: 'bg-status-missing text-white' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.MISSING;
    
    return (
      <Badge className={statusInfo.className}>
        {statusInfo.text}
      </Badge>
    );
  };

  const getActionButton = (timesheet: any) => {
    if (timesheet.status === 'COMPLETED') {
      return (
        <Link to={`/timesheet/${timesheet.id}`}>
          <Button variant="link" className="text-primary p-0">
            View
          </Button>
        </Link>
      );
    } else if (timesheet.status === 'INCOMPLETE') {
      return (
        <Link to={`/timesheet/${timesheet.id}`}>
          <Button variant="link" className="text-primary p-0">
            Update
          </Button>
        </Link>
      );
    } else {
      return (
        <Link to={`/timesheet/${timesheet.id}`}>
          <Button variant="link" className="text-primary p-0">
            Create
          </Button>
        </Link>
      );
    }
  };

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
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Timetracking</h2>
          
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-table-header">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Week #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {timesheetState.timesheets.map((timesheet) => (
                  <tr key={timesheet.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {timesheet.weekNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {timesheet.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {timesheet.totalHours} hours
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(timesheet.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getActionButton(timesheet)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;