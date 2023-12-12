import { Author } from '@app/shared/models/author';
import { Identifiable } from '@app/core/models/identifable';
import { Dictionary } from '@app/core/models/dictionary';
import { Cover } from '@app/shared/models/cover';

export interface Book extends Identifiable<string> {
  title: string;
  subTitle: string;
  covers: Cover[];
  firstPublishDate: string;
  description: string;
  authors: Author[];
  subjects: Dictionary<number>[];
}
