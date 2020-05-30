import { Component, OnInit, AfterViewInit } from '@angular/core';
import {NewletterService} from '../../../services/newletter.service';
import {LoaderService} from '../../../services/loader.service';
import {  encodeBase64 } from '@progress/kendo-file-saver';
import {UploadmediaService} from '../../../services/uploadmedia.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-view-newsletter-gallery',
  templateUrl: './view-newsletter-gallery.component.html',
  styleUrls: ['./view-newsletter-gallery.component.scss']
})

export class ViewNewsletterGalleryComponent implements OnInit, AfterViewInit {

  constructor(private service: NewletterService, private loader: LoaderService,
    private uploadeservice: UploadmediaService) {

  }
  url;
  data;
  btn_disabled = false;


  limit: number = 12;
  page: number = 1;

  responsedata = [];

  ngOnInit() {
    this.loader.show();
  }

  ngAfterViewInit() {
    this.callimageapi();
  }


  callimageapi() {
    this.service.adminallimages(this.limit, this.page).subscribe(response => {
      if (response.status == 200) {
        this.url = response.result.data[1].imageUrl;
        this.loader.hide();
        let collectiosize = response.result.globalCount;
        this.data = response.result.data;
        this.responsedata = this.responsedata.concat(this.data);

        this.responsedata.forEach(element => {
          if (element.imageUrl.substring(element.imageUrl.lastIndexOf(".") + 1).toLowerCase() == 'jpg' || element.imageUrl.substring(element.imageUrl.lastIndexOf(".") + 1).toLowerCase() == 'jpeg' ||
            element.imageUrl.substring(element.imageUrl.lastIndexOf(".") + 1).toLowerCase() == 'gif' || element.imageUrl.substring(element.imageUrl.lastIndexOf(".") + 1).toLowerCase() == 'png' ||
            element.imageUrl.substring(element.imageUrl.lastIndexOf(".") + 1).toLowerCase() == 'bmp') {
            element.type = 'image'
          } else {
            element.type = 'video'
          }
        })
        if (collectiosize == this.responsedata.length) {
          this.btn_disabled = true;
        }
      }
    })
  }

  pagechange() {
    this.loader.show();
    this.page = this.page + 1;
    this.callimageapi();
  }

  exportimages(fileId) {
    //   console.log('https://growdoc.s3.us-east-2.amazonaws.com/Screenshot%202019-07-05%20at%2010.56.21%20PM.png')
    //   var myString = this.url
    // alert(myString.substring(myString.lastIndexOf(".")+1))
    // let file = new Blob([this.url], { type: '' });
    // saveAs(file)
    console.log("===");

    // this.download(this.url, "helloWorld.jpeg");

    window.location = this.url;
    this.uploadeservice.getFiledataFromAws(this.url).subscribe(response => {
      console.log(response)
    });

  }

  download() {
    console.log("https://asapps3bucket.s3.ap-southeast-1.amazonaws.com/IMG_465198F58E72-1.jpeg")
    const link = document.createElement('a');
    link.href = "https://asapps3bucket.s3-ap-southeast-1.amazonaws.com/1566826265035.jpg";
    link.download = '';
    link.click();

    setTimeout(() => {

      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL("https://asapps3bucket.s3-ap-southeast-1.amazonaws.com/1566826265035.jpg");
      }, 100);
    }


exportImages(fileurl){
  var filename = this.getFileName(fileurl);
  FileSaver.saveAs(fileurl,filename);
  this.uploadeservice.getFiledataFromAws(fileurl).subscribe(response=>{
    console.log(response)
  });
}
custom(value) { 
   

}
getFileName(event){
  if(event){
    let filename = event.substring(event.lastIndexOf('/')+1);
    return filename;
  }
}

}
