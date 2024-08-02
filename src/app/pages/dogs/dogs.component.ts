import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { AsyncPipe } from '@angular/common';
import { HeroComponent } from '../../shared/hero/hero.component';
import { Animal, StrapiImage } from '../../shared/shared-types';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { AnimalListComponent } from '../../shared/animal-list/animal-list.component';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-dogs',
  standalone: true,
  imports: [AsyncPipe, AnimalListComponent, HeroComponent, ArticleComponent],
  templateUrl: './dogs.component.html',
  styleUrl: './dogs.component.scss',
})
export class DogsComponent {
  
  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  filters = new Map<string, Map<string, boolean>>([
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

  showAll() {
    this.filters =new Map<string, Map<string, boolean>>([
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
    ])  }

  onSearchTyped(e: string) {
    if (e.length > 1) {
      this.query$.next(`filters[$or][0][name][$contains]=${e}&filters[$or][1][description][$contains]=${e}`);
      window.setTimeout(() => {
        this.showAll();
      }, 400);
    } else {
      this.query$.next('');
    }
  }

  isFilterActive(category: string, key: string) {
    return this.filters.get(category)!.get(key);
  }

  isAnyFilterActive(category: string) {
    for (const value of this.filters.get(category)!.values()) {
      if (value) return true;
    }
    return false;
  }

  getIsVisibleFunction(): (animal: Animal) => boolean {
    return (animal: Animal) => {
      let fitsSize = !this.isAnyFilterActive('size');
      if (animal.shoulderHeightCm) {
        if (this.isFilterActive('size', 'small') && animal.shoulderHeightCm <= 35) fitsSize = true;
        if (this.isFilterActive('size', 'medium') && animal.shoulderHeightCm > 35 && animal.shoulderHeightCm <= 45) fitsSize = true;
        if (this.isFilterActive('size', 'large') && animal.shoulderHeightCm > 45) fitsSize = true;
      }

      let fitsGender = !this.isAnyFilterActive('gender');
      if (this.isFilterActive('gender', 'male') && animal.gender == 'male') fitsGender = true;
      if (this.isFilterActive('gender', 'female') && animal.gender == 'female') fitsGender = true;
      

      let fitsAge = !this.isAnyFilterActive('age');
      if (animal.birthday) {
        const yearsOld = this.animalSv.yearsOld(animal)!;
        if (this.isFilterActive('age', 'young') && yearsOld < 2) fitsAge = true;
        if (this.isFilterActive('age', 'medium') && yearsOld >= 2 && yearsOld <= 9) fitsAge = true;
        if (this.isFilterActive('age', 'old') && yearsOld > 9) fitsAge = true;
      }

      return fitsSize && fitsGender && fitsAge;
    };
  }

  animalSv = inject(AnimalService);

  query$ = new BehaviorSubject<string>('');

  pageContent$ = this.animalSv.get<{
    hero: StrapiImage;
    article: ArticleSection[];
  }>('dogs-page?populate=*');
}
