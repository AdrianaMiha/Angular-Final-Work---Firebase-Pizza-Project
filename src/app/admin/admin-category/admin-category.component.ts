import { Component, OnInit, TemplateRef } from '@angular/core';
import { ICategory } from '../../../shared/interfaces/category.interface'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CategoryService } from '../../../shared/services/category.service'

import { OrderPipe } from 'ngx-order-pipe';
import { FilterPipe } from 'ngx-filter-pipe';
import { AngularFirestore } from '@angular/fire/firestore';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {
  adminCategory: Array<ICategory> = [];
  id: number;
  nameEN: string;
  nameUA: string;
  field: string = "id";
  reverse: boolean;
  n1: string = '№▼';
  n2: string = 'Name EN';
  n3: string = 'Name UA';
  check: any;
  filter: string = '';
  x: any;
  filterArray: any;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService, private catService: CategoryService, private firestore: AngularFirestore) {
    this.x = setInterval(() => {
      this.filterArray = {
        $or: [
          { 'nameEN': this.filter },
          { 'nameUA': this.filter },
        ]
      };
    }, 100);
  }

  ngOnInit(): void {
    this.adminFirebaseCategories();
  }

  private adminFirebaseCategories(): void {
    this.catService.getFirecloudCategory().subscribe(collection => {
      this.adminCategory = collection.map(category => {
        const data = category.payload.doc.data() as ICategory;
        const id = category.payload.doc.id;
        return { id, ...data }
      });
    });
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  addCategory(): void {
    const newC = new Category(this.id, this.nameEN, this.nameUA);
    if (this.adminCategory.length > 0) {
      newC.id = +this.adminCategory.slice(-1)[0].id + 1;
    }
    let str = newC.id.toString();
    this.id = this.adminCategory.indexOf(newC) + 1;
    this.catService.postFirecloudCategory(str, Object.assign({}, newC)).then(
      () => {
        console.log('add category')
      }
    )
    this.resetForm();
    this.modalService.hide(1);
    document.body.classList.remove('modal-open')
  }

  private resetForm(): void {
    this.id = 1;
    this.nameEN = '';
    this.nameUA = '';
  }

  checkDel(): void {
    this.modalService.hide(1);
    this.catService.deleteFirecloudCategory(this.check.toString()).then(
      () => {
        this.adminFirebaseCategories();
      }
    );
  };

  deleteCategory(deleteCat: TemplateRef<any>, category: ICategory): void {
    this.modalRef = this.modalService.show(deleteCat);
    this.modalRef.setClass('modal-dialog-centered');
    this.check = category.id;
  }

  IDorder() {
    this.n2 = 'Name EN';
    this.n3 = 'Name UA';
    this.field = "id";
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n1 = '№ ▼';
    }
    else if (this.reverse) {
      this.n1 = '№ ▲';
    }
  }

  ENorder() {
    this.n1 = '№';
    this.n3 = 'Name UA';
    this.field = "nameEN";
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n2 = 'Name EN ▼';
    }
    else if (this.reverse) {
      this.n2 = 'Name EN ▲';
    }
  }

  UAorder() {
    this.n1 = '№';
    this.n2 = 'Name EN';
    this.field = "nameUA";
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n3 = 'Name UA ▼';
    }
    else if (this.reverse) {
      this.n3 = 'Name UA ▲';
    }
  }
}







