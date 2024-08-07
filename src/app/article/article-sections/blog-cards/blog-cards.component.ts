import { Component, Input, OnInit, inject } from '@angular/core';
import { BlogArticle } from '../../../blog/blog.component';
import { Observable } from 'rxjs';
import { StrapiService } from '../../../services/strapi.service';
import { BlogTileComponent } from '../../../blog/blog-tile/blog-tile.component';
import { AsyncPipe } from '@angular/common';

export type ArticleBlogCardsSection = {
  __component: 'article-section.news-cards';
  background?: "nein" | "grün" | "beige";
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

  strapiSv = inject(StrapiService);

  ngOnInit() {
    this.blogs$ = this.strapiSv.get<BlogArticle[]>(`blogs?populate[thumbnail]=*&pagination[pageSize]=${this.sectionData.amount}`);
  }

}
