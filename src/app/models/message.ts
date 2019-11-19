export class Message {
  _id: string;
  conversationId: string;
  body: string;
  author: {_id: string, prenom: string, nom: string, image: string, id: string };
}
