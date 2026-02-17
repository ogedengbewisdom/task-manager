import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.css',
})
export class SearchInput implements OnInit{
  @Input() searchValue = '';
  @Output() search = new EventEmitter<string>();
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef$ = inject(DestroyRef);

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((param) => {
      this.searchValue = param['title'] || '';
      
    })
  }
  onSearch(value: string): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { title: value || null },  // null removes param if empty
      queryParamsHandling: 'merge'
    });
  }

}
