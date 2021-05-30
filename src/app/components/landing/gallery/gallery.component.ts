import { environment } from '../../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Lightbox } from 'ngx-lightbox';

const httpOptions = {
  params: null,
  headers: new HttpHeaders({ "Content-Type": "application/json",
                             "Access-Control-Allow-Origin": "*,Origin, X-Requested-With, Content-Type, Accept" })
};


interface Photo {
            src: string,
            caption: string,
            thumb: string
};

const APIEndpoint = environment.APIEndpoint;
const imagesDir = './assets/gallery/'
const imagesUrl = APIEndpoint + "/api/gallery/list";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})

export class GalleryComponent implements OnInit {

  public album: Array<Photo> = [];

  constructor(private http: HttpClient,
              private _lightbox: Lightbox) { }

  ngOnInit(): void {

    this.http.get<string[]>(imagesUrl, httpOptions)
             .subscribe(images => {
                   for (let image of images) {
                     const src = imagesDir + image;
                     const caption = image.split('.')[0];
                     const thumb = imagesDir + image;

                     const photo = { src: src, caption: caption, thumb: thumb };

                     this.album.push(photo);
                   }
               });
  }

  open(index: number): void {
    this._lightbox.open(this.album, index);
  }

  close(): void {
    this._lightbox.close();
  }

}
