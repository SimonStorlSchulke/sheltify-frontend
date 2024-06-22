import { Component, Input } from '@angular/core';
import { ArticleHeroSection, ArticleTextWithImageSection } from '../article-section-types';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { StrapiImagePipe } from '../strapi-image.pipe';

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