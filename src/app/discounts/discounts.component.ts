import { Component, OnInit } from '@angular/core';
import { IDiscount } from 'src/shared/interfaces/discounts.interface';
import { DiscountsService } from 'src/shared/services/discounts.service';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css']
})
export class DiscountsComponent implements OnInit {
  userDiscounts: Array<IDiscount> = [];
  constructor(private discountService: DiscountsService) { }

  ngOnInit(): void {
    this.adminFirebaseDiscount();
  }

  private adminFirebaseDiscount(): void {
    this.discountService.getFirecloudDiscount().subscribe(collection => {
      this.userDiscounts = collection.map(discount => {
        const data = discount.payload.doc.data() as IDiscount;
        const id = discount.payload.doc.id;
        return { id, ...data }
      });
    });
  }

}
