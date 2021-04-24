import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductId } from 'src/app/Interface/ProductInterface';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() item: ProductId
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  navigateToProductDetails(productId: string) {
    this.router.navigate(["/Products", productId, this.item.Name]);
  }
}
