import { Directive } from '@angular/core';
import { BaseButtonDirective } from '@app/shared/directives/buttons/base-button.directive';

@Directive({
  selector: 'button[appSearchGridButton]',
})
export class SearchGridButtonDirective extends BaseButtonDirective {
  readonly iconClass = 'icon-search';
  readonly text = 'Поиск';
}
