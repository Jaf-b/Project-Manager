import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { task } from '../../../core/model/task';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './task/task-component/add-task.component';
import { DatabaseServiceService } from '../../../core/services/firebase/database-service.service';
import { FieldValue, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Title } from '@angular/platform-browser';
import { columnDetails } from '../../../core/model/columnDetails';
import { CambanColumnComponent } from './camban-column/camban-column.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthenticationService } from '../../../core/services/firebase/authentication.service';
import { Projet } from '../../../core/model/projet';
import { Subscription } from 'rxjs';
import { WindowsService } from '../../../core/services/utilities/windows.service';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-project-details',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    CdkDropList,
    CambanColumnComponent,
    ProjectDashboardComponent,
    MatTabsModule,
  ],
  template: `
    @if(width() < 720){
    <mat-tab-group [disableRipple]="false">
      <mat-tab label="Dashbord">
        <app-project-dashboard
          [DoneTask]="doneTask.length"
          [InProgressTask]="inProgressTask.length"
          [ToDoTask]="todoTask.length"
          [project]="project"
          [IsAdmin]="isAdmin"
          [Progression]="
            (doneTask.length /
              (doneTask.length + inProgressTask.length + todoTask.length)) *
            100
          "
        />
      </mat-tab>
      <mat-tab label="A Faire">
        <mat-card
          appearance="outlined"
          style="max-width: 370px;margin:1rem auto"
        >
          <app-camban-column
            (close)="reload()"
            [columnDetails]="columnDetails[0]"
            cdkDropList
            id="ToDo"
            #ToDo="cdkDropList"
            cdkDropListAutoScrollDisabled
            [ListOfTask]="todoTask"
            [cdkDropListData]="todoTask"
            (cdkDropListDropped)="drop($event)"
            (open)="OnOpenDialog()"
            [cdkDropListConnectedTo]="[InProgress, Done]"
            [isAdmin]="isAdmin"
          />
        </mat-card>
      </mat-tab>
      <mat-tab label="Encours">
        <mat-card
          appearance="outlined"
          style="max-width: 370px;margin:1rem auto"
        >
          <app-camban-column
            (close)="reload()"
            [columnDetails]="columnDetails[1]"
            cdkDropList
            id="InProgress"
            #InProgress="cdkDropList"
            [ListOfTask]="inProgressTask"
            cdkDropListAutoScrollDisabled
            [cdkDropListData]="inProgressTask"
            (cdkDropListDropped)="drop($event)"
            [cdkDropListConnectedTo]="[ToDo, Done]"
            [isAdmin]="isAdmin"
          />
        </mat-card>
      </mat-tab>
      <mat-tab label="Terminées">
        <mat-card
          appearance="outlined"
          style="max-width: 370px;margin:1rem auto"
        >
          <app-camban-column
            (close)="reload()"
            [columnDetails]="columnDetails[2]"
            [isAdmin]="isAdmin"
            [ListOfTask]="doneTask"
            cdkDropList
            id="Done"
            #Done="cdkDropList"
            cdkDropListAutoScrollDisabled
            [cdkDropListData]="doneTask"
            (cdkDropListDropped)="drop($event)"
            [cdkDropListConnectedTo]="[InProgress, ToDo]"
          />
        </mat-card>
      </mat-tab>
    </mat-tab-group>
    }@else {
    <mat-card
      style="height:250px;width:1100px;margin:auto;border:none"
      appearance="outlined"
    >
      <app-project-dashboard
        [DoneTask]="doneTask.length"
        [InProgressTask]="inProgressTask.length"
        [ToDoTask]="todoTask.length"
        [project]="project"
        [IsAdmin]="isAdmin"
        [Progression]="
          (doneTask.length /
            (doneTask.length + inProgressTask.length + todoTask.length)) *
          100
        "
      />
    </mat-card>
    <div class="container">
      <mat-card appearance="outlined">
        <app-camban-column
          (close)="reload()"
          [columnDetails]="columnDetails[0]"
          cdkDropList
          id="ToDo"
          #ToDo="cdkDropList"
          cdkDropListAutoScrollDisabled
          [ListOfTask]="todoTask"
          [cdkDropListData]="todoTask"
          (cdkDropListDropped)="drop($event)"
          (open)="OnOpenDialog()"
          [cdkDropListConnectedTo]="[InProgress, Done]"
          [isAdmin]="isAdmin"
        />
      </mat-card>
      <mat-card appearance="outlined">
        <app-camban-column
          (close)="reload()"
          [columnDetails]="columnDetails[1]"
          cdkDropList
          id="InProgress"
          #InProgress="cdkDropList"
          [ListOfTask]="inProgressTask"
          cdkDropListAutoScrollDisabled
          [cdkDropListData]="inProgressTask"
          (cdkDropListDropped)="drop($event)"
          [cdkDropListConnectedTo]="[ToDo, Done]"
          [isAdmin]="isAdmin"
        />
      </mat-card>
      <mat-card appearance="outlined">
        <app-camban-column
          (close)="reload()"
          [columnDetails]="columnDetails[2]"
          [isAdmin]="isAdmin"
          [ListOfTask]="doneTask"
          cdkDropList
          id="Done"
          #Done="cdkDropList"
          cdkDropListAutoScrollDisabled
          [cdkDropListData]="doneTask"
          (cdkDropListDropped)="drop($event)"
          [cdkDropListConnectedTo]="[InProgress, ToDo]"
        />
      </mat-card>
    </div>
    }
  `,
  styles: `
  .container{
     display: flex;
     justify-content:center;
     align-items:center;
     margin-top:1rem;
      gap:1rem;

    }
   app-camban-column{
        width:350px;
        min-width:350px;
        height:100vh;
      }
      mat-card{
         overflow:auto;
      }

       mat-divider{
     color:var(--mat-sys-outline-variant);
  }

  `,
})
export default class ProjectDetailsComponent implements OnInit {
  ngOnInit(): void {
    this.UserSub = this.auth.authsTate.subscribe((user) => {
      this.getTask();
      if (user) {
        this.db.getProjet(user).subscribe((projet: any) => {
          const projectList = projet;
          projectList.forEach((el: Projet<Timestamp>) => {
            if (el.id === this.id()) {
              this.title.setTitle(el.Name);
              this.project = el;
              this.isAdmin = el.ownerEmail.includes(user.email!);
            }
          });
        });
      }
    });
  }
  private title = inject(Title);
  auth = inject(AuthenticationService);
  db = inject(DatabaseServiceService);
  UserSub = new Subscription();
  project: Projet<Timestamp> = {} as Projet<Timestamp>;
  todoTask: task<Timestamp>[] = [];
  inProgressTask: task<Timestamp>[] = [];
  doneTask: task<Timestamp>[] = [];
  width = inject(WindowsService).width;
  id = input(' ');
  isAdmin = false;
  columnDetails: columnDetails[] = [
    {
      name: 'A faire',
      description:
        "liste les activités à accomplir et s'assurer qu'aucune tâche n'est oubliée",
      buttonAdd: true,
    },
    {
      name: 'Encours',
      description:
        "affiche les activités qui sont actuellement en train d'être réalisées",
      buttonAdd: false,
    },
    {
      name: 'Terminées',
      description:
        'représente les activités qui ont été complétées avec succès',
      buttonAdd: false,
    },
  ];
  drop(event: CdkDragDrop<task<Timestamp>[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      let DragAndDropItem = event.container.data[event.currentIndex];
      const ContainerID = event.container.id;
      if (ContainerID === 'ToDo') {
        DragAndDropItem.state = 'ToDo';
      } else if (ContainerID === 'InProgress') {
        DragAndDropItem.state = 'InProgress';
      } else {
        DragAndDropItem.state = 'Done';
      }
      const updateTask: task<FieldValue> = {
        ...DragAndDropItem,
        updateDate: serverTimestamp(),
        edited: true,
      };
      this.db.setTaskToFirestore(DragAndDropItem.ProjectID, updateTask);
    }
  }
  Mat_Dialog = inject(MatDialog);
  OnOpenDialog() {
    this.Mat_Dialog.open(AddTaskComponent, {
      disableClose: true,
      data: this.id,
    })
      .afterClosed()
      .subscribe(() => location.reload());
  }
  getTask() {
    this.db.getTask(this.id(), 'ToDo').subscribe((taks: task<Timestamp>[]) => {
      this.todoTask = taks;
    });
    this.db
      .getTask(this.id(), 'InProgress')
      .subscribe((taks: task<Timestamp>[]) => {
        this.inProgressTask = taks;
      });
    this.db.getTask(this.id(), 'Done').subscribe((taks: task<Timestamp>[]) => {
      this.doneTask = taks;
    });
  }
  reload = () => this.getTask();
}
