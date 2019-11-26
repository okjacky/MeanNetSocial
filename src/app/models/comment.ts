export class Comment {
  _id: string;
  date: Date;
  mine?: boolean;
  author: {_id: string, prenom: string, nom: string, image: string, userId: string };
  body: string;
  wasteId: string;
  like: [{_id: string, userId: string, userNom: string, image: string}];
  success: Boolean;
}
