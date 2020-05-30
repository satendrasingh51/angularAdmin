import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbTimepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import {LoaderService} from '../../../services/loader.service';
import * as _moment from 'moment';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss'],
  providers: [NgbTimepickerConfig]
})


export class ViewRequestComponent implements OnInit, AfterViewInit {

  delete_msg: boolean = false;
  resolved_msg: boolean = false;
  _id: any;
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  conatct_data:any;
  request_date: string = '';

  constructor(config: NgbTimepickerConfig, private modalService: NgbModal, private router: Router, private route: ActivatedRoute,
    private contact_service: ContactService, private loader_service:LoaderService) {
    config.spinners = false;
  }

  openVerticallyCentered(resolved) {
    this.modalService.open(resolved, { centered: true });
  }

  ngOnInit() {
      this.loader_service.show();
  }
  ngAfterViewInit() {

    this._id = this.route.snapshot.paramMap.get('id');
    this.contact_service.request_view(this._id).subscribe(contact_view_resp => {
    this.loader_service.hide();
    this.conatct_data = contact_view_resp.result;
    this.request_date = (_moment.utc(contact_view_resp.result.created).format('DD/MM/YYYY'));
    })
  }

  delete_conatct() {
        this.contact_service.delete_contact(this._id).subscribe(del_response => {
        if (del_response.status === 200) {
        this.delete_msg = true;
        this.modalService.dismissAll();
        setTimeout(() => { this.delete_msg = false, this.router.navigate(['/theme/modules/contactus/contact-manage']) }, 2000);
      }
    })
  }

  resolveconatct() {
     this.contact_service.contact_resolved(this._id).subscribe(resolve_resp => {
      if (resolve_resp.status === 200) {
        this.modalService.dismissAll();
        this.resolved_msg = true;
        setTimeout(() => {
        this.resolved_msg = false,
          this.router.navigate(['/theme/modules/contactus/contact-manage'])
        }, 2000);
      }
      else {

      }
    })
  }
}
