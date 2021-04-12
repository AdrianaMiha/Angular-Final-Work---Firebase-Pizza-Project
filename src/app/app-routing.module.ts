import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from '../app/blog/blog.component';
import { ProfileComponent } from '../app/profile/profile.component';
import { AdminBlogComponent } from '../app/admin/admin-blog/admin-blog.component';
import { AdminComponent } from '../app/admin/admin.component';
import { AdminCategoryComponent } from '../app/admin/admin-category/admin-category.component';
import { AdminProductsComponent } from '../app/admin/admin-products/admin-products.component';
import { AdminDiscountsComponent } from '../app/admin/admin-discounts/admin-discounts.component';
import { DiscountsComponent } from '../app/discounts/discounts.component';
import { ProductComponent } from '../app/product/product.component';
import { ProductDetailsComponent } from '../app/product-details/product-details.component';
import { DiscountDetailsComponent } from '../app/discount-details/discount-details.component';
import { BasketComponent } from '../app/basket/basket.component';
import { AdminOrderComponent } from './admin/admin-order/admin-order.component';
import {AuthGuard} from '../shared/guards/auth.guard';
import {ProfileGuard} from '../shared/guards/profile.guard';


const routes: Routes = [
  { path: '', redirectTo: 'discounts', pathMatch: 'full' },
  { path: 'discounts', component: DiscountsComponent },
  { path: 'discounts/:id', component: DiscountDetailsComponent },
  { path: 'menu/:category', component: ProductComponent },
  { path: 'menu/:category/:id', component: ProductDetailsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'profile', canActivate: [ProfileGuard], component: ProfileComponent },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard], children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'discounts', component: AdminDiscountsComponent },
      { path: 'blogs', component: AdminBlogComponent },
      { path: 'orders', component: AdminOrderComponent },

    ]
  },
  { path: 'basket', component: BasketComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
