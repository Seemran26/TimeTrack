import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface TimeEntry {
  id: string;
  date: string;
  project: string;
  hours: number;
  description: string;
}

export interface Timesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: "COMPLETED" | "INCOMPLETE" | "MISSING";
  entries: TimeEntry[];
  totalHours: number;
}

interface TimesheetState {
  timesheets: Timesheet[];
}

type TimesheetAction =
  | { type: "SET_TIMESHEETS"; payload: Timesheet[] }
  | { type: "UPDATE_TIMESHEET"; payload: Timesheet }
  | { type: "ADD_TIMESHEET"; payload: Timesheet };

// Helper function to determine status based on total hours
export const calculateStatus = (
  totalHours: number
): "COMPLETED" | "INCOMPLETE" | "MISSING" => {
  if (totalHours === 0) return "MISSING";
  if (totalHours >= 40) return "COMPLETED";
  return "INCOMPLETE";
};

const generateSampleTimesheets = (): Timesheet[] => [
  {
    id: "1",
    weekNumber: 1,
    startDate: "1 - 5 January, 2024",
    endDate: "5 January, 2024",
    status: "COMPLETED",
    totalHours: 40,
    entries: [
      {
        id: "1-1",
        date: "Jan 1",
        project: "Bug Fixes",
        hours: 8,
        description: "Fix login authentication bug",
      },
      {
        id: "1-2",
        date: "Jan 2",
        project: "Feature Development",
        hours: 8,
        description: "Implement user dashboard",
      },
      {
        id: "1-3",
        date: "Jan 3",
        project: "Code Review",
        hours: 8,
        description: "Review pull requests",
      },
      {
        id: "1-4",
        date: "Jan 4",
        project: "Unit Testing",
        hours: 8,
        description: "Write unit tests for API",
      },
      {
        id: "1-5",
        date: "Jan 5",
        project: "Documentation",
        hours: 8,
        description: "Update technical documentation",
      },
    ],
  },
  {
    id: "2",
    weekNumber: 2,
    startDate: "8 - 12 January, 2024",
    endDate: "12 January, 2024",
    status: "COMPLETED",
    totalHours: 40,
    entries: [
      {
        id: "2-1",
        date: "Jan 8",
        project: "Feature Development",
        hours: 8,
        description: "Create profile page layout",
      },
      {
        id: "2-2",
        date: "Jan 9",
        project: "Backend Services",
        hours: 8,
        description: "Build user authentication API",
      },
      {
        id: "2-3",
        date: "Jan 10",
        project: "Testing",
        hours: 8,
        description: "Write integration tests",
      },
      {
        id: "2-4",
        date: "Jan 11",
        project: "DevOps",
        hours: 8,
        description: "Setup CI/CD pipeline",
      },
      {
        id: "2-5",
        date: "Jan 12",
        project: "Meeting",
        hours: 8,
        description: "Sprint planning and grooming",
      },
    ],
  },
  {
    id: "3",
    weekNumber: 3,
    startDate: "15 - 19 January, 2024",
    endDate: "19 January, 2024",
    status: "INCOMPLETE",
    totalHours: 25,
    entries: [
      {
        id: "3-1",
        date: "Jan 15",
        project: "Bug Fixes",
        hours: 5,
        description: "Fix password reset issue",
      },
      {
        id: "3-2",
        date: "Jan 16",
        project: "Support",
        hours: 5,
        description: "Handle customer queries",
      },
      {
        id: "3-3",
        date: "Jan 17",
        project: "UX Improvements",
        hours: 5,
        description: "Refactor navigation menu",
      },
      {
        id: "3-4",
        date: "Jan 18",
        project: "Documentation",
        hours: 5,
        description: "Update onboarding guide",
      },
      {
        id: "3-5",
        date: "Jan 19",
        project: "Internal Tools",
        hours: 5,
        description: "Improve admin dashboard",
      },
    ],
  },
  {
    id: "4",
    weekNumber: 4,
    startDate: "22 - 26 January, 2024",
    endDate: "26 January, 2024",
    status: "COMPLETED",
    totalHours: 40,
    entries: [
      {
        id: "4-1",
        date: "Jan 22",
        project: "Frontend",
        hours: 8,
        description: "Implement notification center",
      },
      {
        id: "4-2",
        date: "Jan 23",
        project: "API",
        hours: 8,
        description: "Create analytics endpoint",
      },
      {
        id: "4-3",
        date: "Jan 24",
        project: "Testing",
        hours: 8,
        description: "Regression testing for new features",
      },
      {
        id: "4-4",
        date: "Jan 25",
        project: "Client Meeting",
        hours: 8,
        description: "Demo release to client",
      },
      {
        id: "4-5",
        date: "Jan 26",
        project: "Refactoring",
        hours: 8,
        description: "Clean up old codebase",
      },
    ],
  },
  {
    id: "5",
    weekNumber: 5,
    startDate: "29 January - 2 February, 2024",
    endDate: "2 February, 2024",
    status: "MISSING",
    totalHours: 0,
    entries: [], // No entries logged for this week
  },
];

const timesheetReducer = (
  state: TimesheetState,
  action: TimesheetAction
): TimesheetState => {
  switch (action.type) {
    case "SET_TIMESHEETS":
      return { ...state, timesheets: action.payload };
    case "UPDATE_TIMESHEET":
      return {
        ...state,
        timesheets: state.timesheets.map((ts) =>
          ts.id === action.payload.id ? action.payload : ts
        ),
      };
    case "ADD_TIMESHEET":
      return {
        ...state,
        timesheets: [...state.timesheets, action.payload],
      };
    default:
      return state;
  }
};

interface TimesheetContextType {
  state: TimesheetState;
  updateTimesheet: (timesheet: Timesheet) => void;
  getTimesheetById: (id: string) => Timesheet | undefined;
}

const TimesheetContext = createContext<TimesheetContextType | null>(null);

export const TimesheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(timesheetReducer, {
    timesheets: generateSampleTimesheets(), // Initialize with sample data immediately
  });

  useEffect(() => {
    // Try to load from localStorage on mount
    const storedTimesheets = localStorage.getItem("timesheets");
    if (storedTimesheets) {
      try {
        const timesheets = JSON.parse(storedTimesheets);
        dispatch({ type: "SET_TIMESHEETS", payload: timesheets });
      } catch (error) {
        console.error("Error loading timesheets from localStorage:", error);
        // Keep the sample data if localStorage is corrupted
      }
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever timesheets change
    if (state.timesheets.length > 0) {
      localStorage.setItem("timesheets", JSON.stringify(state.timesheets));
    }
  }, [state.timesheets]);

  const updateTimesheet = (timesheet: Timesheet) => {
    dispatch({ type: "UPDATE_TIMESHEET", payload: timesheet });
  };

  const getTimesheetById = (id: string) => {
    return state.timesheets.find((ts) => ts.id === id);
  };

  const contextValue: TimesheetContextType = {
    state,
    updateTimesheet,
    getTimesheetById,
  };

  return (
    <TimesheetContext.Provider value={contextValue}>
      {children}
    </TimesheetContext.Provider>
  );
};

export const useTimesheet = () => {
  const context = useContext(TimesheetContext);
  if (!context) {
    throw new Error("useTimesheet must be used within a TimesheetProvider");
  }
  return context;
};
