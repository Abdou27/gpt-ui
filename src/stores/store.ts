import { defineStore } from 'pinia';
import {Configuration, OpenAIApi} from 'openai';
import {ChatMessages, ChatSettings, EssentialLinkProps, Message, Store} from 'components/models';

const default_chat_message = {
  role: 'system',
  content: 'You are a helpful assistant',
} as Message;

const default_chat_settings = {
  model: 'gpt-3.5-turbo',
  temperature: 1,
  top_p: 1,
  max_tokens: 2048,
  presence_penalty: 0,
  frequency_penalty: 0,
} as ChatSettings;

export const useStore = defineStore('store', {
  state: () => {
    const saved_store = localStorage.getItem('store');
    if (saved_store)
      return JSON.parse(saved_store) as Store;
    else
      return {
        api_key: '' as string,
        api_key_verified: false as boolean,
        models: [
          'gpt-3.5-turbo',
          'gpt-4',
        ],
        chats: [
          {
            id: 1,
            title: 'Unnamed chat #1',
          },
        ] as EssentialLinkProps[],
        current_chat_id: 1 as number,
        chat_messages: {
          1: [
            {...default_chat_message} as Message,
          ],
        } as ChatMessages,
        chat_settings: {
          1: {...default_chat_settings} as ChatSettings,
        },
      } as Store;
  },
  getters: {
    current_messages: (state) : Message[] => state.chat_messages[state.current_chat_id],
    current_chat: (state) : string => state.chats.filter(x => x.id === state.current_chat_id)[0].title,
    current_chat_settings: (state) : ChatSettings => state.chat_settings[state.current_chat_id],
  },
  actions: {
    async set_api_key(new_key: string) {
      this.api_key = new_key;
      this.test_api_key();
    },
    async test_api_key() {
      let result;
      try {
        const configuration = new Configuration({
          apiKey: this.api_key,
        });
        const openai = new OpenAIApi(configuration);
        result = await openai.listModels();
      }
      catch (e) {
        console.error(e);
        result = null;
      }
      this.api_key_verified = result !== null && result.status === 200;
    },
    add_message(role: 'system' | 'user' | 'assistant', content: string, name: string|undefined = undefined) {
      const message: Message = {
        role,
        content,
        name,
      };
      this.chat_messages[this.current_chat_id].push(message);
    },
    edit_system_message(newVal: string, oldVal: string) {
      if (this.chat_messages[this.current_chat_id][0].content !== oldVal)
        return;
      this.chat_messages[this.current_chat_id][0].content = newVal;
    },
    create_new_chat() {
      const new_chat_id = ++this.current_chat_id;
      const new_chat = `Unnamed chat #${new_chat_id}`;
      this.chats.unshift({
        id: new_chat_id,
        title: new_chat,
      });
      this.chat_messages[new_chat_id] = [
        {...default_chat_message} as Message
      ];
      this.chat_settings[new_chat_id] = {...default_chat_settings} as ChatSettings;
    },
    set_current_chat_id(new_chat_id: number) {
      this.current_chat_id = new_chat_id;
    },
    edit_chat_title(new_chat_title: string) {
      this.chats.filter(x => x.id === this.current_chat_id)[0].title = new_chat_title;
    },
    set_chat_settings(new_settings: ChatSettings) {
      this.chat_settings[this.current_chat_id] = new_settings;
    },
  },
});

