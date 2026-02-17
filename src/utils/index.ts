import { ITask, TaskPriority, TaskStatus } from '../tasks/interfaces';

export const NAV_LINKS: {  routerLink: string; label: string; exact: boolean }[] = [
    { routerLink: '/', label: 'home', exact: true },
    { routerLink: '/tasks', label: 'tasks', exact: true },
    { routerLink: '/tasks/new', label: 'create task', exact: false }
  ];

  export const TASKS: ITask[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'This is the first task that needs to be done by the user to complete the task manager app successfully by the end of the week.',
      priority: TaskPriority.LOW,
      status: TaskStatus.PENDING,
      dueDate: '2026-01-01',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'This is the second task that needs to be done by the user to complete the task manager app successfully by the end of the week.',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2026-01-02',
      createdAt: '2026-01-02',
      updatedAt: '2026-01-02',
    },
    {
      id: 3,
      title: 'Task 3 is a long title that needs to be truncated',
      description: 'This is the third task that needs to be done by the user to complete the task manager app successfully by the end of the week.',
      priority: TaskPriority.HIGH,
      status: TaskStatus.COMPLETED,
      dueDate: '2026-01-03',
      createdAt: '2026-01-03',
      updatedAt: '2026-01-03',
    },
  ]

  export class CustomError extends Error {
    statusCode: number;
    originalError?: any;
    constructor(message: string, statusCode: number, originalError?: any) {
      super(message);
      this.statusCode = statusCode;
      this.originalError = originalError;
  
      this.name = 'CustomError';
  
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }

  export interface IStateProps {
    loader: boolean;
    error: string | null;
    statusCode: number | null;
    success: string | null;
  }