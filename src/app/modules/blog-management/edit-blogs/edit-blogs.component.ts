import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {LoaderService} from '../../../services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { Location } from '@angular/common'
import { UploadmediaService } from 'src/app/services/uploadmedia.service';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-edit-blogs',
  templateUrl: './edit-blogs.component.html',
  styleUrls: ['./edit-blogs.component.scss']
})

export class EditBlogsComponent implements OnInit {

currentdate:any;
updated_date:string;
  editorData: any = "";
  blog_data: any;
  categoryidinarray = [];
  category_list: any;
  blog_Id: any;
  media: string = '';
  response_meesage: boolean = false;
  EditblogForm: FormGroup;
  loader: boolean = false;
  submitted: boolean = false;
  message;
  showpublished_date: string = '';


  constructor(
    private uploadservice: UploadmediaService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private service: BlogService, 
    private _location: Location,
    private ls:LoaderService
  ) {
    this.ls.show();
    setTimeout(() => {this.ls.hide()}, 700);
    this.blog_Id = this.route.snapshot.paramMap.get('id');
    this.service.categorylist().subscribe(category_resp => {
      this.category_list = category_resp.result;
      // this.category_list.forEach(element => {
      //     element.isChecked=false;
      // });
      if(this.category_list){
        this.callapi();
       }
    })
       
   
  }
  openVerticallyCentered(content) {
    this.modalService.open(content, {centered: true});
  }

  ngOnInit() {
    
    this.EditblogForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      caption: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(300)]),
      date: new FormControl(''),
      details: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
    });
   
   
    this.currentdate = _moment(new Date()).utc().valueOf();
  }
  // code for image uploading on S3
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var mimeType = event.target.files[0].type;
      var file = event.target.files[0];
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.media = event.result;
        this.loader = true;
       
      }
      this.uploadservice.uploadfileonAwsS3(file, file.name).subscribe(res => {
        if (res) {
          this.media = res.Location;
          this.loader = false;
         
        }
      });
    }
  }

  
  get f() {
    return this.EditblogForm.controls;
  }
 
  // end image uploading code
  onSubmit() {
    this.ls.show();
    this.submitted = true;
// debugger
    this.categoryidinarray=this.category_list.filter(x=>x.isChecked===true);
    if(this.categoryidinarray.length===0){
      alert('please select category');
      return false;
    }
    

    if (this.EditblogForm.valid) {
      // this.ngxservice.start();
    
      let formvalue = this.EditblogForm.value;
      this.service.blog_update(this.blog_Id, formvalue.caption, formvalue.description, formvalue.title,
        this.categoryidinarray,  this.currentdate, formvalue.details, this.media).subscribe(blog_update_res => {
          if (blog_update_res.status === 200) {
            this.ls.hide();
            this.response_meesage = true;
            setTimeout(() => { this.response_meesage = false }, 2000);
            setTimeout(()=>this.router.navigate(['theme/modules/blog-management/blog-manage']),2100);
            //setTimeout(() => {  this.router.navigate(['/theme/modules/blog-management/blog-details/',this.blog_Id]) }, 2500);
           
          }
        })
    }
  }
  backClicked() {
    this.router.navigate(['theme/modules/blog-management/blog-manage'])
  }
  checkcatvalue(event) {
    event.isChecked=!event.isChecked;
    // console.log(event)
    // if (event.target.checked === true) {
    //   console.log("pushed value in arrray", this.categoryidinarray)
    //   //console.log(event.target.value)
    //   this.categoryidinarray.push(event.target.value)
    // }
    // else {
    //   this.categoryidinarray = this.categoryidinarray.filter(e => e !== event.target.value)
    //   console.log(this.categoryidinarray);
    // }

  }
// call view api
callapi(){
  this.service.viewblogapi(this.blog_Id).subscribe(blog_res => {
    if (blog_res.status === 200) {
     
      this.blog_data = blog_res.result[0];
      this.editorData = blog_res.result[0].detail;
      this.media = blog_res.result[0].media;
      this.showpublished_date = (_moment(blog_res.result[0].created).utc().format('DD/MM/YYYY'));
      this.updated_date=(_moment(blog_res.result[0].updated).utc().format('DD/MM/YYYY'));
      
      this.EditblogForm.patchValue({
        title: this.blog_data.title, caption: this.blog_data.caption, date: this.blog_data.created,
        description: this.blog_data.description, category: this.blog_data.categoryId
      })
      this.categoryidinarray = this.EditblogForm.value.category;

      
      this.category_list.forEach(element => {
        let exist=this.blog_data.categoryId.filter(x=>x._id===element._id)[0];
        if(exist){
          element.isChecked=true;
        }else{
          element.isChecked=false;
        }
      });
     
    }
  })
}

 
}
