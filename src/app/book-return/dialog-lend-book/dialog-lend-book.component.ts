import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BookReturnPageComponent } from "@app/book-return/book-return-page/book-return-page.component";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-dialog-lend-book',
  templateUrl: './dialog-lend-book.component.html',
  styleUrls: ['./dialog-lend-book.component.scss']
})
export class DialogLendBookComponent {
  constructor(
    public dialogRef: MatDialogRef<BookReturnPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  formGroup = new FormGroup({
    dateOfIssue: new FormControl(this.data?.dateOfIssue),
    returnUntil: new FormControl(this.data?.returnUntil),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }
}
