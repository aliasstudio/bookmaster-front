import { Injectable } from '@angular/core';
import { State, Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';

export class AppStateModel {}

@State<AppStateModel>({
  name: 'app',
})
@Injectable()
export class AppState {
  constructor(private store: Store, private http: HttpClient) {}
}
