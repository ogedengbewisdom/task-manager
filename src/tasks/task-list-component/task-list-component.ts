import { Component, computed, DestroyRef, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CustomError, TASKS } from '../../utils';
import { ITask, TaskStatus } from '../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { HighLightTask } from '../../shared/directives/high-light-task';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { LoaderService } from '../services/loader-service';
import { Loader } from '../../shared/components/loader/loader';
import { TaskService } from '../services/task-service';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StateService } from '../services/state-service';
import { DisplayError } from '../../shared/components/display-error/display-error';
@Component({
  selector: 'app-task-list-component',
  imports: [CommonModule, HighLightTask, TruncatePipe, Loader, SearchInput, FormsModule, DisplayError],
  templateUrl: './task-list-component.html',
  styleUrl: './task-list-component.css',
})
export class TaskListComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef$ = inject(DestroyRef);
  headers = ['title', 'priority', 'status', 'due date'];
  
  loaderService = inject(LoaderService);
  loader$ = this.loaderService.loader$;

  stateService = inject(StateService);
  state$ = this.stateService.state$;
  taskService = inject(TaskService);
  tasks$ = this.taskService.task$;
  searchTask = signal<string>('');


  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((param) => {
        const search = param['title'] || '';
        return this.taskService.getTasks(search); // ← This now updates taskSubject internally
      }),
      catchError((error: CustomError) => {
        console.log('error', error)
        this.stateService.setError(error.message, error.statusCode);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef$)
    ).subscribe(); // ← No need to handle data here, tasks$ handles it
  }

  ngOnDestroy(): void {
    this.stateService.resetSuccessAndError();
  }

  goBack(): void {
    this.location.back();
  }
  navigateToTask(id: string | number): void {
    this.router.navigate(['/tasks', id], { relativeTo: this.activatedRoute });
  }

  isOverdue(task: ITask): boolean {
    if (task.status === TaskStatus.COMPLETED) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }
}
