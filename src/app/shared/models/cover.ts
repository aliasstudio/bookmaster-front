import { Identifiable } from '@app/core/models/identifable';

export interface Cover extends Identifiable<number> {
  coverFile: string;
}
