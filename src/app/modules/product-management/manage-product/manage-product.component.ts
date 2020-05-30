import { Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _moment from 'moment'
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { LoaderService } from '../../../services/loader.service';
import { UploadmediaService } from 'src/app/services/uploadmedia.service';
import { environment as ENV } from '../../../../environments/environment';



export interface Csv {
  brand: string
  category: [],
  created: string,
  name: string,
}


@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})

export class ManageProductComponent implements OnInit {
categorylists=[];

  alertmsg;
  max = new Date();
  delete_msg: boolean = false;
  limit: number = 10;
  page: number = 1;
  sortKey = 'created';
  sortOrder = -1;
  searchString = '';
  
  product_list: any;
  collectionsize: number = 0;
  product_id;
  from_Date: number = 0;
  to_Date: number = 0;
  model: NgbDateStruct;
  minDate1;
  maxDate1;
  maxDate = undefined;

productdisplayonpopup=[];
userData=[];
product_averageRating;
reviewdelete_msg=false;
importcsvfilelink:string;
imoportcsvsuccessmsg=false;
  //Changing Date format
  readonly DT_FORMAT = 'DD/MM/YYYY';
  parse(value: string): NgbDateStruct {
    if (value) {
      value = value.trim();
      let mdt = _moment(value, this.DT_FORMAT)
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    if (!date) return '';
    let mdt = _moment([date.year, date.month - 1, date.day]);
    if (!mdt.isValid()) return '';
    return mdt.format(this.DT_FORMAT);
  }

  // form for search  data
  filter_product_form = new FormGroup({
    from_date: new FormControl(''),
    to_date: new FormControl(''),
    category:new FormControl('')

  });


  constructor(private modalService: NgbModal, private pr_service: ProductService,
    private ls: LoaderService, private uploadservice:UploadmediaService) {
        this.datevalidation();
        this.categoryapi();
  }


  openVerticallyCentered(deletepopup, _id,ratingReview,userData,averageRating) {

    this.product_id = _id;
    this.productdisplayonpopup=ratingReview;
    this.userData=userData;
    this.product_averageRating=averageRating;
    console.log(this.productdisplayonpopup)
    this.modalService.open(deletepopup, { centered: true });

  }

  ngOnInit() {
    this.ls.show();
    this.api_call();

  }

  // data format change
  customdate(event) {
    let date = _moment.utc(event).format('DD/MM/YYYY')
    return date;
  }


  limitchange(event) {
    this.ls.show();
    this.limit = event.target.value;
    this.api_call();
  }


  api_call() {
    this.pr_service.product_list(this.limit, this.page, this.sortOrder, this.sortKey, this.searchString,
      this.filter_product_form.value.category, this.from_Date, this.to_Date).subscribe(response => {
        this.ls.hide();
        this.product_list = response.result.data;
        this.collectionsize = response.result.count;
      })
  }


  loadpage(event) {
    this.ls.show()
    this.page = event;
    this.api_call();
  }


  deleteproduct() {
    this.ls.show()
    this.pr_service.delete_product(this.product_id).subscribe(del_response => {
      if (del_response.status === 200) {
        this.ls.hide();
        this.delete_msg = true;
        this.api_call();
        this.modalService.dismissAll();
        setTimeout(() => { this.delete_msg = false }, 2000);
      }
    })
  }


  searchdata(event) {
    this.searchString = (event.target.value).trim();
    this.api_call();
  }


  //validation for date 
  fromDate(event) {
    if (typeof (event) != undefined) {
      this.minDate1 = event;
    }
  }


  toDate1(dat) {
    if (typeof (dat) != undefined) {
      this.maxDate1 = dat;
    }
  }


  onSubmit() {
    if (this.filter_product_form.value.from_date || this.filter_product_form.value.to_date||this.filter_product_form.value.category) {
      this.ls.show();
      if(this.filter_product_form.value.from_date!=null){
        this.from_Date = _moment([this.filter_product_form.value.from_date.year, this.filter_product_form.value.from_date.month - 1, this.filter_product_form.value.from_date.day]).utc().valueOf();
        this.from_Date = (isNaN(this.from_Date) === true) ? 0 : this.from_Date;
      }
      if(this.filter_product_form.value.to_date!=null){
        this.to_Date = _moment([this.filter_product_form.value.to_date.year, this.filter_product_form.value.to_date.month - 1, this.filter_product_form.value.to_date.day + 1]).utc().valueOf();
        this.to_Date = (isNaN(this.to_Date) === true) ? 0 : this.to_Date;
      }
    
      this.api_call();

    }
  }

  reset() {
    if (this.filter_product_form.value.from_date||this.filter_product_form.value.to_date||this.filter_product_form.value.category) {
      this.ls.show();
      this.from_Date = 0;
      this.to_Date = 0;
      this.searchString = "";
     
      this.filter_product_form.reset();
      this.filter_product_form.patchValue({category:''})
      this.api_call();
      // code for date 
      this.datevalidation();
    }
  }




  exporttocsv() {
    let value = {
      ...{ limit: this.limit }, ...{ page: this.page }, ...{ sortOrder: this.sortOrder }, ...{ sortKey: this.sortKey }, ...{
        searchString: this.searchString
      }, ...{ category:this.filter_product_form.value.category }, ...{ fromDate: this.from_Date }, ...{ toDate: this.to_Date }
    };
    this.pr_service.product_export(value).pipe(
      catchError(error => {
        return error;
      })
    ).subscribe(response => {
      if (response.status === 200) {
        let exp = response.result.data
        let arrData = new Array<Csv>();
        exp.map(res => {
          const picked = (({ brand, category, created, name }) => ({
            brand, category, created, name
          }))(res)
          arrData.push(picked);
        })
        this.downloadFile(arrData);

      }
    })
  }


  downloadFile(data: Csv[]) {
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row =>
      header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(",")
    );
    csv.unshift(header.join(","));
    let csvArray = csv.join("\r\n");

    var a = document.createElement("a");
    document.body.appendChild(a);
    var blob = new Blob([csvArray], { type: "text/csv" }),
    url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `productlist-${this.max.toLocaleString()}.csv`;
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    }, 100);
  }


  /*********************** rating fixed ****************************************** */
  customrating(ratingvalue) {
    let ratingavg = parseFloat(ratingvalue);

    return ratingavg.toFixed(1);
  }
  /*********************End Rating Code ************************************************ */

  /******************* delete review code start here **************************************** */
  deletereview(ratingdata){
    this.ls.show();
    let reviewdetail={...{userId:ratingdata.userId,productId:this.product_id,rating:ratingdata.rating,review:ratingdata.review}}

    this.pr_service.deleteReviewRating(reviewdetail).subscribe(response=>{
      if(response.status==200){
        this.ls.hide();
        this.api_call();
        this.modalService.dismissAll();
        this.reviewdelete_msg=true;
        setTimeout(() => {this.reviewdelete_msg=false}, 2000);
      }
    })
  }

  /*********************Delete review code end ***************************************************** */

  /****************************Import Csv code ***************************************************** */
  importcsv(event){
  
    if (event.target.files && event.target.files[0]) {
      var mimeType = event.target.files[0].type;
      var file = event.target.files[0];
      if (mimeType.match(/csv\/*/) == null) {
        // this.alertmsg = "Only CSV are supported.";
        alert("Only CSV are supported.")
        return;
      }
      else{
        this.ls.show(); 
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event: any) => { // called once readAsDataURL is completed
            event.result;
         //this.loader = true;
        }
        this.uploadservice.uploadfileonAwsS3(file, file.name).subscribe(res => {
          if (res) {
           
           this.importcsvfilelink=res.Location;
           setTimeout(() => {this.cavapicall()}, 100);
          }
        });
      }
     
    }
  }
  // calling api for send link =============================================================//
  cavapicall(){
    this.pr_service.importcsv(this.importcsvfilelink).subscribe(response=>{
      console.log(response);
      if(response.status==200){
        this.api_call();
        this.imoportcsvsuccessmsg=true;
        setTimeout(() => {this.imoportcsvsuccessmsg=false}, 2000);
      }
    })
  }
  /**************************End Import Csv  Code **************************************************** */


  datevalidation(){

    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.maxDate1 = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }


  categoryapi(){
    this.pr_service.pr_category().pipe().subscribe(response=>{
      console.log(response)
    this.categorylists=response.result;
    })
  }

  downloadcsvformat(){
    window.open(`${ENV.API_URL}/admin/getImportFormat`);
  }
}
