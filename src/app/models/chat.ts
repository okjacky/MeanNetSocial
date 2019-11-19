export interface Chat {
  _id: string;
  mine?: boolean;
  author: string;
  body: string;
  conversationId: string;
  inChatRoom: boolean;
}
