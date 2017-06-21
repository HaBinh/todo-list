import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import { MyValidations } from '../MyValidations';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../form.css']
})
export class SignupComponent implements OnInit {
  loading: boolean;
  f: FormGroup;
  signUpUser = {
    email: '',
    password: '',
    passwordConfirmation: ''
  };

  @Output() onFormResult = new EventEmitter<any>();

  constructor(
    private authSerivce:AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.f = this.fb.group({
      email: ['', Validators.compose([
          Validators.required
      ])],
      password: ['', 
        Validators.compose([
          Validators.required, 
          Validators.minLength(8),
          MyValidations.cannotContainSpace
        ])
      ],
      passwordConfirmation: ['', Validators.required]
    });
  }


  onSignUpSubmit(){
    this.loading = true;
    this.authSerivce.registerUser(this.signUpUser).subscribe(

        (res) => {
          if (res.status == 200){
            this.onFormResult.emit({signedUp: true, res})
          }
        },

        (err) => {
          this.afterFailedLogin(err);
          console.log(err.json())
          this.onFormResult.emit({signedUp: false, err})
        }
    )
    this.loading = false;
  }
  afterFailedLogin(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;
    for (let attribute in this.f.controls) {
      if (parsed_errors[attribute]) {
        this.f.controls[attribute].setErrors(parsed_errors[attribute]);
      }
    }
    this.f.setErrors(parsed_errors);
  }

}
