import { Pipe, PipeTransform } from '@angular/core';
import { Issue } from '@app/shared/models/issue';
import { formatDuration, intervalToDuration } from 'date-fns';
import Russian from 'date-fns/locale/ru';

@Pipe({
  name: 'issueDelay',
})
export class IssueDelayPipe implements PipeTransform {
  transform(issue: Issue): unknown {
    let { dateOfReturn, returnUntil } = issue;
    dateOfReturn = dateOfReturn ? new Date(dateOfReturn) : new Date();
    returnUntil = new Date(returnUntil);
    const delay = formatDuration(
      intervalToDuration({
        start: returnUntil,
        end: dateOfReturn,
      }),
      {
        locale: Russian,
        format: ['years', 'months', 'weeks', 'days', 'hours', 'minutes'],
      },
    );
    return `(${delay})`;
  }
}
