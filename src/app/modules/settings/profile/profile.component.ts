import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
// import { LoginService } from '../../../services/login.service';

import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})


export class ProfileComponent implements OnInit {

  
  profileaname: string = '';
  user_email: string = '';
  profileImage: any;
  changePasswordForm: FormGroup;
  message: boolean = false;
  passnot_updated: boolean = false;
  submitted = false;
  confirm_pass_error_msg: boolean = false;
  constructor(private modalService: NgbModal,
    private changeformBuilder: FormBuilder, private service: LoginService) {
    this.profileaname = sessionStorage.getItem('name');
    this.user_email = sessionStorage.getItem('email');
    this.profileImage = localStorage.getItem('profileImage')
  }
  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  ngOnInit() {
   
   
    this.changePasswordForm = this.changeformBuilder.group({
      current_pass: new FormControl('', [Validators.required, Validators.minLength(6), , Validators.maxLength(20)]),
      new_pass: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirm_pass: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
    });
  }
  // pasword match
  checkIfMatchingPasswords(new_pass: string, confirm_pass: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[new_pass],
        passwordConfirmationInput = group.controls[confirm_pass];
      // if (passwordConfirmationInput.value) {}
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })

      }

      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.valid) {
      if (this.changePasswordForm.value.current_pass != this.changePasswordForm.value.new_pass) {
        if (this.changePasswordForm.value.new_pass === this.changePasswordForm.value.confirm_pass) {
          this.service.changepassword(this.changePasswordForm.value.confirm_pass, this.changePasswordForm.value.current_pass).subscribe(
            resp => {
              if (resp.status === 200) {
               
                this.message = true;
                setTimeout(() => this.message = false, 2000);
                setTimeout(() => {this.modalService.dismissAll(),this.changePasswordForm.reset()}, 2000);
                this.submitted = false;
              }
              else if (resp.errorCode === 400) {
                this.changePasswordForm.reset();
                alert(resp.result.errors)

              }
             
            }
          )

        }
        else {
          alert("New password and confirm password doesn't matched.")
        }
      }
      else {
        alert("Old Password and new Password can not be same.")
      }
    }

  }
  popup_close() {
    this.changePasswordForm.reset();
    this.modalService.dismissAll();
  }
}

