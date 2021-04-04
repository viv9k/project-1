import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.readCategoryData();
    this.backendService.readProductData();
    this.backendService.readBannerData();
  }
  images = [62, 83, 466].map((n) => `https://picsum.photos/id/${n}/900/500`);
}