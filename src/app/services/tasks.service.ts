import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Tasks } from '../models/tasks.model';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TasksService {
  private tasks1Url = 'http://localhost:3000/';
  private tasksUrl = 'https://gentle-shelf-15318.herokuapp.com/';
  private headers = new Headers({
      'Content-Type': 'application/json'
    });
  tasks: Tasks[]
  listTitle: string;
  constructor(private http: Http) { }

  getAllTasksByListId(list_id: number): Promise<Tasks[]> {
    const getTasksUrl = this.tasksUrl + "lists/" + list_id + ".json";
    return this.http.get(getTasksUrl)
                .toPromise()
                .then(res => {
                  return res.json().tasks as Tasks[];
                }) 
                .catch(this.handleError);
  }
  getListTitle(list_id: number): Promise<any> {
    const url = this.tasksUrl + "lists/" + list_id + ".json";
    return this.http.get(url)
                .toPromise()
                .then(res => {
                  return res.json().list.list_title;
                }) 
                .catch(this.handleError);
  }
  // Simulate POST /tasks
  addTask(task: Tasks): Promise<Response> {
    let keys: string = [
      `title=${task.title}`,
      `list_id=${task.list_id}`
    ].join("&");
    const url = `${this.tasksUrl}tasks?${keys}`;
    return this.http
               .post(url, {}, { headers: this.headers })
               .toPromise()
               .then(res => {
                 return res;
               })
               .catch(this.handleError);
  }

  markAllDone(list_id: number): Promise<Response> {
    const url = this.tasksUrl+'mark_all_done?list_id=' + list_id;
    return this.http
               .post(url, {}, { headers: this.headers })
               .toPromise()
               .catch(this.handleError);
  }

  // Simulate DELETE /tasks/:id
  deleteTaskById(id: number): Promise<Response> {
    const url = this.tasksUrl + 'tasks/' + id;
    return this.http.delete(url, {headers: this.headers})
                    .toPromise()
                    .catch(this.handleError);
  }
  
  toggleTaskComplete(task: Tasks): Promise<Response> {
    const url = this.tasksUrl + 'tasks/' + task.id;
    return this.http
               .patch(url, JSON.stringify(task.id), { headers: this.headers })
               .toPromise()
               .then(res => {console.log(res);return res})
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
