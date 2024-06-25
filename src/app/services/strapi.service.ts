import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StrapiFilter, StrapiImage } from '../shared/shared-types';

export type StrapiSingleResponse<T> = {
  data: T;
};

const bearer = isDevMode()
  ? '45ca0b72a2717b2ef748c743ef843c614b26e3bbdb97387bda8807a8a60d7d24dff9e144593c34aa5cb09d789e77296f4678d3dbcba1d473464f4bbf753815e547c70d12374b52c72c444af7826622bee6025ddfbce71140994e1c3db09dc3a03a1bd3b5d883b3342f2a551067ea64325a61721e60047bef3a475712ae2923e0'
  : '9d30c9f9f2bd767fd3ac7bc35272657c151372dd6fbdc09cb1e81e23f8dd919dd6456c464834a46d684ba6a4744e1dd89eef7eed90742f38c812c423f2d9150dec3986685b47f54d08e32b392e3d6e77c2e8849384fe1682ed6bd7aef1cadb97db1b10e26971d9224abc092088c3675435f4d17c2bcacaecc58a07b2ea1d06c1';

const strapiUrl = '/api/api';
const apiBaseUrl = 'api/';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${bearer}`,
};

@Injectable({
  providedIn: 'root',
})
export class StrapiService {
  httpClient = inject(HttpClient);

  public get<T>(path: string): Observable<T> {
    return this.httpClient
      .get(decodeURIComponent(apiBaseUrl + path), { headers: headers })
      .pipe(map((obj) => flattenStrapiObject(obj)));
  }

  public getAsString(
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
      apiBaseUrl + path + (path.includes('?') ? '&' : '?') + params.toString();
    return this.httpClient
      .get(decodeURIComponent(url), { headers: headers })
      .pipe(map((obj) => JSON.stringify(flattenStrapiObject(obj))));
  }

  public getImageFormatUrl(
    image: StrapiImage | null | undefined,
    size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
  ): string {
    if (image == null) {
      return 'uploads/paw_e60a248111.svg';
    }

    if (!image.formats) {
      return image.url;
    }

    switch (size) {
      case 'thumbnail':
        return image.formats.thumbnail.url;
      case 'small':
        return image.formats.small?.url ?? image.formats.thumbnail.url;
      case 'medium':
        return (
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url
        );
      case 'large':
        return (
          image.formats.large?.url ??
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url
        );
      case 'original':
        return (
          image.url
        );
    }
  }
}

function flattenStrapiObject(data: any) {
  const isObject = (data: any) =>
    Object.prototype.toString.call(data) === '[object Object]';
  const isArray = (data: any) =>
    Object.prototype.toString.call(data) === '[object Array]';

  const flatten = (data: any) => {
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
