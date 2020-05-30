import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit,AfterViewInit} from '@angular/core';
import {NewletterService} from '../../../services/newletter.service';
import {LoaderService} from '../../../services/loader.service';
import {Router, ActivatedRoute} from '@angular/router';
import { FormControl,FormGroup ,Validators} from '@angular/forms';
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {UploadmediaService} from '../../../services/uploadmedia.service';


@Component({
  selector: 'app-edit-advertisement',
  templateUrl: './edit-advertisement.component.html',
  styleUrls: ['./edit-advertisement.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: EditAdvertisementComponent}]
})

export class EditAdvertisementComponent implements OnInit ,AfterViewInit {

imagevalidationmsg: boolean = false;
minDate;
maxDate;
currentdate;

  Submitted=false;

advertisementid;
editorData: any = "";
message;
imageurl;
file;
updatesuceessmsg=false;
startdate;
enddate;
st_date;
ed_date;

  editadvertisementform= new FormGroup({
    brand:new FormControl('',[Validators.required,Validators.maxLength(40)]),
    description:new FormControl('',Validators.required),
    endDate:new FormControl(''),
    urlLink:new FormControl('',[Validators.required,Validators.pattern('https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}')]),
    title:new FormControl('',[Validators.required,Validators.maxLength(40)]),
    startDate:new FormControl(''),
    imageUrl:new  FormControl('')
  })

  constructor(private modalService: NgbModal , private service:NewletterService, private ls:LoaderService,
    private route:ActivatedRoute , private uploadservice:UploadmediaService, private router:Router) {}


  openVerticallyCentered(deletepopup) {
    this.modalService.open(deletepopup, { centered: true });
 }

  ngOnInit() {
    this.ls.show();
    this.datevalidation();
    this.advertisementid = this.route.snapshot.paramMap.get('id');
  }

ngAfterViewInit():void{
  this.service.viewadvertisement(this.advertisementid).subscribe(response=>{
    this.ls.hide();
    this.imageurl=response.result.imageUrl;
    
    let date = moment(response.result.startDate);

    this.startdate={day: date.get('date'), month: (date.get('month')+1).valueOf(), year: date.get('year')};
  
    let datee = moment(response.result.endDate);
    this.enddate = { day: datee.get('date'), month:(datee.get('month')+1).valueOf(),year:datee.get('year')};
      // console.log(this.enddate)
        
    this.editadvertisementform.patchValue({startDate:this.startdate ,endDate: this.enddate,
            brand:response.result.brand,title:response.result.title, urlLink:response.result.urlLink,
            description:response.result.description, imageUrl:response.result.imageUrl})
  })
}


formdatasave(){
  this.Submitted=true;
  // console.log(this.editadvertisementform.value.endDate,this.editadvertisementform.value.startDate)

  if(this.imageurl === undefined || null){
    this.imagevalidationmsg = true;
  } 
    else if(this.imageurl){
      this.imagevalidationmsg = false;
          if(this.editadvertisementform.valid){
            this.updateapi();
          }
    } 
    
}


/*****************************************************below code is use from date format change ******************** */
readonly DT_FORMAT = 'DD/MM/YYYY';
format(date: NgbDateStruct): string {
 if (!date) return '';
 let mdt = moment([date.year, date.month - 1, date.day]);
 if (!mdt.isValid()) return '';
 return mdt.format(this.DT_FORMAT);
}
//// End code of date format change ******************************************************/


/******************************below code is used for upload media ********************* **********/
selectfile(event) {
  if (event.target.files && event.target.files[0]) {
    var mimeType = event.target.files[0].type;
    this.file = event.target.files[0];
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
         return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event: any) => { // called once readAsDataURL is completed
      // this.imageurl = event.result;
      this.imageurl=event.target.result;
      
      this.ls.show();//this.loader = true;
      this.uploadservice.uploadfileonAwsS3(this.file,this.file .name).subscribe(res => {
        if (res) { 
          this.ls.hide();
          this.imageurl = res.Location;
          this.imagevalidationmsg = false;
        }
      }); 
    } 
  }
}

/***************************End code of upload media ******************************************* */


/***********************update api called ******************************************************** */
updateapi(){
  let formvalue=this.editadvertisementform.value;
  
  if (formvalue.startDate != null) {
   this.st_date = moment([formvalue.startDate.year,formvalue.startDate.month-1,formvalue.startDate.day]).startOf('day').utc().valueOf();
   this.st_date= (isNaN(this.st_date) === true) ? 0 :  this.st_date;
  }
  if (formvalue.endDate != null) {
    this.ed_date = moment([formvalue.endDate.year, formvalue.endDate.month-1 , formvalue.endDate.day]).endOf('day').utc().valueOf();
    this.ed_date= (isNaN(this.ed_date) === true) ? 0 : this.ed_date;
   }
  
  // alert(this.ed_date)
  let data ={...{adId:this.advertisementid,imageUrl:this.imageurl},...{brand:formvalue.brand,title:formvalue.title}
            ,...{urlLink:formvalue.urlLink},...{startDate: this.st_date},...{endDate:this.ed_date},
            ...{description:formvalue.description}}
 
    this.ls.show()
  this.service.editadvertisement(data).subscribe(response=>{
    if(response.status==200){
      
      this.updatesuceessmsg=true;
      setTimeout(() => {
        this.updatesuceessmsg=false,
        this.router.navigate(['/theme/modules/brand-advertisement/manage-advertisement']);
      }, 2500);
    }else{
      this.ls.hide();
      alert("Please try after some time.")
    }
  })
}

get f(){
  return this.editadvertisementform.controls;
}
/**********************End code of update api called *********************************************************** */

redirectback(){
  this.router.navigate(['/theme/modules/brand-advertisement/manage-advertisement']);
}


/*********************************Validation on date ***************************************************** */
startdatevalidation(event){
if(event){
  this.maxDate=event;
}
}

enddatevalidation(event){
  if(event){
    this.minDate=event;
  }
}

datevalidation(){
  const current = new Date();
    this.currentdate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  
}
/******************************End code of date validation *********************************************** */

}
