import { Author } from "@app/shared/models/author";
import { Identifiable } from "@app/core/models/identifable";

export interface Book extends Identifiable<string> {
  title: string;
  subTitle: string;
  firstPublishDate: string;
  description: string;
  authors: Author[];
}
