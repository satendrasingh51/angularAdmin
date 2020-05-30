import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import * as _moment from 'moment'
import {  NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { DashboardService } from 'src/app/services/dashboard.service';
import {LoaderService} from '../../../services/loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  dashboard_data :any;
  model;
  adddate: any = '';
  addtodate: any = '';
  minDate1;
  maxDate1;
  maxDate;

  dashbaordForm = new FormGroup({
    from_date: new FormControl(''),
    to_date: new FormControl(''),
  });

/****************************  code for change date format*************************/
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
    to_date: new FormControl('')

  });

/****************************************code end **************************** */

  constructor(private router: Router, private service: DashboardService, private ls:LoaderService) {

    if (sessionStorage.getItem('accessToken') === null || undefined) {
      this.router.navigate(['/auth']);
    }
    /* code for caurrent date validation */
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
    /* end code of current date validation */
  }



  ngOnInit() {
    this.ls.show();
  }

  ngAfterViewInit() { 
    this.api_Call();

  }


  onSubmit() {
    if (this.dashbaordForm.value.from_date || this.dashbaordForm.value.to_date) { 
      this.ls.show();
      if (this.dashbaordForm.value.from_date != null) {
        this.adddate = _moment([this.dashbaordForm.value.from_date.year, this.dashbaordForm.value.from_date.month - 1, this.dashbaordForm.value.from_date.day]).utc().valueOf();
        this.adddate = (isNaN(this.adddate) === true) ? 0 : this.adddate;

      }
      if (this.dashbaordForm.value.to_date != null) {
        this.addtodate = _moment([this.dashbaordForm.value.to_date.year, this.dashbaordForm.value.to_date.month - 1, this.dashbaordForm.value.to_date.day + 1]).utc().valueOf();
        this.addtodate = (isNaN(this.addtodate) === true) ? 0 : this.addtodate;
      }

      this.api_Call();
    }
  }



  api_Call() {
    this.service.getdatshboarddata(this.adddate, this.addtodate).subscribe(reponse => {
      if (reponse.status === 200) {
        this.ls.hide();
        this.dashboard_data = reponse.result;
      } else {
        alert("please try after some time.")
      }

    })
  }

/******************************************code for reset filter *************************************************** */
  reset() {
    if (this.dashbaordForm.value.from_date || this.dashbaordForm.value.to_date) {
      this.ls.show();
      this.adddate = '';
      this.addtodate = '';
      this.dashbaordForm.reset();
        /* code for caurrent date validation */
              let current = new Date();
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
    /* end code of current date validation */
      this.api_Call()
    }
  }
  /*****************End code of reset filter ***************************************************************** */
  /** *******************************************validation of to date ***************************************************/

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
  
  /********************************* validation code end  *******************************************************/
}
