import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/shared/interfaces/product.interface';
import { ProductService } from 'src/shared/services/product.service';
import { OrderService } from 'src/shared/services/order.service';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Array<IProduct> = [];
  category: string;

  constructor(private prodService: ProductService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore,
    private ordService: OrderService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const categoryName = this.actRoute.snapshot.paramMap.get('category');
        this.getFirebaseProducts(categoryName);
      }
    });
  }

  ngOnInit(): void { }

  private getFirebaseProducts(categoryName: string = "pizza"): void {
    this.products = [];
    this.firestore.collection('products').ref.where("category.nameEN", "==", categoryName).onSnapshot(
      collection => {
        collection.forEach(document => {
          const data = document.data() as IProduct;
          const id = document.id;     
          this.products.push({ id, ...data })
        });
        this.category = this.products[0]?.category.nameUA;
      });
  }

  addBasket(product: IProduct): void {
    this.ordService.addBasket(product);
    product.count = 1;
  }

}
