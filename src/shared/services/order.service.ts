import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IProduct } from '../interfaces/product.interface';
import { HttpClient } from '@angular/common/http';
import { IOrder } from '../interfaces/order.interface';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  basket: Subject<any> = new Subject<any>();
  private url: string;
  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.url = "http://localhost:3000/orders";
   }
  addBasket(product: IProduct): void {
    let localProducts: Array<IProduct> = [];
    if (localStorage.length > 0 && localStorage.getItem('myOrder')) {
      localProducts = JSON.parse(localStorage.getItem('myOrder'));
      if (localProducts.some(prod => prod.id === product.id)){
        const index = localProducts.findIndex(prod => prod.id === product.id);
        localProducts[index].count += +product.count;
      }
      else {
        localProducts.push(product);
      }
    }
    else {
      localProducts.push(product);
    }
    localStorage.setItem('myOrder', JSON.stringify(localProducts));
    this.basket.next(localProducts);
  }

  getFirecloudOrder(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('orders').snapshotChanges();
  }

 addFirecloudOrder(str: string, ord: IOrder): Promise<void> {
    return this.firestore.collection("orders").doc(str).set(ord);
  }

  updateFirecloudOrder(id: string,  ord: IOrder): any {
    return this.firestore.collection('orders').doc(id).update(ord);
  }   


}