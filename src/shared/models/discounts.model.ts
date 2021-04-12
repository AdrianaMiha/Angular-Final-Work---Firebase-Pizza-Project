import { IDiscount } from "../interfaces/discounts.interface";

export class Discount implements IDiscount{
  constructor(
  public  id: number ,
  public  title: string,
  public  text: string,
  public  image: string,
  ) {}
}