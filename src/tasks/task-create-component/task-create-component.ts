import { CommonModule, Location } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ITask, TaskPriority, TaskStatus } from '../interfaces';
import { Button } from '../../shared/components/button/button';
import { TaskService } from '../services/task-service';
import { StateService } from '../services/state-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-task-create-component',
  imports: [CommonModule, FormsModule, Button],
  templateUrl: './task-create-component.html',
  styleUrl: './task-create-component.css',
})
export class TaskCreateComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private stateService = inject(StateService);
  private location = inject(Location);
  private destroyRef$ = inject(DestroyRef);
  state$ = this.stateService.state$;
  @ViewChild('form') form!: NgForm;
  title = '';
  description = '';
  priority = '';
  status = '';
  dueDate = '';
  interval: any;
  task$ = new BehaviorSubject<ITask | undefined>(undefined);

  isEditMode = false;
  taskId!: any;

  todayDate = new Date().toISOString().split('T')[0];
  goBack(): void {
    this.location.back();
  }


  saveTask(): void {
    if (this.isEditMode) {
      this.updateTask();
    } else {
      this.createTask();
    }
  }

  createTask(): void {
    const task: Partial<ITask> = {
      // id: TASKS.length + 1,
      title: this.title,
      description: this.description,
      priority: this.priority as TaskPriority,
      status: this.status as TaskStatus,
      dueDate: this.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.stateService.resetSuccessAndError();
    this.taskService.createTask(task).pipe(takeUntilDestroyed(this.destroyRef$)).subscribe({
      next: () => {
        this.stateService.setSuccess('Task created successfully', 201);
        this.form.reset();
        this.interval = setInterval(() => {
          this.router.navigate(['/tasks']);
        }, 3000);
      },
      error: (error) => {
        this.stateService.setError(error.message, error.statusCode);
      }
    })
  }

  updateTask(): void {

    this.stateService.resetSuccessAndError();
    const updatedTask: Partial<ITask> = {
      id: this.taskId,
      title: this.title,
      description: this.description,
      priority: this.priority as TaskPriority,
      status: this.status as TaskStatus,
      dueDate: new Date(this.dueDate).toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.taskService.updateTask(updatedTask).pipe(
      takeUntilDestroyed(this.destroyRef$)
    ).subscribe({
      next: () => {
        this.stateService.setSuccess('Task updated successfully', 200);
        setTimeout(() => {
          this.router.navigate(['/tasks', this.taskId]);
        }, 3000);
      },
      error: (error) => {
        this.stateService.setError(error.message, error.statusCode);
      }
    });
  }

  ngOnInit(): void {
    this.stateService.resetSuccessAndError();
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef$) , switchMap((param) => {
      if (param['id']) {
        return this.getTaskDetail(param['id'])
      }
      return of(null)
    })).subscribe({
      next: (task) => {
        if (task) {
          this.isEditMode = true;
          this.taskId = task.id;
          this.title = task.title;
          this.description = task.description;
          this.priority = task.priority;
          this.status = task.status;
          this.dueDate = task.dueDate.split('T')[0] || '';
          // this.task$.next(task);
        }
      },
      error: (error) => {
        this.stateService.setError(error.message, error.statusCode);
      }
    });
  }

  getTaskDetail(id: number): Observable<ITask | undefined> {
    return this.taskService.getTaskDetail(id)
  }

  ngOnDestroy(): void {
    this.stateService.resetSuccessAndError();
    clearInterval(this.interval);
  }
}
