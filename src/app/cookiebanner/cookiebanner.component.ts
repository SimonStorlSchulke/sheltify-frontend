import { Component, HostBinding, inject, Input } from '@angular/core';
import { CookiebannerService } from './cookiebanner.service';

@Component({
  selector: 'app-cookiebanner',
  standalone: true,
  imports: [],
  templateUrl: './cookiebanner.component.html',
  styleUrl: './cookiebanner.component.scss',
})
export class CookiebannerComponent {
  @HostBinding("class.block")
  @Input() asBlock = false;

  cookieBannerSv = inject(CookiebannerService);
}
