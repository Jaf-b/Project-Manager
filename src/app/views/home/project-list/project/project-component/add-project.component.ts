import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatabaseServiceService } from '../../../../../core/services/firebase/database-service.service';
import { MatIconModule } from '@angular/material/icon';
import { Projet } from '../../../../../core/model/projet';
import { FieldValue, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../../../core/services/firebase/authentication.service';
import { User } from 'firebase/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-project',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  template: `
    <h1 style="font-weight:700;" matDialogTitle>
      {{ ISdata ? 'Modifier Votre Projet' : 'Ajouter un Projet ' }}
    </h1>
    <mat-divider />
    <form [formGroup]="AddProjectForm" (ngSubmit)="onSubmitForm()">
      <mat-dialog-content>
        @let controls = AddProjectForm.controls;
        <mat-form-field style="margin-top:1rem;" appearance="outline">
          <mat-label>Nom du projet</mat-label>
          <input
            formControlName="Name"
            placeholder="ex:gestion de centre hospitalier"
            type="text"
            maxlength="200"
            matInput
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
            style="height:110px;"
            name=""
            maxlength="500"
            matInput
          ></textarea>
          @if (controls.Description.hasError("required")) {
          <mat-error>le champ est requis</mat-error>
          }
          <mat-hint>{{ controls.Description.value.length }}/500</mat-hint>
        </mat-form-field>
        <mat-form-field style="margin-top:0.1rem;" appearance="outline">
          <mat-label>Budget</mat-label>
          <input
            formControlName="Budget"
            placeholder="ex:5000$"
            type="text"
            maxlength="15"
            matInput
          />
          @if (controls.Budget.hasError("required")) {
          <mat-error>le champ est requis</mat-error>
          }@else if (controls.Budget.hasError("pattern")) {
          <mat-error>saisir que des chiffres</mat-error>
          }
          <mat-hint>{{ controls.Name.value.length }}/15</mat-hint>
        </mat-form-field>
        <div style="display: flex;gap:1rem;width:100%">
          <mat-form-field style="margin-top:0.1rem;flex:1" appearance="outline">
            <mat-label>Durée</mat-label>
            <input
              formControlName="Duree"
              placeholder="ex:5"
              type="text"
              matInput
              maxlength="4"
            />
            @if (controls.Duree.hasError("required")) {
            <mat-error>le champ est requis</mat-error>
            }@else if (controls.Duree.hasError("pattern")) {
            <mat-error>saisir que des chiffres</mat-error>
            }
            <mat-hint>{{ controls.Duree.value.length }}/4</mat-hint>
          </mat-form-field>
          <mat-form-field style="margin-top:0.1rem;" appearance="outline">
            <mat-label>temps</mat-label>
            <mat-select formControlName="Time">
              <mat-option value="days">Jours</mat-option>
              <mat-option value="month">Mois</mat-option>
              <mat-option value="years">Année</mat-option>
            </mat-select>
            @if (controls.Time.hasError("required")) {
            <mat-error>le champ est requis</mat-error>
            }
          </mat-form-field>
        </div>
        <div class="contributeur" formArrayName="contributors">
          <h3 style="text-align: left">contributeurs</h3>
          @for (item of controls.contributors.controls; track $index) {
          <div style="display:flex; gap: 1rem">
            <mat-form-field
              style="flex:1;margin-bottom:0.75rem"
              appearance="outline"
            >
              <mat-label>Contributeurs</mat-label>
              <input
                maxlength="150"
                [formControlName]="$index"
                placeholder="ex:jafred@gmail.com"
                type="text"
                matInput
              />
              <mat-hint
                >{{
                  controls.contributors.controls[$index].value.length
                }}/150</mat-hint
              >
              @if (controls.contributors.controls[0].hasError("required")) {
              <mat-error>le champ est requis</mat-error>
              }
            </mat-form-field>
            @if($index !== 0){
            <button
              type="button"
              mat-icon-button
              (click)="DeleteContributeur($index)"
            >
              <mat-icon>delete</mat-icon>
            </button>
            }
          </div>
          } @if(controls.contributors.controls.length <= 5){
          <button type="button" mat-button (click)="AddContributeurs()">
            <mat-icon>add_circle_outline</mat-icon> contributeurs
          </button>
          }
        </div>
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
        <button
          type="submit"
          style="font-weight:700;"
          type="submit"
          mat-flat-button
        >
          {{ ISdata ? 'Modifier' : 'Ajouter ' }}
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
export class AddProjectComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.USERsuscribe.unsubscribe();
  }
  ngOnInit(): void {
    if (this.data) {
      this.ISdata = true;
      this.AddProjectForm.patchValue(this.data);
      this.DeleteContributeur(0);
      this.data.contributeurs.forEach((contributor) => {
        const formControl = this.fb.nonNullable.control(contributor);
        this.AddProjectForm.controls.contributors.push(formControl);
      });
    }
    this.USERsuscribe = this.USER.subscribe((user: any) => {
      this.USERData = user;
    });
  }
  ISdata = false;
  constructor(@Inject(MAT_DIALOG_DATA) private data: Projet<Timestamp>) {}
  USERsuscribe!: Subscription;
  Dialog = inject(MatDialog);
  snackbar = inject(MatSnackBar);
  USERData!: User;
  USER = inject(AuthenticationService).user;
  fb = inject(FormBuilder);
  db = inject(DatabaseServiceService);
  AddProjectForm = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    Description: ['', Validators.required],
    Budget: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    Duree: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    Time: ['', [Validators.required]],
    contributors: this.fb.nonNullable.array([
      this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    ]),
  });
  onSubmitForm() {
    this.AddProjectForm.markAllAsTouched();
    if (this.AddProjectForm.valid) {
      if (this.data) {
        const data = this.AddProjectForm.getRawValue();
        const projetData: Projet<FieldValue> = {
          id: this.data.id,
          ownerID: this.data.ownerID,
          ownerEmail: this.data.ownerEmail,
          Name: data.Name,
          Description: data.Description,
          Budget: data.Budget,
          Duree: data.Duree,
          Time: data.Time,
          contributeurs: data.contributors,
          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        };
        this.Dialog.closeAll();
        this.db.setDataToFirestore(projetData).then(() => {
          this.snackbar.open('Projet Modifier avec succès', 'ok', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 5,
          });
        });
      } else {
        const data = this.AddProjectForm.getRawValue();
        const id = this.db.createID('ProjetData');
        const projetData: Projet<FieldValue> = {
          id: id,
          ownerID: this.USERData.uid,
          ownerEmail: this.USERData.email!,
          Name: data.Name,
          Description: data.Description,
          Budget: data.Budget,
          Duree: data.Duree,
          Time: data.Time,
          contributeurs: data.contributors,
          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        };
        this.Dialog.closeAll();
        this.db.setDataToFirestore(projetData).then(() => {
          this.snackbar.open('Projet creer avec succès', 'ok', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 5,
          });
        });
      }
    }
  }
  AddContributeurs() {
    const control = this.fb.nonNullable.control('', Validators.email);
    this.AddProjectForm.controls.contributors.push(control);
  }
  DeleteContributeur(index: number) {
    this.AddProjectForm.controls.contributors.removeAt(index);
  }
}
