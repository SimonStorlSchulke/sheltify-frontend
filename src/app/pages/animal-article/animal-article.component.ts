import { Component, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AnimalArticle, AnimalArticleService } from '../../services/animal-article.service';
import { ActivatedRoute } from '@angular/router';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextSectionComponent } from '../../article/article-sections/text-section/text-section.component';
import { TextImageSectionComponent } from '../../article/article-sections/text-image-section/text-image-section.component';
import { Animal } from '../../shared/shared-types';
import { ArticleComponent } from '../../article/article.component';
import { StrapiImagePipe } from "../../article/article-sections/strapi-image.pipe";

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
        StrapiImagePipe
    ]
})
export class AnimalArticleComponent {
  activatedRoute = inject(ActivatedRoute);

  article?: AnimalArticle;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
      .subscribe(({ animalArticle }) => {
        console.log(animalArticle)
        this.article = animalArticle;
      });
  }


  protected getNameList(animals: Animal[]): string {
    const names = animals.map(animal => animal.name);
    if (names.length == 1) {
      return names[0];
    }
    if (names.length == 2) {
      return `${names[0]} & ${names[1]}`;
    }
    return names.slice(0, -1).join(", ") + ` & ${names[names.length - 1]}`;
  }
}
