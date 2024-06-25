import { Component, inject } from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { AsyncPipe } from '@angular/common';
import { AnimalTileComponent } from '../../shared/animal-tile/animal-tile.component';
import { HeroComponent } from '../../shared/hero/hero.component';
import { Animal, StrapiFilter, StrapiImage } from '../../shared/shared-types';
import { ArticleTextSection } from '../../article/article-sections/article-section-types';
import { TextSectionComponent } from '../../article/article-sections/text-section/text-section.component';
import { ArticleComponent } from '../../article/article.component';
import { AnimalListComponent } from '../../shared/animal-list/animal-list.component';

@Component({
  selector: 'app-dogs',
  standalone: true,
  imports: [AsyncPipe, AnimalListComponent, HeroComponent, TextSectionComponent, ArticleComponent],
  templateUrl: './dogs.component.html',
  styleUrl: './dogs.component.scss'
})
export class DogsComponent {

  activeFilters = new Set<string>();

  toggleFilter(filterKey: string) {
    if (this.activeFilters.has(filterKey)) {
      this.activeFilters.delete(filterKey);
    } else {
      this.activeFilters.add(filterKey);
    }
  }

  showAll() {
    this.activeFilters = new Set<string>();
  }

  isFilterActive(filterKey: string) {
    return this.activeFilters.has(filterKey);
  }

  getIsVisibleFunction(): (animal: Animal) => boolean {
    return (animal: Animal) => {
      if (this.activeFilters.size == 0) return true;

      if (animal.shoulderHeightCm) {
        if (this.activeFilters.has("small") && animal.shoulderHeightCm <= 35) {
          return true;
        }

        if (this.activeFilters.has("middle") && animal.shoulderHeightCm > 35 && animal.shoulderHeightCm <= 45) {
          return true;
        }

        if (this.activeFilters.has("large") && animal.shoulderHeightCm > 45) {
          return true;
        }

        if (this.activeFilters.has("male") && animal.gender == "male") {
          return true;
        }

        if (this.activeFilters.has("female") && animal.gender == "female") {
          return true;
        }
      }

      return false;
    }
  }

  animalSv = inject(AnimalService);

  query = "filters[animalKind][name][$eqi]=hund"

  pageContent$ = this.animalSv.get<{
    hero: StrapiImage[],
    article: ArticleTextSection[],
  }>("animals-page?populate=*");
}
