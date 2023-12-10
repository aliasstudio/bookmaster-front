import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BookReturnPageComponent } from "@app/book-return/book-return-page/book-return-page.component";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-dialog-extend-book',
  templateUrl: './dialog-extend-book.component.html',
  styleUrls: ['./dialog-extend-book.component.scss']
})
export class DialogExtendBookComponent {
  constructor(
    public dialogRef: MatDialogRef<BookReturnPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  formGroup = new FormGroup({
    returnUntil: new FormControl(this.data?.returnUntil),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }
}
