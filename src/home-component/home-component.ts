import { Component, inject } from '@angular/core';
import { CardComponent } from '../shared/components/card-component/card-component';
import { CommonModule } from '@angular/common';
import { Button } from '../shared/components/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule, CardComponent, Button],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  private router = inject(Router);

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }
}
