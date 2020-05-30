import { Component, OnInit } from '@angular/core';
// import { UploadmediaService } from '../../services/uploadmedia.service';
import * as _moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from '../../../services/blog.service';
import { Router } from '@angular/router';
import {LoaderService} from '../../../services/loader.service';
import { Location } from '@angular/common'
import { UploadmediaService } from 'src/app/services/uploadmedia.service';
import { BlogService } from 'src/app/services/blog.service';

export interface IFileNameS3 {
  Bucket: string;
  Key: string;
  Location: string;
  key: string;
}

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})

export class AddBlogComponent implements OnInit {
  imagevalidationmsg: boolean = false;
  valuedate = new Date();
  categoryname: string;
  categoryidinarray = [];
  //for code
  submitted = false;
  loader: boolean = false;

  addformmessage: boolean = false;

  profileForm = new FormGroup({
    caption: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(300)]),
    date: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    details: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    media: new FormControl('')
  });
  // form code end
  message;
  url: any;
  selectedFiles: FileList;
  profileImg: string = "";
  profileLink: string;

  constructor(private uploadservice: UploadmediaService, private blogservice: BlogService, private router: Router,
     private _location: Location, private ls:LoaderService) {
    // this.url = ''
  }


  ngOnInit() {
      this.ls.show();
      setTimeout(() => {this.ls.hide()}, 500);
    // for category api
    this.blogservice.categorylist().subscribe(respons => {
      this.categoryname = respons.result
    })
   
  }

  get f() {
    return this.profileForm.controls;
  }
  onSelectFile(event) {
    //  console.log(event.target.files)
    // this.url = event.target.files[0].name;
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
        this.url = event.result;
        this.ls.show();
      }
     
      this.uploadservice.uploadfileonAwsS3(file, file.name).subscribe(res => {
        if (res) {
         
          this.ls.hide();// this.loader = false;
          this.url = res.Location;
          this.imagevalidationmsg = false;
        }
      });
    }
  }
  // code for from data send in api
  onSubmit() {
    this.submitted = true;
    if (this.url === undefined || null) {
      this.imagevalidationmsg = true;
    }
    else if (this.url) {
      if (this.profileForm.valid) {
        this.ls.show();
        let datechnage = _moment(this.valuedate).utc().valueOf();
        this.blogservice.addblog(this.profileForm.value.caption, this.profileForm.value.description, this.profileForm.value.title,
          this.categoryidinarray, datechnage, this.profileForm.value.details, this.url).subscribe(reponse => {
            if (reponse.status === 200) {
              this.ls.hide();
              this.addformmessage = true;
              setTimeout(() => { this.addformmessage = false }, 2000);
              setTimeout(() => { this.router.navigate(['theme/modules/blog-management/blog-manage']) }, 2200);

            }
          })
      }
    }
    else {

    }
  }
  backClicked() {
    this._location.back();
  }
  checkcatvalue(event) {
    // console.log(event)
    if (event.target.checked === true) {
      this.categoryidinarray.push(event.target.value)
    }
    else { this.categoryidinarray = this.categoryidinarray.filter(e => e !== event.target.value) }
    // console.log(this.categoryidinarray);
  }

}

