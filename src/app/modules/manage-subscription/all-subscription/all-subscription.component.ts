import { Component, OnInit ,AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from '../../../services/product.service';
import * as _moment from 'moment'
import {LoaderService} from '../../../services/loader.service';


@Component({
  selector: 'app-all-subscription',
  templateUrl: './all-subscription.component.html',
  styleUrls: ['./all-subscription.component.scss']
})
export class AllSubscriptionComponent implements OnInit,AfterViewInit{
  subscriptionId:string;
  delete_msg=false;
  subscriberlist=[];

  constructor(private modalService: NgbModal,private service:ProductService ,
   private ls:LoaderService ) {}

  openVerticallyCentered(content,subscriptionId) {
    this.subscriptionId=subscriptionId;
    this.modalService.open(content, { centered: true });
 }

  ngOnInit() {
    this.ls.show();
  }
  
  ngAfterViewInit(){
    this.calllistapi();
  }
  customdate(value){
    let date = _moment.utc(value).format('DD/MM/YYYY')
    return date;
  }
  /***************************code for delete subscription******************************************** */

  plandelete(){
    this.ls.show();
  this.service.deletesubscription(  this.subscriptionId).subscribe(response=>{
    if(response.status==200){
      this.ls.hide();
      this.delete_msg=true;
      this.calllistapi();
      setTimeout(() => this.delete_msg=false, 2000);
      this.modalService.dismissAll();
    }
  })
  }
  /****************************end code for delete subsciption******************************************** */
  /******************list api calling ******************************************************** */
  calllistapi(){

    this.service.subscriptionlist().subscribe(response=>{
      if(response.status==200){
        this.ls.hide();
        this.subscriberlist=response.result;
      }
    })
  }
  /****end code of listing api call*********************************************************************** */
}
