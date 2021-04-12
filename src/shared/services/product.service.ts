import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../interfaces/product.interface';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string;
  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.url = 'http://localhost:3000/products';
  }

    getFirecloudProduct(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('products').snapshotChanges();
  }

  postFirecloudProduct(str: string, prod: IProduct): Promise<void> {
    return this.firestore.collection("products").doc(str).set(prod);
  }

  deleteFirecloudProduct(id: string): Promise<void> {
    return this.firestore.collection('products').doc(id).delete();
  }

  updateFirecloudProduct(id: string, prod: IProduct): any {
    return this.firestore.collection('products').doc(id).update(prod);
  }

  getFirebaseOneProduct(id: string): any {
    return this.firestore.collection('products').doc(id).snapshotChanges();
  }


}
