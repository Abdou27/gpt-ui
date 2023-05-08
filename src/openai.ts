import {Configuration, OpenAIApi} from 'openai';
import {useStore} from 'stores/store';
const store = useStore();

export async function send_prompt_to_api(): Promise<string | undefined> {
  try {
    const chat_settings = store.current_chat_settings;
    const configuration = new Configuration({
      apiKey: store.api_key,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: chat_settings.model,
      messages: store.current_messages,
      temperature: chat_settings.temperature,
      top_p: chat_settings.top_p,
      max_tokens: chat_settings.max_tokens,
      presence_penalty: chat_settings.presence_penalty,
      frequency_penalty: chat_settings.frequency_penalty,
      stream: true,
    });
    console.log({completion});
    if (completion.data.choices[0].message === undefined)
      return undefined;
    return completion.data.choices[0].message.content;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
