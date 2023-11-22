import { Pipe, PipeTransform } from '@angular/core';
import { PHONE } from '@app/core/utils/patterns';

@Pipe({
  name: 'phone',
})
export class PhonePipe implements PipeTransform {
  transform(value: string | undefined): unknown {
    const parts = value?.match(PHONE);
    if (!parts) {
      return value;
    }
    return `+7(${parts[2]})${parts[3]}-${parts[4]}-${parts[5]}`;
  }
}
