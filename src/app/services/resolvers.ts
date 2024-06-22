import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { AnimalArticle, AnimalArticleService } from './animal-article.service';
import { StrapiService } from './strapi.service';
import { StrapiImage } from '../shared/shared-types';
import { ArticleSection } from '../article/article-sections/article-section-types';

export type HomeData = {
  bannerText: string;
}

export const homeResolver: ResolveFn<HomeData> = () => {
  return inject(StrapiService).getOne<HomeData>("home?populate=*");
}

export type AboutData = {
  hero: StrapiImage,
  article: ArticleSection[],
}

export const aboutResolver: ResolveFn<AboutData> = () => {
  return inject(StrapiService).getOne<AboutData>("about-page?populate[hero]=*&populate[article][populate]=*");
}

export const animalArticleResolver: ResolveFn<AnimalArticle> = (
  route: ActivatedRouteSnapshot,
) => {
  return inject(AnimalArticleService).getArticleByAnimalName(route.paramMap.get('name')!); //todo null savety
}
