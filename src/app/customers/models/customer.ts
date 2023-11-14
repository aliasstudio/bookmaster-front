import { Identifiable } from "@app/core/models/identifable";

export interface Customer extends Identifiable<string> {
   name: string;
   address: string;
   zip: string;
   city: string;
   phone: string;
   email?: string;
}
