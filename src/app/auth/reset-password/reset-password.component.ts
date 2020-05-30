import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  submitted = false;
  admin_token;
  succes_message: boolean = false;
  error_message: boolean = false;
  password_resetfrom = new FormGroup({
    new_passwprd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    confirm_pass: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
  });
  constructor(private service: LoginService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    
    this.admin_token = this.route.snapshot.queryParams["token"];
    console.log(this.admin_token)
    
  }
  get f() {
    return this.password_resetfrom.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.password_resetfrom.valid) {
      if (this.password_resetfrom.value.new_passwprd.trim() === this.password_resetfrom.value.confirm_pass.trim()) {
        sessionStorage.setItem("accessToken", this.admin_token);
        this.service.reset_pass(this.password_resetfrom.value.confirm_pass.trim()).subscribe(response => {
          if (response.status === 200) {
            this.succes_message = true;
            setTimeout(() => {
              this.succes_message = false,
                this.router.navigate(['/auth/login'], { relativeTo: this.route })
            }, 2000);
            sessionStorage.clear();

          }
          else {
            this.error_message = true;
            setTimeout(() => { this.error_message = false; }, 2000);
          }
        })
      }
      else {
        alert('New Password and Confirm Password is Not Matched.')
      }

    }
  }
  redirect_loginpage() {

    this.router.navigate(['/auth/login'], { relativeTo: this.route });
  }

  keyDownHandler(event) {
    if (event.keyCode === 32) {
      return false;
    }
  
  }
}
