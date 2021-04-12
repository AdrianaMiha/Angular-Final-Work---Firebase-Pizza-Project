import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogComponent } from './blog/blog.component';
import { AdminBlogComponent } from './admin/admin-blog/admin-blog.component';
import { HeaderComponent } from './components/header/header.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';

import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment.prod';

import { NgxMaskModule, IConfig } from 'ngx-mask'

import { AdminDiscountsComponent } from './admin/admin-discounts/admin-discounts.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { ProductComponent } from './product/product.component';
import { DiscountDetailsComponent } from './discount-details/discount-details.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { BasketComponent } from './basket/basket.component';
import { ProductCountComponent } from './components/product-count/product-count.component';
import { AdminOrderComponent } from './admin/admin-order/admin-order.component';
import { SearchPipe } from './admin/admin-order/search.pipe';
import { ProfileComponent } from './profile/profile.component';
import { AngularPaginatorModule } from 'angular-paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxTimerModule } from 'ngx-timer';

import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { loaderConfig } from './preloader.config';

@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    AdminBlogComponent,
    HeaderComponent,
    AdminComponent,
    AdminCategoryComponent,
    AdminProductsComponent,
    AdminDiscountsComponent,
    DiscountsComponent,
    ProductComponent,
    DiscountDetailsComponent,
    ProductDetailsComponent,
    BasketComponent,
    ProductCountComponent,
    AdminOrderComponent,
    SearchPipe,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgxMaskModule.forRoot(),
    HttpClientModule,
    OrderModule,
    FilterPipeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularPaginatorModule,
    NgxPaginationModule,
    NgxTimerModule,
    NgxUiLoaderModule.forRoot(loaderConfig),
    NgxUiLoaderRouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
