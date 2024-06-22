import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HomeData } from '../../services/resolvers';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StrapiService } from '../../services/strapi.service';
import { AnimalListComponent } from '../../shared/animal-list/animal-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, AnimalListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public homeData!: HomeData;

  query = "pagination[limit]=4&sort[0]=createdAt:desc"

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ homeData }) => {
        this.homeData = homeData;
      }
    );
  }
}
