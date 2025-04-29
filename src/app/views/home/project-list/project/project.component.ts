import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Projet } from '../../../../core/model/projet';
import { FieldValue, Timestamp } from 'firebase/firestore';
import { DatabaseServiceService } from '../../../../core/services/firebase/database-service.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-project',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatProgressBarModule,
    DatePipe,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-content>
        <div style="display: flex;flex-direction:column;gap:0.5rem">
          <span style="font-size:15px;">{{ project().Name }}</span>
          <mat-divider />
          <p style="font-weight: 600;color:gray">
            {{ project().Description }}
          </p>
        </div>

        <div style="display: flex; margin-bottom:0.1rem">
          <button mat-button>
            {{ project().Duree }}
            <mat-icon class="mat-18">event</mat-icon>
          </button>
          <button mat-button>
            {{ project().Budget }}
            <mat-icon class="mat-18">credit_card</mat-icon>
          </button>
        </div>
        <mat-divider />
        <div
          style="display:flex;margin-top: 0.1rem; gap:1rem;align-items:center"
        >
          <button mat-button>
            <mat-icon class="mat-18">groups</mat-icon>
            {{ project().contributeurs.length }} contributeur
          </button>
          <span style=" font-weight:500;font-size:12px;">
            | {{ changeDate(project().createAt) | date }}</span
          >
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
  mat-card{
    width:300px;
    transition : 0.2s transform ease-in-out;
  }
  mat-card:hover{
    transform : scale(1.02)
  }
  mat-progress-bar{
    border-radius:100px;
  }
p{
  display: -webkit-box; /* Définit le conteneur pour le line-clamp */
  -webkit-line-clamp: 3; /* Nombre de lignes à afficher */
  -webkit-box-orient: vertical; /* Orientation des lignes */
  overflow: hidden; /* Cache le contenu dépassant */
  font-weight:400;
  font-size:15px;
}
.task-progress{
  display:flex;
  flex-direction:column;
  gap:0.5rem;
}

  `,
})
export class ProjectComponent {
  project = input.required<Projet<Timestamp>>();
  db = inject(DatabaseServiceService);
  changeDate(data: Timestamp) {
    const dates = this.db.formatedTimestamp(data);
    return dates;
  }
}
