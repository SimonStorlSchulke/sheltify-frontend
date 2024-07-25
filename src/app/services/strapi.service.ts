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
    ? '9d30c9f9f2bd767fd3ac7bc35272657c151372dd6fbdc09cb1e81e23f8dd919dd6456c464834a46d684ba6a4744e1dd89eef7eed90742f38c812c423f2d9150dec3986685b47f54d08e32b392e3d6e77c2e8849384fe1682ed6bd7aef1cadb97db1b10e26971d9224abc092088c3675435f4d17c2bcacaecc58a07b2ea1d06c1'
    : '9d30c9f9f2bd767fd3ac7bc35272657c151372dd6fbdc09cb1e81e23f8dd919dd6456c464834a46d684ba6a4744e1dd89eef7eed90742f38c812c423f2d9150dec3986685b47f54d08e32b392e3d6e77c2e8849384fe1682ed6bd7aef1cadb97db1b10e26971d9224abc092088c3675435f4d17c2bcacaecc58a07b2ea1d06c1';
  
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
