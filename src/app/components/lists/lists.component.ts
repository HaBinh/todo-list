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
    this.ListService.deleteListById(list.id);
    this.getList();
    
  }
  
  addList() {
    this.ListService.addList(this.newList);
    this.getList();
    this.newList = new List();
  }

  changeToEdit(List: List, event: any) {
    event.stopPropagation();
    this.listEditing = List.id;
  }

  editList(text: string, List: List, event: any) {
    event.stopPropagation();
    List.title = text;
    this.ListService.editList(List, text);
    this.revertEdit();
    this.getList();
  }

  revertEdit() {
    this.listEditing = -1;
  }

  getList(){
    this.ListService.getLists();
  }

  goTasks(id: number) {
    this.router.navigate(['/lists', id]);
  }

}
