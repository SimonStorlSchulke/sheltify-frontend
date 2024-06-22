import { Component, inject } from '@angular/core';
import { HeroComponent } from '../../shared/hero/hero.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AboutData } from '../../services/resolvers';
import { ArticleComponent } from '../../article/article.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeroComponent, ArticleComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  public aboutData!: AboutData;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ aboutData }) => {
        this.aboutData = aboutData;
      }
    );
  }
}
