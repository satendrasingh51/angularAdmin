import { Component, OnInit, Directive, EventEmitter, Input, Output, AfterViewInit, ViewChildren } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as _moment from 'moment'
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {LoaderService} from '../../../services/loader.service';

export interface CSV{
address: string,
Joining_Date: string,
email: string,
Profile_Visibility: string,
userName: string,
status:string


}



@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})


export class ManageUsersComponent implements OnInit, AfterViewInit {
  exportdata=[];
  max = new Date();

  collectionSize: number = 0;
  user_list = [];
  limit: number = 10;
  page: number = 1;
  sortOrder = -1;
  sortKey = '';
  searchString: string = '';
  status = 1;
  profileVisibility = 1;
  fromDate: number = 0;
  toDate: number = 0;
  // form
  minDate1;

  user_id: any;
  delte_msg: boolean = false;
  user_block_msg: boolean = false;
  unblock_msg: boolean = false;

  search_userform = new FormGroup({
    profileVisibility: new FormControl('0'),
    status: new FormControl('1'),
    from_time: new FormControl(),
    to_time: new FormControl(),
  });
  maxDate2
  maxDate;


  //

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

  // end 
  constructor(private user_service: UserService,
    private modalService: NgbModal,  private router:Router, private ls:LoaderService) {
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


  openVerticallyCentered(content, _id) {
    this.user_id = _id;

    this.modalService.open(content, { centered: true });
  }

  ngOnInit() {
    this.ls.show()
  }
  ngAfterViewInit() {
    this.api_call();
  }
  changepage(event) {
   
    this.page = event;
    this.api_call();
  }
  api_call() {
    let isNotification=0;

    this.user_service.users_list(this.limit, this.page, this.sortKey, this.sortOrder, this.searchString,
      this.status, this.profileVisibility, this.fromDate, this.toDate,isNotification).subscribe(response => {
        if (response.status === 200) {
          this.ls.hide();

          this.user_list = response.result.data;
          this.collectionSize = response.result.count;

        } else {

        }

      })
  }
  onSubmit() {
    if (this.search_userform.valid) {
        this.ls.show();

      let val = this.search_userform.value;
      this.profileVisibility = val.profileVisibility;
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
  searchstring(value) {
    this.searchString = value;
    this.api_call();
  }

  customdate(event) {
    let date = _moment.utc(event).format('DD/MM/YYYY')
    return date;
  }
  reset() {
    let form = this.search_userform.value;
    if (form.from_time || form.to_time || form.profileVisibility || form.status) {
      this.ls.show();
      this.fromDate = 0;
      this.toDate = 0;
      this.search_userform.reset({ profileVisibility: '0', status: '0' });
      this.status = 1;
      this.profileVisibility = 1;

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
      this.api_call();

    }
  }
  // 
  user_delete() {
    this.ls.show();
    this.user_service.delete_user(this.user_id).subscribe(del_response => {
      if (del_response.status === 200) {
        this.delte_msg = true;
        this.modalService.dismissAll();
        setTimeout(() => { this.delte_msg = false }, 2000);
        this.api_call();
      }
      else { }
    })
  }

  user_block() {
    this.ls.show();
    this.user_service.block_user(this.user_id).subscribe(block_response => {
      if (block_response.status === 200) {
        this.user_block_msg = true;
        setTimeout(() => {
          this.user_block_msg = false
        }, 2000);
        this.api_call();
        this.modalService.dismissAll();
      }
    })
  }
  unblock_user() {
    this.ls.show();
    this.user_service.unblock_user(this.user_id).subscribe(user_unblock_respo => {

      if (user_unblock_respo.status === 200) {
        this.unblock_msg = true;
        setTimeout(() => { this.unblock_msg = false }, 2000);
        this.api_call();
        this.modalService.dismissAll();
      }

    })
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
  limitchange(event) {

    this.limit = event.target.value;
    this.api_call();
  }
  onSort(event) {
    console.log(event)
  }
  loadpage(event) {
    this.ls.show();
    this.page = event;
    this.api_call();
  }

  export_csv() {
    this.user_service.exportuserlist({...{limit:this.limit, page:this.page,fromDate:this.fromDate, toDate:this.toDate}}).subscribe(respon => {
    
      if(respon.status===200){
        this.exportdata=respon.result.data;
        let arrData = new Array<CSV>();
        this.exportdata.map((data)=>{
          const pickeddata=(({address,Joining_Date,email,Profile_Visibility,userName,status})=>({
            userName,address,Joining_Date,email,Profile_Visibility,status
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


  handleChange(event){
      if(event.target.value==='2'){
       
        this.router.navigate(['/theme/modules/user-management/managenbm-users']);
      }else{
        
      }
      }
}
