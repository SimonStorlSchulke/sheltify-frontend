import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { StrapiService } from './strapi.service';
import { Animal } from '../shared/shared-types';

@Injectable({
  providedIn: 'root',
})
export class AnimalService extends StrapiService {
  getAnimalByName(name: string): Observable<Animal> {
    return this.get<Animal[]>(`animals?filters[name][$eqi]=${name}`).pipe(
      map((animals) => animals[0]),
    );
  }

  getAnimalList(filters: string = ''): Observable<Animal[]> {
    let url = `animals?populate=thumbnail&${filters}`;
    return this.get<Animal[]>(url);
  }

  getAgeString2(animal: Animal) {
    if (!animal.birthday) return 'unbekannt';
    var today = new Date();
    var birthDate = new Date(animal.birthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getAgeString(animal: Animal): string {
    if (!animal.birthday) return 'Unbekannt';
    const birthDate = new Date(animal.birthday);
    const today = new Date();
    let months: number = this.monthDiff(birthDate, today);

    if (months < 12) {
      return `ca. ${months} Monate`;
    }

    const yearsRounded = Math.round((months / 12) * 2) / 2;
    const yearsString = yearsRounded.toString().replace('.5', ' 1/2');
    return yearsString == '1'
      ? `ca. ${yearsString} Jahr`
      : `ca. ${yearsString} Jahre`;
  }

  private monthDiff(d1: Date, d2: Date): number {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
}
