import { Component, inject } from '@angular/core';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { StrapiService } from '../../services/strapi.service';
import { StrapiMedia } from '../../shared/shared-types';
import { HeroComponent } from '../../shared/hero/hero.component';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import { BlogArticle } from '../../blog/blog.component';
import { BlogTileComponent } from '../../blog/blog-tile/blog-tile.component';
import { AnimalArticleService } from '../../services/animal-article.service';


export const newsResolver: ResolveFn<NewsData> = () => {
  return forkJoin({
    pageData: inject(AnimalArticleService).getAndInsertAnimalLinks<NewsData>("news-page?populate[hero]=*&populate[article][populate]=*"),
    newsData: inject(StrapiService).get<BlogArticle[]>("blogs?sort[1]=publishedAt:desc&populate[thumbnail]=*"),
  }).pipe(map(data => {
    data.pageData.news = data.newsData;
    return data.pageData;
  }))
}


export type NewsData = {
  hero?: StrapiMedia,
  article: ArticleSection[],
  news?: BlogArticle[],
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [HeroComponent, ArticleComponent, BlogTileComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {
  pageData!: NewsData;
  activeFilters = new Set<string>();

  strapiSv = inject(StrapiService);

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ newsData }) => {
        this.pageData = newsData;
      }
    );
  }


  toggleFilter(filterKey: string) {
    if (this.activeFilters.has(filterKey)) {
      this.activeFilters.delete(filterKey);
    } else {
      this.activeFilters.add(filterKey);
    }

    let filterQuery = "";
    for (const filter of this.activeFilters) {
      filterQuery += "&filters[type]=" + filter
    }

    // TODO - Could break when user clicks to fast. Replace with proper rxjs at some point.
    lastValueFrom(this.strapiSv.get<BlogArticle[]>("blogs?populate[thumbnail]=*" + filterQuery))
      .then(news => this.pageData.news = news);

  }

  showAll() {
    this.activeFilters = new Set<string>();
    lastValueFrom(this.strapiSv.get<BlogArticle[]>("blogs?populate[thumbnail]=*"))
      .then(news => this.pageData.news = news);
  }

  isFilterActive(filterKey: string) {
    return this.activeFilters.has(filterKey);
  }
}
