import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { BackendService } from '../services/backend/backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(
    public backendService: BackendService,
    public authService: AuthService,
    private router: Router
  ) { }
  isCollapsed: boolean = true
  isCollapsed2: boolean = true

  searchProduct: string

  ngOnInit(): void { }
  navigateToHome() {
    this.router.navigate([""]);
  }

  navigateToInventory() {
    this.router.navigate(["Inventory"]);
  }

  logoutSession() {
    this.authService.logout().then(() => {
      this.router.navigate([""]);
    })
  }

  navigateToSearchedProducts() {
    this.router.navigate([''], { queryParams: { name: this.searchProduct } });
  }
  navigateToCart() {
    this.router.navigate(["Cart"]);
  }
  navigateToOrders() {
    this.router.navigate(["Orders"]);
  }
  navigateToSpecificCategory(categoryName: string) {
    this.router.navigate(["Category", categoryName]);
  }
}
