import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITask, TaskStatus } from '../interfaces';
import { BehaviorSubject, distinctUntilChanged, Observable, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TASKS } from '../../utils';
import { CommonModule, Location } from '@angular/common';
import { TaskService } from '../services/task-service';
import { StateService } from '../services/state-service';
import { DisplayError } from '../../shared/components/display-error/display-error';
import { Loader } from '../../shared/components/loader/loader';
import { Button } from "../../shared/components/button/button";

@Component({
  selector: 'app-task-detail-component',
  imports: [CommonModule, Loader, DisplayError, Button],
  templateUrl: './task-detail-component.html',
  styleUrl: './task-detail-component.css',
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private destroyRef$ = inject(DestroyRef);
  private taskService = inject(TaskService);
  private stateService = inject(StateService);
  // private taskArray = TASKS;
  task$ = new BehaviorSubject<ITask | undefined>(undefined);
  error$ = new BehaviorSubject<string | null>(null);
  statusCode$ = new BehaviorSubject<number | null>(null);
  state$ = this.stateService.state$;
  interval: any;

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {

    this.getTaskDetailById();
  };

  getTaskDetailById() {
    this.activatedRoute.params.pipe(distinctUntilChanged(), switchMap((param) => {
      return this.getTaskDetail(param['id'])
    }), takeUntilDestroyed(this.destroyRef$)).subscribe({
      next: (task) => {
        this.task$.next(task);
      },
      error: (error) => {
        // console.log('error', error);
        this.stateService.setError(error.message, error.statusCode);
      }
    });
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks/edit', id]);
  }

  ngOnDestroy(): void {
    this.stateService.resetSuccessAndError();
    this.error$.next(null);
    this.statusCode$.next(null);
    clearInterval(this.interval);
  }

  getTaskDetail(id: number): Observable<ITask | undefined> {
    // return this.taskArray.find((task) => task.id === id);
    return this.taskService.getTaskDetail(id)
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).pipe(takeUntilDestroyed(this.destroyRef$)).subscribe({
      next: () => {
        this.stateService.setSuccess('Task deleted successfully', 200);

      this.interval = setInterval(() => {
          this.router.navigate(['/tasks']);
        }, 3000);
      },
      error: (error) => {
        this.error$.next(error.message);
        this.statusCode$.next(error.statusCode);
      }
    })
  }

  markAsCompleted(id: number): void {
    this.taskService.markTaskAsCompleted(id).pipe(takeUntilDestroyed(this.destroyRef$)).subscribe({
      next: () => {
        this.stateService.setSuccess('Task marked as completed successfully', 200);
        this.getTaskDetailById();
      },
      error: (error) => {
        this.error$.next(error.message);
        this.statusCode$.next(error.statusCode);
      }
    })
  };

  markAsInProgress(id: number): void {
    this.taskService.markTaskAsInProgress(id).pipe(takeUntilDestroyed(this.destroyRef$)).subscribe({
      next: () => {
        this.stateService.setSuccess('Task marked as in progress successfully', 200);
        this.getTaskDetailById();
      },
    })
  }

  // ng

  isOverdue(task: ITask): boolean {
    if (task.status === TaskStatus.COMPLETED) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }
}
