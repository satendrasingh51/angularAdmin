import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { BlogService } from '../../../services/blog.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {LoaderService} from '../../../services/loader.service';
import * as _moment from 'moment'
import { BlogService } from 'src/app/services/blog.service';
@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {

  published_date: any;
  last_update: any = '';
  blog_data: any;
  blog_Id: any;
  deletemessage: boolean = false;


  constructor(private modalService: NgbModal,
    private service: BlogService, private router: Router,
    private route: ActivatedRoute, private ls:LoaderService) { }
  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }


  ngOnInit() {
    this.ls.show();
    this.blog_Id = this.route.snapshot.paramMap.get('id');
    this.service.viewblogapi(this.blog_Id).subscribe(blog_res => {
      if (blog_res.status === 200) {
        this.ls.hide();
        this.blog_data = blog_res.result[0];
        //for date
        this.published_date = (_moment.utc(this.blog_data.created).format('DD/MM/YYYY'));
        this.last_update = (_moment.utc(this.blog_data.date).format('DD/MM/YYYY'));

      }
    })
  }


  deleteblog() {
    this.ls.show();
    this.service.deleteblogapi(this.blog_Id).subscribe(deleteblog_resp => {
      if (deleteblog_resp.status === 200) {
        this.ls.hide();
        this.deletemessage = true;
        this.modalService.dismissAll();
        setTimeout(() => this.router.navigate(['/theme/modules/blog-management/blog-manage']),2000);
      }
    })
  }

  editpageopen(event) {
    this.router.navigate(['/theme/modules/blog-management/edit-blogs/', event]);
  }

}
