import { Component, Input } from '@angular/core';
import { Issue } from '@app/shared/models/issue';
import { formatDuration, intervalToDuration } from 'date-fns';
import Russian from 'date-fns/locale/ru';

@Component({
  selector: 'app-reports-return-until-column',
  templateUrl: './reports-return-until-column.component.html',
  styleUrls: ['./reports-return-until-column.component.scss'],
})
export class ReportsReturnUntilColumnComponent {
  @Input() element: Issue;
  delay?: string;

  get isDelayed() {
    return !!this.delay;
  }

  constructor() {
    setTimeout(() => this.updateDelay());
  }

  updateDelay() {
    let { dateOfReturn, returnUntil } = this.element;
    dateOfReturn = dateOfReturn ? new Date(dateOfReturn) : new Date();
    returnUntil = new Date(returnUntil);
    if (dateOfReturn <= returnUntil) {
      this.delay = null;
      return;
    }
    this.delay = formatDuration(
      intervalToDuration({
        start: returnUntil,
        end: dateOfReturn,
      }),
      {
        locale: Russian,
      },
    );
  }
}
