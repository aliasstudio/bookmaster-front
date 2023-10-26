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
import { FormControlMap } from '@app/core/models/form-control-map';
import { takeUntil } from 'rxjs';
import { DestroyService } from '@app/core/services/destroy.service';

@Directive()
export class FormEditorDirective<T extends PlainObject>
  implements OnInit, OnChanges
{
  form: FormGroup;
  constructor(
    protected formBuilder: FormBuilder,
    protected destroy$: DestroyService,
    protected changeDetector: ChangeDetectorRef,
  ) {
    this.form = this.initForm();
  }

  @Input({ required: true }) entity: T | null;
  @Output() saved = new EventEmitter();

  get isNew(): boolean {
    return !this.entity?.id;
  }

  get canSave(): boolean {
    return this.form.valid;
  }

  ngOnInit(): void {
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
    if ('entity' in changes) {
      this.form.reset(changes.entity.currentValue);
    }
  }

  protected clear(): void {
    this.form.reset();
  }

  protected save(): void {
    this.saved.emit(this.form.value);
  }
}
