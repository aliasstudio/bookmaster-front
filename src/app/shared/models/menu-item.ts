import { Identifiable } from '@app/core/models/identifable';

export interface MenuItem extends Identifiable<string> {
  name: string;
  icon: string;
  link?: string;
}
