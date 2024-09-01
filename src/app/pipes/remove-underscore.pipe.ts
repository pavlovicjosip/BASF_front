import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnderscore',
  standalone: true,
})
export class RemoveUnderscorePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const words = value.split('_');

    const formattedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    return formattedWords.join(' ');
  }
}
