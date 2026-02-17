import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { ITask, TaskStatus } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler } from './error-handler';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private httpClient = inject(HttpClient)
  taskSubject = new BehaviorSubject<ITask[]>([]);
  task$ = this.taskSubject.asObservable();
  taskCache: ITask[] | null = null;
  private errorService = inject(ErrorHandler)
  private baseUrl = 'http://localhost:3000';

  getTasks(searchTerm?: string): Observable<ITask[]> {
    if (this.taskCache) {
      const filteredTasks = searchTerm?.trim() 
        ? this.taskCache.filter((task: ITask) => 
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
          ) 
        : this.taskCache;
      
      this.taskSubject.next(filteredTasks);
      return of(filteredTasks);
    }
    return this.httpClient.get<ITask[]>(`${this.baseUrl}/tasks`).pipe(
      map((data) => {
        this.taskCache = data;
        const filteredTasks = searchTerm?.trim() 
          ? data.filter((task: ITask) => 
              task.title.toLowerCase().includes(searchTerm?.toLowerCase())
            ) 
          : data;
        
        this.taskSubject.next(filteredTasks);
        return filteredTasks;
      }), 
      catchError((error) => throwError(() => this.errorService.handleError(error)))
    );
  }

  createTask(task: Partial<ITask>): Observable<ITask> {
    return this.httpClient.post<ITask>(`${this.baseUrl}/tasks`, task).pipe(tap((newTask) => {
      if (this.taskCache) {
        this.taskCache = [...this.taskCache, newTask];
      }
    }))
  }

  deleteTask(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/tasks/${id}`).pipe(tap(() => {
      if (this.taskCache) {
        this.taskCache = this.taskCache.filter((task: ITask) => task.id !== id);
      }
    }))
  }

  updateTask(updatedTask: Partial<ITask>): Observable<ITask> {
    return this.httpClient.put<ITask>(`${this.baseUrl}/tasks/${updatedTask.id}`, updatedTask).pipe(tap((data) => {
      if (this.taskCache) {
        this.taskCache = this.taskCache.map((task: ITask) => task.id === data.id ? data : task);
      }
    }))
  }

  markTaskAsCompleted(id: number): Observable<ITask> {
    return this.httpClient.patch<ITask>(`${this.baseUrl}/tasks/${id}`, {
      status: TaskStatus.COMPLETED
    }).pipe(tap((data) => {
      if (this.taskCache) {
        this.taskCache = this.taskCache.map((task: ITask) => task.id === data.id ? data : task);
      }
    }))
  }

  markTaskAsInProgress(id: number): Observable<ITask> {
    return this.httpClient.patch<ITask>(`${this.baseUrl}/tasks/${id}`, {
      status: TaskStatus.IN_PROGRESS
    }).pipe(tap((data) => {
      if (this.taskCache) {
        this.taskCache = this.taskCache.map((task: ITask) => task.id === data.id ? data : task);
      }
    }))
  }


  getTaskDetail(id: number): Observable<ITask> {
    if (this.taskCache) {
      const task = this.taskCache.find((task: ITask) => task.id === id);

      if (task) {
        
        return of(task);
      }
    }

    return this.httpClient.get<ITask>(`${this.baseUrl}/tasks/${id}`)
  }

}
