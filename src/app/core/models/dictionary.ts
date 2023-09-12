import { Identifiable } from './identifable';

export interface Dictionary<T extends number | string> extends Identifiable<T> {
  name: string;
}
