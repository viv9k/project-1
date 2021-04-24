import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tagName: string
  searchProductName: string
  constructor(
    public backendService: BackendService,
    private route: ActivatedRoute,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.tagName = this.route.snapshot.queryParamMap.get('tagName');
    this.searchProductName = this.route.snapshot.queryParamMap.get('name');
    this.backendService.readCategoryData();
    this.backendService.readProductData();
    if (this.authService.user) {
      this.backendService.readOrderData(this.authService.user.uid);
    }
    this.backendService.readBannerData();
    this.backendService.readSideBannerData();
  }
}
