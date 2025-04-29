import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TaskComponent } from '../task/task.component';
import { columnDetails } from '../../../../core/model/columnDetails';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { task } from '../../../../core/model/task';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-camban-column',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    TaskComponent,
    CdkDrag,
  ],
  template: `
    <mat-card-header style="margin-bottom: 0.1rem;">
      <mat-card-title
        style="display: flex;justify-content:space-between;align-items:center"
      >
        <div style="display: flex; align-items:center;gap:1rem">
          <mat-icon class="mat-18">radio_button_unchecked</mat-icon>
          <span>{{ columnDetails().name }}</span>
        </div>
        @if (columnDetails().buttonAdd) {
        <button mat-flat-button (click)="OpenDialogAddTask()">
          Ajouter une tâche
        </button>
        }
      </mat-card-title>
      <mat-card-subtitle style="font-size: 13px; font-weight:400">
        {{ columnDetails().description }}
      </mat-card-subtitle>
    </mat-card-header>
    <mat-divider />
    <mat-card-content style="margin-top:1rem">
      <div style="display: flex;flex-direction:column;gap:0.5rem">
        @for (task of ListOfTask(); track $index) {
        <app-task
          (TaskEvent)="closeTaskDialog()"
          [taskData]="task"
          [isAdmin]="isAdmin()"
          cdkDrag
        />
        }
      </div>
    </mat-card-content>
  `,
  styles: `

  `,
})
export class CambanColumnComponent {
  @Output() open = new EventEmitter();
  @Output() close = new EventEmitter();
  columnDetails = input.required<columnDetails>();
  isAdmin = input.required<Boolean>();
  ListOfTask = input.required<task<Timestamp>[]>();
  OpenDialogAddTask = () => this.open.emit();
  closeTaskDialog = () => this.close.emit();
}
