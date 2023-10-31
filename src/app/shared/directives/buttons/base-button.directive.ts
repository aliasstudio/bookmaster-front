import {
  Directive,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { MatButton } from '@angular/material/button';

@Directive({
  selector: 'button[appButton]',
})
export class BaseButtonDirective implements OnInit, OnChanges {
  @HostBinding('class') protected get hostClass(): string {
    return this.altColor ? 'green-text-button' : 'green-button';
  }

  @Input() altColor: boolean;
  @Input() iconClass: string;
  @Input() text: string;

  constructor(protected button: MatButton) {}

  ngOnInit() {
    this.renderButton();
  }

  ngOnChanges(): void {
    this.renderButton();
  }

  renderButton(): void {
    const iconClass = this.iconClass;
    let content = this.text ?? '';

    if (iconClass) {
      content = `<span class="${iconClass}"></span>` + content;
    }

    this.button._elementRef.nativeElement.innerHTML = content;
  }
}
