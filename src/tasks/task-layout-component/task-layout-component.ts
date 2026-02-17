import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NAV_LINKS } from '../../utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-layout-component',
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './task-layout-component.html',
  styleUrl: './task-layout-component.css',
})
export class TaskLayoutComponent {
  private router = inject(Router);
  protected navLinks = NAV_LINKS;
  isMenuOpen = signal<boolean>(false);

  navigateTo(link: string): void {
    this.router.navigate([link]);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(prev => !prev);
    // console.log('isMenuOpen', this.isMenuOpen());
  }

  logout(): void {
    this.router.navigate(['/']);
  }
}
