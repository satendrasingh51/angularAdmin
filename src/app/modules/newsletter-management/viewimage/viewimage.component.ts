import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewletterService } from '../../../services/newletter.service';

@Component({
  selector: 'app-viewimage',
  templateUrl: './viewimage.component.html',
  styleUrls: ['./viewimage.component.scss']
})
export class ViewimageComponent implements OnInit {
  page: number = 1;
  limit: number = 10;
  email;

  reposnedata=[];

  constructor(private route: ActivatedRoute, private service: NewletterService) { }

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('id');
    if (this.email) {
      this.subscriberimageapi();
    }
  }

  subscriberimageapi() {
    this.service.subscriberimage(this.email, this.limit, this.page).subscribe(response => {
      console.log(response)
      if(response.status==200){
        this.reposnedata=response.result.data;
        this.reposnedata.forEach(element=>{
         if(element.imageUrl.substring(element.imageUrl.lastIndexOf(".")+1).toLowerCase()=='jpg'||element.imageUrl.substring(element.imageUrl.lastIndexOf(".")+1).toLowerCase()=='jpeg'||
          element.imageUrl.substring(element.imageUrl.lastIndexOf(".")+1).toLowerCase()=='png'||  element.imageUrl.substring(element.imageUrl.lastIndexOf(".")+1).toLowerCase()=='gif'||
          element.imageUrl.substring(element.imageUrl.lastIndexOf(".")+1).toLowerCase()=='bmp'){
            element.type='image';
          }else{
            element.type='video';
          }
        })
      }
    })
  }
}
