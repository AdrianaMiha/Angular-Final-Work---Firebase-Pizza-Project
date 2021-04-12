import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBlog } from '../interfaces/blog.interface'
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private arrBlogs: Array<IBlog> = []

  private url: string;
  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.url = 'http://localhost:3000/blogs';
  }

  addBlog(blog: IBlog): void {
    this.arrBlogs.push(blog);
  }

  getFirecloudBlog(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('blogs').snapshotChanges();
  }

  postFirecloudBlog(str: string, blog: IBlog): Promise<void> {
    return this.firestore.collection("blogs").doc(str).set(blog);
  }

  deleteFirecloudBlog(id: string): any {
    return this.firestore.collection('blogs').doc(id).delete();
  }

  updateFirecloudBlog(id: string, blog: IBlog): any {
    return this.firestore.collection('blogs').doc(id).update(blog);
  }

}
