export interface EssentialLinkProps {
  id: number,
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string|undefined;
}

export interface ChatMessages {
  [key: number]: Message[]
}

export type Model = 'gpt-3.5-turbo' | 'gpt-4';

export interface ChatSettings {
  model: Model,
  temperature: number,
  top_p: number,
  max_tokens: number,
  presence_penalty: number,
  frequency_penalty: number,
}

export interface AllChatSettings {
  [key: number]: ChatSettings,
}

export interface Store {
  api_key: string,
  api_key_verified: boolean,
  models: Model[],
  chats: EssentialLinkProps[],
  current_chat_id: number,
  chat_messages: ChatMessages,
  chat_settings: AllChatSettings,
}
