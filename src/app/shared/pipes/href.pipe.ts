import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'href',
})
export class HrefPipe implements PipeTransform {
  transform(value: string, content?: string): string {
    const link = value?.match(
      '(http|https):\\/\\/([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])',
    )?.[0];
    return link
      ? `<a href="${link}" target="_blank">${content || 'Перейти'}</a>`
      : value;
  }
}
