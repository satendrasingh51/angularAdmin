import { Component, OnInit,AfterViewInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {ProductService} from '../../../services/product.service';

import * as _moment from 'moment';
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl } from '@angular/forms';
import {LoaderService} from '../../../services/loader.service';


@Component({
  selector: 'app-view-subscription',
  templateUrl: './view-subscription.component.html',
  styleUrls: ['./view-subscription.component.scss']
})

export class ViewSubscriptionComponent implements OnInit,AfterViewInit {
  limit=10;
  page=1;
  searchString:string;
  sortKey='created';
  sortOrder=-1;
  subscriptionStartFromDate=0;
  subscriptionStartToDate=0;
  subscriptionEndFromDate=0;
  subscriptionEndToDate=0;
  collectionSize:number=0;

values;
subscription_id
subscriberdata:any;

subscriberlist=[];
//************code for data validation****************************************** ******************************/
minDate: any;
maxDate: any;
maxDate1: any;

minDate1: any;
maxDate2: any;
maxDate3: any;

/** code end of date validation************************************************************************************** */
  constructor( private route:ActivatedRoute,private service:ProductService , private ls:LoaderService) {
    this.subscription_id = this.route.snapshot.paramMap.get('id');

    //  code for date validtion**********************************************************************************/
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.maxDate2=this.maxDate;

    this.maxDate1 = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
   
    //************************************************************end date validation code **************************** */
   }

   listserachform = new FormGroup({
    startfromdate: new FormControl(),
    starttodate: new FormControl(),
    endfromdate: new FormControl(),
    endtodate: new FormControl(),

  });

  ngOnInit() {
     this.ls.show();
  }
  ngAfterViewInit(){
   
    this.subscriberdetailapi();
    this.datasendinapi();
    this.listsubscribers();
  }
  /***************data which is send in api************************************************* */
  datasendinapi(){
    this.values={...{subscriptionId:this.subscription_id,limit:this.limit,page:this.page,searchString:this.searchString,
      sortKey:this.sortKey,sortOrder:this.sortOrder,subscriptionStartFromDate:this.subscriptionStartFromDate,subscriptionStartToDate:this.subscriptionStartToDate,
      subscriptionEndFromDate:this.subscriptionEndFromDate,subscriptionEndToDate:this.subscriptionEndToDate}};
  }

  /******************************* end code ************************************************ */

subscriberdetailapi(){
  this.service.subscriptiondetail(this.subscription_id).subscribe(response=>{  
    if(response.status==200){
        this.ls.hide();
      this.subscriberdata=response.result;
    }
  })
}




/** code for filter data present in lists********************************************************************** */
onSubmit(){


let val =this.listserachform.value;
if(val){
  this.ls.show()
  if (val.startfromdate != null) {
    this.subscriptionStartFromDate = _moment([val.startfromdate.year, val.startfromdate.month - 1, val.startfromdate.day]).utc().valueOf();
    this.subscriptionStartFromDate = (isNaN(this.subscriptionStartFromDate) === true) ? 0 : this.subscriptionStartFromDate;
  }
  if (val.starttodate != null) {
    this.subscriptionStartToDate = _moment([val.starttodate.year, val.starttodate.month - 1, val.starttodate.day]).utc().valueOf();
    this.subscriptionStartToDate = (isNaN(  this.subscriptionStartToDate) === true) ? 0 :  this.subscriptionStartToDate;

  }

  if (val.endfromdate != null) {
    this.subscriptionEndFromDate = _moment([val.endfromdate.year, val.endfromdate.month - 1, val.endfromdate.day]).utc().valueOf();
    this.subscriptionEndFromDate  = (isNaN(  this.subscriptionEndFromDate ) === true) ? 0 :   this.subscriptionEndFromDate ;

  }

  if (val.endtodate != null) {
    this.subscriptionEndToDate = _moment([val.endtodate.year, val.endtodate.month - 1, val.endtodate.day]).utc().valueOf();
    this.subscriptionEndToDate  = (isNaN( this.subscriptionEndToDate ) === true) ? 0 :  this.subscriptionEndToDate ;

  }
  this.datasendinapi();
  this.listsubscribers();
}
 
}


/*************** list api called************************************************************************ */
listsubscribers(){
  this.service.subscriptionuser(this.values).subscribe(response=>{
  
    if(response.status==200){
      this.ls.hide();
      this.subscriberlist=response.result.data;
      this.collectionSize=response.result.count;
    }
  })
  
  }
  
/** ********************* end code of list api called****************************************************** */

/** ************************End code of filter data ************************************************************** */


  customdate(value) {
    let date = _moment.utc(value).format('DD/MM/YYYY')
    return date;
  
}

// code for data format change/************************************* */=============================**/

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
/*****************************end code of date format change********************************************** */




// methods for date validations/////////////////////////////////////////////
startfrom_date(event){
  if (typeof (event) != undefined) {

    this.minDate = event;

  }
}
startto_date(event){
  if (typeof (event) != undefined) {

    this.maxDate = event;
  }
}


endfrom_date(event){
  if (typeof (event) != undefined) {

    this.minDate1 = event;

  }
}
endto_date(event){
 
  if (typeof (event) != undefined) {

    this. maxDate3 = event;
  }
}

/**********************************reset filter ************************************************************ */
reset(){

  if(this.listserachform.value){
   this.ls.show()
    this.subscriptionStartFromDate=0;
    this.subscriptionStartToDate=0;
    this.subscriptionEndFromDate=0;
    this.subscriptionEndToDate=0;
    this.datasendinapi();
    this.listsubscribers();
    this.listserachform.reset();
  }
 
}

/************************************end code of reset filter************************************************ */

/***** below code for pagination*****  ************************************************************************/
pagechange(event){
  this.ls.show()
  this.page = event;
  this.datasendinapi();
  this.listsubscribers();
}
/************** end of pagination code********************************************************************** */


serachstring(event){
this.searchString=event.target.value;
this.datasendinapi();
this.listsubscribers();
}

}
