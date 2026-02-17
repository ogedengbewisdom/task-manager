import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  @Output() onClick = new EventEmitter<void>();
  @Input() buttonText!: string;
  @Input() isDisabled: boolean = false;
}
