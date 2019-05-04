import {Component, Input, OnInit} from '@angular/core';
import {NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation} from 'ngx-gallery';


@Component({
  selector: 'app-sale-list-photo',
  templateUrl: './sale-list-photo.component.html',
  styleUrls: ['./sale-list-photo.component.css']
})
export class SaleListPhotoComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  @Input() photo;

  constructor() {
  }

  ngOnInit() {
    this.galleryOptions = [
      {
        image: false,
        width: '100%',
        height: '100px',
        thumbnailsColumns: 7
      },
      {
        breakpoint: 500,
        width: '100%',
        height: '100px',
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      {
        breakpoint: 400,
        preview: false
      }
    ];
    for (let i = 0; i < this.photo.length; i++) {
      this.galleryImages.push({
        small: this.photo[i].mini,
        medium: this.photo[i].midi,
        big: this.photo[i].path});
    }
  }

}
