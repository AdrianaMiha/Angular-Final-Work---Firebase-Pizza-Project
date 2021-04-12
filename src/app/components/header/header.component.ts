import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ICategory } from 'src/shared/interfaces/category.interface';
import { CategoryService } from 'src/shared/services/category.service';
import { OrderService } from 'src/shared/services/order.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { AngularFireStorage } from '@angular/fire/storage';
import { ProfileGuard } from '../../../shared/guards/profile.guard';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  categories: Array<ICategory> = [];
  totalPrice = 0;
  modalRef: BsModalRef;
  loginForm: FormGroup;
  access: boolean;
  admin: boolean;
  profile: boolean;


  constructor(private catService: CategoryService,
    private authGuards: AuthGuard,
    private profileGuards: ProfileGuard,
    private ordService: OrderService,
    private authService: AuthService,
    private modalService: BsModalService,
    private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.adminFirebaseCategories();
    this.checkBasket();
    this.getLocalStorage();
    this.loginIn();
    this.checkAccess();
    this.getLocal();
  }

  private adminFirebaseCategories(): void {
    this.catService.getFirecloudCategory().subscribe(collection => {
      this.categories = collection.map(category => {
        const data = category.payload.doc.data() as ICategory;
        const id = category.payload.doc.id;
        return { id, ...data }
      });
    });
  }

  private checkBasket(): void {
    this.ordService.basket.subscribe(
      () => {
        this.getLocalStorage();
      }
    )
  }

  private getLocalStorage(): void {
    if (localStorage.length > 0 && localStorage.getItem('myOrder')) {
      const basket = JSON.parse(localStorage.getItem('myOrder'));
      this.totalPrice = basket.reduce((total, prod) => {
        return total + prod.price * prod.count;
      }, 0)
    }
  }

  loginModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
    this.loginIn();
  }

  loginIn(): void {
    this.loginForm = new FormGroup({
      userPassword: new FormControl(),
      userPhone: new FormControl('0', [Validators.required, Validators.pattern('[0-9]*')]),
    }
    )
  }

  submit(): void {
    const { userPhone, userPassword } = this.loginForm.value;
    let email = `${userPhone}@pizza.com`;
    console.log(email, userPassword);
    this.authService.signIn(email, userPassword);
    this.access = this.authGuards.checkLogin();
    this.admin = this.authGuards.checkLogin();
    this.profile = this.profileGuards.checkLogin();
    this.modalService.hide(1);
  }

  exit(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  signOut(): void {
    this.authService.signOut();
    this.modalService.hide(1);
    this.access = false;
    this.admin = false;
    this.profile = false;
  }

  private checkAccess(): void {
    this.authService.access.subscribe(
      () => {
        this.getLocal();
      }
    )
  }

  private getLocal(): void {
    if (localStorage.length > 0 && localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user != null && user.role === 'admin') {
        this.access = true;
        this.admin = true;
        this.profile = false;
      }
      else if (user != null && user.role === 'user') {
        this.access = true;
        this.profile = true;
        this.admin = false;
      }
      else {
        this.access = false;
        this.admin = false;
        this.profile = false;
      }
    }
  }

}
