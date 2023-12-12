import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data-stub',
  templateUrl: './no-data-stub.component.html',
  styleUrls: ['./no-data-stub.component.scss'],
})
export class NoDataStubComponent {
  @Input() display: boolean;
  @Input() title = 'Записи не найдены';
  @Input() subTitle = '';
}
