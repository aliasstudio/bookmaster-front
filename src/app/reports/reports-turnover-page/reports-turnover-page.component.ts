import { Component } from '@angular/core';
import { Issue } from '@app/shared/models/issue';
import { EntityRemoteDataBinding } from '@app/shared/models/databinding';
import { DestroyService } from '@app/core/services/destroy.service';

@Component({
  selector: 'app-reports-turnover-page',
  templateUrl: './reports-turnover-page.component.html',
  styleUrls: ['./reports-turnover-page.component.scss'],
  providers: [DestroyService],
})
export class ReportsTurnoverPageComponent {
  dataBinding: EntityRemoteDataBinding<Issue> = {
    urlRoot: 'issue',
    columns: [
      { name: 'Название книги', key: 'book', customTemplate: true },
      { name: 'Клиент', key: 'customer', customTemplate: true },
      { name: 'Дата и время выдачи', key: 'dateOfIssue' },
      { name: 'Срок сдачи', key: 'returnUntil', customTemplate: true },
    ],
  };
}
