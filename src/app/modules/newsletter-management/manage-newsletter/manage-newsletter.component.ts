import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit,AfterViewInit } from '@angular/core';
import {LoaderService} from '../../../services/loader.service';
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as _moment from 'moment';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NewletterService} from '../../../services/newletter.service';
import { FormGroup, FormControl } from '@angular/forms';
import {Router} from '@angular/router';
import {Subscriberexport} from '../../../models/exportnewsleeter/subscriberexport'
import {Newsletterexport} from '../../../models/exportnewsleeter/newsletterexport';

@Component({
  selector: 'app-manage-newsletter',
  templateUrl: './manage-newsletter.component.html',
  styleUrls: ['./manage-newsletter.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: ManageNewsletterComponent}]
})


export class ManageNewsletterComponent implements OnInit , AfterViewInit {
  max=new Date();

  subscriberform = new FormGroup({
    subfromdate: new FormControl(''),
    subtodate: new FormControl(''),
  });

  newsletterfilterform= new FormGroup({
    newsletter_fromdate:new FormControl(''),
    newsletter_todate:new FormControl('')
  })

/*****************Varibales for subcriber api ************************************************ */
timeOutRef: any = null;
page: number=1;
limit:number=10;
searchString1:string;
status=1;
fromDate:number=0;
toDate:number=0;

collectionSize1=0;
subscriberlists=[];
subscriberid:string;
subscriberdeletemsg=false;
maxDate;
minDate1;
/******************************End code of Subscriberlist api ******************************************* */
newsletterdata=[];
collectionsize2=0;
/******************************Code of newsletter api ************************************************** */

page1: number=1;
limit1:number=10;
searchString2:string;
status1=1;
fromDate1:number=0;
toDate1:number=0;
collectionSize2=0;
newsletterdeletedmsg=false;
minDate2;
maxDate1;
/*******************************End code of newsletter api ******************************************** */
  

constructor(private modalService: NgbModal, private loadersvice:LoaderService,
   private NewletterService:NewletterService , private router:Router) {
    this.datevalidation();
   }


  // code for data format change/=============================**/

  readonly DT_FORMAT = 'DD/MM/YYYY';
   format(date: NgbDateStruct): string {
    if (!date) return '';
    let mdt = _moment([date.year, date.month - 1, date.day]);
    if (!mdt.isValid()) return '';
    return mdt.format(this.DT_FORMAT);
  }

  /*  code end of date validation===========================*/
  openVerticallyCentered(deletepopup, subscriberid) {
    this.subscriberid=subscriberid;
    this.modalService.open(deletepopup, { centered: true });
  }
  
  

  ngOnInit() {
    this.loadersvice.show();
    setTimeout(() => { this.loadersvice.hide() }, 700);
 
  }
 
  ngAfterViewInit(){
      this.callsubscriberapi();
  }


  callsubscriberapi(){
    let data={...{limit:this.limit,page:this.page,sortOrder:-1,sortKey:'updated',searchString:this.searchString1,
    status:this.status,fromDate:this.fromDate,toDate:this.toDate}};

    this.NewletterService.subscriberlist(data).subscribe(response=>{
      if(response.status==200){
        this.loadersvice.hide();
        this.subscriberlists=response.result.data;
        this.collectionSize1=response.result.globalCount;
      }else{
        alert("Please try after sometime")
      }
    })
  }

  subscriberpagechange(event){
    this.page=event
    this.loadersvice.show()
    this.callsubscriberapi();
  }


/********************************search subscriber****************************************************** **********/
serachstring(searchkey) {
    this.searchString1 = (searchkey.target.value).trim();
    if (this.timeOutRef) {
    clearTimeout(this.timeOutRef)
    }
    this.timeOutRef = setTimeout(() => { this.callsubscriberapi(); }, 250)
  }
  /*********************************End code of search subscriber ************************************************** */

onChangeTab(event){
  if(event==1){
    this.loadersvice.show();
    this.searchString1=''
    this.callsubscriberapi();
  }
  else{
      this.loadersvice.show();
    this.searchString2=''
      this.callnewsletterapi();
  }
}

/****************************************************News letter api call ********************************************/
callnewsletterapi(){
  let data={...{limit:this.limit1,page:this.page1,sortOrder:-1,sortKey:'created',searchString:this.searchString2,
             status:1,fromDate:this.fromDate1,toDate:this.toDate1}}

  this.NewletterService.newsletterlistapi(data).subscribe(response=>{
    if(response.status==200){
      this.loadersvice.hide();
        this.newsletterdata=response.result.data;
        this.collectionsize2=response.result.globalCount;
      
    }else{
      alert("Please try after some time.")
    }
  })
}
/*****************************End code of News letter api ********************************************************** */

/********************* delete subscriber method********************************************************* */
deletesubscriber(){
  this.loadersvice.show();
  this.NewletterService.deletesubscriber(this.subscriberid).subscribe(
    response=>{
     if(response.status==200){
        this.loadersvice.hide();
        this.modalService.dismissAll();
        this.subscriberdeletemsg=true;
        this.callsubscriberapi();
        setTimeout(() => {this.subscriberdeletemsg=false}, 2000);
     }
    }
  )
}
/********************************************************************************************************** */

newsletterpagechange(event){
  this.loadersvice.show()
  this.page1=event;
  this.callnewsletterapi();
}

customdate(value){
return _moment().utc(value).format('DD/MM/YYYY');
}

/************************************************************************************************* */
deletenewsletter(){
  this.loadersvice.show();
  this.NewletterService.deletesubscriber(this.subscriberid).subscribe(
    response=>{
     if(response.status==200){
       this.callnewsletterapi();
        this.loadersvice.hide();
        this.modalService.dismissAll();
        this.newsletterdeletedmsg=true;
        setTimeout(() => {this.newsletterdeletedmsg=false}, 2000);
     }
    }
  )
}

searchnewsletter(searchkey) {
  this.searchString2 = (searchkey.target.value).trim();
  if (this.timeOutRef) {
  clearTimeout(this.timeOutRef)
  }
  this.timeOutRef = setTimeout(() => { this.callnewsletterapi(); }, 250)
}

subscription_fromdate(event){

if(event){
  this.minDate1=event;
}
}

subscription_todate(event){
 
  if(event){
    this.maxDate=event
  }

}
/***************search subcriber with date *********************** */
searchsubscriber(){
let v=this.subscriberform.value
      if(v.subfromdate||v.subtodate){
        this.loadersvice.show();
        if (v.subfromdate != null) {
          this.fromDate = _moment([v.subfromdate.year, v.subfromdate.month - 1, v.subfromdate.day]).utc().valueOf();
          this.fromDate = (isNaN(this.fromDate) === true) ? 0 : this.fromDate;
        }
        if (v.subtodate != null) {
          this.toDate = _moment([v.subtodate.year, v.subtodate.month - 1, v.subtodate.day]).utc().valueOf();
          this.toDate = (isNaN(this.toDate) === true) ? 0 : this.toDate;
        }
        this.callsubscriberapi();
      }
}

resetsubscriberform(){
  if(this.searchString1||this.subscriberform.value.subfromdate||this.subscriberform.value.subtodate){
      this.loadersvice.show();
      this.fromDate=0;
      this.toDate=0;
      this.subscriberform.reset();
      this.callsubscriberapi();
  }
}
/**********end code of search subscriber with date ********************* */

filternewsletter(){
  if(this.newsletterfilterform.value){
    let f=this.newsletterfilterform.value;
    if(f.newsletter_fromdate||f.newsletter_todate){
      this.loadersvice.show()
      if (f.newsletter_fromdate != null) {
        this.fromDate1 = _moment([f.newsletter_fromdate.year, f.newsletter_fromdate.month - 1, f.newsletter_fromdate.day]).utc().valueOf();
       
        this.fromDate1= (isNaN(this.fromDate1) === true) ? 0 : this.fromDate1;
      }
      if (f.newsletter_todate != null) {
        this.toDate1 = _moment([f.newsletter_todate.year, f.newsletter_todate.month - 1, f.newsletter_todate.day]).utc().valueOf();
        this.toDate1 = (isNaN(this.toDate1) === true) ? 0 : this.toDate1;
      } 
      this.callnewsletterapi();
    }
 
  }
}

letter_fromdate(event){
  if(event){
    this.minDate2=event;
  }
}
letter_todate(event){
  if(event){
    this.maxDate1=event
  }
}

resetnewsletterform(){
  if(this.searchString2||this.newsletterfilterform.value.newsletter_fromdate||this.newsletterfilterform.value.newsletter_todate){
    this.loadersvice.show();
      this.fromDate1=0;
      this.toDate1=0;
      this.newsletterfilterform.reset();
      this.callnewsletterapi();
      this.datevalidation();
  }
}



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

/*********************dropdown code for pagination ************************************ */
limitchange1(event){
  this.limit=event.target.value;
  
    this.loadersvice.show()
    this.callsubscriberapi();
  

}


limitchange2(event){
    this.loadersvice.show()
    this.limit1=event.target.value;
    this.callnewsletterapi()
}
/***********************end *********************************************************** */

newsletterimage(userid){
    this.router.navigate(['/theme/modules/newsletter-management/uploaded-images',userid]);
}

/*****************************************Export CSV of subscribers ****************************************** */
exportsubscribers(){
  let data={...{sortOrder:-1,sortKey:'updated'}};

  this.NewletterService.subscriberlist(data).subscribe(response=>{
    if(response.status==200){
      
      // console.log(response)
      let exp = response.result.data;
       exp.forEach(element => {
          element.Startdate=element.created;
        });

      let arrData = new Array<Subscriberexport>();
      exp.map(res=>{
        const picked=(({ email,Startdate })=>({email,Startdate }))(res)
        arrData.push(picked);
      })
      // console.log(arrData)
      this.downloadFile(arrData);
    }
    
  }) 
 
}



downloadFile(data: Subscriberexport[]) {
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
  a.download = `Subscriberlists-${this.max.toLocaleString()}.csv`;
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  }, 100);
}

/*****************************************End code of export csv *********************************************** */

/*******************************??????code newsletter exportcsv ???????/***************************************** */
newsletterexport(){
  let data={...{sortOrder:-1,sortKey:'created',
  status:1,fromDate:this.fromDate1,toDate:this.toDate1}}

        this.NewletterService.newsletterlistapi(data).subscribe(response=>{
        if(response.status==200){   
          let exp = response.result.data;

            exp.forEach(element => {
              element.Startdate=_moment().utc(element.created).format('DD/MM/YYYY');
            });
          let arrData = new Array<Newsletterexport>();
          exp.map(res=>{
            const csvdata=(({ email, Startdate,images})=>({email,Startdate,images }))(res)
            arrData.push(csvdata);
          })
          console.log(arrData);
          this.downloadexport(arrData)
        }
      })
}


downloadexport(data: Newsletterexport[]) {
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
  a.download = `Newslettersheet-${this.max.toLocaleString()}.csv`;
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  }, 100);
}

/******************************???????End code of newsletter export ??????????*********************************** */
}

