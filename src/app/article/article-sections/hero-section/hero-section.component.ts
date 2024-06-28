import { Component, Input } from '@angular/core';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { StrapiImagePipe } from '../strapi-image.pipe';
import { StrapiImage } from '../../../shared/shared-types';

export type ArticleHeroSection = {
  __component: 'article-section.hero';
  title: string;
  background?: boolean;
  hero: StrapiImage;
};

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [StrapiRichTextPipe, StrapiImagePipe],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  @Input({required: true}) sectionData!: ArticleHeroSection;
}