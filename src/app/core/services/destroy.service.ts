import { Observable, ReplaySubject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class DestroyService extends Observable<void> implements OnDestroy {
  private readonly destroy$ = new ReplaySubject<void>(1);

  constructor() {
    super((subscriber) => this.destroy$.subscribe(subscriber));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
