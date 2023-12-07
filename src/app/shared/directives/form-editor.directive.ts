import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PlainObject } from '@ngxs/store/internals';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControlMap } from '@app/core/models/interfaces';
import { takeUntil } from 'rxjs';
import { DestroyService } from '@app/core/services/destroy.service';
import * as _ from 'lodash';

@Directive()
export class FormEditorDirective<T extends PlainObject>
  implements OnInit, OnChanges
{
  form: FormGroup<T>;
  constructor(
    protected formBuilder: FormBuilder,
    protected destroy$: DestroyService,
    protected changeDetector: ChangeDetectorRef,
  ) {}

  @Input() readOnly: boolean;
  @Input({ required: true }) entity: T | null;
  @Output() saved = new EventEmitter();
  @Output() entityChanges = new EventEmitter();

  get isNew(): boolean {
    return !this.entity?.id;
  }

  get isPristine(): boolean {
    return !this.isNew;
  }

  get canSave(): boolean {
    return this.form.valid && this.hasChanges;
  }

  get hasChanges(): boolean {
    const formValue = _.omit(this.form.getRawValue(), ['id', 'uuid']);

    return !_.isEqual(formValue, _.pick(this.entity, _.keys(formValue)));
  }

  get formControls(): FormControlMap<T> {
    return this.form.controls as FormControlMap<T>;
  }

  ngOnInit(): void {
    this.form = this.initForm();
    this.form.reset(this.entity);
    this.readOnly && this.form.disable();

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.changeDetector.markForCheck());
  }

  private initForm(): FormGroup {
    return this.formBuilder.group(this.resolveForm());
  }

  protected resolveForm(): FormControlMap<T> | {} {
    return {};
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('entity' in changes && !changes.entity.firstChange) {
      const entity = changes.entity.currentValue;

      this.form.reset(entity);
      this.entityChanges.emit(entity);
      this.changeDetector.markForCheck();
    }
  }

  clear(): void {
    this.form.reset();
  }

  save(): void {
    this.saved.emit(this.form.getRawValue());
  }
}
