import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type HeaderItem = {
  label: string,
  link?: string,
  children?: Array<{
    label: string,
    link: string
  }>,
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  items: HeaderItem[] = [
    { label: "Home", link: "/" },
    { label: "Über uns", link: "/ueber-uns" },
    {
      label: "Tiere", children: [
        { label: "Hunde", link: "/tiere/hunde" },
        { label: "Katzen", link: "/tiere/katzen" },
        { label: "Vögel", link: "/tiere/voegel" },
      ]
    },
    { label: "Vermittlung", link: "/" },
    { label: "Helfen", link: "/" },
    { label: "News & Wissen", link: "/" },
    { label: "Kontakt", link: "/" },
  ]

  openedDropdownIndex: number = -1;

  @HostListener('document:click', ['$event'])
  clickOutsideNav(event: MouseEvent) {
    if (this.openedDropdownIndex != -1 && !(event.target as HTMLElement).classList.contains("dropdown-button")) {
      this.openedDropdownIndex = -1
    };
  }

}
