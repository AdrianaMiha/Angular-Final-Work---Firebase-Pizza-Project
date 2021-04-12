import { IOrder } from '../interfaces/order.interface';
import { IProduct } from '../interfaces/product.interface';
export class Order implements IOrder {
  constructor(
    public id: number ,
    public dateOrder: Date,
    public userName: string,
    public userPhone: string,
    public userCity: string,
    public userStreet: string,
    public userHouse: string,
    public orderDetails: Array<IProduct>,
    public totalPayment: number,
    public status: string = 'В обробці',
    public userComment?: string,
  ) {
  }
}