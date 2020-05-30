import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import * as _moment from 'moment'
import { LoginService } from 'src/app/services/login.service';
import { UploadmediaService } from 'src/app/services/uploadmedia.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  disabled: boolean = true;
  admin_name: string = '';
  profile_image: any;
  user_name: string = '';
  user_email: string = '';
  url;
  error_message: boolean = false;
  changeProfileForm: FormGroup;
  message: any;
  profileupdate_msg: boolean = false;
  submitted: boolean = false;
  base64_to_file: any;
  img_file;

  date:any=0;


  constructor(private modalService: NgbModal, private router: Router, private uploadservice: UploadmediaService,
    private profile_service: LoginService,
    private pBuilder: FormBuilder, private _location: Location, private storageservice: StorageService,
    ) {

  }
  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  ngOnInit() {

    
    this.profile_image = localStorage.getItem('profileImage');
    this.user_name = sessionStorage.getItem('name');
    this.user_email = sessionStorage.getItem('email')



   
    this.changeProfileForm = this.pBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern("[a-zA-Z ]*")]),
      image: new FormControl(''),
      email: new FormControl('')
    });

    this.changeProfileForm.patchValue({
      name: this.user_name
    })
  }
  get f() {
    return this.changeProfileForm.controls;
  }
  file;
  

  // image upload code
  async  imageupl() {
    this.date = _moment().utc().valueOf();
    if (this.file) { 
    }
    var reader = new FileReader();
    
    return await this.uploadservice.uploadfileonAwsS3(this.file,'filename'+this.date  ).subscribe(res => {
      if (res) {
        
        this.profile_image = res.Location;
      }
    });
  }

 

   onSubmit() {

    this.imageupl();
    this.submitted = true;
    if (this.changeProfileForm.valid) {
      this.profile_service.ediit_profile((this.changeProfileForm.value.name.trim()),this.profile_image).subscribe(Edit_reponse => {
        if (Edit_reponse.status === 200) {
          this.storageservice.setItem('profileImage', this.profile_image)
          localStorage.setItem('profileImage',this.profile_image);
          sessionStorage.setItem('name',(this.changeProfileForm.value.name.trim()))

          this.profileupdate_msg = true;
          setTimeout(() => { this.profileupdate_msg = false, this.router.navigate(['/theme/modules/settings/profile']) }, 3000);
        }
        else {
          this.error_message = true;
          setTimeout(() => this.error_message = false, 4000);
        }
      })
    }
  }


  getcroppedimage(event) {
    var binary = atob(event.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    let blob_image = new Blob([new Uint8Array(array)], {
      type: 'image/jpg'
    });

    this.file = new File([blob_image], 'imageName', { type: 'image/jpeg' });
    return this.file;

  }
  backClicked() {
    this._location.back();
  }
  keyDownHandler(event) {
    if (event.target.value.length > 0) {
      return true;
    } else {
      if (event.keyCode === 32) {
        return false;
      }
    }
  }




}
