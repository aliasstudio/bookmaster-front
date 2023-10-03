import { Identifiable } from '@app/core/models/identifable';

export interface Dictionary<T extends number | string> extends Identifiable<T> {
  name: string;
}
