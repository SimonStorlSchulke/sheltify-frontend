import { Component, Input } from '@angular/core';
import { AltTextPipe } from 'app/pipes/alt-text.pipe';
import { StrapiMediaPipe } from '../strapi-image.pipe';
import { StrapiMedia } from '../../../shared/shared-types';

export type ArticleHeroSection = {
  __component: 'article-section.hero';
  background?: "nein" | "grün" | "beige";
  hero: StrapiMedia;
};

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [StrapiMediaPipe, AltTextPipe],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  @Input({required: true}) sectionData!: ArticleHeroSection;
}
