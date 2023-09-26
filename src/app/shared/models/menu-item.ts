import { Identifiable } from "../../core/models/identifable";

export interface MenuItem extends Identifiable<string>{
  name: string;
  icon: string;
  link?: string;
}
