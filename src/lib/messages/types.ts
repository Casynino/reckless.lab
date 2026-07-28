export type Sender = "customer" | "admin";

export interface Message {
  id: string;
  from: Sender;
  body: string;
  at: string; // ISO
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  /** Unread counts per side. */
  unreadAdmin: number;
  unreadCustomer: number;
}
