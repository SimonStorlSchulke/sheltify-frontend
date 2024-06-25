import { Component, Input } from '@angular/core';
import { ArticleTextSection } from '../article-section-types';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';

@Component({
  selector: 'app-text-section',
  standalone: true,
  imports: [StrapiRichTextPipe],
  templateUrl: './text-section.component.html',
  styleUrl: './text-section.component.scss',
})
export class TextSectionComponent {
  @Input({ required: true }) sectionData!: ArticleTextSection;
}
