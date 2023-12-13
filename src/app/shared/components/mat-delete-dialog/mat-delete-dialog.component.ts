import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-mat-delete-dialog',
  templateUrl: './mat-delete-dialog.component.html',
  styleUrls: ['./mat-delete-dialog.component.scss'],
})
export class MatDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}
}
