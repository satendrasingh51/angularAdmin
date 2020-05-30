import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbTimepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ContactService } from '../../../services/contact.service';
import * as _moment from 'moment';

import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';
import {LoaderService} from '../../../services/loader.service';


export interface Csv {
  name: string,
  email: string,
  shortMessage: string,
  message: string,
  userType: string,
  isResolved: number
}


@Component({
  selector: 'app-contact-us-manage',
  templateUrl: './contact-us-manage.component.html',
  styleUrls: ['./contact-us-manage.component.scss'],
  providers: [NgbTimepickerConfig],

})

export class ContactUsManageComponent implements OnInit, AfterViewInit {
  exportdata;
  max = new Date();
  timeOutRef: any = null;

  time: any;
  user_id: string;
  limit: number = 10;
  page: number = 1;
  sortOrder: any = -1;
  sortKey: string = '';
  searchString: string = '';
  delete_msg: boolean = false;
  collectionSize: number = 0;
  resolved_msg: boolean = false;
  contact_list = [];
  fromDate: number = 0;
  toDate: number = 0;

  /************code start of form ************************************************/
  search_contactform = new FormGroup({

    from_date: new FormControl(),
    todate: new FormControl(),
    status: new FormControl("1"),
    user_type: new FormControl("1")
  });
  /* code end of  form =================================================*/
  // code for data format change/=============================**/

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

  /*  code end of date validation===========================*/
  // code for date validation=========================**/
  minDate: any;
  maxDate: any;
  maxDate1: any;

  // end code for date validation**************************//
  constructor(config: NgbTimepickerConfig, private modalService: NgbModal,
    private contactservice: ContactService, private ls:LoaderService) {
    config.spinners = false;

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
  openVerticallyCentered(deletepoup, _id) {
    this.user_id = _id;
     this.modalService.open(deletepoup, { centered: true });
  }


  ngOnInit() {
      this.ls.show();

  }

  ngAfterViewInit() {
    
    this.call_api();
  }

  customdate(value) {
    let date = _moment.utc(value).format('DD/MM/YYYY')
    return date;
  }

  delete_conatct() {
    this.ls.show();
    this.contactservice.delete_contact(this.user_id).subscribe(del_response => {
      if (del_response.status === 200) {
        this.delete_msg = true;
        this.modalService.dismissAll();
        setTimeout(() => { this.delete_msg = false; }, 2000);
        this.call_api();
      }
    })
  }

  pagechange(event) {
    this.ls.show();
    this.page = event;
    this.call_api();
  }

  call_api() {
    this.contactservice.conatct_list(this.limit, this.page, this.sortOrder, this.sortKey, this.searchString,
      this.search_contactform.value.status, this.fromDate, this.toDate, this.search_contactform.value.user_type).subscribe((response) => {
        if (response.status === 200) {
          this.ls.hide();
          this.contact_list = response.result.data;
          this.collectionSize = response.result.globalCount;
         
        }
      })
  }


  timezone(time) {
    let Time = _moment.utc(time).format('HH:mm')
    return Time;
  }


  resolveconatct() {  
    this.ls.show();
    this.contactservice.contact_resolved(this.user_id).subscribe(resolve_resp => {

      if (resolve_resp.status === 200) {
        this.ls.hide();
        this.modalService.dismissAll();
        this.resolved_msg = true;
        setTimeout(() => { this.resolved_msg = false }, 2000);
        this.call_api();
      }
      else {

      }
    })
  }


  filterdata() {

    if (this.search_contactform.valid) {
      if (this.search_contactform.value.from_date || this.search_contactform.value.todate || this.search_contactform.value.status || this.search_contactform.value.user_type) {
        this.ls.show();

        let val = this.search_contactform.value;
        if (val.from_date != null) {
          this.fromDate = _moment([val.from_date.year, val.from_date.month - 1, val.from_date.day]).utc().valueOf();
          this.fromDate = (isNaN(this.fromDate) === true) ? 0 : this.fromDate;
        }
        if (val.todate != null) {
          this.toDate = _moment([val.todate.year, val.todate.month - 1, val.todate.day + 1]).utc().valueOf();
          this.toDate = (isNaN(this.toDate) === true) ? 0 : this.toDate;
        }

        this.call_api();

      }
    }
  }


  serachstring(searchkey) {
      this.searchString = (searchkey.target.value).trim();
      if (this.timeOutRef) {
      clearTimeout(this.timeOutRef)
    }
    this.timeOutRef = setTimeout(() => { this.call_api(); }, 250)
  }


  resetform() {

    if (this.search_contactform.value.from_date || this.search_contactform.value.todate || this.search_contactform.value.status || this.search_contactform.value.user_type) {

      this.ls.show();
      this.fromDate = 0;
      this.searchString = '';
      this.toDate = 0;
    this.search_contactform.reset({ status: "1", user_type: "1" });

      let current = new Date();
      this.maxDate = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      this.call_api();
    }
  }


  fromdate(event) {

    if (typeof (event) != undefined) {

      this.minDate = event;

    }
  }


  to_date(event) {
    if (typeof (event) != undefined) {

      this.maxDate = event;
    }
  }

  
  limitchange(event) {
    this.ls.show();
    this.limit = event.target.value;
    this.call_api();
  }

  export_csv() {
    let value = {
      ...{ limit: this.limit }, ...{ page: this.page }, ...{ sortOrder: this.sortOrder }, ...{ sortKey: this.sortKey },
      ...{ searchString: this.searchString }, ...{ status: this.search_contactform.value.status }, ...{ fromDate: this.fromDate },
      ...{ toDate: this.toDate, }
    }
    this.contactservice.export_conact(value).subscribe(reponse => {

      if (reponse.status === 200) {
        this.exportdata = reponse.result.data;
        let arrData = new Array<Csv>();
        this.exportdata.map((data) => {
          const picked = (({ name, email, shortMessage, message, userType, isResolved }) => ({
            name, email, shortMessage, message, userType, isResolved
          }))(data);
          arrData.push(picked);
        })
        this.downloadFile(arrData);
      }
      else {
        alert("data is not exported please try again");
      }

    })
  }

  // for download csv file 
  downloadFile(data: Csv[]) {
    //console.log(data);
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row =>
      header
        .map(fieldName => JSON.stringify(row[fieldName], replacer)).join(",")
    );
    // console.log(csv);
    csv.unshift(header.join(","));
    let csvArray = csv.join("\r\n");

    var a = document.createElement("a");
    document.body.appendChild(a);
    var blob = new Blob([csvArray], { type: "text/csv" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `ridelist-${this.max.toLocaleString()}.csv`;
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    }, 100);
  }
}






