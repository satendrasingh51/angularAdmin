import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NewletterService} from '../../../services/newletter.service';
import * as moment from 'moment';
import {LoaderService} from '../../../services/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-view-advertisement',
  templateUrl: './view-advertisement.component.html',
  styleUrls: ['./view-advertisement.component.scss']
})

export class ViewAdvertisementComponent implements OnInit {
advertisementid;
responsedata:any;
startdate:any;
endDate:any;
acceptreqmsg=false;
rejectreqmsg=false


  constructor( private route:ActivatedRoute , private service:NewletterService,
      private ls:LoaderService, private modalService: NgbModal, private router:Router) { }


      modalopen(content){
          this.modalService.open(content,{centered:true})
      }

  ngOnInit() {
    this.ls.show();
    this.advertisementid = this.route.snapshot.paramMap.get('id');
    this.viewadvertisementapi();
  }

viewadvertisementapi(){
  this.service.viewadvertisement(this.advertisementid).subscribe(response=>{
     if(response.status==200){
      this.ls.hide();
      this.responsedata=response.result;
      this.startdate= moment(response.result.startDate).format("DD/MM/YYYY")
       this.endDate= moment(response.result.endDate).format("DD/MM/YYYY");
     }
     else{

     }
  })
}

acceptreq(){
  this.ls.show()
  this.service.actionadverisement(this.advertisementid,1).pipe(
    catchError(error=>{
      return error;
    },
    )
  ).subscribe(response=>{
    if(response.status==200){
     
      this.viewadvertisementapi()
      this.acceptreqmsg=true;
      this.modalService.dismissAll();
      setTimeout(() => {this.acceptreqmsg=false}, 4000);
    }
  })
}

rejectreq(){
  this.ls.show()
  this.service.actionadverisement(this.advertisementid,2).pipe(
    catchError(error=>{
      return error;
    },
    )
  ).subscribe(response=>{
    if(response.status==200){
      this.viewadvertisementapi()
     
      this.rejectreqmsg=true;
      this.modalService.dismissAll();
      setTimeout(() => {this.rejectreqmsg=false}, 4000);
    }
  })
}

deletereq(){
this.ls.show();
this.service.actionadverisement(this.advertisementid,3).pipe(
  catchError(error=>{
    return error;
  },
  )
).subscribe(response=>{
  if(response.status==200){
    this.ls.hide();
    this.modalService.dismissAll();
    this.router.navigate(['/theme/modules/brand-advertisement/manage-advertisement'])
  }
})
}

}
