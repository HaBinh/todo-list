import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { List } from '../models/list.model';
import 'rxjs/add/operator/toPromise';
import { AuthService } from './auth.service';
import { Angular2TokenService } from 'angular2-token';

@Injectable()
export class ListsService {
  private lists1Url = 'http://localhost:3000/';
  private listsUrl = 'https://gentle-shelf-15318.herokuapp.com/';
  private headers = new Headers({
      'Content-Type': 'application/json'
    });
  
  constructor(
    private http: Http,
    private authService: AuthService,
    private authTokenSerivce: Angular2TokenService
  ) { }

  lists: List[]
 
  getLists(): Promise<Array<List>>{
    let params: string = [
      `user_id=${this.authTokenSerivce.currentUserData.id}`
    ].join("&");
    let indexListUrl = `${this.listsUrl}lists.json?${params}`;
    return this.http
               .get(indexListUrl)
               .toPromise()
               .then((res) => {
                 return res.json().lists as List[];
               })
               .catch(this.handleError);
  }

  addList(list: List): Promise<Response> {
    let params: string = [
      `title=${list.title}`,
      `user_id=${this.authTokenSerivce.currentUserData.id}`
    ].join("&");
    let addListUrl = `${this.listsUrl}lists?${params}`;
    return this.http
               .post(addListUrl, JSON.stringify(list), { headers: this.headers } )
               .toPromise()
               .then(res => {
                  return res;
               })
               .catch(this.handleError);
  }

  deleteListById(id: number): Promise<Response> {
    let deleteListUrl = this.listsUrl + "lists/" + id;
    return this.http
               .delete(deleteListUrl, { headers: this.headers })
               .toPromise()
               .catch(this.handleError);
  }

  editList(List: List, text: string){
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const url = this.listsUrl + "lists/" + List.id;
    return this.http
               .patch(url, JSON.stringify(List), { headers: headers })
               .toPromise()
               .then((res) => {
                 console.log(res);
                 return List;
                })
               .catch(this.handleError);
  }

  searchLists(search: string): Promise<any>{
    let params: string = [
      `user_id=${this.authTokenSerivce.currentUserData.id}`,
      `search=${search}`
    ].join("&");
    let url = `${this.listsUrl}lists.json?${params}`;
    return this.http
               .get(url)
               .toPromise()
               .then(res => {
                 return res.json();
               })
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
