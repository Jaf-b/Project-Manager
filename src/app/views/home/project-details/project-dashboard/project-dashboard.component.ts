import { AfterViewInit, Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Projet } from '../../../../core/model/projet';
import { Timestamp } from 'firebase/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../../project-list/project/project-component/add-project.component';
import { DeleteProjectComponent } from '../../project-list/project/project-component/delete-project.component';

@Component({
  selector: 'app-project-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
    <div
      style="display:flex;gap:1rem;margin:auto;width:1100px;margin-top:1rem;"
    >
      <mat-card style="max-width:330px;height:210px" appearance="outlined">
        <mat-card-content>
          <div style="display: flex;flex-direction:column;gap:0.2rem">
            <span style="font-size:18px;font-weight:bold">{{
              project().Name
            }}</span>

            <mat-divider />
            <span class="description">
              {{ project().Description }}
            </span>
          </div>
          @if (IsAdmin()) {
          <div style="display:flex;justify-content:end">
            <button mat-icon-button (click)="EditProject()">
              <mat-icon style="cursor:pointer" class="mat-18">edit</mat-icon>
            </button>

            <button mat-icon-button (click)="DeleteProject(project())">
              <mat-icon style="color:var(--mat-sys-tertiary);" class="mat-18"
                >delete</mat-icon
              >
            </button>
          </div>
          }
        </mat-card-content>
      </mat-card>
      <mat-card style="width:220px;height:210px" appearance="outlined">
        <mat-card-content>
          <div style="display: flex;align-items:center">
            <mat-icon>task_alt</mat-icon>
            <span>Tâches</span>
          </div>
          <div>
            <div>
              <span style="font-size:30px">{{ DoneTask() }}</span>
              <button mat-button>terminées</button>
            </div>
            <div>
              <span style="font-size:30px">{{ InProgressTask() }}</span>
              <button mat-button>Encours</button>
            </div>
            <div>
              <span style="font-size:30px">{{ ToDoTask() }}</span>
              <button mat-button>A faire</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      <mat-card style="width:200px;height:210px" appearance="outlined">
        <mat-card-content
          style="display: flex;flex-direction:column;gap:0.5rem"
        >
          <span>Progression :</span>
          <div class="progressBar">
            @let ZeroTask = ToDoTask() === 0 && InProgressTask() === 0 &&
            DoneTask() === 0;
            <span style="font-size:50px">{{
              ZeroTask ? 0 : Progression()
            }}</span>
            <span>%</span>
          </div>
        </mat-card-content>
      </mat-card>
      <div style="display:flex;gap:0.5rem;flex-direction:column">
        <mat-card style="max-width:330px;height:100px" appearance="outlined">
          <mat-card-content>
            <div>
              <span>Budget</span>
              <div>
                <span style="font-size: 50px;">{{ project().Budget }}</span>
                <span>$ / </span>
                <span>for {{ project().Duree + ' ' + project().Time }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card style="max-width:330px;height:100px" appearance="outlined">
          <mat-card-content>
            <div>
              <span>Durée</span>
              <div>
                <span style="font-size: 50px;">{{ project().Duree }}</span>
                <span> {{ project().Time }}/ </span>
                <span>for All the project</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: `
  .description{
     display: -webkit-box; /* Définit le conteneur pour le line-clamp */
  -webkit-line-clamp: 6; /* Nombre de lignes à afficher */
  -webkit-box-orient: vertical; /* Orientation des lignes */
  overflow: auto; /* Cache le contenu dépassant */
  font-weight:600;
  color:gray;
  font-size:15px;
  }
  .progressBar{
    display:flex;
    justify-content:center;
    align-items:center;
    border-radius:100%;
    width: 130px;
    height:130px;
    border:8px solid var(--mat-sys-tertiary);
    border-left-color: #9f9fe9;
    border-top-color:#9f9fe9;
  }
  `,
})
export class ProjectDashboardComponent {
  project = input.required<Projet<Timestamp>>();
  ToDoTask = input.required<number>();
  InProgressTask = input.required<number>();
  DoneTask = input.required<number>();
  Progression = input.required<number>();
  dialog = inject(MatDialog);
  IsAdmin = input.required<boolean>();

  EditProject() {
    this.dialog.open(AddProjectComponent, {
      data: this.project(),
    });
  }
  DeleteProject(Project: Projet<Timestamp>) {
    this.dialog.open(DeleteProjectComponent, {
      data: Project,
    });
  }
}
