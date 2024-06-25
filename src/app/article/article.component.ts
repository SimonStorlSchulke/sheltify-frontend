import { AfterViewInit, Component, Input } from '@angular/core';
import {
  ArticleRowStartSection,
  ArticleSection,
} from './article-sections/article-section-types';
import { TextSectionComponent } from './article-sections/text-section/text-section.component';
import { TextImageSectionComponent } from './article-sections/text-image-section/text-image-section.component';
import { HeroSectionComponent } from './article-sections/hero-section/hero-section.component';
import { ImageSectionComponent } from './article-sections/image-section/image-section.component';
import { AnimalCardsSectionComponent } from './article-sections/animal-cards-section/animal-cards-section.component';
import { ButtonLinkSectionComponent } from './article-sections/button-link-section/button-link-section.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    TextSectionComponent,
    TextImageSectionComponent,
    HeroSectionComponent,
    ImageSectionComponent,
    AnimalCardsSectionComponent,
    ButtonLinkSectionComponent,
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements AfterViewInit {
  @Input({ required: true }) sections!: ArticleSection[];

  ngAfterViewInit() {
    const rowStartTags =
      document.querySelectorAll<HTMLElement>('.article-rows');
    rowStartTags.forEach((rowStart) => {
      const columns: number = +rowStart.getAttribute('data-columns')!;
      rowStart.append(...this.getNextNSiblings(rowStart, columns));
    });
  }

  getNextNSiblings(element: HTMLElement, siblingNum: number): ChildNode[] {
    let siblings = [];
    let sibling = element.nextSibling;

    while (sibling && siblings.length < siblingNum) {
      if (sibling.nodeType === Node.ELEMENT_NODE) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }

    return siblings;
  }

  rowStartTag = `<div class="row">`;
  rowEndTag = `</div>`;

  columnIndex = 0;

  setRowColumnIndex(rowStartSection: ArticleRowStartSection): boolean {
    this.columnIndex = rowStartSection.columns;
    return true;
  }

  decrementRowColumnIndex(): boolean {
    if (this.columnIndex > 0) {
      this.columnIndex -= 1;
    }
    return true;
  }
}
