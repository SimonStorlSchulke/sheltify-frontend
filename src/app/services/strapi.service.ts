import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StrapiFilter, StrapiMedia } from '../shared/shared-types';
import { StrapiQueryBuilder } from './StrapiQueryBuilder';

let showDrafts = false;

@Injectable({
  providedIn: 'root',
})
export class StrapiService {

  //This api key  offers read-only-access to the cms and is supposed to be public, so it's fine to put it here hardcoded.
  //static readonly bearer =
  //  '8d9d5bd4f9c65a1dbbdd45d63653dfe9aedf6b6f99e4e7d5b06f847b2cd8a43d966d9a0260bfd860280efd9b605dc2c61a696034abcca869e4b302da6cf1a27d2a409945a5252bf44ce6016f6fc3a91c220f9f7e118f6571630a9a2a9e5df436f4d8d828392091937a16df4a5fbee918a04ba92da63362b77daea0cdbf1d09f3';
  static readonly bearer =
    'f24653b17056d659a6cf3e10217f996163da5342f4a08ee2fe0829eaafba734bf606b8be2875617a5c2ba6e58f7550b8e28e82bb17311524f2150df4ebff6a756a27a05c1a140d264f37734093f985c3130c89b2ffc693d734c224730a7be1bef41a59b41444c4d6610240eacc395739edfeae15bedeece9d774134c831ae019';

  //static readonly apiBaseUrl = 'https://cms.herzenshunde-griechenland.de/api/';
  static readonly apiBaseUrl = 'http://localhost:1337/api/';
  static readonly uploadsBaseUrl = 'http://localhost:1337';

  static readonly headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${StrapiService.bearer}`,
  };

  httpClient = inject(HttpClient);

  enableDrafts() {
    showDrafts = true;
  }


  get<T>(path: string): Observable<T> {
    let url = decodeURIComponent(StrapiService.apiBaseUrl + path);
    url = this.addDraftsInDevMode(url);
    return this.httpClient
      .get(url, {
        headers: StrapiService.headers,
      })
      .pipe(map((obj) => flattenStrapiObject(obj)));
  }

  getWithMeta<DataT, MetaT>(path: string): Observable<[DataT, MetaT]> {
    let url = decodeURIComponent(StrapiService.apiBaseUrl + path);
    url = this.addDraftsInDevMode(url);
    return this.httpClient
      .get(url, {
        headers: StrapiService.headers,
      })
      .pipe(
        map((obj) => {
          const meta = (obj as any)["meta"];
          return [flattenStrapiObject(obj), meta]
        }));
  }

  get isDevEnv(): boolean {
    return window.location.origin.includes("//dev.") || window.location.origin.includes(":4200");
  }

  getAsString(path: string, filters: StrapiFilter[] = []): Observable<string> {
    let params = new URLSearchParams();

    for (const filter of filters) {
      params.append(
        `filters[${filter.field}][$${filter.operator ?? 'eq'}]`,
        filter.value,
      );
    }
    let url =
      StrapiService.apiBaseUrl +
      path +
      (path.includes('?') ? '&' : '?') +
      params.toString();
      url = this.addDraftsInDevMode(url);

    return this.httpClient
      .get(decodeURIComponent(url), { headers: StrapiService.headers })
      .pipe(map((obj) => JSON.stringify(flattenStrapiObject(obj))));
  }

  getVideoUrl(media: StrapiMedia) {
    return StrapiService.uploadsBaseUrl + media.url;
  }

  getImageFormatUrl(
    image: StrapiMedia | null | undefined,
    size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge',
  ): string {
    if (image == null) {
      return 'https://herzenshunde-strapi-prod.azurewebsites.net/uploads/paw_e60a248111.svg';
    }

    if (!image.formats) {
      return image.url;
    }

    let toReturn = '';

    switch (size) {
      case 'thumbnail':
        toReturn = image.formats.thumbnail.url;
        break;
      case 'small':
        toReturn = image.formats.small?.url ?? image.formats.thumbnail.url;
        break;
      case 'medium':
        toReturn =
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url;
        break;
      case 'large':
        toReturn =
          image.formats.large?.url ??
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url;
        break;
      case 'xlarge':
        toReturn =
          image.formats.xlarge?.url ??
          image.formats.large?.url ??
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url;
        break;
    }

    return StrapiService.uploadsBaseUrl + toReturn;
  }

  getImageFormatUrls(
    images: StrapiMedia[],
    size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge',
  ) {
    return images.map(img => this.getImageFormatUrl(img, size));
  }

  addDraftsInDevMode(url: string): string {
    if(!showDrafts) return url;
    return url + (url.includes("?") ? "&" : "?") + "publicationState=preview";
  }
}

function flattenStrapiObject(data: any) {
  const isObject = (data: any) =>
    Object.prototype.toString.call(data) === '[object Object]';
  const isArray = (data: any) =>
    Object.prototype.toString.call(data) === '[object Array]';

  function flatten(data: any) {
    if (!data) return data;

    return {
      id: data.id,
      ...data,
    };
  }

  if (isArray(data)) {
    return data.map((item: any) => flattenStrapiObject(item));
  }

  if (isObject(data)) {
    if (isArray(data.data)) {
      data = [...data.data];
    } else if (isObject(data.data)) {
      data = flatten({ ...data.data });
    } else if (data.data === null) {
      data = null;
    } else {
      data = flatten(data);
    }

    for (const key in data) {
      data[key] = flattenStrapiObject(data[key]);
    }

    return data;
  }

  return data;
}


export type StrapiPagination = {
    page: number
    pageSize: number
    pageCount: number
    total: number
}
