import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BookReturnPageComponent } from "@app/book-return/book-return-page/book-return-page.component";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-dialog-return-book',
  templateUrl: './dialog-return-book.component.html',
  styleUrls: ['./dialog-return-book.component.scss']
})
export class DialogReturnBookComponent {
  constructor(
    public dialogRef: MatDialogRef<BookReturnPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  formGroup = new FormGroup({
    dateOfReturn: new FormControl(this.data?.dateOfReturn),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }
}
