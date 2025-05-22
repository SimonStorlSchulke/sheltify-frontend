import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookiebannerService {
  public allowed: boolean | undefined = undefined;

  constructor() {
    if(localStorage.getItem("cookiesallowed") == "true") this.allowed = true;
    if(localStorage.getItem("cookiesallowed") == "false") this.allowed = false;
  }

  yes() {
    this.allowed = true;
    localStorage.setItem("cookiesallowed", "true");
    window.location.reload();
  }

  no() {
    this.allowed = false;
    localStorage.setItem("cookiesallowed", "false");
    window.location.reload();
  }
}
