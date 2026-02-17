import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighLightTask]',
})
export class HighLightTask {
  defaultColor = '';

  @Input() hoverColor: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.defaultColor = getComputedStyle(this.el.nativeElement).backgroundColor;
   }


  @HostListener('mouseenter') onMouseEnter() {
    this.hoverEvent(this.hoverColor);
  };

  @HostListener('mouseleave') onMouseLeave() {
    this.hoverEvent(this.defaultColor)
  }
  hoverEvent(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer')
  }

}
