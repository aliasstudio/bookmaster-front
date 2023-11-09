import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Dictionary } from '@app/core/models/dictionary';
import { BehaviorSubject, Observable, take, takeUntil, tap } from 'rxjs';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { DestroyService } from '@app/core/services/destroy.service';
import * as _ from 'lodash';
import { MatSelect } from '@angular/material/select';
import { provideValueAccessor } from '@app/core/utils/functions';

@Component({
  selector: 'app-mat-select-search',
  templateUrl: './mat-select-search.component.html',
  styleUrls: ['./mat-select-search.component.scss'],
  providers: [provideValueAccessor(MatSelectSearchComponent), DestroyService],
})
export class MatSelectSearchComponent<T extends Dictionary<string | number>>
  implements ControlValueAccessor, Validator, OnInit, AfterViewInit
{
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  @Input() placeholder: string;
  @Input() binding: Observable<T[]>;
  @Input() items: T[];

  // выбранные значения
  control: FormControl = new FormControl<T[]>([]);

  // хранит текст
  protected searchControl: FormControl = new FormControl('');
  // отфильтрованные элементы
  protected filteredItems: BehaviorSubject<T[]> = new BehaviorSubject([]);

  protected onChange = _.noop;
  protected onTouched = _.noop;

  private destroy$ = inject(DestroyService);

  ngOnInit(): void {
    if (this.binding) {
      this.binding
        .pipe(
          tap((value: T[]) => {
            this.items = value;
            this.filteredItems.next([...this.items]);
          }),
        )
        .subscribe();
    } else {
      this.filteredItems.next([...this.items]);
    }

    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: T[]) => {
        this.onChange(val);
        this.onTouched();
      });

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.filterValue();
      });
  }

  ngAfterViewInit(): void {
    this.filteredItems.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
      this.multiSelect.compareWith = (a: T, b: T) =>
        a && b && a.name === b.name;
    });
  }

  writeValue(val: T[]): void {
    this.control.reset(val, { emitEvent: false });
  }

  registerOnChange(fn): void {
    this.onChange = fn;
  }

  registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.control.disable({ emitEvent: false })
      : this.control.enable({ emitEvent: false });
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.control.errors;
  }

  protected filterValue() {
    if (!this.items) {
      return;
    }

    let search = this.searchControl.value;
    if (!search) {
      this.filteredItems.next([...this.items]);
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredItems.next(
      this.items.filter((item) => item.name.toLowerCase().indexOf(search) > -1),
    );
  }
}
