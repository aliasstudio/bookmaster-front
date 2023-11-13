import { Component } from '@angular/core';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { Author } from '@app/shared/models/author';
import { FormControlMap } from '@app/core/models/interfaces';
import { FormControl, Validators } from '@angular/forms';
import { provideFormEditor } from '@app/core/utils/functions';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.scss'],
  providers: [provideFormEditor(AuthorFormComponent)],
})
export class AuthorFormComponent extends FormEditorDirective<Author> {
  get isNew(): boolean {
    return !this.entity?.uuid;
  }

  resolveForm(): FormControlMap<Author> {
    return {
      uuid: new FormControl(null),
      name: new FormControl(null, Validators.required),
      bio: new FormControl(null),
      birthDate: new FormControl(null),
      deathDate: new FormControl(null),
      wikipedia: new FormControl(null),
    };
  }
}
