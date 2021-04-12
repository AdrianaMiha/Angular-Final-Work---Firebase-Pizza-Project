import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { IOrder } from 'src/shared/interfaces/order.interface';
import { OrderService } from 'src/shared/services/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  orders: Array<IOrder> = [];
  userOrders: Array<IOrder> = [];
  userName: string;
  userCity: string;
  userStreet: string;
  userHouse: string;
  phoneNumber: string;
  path: string;
  updateUser: any;


  constructor(private ordService: OrderService, private afAuth: AngularFireAuth, private afFirestore: AngularFirestore,) { }

  ngOnInit(): void {
    this.getOrders();
    this.userInfo();
  }

  private getOrders(): void {
    this.ordService.getFirecloudOrder().subscribe(collection => {
      this.orders = collection.map(order => {
        const data = order.payload.doc.data() as IOrder;
        const id = order.payload.doc.id;
        return { id, ...data }
      });
      this.userOrders = this.orders.filter(order => order.userPhone === `0${this.phoneNumber}`)
    });
  }
 
  userInfo(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    this.phoneNumber = user.phone;
    this.userName = user.name;
     this.userCity = user.city;
    this.userStreet = user.street;
    this.userHouse = user.house;
  }

  saveProfile(form: NgForm): void {
    let promise = new Promise((resolve, reject) => {
      const user = JSON.parse(localStorage.getItem('user'));
      this.afFirestore.collection('users').ref.where('id', '==', user.id).onSnapshot(
        snap => {
          snap.forEach(userRef => {
            this.path = userRef.id
            user.name = this.userName;
            user.city = this.userCity;
            user.street = this.userStreet;
            user.house = this.userHouse;
            this.updateUser = user;
          }, resolve(user));
        });
    })
    promise
      .then(user => {
        this.afFirestore.collection('users').doc(this.path).update(Object.assign({}, user))
        return user;
      })
      .then(user => localStorage.setItem('user', JSON.stringify(user))),
      error => console.log(error.message);
  }
}
