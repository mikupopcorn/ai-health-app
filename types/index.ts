export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  category?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document';
  url: string;
  name: string;
  size?: number;
}