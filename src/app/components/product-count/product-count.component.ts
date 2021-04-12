import {Component, Input, OnInit} from '@angular/core';
import { IProduct } from '../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-product-count',
  templateUrl: './product-count.component.html',
  styleUrls: ['./product-count.component.scss']
})
export class ProductCountComponent implements OnInit {
  @Input() product: IProduct;
  constructor() { }

  ngOnInit(): void {
  }
  productCount(status: boolean): void {
    if (status) {
      this.product.count++;
    }
    else {
      if (this.product.count > 1) {
        this.product.count--;
      }
    }
  }

}
