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
  static readonly bearer =
    '6612d88a2c0b99340a0fc8d18cec7b31012bbf20c2b0545e35bea181775f1d7632630cba6e2831f907aaefac616727242a69a2ed5fdaf20a829de88013475beef3b425d64c53f2c86a59a0356b619136bc237754a616ba397763b463924f68fa88e69a5d3002f349f2a623d093bd9fdebc490a6f8cfd6a52157737dde1bcdfe0';

  static readonly apiBaseUrl = 'https://cms.herzenshunde-griechenland.de/api/';
  static readonly uploadsBaseUrl = 'https://cms.herzenshunde-griechenland.de';

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
