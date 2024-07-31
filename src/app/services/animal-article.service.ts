import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, merge } from 'rxjs';
import { StrapiService } from './strapi.service';
import { Animal } from '../shared/shared-types';
import { ArticleSection } from '../article/article.component';
import { BlogArticle } from '../blog/blog.component';

export type AnimalArticle = {
  title: string;
  animals: Animal[];
  sections: ArticleSection[];
  preselectedAnimalId: number;
};


@Injectable({
  providedIn: 'root',
})
export class AnimalArticleService extends StrapiService {
  getArticleByAnimalName(name: string): Observable<AnimalArticle> {
    const path = `animal-articles?filters[animals][name][$eqi]=${name}&populate[sections][populate]=*&populate[animals][populate][thumbnail]=*&populate[animals][populate][animalKind][populate][icon]=*`;
    return this.getAndInsertAnimalLinks<AnimalArticle[]>(path).pipe(
      map((articles) => {
        return articles[0];
      }),
    );
  }

  getBlogArticle(id: number): Observable<BlogArticle> {
    const path = `blogs/${id}?populate[artikel][populate]=*`;
    return this.getAndInsertAnimalLinks<BlogArticle>(path).pipe(
      map((articles) => {
        return articles;
      }),
    );
  }

  /** grässlicher Pfusch aber geht erstmal... */
  getAnimalLink(name: string) {
    const url = window.location.href.replace('/tiere/', '/tierartikel/');
    const path = url.split('/');
    path.pop();
    path.push(this.encodeToURL(name));
    return path.join('/');
  }

  getAndInsertAnimalLinks<T>(path: string): Observable<T> {
    return forkJoin({
      originalResponse: this.getAsString(path),
      animalsList: this.get<{ name: string }[]>('animals?fields[0]=name'),
    }).pipe(
      map((data) => {
        let replacedString = data.originalResponse;

        
        // Insert links for all Animalnames in the text following the %Name% syntax
        for (const animal of data.animalsList) {
          replacedString = replacedString.replaceAll(
            `~${animal.name}~`,
            `<a href='${this.getAnimalLink(animal.name)}'>${animal.name}</a>`,
          );
        }
        
        // remove % signs from names that were not found in the animalList
        replacedString = replacedString.replace(/~([^~]*)~/g, '$1');

        return JSON.parse(replacedString) as T;
      }),
    );
  }

  encodeToURL(str: string) {
    return encodeURIComponent(str).replace(/[(){}]/g, function(char) {
        return '%' + char.charCodeAt(0).toString(16).toUpperCase();
    });
}
}
