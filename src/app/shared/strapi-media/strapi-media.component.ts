import { Component, inject, Input } from '@angular/core';
import { AltTextPipe } from 'app/pipes/alt-text.pipe';
import { GalleryModule } from 'ng-gallery';
import { StrapiMediaPipe } from '../../article/article-sections/strapi-image.pipe';
import { StrapiRichTextPipe } from '../../article/article-sections/strapi-rich-text.pipe';
import { LightboxService } from '../../services/lightbox.service';
import { StrapiService } from '../../services/strapi.service';
import { StrapiMedia } from '../shared-types';
import { LightboxComponent } from '../lightbox/lightbox.component';

@Component({
  selector: 'app-strapi-media',
  standalone: true,
  imports: [StrapiRichTextPipe, StrapiMediaPipe, GalleryModule, LightboxComponent, AltTextPipe],
  templateUrl: './strapi-media.component.html',
  styleUrl: './strapi-media.component.scss'
})
export class StrapiMediaComponent {
  @Input({required: true}) media?: StrapiMedia[] = [];
  @Input() asGallery: boolean = true;
  @Input() imagePosition: string = "solo";
  strapiSv = inject(StrapiService);
  lightboxSv = inject(LightboxService);
}
