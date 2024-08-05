import { Component, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { AnimalArticle, AnimalArticleService } from '../../services/animal-article.service';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterLink } from '@angular/router';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextSectionComponent } from '../../article/article-sections/text-section/text-section.component';
import { TextImageSectionComponent } from '../../article/article-sections/text-image-section/text-image-section.component';
import { ArticleComponent } from '../../article/article.component';
import { StrapiMediaPipe } from "../../article/article-sections/strapi-image.pipe";
import { AnimalService } from '../../services/animal.service';
import { Title } from '@angular/platform-browser';


export const animalArticleResolver: ResolveFn<AnimalArticle> = (
  route: ActivatedRouteSnapshot,
) => {
  const name = route.paramMap.get('name')!;  //todo null savety
  return inject(AnimalArticleService).getArticleByAnimalName(name).pipe(map(data => {
    data.preselectedAnimalId = data.animals.findIndex(a => a.name.toLocaleLowerCase() == name.toLocaleLowerCase());
    return data;
  }));
}

@Component({
    selector: 'app-animal-article',
    standalone: true,
    templateUrl: './animal-article.component.html',
    styleUrl: './animal-article.component.scss',
    imports: [
        AsyncPipe,
        MarkdownPipe,
        TextSectionComponent,
        TextImageSectionComponent,
        ArticleComponent,
        StrapiMediaPipe,
        RouterLink,
        NgIf,
    ]
})
export class AnimalArticleComponent {
  activatedRoute = inject(ActivatedRoute);
  animalSv = inject(AnimalService);
  titleSv = inject(Title);

  genderNames = new Map<string, string>([
    ["male", "Rüde"],
    ["female", "Hündin"],
    ["other", "Anderes"],
  ])

  article?: AnimalArticle;

  selectedCv: number = 0;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
      .subscribe(({ animalArticle }) => {
        this.article = animalArticle;
        this.selectedCv = this.article!.preselectedAnimalId;
        this.titleSv.setTitle(`${this.getDefaultTitle()} | Herzenshunde Griechenland e.V.`)
      });
  }


  getDefaultTitle(): string {
    if(this.article?.title) return this.article.title;
    const names = this.article?.animals.map(animal => animal.name) ?? [];
    if (names.length == 1) {
      return names[0];
    }
    if (names.length == 2) {
      return `${names[0]} & ${names[1]}`;
    }
    return names.slice(0, -1).join(", ") + ` & ${names[names.length - 1]}`;
  }
  
  getCtoText() {
    const names = this.article?.animals.map(animal => animal.name) ?? [];
    if (names.length == 1) {
      return `Hat ${names[0]} dein Interesse geweckt?`;
    }
    if (names.length == 2) {
      return `Haben ${names[0]} & ${names[1]} dein Interesse geweckt?`;
    }
    return `Hat einer der Hunde dein Interesse geweckt?`;
  }
}
