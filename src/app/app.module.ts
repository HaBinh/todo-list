import { BrowserModule }        from '@angular/platform-browser';
import { NgModule }             from '@angular/core';
import { FormsModule, 
         ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';
import { RouterModule,
         Routes }               from '@angular/router';
import { APP_BASE_HREF,
         LocationStrategy,
         HashLocationStrategy } from '@angular/common';
import { MdProgressBarModule, 
         MdButtonModule }       from '@angular/material';

import { AppComponent }         from './app.component';
import { TasksComponent }       from './components/tasks/tasks.component';
import { ListsComponent }       from './components/lists/lists.component';
import { HomeComponent }        from './components/home/home.component';
import { SignupComponent }      from './components/user/signup/signup.component';
import { LoginComponent }       from './components/user/login/login.component';

const routes: Routes = [
    { path: '',          component: HomeComponent},
    { path: 'signup',    component: SignupComponent},
    { path: 'login',     component: LoginComponent},
    { path: 'lists',     component: ListsComponent },
    { path: 'lists/:id', component: TasksComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ListsComponent,
    TasksComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MdButtonModule,
    MdProgressBarModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }