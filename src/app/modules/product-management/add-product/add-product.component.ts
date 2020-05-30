import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _moment from 'moment';
import {LoaderService} from '../../../services/loader.service';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { UploadmediaService } from 'src/app/services/uploadmedia.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})

export class AddProductComponent implements OnInit {
  logourl:any;
  editorValue: string;

Brandnames=[];

 
  selected_show = ""
  // public Editor = ClassicEditor;
  sub_cat_dropdown: boolean = false;
  data_sub_cat: any;
  sub_cat_array = [];
  sub_validation_msg: boolean = false;
  submitted: boolean = false;
  category_name: string = '';
  current_date = new Date();
  categoryid_inarray = [];
  media: string;
  img_validation_msg: boolean = false;
  message;
  success_msg: boolean = false;
  error_msg: boolean = false;
  // code for dropdown multi
  dropdownList = [];
  // selectedItems = [];
  // dropdownSettings = {};
  // end  code for dropdown 


  product_form = new FormGroup({
    p_name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    brand_name: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    direction: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    description: new FormControl('', Validators.required)
  });

  constructor(private product_service: ProductService,
    private uploadservice: UploadmediaService, private router: Router, private ls:LoaderService) {
    this.product_service.pr_category().subscribe(category_resp => {
      this.dropdownList = category_resp.result;
    })
   
  }

  ngOnInit() {
      this.ls.show();
      setTimeout(() => {this.ls.hide()}, 600);
    this.brandname();


    // this.selectedItems = [ ];
    //
  }

  get validation() {
    return this.product_form.controls;
  }
  // code for image upload on s3 server

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
        this.ls.show(); 
      }
    
      this.uploadservice.uploadfileonAwsS3(file, file.name).subscribe(res => {
        if (res) {
          this.ls.hide(); 
          this.media = res.Location;
          this.img_validation_msg = false;
        }
      });
    }
  }

  onChange(event) {
    this.product_service.sub_category(event.target.value).subscribe(sub_category_resp => {
      if (sub_category_resp.status === 200) {
        if (sub_category_resp.result.length > 0) {
          this.sub_cat_dropdown = true;
          this.data_sub_cat = sub_category_resp.result;
        }
        else if (sub_category_resp.result.length <= 0) {
          this.sub_cat_dropdown = false;
        }
      }
      else {
        this.sub_cat_dropdown = false;
      }

    })
  }

  subcategory(event) {
    // console.log(event.target.value)
    this.sub_validation_msg = false;
    this.sub_cat_array.push(event.target.value)
  }


  onSubmit() {
    this.submitted = true;
    if (this.media === undefined || null) {
      this.img_validation_msg = true;
    }
    // if (this.sub_cat_dropdown = true) {
    //   if (this.sub_cat_array.length <= 0) {
    //     this.sub_validation_msg = true;
    //   }
    // }
    else if (this.media) {

      if (this.product_form.valid) {
        this.ls.show();
        let datechnage = _moment(this.current_date).utc().valueOf();
        let f_value = this.product_form.value;
        this.categoryid_inarray.push(f_value.category)

        this.product_service.product_add(f_value.p_name, f_value.brand_name, f_value.direction, this.categoryid_inarray,
          this.sub_cat_array, datechnage, f_value.description, this.media,this.logourl).subscribe(reponse => {
            if (reponse.status === 200) {
              this.ls.hide();
              this.success_msg = true;
            
              setTimeout(() => { this.success_msg = false }, 2000);
              setTimeout(() => { this.router.navigate(['/theme/modules/product-management/manage-products']), this.product_form.reset() }, 2200);

            }
            else {
              this.error_msg = true;
              setTimeout(() => { this.error_msg = false }, 2000);
            }
          })
      }
    }
    else {
      console.log("uploaded")
    }

  }

  logouploadimage(event){
   
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
          this.logourl = event.result;
          this.ls.show(); //this.loader = true;
        }
      
        this.uploadservice.uploadfileonAwsS3(file, file.name).subscribe(res => {
          if (res) {
            this.ls.hide();
            this.logourl = res.Location;
            this.img_validation_msg = false;
           
          }
        });
      }
  }


//  ************************************** api call for brand name**********************************//
brandname(){
  this.product_service.brandname().subscribe(response=>{
    if(response.status==200){
      this.Brandnames=response.result.data;
    }
  }
  )
}

//************************code end for api call***************************************************** */


  // onItemSelect(item: any) {
  //   if(item._id) {
  //    this.categoryid_inarray.push(item._id)
  //    console.log('categoriiiii singleeeee', this.categoryid_inarray);
  //   }
  // }
  // onSelectAll(item: any) {
  //   var len=item.length
  //   var data=item;
  //   while(len>0){  
  //       len=len-1;
  //      this.categoryid_inarray.push(data[len]._id);

  //     }
  //     console.log('Allllllllll', this.categoryid_inarray)
  // }
  // onItemDeSelect(item){
  //   this.categoryid_inarray = this.categoryid_inarray.filter(e => e !== item._id);
  //   console.log('category_id unselect', this.categoryid_inarray)
  // }
  // onDeSelectAll(event){
  //     this.categoryid_inarray=[]; 
  //     console.log( this.categoryid_inarray)
  //    }

}
