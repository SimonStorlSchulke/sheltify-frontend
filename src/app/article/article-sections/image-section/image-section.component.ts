import { Component, Input, OnInit, inject } from '@angular/core';
import { ArticleImageSection } from '../article-section-types';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { StrapiImagePipe } from '../strapi-image.pipe';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { StrapiService } from '../../../services/strapi.service';

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