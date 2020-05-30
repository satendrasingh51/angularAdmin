import { Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import * as _moment from 'moment'
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { BlogService } from 'src/app/services/blog.service';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-manage-blog',
  templateUrl: './manage-blog.component.html',
  styleUrls: ['./manage-blog.component.scss']
})


export class ManageBlogComponent implements OnInit {
  categorylists = [];

  datevalid_msg: boolean = false;
  collectionSize: number;
  rersponsedispaly: any;
  limit = 10;
  page = 1;
  sortOrder = -1
  sortKey = 'updated';
  searchString: string = '';
  addFromDate: number = 0;
  addToDate: number = 0;
  updateFromDate: number = 0;
  updateToDate: number = 0;
  model: NgbDateStruct;
  model1: NgbDateStruct;

  minDate1;

  maxDate = undefined;
  maxDate3: any;

  blogId: string = '';
  deletedmessage: boolean = false;

  //Changing Date format
  readonly DT_FORMAT = 'DD/MM/YYYY';
  open: number;
  minDate2: any;
  maxDate1: any;
  open1: number;
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


  // form
  profileForm = new FormGroup({
    from_time_first: new FormControl(''),
    to_time_first: new FormControl(''),
    from_time_second: new FormControl(''),
    to_time_second: new FormControl(''),
    category: new FormControl('')
  });

  constructor(private modalService: NgbModal, private service: BlogService,
    private router: Router, private ls: LoaderService) {
    this.datevalidationmethod()
    this.service.categorylist().pipe().subscribe(response => {

      this.categorylists = response.result
    })
  }

  openVerticallyCentered(content, value) {
    this.blogId = value;
    this.modalService.open(content, { centered: true });
  }


  ngOnInit() {
    this.ls.show();
    this.callapi()
  }
  
  // data format change
  customdate(event) {
    let date = moment.utc(event).format('DD/MM/YYYY')
    return date;
  }
  // 

  details(value) {
    this.router.navigate(['/theme/modules/blog-management/blog-details/', value]);
  }
  // delete blog code

  deleteblog() {
    this.ls.show();
    this.service.deleteblogapi(this.blogId).subscribe(response => {
      if (response.status === 200) {
        this.ls.hide();
        this.deletedmessage = true;
        setTimeout(() => this.modalService.dismissAll(), 200);
        setTimeout(() => this.deletedmessage = false, 2500);
        this.callapi();

      }
    })
  }
  //end delete blog code

  // call api
  callapi() {
    this.service.getbloglist(this.limit, this.page, this.sortOrder, this.sortKey, this.searchString, this.addFromDate,
      this.addToDate, this.updateFromDate, this.updateToDate,this.profileForm.value.category).subscribe(response => {

        if (response.status === 200) {
          this.ls.hide();
          this.rersponsedispaly = response.result.data;
          this.collectionSize = response.result.count;
        }
      })
  }


  loadpage(event) {
    this.ls.show();
    this.page = event;
    this.callapi();
  }


  onSubmit() {
    if (this.profileForm.value.from_time_first || this.profileForm.value.to_time_first || this.profileForm.value.from_time_second || this.profileForm.value.to_time_second
             || this.profileForm.value.category) {
      this.ls.show();
      if (this.profileForm.value.from_time_first != null) {
        this.addFromDate = _moment([this.profileForm.value.from_time_first.year, this.profileForm.value.from_time_first.month - 1, this.profileForm.value.from_time_first.day]).utc().valueOf();
        this.addFromDate = (isNaN(this.addFromDate) === true) ? 0 : this.addFromDate;
      }
      if (this.profileForm.value.to_time_first != null) {
        this.addToDate = _moment([this.profileForm.value.to_time_first.year, this.profileForm.value.to_time_first.month - 1, this.profileForm.value.to_time_first.day + 1]).utc().valueOf();
        this.addToDate = (isNaN(this.addToDate) === true) ? 0 : this.addToDate;
      }
      if (this.profileForm.value.from_time_second != null) {
        this.updateFromDate = _moment([this.profileForm.value.from_time_second.year, this.profileForm.value.from_time_second.month - 1, this.profileForm.value.from_time_second.day]).utc().valueOf();
        this.updateFromDate = (isNaN(this.updateFromDate) === true) ? 0 : this.updateFromDate;
      }
      if (this.profileForm.value.to_time_second != null) {
        this.updateToDate = _moment([this.profileForm.value.to_time_second.year, this.profileForm.value.to_time_second.month - 1, this.profileForm.value.to_time_second.day + 1]).utc().valueOf();
        this.updateToDate = (isNaN(this.updateToDate) === true) ? 0 : this.updateToDate;
      }
      this.callapi();
    }
   

  }


  searchstring(value) {
    this.searchString = value.trim();
    this.callapi();
  }

  
  reset() {

    if ((this.profileForm.value.from_time_first || this.profileForm.value.to_time_first) || (this.profileForm.value.from_time_second || this.profileForm.value.to_time_second||this.profileForm.value.category)
    ) {
      this.ls.show();
      this.addFromDate = 0; this.addToDate = 0;
      this.updateFromDate = 0; this.updateToDate = 0;
      

      this.profileForm.reset();
      this.profileForm.patchValue({category:""})
      this.callapi();
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
    else if (this.profileForm.value) {
      // this.datevalid_msg = true;
      setTimeout(() => { this.datevalid_msg = false }, 2000);

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
    else {
      // this.datevalid_msg = true;
      // setTimeout(() => { this.datevalid_msg = false }, 2000);
    }
  }

  // date validation from date to to date
  fromDate(dat) {
    if (typeof (dat) != undefined) {
      this.minDate1 = dat;
      this.open = 1;
    }
  }

  fromDate1(dat) {
    if (typeof (dat) != undefined) {
      this.minDate2 = dat;
      this.open1 = 1;
    }
  }

  toDate(dat) {
    if (typeof (dat) != undefined) {
      this.maxDate = dat;
    }
  }

  toDate1(dat) {
    if (typeof (dat) != undefined) {
      this.maxDate1 = dat;
    }
  }

  limitchange(event) {
    this.ls.show();
    this.limit = event.target.value;
    this.callapi();
  }



  datevalidationmethod() {
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
    this.maxDate3 = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    }
  }
}
