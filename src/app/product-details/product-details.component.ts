import { Component, OnInit } from '@angular/core';
import { ProductService } from '../..//shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../shared/interfaces/product.interface';

import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;

  constructor(private prodService: ProductService, private actRoute: ActivatedRoute, private ordService: OrderService) { }

  ngOnInit(): void {
    this.getMyFirebaseProduct();
  }

getMyFirebaseProduct(): void{
  const id = +this.actRoute.snapshot.paramMap.get('id');
  const str = id.toString();
    this.prodService.getFirebaseOneProduct(str).subscribe(product => {
      const data = product.payload.data() as IProduct;
      const id = product.payload.id;
      this.product = data;
        return { id, ...data }      
    });     
}

addBasket(product: IProduct): void {
    this.ordService.addBasket(product);
        product.count = 1;
      }
}
