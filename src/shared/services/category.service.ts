import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from '../interfaces/category.interface'
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url: string;

  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.url = 'http://localhost:3000/categories';
  }

  getFirecloudCategory(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('categories').snapshotChanges();
  }

  postFirecloudCategory(str: string, category: ICategory): Promise<void> {
    return this.firestore.collection("categories").doc(str).set(category);
  }

  deleteFirecloudCategory(id: string): any {
    return this.firestore.collection('categories').doc(id).delete();
  }

}


