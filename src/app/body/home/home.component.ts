import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public backendService: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.backendService.readProductData();
    this.backendService.readAllImages();
  }
  navigateToProductDetails(productId: string) {
    this.router.navigate(["/Products", productId]);
  }
}
