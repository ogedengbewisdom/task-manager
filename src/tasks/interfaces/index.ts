export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
};

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
};

export interface ITask {
    id: number;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
    dueDate: string;
};

