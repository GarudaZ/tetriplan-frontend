import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appDisableDatepicker]'
})
export class DisableDatepickerDirective implements OnInit {
  @Input() isDisabled: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.isDisabled) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    }
  }
}
