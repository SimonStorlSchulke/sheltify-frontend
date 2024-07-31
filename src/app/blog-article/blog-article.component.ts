import { Component, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterLink } from '@angular/router';
import { AnimalArticle, AnimalArticleService } from '../services/animal-article.service';
import { MarkdownPipe } from '../pipes/markdown.pipe';
import { TextSectionComponent } from '../article/article-sections/text-section/text-section.component';
import { TextImageSectionComponent } from '../article/article-sections/text-image-section/text-image-section.component';
import { StrapiImagePipe } from '../article/article-sections/strapi-image.pipe';
import { ArticleComponent } from '../article/article.component';
import { AnimalService } from '../services/animal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogArticle } from '../blog/blog.component';



export const blogArticleResolver: ResolveFn<BlogArticle> = (
  route: ActivatedRouteSnapshot,
) => {
  const name = route.paramMap.get('name')!;  //todo null savety
  return inject(AnimalArticleService).getBlogArticle(name).pipe(map(data => {
    data.preselectedAnimalId = data.animals.findIndex(a => a.name.toLocaleLowerCase() == name.toLocaleLowerCase());
    return data;
  }));
}

@Component({
    selector: 'app-animal-article',
    standalone: true,
    templateUrl: './blog-article.component.html',
    styleUrl: './blog-article.component.scss',
    imports: [
        AsyncPipe,
        MarkdownPipe,
        TextSectionComponent,
        TextImageSectionComponent,
        ArticleComponent,
        StrapiImagePipe,
        RouterLink,
        NgIf,
    ]
})
export class BlogArticleComponent {
  activatedRoute = inject(ActivatedRoute);
  animalSv = inject(AnimalService);

  article?: AnimalArticle;

  selectedCv: number = 0;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
      .subscribe(({ animalArticle }) => {
        this.article = animalArticle;
        this.selectedCv = this.article!.preselectedAnimalId;
      });
  }
}
