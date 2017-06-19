import { Component } from '@angular/core';
import {Angular2TokenService} from "angular2-token";
import {environment} from "../environments/environment";
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Todo';
  constructor(
      private authToken: Angular2TokenService,
      public authService:AuthService, 
      private router:Router){
    this.authToken.init(environment.token_auth_config);
  }  
  logOut(){
    this.authService.logOutUser().subscribe(() => this.router.navigate(['/']));
  }

}
