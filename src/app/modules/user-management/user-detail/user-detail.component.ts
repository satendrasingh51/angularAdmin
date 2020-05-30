import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { UserService } from 'src/app/services/user.service';
import {LoaderService} from '../../../services/loader.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})


export class UserDetailComponent implements OnInit {
  block_msg: boolean = false;
  unblock_msg: boolean = false;
  user_delete_msg: boolean = false;

  users_id: string = '';
  user_detail;
  joning_date;

  constructor(private modalService: NgbModal, private route: ActivatedRoute,
    private user_service: UserService, private router: Router, private ls:LoaderService) { }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }


  ngOnInit() {
    this.users_id = this.route.snapshot.paramMap.get('id');
    this.ls.show();
    this.callapi();

  }


  user_block() {
    this.ls.show();
    this.user_service.block_user(this.users_id).subscribe(user_block_resp => {

      if (user_block_resp.status === 200) {
        this.block_msg = true;
        setTimeout(() => {
          this.block_msg = false
        }, 2000);
        this.callapi();
        this.modalService.dismissAll();
        setTimeout(() => { this.router.navigate(['/theme/modules/user-management/manage-users']) }, 1500);

      }

    })
  }
  


  unblock_user() {
    this.ls.show();
    this.user_service.unblock_user(this.users_id).subscribe(user_unblock_respo => {

      if (user_unblock_respo.status === 200) {
        this.unblock_msg = true;
        setTimeout(() => { this.unblock_msg = false }, 1500);
        this.callapi();
        this.modalService.dismissAll();
        setTimeout(() => { this.router.navigate(['/theme/modules/user-management/manage-users']) }, 1500);

      }

    })
  }


  callapi() {
    this.user_service.user_details(this.users_id).subscribe(user_details_resp => {

      if (user_details_resp.status === 200) {
        this.ls.hide();
        this.user_detail = user_details_resp.result;

        this.joning_date = (_moment.utc(user_details_resp.result.created).format('DD/MM/YYYY'))
      }
    })
  }


  user_delete() {
    this.ls.show();
    this.user_service.delete_user(this.users_id).subscribe(user_delete_resp => {
      if (user_delete_resp.status === 200) {
        this.user_delete_msg = true;
        this.modalService.dismissAll();
        setTimeout(() => { this.user_delete_msg = false, this.router.navigate(['/theme/modules/user-management/manage-users']) }, 1500);
      }
    })
  }

}
