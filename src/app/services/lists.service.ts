import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { List } from '../models/list.model';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ListsService {
  private localUrl = 'http://localhost:3000/';
  private listsUrl = 'https://radiant-taiga-44344.herokuapp.com/';
  private headers = new Headers({
      'Content-Type': 'application/json'
    });
  
  constructor(
    private http: Http
  ) { }

  lists: List[]
 
  getLists(): Promise<Array<List>>{
    let indexListUrl = this.listsUrl + "lists.json";
    return this.http
               .get(indexListUrl)
               .toPromise()
               .then((res) => {
                 return res.json().lists as List[];
               })
               .catch(this.handleError);
  }

  addList(list: List): Promise<Response> {
    let addListUrl = this.listsUrl + 'lists';
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
    const url = this.listsUrl + "lists.json?search=" + search;
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
