import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StrapiFilter, StrapiImage } from '../shared/shared-types';


export type StrapiSingleResponse<T> = {
  data: T,
}

const bearer = "5b603b7792ad91148480b8d8954bcc1623643ad0ff6d371930770dbbcb45cf9287e3c402e07e56214d61cb7d90f11119ddd65edc16a0604cba7145f1b3d2ea1366b3f4bab0ed9a97d86afaa7c93633e30f06b95ad31677d0d13a7bf904dcc890a46440c4359c4499100d30729005cdc7cf21a08c5d8007abbac7c8fe02e4188b";
const strapiUrl = "http://localhost:1337";
const apiBaseUrl = "http://localhost:1337/api/";

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${bearer}`
};

@Injectable({
  providedIn: 'root',
})
export class StrapiService {

  httpClient = inject(HttpClient);

  public getMany<T>(path: string, filters: StrapiFilter[] = []): Observable<T[]> {

    let params = new URLSearchParams();

    for (const filter of filters) {
      params.append(`filters[${filter.field}][$${filter.operator ?? 'eq'}]`, filter.value);
    }

    
    let url = apiBaseUrl + path + (path.includes("?") ? "&" : "?") + params.toString();
    console.log(decodeURIComponent(url))
    return this.httpClient.get(decodeURIComponent(url), { headers: headers })
      .pipe(map(obj => flattenStrapiObject(obj)) );
  }

  public getOne<T>(path: string): Observable<T> {
    return this.httpClient.get(decodeURIComponent(apiBaseUrl + path), { headers: headers })
      .pipe(map(obj => flattenStrapiObject(obj)) );
  }


  public getImageFormatUrl(image: StrapiImage | null | undefined, size: "thumbnail" | "small" | "medium" | "large"): string {
    if (image == null) {
      return strapiUrl + "uploads/paw_e60a248111.svg";
    }

    if(!image.formats) {
      return strapiUrl + image.url;
    }

    switch (size) {
      case "thumbnail":
        return strapiUrl + image.formats.thumbnail.url;
      case "small":
        return strapiUrl + (
          image.formats.small?.url
          ?? image.formats.thumbnail.url);
      case "medium":
        return strapiUrl + (
          image.formats.medium?.url
          ?? image.formats.small?.url
          ?? image.formats.thumbnail.url
        );
      case "large":
        return strapiUrl + (
          image.formats.large?.url
          ?? image.formats.medium?.url
          ?? image.formats.small?.url
          ?? image.formats.thumbnail.url
        );
    }
  }

}

function flattenStrapiObject(data: any) {
  const isObject = (data: any) =>
    Object.prototype.toString.call(data) === "[object Object]";
  const isArray = (data: any) =>
    Object.prototype.toString.call(data) === "[object Array]";

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
};
