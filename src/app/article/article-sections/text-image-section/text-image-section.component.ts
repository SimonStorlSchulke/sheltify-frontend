import { Component, Input, OnInit, inject } from '@angular/core';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { StrapiImagePipe } from '../strapi-image.pipe';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { StrapiService } from '../../../services/strapi.service';
import { RichTextNode } from '../../../services/blockRenderer';
import { StrapiImage } from '../../../shared/shared-types';
import { Lightbox } from '@ngx-gallery/lightbox';

export type ArticleTextWithImageSection = {
  __component: 'article-section.text-with-image-section';
  background?: boolean;
  text: RichTextNode[];
  images?: StrapiImage[];
  imagePosition: 'oben' | 'rechts' | 'links' | 'unten';
  gallery: boolean;
};

@Component({
  selector: 'app-text-image-section',
  standalone: true,
  imports: [StrapiRichTextPipe, StrapiImagePipe, GalleryModule],
  templateUrl: './text-image-section.component.html',
  styleUrl: './text-image-section.component.scss',
})
export class TextImageSectionComponent implements OnInit {
  @Input({ required: true }) sectionData!: ArticleTextWithImageSection;
  strapiSv = inject(StrapiService);
  lightbox = inject(Lightbox);

  galleryImages: GalleryItem[] = [];

  ngOnInit() {
    if (!this.sectionData.images || this.sectionData.images?.length < 2) {
      return;
    }
    this.galleryImages = this.sectionData.images.map(
      (strapiImage) =>
        new ImageItem({
          src: this.strapiSv.getImageFormatUrl(strapiImage, 'large'),
          thumb: this.strapiSv.getImageFormatUrl(strapiImage, 'thumbnail'),
          alt: strapiImage.alternativeText,
        }),
    );
  }


  openLightbox(index: number) {
    this.lightbox.open(index);
  }
}
