import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseServiceService } from '../../../../../core/services/firebase/database-service.service';
import { Projet } from '../../../../../core/model/projet';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-project',
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  template: `
    <mat-dialog-content>
      <div
        style="display: flex;justify-content:center;align-items:center;gap:1rem"
      >
        <mat-icon class="mat-18">warning</mat-icon>
        <span>Voulez-vous réelement supprimer ce Projet ?</span>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button matDialogClose>Annuler</button>
      <button mat-flat-button matDialogClose (click)="deleteProject()">
        confirmer
      </button>
    </mat-dialog-actions>
  `,
  styles: ``,
})
export class DeleteProjectComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private data: Projet<Timestamp>) {}
  db = inject(DatabaseServiceService);
  snackbar = inject(MatSnackBar);
  router = inject(Router);
  deleteProject() {
    const projectID = this.data.id;
    const colName = this.db.ProjetCollectionRef;
    this.db.deleteData(colName, projectID).then(() => {
      this.router.navigate(['/home/acceuil']);
      this.snackbar.open('Projet supprimer avec succès', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 5,
      });
    });
  }
}
