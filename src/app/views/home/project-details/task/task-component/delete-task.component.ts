import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DatabaseServiceService } from '../../../../../core/services/firebase/database-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-task',
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  template: `
    <mat-dialog-content>
      <div
        style="display: flex;justify-content:center;align-items:center;gap:1rem"
      >
        <mat-icon class="mat-18">warning</mat-icon>
        <span>Voulez-vous réelement supprimer cette tâche ?</span>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button matDialogClose>Annuler</button>
      <button mat-flat-button matDialogClose (click)="deleteTask()">
        confirmer
      </button>
    </mat-dialog-actions>
  `,
  styles: ``,
})
export class DeleteTaskComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {}
  db = inject(DatabaseServiceService);
  snackbar = inject(MatSnackBar);
  deleteTask() {
    const projectID = this.data.projectID;
    const id = this.data.id;
    const colName = this.db.taskCol(projectID);
    this.db.deleteData(colName, id).then(() => {
      this.snackbar.open('Tâche supprimer avec succès', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 5,
      });
    });
  }
}
