export class Waste {
  _id: string;
  date: Date;
  mine?: boolean;
  author: {_id: string, prenom: string, nom: string, image: string, userId: string };
  title: string
  body: string;
  like: [{_id: string, userId: string, userNom: string, image: string}];
}

