import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IOrder } from 'src/shared/interfaces/order.interface';
import { IProduct } from 'src/shared/interfaces/product.interface';
import { OrderService } from 'src/shared/services/order.service';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  order: Array<IProduct> = [];
  orderList: Array<IOrder> = [];
  orderService: any;
  totalPrice = 0;
  orderID = 1;
  userName: string;
  userPhone: string;
  userCity: string;
  userStreet: string;
  userHouse: string;
  userComment: string = '';
  status: string = 'В обробці';
  delivery: string;
  payment: string;

  constructor(private ordService: OrderService) { }

  ngOnInit(): void {
    this.getBasket();
    this.getTotal();
    this.getFirebaseOrders();
    this.userInfo();
  }

  private getBasket(): void {
    if (localStorage.length > 0 && localStorage.getItem('myOrder')) {
      this.order = JSON.parse(localStorage.getItem('myOrder'));
    }
  }

  private getFirebaseOrders(): void {
    this.ordService.getFirecloudOrder().subscribe(collection => {
      this.orderList = collection.map(order => {
        const data = order.payload.doc.data() as IOrder;
        const id = order.payload.doc.id;
        return { id, ...data }
      });
    });
  }

  userInfo(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    this.userPhone = user.phone;
    this.userName = user.name;
    this.userCity = user.city;
    this.userStreet = user.street;
    this.userHouse = user.house;
  }

  private getTotal(): void {
    this.totalPrice = this.order.reduce((total, prod) => {
      return total + (prod.price * prod.count);
    }, 0);
  }

  private updateBasket(): void {
    localStorage.setItem('myOrder', JSON.stringify(this.order));
  }

  deleteProduct(product: IProduct): void {
    if (confirm('Are you sure?')) {
      const index = this.order.findIndex(prod => prod.id === product.id);
      this.order.splice(index, 1);
      this.updateBasket();
      this.getTotal();
      this.orderService.basket.next('check');
    }
  }

  addOrder(form: NgForm): void {
    const order = new Order(this.orderID,
      new Date(),
      form.controls.userName.value,
      `0${form.controls.userPhone.value}`,
      form.controls.userCity.value,
      form.controls.userStreet.value,
      form.controls.userHouse.value,
      this.order,
      this.totalPrice,
      this.status,
      `${form.controls.delivery.value}, ${form.controls.cash.value}
       ${form.controls.userComment.value}`);
    if (this.orderList.length > 0) {
      order.id = +this.orderList.slice(-1)[0].id + 1;
    };
    let str = order.id.toString();
    this.orderID = this.orderList.indexOf(order) + 1;
    this.ordService.addFirecloudOrder(str, Object.assign({}, order)).then(
      () => {
        console.log('add order')
      }
    )
    form.reset();
    this.order = [];
    this.orderList = [];
    this.updateBasket();
    this.getTotal();
    this.ordService.basket.next('check');
  }

  checkBasket(): void {
    this.updateBasket();
    this.getTotal();
    this.ordService.basket.next('check');
  }

}
