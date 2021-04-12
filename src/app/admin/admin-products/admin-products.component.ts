import { Component, OnInit, TemplateRef } from '@angular/core';
import { ICategory } from '../../../shared/interfaces/category.interface';
import { IProduct } from '../../../shared/interfaces/product.interface';
import { Product } from '../../../shared/models/product.model';
import { CategoryService } from '../../../shared/services/category.service';
import { ProductService } from '../../../shared/services/product.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  categories: Array<ICategory> = [];
  categoryName: string;
  adminProduct: Array<IProduct> = [];
  productID = 1;
  productImage: string;
  productCategory: ICategory;
  productNameEN: string;
  productNameUA: string;
  productDescription: string;
  productWeight: string;
  productPrice: number;
  category: ICategory;
  nameEN: string;

  uploadProgress: Observable<number>;
  imageStatus: boolean;

  modalRef: BsModalRef;

  link: string;
  check: number;
  fileName: string;

  filter: string = '';
  x: any;
  filterArray: any;
  field: string = "id";
  reverse: boolean;
  n1: string = '№▼';
  n2: string = 'Name EN';
  n3: string = 'Name UA';
  n4: string = 'Category';
  n5: string = 'Weight';
  n6: string = 'Price';

  editProduct: IProduct;
  editStatus: boolean;

  pageSize: number = 10;
  currentPage: number = 1;

  constructor(private modalService: BsModalService,
    private catService: CategoryService,
    private prodService: ProductService,
    private afStorage: AngularFireStorage) {
    this.x = setInterval(() => {
      this.filterArray = {
        $or: [
          { 'id': this.filter },
          { 'nameEN': this.filter },
          { 'category.nameEN': this.filter },
          { 'nameUA': this.filter },
          { 'description': this.filter },
          { 'weight': this.filter },
          { 'price': this.filter },
        ]
      };
    }, 100);
  }

  ngOnInit(): void {
    this.getFirecloudCategories();
    this.getFirebaseProduct();
  }

  private getFirebaseProduct(): void {
    this.prodService.getFirecloudProduct().subscribe(collection => {
      this.adminProduct = collection.map(product => {
        const data = product.payload.doc.data() as IProduct;
        const id = product.payload.doc.id;
        return { id, ...data }
      });
    });
  }

  private getFirecloudCategories(): void {
    this.catService.getFirecloudCategory().subscribe(collection => {
      this.categories = collection.map(category => {
        const data = category.payload.doc.data() as ICategory;
        const id = category.payload.doc.id;
        return { id, ...data }
      });
    });
  }

  openModal(template: TemplateRef<any>): void {
    this.resetForm()
    this.modalRef = this.modalService.show(template);
    this.editStatus = false;
  }

  openModal2(template: TemplateRef<any>, prod?): void {
    this.editStatus = true;
    this.editProduct = prod;
    this.modalRef = this.modalService.show(template);
    this.check = prod.id;
    this.productID = prod.id;
    this.categoryName = prod.category.nameEN;
    this.productNameEN = prod.nameEN
    this.productNameUA = prod.nameUA
    this.productDescription = prod.description;
    this.productWeight = prod.weight;
    this.productPrice = prod.price;
    this.productImage = prod.image;
    this.imageStatus = true;
  }

  addProduct(): void {
    const product: IProduct = new Product(this.productID,
      this.productCategory,
      this.productNameEN,
      this.productNameUA,
      this.productDescription,
      this.productWeight,
      this.productPrice,
      this.productImage);
    if (this.adminProduct.length > 0) {
      product.id = +this.adminProduct.slice(-1)[0].id + 1;
    };
    let str = product.id.toString();
    this.productID = this.adminProduct.indexOf(product) + 1;
    this.prodService.postFirecloudProduct(str, Object.assign({}, product)).then(
      () => {
        console.log('add product')
      }
    )
    this.resetForm();
    this.modalService.hide(1);
  }

  setCategory(): void {
    this.productCategory = this.categories.filter(cat => cat.nameEN === this.categoryName)[0];
  }

  uploadFile(event): void {
    const file = event.target.files[0];
    const type = file.type.slice(file.type.indexOf('/') + 1);
    const name = `${file.name.slice(0, file.name.lastIndexOf('.')).toLowerCase()}`;
    this.fileName = file.name;
    const filePath = `images/${name}.${type}`;
    const task = this.afStorage.upload(filePath, file);
    this.uploadProgress = task.percentageChanges();
    task.then(image => {
      this.afStorage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.productImage = url;
        this.imageStatus = true;
      });
    });
  }

  deleteImg(): void {
    this.link = this.productImage;
    this.removePictureFromStorage();
    this.imageStatus = false;
    this.productImage = '';
  }

  removePictureFromStorage(): void {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    const newLink = this.link.slice(this.link.indexOf('%2F') + 3, this.link.indexOf('?alt=media'));
    var desertRef = storageRef.child(`images/${newLink}`);
    desertRef.delete().then(function () {
    }).catch(function (error) {
    });
  }

  checkDel(): void {
    let str = this.check.toString();
    this.prodService.deleteFirecloudProduct(str).then(
      () => {
        this.getFirebaseProduct();
      }
    );
    this.removePictureFromStorage()
    this.modalService.hide(1);
    document.body.classList.remove('modal-open')
  };

  deleteProduct(deleteProd: TemplateRef<any>, prod: IProduct): void {
    this.modalRef = this.modalService.show(deleteProd);
    this.modalRef.setClass('modal-dialog-centered');
    this.check = prod.id;
    this.link = prod.image;
  }

  IDorder() {
    this.n2 = 'Name EN';
    this.n3 = 'Name UA';
    this.field = "id";
    this.n4 = 'Category';
    this.n5 = 'Weight';
    this.n6 = 'Price';
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n1 = '№▼';
    }
    else if (this.reverse) {
      this.n1 = '№▲';
    }
  }

  ENorder() {
    this.n1 = '№';
    this.n3 = 'Name UA';
    this.field = "nameEN";
    this.n4 = 'Category';
    this.n5 = 'Weight';
    this.n6 = 'Price';
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
    this.n4 = 'Category';
    this.n5 = 'Weight';
    this.n6 = 'Price';
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n3 = 'Name UA ▼';
    }
    else if (this.reverse) {
      this.n3 = 'Name UA ▲';
    }
  }

  catorder() {
    this.n1 = '№';
    this.n2 = 'Name EN';
    this.n3 = 'Name UA';
    this.field = "category.nameEN";
    this.n5 = 'Weight';
    this.n6 = 'Price';
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n4 = 'Category▼';
    }
    else if (this.reverse) {
      this.n4 = 'Category▲';
    }
  }

  weightorder() {
    this.n1 = '№';
    this.n2 = 'Name EN';
    this.n3 = 'Name UA';
    this.field = "weight";
    this.n4 = 'Category';
    this.n6 = 'Price';
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n5 = 'Weight▼';
    }
    else if (this.reverse) {
      this.n5 = 'Weight▲';
    }
  }

  priceorder() {
    this.n1 = '№';
    this.n2 = 'Name EN';
    this.n3 = 'Name UA';
    this.field = "price";
    this.n4 = 'Category';
    this.n5 = 'Weight';
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n6 = 'Price▼';
    }
    else if (this.reverse) {
      this.n6 = 'Price▲';
    }
  }

  editProd(): void {
    let str = this.check.toString()
    this.editProduct.id = this.productID;
    this.setCategory();
    this.editProduct.category = this.productCategory;
    this.editProduct.nameEN = this.productNameEN;
    this.editProduct.nameUA = this.productNameUA;
    this.editProduct.description = this.productDescription;
    this.editProduct.weight = this.productWeight;
    this.editProduct.price = this.productPrice;
    this.editProduct.image = this.productImage;
    this.prodService.updateFirecloudProduct(str, this.editProduct).then(
      () => {
        this.getFirebaseProduct();
      }
    );
    this.modalService.hide(1);
    this.resetForm();
  }

  private resetForm() {
    document.body.classList.remove('modal-open')
    this.productNameEN = '';
    this.productNameUA = '';
    this.productDescription = '';
    this.productWeight = '';
    this.productPrice = null;
    this.productImage = '';
    this.categoryName = '';
    this.imageStatus = false;
  }

}
