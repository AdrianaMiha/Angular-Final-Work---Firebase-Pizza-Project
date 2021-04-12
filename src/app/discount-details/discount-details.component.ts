import { Component, OnInit } from '@angular/core';
import { IDiscount } from 'src/shared/interfaces/discounts.interface';
import { ActivatedRoute } from '@angular/router';
import { DiscountsService } from '../../shared/services/discounts.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-discount-details',
  templateUrl: './discount-details.component.html',
  styleUrls: ['./discount-details.component.css']
})
export class DiscountDetailsComponent implements OnInit {
  discount: IDiscount;
  constructor(private discountService: DiscountsService, private router: ActivatedRoute, 
              private location: Location) { }

  ngOnInit(): void {
    this.getMyFirebaseDiscount();
  }

  getMyFirebaseDiscount(): void {
    const id = +this.router.snapshot.paramMap.get('id');
    const str = id.toString();
    this.discountService.getOneFirebaseDiscount(str).subscribe(discount => {
      const data = discount.payload.data() as IDiscount;
      const id = discount.payload.id;
      this.discount = data;
        return { id, ...data }      
    });     
  }

  goBack(): void{
    this.location.back();
  }
}
