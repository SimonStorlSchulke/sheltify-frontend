import { Component, inject } from '@angular/core';
import { StrapiImage } from '../shared/shared-types';
import { ArticleSection, ArticleComponent } from '../article/article.component';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterLink } from '@angular/router';
import { AnimalArticleService } from '../services/animal-article.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type BlogArticle = {
  id: number,
  title: string,
  type: string,
  thumbnail?: StrapiImage,
  description: string,
  artikel: ArticleSection[], //todo rename in strapi
  createdAt: Date,
}


export const blogArticleResolver: ResolveFn<BlogArticle>  = (
  route: ActivatedRouteSnapshot,
) => {
  const id = route.paramMap.get('id')!;  //todo null savety
  return inject(AnimalArticleService).getBlogArticle(+id);
}


@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ArticleComponent, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {

  article?: BlogArticle;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ articleData }) => {
        this.article = articleData;
        console.log(this.article)
      }
    );
  }
}
