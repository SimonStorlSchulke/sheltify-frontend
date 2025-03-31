import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'altText',
  standalone: true
})
export class AltTextPipe implements PipeTransform {

  transform(value: string | null | undefined): unknown {
    const suffix = "Herzenshunde Griechenland e.V. für die Vermittlung von Hunden aus Griechenland";
    return value ? `${value} ${suffix}` : suffix;
  }

}
