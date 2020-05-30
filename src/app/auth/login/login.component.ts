import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder, } from '@angular/forms';
import { LoginService } from '../../services/login.service'
import { Router, ActivatedRoute } from '@angular/router';
import { catchError } from "rxjs/operators";
import {LoaderService} from '../../services/loader.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loading=false;

  loginForm: FormGroup;
  forgetPass: FormGroup
  submitted = false;
  logInResponse: any;
  invalidcredentials_msg: string = '';
  erCode: any;
  errors = [1, 2, 3, 4, 6, 7, 8, 9]
  submited: boolean = false;
  rem: boolean = false;

  constructor(private modalService: NgbModal, 
    private formBuilder: FormBuilder, private service: LoginService, private router: Router,
    private route: ActivatedRoute,private ls: LoaderService

  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/), Validators.maxLength(50)]],
      password: ["", [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
      remember: [false]
    })
    this.forgetPass = this.formBuilder.group({
      email: ["", [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]],
    })
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: false });
  }
  
  ngOnInit() {
    this.ls.show();
    setTimeout(() => {this.ls.hide()}, 800);
  
     if (sessionStorage.getItem('accessToken')) {
      this.router.navigate(['/theme'], { relativeTo: this.route });
    }

    this.loginForm.get('email').setValue(this.user_email);
    this.loginForm.get('password').setValue(this.user_pass);
    if (localStorage.getItem('rem')) {
      this.rem = true;
    }

  }
  // new code added for remember me
  get user_email(): any {
    if (localStorage.getItem('rem')) {
      return localStorage.getItem('email');
    } else {
      return '';
    }
  }
  get user_pass(): any {
    if (localStorage.getItem('rem')) {
      var decPass = localStorage.getItem('password');
      var decodedPass = atob(decPass);
      return decodedPass;

    } else {
      return '';
    }
  }

  //getting values from form
  get f() {
    return this.loginForm.controls;
  }
  //getting values from form
  get p() {
    return this.forgetPass.controls;
  }
  //login
  onSubmit() {

    this.submitted = true;
    if (this.f.remember.value === true) {
      this.service.loggedIn = true;

      localStorage.setItem("rem", "true");
      localStorage.setItem("email", this.f.email.value);
      var encodedPass = btoa(this.f.password.value);
      localStorage.setItem("password", encodedPass);
    }
    else {
      localStorage.removeItem("rem");
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }

    if (this.f.email.value && this.f.password.value) {
          this.loading=true;

      this.service.adminLogin(this.f.email.value.trim(), this.f.password.value.trim()).pipe().subscribe(
        data => {
        
          this.logInResponse = data;
          this.erCode = this.logInResponse.result.errorCode;
          if (this.errors.includes(this.erCode)) {
            this.loading=false;
            this.invalidcredentials_msg = this.logInResponse.result.message;
          } else if (this.logInResponse.result.errorCode == 5) {
            this.loading=false;
            this.invalidcredentials_msg = this.logInResponse.result.errors[0].message;
            // setTimeout(() => { this.invalidcredentials_msg = '' }, 2500);
          } else if (this.logInResponse.success) {
             this.loading=false;
            sessionStorage.setItem("email", this.logInResponse.result.email);
            sessionStorage.setItem("accessToken", this.logInResponse.result.accessToken);
            sessionStorage.setItem("name", this.logInResponse.result.name);
            sessionStorage.setItem("id", this.logInResponse.result._id);
            localStorage.setItem('profileImage', this.logInResponse.result.profileImage)
            this.router.navigate(['/theme'], { relativeTo: this.route });

          }
        },
        catchError(error => {
        
          return error;
        })
      );
    }


  }
  //forgetPass
  forgetPassword() {
    this.submited = true;
    if (this.forgetPass.valid) {
     
      this.service.forgetPassword(this.p.email.value).pipe().subscribe(
        data => {
         
          this.erCode = data.result.errorCode;
          if (this.errors.includes(this.erCode)) {
            alert(data.result.message);
          } else if (data.result.errorCode == 5) {
            alert(data.result.errors[0].message);
          } else if (data.success) {
            alert(data.result.message);
            this.popup_close(1)
            this.submited = false;

          }
        },
        catchError(error => {
         
          return error;
        })
      );
    }


  }
  popup_close(st) {
   
    this.forgetPass.reset();
    this.modalService.dismissAll();
    this.submited = false;
  }
  keyDownHandler(event) {
    if (event.keyCode === 32) {
      return false;
    }
  
  }
}
