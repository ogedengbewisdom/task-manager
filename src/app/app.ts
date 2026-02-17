import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar-component/navbar-component';
import { distinctUntilChanged, filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('task-manager');
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef$ = inject(DestroyRef);
  isTaskRoute = signal<boolean>(false);

  ngOnInit(): void {
    // this.isTaskRoute.set(this.router.url.startsWith('/tasks'));
    this.router.events.pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef$), filter((event) => event instanceof NavigationEnd)).subscribe({
      next: event => {
        this.isTaskRoute.set(event.url.startsWith('/tasks'));
      }
    })
  }

  // get isTaskRoute(): boolean {
  //   return this.router.url.startsWith('/tasks');
  // }
}
