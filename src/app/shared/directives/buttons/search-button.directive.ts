import { Directive } from '@angular/core';
import { BaseButtonDirective } from '@app/shared/directives/buttons/base-button.directive';
import { PlainObject } from '@ngxs/store/internals';

@Directive({
  selector: 'button[appSearchGridButton]',
})
export class SearchGridButtonDirective<
  T extends PlainObject,
> extends BaseButtonDirective {
  readonly iconClass = 'icon-search';
  readonly text = 'Поиск';
}
