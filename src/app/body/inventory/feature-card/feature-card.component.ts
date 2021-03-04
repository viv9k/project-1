import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feature-card',
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.css']
})
export class FeatureCardComponent implements OnInit {

  @Input('cardName') cardName: string;
  @Input('items') items: number;

  constructor() { }

  ngOnInit(): void {
  }

}
