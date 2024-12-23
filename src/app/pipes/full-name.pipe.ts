import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName',
  standalone: true
})
export class FullNamePipe implements PipeTransform {

  transform(value: { nombre: string; apellido: string }): string {
    if (!value) return '';
    return `${value.nombre} ${value.apellido}`;
  }
}