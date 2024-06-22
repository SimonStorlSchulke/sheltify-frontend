import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { StrapiService } from './strapi.service';
import { renderStrapiRichText, richTextJson } from './blockRenderer';
import { ArticleSection } from '../article/article-sections/article-section-types';
import { Animal } from '../shared/shared-types';

export type AnimalArticle = {
  documentId: string,
  customName?: string,
  animals: Animal[],
  sections: ArticleSection[],
}

@Injectable({
  providedIn: 'root'
})
export class AnimalArticleService extends StrapiService {

  getArticleByAnimalName(name: string): Observable<AnimalArticle> {
    return this.getMany<AnimalArticle>(
      `animal-articles?filters[animals][name][$eqi]=${name}&populate[sections][populate]=*&populate[animals][populate][thumbnail]=*&populate[animals][populate][animalKind][populate][icon]=*`)
      .pipe(map(articles => articles[0]))
  }


  renderRichtext() {
    return renderStrapiRichText(richTextJson)
  }


}
