import { Pipe, PipeTransform } from '@angular/core';
import { LINK } from '@app/core/utils/patterns';

@Pipe({
  name: 'href',
})
export class HrefPipe implements PipeTransform {
  transform(value: string, content?: string): string {
    const link = value?.match(LINK)?.[0];

    return link
      ? `<a href="${link}" target="_blank">${content || 'Перейти'}</a>`
      : value;
  }
}
