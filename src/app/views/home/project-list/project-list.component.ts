import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ProjectComponent } from './project/project.component';
import { AddProjectComponent } from './project/project-component/add-project.component';
import { DatabaseServiceService } from '../../../core/services/firebase/database-service.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../core/services/firebase/authentication.service';
import { User } from 'firebase/auth';
import { Projet } from '../../../core/model/projet';
import { FieldValue, Timestamp } from 'firebase/firestore';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-project-list',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    ProjectComponent,
  ],
  template: `
    <div class="container">
      <div class="div">
        <h1>Projets</h1>
        <button mat-flat-button (click)="OnOpenDialog()">
          Ajouter un projet
        </button>
      </div>
      <div style="display: flex;gap:1rem;flex-wrap:wrap;justify-content:center">
        @for (project of projectList; track $index) {
        <a (click)="LoadProject(project.id)">
          <app-project [project]="project" style="cursor:pointer" />
        </a>
        }@empty {
        <span style="text-align: center;">Veuillez ajouter un projet </span>
        }
      </div>
    </div>
  `,
  styles: `
  button{
    height:50px;
    font-weight:600;
  }
  .div{
    align-items:center;
    justify-content: space-between;
  }
div{
  display:flex;
  gap : 0.5rem;
  margin:0.5rem 1rem;
}
.container{
  display:flex;
  flex-direction:column;
  margin:auto;
  min-width:auto;
  max-width:1024px;
}
a{
  text-decoration:none;
  color:inherit;
}

  `,
})
export default class ProjectListComponent implements OnInit {
  ngOnInit(): void {
    this.dbAuthUserSuscribe = this.auth.user.subscribe((user: any) => {
      if (user) {
        this.db.getProjet(user).subscribe((project: any) => {
          this.projectList = project;
        });
      }
    });
  }
  projectList!: Projet<Timestamp>[];
  dbAuthUserSuscribe!: Subscription;
  router = inject(Router);
  db = inject(DatabaseServiceService);
  auth = inject(AuthenticationService);
  Mat_Dialog = inject(MatDialog);
  OnOpenDialog() {
    this.Mat_Dialog.open(AddProjectComponent, {
      disableClose: true,
      width: '35rem',
    });
  }
  LoadProject(id: string) {
    this.router.navigate([`home/projet/${id}`]);
  }
}
