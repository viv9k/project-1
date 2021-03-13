import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productId: string

  constructor(private route: ActivatedRoute, public backendService: BackendService) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['productId'];
    this.backendService.readSpecificProductData(this.productId);
    this.backendService.readImageData(this.productId);
  }

}
