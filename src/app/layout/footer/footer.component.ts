import { Component, inject } from "@angular/core";
import { StrapiService } from "../../services/strapi.service";
import { StrapiMedia } from "../../shared/shared-types";
import { ArticleComponent, ArticleSection } from "../../article/article.component";
import { AsyncPipe } from "@angular/common";
import { switchMap } from "rxjs";
import { RouterLink } from "@angular/router";
import { StrapiMediaPipe } from "../../article/article-sections/strapi-image.pipe";
import { IconComponent } from "../../shared/icon/icon.component";
import { PaypalButtonSectionComponent } from "../../article/article-sections/paypal-button-section/paypal-button-section.component";
import { CookiebannerService } from "app/cookiebanner/cookiebanner.service";

type FooterDataBannerData = {
  documentId: string;
  background: StrapiMedia;
  article: ArticleSection[];
};

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [AsyncPipe, ArticleComponent, RouterLink, StrapiMediaPipe, IconComponent, PaypalButtonSectionComponent],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
})
export class FooterComponent {
  strapiSv = inject(StrapiService);
  cookiebannerSv = inject(CookiebannerService);

  footerData$ = this.strapiSv.get<FooterDataBannerData[]>("footer-banners").pipe(
    switchMap((footers) => {
      const footerIds = footers.map((footerData) => footerData.documentId);
      let randomId = footerIds[Math.floor(Math.random() * footerIds.length)];
      return this.strapiSv.get<FooterDataBannerData>(`footer-banners/${randomId}?populate=*`);
    }),
  );
}
