import { Component, OnInit } from '@angular/core';
import { Tasks } from '../../models/tasks.model';
import { TasksService } from '../../services/tasks.service';
import { ListsService } from '../../services/lists.service';
import { 
  Router,
  ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TasksService,
              ListsService]
})

export class TasksComponent implements OnInit {
  tasks: Tasks[] = new Array<Tasks>();;
  dones: Tasks[];
  newTask: Tasks = new Tasks();
  listId: number;
  listTitle: string;
  error: any;
  isReady = false;

  constructor(
    private tasksService: TasksService,
    private listsService: ListsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getAllTasksByListId();
  }

  getAllTasksByListId(){
    this.route.params
        .subscribe(params => {
          this.listId = +params.id;
          this.tasksService.getListTitle(this.listId)
              .then(title =>{
                this.listTitle = title;
                console.log(this.listTitle);
              })
          this.tasksService.getAllTasksByListId(this.listId)
              .then(t => {
                    this.tasks = t;
                    this.dones = this.tasks.filter(v => v.complete);
                    this.tasks = this.tasks.filter(v => !v.complete);
                    this.isReady = true;
              })
              .catch(error => this.error = error);
       })
  }

  addTask() {
    this.newTask.list_id = this.listId;
    this.newTask.complete = false;
    this.tasksService.addTask(this.newTask)
          .then(res => {
              if (res.ok){
                          this.newTask.id = JSON.parse(res.text()).id;
                          this.tasks.push(this.newTask);
                        }
              this.newTask = new Tasks();
          });
    
  }

  toggleTaskComplete(task) {
    this.tasksService.toggleTaskComplete(task)
              .then(res => {
                if (res.ok){
                  task.complete = true;
                  this.dones.push(task);
                  console.log(res, this.dones);
                  this.tasks = this.tasks.filter(v => v.id !== task.id);
                }});
  }

  removeTask(task) {
    this.tasksService.deleteTaskById(task.id)
            .then(() => {
              this.dones = this.dones.filter(v => v.id !== task.id);
            });
  }

  markAllDone(){
    this.tasksService.markAllDone(this.listId)
            .then(res => {
              if (res.ok) {
                this.tasks.map(v => {
                  v.complete = true;
                  this.dones.push(v);
                });
                this.tasks = [];
              }
            });
  }

}
