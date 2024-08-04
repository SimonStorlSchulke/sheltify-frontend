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
  static readonly bearer =
    '8d9d5bd4f9c65a1dbbdd45d63653dfe9aedf6b6f99e4e7d5b06f847b2cd8a43d966d9a0260bfd860280efd9b605dc2c61a696034abcca869e4b302da6cf1a27d2a409945a5252bf44ce6016f6fc3a91c220f9f7e118f6571630a9a2a9e5df436f4d8d828392091937a16df4a5fbee918a04ba92da63362b77daea0cdbf1d09f3';

  static readonly apiBaseUrl = 'http://cms.herzenshunde-griechenland.de/api/';
  static readonly uploadsBaseUrl = 'http://cms.herzenshunde-griechenland.de';

  static readonly headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${StrapiService.bearer}`,
  };

  httpClient = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.httpClient
      .get(decodeURIComponent(StrapiService.apiBaseUrl + path), {
        headers: StrapiService.headers,
      })
      .pipe(map((obj) => flattenStrapiObject(obj)));
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
    return this.httpClient
      .get(decodeURIComponent(url), { headers: StrapiService.headers })
      .pipe(map((obj) => JSON.stringify(flattenStrapiObject(obj))));
  }

  getImageFormatUrl(
    image: StrapiImage | null | undefined,
    size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'original',
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
      case 'original':
        toReturn = image.url;
        break;
    }

    return StrapiService.uploadsBaseUrl + toReturn;
  }

  getImageFormatUrls(
    images: StrapiImage[],
    size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'original',
  ) {
    return images.map(img => this.getImageFormatUrl(img, size));
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
