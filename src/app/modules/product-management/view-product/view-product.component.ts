import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as _moment from 'moment'
import { ProductService } from 'src/app/services/product.service';
import {LoaderService} from '../../../services/loader.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})


export class ViewProductComponent implements OnInit {
delte_message:boolean=false;
product_data_display:any;
date;
product_id;
show_sub_category:boolean=false

  constructor(private modalService: NgbModal, private service: ProductService,
    private route: ActivatedRoute, private router:Router, private ls:LoaderService) { }
  openVerticallyCentered(deletepopup) {
    this.modalService.open(deletepopup, { centered: true });
  }

  ngOnInit() {
    this.ls.show();
    this.product_id= this.route.snapshot.paramMap.get('id');

    this.service.view_product( this.product_id).subscribe(product_view_response => {
      if(product_view_response.status===200){
        this.ls.hide();
        this.product_data_display=product_view_response.result;
        this.date = _moment.utc(product_view_response.result.created).format('DD/MM/YYYY')
        if(product_view_response.result.subCategoryData.length>0){
            this.show_sub_category=true;
        }
        else{
          this.show_sub_category=false;
        }
      }
      else{
        console.log("erorrrrrrrrrrrr")
      }
     
    })
  }
  delete_product(){
    this.ls.show();
    this.service.delete_product( this.product_id).subscribe(response=>{
    
      if(response.status===200){
        this.ls.hide();
        this.delte_message=true;
        this.modalService.dismissAll();
        setTimeout(() => {this.router.navigate(['/theme/modules/product-management/manage-products'])}, 2000);
      }
    })
  }
}
