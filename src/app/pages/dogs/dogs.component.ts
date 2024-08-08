import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { AsyncPipe } from '@angular/common';
import { HeroComponent } from '../../shared/hero/hero.component';
import { Animal, StrapiMedia } from '../../shared/shared-types';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { AnimalListComponent } from '../../shared/animal-list/animal-list.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { AnimalArticleService } from '../../services/animal-article.service';

@Component({
  selector: 'app-dogs',
  standalone: true,
  imports: [AsyncPipe, AnimalListComponent, HeroComponent, ArticleComponent],
  templateUrl: './dogs.component.html',
  styleUrl: './dogs.component.scss',
})
export class DogsComponent {
  
  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  animalSv = inject(AnimalService);

  query$ = new BehaviorSubject<string>('');

  pageContent$ = inject(AnimalArticleService).getAndInsertAnimalLinks<{
    hero: StrapiMedia;
    article: ArticleSection[];
  }>('dogs-page?populate=*');

  filters = new Map<string, Map<string, boolean>>([
    [
      'inGermany',
      new Map([
        ['inGermany', false],
      ]),
    ],
    [
      'size',
      new Map([
        ['small', false],
        ['medium', false],
        ['large', false],
      ]),
    ],
    [
      'gender',
      new Map([
        ['male', false],
        ['female', false],
      ]),
    ],
    [
      'age',
      new Map([
        ['young', false],
        ['medium', false],
        ['old', false],
      ]),
    ],
  ]);

  toggleFilter(category: string, key: string) {
    [...this.filters.get(category)!.keys()].forEach((cKey) => {
      if (cKey != key) {
        this.filters.get(category)!.set(cKey, false);
      }
    });
    const oldValue = this.filters.get(category)!.get(key)!;
    this.filters.get(category)!.set(key, !oldValue);
    if (this.query$.value != '') {
      this.query$.next('');
    }
    this.searchInput.nativeElement.value = "";
  }

  resetFilters() {
    for (const category of this.filters.keys()) {
      for (const key of this.filters.get(category)!.keys()) {
        this.filters.get(category)!.set(key, false)
      }
    }
  }

  onSearchTyped(e: string) {
    if (e.length > 1) {
      this.query$.next(`filters[$or][0][name][$contains]=${e}&filters[$or][1][description][$contains]=${e}`);
      window.setTimeout(() => {
        this.resetFilters();
      }, 400);
    } else {
      this.query$.next('');
    }
  }

  isFilterActive(category: string, key: string) {
    return this.filters.get(category)!.get(key);
  }

  activeFilter(category: string) {
    for (const key of this.filters.get(category)!.keys()) {
      if (this.filters.get(category)?.get(key)) return key;
    }
    return null;
  }


  getIsVisibleFunction(): (animal: Animal) => boolean {
    return (animal: Animal) => {
      let inGermany = !this.isFilterActive('inGermany', 'inGermany') || this.animalSv.isInGermany(animal);

      let fitsSize = !this.activeFilter('size');
      if (animal.shoulderHeightCm) {
        if (this.isFilterActive('size', 'small') && animal.shoulderHeightCm <= 40) fitsSize = true;
        if (this.isFilterActive('size', 'medium') && animal.shoulderHeightCm > 40 && animal.shoulderHeightCm <= 55) fitsSize = true;
        if (this.isFilterActive('size', 'large') && animal.shoulderHeightCm > 55) fitsSize = true;
      }

      let fitsGender = !this.activeFilter('gender');
      if (this.isFilterActive('gender', 'male') && animal.gender == 'male') fitsGender = true;
      if (this.isFilterActive('gender', 'female') && animal.gender == 'female') fitsGender = true;
      

      let fitsAge = !this.activeFilter('age');
      if (animal.birthday) {
        const yearsOld = this.animalSv.yearsOld(animal)!;
        if (this.isFilterActive('age', 'young') && yearsOld < 1) fitsAge = true;
        if (this.isFilterActive('age', 'medium') && yearsOld >= 1 && yearsOld < 7) fitsAge = true;
        if (this.isFilterActive('age', 'old') && yearsOld >= 7) fitsAge = true;
      }

      return fitsSize && fitsGender && fitsAge && inGermany;
    };
  }

  getSizeExplainer(category: string): string {
    const activeValue = this.activeFilter(category);
    if(!activeValue) return "";

    const sizeTexts = new Map<string, string>([
      ["small", "bis 30cm"],
      ["medium", "30 - 55cm"],
      ["large", "ab 55cm"],
    ]);

    const ageTexts = new Map<string, string>([
      ["young", "bis 12 Monate"],
      ["medium", "1-6 Jahre"],
      ["old", "ab 7 Jahre"],
    ]);

    switch (category) {
        case "size":
          return sizeTexts.get(activeValue)!
        case "age":
          return ageTexts.get(activeValue)!

    }

    return ""
  }
}
