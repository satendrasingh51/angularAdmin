import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../../../services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { UploadmediaService } from '../../../services/uploadmedia.service';
import { ProductService } from 'src/app/services/product.service';
import { UploadmediaService } from 'src/app/services/uploadmedia.service';
import {LoaderService} from '../../../services/loader.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  brandnames;

  logoUrl:any;
  submitted: boolean = false;
  message;
  updatemsg: boolean = false;
  public Editor = ClassicEditor;
  editorData: any = "";
  product_id: string = '';
  product_data_display: any;
  date;
  catgorylist = [];
  show_subcategory: boolean = false;
  sub_categorylist = [];
  category_in_array = [];
  sub_category_in_array = [];
  media: string = '';



  Edit_product_form = new FormGroup({
    pr_name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    pr_brand: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    pr_category: new FormControl('', Validators.required),
    pr_directiorn: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    sub_category: new FormControl('')
  });

  subCat: any;


  constructor(private service: ProductService, private route: ActivatedRoute, private uploadservice: UploadmediaService,
    private router: Router, private ls:LoaderService) {
      this.brandname();
    this.service.pr_category().subscribe(cat_resp => {
      if (cat_resp.status === 200) {
        this.catgorylist = cat_resp.result;
      }
    })
  }

  ngOnInit() {
    this.ls.show();
    this.product_id = this.route.snapshot.paramMap.get('id');
    this.viewproduct_api();
   
  }


  get validation() {
    return this.Edit_product_form.controls;
  }


  onChange(event) {
    this.category_in_array = [];
    this.category_in_array.push(event.target.value);
    this.service.sub_category(event.target.value).subscribe(sub_cat_resp => {
      this.sub_categorylist = sub_cat_resp.result;
      if (this.sub_categorylist.length > 0) {
        this.show_subcategory = true;
      }
      else { this.show_subcategory = false; }
    })
  }


  viewproduct_api() {
    this.service.view_product(this.product_id).subscribe(product_view_response => {
      if (product_view_response.status === 200) {
        this.ls.hide();
        this.product_data_display = product_view_response.result;
        this.date = _moment.utc(product_view_response.result.created).format('DD/MM/YYYY')
        this.editorData = product_view_response.result.description;
        this.media = product_view_response.result.media;
        this.logoUrl=product_view_response.result.logoUrl;

            if(this.product_data_display.subCategoryData.length > 0){
              this.show_subcategory=true;
              this.subCat=this.product_data_display.subCategoryData[0]._id;
              this.service.sub_category(this.product_data_display.categoryData[0]._id).subscribe(sub_cat_resp => {
                this.sub_categorylist = sub_cat_resp.result;
                if (this.sub_categorylist.length > 0) {
                  this.show_subcategory = true;
                }
                else { this.show_subcategory = false; }
              })
            }

        this.Edit_product_form.patchValue({
          pr_name: this.product_data_display.name,
          pr_brand: this.product_data_display.brand, pr_category: this.product_data_display.categoryData[0]._id,
          pr_directiorn: this.product_data_display.directionOfUse,
         sub_category: this.product_data_display.subCategoryData.length > 0 ? this.product_data_display.subCategoryData[0]._id : ''
        })
      }
    })
  }

  //start code for image uploadin on S3
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

        this.ls.show(); //this.loader = true;
      }

      this.uploadservice.uploadfileonAwsS3(file, file.name).subscribe(res => {
        if (res) {
          this.ls.hide(); //
          this.media = res.Location;
        }
      });
    }
  }
  // end code for image uplaoding on S3
  async onSubmit() {

    this.submitted = true;
    if (this.category_in_array.length == 0) {
      this.category_in_array.push(this.product_data_display.categoryData[0]._id);
    }
    if (this.sub_category_in_array.length == 0) {
     this.product_data_display.subCategoryData.length > 0 ? this.sub_category_in_array.push(this.product_data_display.subCategoryData[0]._id) : this.sub_category_in_array = [];

    }

    if (this.Edit_product_form.valid) {
      this.ls.show(); //
      let form_value = this.Edit_product_form.value;
      this.service.edit_procut_api(this.product_id, form_value.pr_name, form_value.pr_brand, form_value.pr_directiorn,
        this.category_in_array, this.sub_category_in_array, this.product_data_display.created, this.editorData, this.media,this.logoUrl).subscribe(edit_resp => {

          if (edit_resp.status === 200) {
            this.ls.hide();
            this.updatemsg = true;
            setTimeout(() => { this.updatemsg = false }, 2500);
            setTimeout(() => { this.router.navigate(['/theme/modules/product-management/manage-products']) }, 2600);
          }
        })
    }
  }

  onClick(event) {
    this.sub_category_in_array = [];
    this.sub_category_in_array.push(event.target.value)
  }

  changelogo(event){
   
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
        this.logoUrl = event.result;

        //this.loader = true;
 }

      this.uploadservice.uploadfileonAwsS3(file, file.name).subscribe(res => {
        if (res) {
        
          this.logoUrl = res.Location;
        }
      });
    }
  }

// ***************************Code of brand name api calling*********************************************//
brandname(){
  this.service.brandname().subscribe(response=>{
    if(response.status==200){
      this.brandnames=response.result.data;
    }
  }
  )
}
//************************End code of Brand api call****************************************************** */

}
