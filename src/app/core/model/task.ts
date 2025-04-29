import { Timestamp } from '@angular/fire/firestore';

export interface task<T> {
  ProjectID: string;
  id: string;
  title: string;
  description: string;
  contributeur?: number;
  createAt: T;
  updateDate: T;
  edited: boolean;
  state: 'ToDo' | 'InProgress' | 'Done';
}
