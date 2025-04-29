import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { task } from '../../../../core/model/task';
import { FieldValue, Timestamp } from 'firebase/firestore';
import { DatabaseServiceService } from '../../../../core/services/firebase/database-service.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './task-component/add-task.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { DeleteTaskComponent } from './task-component/delete-task.component';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-task',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatProgressBarModule,
    MatDividerModule,
    MatChipsModule,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-content>
        <div
          style="margin-bottom:0.5rem;display: flex;justify-content:space-between;align-items:center"
        >
          <span>{{ taskData().title }}</span>
          @if(isAdmin()){
          <div
            style="display: flex;justify-content:space-between;align-items:center"
          >
            <div
              style="display:flex;align-items:center;justify-content:center;gap:0.5rem"
            >
              <mat-icon
                (click)="editSalle(taskData)"
                style="cursor:pointer"
                class="mat-18"
                >edit</mat-icon
              >
              <mat-icon
                (click)="DeleteTask(taskData().ProjectID, taskData().id)"
                style="color:var(--mat-sys-tertiary);cursor:pointer"
                class="mat-18"
                >delete</mat-icon
              >
            </div>
          </div>
          }
        </div>
        <mat-divider></mat-divider>
        <p style="font-weight:600;font-size:14px;color:gray">
          {{ taskData().description }}
        </p>

        <mat-divider />
        <div style="margin-top:0.5rem; font-size:14px">
          <span>{{ changeDate(taskData().updateDate) | date }}</span>
          @if(taskData().edited){
          <span> | Modifier</span>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `

/*
    p{
     display: -webkit-box;  Définit le conteneur pour le line-clamp
     /* -webkit-line-clamp: 2; /* Nombre de lignes à afficher
     /* -webkit-box-orient: vertical; /* Orientation des lignes
     /* overflow: hidden; /* Cache le contenu dépassant
     /* font-weight:400;
     /* font-size:15px;
}
     */
mat-icon{
  font-size:20px;
}
mat-card{
  min-height:180px;
  max-width:300px;
}
  `,
})
export class TaskComponent {
  taskData = input.required<task<Timestamp>>();
  @Output() TaskEvent = new EventEmitter();
  Mat_Dialog = inject(MatDialog);
  isAdmin = input.required<Boolean>();
  db = inject(DatabaseServiceService);
  changeDate(data: Timestamp) {
    const dates = this.db.formatedTimestamp(data);
    return dates;
  }
  editSalle(data: any) {
    this.Mat_Dialog.open(AddTaskComponent, {
      data: data,
    })
      .afterClosed()
      .subscribe(() => this.TaskEvent.emit());
  }
  DeleteTask(projectID: string, id: string) {
    this.Mat_Dialog.open(DeleteTaskComponent, {
      data: {
        projectID,
        id,
      },
    })
      .afterClosed()
      .subscribe(() => this.TaskEvent.emit());
  }
}
