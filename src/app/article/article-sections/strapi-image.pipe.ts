import { Pipe, PipeTransform, inject } from '@angular/core';
import { StrapiMedia } from '../../shared/shared-types';
import { StrapiService } from '../../services/strapi.service';

@Pipe({
  name: 'strapiImage',
  standalone: true,
})
export class StrapiMediaPipe implements PipeTransform {
  strapiSv = inject(StrapiService);
  transform(
    value?: StrapiMedia,
    ...args: ('thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'original' | 'video')[]
  ): string {
    if(args[0] == 'video') {
      const d =  this.strapiSv.getVideoUrl(value!);
      console.log("d, d")
      return this.strapiSv.getVideoUrl(value!);
    }
    return this.strapiSv.getImageFormatUrl(value, args[0] ?? 'large');
    //todo define default image if value is null | undefined
  }
}
