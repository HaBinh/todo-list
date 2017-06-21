import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import { MyValidations } from '../MyValidations';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../form.css']
})
export class LoginComponent implements OnInit {

  f: FormGroup;
  signInUser = {
    email: '',
    password: ''
  };
  loading = false;

  @Output() onFormResult = new EventEmitter<any>();
  
  constructor(
        public authService:AuthService,
        private router:Router,
        private fb: FormBuilder) {}
  
  ngOnInit() {
    this.f = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([
          Validators.required, 
          MyValidations.cannotContainSpace
        ])]
    })
  }

  onSignInSubmit(){

    this.authService.logInUser(this.signInUser.email, this.signInUser.password).subscribe(
        res => {
          if(res.status == 200){
            this.onFormResult.emit({signedIn: true, res});
          }
        },
        err => {
          this.afterFailedLogin(err);
          console.log('err:', err);
          this.onFormResult.emit({signedIn: false, err});
        }
    );
  }

  afterFailedLogin(errors: any) {
    // this.toggleLoading();
    let parsed_errors = JSON.parse(errors._body).errors;
    for (let attribute in this.f.controls) {
      if (parsed_errors[attribute]) {
        this.f.controls[attribute].setErrors(parsed_errors[attribute]);
      }
    }
    this.f.setErrors(parsed_errors);
  }

  private toggleLoading() {
    this.loading = !this.loading;
  }


}
