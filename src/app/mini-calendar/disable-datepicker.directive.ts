import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appDisableDatepicker]'
})
export class DisableDatepickerDirective implements OnInit {
  @Input() isDisabled: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.isDisabled) {
      // Disable the ngb-datepicker element
      this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
    }
  }
}

