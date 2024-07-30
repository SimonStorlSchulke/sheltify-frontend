import { Component, inject } from '@angular/core';
import { StrapiService } from '../../services/strapi.service';
import { StrapiImage } from '../../shared/shared-types';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { AsyncPipe } from '@angular/common';
import { switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

type FooterDataBannerData = {
  id: number,
  background: StrapiImage,
  article: ArticleSection[],
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AsyncPipe, ArticleComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  strapiSv = inject(StrapiService);

  footerData$ = this.strapiSv.get<FooterDataBannerData[]>("footer-banners")
  .pipe(
    switchMap(footers => {
      const footerIds = footers.map(footerData => footerData.id);
      let randomId = footerIds[Math.floor(Math.random()*footerIds.length)];
      return this.strapiSv.get<FooterDataBannerData>(`footer-banners/${randomId}?populate=*`)
    })
  );

}
