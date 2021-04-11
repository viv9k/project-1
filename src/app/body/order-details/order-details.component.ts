import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  constructor(
    public backendService: BackendService,
    public authService: AuthService,
    private route: ActivatedRoute) { }

  orderId: string
  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['orderId']

  }

}
