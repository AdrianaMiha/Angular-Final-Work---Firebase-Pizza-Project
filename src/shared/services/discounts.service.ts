import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDiscount } from '../interfaces/discounts.interface';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {


  private url: string;
  constructor(private http: HttpClient, private firestore: AngularFirestore) { 
    this.url = 'http://localhost:3000/discounts';
  }


  getFirecloudDiscount(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('discounts').snapshotChanges();
  }

  postFirecloudDiscount(str: string, disc: IDiscount): Promise<void> {
    return this.firestore.collection("discounts").doc(str).set(disc);
  }

  deleteFirecloudDiscount(id: string): any {
    return this.firestore.collection('discounts').doc(id).delete();
  }

  updateFirecloudDiscount(id: string, disc: IDiscount): any {
    return this.firestore.collection('discounts').doc(id).update(disc);
  }

  getOneFirebaseDiscount(id: string): any {
    return this.firestore.collection('discounts').doc(id).snapshotChanges();
  }


}
