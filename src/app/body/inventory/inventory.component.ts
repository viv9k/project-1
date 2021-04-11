import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  showSideNav: boolean = false
  constructor(public authService: AuthService, public backendService: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.backendService.readRawData()
    this.backendService.readCategoryData()
  }
  toggleSideNav() {
    this.showSideNav = !this.showSideNav
  }
  showProducts() {
    this.router.navigate(["Inventory/Items"]);
  }
  showOrders() {
    this.router.navigate(["Inventory/Orders"]);
  }
}
