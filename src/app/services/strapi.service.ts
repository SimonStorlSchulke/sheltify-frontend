import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StrapiFilter, StrapiImage } from '../shared/shared-types';

export type StrapiSingleResponse<T> = {
  data: T;
};


@Injectable({
  providedIn: 'root',
})
export class StrapiService {
  static readonly bearer = isDevMode()
    ? '3c9e9d39a26bf76435b9888ce4d62e7bd50859afd5118867c4e7797c92094cf6f1fc63fc7cd45bca393dc3e4ad64dfb13ab6008d55c69ee1d0572c69358e88a4d1d5e55f32cfbee8f7cb1f1d271a1824b9f4105dca3ce6276d6c4194e31d6ac000c2f792caea958ebdacd224fd4312a60e9ccc0c275238127f70e0178eed7378'
    : '3c9e9d39a26bf76435b9888ce4d62e7bd50859afd5118867c4e7797c92094cf6f1fc63fc7cd45bca393dc3e4ad64dfb13ab6008d55c69ee1d0572c69358e88a4d1d5e55f32cfbee8f7cb1f1d271a1824b9f4105dca3ce6276d6c4194e31d6ac000c2f792caea958ebdacd224fd4312a60e9ccc0c275238127f70e0178eed7378';
  
  static readonly apiBaseUrl = 'https://herzenshunde-strapi-prod.azurewebsites.net/api/';
  static readonly uploadsBaseUrl = 'https://herzenshunde-strapi-prod.azurewebsites.net';

  static readonly headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${StrapiService.bearer}`,
  };

  httpClient = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.httpClient
      .get(decodeURIComponent(StrapiService.apiBaseUrl + path), { headers: StrapiService.headers })
      .pipe(map((obj) => flattenStrapiObject(obj)));
  }

  getAsString(
    path: string,
    filters: StrapiFilter[] = []
  ): Observable<string> {
    let params = new URLSearchParams();

    for (const filter of filters) {
      params.append(
        `filters[${filter.field}][$${filter.operator ?? 'eq'}]`,
        filter.value
      );
    }
    let url =
    StrapiService.apiBaseUrl + path + (path.includes('?') ? '&' : '?') + params.toString();
    return this.httpClient
      .get(decodeURIComponent(url), { headers: StrapiService.headers })
      .pipe(map((obj) => JSON.stringify(flattenStrapiObject(obj))));
  }

  getImageFormatUrl(
    image: StrapiImage | null | undefined,
    size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
  ): string {
    if (image == null) {
      return 'https://herzenshunde-strapi-prod.azurewebsites.net/uploads/paw_e60a248111.svg';
    }

    if (!image.formats) {
      return image.url;
    }

    let toReturn = "";

    switch (size) {
      case 'thumbnail':
        toReturn = image.formats.thumbnail.url;
        break;
      case 'small':
        toReturn = image.formats.small?.url ?? image.formats.thumbnail.url;
        break;
      case 'medium':
        toReturn = (
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url
        );
        break;
      case 'large':
        toReturn = (
          image.formats.large?.url ??
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url
        );
        break;
      case 'original':
        toReturn = (
          image.url
        );
        break;
    }

    return StrapiService.uploadsBaseUrl + toReturn;
  }
}

function flattenStrapiObject(data: any) {
  const isObject = (data: any) =>
    Object.prototype.toString.call(data) === '[object Object]';
  const isArray = (data: any) =>
    Object.prototype.toString.call(data) === '[object Array]';

  function flatten(data: any) {
    if (!data.attributes) return data;

    return {
      id: data.id,
      ...data.attributes,
    };
  };

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
