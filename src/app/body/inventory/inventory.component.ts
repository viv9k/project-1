import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';
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
  }
  toggleSideNav() {
    this.showSideNav = !this.showSideNav
  }
  show(collection: string) {
    this.router.navigate(["/Inventory", collection]);
  }
}
