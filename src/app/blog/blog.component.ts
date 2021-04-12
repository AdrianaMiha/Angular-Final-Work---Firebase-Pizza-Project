import { Component, OnInit } from '@angular/core';
import { IBlog } from 'src/shared/interfaces/blog.interface';
import { BlogService } from 'src/shared/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  userBlogs: Array<IBlog> = [];
  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.userFirebaseBlog();
  }

  private userFirebaseBlog(): void {
    this.blogService.getFirecloudBlog().subscribe(collection => {
      this.userBlogs = collection.map(blog => {
        const data = blog.payload.doc.data() as IBlog;
        const id = blog.payload.doc.id;
        return { id, ...data }
      });
    });
  }
}
