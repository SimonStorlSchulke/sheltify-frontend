import { Injectable } from '@angular/core';
import { StrapiMedia } from '../shared/shared-types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LightboxService {

  images?: StrapiMedia[];
  currentIndex: number = 0;

  open$ = new Subject<string[]>();
  close$ = new Subject<void>();
  
  open(images: StrapiMedia[], startIndex: number, startImgSrcs: string[] = []) {
    this.images = images;
    this.currentIndex = startIndex;
    this.open$.next(startImgSrcs);
  }

}
