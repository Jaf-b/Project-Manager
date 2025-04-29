import { Component, Inject, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { task } from '../../../../../core/model/task';
import { FieldValue, serverTimestamp } from 'firebase/firestore';
import { DatabaseServiceService } from '../../../../../core/services/firebase/database-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-task',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  template: `
    <h1 style="font-weight:700;" matDialogTitle>
      {{ isModify ? 'Modifier un Projet' : 'Ajouter un Projet' }}
    </h1>
    <mat-divider />
    <form [formGroup]="AddTask" (ngSubmit)="OnsubmitTask()">
      @let controls = AddTask.controls;
      <mat-dialog-content>
        <mat-form-field style="margin-top:1rem;" appearance="outline">
          <mat-label>Nom de la tâche</mat-label>
          <input
            placeholder="ex:gestion de centre hospitalier"
            type="text"
            matInput
            formControlName="Name"
            maxlength="200"
          />
          <mat-hint>{{ controls.Name.value.length }}/200</mat-hint>
          @if (controls.Name.hasError('required')) {
          <mat-error>le champ est requis</mat-error>
          }
        </mat-form-field>
        <mat-form-field style="margin-top:0.1rem;" appearance="outline">
          <mat-label>description du projet</mat-label>
          <textarea
            formControlName="Description"
            style="height:110px"
            maxlength="500"
            name=""
            matInput
          ></textarea>
          <mat-hint>{{ controls.Description.value.length }}/500</mat-hint>
          @if (controls.Description.hasError('required')) {
          <mat-error>le champ est requis</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-divider />
      <mat-dialog-actions>
        <button
          type="button"
          style="font-weight:700;"
          mat-stroked-button
          matDialogClose
        >
          Fermer
        </button>
        <button style="font-weight:700;" type="submit" mat-flat-button>
          {{ isModify ? 'Modifier' : 'Ajouter' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
   form,mat-dialog-content{
    display:flex;
    gap:0.5rem;
    flex-direction: column;
  }
  `,
})
export class AddTaskComponent {
  isModify = false;
  snackbar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    if (this.data().id) {
      this.isModify = true;
      this.AddTask.controls.Description.patchValue(this.data().description);
      this.AddTask.controls.Name.patchValue(this.data().title);
    }
  }
  fs = inject(FormBuilder);
  db = inject(DatabaseServiceService);
  AddTask = this.fs.nonNullable.group({
    Name: ['', Validators.required],
    Description: ['', Validators.required],
  });

  OnsubmitTask() {
    this.AddTask.markAllAsTouched();
    if (this.AddTask.valid) {
      const FormData = this.AddTask.getRawValue();
      if (this.data().id) {
        const TaskData: task<FieldValue> = {
          ProjectID: this.data().ProjectID,
          id: this.data().id,
          title: FormData.Name,
          description: FormData.Description,
          createAt: this.data().createAt,
          updateDate: serverTimestamp(),
          edited: this.data().edited,
          state: this.data().state,
        };
        this.dialog.closeAll();
        this.db
          .setTaskToFirestore(TaskData.ProjectID, TaskData)
          .then((e) =>
            this.snackbar.open('Tâche Modifier avec succès', 'OK', {
              verticalPosition: 'top',
              horizontalPosition: 'right',
              duration: 5,
            })
          )
          .catch((e) => this.snackbar.open("Une erreur s'est produite"));
      } else {
        const id = this.db.createID('task');
        const TaskData: task<FieldValue> = {
          ProjectID: this.data(),
          id: id,
          title: FormData.Name,
          description: FormData.Description,
          createAt: serverTimestamp(),
          updateDate: serverTimestamp(),
          edited: false,
          state: 'ToDo',
        };
        this.dialog.closeAll();
        this.db
          .setTaskToFirestore(this.data(), TaskData)
          .then(() => {
            this.snackbar.open('Tâche Ajouter avec succès', 'ok', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 5,
            });
          })
          .catch((e) => this.snackbar.open("Une erreur s'est produite"));
      }
    }
  }
}
