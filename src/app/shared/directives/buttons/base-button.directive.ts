import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Directive({
  selector: 'button[appButton]',
})
export class BaseButtonDirective implements OnInit {
  @HostBinding('class') private get hostClass(): string {
    return this.altColor ? 'green-text-button' : 'green-button';
  }

  @Input() altColor: boolean;
  @Input() iconClass: string;
  @Input() text: string;

  constructor(protected button: MatButton) {}

  ngOnInit() {
    const iconClass = this.iconClass;
    let content = this.text ?? '';

    if (iconClass) {
      content = `<span class="${iconClass}"></span>` + content;
    }

    this.button._elementRef.nativeElement.innerHTML = content;
  }
}
