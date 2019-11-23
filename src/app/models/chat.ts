export interface Chat {
  _id: string;
  created: Date;
  mine?: boolean;
  author: string;
  body: string;
  image: string;
  conversationId: string;
  inChatRoom: boolean;
}
