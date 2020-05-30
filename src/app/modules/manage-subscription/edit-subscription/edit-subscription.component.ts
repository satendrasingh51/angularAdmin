import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from '../../../services/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-subscription',
  templateUrl: './edit-subscription.component.html',
  styleUrls: ['./edit-subscription.component.scss']
})
export class EditSubscriptionComponent implements OnInit {
submitted=false;
subscription_id;
subscriberdetails;
type;
prevuilidge=[];
update_msg=false;


  constructor(private modalService: NgbModal, private service:ProductService
    ,private route:ActivatedRoute,private router:Router,
    private _location: Location) {
    this.subscription_id = this.route.snapshot.paramMap.get('id');

  }

  subscriptionform = new FormGroup({
    title: new FormControl('',Validators.required),
    price:new FormControl('',Validators.required),
    description:new FormControl('',Validators.required),
    Privilages: new FormControl('',Validators.required),
  });


  openVerticallyCentered(deletepopup) {
    this.modalService.open(deletepopup, { centered: true });
 }
get f(){
  return this.subscriptionform.controls;
}


  ngOnInit() {
    
    this.service.subscriptiondetail(this.subscription_id).subscribe(response=>{
     
      if(response.status==200){
      
        this.subscriberdetails=response.result;
    
        this.type=response.result.type;
          this.subscriptionform.patchValue({title:this.subscriberdetails.title,price:this.subscriberdetails.cost,
            description:this.subscriberdetails.discription,Privilages:this.subscriberdetails.privilage})
      } 
    })
  }
  onSubmit(){
    this.submitted=true;
    this.prevuilidge.push(this.subscriptionform.value.Privilages)
    if(this.subscriptionform.valid){
     
      this.service.editsubscription(this.subscription_id,this.type,this.subscriptionform.value.title.trim(),
        this.subscriptionform.value.price,
          this.subscriptionform.value.description.trim(),this.prevuilidge).subscribe(response=>{
           
            if(response.status==200){
             
              this.update_msg=true;
              this.prevuilidge=[];
              setTimeout(() => {this.update_msg=false,this.router.navigate(['/theme/modules/subscription'])}, 2000);
            
            }
          })
    }
  }

  backClicked() {
    this._location.back();
  }
}
