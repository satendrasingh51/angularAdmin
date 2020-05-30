import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _moment from 'moment';
import { UserService } from 'src/app/services/user.service';
import {LoaderService} from '../../../services/loader.service';
import * as moment from 'moment';


export interface CSV{
  brand: string
  Joining_Date: string
email: string
isVerified: string
name: string
status: string
}

@Component({
  selector: 'app-manage-nbmusers',
  templateUrl: './manage-nbmusers.component.html',
  styleUrls: ['./manage-nbmusers.component.scss']
})
export class ManageNbmusersComponent implements OnInit, AfterViewInit {
  exportdata;
  max=new Date();
  page: number = 1;
  limit: number = 10;
  sortOrder = -1;
  searchString: string;
  status: number = 1;
  fromDate: number;
  toDate: number;
  // profileVisibility=1;

  responsedata = [];
  collectionSize: number = 0;
  r_btn_selected = true;
  managerId: string;
  delte_msg: boolean = false;
  manager_block_msg: boolean = false;
  unblock_msg: boolean = false;

  maxDate2
  maxDate;
  minDate1;

  constructor(private userService: UserService, private router: Router, private modalService: NgbModal,
    private ls:LoaderService) {

    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.maxDate2 = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
   }

  search_userform = new FormGroup({
    profileVisibility: new FormControl('0'),
    status: new FormControl('1'),
    from_time: new FormControl(),
    to_time: new FormControl(),
  });


  openVerticallyCentered(content, _id) {
    this.managerId = _id;

    this.modalService.open(content, { centered: true });
  }



  ngOnInit() {
    
    this.ls.show();
    this.r_btn_selected = true;
  }

  ngAfterViewInit() {
    this.api_call()

  }

  searchstring(event) {
    this.searchString = event;
    this.api_call();
  }
  handleChange(event) {
    if (event.target.value === '1') {
      this.router.navigate(['/theme/modules/user-management/manage-users']);
    } else {

    }
  }

  filterdata() {
    if (this.search_userform.valid) {
      this.ls.show();
      let val = this.search_userform.value;
      // this.profileVisibility = val.profileVisibility;
      this.status = val.status;

      if (this.search_userform.value.from_time != null) {
        this.fromDate = _moment([val.from_time.year, val.from_time.month - 1, val.from_time.day]).utc().valueOf();
        this.fromDate = (isNaN(this.fromDate) === true) ? 0 : this.fromDate;
      }
      if (this.search_userform.value.to_time != null) {
        this.toDate = _moment([val.to_time.year, val.to_time.month - 1, val.to_time.day + 1]).utc().valueOf();
        this.toDate = (isNaN(this.toDate) === true) ? 0 : this.toDate;
      }

      this.api_call();
    }
  }
  reset() {
    let value = this.search_userform.value;
    if (value.from_time || value.to_time || value.status) {
      this.ls.show();
      this.fromDate = 0;
      this.toDate = 0;
      this.search_userform.reset({ status: '1' });
      this.status = 1;
      this.api_call();
    }
  }

 
  //validation for date 
  fromdate(event) {
    if (typeof (event) != undefined) {
      this.minDate1 = event;
    }
  }
  todate(dat) {
    if (typeof (dat) != undefined) {
      this.maxDate2 = dat;
    }
  }

  loadpage(event) {
    this.ls.show();
    this.page = event;
    this.api_call()
  }
  limitchange(event) {
    this.limit = event.target.value;
    this.api_call();
  }

  api_call() {
  

    let value = {
      ...{
        page: this.page, limit: this.limit, sortOrder: this.sortOrder, status: this.status, fromDate: this.fromDate
        , toDate: this.toDate, searchString: this.searchString,isNotification:0
      }
    }
    this.userService.managerlist(value).subscribe(response => {

      if (response.status == 200) {
        this.ls.hide();
        this.responsedata = response.result.data
        this.collectionSize = response.result.globalCount
      } else { alert("please try after some time.") }

    })
  }
  
  managerdelete() {
    this.ls.show();
    this.userService.delete_manager(this.managerId).subscribe(response => {
      console.log(response, "ddddddddddddddddddddddddddddddddddddd")
      if (response.status === 200) {
        this.delte_msg = true;
        this.modalService.dismissAll()
        this.api_call();
        setTimeout(() => { this.delte_msg = false }, 800);
      }
    })
  }

  managerBlock() {
    this.ls.show();
    this.userService.blockManager(this.managerId).subscribe(response => {
      if (response.status == 200) {
        this.modalService.dismissAll()
        this.api_call();
        this.manager_block_msg = true;
        setTimeout(() => { this.manager_block_msg = false }, 800);
      }
    })
  }

  unblockmanagaer() {
    this.ls.show();
    this.userService.unblockmanager(this.managerId).subscribe(response => {
      if (response.status == 200) {
        this.modalService.dismissAll()
        this.api_call();
        this.unblock_msg = true;
        setTimeout(() => { this.unblock_msg = false }, 800);
      }
    })
  }
  export_csv(){
    let value = {...{
        page: this.page, limit: this.limit, sortOrder: this.sortOrder, status: this.status, fromDate: this.fromDate
        , toDate: this.toDate, searchString: this.searchString
      }}
      this.userService.managerlistexport(value).subscribe(response=>{
        if(response.status===200){
          this.exportdata=response.result.data;
          let arrData = new Array<CSV>();
          this.exportdata.map((data)=>{
            const pickeddata=(({ email,brand,Joining_Date,isVerified,name,status})=>({
              email,brand,Joining_Date,isVerified,name,status
            }))(data);
            arrData.push(pickeddata)
          })
          this.downloadFile(arrData)
        }
        else {
          alert("data is not exported please try again");
        }
      })
  
}
  downloadFile(data:CSV[]){
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


  customdate(value){
    return moment(value).utc().format("DD/MM/YYYY")
  }
}
  
