import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Tag } from '../Interface/TagInterface';
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
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });

  }
  isCollapsed: boolean = true
  isCollapsed2: boolean = true
  showCoupon: boolean = true
  searchProduct: string
  mySubscription: any;

  ngOnInit(): void {
    this.backendService.readCouponData()
    this.backendService.couponData.subscribe(data => {
      if (data.length === 0) {
        this.showCoupon = false
      }
      else {
        this.showCoupon = true
      }
    })
    this.backendService.readTagData()
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

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

  navigateToTagProducts(tag: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([''], { queryParams: { tagName: tag } });
    });
  }
}
