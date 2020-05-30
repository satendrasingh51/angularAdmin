import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {LoaderService} from '../../../services/loader.service';


@Component({
  selector: 'app-manage-notification',
  templateUrl: './manage-notification.component.html',
  styleUrls: ['./manage-notification.component.scss']
})

export class ManageNotificationComponent implements OnInit {
  userttypereset = 0;

  userslist = [];
  managerlists = [];
  managerlistdata = [];

  submited: boolean = false;
  page: number = 1;
  limit: number = 10;
  searchString: string;
  manager_popup;

  page1: number = 1;
  limit1: number = 10;
  collectionSize: number = 0;
  totalcount: number = 0;

  searchstring1;

  userType;
  // code for paginatoo
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  isAll: number = 0;
  ////////end code
  ischeckedall = false;
  ischeckedall1 = false;

  userslistdata = [];

  notification_msg: boolean = false;
  isChecked: boolean = false;
  isChecked1: boolean = false;

  typeuservalidation = false;
  slecetuser_msg = false;


  constructor(private service: DashboardService, private userservice: UserService, private modalService: NgbModal,
    private ls:LoaderService ) { }

  notificationform = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),

  });


  get validation() {
    return this.notificationform.controls;
  }

  ngOnInit() {
      this.ls.show();
      setTimeout(() => {this.ls.hide()}, 700);
      
  }


  sendNotification() {
    this.submited = true;
    this.typevalid()

    if (this.notificationform.valid) {
     
      let userids = [];
      const selectedList = this.userslistdata.filter(x => x.isChecked);

      selectedList.forEach(element => {
        userids.push(element._id);
      });

      //  code for manager ids
      let managerids = [];
      const managerlists = this.managerlistdata.filter(x => x.isChecked1);

      managerlists.forEach(element => {
        managerids.push(element._id);
      });

      if (userids.length == 0 && managerids.length == 0) {
        this.slecetuser_msg = true;
      }

      let usertype = (this.userType == 1) ? userids : managerids;

      if (this.notificationform.valid) {
      
        if (userids.length != 0 || managerids.length != 0) {
          /***call api  */
          this.ls.show();
          
          let value = { ...this.notificationform.value, ...{ userList: usertype }, ...{ userType: this.userType }, ...{ isAll: this.isAll } }
          this.userservice.CreateNotification(value).subscribe(response => {
            if (response.status == 200) {
              this.ls.hide();
              this.notification_msg = true;

              setTimeout(() => { this.notification_msg = false; }, 1000);

              //  code for checkedall hide
              this.ischeckedall1 = false;
              this.ischeckedall = false;
              // end code for checked all hide

            }
          })
        }
        /**end capi calling code  */
      }
    }

  }

  openVerticallyCentered(selectusers, value) {
    this.managerlistdata = [];
    this.userslistdata = [];
    this.isAll = 0;
    this.page1 = 1;
    this.page = 1;
    this.userType = value;
    // this.manager_popup = selectusers;
    if (value == 2) {
      this.ls.show();
      this.managerlist()
      this.modalService.open(selectusers, { centered: true });
    }
    if (value == 1) {
      this.ls.show();
      this.userlist();
      this.modalService.open(selectusers, { centered: true ,});
    }
    this.typevalid()
   
    
  }

  selected() {
    this.modalService.dismissAll();
  }

  // serach by manager name or email/////////////
  search(event) {
    this.page = 1;
    this.managerlistdata = [];
    this.searchString = event.target.value.trim();
    this.managerlist();
  }
  //  end code of search/////////////////////////////////


  managerlist() {
 
    this.userservice.managerlist({ ...{ page: this.page, limit: this.limit, searchString: this.searchString,isNotification:1 } }).subscribe(response => {
      if (response.status == 200) {
        this.ls.hide();
        this.managerlists = response.result.data;

        if (this.searchString) {
          this.totalcount = response.result.globalCount;
          this.managerlistdata = this.managerlists
        } else {
          this.managerlistdata = this.managerlistdata.concat(this.managerlists);
          this.managerlistdata = this.getUnique(this.managerlistdata, '_id');
        }

        this.managerlistdata.forEach(element => {
          element.isChecked1 = this.ischeckedall1;
        });
      }
    })
  }


  //*********************user list api called********************************************************************** */
  userlist() {
    let sortKey = "Title";
    let sortOrder: number = -1;
    let isNotification=1;
    this.userservice.users_list(this.limit1, this.page1, sortKey, sortOrder, this.searchstring1, 1, 1, 0, 0,isNotification).subscribe(response => {
      if (response.status == 200) {
        this.ls.hide();
        this.collectionSize = response.result.count;
        this.userslist = response.result.data;
        if (this.searchstring1) {
          this.userslistdata = this.userslist
        } else {

          this.userslistdata = this.userslistdata.concat(this.userslist)
          this.userslistdata = this.getUnique(this.userslistdata, '_id');
        }
        this.userslistdata.forEach(element => {
          element.isChecked = this.ischeckedall;
        });
      }
    })
  }

  /** *******************************************end user list api code ********************************************** */
  searchuser(event) {
    this.page1 = 1;
    this.userslistdata = [];
    this.searchstring1 = event.target.value.trim();
    this.userlist();
  }

  /*** code end of search users**************************************************************************** */
  selectedmanagers(e) {
    this.slecetuser_msg = false;////// this code for message hide after select any manager or user
    if (e == false) {
      this.ischeckedall1 = false;
    }
  }

  onScroll() {
    if (this.collectionSize / this.page1 > 10) {
      this.page1 = this.page1 + 1;
      this.userlist();
    }
  }


  selectedusers(value) {
    this.slecetuser_msg = false;
    if (value == false) {
      this.ischeckedall = false;
    }
  }


  onScroll1() {
    if (this.totalcount / this.page > 10) {
      this.page = this.page + 1;
      this.managerlist();
    }
  }

  selectallusers() {
    this.slecetuser_msg = false;

    this.userslistdata.forEach(element => {
      element.isChecked = this.ischeckedall;
    });
  }

  /** code for  select all brand manager ********************************************/
  selectallmanagers() {
    this.slecetuser_msg = false;////// this code for message hide after select any manager or user

    this.managerlistdata.forEach(element => {
      element.isChecked1 = this.ischeckedall1;
    });
  }
  /** code end for all brand managers*************************** */

  resetform() {
    this.notificationform.reset();
    this.searchstring1 = '';
    this.searchString = '';
    this.userType = 0;
    this.userttypereset = 0;
  }
  /** Validation code for user type necessary*********************************************************** */
  typevalid() {
    if (this.userType == undefined || this.userType == 0) { this.typeuservalidation = true }
    else { this.typeuservalidation = false }

  }
  //** end of validation code for necessary****************************************************************** */


  /***********************code for uniqe data in ************************************************** */
  getUnique(arr, comp) {
    const unique = arr
      .map(e => e[comp])
      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);
    return unique;
  }


  /*******************8End code for uniqe data *************************************************************** */

  
}

