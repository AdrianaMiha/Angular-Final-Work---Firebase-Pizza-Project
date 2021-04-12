import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IOrder } from 'src/shared/interfaces/order.interface';
import { OrderService } from 'src/shared/services/order.service';
import { countDownTimerConfigModel, countDownTimerTexts, CountdownTimerService } from 'ngx-timer';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css']
})
export class AdminOrderComponent implements OnInit {
  modalRef: BsModalRef;
  orders: Array<IOrder> = [];
  statuses: Array<any> = ['В обробці', 'Підтверджено', 'Виконано', 'Скасовано'];
  statusName: string;

  filter: any = '';
  reverse = true;
  order: string = '';

  editOrd: IOrder;

  pageSize: number = 5;
  currentPage: number = 1;
  testConfig: countDownTimerConfigModel;

  constructor(private modalService: BsModalService,
    private ordService: OrderService,
    private CountdownTimerService: CountdownTimerService) {
  }

  ngOnInit(): void {
    this.getOrders();
  }

  timerFunc(orderDate: any): boolean {
    this.testConfig = new countDownTimerConfigModel();
    this.testConfig.timerTexts = new countDownTimerTexts();
    this.testConfig.timerTexts.hourText = " :";
    this.testConfig.timerTexts.minuteText = " :";
    this.testConfig.timerTexts.secondsText = " ";
    let cdate = new Date(orderDate.toDate());
    let stop = cdate.setMinutes(cdate.getMinutes() + 30);
    let check = new Date()
    let minus = check.getTime() - cdate.getTime();
    if (minus > 0) {
      return false
    }
    else if (minus < 0) {
      this.CountdownTimerService.startTimer(stop);
      return true
    }
  }

  openModal2(template: TemplateRef<any>, order?): void {
    this.editOrd = order;
    this.modalRef = this.modalService.show(template);
  }

   private getOrders(): void {
    this.ordService.getFirecloudOrder().subscribe(collection => {
      this.orders = collection.map(order => {
        const data = order.payload.doc.data() as IOrder;
        const id = order.payload.doc.id;
        return { id, ...data }
      });
    });
  }

   editOrder(): void {
    let ord = this.editOrd;
    ord.id = this.editOrd.id;
    let str = this.editOrd.id.toString()
    ord.status = this.statusName;
    this.ordService.updateFirecloudOrder(str, this.editOrd).then(
      () => {
        this.getOrders();
      }
    );
    this.modalService.hide(1);
    this.resetForm();
  }

  resetForm(): void {
    this.statusName = '';
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

}
