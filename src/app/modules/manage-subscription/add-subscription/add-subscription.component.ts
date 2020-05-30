import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl,Validators} from '@angular/forms';
import {ProductService} from '../../../services/product.service';
import {Router,ActivatedRoute} from '@angular/router';
import {LoaderService} from '../../../services/loader.service';

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.scss']
})

export class AddSubscriptionComponent implements OnInit {

  submitted:boolean=false;
  Privilages=[];
  sucess_msg=false;

  constructor(private modalService: NgbModal,private service:ProductService,
     private router:Router , private ls:LoaderService) {}


  openVerticallyCentered(savecnfrm) {
    this.modalService.open(savecnfrm, { centered: true });
 }

 subscriptionform = new FormGroup({
  title: new FormControl('',Validators.required),
  price: new FormControl('',Validators.required),
  description:new FormControl('',Validators.required),
  Privilages:new FormControl('',Validators.required)
});


get f(){
  return this.subscriptionform.controls;
}

  ngOnInit() {
    this.ls.show();
    setTimeout(() => {this.ls.hide()}, 600);
  }

  addsubscription(){
    this.submitted=true;
    if(this.subscriptionform.valid){
      this.ls.show();
     this.Privilages.push(this.subscriptionform.value.Privilages.trim());
    this.service.createsubscription(this.subscriptionform.value.title.trim(),this.subscriptionform.value.price.trim(),this.subscriptionform.value.description.trim()
        , this.Privilages).subscribe(response=>{
        if(response.status==200){
          this.ls.hide()
          this.Privilages=[];
          this.sucess_msg=true;
          setTimeout(() => { this.sucess_msg=false;this.router.navigate(['/theme/modules/subscription'])}, 1500);
        }
        else{this.Privilages=[];}
        })
    }
  }

  // for input box number validation
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


}
