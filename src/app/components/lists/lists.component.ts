import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, CanDeactivate } from '@angular/router';

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
  error: any;
  listEditing = -1;
  loading = true;
  lists : List[];
  search: string;
  constructor(
    private router: Router,
    private ListService: ListsService,
    fb: FormBuilder
  ) {
      this.form = fb.group({
        newListTitle: [ '', Validators.compose([ Validators.required ]) ]
      })
    }

  ngOnInit() {
    this.getList();
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
    this.ListService.addList(this.newList)
        .then(() => {
                this.getList();
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
                this.lists = lists;
              })
              .catch(error => this.error = error);
  }

  searchLists(search: string){
    this.ListService.searchLists(search)
              .then(lists => {
                this.lists = lists;
              })
              .catch(error => this.error = error);
  }

  goTasks(id: number) {
    this.router.navigate(['/lists', id]);
  }

}
