import { Pipe, PipeTransform } from '@angular/core';
import { IOrder } from 'src/shared/interfaces/order.interface';

@Pipe({
  name: 'search',
  pure: false,
})
export class SearchPipe implements PipeTransform {

  transform(orders: Array<IOrder>, searchString: string): unknown {
    if (!orders) {
      return [];
    }
    if (!searchString) {
      return orders;
    }
    else {
     
      return orders.filter(elem => elem.userName.toLowerCase().includes(searchString.toLowerCase())
      || elem.dateOrder.toString().toLowerCase().includes(searchString.toLowerCase())
        || elem.userPhone.toLowerCase().includes(searchString.toLowerCase())
        || elem.userStreet.toLowerCase().includes(searchString.toLowerCase())
        || elem.userHouse.toLowerCase().includes(searchString.toLowerCase())
        || elem.userComment.toLowerCase().includes(searchString.toLowerCase())
        || elem.status.toLowerCase().includes(searchString.toLowerCase())
        || elem.totalPayment.toString().toLowerCase().includes(searchString.toLowerCase())
        || elem.orderDetails[0].nameUA.toLowerCase().includes(searchString.toLowerCase())
        || elem.orderDetails[1]?.nameUA.toLowerCase().includes(searchString.toLowerCase())
        || elem.orderDetails[2]?.nameUA.toLowerCase().includes(searchString.toLowerCase())
        || elem.orderDetails[3]?.nameUA.toLowerCase().includes(searchString.toLowerCase())
        || elem.orderDetails[4]?.nameUA.toLowerCase().includes(searchString.toLowerCase())
        || elem.orderDetails[0].count.toString().toLowerCase().includes(searchString.toLowerCase())
        || elem.orderDetails[1]?.count.toString().toLowerCase().includes(searchString.toLowerCase())
        || elem.orderDetails[2]?.count.toString().toLowerCase().includes(searchString.toLowerCase())
        || elem.orderDetails[3]?.count.toString().toLowerCase().includes(searchString.toLowerCase())
        || elem.orderDetails[4]?.count.toString().toLowerCase().includes(searchString.toLowerCase())        
        || elem.userCity.toLowerCase().includes(searchString.toLowerCase()));  
    }
  }
}
