import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {

  isCollapsed2: boolean = false

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void { }

  submitOrder() {

  }
}
