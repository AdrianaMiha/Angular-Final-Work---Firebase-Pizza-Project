import { Component, OnInit } from '@angular/core';
import { IBlog } from '../../../shared/interfaces/blog.interface'
import { Blog } from '../../../shared/models/blog.model'
import { BlogService } from '../../../shared/services/blog.service'


@Component({
  selector: 'app-admin-blog',
  templateUrl: './admin-blog.component.html',
  styleUrls: ['./admin-blog.component.css']
})
export class AdminBlogComponent implements OnInit {
  adminBlogs: Array<IBlog> = [];
  id: number;
  title: string;
  text: string;
  author: string;
  date = new Date();
  message: string;

  editStatus: boolean;
  editString: string;
  editB: IBlog;
  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.adminFirebaseBlog()
  }

  private adminFirebaseBlog(): void {
    this.blogService.getFirecloudBlog().subscribe(collection => {
      this.adminBlogs = collection.map(blog => {
        const data = blog.payload.doc.data() as IBlog;
        const id = blog.payload.doc.id;
        return { id, ...data }
      });
    });
  }

  addBlog(): void {
    if (!this.editStatus) {
      const newBlog = new Blog(this.id, this.title, this.text, this.date, this.author);
      if (!this.title || !this.text || !this.author) {
        this.message = "Fill the form!"
      }
      else {
        this.message = "";
        if (this.adminBlogs.length > 0) {
          newBlog.id = +this.adminBlogs.slice(-1)[0].id + 1;
        };
        let str = newBlog.id.toString();
        this.id = this.adminBlogs.indexOf(newBlog) + 1;
        this.blogService.postFirecloudBlog(str, Object.assign({}, newBlog)).then(
          () => {
            console.log('add blog')
          }
        )
        this.resetForm();
      }
    }
    else if (this.editStatus) {
      let str = this.id.toString();
      this.editB.id = this.id;
      this.editB.title = this.title;
      this.editB.text = this.text;
      this.editB.author = this.author;
      this.blogService.updateFirecloudBlog(str, this.editB).then(
        () => {
          this.adminFirebaseBlog();
        }
      );
      this.editStatus = false;
    }
    this.resetForm()
  }

  editBlog(blog: IBlog): void {
    this.editB = blog;
    this.id = blog.id;
    this.title = blog.title;
    this.text = blog.text;
    this.author = blog.author;
    this.editStatus = true;
  }

  private resetForm() {
    this.id = 1;
    this.title = '';
    this.text = '';
    this.author = '';
  }

  deleteBlog(blog: IBlog): void {
    if (confirm('Are you sure?')) {
      let str = blog.id.toString()
      this.blogService.deleteFirecloudBlog(str).then(
        () => {
          this.adminFirebaseBlog();
        }
      );
    }
  }

}
