import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleComponent, ArticleSection } from '../../article/article.component';

export type DefaultPageData = {
  id: number,
  name: string,
  article: ArticleSection[], //todo rename in strapi
  createdAt: Date,
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ArticleComponent, RouterLink],
  templateUrl: './default-page.component.html',
  styleUrl: './default-page.component.scss'
})
export class DefaultPageComponent {

  pageData?: DefaultPageData;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ pageData }) => {
        this.pageData = pageData;
      }
    );
  }
}
