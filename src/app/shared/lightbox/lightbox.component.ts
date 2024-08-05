import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { LightboxService } from '../../services/lightbox.service';
import { StrapiMediaPipe } from '../../article/article-sections/strapi-image.pipe';
import { StrapiService } from '../../services/strapi.service';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [StrapiMediaPipe],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss'
})
export class LightboxComponent {
  @ViewChild("modal") dialogRef!: ElementRef<HTMLDialogElement>;


  ligtboxSv = inject(LightboxService);
  strapiSv = inject(StrapiService);
  currentSource: string = "";
  startSrcs: string[] = [];

  ngAfterViewInit() {
    this.ligtboxSv.open$.subscribe((startSrcs) => {
      console.log("startSrc", startSrcs)
      this.startSrcs = startSrcs;
      this.currentSource = startSrcs[this.ligtboxSv.currentIndex];
      this.dialogRef.nativeElement.showModal();
      window.setTimeout(() => {
        this.currentSource = this.getSrc();
      }, 0
      )
    })
  }

  getSrc(): string {
    const strapiImg = this.ligtboxSv.images![this.ligtboxSv.currentIndex];
    return this.strapiSv.getImageFormatUrl(strapiImg, "original");
  }

  to(index: number) {
    if(!this.dialogRef.nativeElement.open) return;
    const imgMaxIndex = this.ligtboxSv.images!.length - 1;
    if(index > imgMaxIndex) {
      this.ligtboxSv.currentIndex = 0
    } else if(index < 0) {
      this.ligtboxSv.currentIndex = imgMaxIndex;
    } else {
      this.ligtboxSv.currentIndex = index;
    }
    this.currentSource = this.startSrcs[this.ligtboxSv.currentIndex];
    window.setTimeout(() => {
      this.currentSource = this.getSrc();
    }, 0
    )  }

  @HostListener('click', ['$event'])
  closeOnClick(e: MouseEvent) {
    if(e.target instanceof HTMLElement && e.target.classList.contains("closable")) {
      this.dialogRef.nativeElement.close();
    }
  }


  @HostListener('window:keydown.ArrowLeft', ['$event'])
  prev() {
    this.to(this.ligtboxSv.currentIndex - 1);
  }

  @HostListener('window:keydown.ArrowRight', ['$event'])
  next() {
    this.to(this.ligtboxSv.currentIndex + 1);
  }

  get multiImageMode() {
    return (this.ligtboxSv.images?.length ?? 0) > 1;
  }
}
