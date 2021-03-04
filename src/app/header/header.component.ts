import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService) { }
  isCollapsed: boolean = true

  ngOnInit(): void {
  }
  navigateToHome() {
    this.router.navigate([""]);

  }
  navigateToLogin() {
    this.router.navigate(["login"]);
  }
  navigateToInventory() {
    this.router.navigate(["Inventory"]);
  }
  LogoutSession() {
    this.authService.logout().then(() => {
      this.router.navigate([""]);

    })
  }
}
