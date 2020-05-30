import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit,AfterViewInit } from '@angular/core';
import {NewletterService} from '../../../services/newletter.service';
import {LoaderService} from '../../../services/loader.service';
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-manage-advertisement',
  templateUrl: './manage-advertisement.component.html',
  styleUrls: ['./manage-advertisement.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: ManageAdvertisementComponent}]

})

export class ManageAdvertisementComponent implements OnInit, AfterViewInit  {

deletemsg=false;
maxDate;
maxDate1;
minDate1;
minDate;

searchform = new FormGroup({
  fromstratdate: new FormControl(''),
  fromenddate: new FormControl(''),
  toenddate:new FormControl(''),
  tostratdate:new FormControl(''),
  status:new FormControl('0')
});


  // code for data format change/=============================**/
   readonly DT_FORMAT = 'DD/MM/YYYY';
   format(date: NgbDateStruct): string {
    if (!date) return '';
    let mdt = moment([date.year, date.month - 1, date.day]);
    if (!mdt.isValid()) return '';
    return mdt.format(this.DT_FORMAT);
  }

  timeOutRef:any=null;

limit:number=10;
page:number=1;
searchString:string='';
startFromDate:number=0;
startToDate:number=0;
endFromDate:number=0;
endToDate:number=0;
responsedata=[];
collectionSize:number=0;
advertisementid;

  constructor( private service:NewletterService, private ls:LoaderService,private modalService: NgbModal) {
    this.datevalidation();
  }
   
  openpopup(content , advertisementid){
    this.advertisementid=advertisementid
    this.modalService.open(content,{centered:true})
  }

  ngOnInit() {
    this.ls.show();
  }

  ngAfterViewInit(){
    this.calllistapi();
}

calllistapi(){
  let payroll={...{limit:this.limit,page:this.page,sortOrder:-1,sortKey:'updated',searchString:this.searchString,
           startFromDate:this.startFromDate,startToDate:this.startToDate,endFromDate:this.endFromDate,
           endToDate:this.endToDate,status:this.searchform.value.status}}

    this.service.advertismentlists(payroll).pipe().subscribe(response=>{
        if(response.status==200){
              this.ls.hide();
              this.responsedata=response.result.data;
              this.collectionSize=response.result.globalCount;
            
          }else{
            alert("Please after Some time")
          }
      })
}

pagechange(event){
  this.ls.show();
this.page=event;
this.calllistapi();
}

limitchange(event){
 
this.limit=event.target.value;
this.calllistapi();
}

serachstring(event){
  this.searchString = (event.target.value).trim();
  if (this.timeOutRef) {
  clearTimeout(this.timeOutRef)
  }
  this.timeOutRef = setTimeout(() => { this.calllistapi(); }, 250)
}


customdate(value){
  return moment(value).format('DD/MM/YYYY');
  }

  deletereq(){
    this.ls.show();
this.service.actionadverisement(this.advertisementid,3).pipe(
  catchError(error=>{
    return error;
  },
  )
).subscribe(response=>{
  if(response.status==200){
    this.ls.hide();
      this.modalService.dismissAll();
    this.calllistapi();
    this.deletemsg=true;
    setTimeout(() => {
      this.deletemsg=false;
    }, 2500);
  }
})

}
fromstartDate(event){
  if(event){
    this.minDate=event;
  }
}
fromendDate(event){
  if(event){
    this.maxDate=event;
  }
}


tostartDate(event){
  if(event){
    this.minDate1=event;
  }
}


toendDate(event){
  if(event){
    this.maxDate1=event;
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

filter(){
  
let f=this.searchform.value;
if(f.fromstratdate||f.fromenddate||f.toenddate||f.tostratdate || f.status){
  this.ls.show();
  if (f.fromstratdate!= null) {
    this.startFromDate = moment([f.fromstratdate.year, f.fromstratdate.month - 1, f.fromstratdate.day]).utc().valueOf();
    this.startFromDate = (isNaN( this.startFromDate) === true) ? 0 :  this.startFromDate;
  }
  if (f.fromenddate!= null) {
    this.startToDate = moment([f.fromenddate.year, f.fromenddate.month - 1, f.fromenddate.day]).utc().valueOf();
    this.startToDate  = (isNaN(  this.startToDate ) === true) ? 0 :this.startToDate ;
  }
  if (f.tostratdate!= null) {
    this.endFromDate = moment([f.tostratdate.year, f.tostratdate.month - 1, f.tostratdate.day]).utc().valueOf();
    this.endFromDate  = (isNaN(  this.endFromDate ) === true) ? 0 :this.endFromDate ;
  }
  if (f.toenddate!= null) {
    this.endToDate = moment([f.toenddate.year, f.toenddate.month - 1, f.toenddate.day]).utc().valueOf();
    this.endToDate  = (isNaN(  this.endToDate ) === true) ? 0 :this.endToDate ;
  }

  this.calllistapi();
}

}

resetfilter(){
  let f=this.searchform.value;
  if(f.fromstratdate||f.fromenddate||f.toenddate||f.tostratdate|| this.searchString|| f.status){
    this.ls.show()
    this.startFromDate =0;
    this.startToDate=0;
    this.endFromDate=0;
    this.endToDate=0;
    this.searchform.reset();
    this.searchform.patchValue({status:0})
    this.calllistapi();
    this.datevalidation();
  }
}


}
