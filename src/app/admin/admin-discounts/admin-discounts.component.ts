import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OrderPipe } from 'ngx-order-pipe';
import { FilterPipe } from 'ngx-filter-pipe';
import { IDiscount } from '../../../shared/interfaces/discounts.interface'
import { Discount } from '../../../shared/models/discounts.model'
import { DiscountsService } from '../../../shared/services/discounts.service'
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';


@Component({
  selector: 'app-admin-discounts',
  templateUrl: './admin-discounts.component.html',
  styleUrls: ['./admin-discounts.component.css']
})
export class AdminDiscountsComponent implements OnInit {
  adminDiscount: Array<IDiscount> = [];
  id: number;
  title: string;
  text: string;
  image: string;

  editStatus: boolean;
  editDisc: IDiscount;

  uploadProgress: Observable<number>;
  imageStatus: boolean;
  fileName: string;
  link: string;

  field: string = "id";
  reverse: boolean;
  n1: string = '№▼';
  n2: string = 'Title';
  n3: string = 'Text';
  check: number;
  filter: string = '';
  x: any;

  filterArray: any;

  modalRef: BsModalRef;
  constructor(private modalService: BsModalService, private discService: DiscountsService, private afStorage: AngularFireStorage, private orderPipe: OrderPipe, private filterP: FilterPipe) {
    this.x = setInterval(() => {
      this.filterArray = {
        $or: [
          { 'title': this.filter },

          { 'text': this.filter },
        ]
      };
    }, 100);
  }

  ngOnInit(): void {
      this.adminFirebaseDiscount();
  }

  private adminFirebaseDiscount(): void {
    this.discService.getFirecloudDiscount().subscribe(collection => {
      this.adminDiscount = collection.map(discount => {
        const data = discount.payload.doc.data() as IDiscount;
        const id = discount.payload.doc.id;
        return { id, ...data }
      });
    });
  }
 
  openModal(template: TemplateRef<any>): void {
    this.resetForm()
    this.modalRef = this.modalService.show(template);
    this.editStatus = false;
  }

  openModal2(template: TemplateRef<any>, disc?): void {
    this.editStatus = true;
    this.editDisc = disc;
    this.modalRef = this.modalService.show(template);
    this.check = disc.id;
    this.id = disc.id;
    this.title = disc.title;
    this.text = disc.text
    this.image = disc.image;
    this.imageStatus = true;
  }

    addDiscount() {
    const newDisc = new Discount(this.id, this.title.toLowerCase(), this.text.toLowerCase(), this.image);
    if (this.adminDiscount.length > 0) {
      newDisc.id = +this.adminDiscount.slice(-1)[0].id + 1;
    };
    let str = newDisc.id.toString();
    this.id = this.adminDiscount.indexOf(newDisc) + 1;
    this.discService.postFirecloudDiscount(str, Object.assign({}, newDisc)).then(
      () => {
        console.log('add discount')
      }
    )
    this.resetForm();
    this.modalService.hide(1);
  }

   checkDel(): void {
    let str = this.check.toString()
    this.discService.deleteFirecloudDiscount(str).then(
      () => {
        this.adminFirebaseDiscount();
      }
    );
    this.removePictureFromStorage()
    this.modalService.hide(1);
    document.body.classList.remove('modal-open')
  };


  deleteDiscount(deleteDisc: TemplateRef<any>, discount: IDiscount): void {
    this.modalRef = this.modalService.show(deleteDisc);
    this.modalRef.setClass('modal-dialog-centered');
    this.check = discount.id;
    this.link = discount.image;
  }


  uploadFile(event): void {
    const file = event.target.files[0];
    const type = file.type.slice(file.type.indexOf('/') + 1);
    const name = file.name.slice(0, file.name.lastIndexOf('.')).toLowerCase();
    this.fileName = file.name;
    const filePath = `discounts/${name}.${type}`;
    const task = this.afStorage.upload(filePath, file);
    this.uploadProgress = task.percentageChanges();
    task.then(image => {
      this.afStorage.ref(`discounts/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.image = url;
        this.imageStatus = true;
      });
    });
  }


  deleteImg(): void {
    this.link = this.image;
    this.removePictureFromStorage();
    this.imageStatus = false;
    this.image = '';
  }

  removePictureFromStorage(): void {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    const newLink = this.link.slice(this.link.indexOf('%2F') + 3, this.link.indexOf('?alt=media'));
    var desertRef = storageRef.child(`discounts/${newLink}`);
    desertRef.delete().then(function () {
    }).catch(function (error) {
    });
  }

  IDorder() {
    this.n2 = 'Title';
    this.n3 = 'Text';
    this.field = "id";
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n1 = '№▼';
    }
    else if (this.reverse) {
      this.n1 = '№▲';
    }
  }

  titleorder() {
    this.n1 = '№';
    this.field = "title";
    this.n3 = 'Text';
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n2 = 'Title ▼';
    }
    else if (this.reverse) {
      this.n2 = 'Title ▲';
    }
  }

  textorder() {
    this.n1 = '№';
    this.field = "text";
    this.n2 = 'Title';
    this.reverse = !this.reverse;
    if (!this.reverse) {
      this.n3 = 'Text ▼';
    }
    else if (this.reverse) {
      this.n3 = 'Text ▲';
    }
  }

  editDiscount(): void {
    let str = this.check.toString()
    let disc = this.editDisc;
    disc.title = this.title;
    disc.text = this.text;
    disc.image = this.image;
    this.discService.updateFirecloudDiscount(str, this.editDisc).then(
      () => {
        this.adminFirebaseDiscount();
      }
    );
    this.modalService.hide(1);
    this.resetForm();
  }

  private resetForm() {
    document.body.classList.remove('modal-open')
    this.title = '';
    this.text = '';
    this.image = '';
    this.imageStatus = false;
  }
}
