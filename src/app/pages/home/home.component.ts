import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StrapiService } from '../../services/strapi.service';
import { AnimalListComponent } from '../../shared/animal-list/animal-list.component';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { HeroComponent } from '../../shared/hero/hero.component';
import { StrapiImage } from '../../shared/shared-types';
import { AnimalArticleService } from '../../services/animal-article.service';
import { Observable } from 'rxjs';
import { BlogArticle } from '../../blog/blog.component';
import { BlogTileComponent } from '../../blog/blog-tile/blog-tile.component';

export type HomeData = {
  bannerText: string,
  hero: StrapiImage,
  article: ArticleSection[],
}

export const homeResolver: ResolveFn<HomeData> = () => {
  return inject(AnimalArticleService).getAndInsertAnimalLinks<HomeData>("home?populate[hero]=*&populate[article][populate]=*");
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, AnimalListComponent, ArticleComponent, HeroComponent, BlogTileComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  homeData!: HomeData;
  newsData$?: Observable<BlogArticle[]>;

  query = "pagination[limit]=4&sort[0]=createdAt:desc"

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ homeData }) => {
        this.homeData = homeData;
      }
    );

    this.newsData$ = inject(StrapiService).get<BlogArticle[]>("blogs?populate[thumbnail]=*");

  }
}
