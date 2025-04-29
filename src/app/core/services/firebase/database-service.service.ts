import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  FieldValue,
  Firestore,
  getDocs,
  or,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { signOut, User } from 'firebase/auth';
import { Projet } from '../../model/projet';
import { getDoc, orderBy, Timestamp } from 'firebase/firestore';
import { task } from '../../model/task';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseServiceService {
  fs = inject(Firestore);
  ProjetCollectionRef = 'ProjetData';
  createID = (colName: string) => doc(collection(this.fs, colName)).id;
  getProjetbyID = (id: string) => {
    const DocRef = doc(this.fs, this.ProjetCollectionRef, id);
    return getDoc(DocRef);
  };
  // Fetch User project or contributeur project
  getProjet(user: User) {
    const collectionRef = collection(this.fs, this.ProjetCollectionRef);
    const querySalle = query(
      collectionRef,
      or(
        where('ownerID', '==', user.uid),
        where('contributeurs', 'array-contains', user.email)
      ),
      orderBy('updateAt', 'desc')
    );
    return collectionData(querySalle);
  }
  //set Projet
  setDataToFirestore(p: Projet<FieldValue>) {
    const collectionRef = collection(this.fs, this.ProjetCollectionRef);
    const salleDocRef = doc(collectionRef, p.id);
    return setDoc(salleDocRef, p, { merge: true });
  }
  // set task

  // task collection Reference
  taskCol = (projectId: string) =>
    `${this.ProjetCollectionRef}/${projectId}/task`;

  setTaskToFirestore(projectId: string, t: task<FieldValue>) {
    const collectionRef = collection(this.fs, this.taskCol(projectId));
    const salleDocRef = doc(collectionRef, t.id);
    return setDoc(salleDocRef, t, { merge: true });
  }
  // get Task
  getTask(projectId: string, column: 'ToDo' | 'InProgress' | 'Done') {
    const todoColRef = collection(this.fs, this.taskCol(projectId));
    let Tasks: task<Timestamp>[] = [] as task<Timestamp>[];
    getDocs(todoColRef).then((tasks) => {
      tasks.docs.forEach((element: any) => {
        if (element.data().state === column) {
          Tasks.push(element.data());
        }
      });
    });
    return of(Tasks);
  }
  // delete docs
  deleteData(colName: string, id: string) {
    return deleteDoc(doc(this.fs, colName, id));
  }

  // change formated Timestamp in  normal date
  formatedTimestamp = (t?: Timestamp) => (t?.seconds ? t.toDate() : new Date());
}
