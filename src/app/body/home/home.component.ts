import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public backendService: BackendService, public authService: AuthService) { }
  showBanner: boolean
  ngOnInit(): void {
    this.backendService.readCategoryData();
    this.backendService.readProductData();
    if (this.authService.user) {
      this.backendService.readOrderData(this.authService.user.uid);
    }
    if (this.backendService.bannerData) {
      this.backendService.bannerData.subscribe(data => {
        if (!data.length) {
          this.showBanner = true
        }
        else {
          this.showBanner = false
        }
      })
    }
    this.backendService.readBannerData();
  }
  images = [62, 83, 466].map((n) => `https://picsum.photos/id/${n}/900/500`);
}