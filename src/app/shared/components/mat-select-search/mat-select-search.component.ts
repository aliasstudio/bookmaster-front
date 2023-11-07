import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { Dictionary } from '@app/core/models/dictionary';

@Component({
  selector: 'app-mat-select-search',
  templateUrl: './mat-select-search.component.html',
  styleUrls: ['./mat-select-search.component.scss'],
})
export class MatSelectSearchComponent<T extends Dictionary<string | number>>
  implements AfterViewInit
{
  @Input()
  placeholder: string;

  @Input()
  items: T[];

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  // выбранные значения
  @Input()
  control: FormControl = new FormControl([]);

  // хранит текст
  protected searchText: FormControl = new FormControl('');

  // отфильтрованная элементы
  protected filteredItems: BehaviorSubject<T[]> = new BehaviorSubject([]);

  ngAfterViewInit(): void {
    this.filteredItems.next(this.items);
  }

  protected filterWebsiteMulti() {
    if (!this.items) {
      return;
    }

    let search = this.searchText.value;
    this.filteredItems.next(
      this.items.filter(
        (value) => value.name.toLowerCase().indexOf(search) > -1,
      ),
    );
  }
}
