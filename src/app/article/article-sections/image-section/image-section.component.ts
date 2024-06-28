import { Component, Input, OnInit, inject } from '@angular/core';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { StrapiImagePipe } from '../strapi-image.pipe';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { StrapiService } from '../../../services/strapi.service';
import { StrapiImage } from '../../../shared/shared-types';

export type ArticleImageSection = {
  __component: 'article-section.image';
  title?: string;
  background?: boolean;
  images: StrapiImage[];
};

@Component({
  selector: 'app-image-section',
  standalone: true,
  imports: [StrapiRichTextPipe, StrapiImagePipe, GalleryModule],
  templateUrl: './image-section.component.html',
  styleUrl: './image-section.component.scss'
})
export class ImageSectionComponent implements OnInit {
  @Input({required: true}) sectionData!: ArticleImageSection;
  strapiSv = inject(StrapiService);

  galleryImages: GalleryItem[] = [];

  ngOnInit() {
    this.galleryImages = this.sectionData.images.map((strapiImage) => new ImageItem({
      src: this.strapiSv.getImageFormatUrl(strapiImage, "large"),
      thumb: this.strapiSv.getImageFormatUrl(strapiImage, "thumbnail"),
      alt: strapiImage.alternativeText,
    }));
  }

}