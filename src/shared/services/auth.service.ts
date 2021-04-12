import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IOrder } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  access: Subject<any> = new Subject<any>();

  constructor(private afAuth: AngularFireAuth,
    private afFirestore: AngularFirestore,
    private router: Router) { }

  signIn(email: string, password: string): void {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(user => {
        this.afFirestore.collection('users').ref.where('id', '==', user.user.uid).onSnapshot(
          snap => {
            snap.forEach(userRef => {
              localStorage.setItem('user', JSON.stringify(userRef.data()));
              if (userRef.data().role === 'admin' && userRef.data().access) {
                this.router.navigateByUrl('admin');
                this.access.next('ggg');
              }
              else {
                this.router.navigateByUrl('profile');
                this.access.next('ggg');
              }
            });
          }
        );
      })
      .catch(err => {
        console.log(err);
        if (err.code === "auth/user-not-found") {
          this.signUp(email, password);
        }
      }
      );
  }

  signOut(): void {
    this.afAuth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigateByUrl('discounts');
      })
      .catch(err => console.log(err));
  }

  signUp(email: string, password: string): void {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userResponse => {
        const user = {
          id: userResponse.user.uid,
          email: userResponse.user.email,
          role: 'user',
          name: ``,
          city: '',
          street: '',
          house: '',
          orders: Array,
          phone: email.slice(0, email.indexOf('@pizza.com')),
        };
        this.afFirestore.collection('users').add(user)
          .then(userCollection => {
            userCollection.get()
              .then(user => {
                console.log(user.data());
                localStorage.setItem('user', JSON.stringify(user.data()));
                this.router.navigateByUrl('profile');
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

}
