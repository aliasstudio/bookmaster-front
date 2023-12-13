import { Component, ElementRef, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-paginator-page-input',
  templateUrl: './paginator-page-input.component.html',
  styleUrls: ['./paginator-page-input.component.scss'],
})
export class PaginatorPageInputComponent implements OnInit {
  min = 1;
  max: number;

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (this.input) {
      this.input.value = String(value);
    }
    if (value === this._value) {
      return;
    }
    this._value = value;
    this.observable$.next(value);
  }

  observable$ = new BehaviorSubject<number>(this.min);

  private _value = this.min;
  private input: HTMLInputElement;

  constructor(private ref: ElementRef) {}

  ngOnInit() {
    this.input = this.ref.nativeElement.querySelector('input');
  }

  onChanged(event: Event) {
    const rawValue = (event.target as HTMLInputElement).value;
    this.value = rawValue == '' ? this.min : parseInt(rawValue);
  }
}
