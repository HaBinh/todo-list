import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, CanDeactivate } from '@angular/router';
import * as Rx from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import { Subject, Observable, BehaviorSubject } from "rxjs";

import { List } from "../../models/list.model";
import { ListsService } from '../../services/lists.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
  providers: [ListsService]
})
export class ListsComponent implements OnInit {
  newList: List = new List();
  form: FormGroup;
  formSearch: FormGroup;
  error: any;
  listEditing = -1;
  loading = true;
  lists : List[];
  search: string;
  searchs: List[]; //Results
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  header: string;

  constructor(
    private router: Router,
    private ListService: ListsService,
    fb: FormBuilder
  ) { 
      this.formSearch = fb.group({
        search: []
      });
      this.form = fb.group({
        newListTitle: [ '', Validators.compose([ Validators.required ]) ]
      })
    }

  ngOnInit() {
    this.getList();
    this.searchLists();
  }

  deleteList(list: List, event: Event) {
    event.stopPropagation();
    this.ListService
        .deleteListById(list.id)
        .then(() => {
          this.lists = this.lists.filter(l => l.id !== list.id);
        })
        .catch(error => this.error = error);
  }
  
  addList() {
    this.loading = true;
    this.ListService.addList(this.newList)
        .then(() => {
                this.getList();
                this.loading = false;
                this.newList = new List();
            });
  }

  changeToEdit(List: List, event: any) {
    event.stopPropagation();
    this.listEditing = List.id;
  }

  editList(text: string, List: List, event: any) {
    event.stopPropagation();
    List.title = text;
    this.ListService.editList(List, text)
      .then(() => {
              this.revertEdit();
              this.getList();
              });
  }  
  revertEdit() {
    this.listEditing = -1;
  }

  getList(){
    this.ListService.getLists()
              .then(lists => {
                this.loading = false;
                this.lists = lists;
              })
              .catch(error => this.error = error);
  }

  goTasks(id: number) {
    this.router.navigate(['/lists', id]);
  }

  searchLists(){
    var search = this.formSearch.get('search');
    search.valueChanges
          .do (() => this.loading$.next(true))
          .debounceTime(450)
          .subscribe((query: string) => {
            if (query !== ""){
              this.ListService.searchLists(query)
                  .then(res => {
                      this.loading$.next(false);
                      this.searchs = res.lists; 
                      if (this.searchs.length === 0) this.header = "No result."
                      else if (this.searchs.length === 1) this.header = "1 result:"
                      else this.header = `${this.searchs.length} results:`
               })
            }
            else {
              this.loading$.next(false);
              this.searchs = [];
              this.header = "";
            }
          })
    }
}
