import { IProduct } from './product.interface';
export interface IOrder{
  id: number ;
  dateOrder: Date;  
  userName: string;
  userPhone: string;
  userCity: string;
  userStreet: string;
  userHouse: string;
  orderDetails: Array<IProduct>;
  totalPayment: number;
  status: string;
  userComment?: string;  
}