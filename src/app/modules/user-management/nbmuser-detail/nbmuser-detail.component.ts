import { Component, OnInit,AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import {LoaderService} from '../../../services/loader.service';


@Component({
  selector: 'app-nbmuser-detail',
  templateUrl: './nbmuser-detail.component.html',
  styleUrls: ['./nbmuser-detail.component.scss']
})
export class NbmuserDetailComponent implements OnInit,AfterViewInit{
managerId;
managerData:any;
joning_date;
manager_block_msg:boolean=false;
unblock_msg:boolean=false;
delte_msg:boolean=false;

  constructor( private route:ActivatedRoute, private service:UserService,
    private modalService: NgbModal,private router:Router, private ls:LoaderService) { }


  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  ngOnInit() {
    this.ls.show();
    this.managerId = this.route.snapshot.paramMap.get('id');
    
    
  }
  ngAfterViewInit(){
    this.apicall();
}

managerBlock() {
  this.ls.show();
  this.service.blockManager(this.managerId).subscribe(response => {
    if (response.status == 200) {
      this.modalService.dismissAll()
      this.apicall();
      this.manager_block_msg = true;
      setTimeout(() => { this.manager_block_msg = false }, 1000);
    }
  })
}

unblockmanagaer() {
  this.ls.show();
  this.service.unblockmanager(this.managerId).subscribe(response => {
    if (response.status == 200) {
      this.modalService.dismissAll()
      this.apicall();
      this.unblock_msg = true;
      setTimeout(() => { this.unblock_msg = false }, 1000);
    }
  })
}

managerdelete() {
  this.ls.show();
  this.service.delete_manager(this.managerId).subscribe(response => {
   
    if (response.status === 200) {
      this.delte_msg = true;
      this.modalService.dismissAll()
      this.apicall();
      setTimeout(() => { this.delte_msg = false,this.router.navigate(['/theme/modules/user-management/managenbm-users']) }, 1000);
    }
  })
}

apicall(){
  this.service.detailedManager(this.managerId).subscribe(response=>{
     
    if(response.status==200){
      this.ls.hide();
      this.managerData=response.result;
      this.joning_date = (_moment.utc(response.result.created).format('DD/MM/YYYY'))

    }
  })
}
}
