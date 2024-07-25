import { Component, Input, OnInit, inject } from '@angular/core';
import { BlogArticle } from '../../../blog/blog.component';
import { Observable } from 'rxjs';
import { StrapiService } from '../../../services/strapi.service';
import { BlogTileComponent } from '../../../blog/blog-tile/blog-tile.component';
import { AsyncPipe } from '@angular/common';

export type ArticleBlogCardsSection = {
  __component: 'article-section.news-cards';
  background?: boolean;
  amount: number,
  type: string,
};


@Component({
  selector: 'app-blog-cards',
  standalone: true,
  imports: [BlogTileComponent, AsyncPipe],
  templateUrl: './blog-cards.component.html',
  styleUrl: './blog-cards.component.scss'
})
export class BlogCardsComponent {
  @Input({required: true}) sectionData!: ArticleBlogCardsSection;

  blogs$?: Observable<BlogArticle[]>;

  constructor() {
    this.blogs$ = inject(StrapiService).get<BlogArticle[]>("blogs?populate[thumbnail]=*");
  }

}
