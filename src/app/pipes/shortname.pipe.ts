import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortname'
})
export class ShortnamePipe implements PipeTransform {

  transform(value: string, ...args: number[]): string {

    let names = value.split(' ');
    let shortenedName = '';

    if (names.length > 1) {
      shortenedName = names[0] + ' ' + names[names.length - 1];
    } else {
      shortenedName = names[0];
    }

    if (shortenedName.length > 20) {
      shortenedName = shortenedName.slice(0, 17) + '...';
    }

    return shortenedName;
  }

}
