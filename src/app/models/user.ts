export class User {
  id: string;
  _id: string;
  genre: string;
  pseudo: string;
  prenom: string;
  nom: string;
  email: string;
  isEmailValidated: Boolean;
  adresse: string;
  age: Number;
  online: Boolean;
  sendRequest: [{_id: string, userId: string, userNom: string, image: string}];
  request: [{_id: string, userId: string, userNom: string, image: string}];
  following: string[];
  followers: [{_id: string, userId: string}];
  presentation: string;
  preferences: string;
  password: string;
  image: string;
  role: string;
  date: string;
}
