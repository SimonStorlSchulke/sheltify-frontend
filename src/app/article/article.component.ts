import { Component, Input } from '@angular/core';
import { ArticleSection } from './article-sections/article-section-types';
import { TextSectionComponent } from './article-sections/text-section/text-section.component';
import { TextImageSectionComponent } from './article-sections/text-image-section/text-image-section.component';
import { HeroSectionComponent } from './article-sections/hero-section/hero-section.component';
import { ImageSectionComponent } from './article-sections/image-section/image-section.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    TextSectionComponent,
    TextImageSectionComponent,
    HeroSectionComponent,
    ImageSectionComponent,
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent {
  @Input({ required: true }) sections!: ArticleSection[];
}
