import { Location } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Button } from '../button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-error',
  imports: [Button],
  templateUrl: './display-error.html',
  styleUrl: './display-error.css',
})
export class DisplayError {
  private location = inject(Location);
  private router = inject(Router);
  @Input() error: string | null = null;
  @Input() statusCode: number | null = null;
  goHome(): void {
    // this.location.back();
    this.router.navigate(['/']);
  }

  // reload(): void {
  //   window.location.reload();
  // }
}
