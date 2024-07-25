import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, merge } from 'rxjs';
import { StrapiService } from './strapi.service';
import { Animal } from '../shared/shared-types';
import { ArticleSection } from '../article/article.component';

export type AnimalArticle = {
  title: string,
  animals: Animal[],
  sections: ArticleSection[],
  preselectedAnimalId: number,
}

@Injectable({
  providedIn: 'root'
})
export class AnimalArticleService extends StrapiService {

  getArticleByAnimalName(name: string): Observable<AnimalArticle> {
    const path = `animal-articles?filters[animals][name][$eqi]=${name}&populate[sections][populate]=*&populate[animals][populate][thumbnail]=*&populate[animals][populate][animalKind][populate][icon]=*`;
    return this.getAndInsertAnimalLinks<AnimalArticle[]>(`animal-articles?filters[animals][name][$eqi]=${name}&populate[sections][populate]=*&populate[animals][populate][thumbnail]=*&populate[animals][populate][animalKind][populate][icon]=*`)
      .pipe(map(articles => {
        return articles[0];
      }));
  }

  /** grässlicher Pfusch aber geht erstmal... */
  getAnimalLink(name: string) {
    const url = window.location.pathname.replace("/tiere/", "/tierartikel/");
    const path = url.split("/");
    path.pop();
    path.push(name);
    return window.location.origin + path.join("/");
  }

  getAndInsertAnimalLinks<T>(path: string): Observable<T> {
    return forkJoin({
      originalResponse: this.getAsString(path),
      animalsList: this.get<{ name: string }[]>("animals?fields[0]=name")
    })
    .pipe(map((data) => {
      let replacedString = data.originalResponse;

      // Insert links for all Animalnames in the text following the %Name% syntax
      for (const animal of data.animalsList) {
        replacedString = replacedString.replaceAll(`%${animal.name}%`, `<a href='${this.getAnimalLink(animal.name)}'>${animal.name}</a>`);
      }

      // remove % signs from names that were not found in the animalList
      replacedString = replacedString.replace(/%([^%]*)%/g, '$1');

      return JSON.parse(replacedString) as T;
    }));
  }

  
}
