export interface Projet<T> {
  id: string;
  Name: string;
  ownerID: string;
  ownerEmail: string;
  Description: string;
  Budget: string;
  Duree: string;
  Time: string;
  contributeurs: string[];
  createAt: T;
  updateAt: T;
}
