import { Pipe, PipeTransform, inject } from '@angular/core';
import { StrapiImage } from '../../shared/shared-types';
import { StrapiService } from '../../services/strapi.service';

@Pipe({
  name: 'strapiImage',
  standalone: true,
})
export class StrapiImagePipe implements PipeTransform {
  strapiSv = inject(StrapiService);
  transform(
    value?: StrapiImage,
    ...args: ('thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'original')[]
  ): string {
    return this.strapiSv.getImageFormatUrl(value, args[0] ?? 'large');
    //todo define default image if value is null | undefined
  }
}
