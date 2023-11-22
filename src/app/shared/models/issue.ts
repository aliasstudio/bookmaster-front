import { Identifiable } from "@app/core/models/identifable";
import { Customer } from "@app/customers/models/customer";
import { Book } from "@app/shared/models/book";

export interface Issue extends Identifiable<number> {
  dateOfIssue: Date;
  returnUntil: Date;
  dateOfReturn: Date;
  customer: Customer;
  book: Book;
}
