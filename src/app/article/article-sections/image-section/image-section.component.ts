import { Component, Input, OnInit, inject } from '@angular/core';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { StrapiMediaPipe } from '../strapi-image.pipe';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { StrapiService } from '../../../services/strapi.service';
import { StrapiMedia } from '../../../shared/shared-types';
import { LightboxService } from '../../../services/lightbox.service';
import { StrapiMediaComponent } from '../../../shared/strapi-media/strapi-media.component';

export type ArticleImageSection = {
  __component: 'article-section.image';
  background?: "nein" | "grün" | "beige";
  images: StrapiMedia[];
  gallery: boolean;
};

@Component({
  selector: 'app-image-section',
  standalone: true,
  imports: [StrapiRichTextPipe, StrapiMediaPipe, GalleryModule, StrapiMediaComponent],
  templateUrl: './image-section.component.html',
  styleUrl: './image-section.component.scss'
})
export class ImageSectionComponent implements OnInit {
  @Input({required: true}) sectionData!: ArticleImageSection;
  strapiSv = inject(StrapiService);
  lightboxSv = inject(LightboxService);

  galleryImages: GalleryItem[] = [];

  ngOnInit() {
    this.galleryImages = this.sectionData.images?.map((strapiImage) => new ImageItem({
      src: this.strapiSv.getImageFormatUrl(strapiImage, "large"),
      thumb: this.strapiSv.getImageFormatUrl(strapiImage, "thumbnail"),
      alt: strapiImage.alternativeText,
    }));
  }
}