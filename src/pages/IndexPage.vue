<template>
  <q-page class='row'>
    <div id='chat_settings' class='column no-wrap col-12 col-md q-pa-md'>
      <q-form @submit="set_chat_title" class='row'>
        <q-input v-model='chat_title' label='Chat Title' type='text' class='full-width'></q-input>
      </q-form>
      <q-form @submit='set_chat_settings' class='column no-wrap'>
        <q-select v-model='chat_settings.model' label='Model' :options='models'></q-select>

        <div>
          <q-item-label header class='q-pl-none q-pb-none'>Temperature</q-item-label>
          <q-slider v-model='chat_settings.temperature' label :min='0' :max='2' :step='0.1' :marker-labels='[
            {value: 0},
            {value: 0.5},
            {value: 1},
            {value: 1.5},
            {value: 2},
            {},
          ]'></q-slider>
        </div>

        <div>
          <q-item-label header class='q-pl-none q-pb-none'>Top P</q-item-label>
          <q-slider v-model='chat_settings.top_p' label :min='0' :max='1' :step='0.05' :marker-labels='[
            {value: 0},
            {value: 0.25},
            {value: 0.5},
            {value: 0.75},
            {value: 1},
            {},
          ]'></q-slider>
        </div>

        <div>
          <q-item-label header class='q-pl-none q-pb-none'>Max Tokens</q-item-label>
          <q-slider v-model='chat_settings.max_tokens' label :min='1' :max='2048' :step='1' :marker-labels='[
            {value: 1},
            {value: 512},
            {value: 1024},
            {value: 1024+512},
            {value: 2048},
          ]'></q-slider>
        </div>

        <div>
          <q-item-label header class='q-pl-none q-pb-none'>Presence Penalty</q-item-label>
          <q-slider v-model='chat_settings.presence_penalty' label :min='-2' :max='2' :step='0.1' :marker-labels='[
            {value: -2},
            {value: -1},
            {value: 0},
            {value: 1},
            {value: 2},
            {},
          ]'></q-slider>
        </div>

        <div>
          <q-item-label header class='q-pl-none q-pb-none'>Frequency Penalty</q-item-label>
          <q-slider v-model='chat_settings.frequency_penalty' label :min='-2' :max='2' :step='0.1' :marker-labels='[
            {value: -2},
            {value: -1},
            {value: 0},
            {value: 1},
            {value: 2},
            {},
          ]'></q-slider>
        </div>
      </q-form>
    </div>
    <div id='chat_messages' class='col-12 col-md full-height column no-wrap justify-between items-center q-pa-md'>
      <div class='same-width flex-0-0-auto'>
        <q-input type='textarea' v-model='system_prompt' label='System Prompt' />
      </div>
      <div class="same-width flex-1-1-auto">
        <div class='col full-width'>
          <div v-for="(message, idx) in messages" :key="idx">
            <div v-if="message.role === 'user'" class='row items-baseline'>
              <div class='q-pr-sm pt-20px'>{{ message.name ?? 'User' }} : </div>
              <pre class="user-message col">{{ message.content }}</pre>
              <q-btn icon='edit' flat round class='q-ml-xs'></q-btn>
            </div>
            <div v-else-if="message.role === 'assistant'" class='row items-baseline'>
              <div class='q-pr-sm pt-20px'>Assistant :</div>
              <pre class="assistant-message">{{ message.content }}</pre>
            </div>
          </div>
        </div>
      </div>
      <div class='same-width flex-0-0-auto'>
        <q-form @submit="send_prompt" class='row full-width'>
          <q-input ref="user_prompt_input" type="textarea" v-model="user_prompt" label="Type a prompt..." class='col' :disable='is_user_prompt_disabled' @keydown.ctrl.enter="send_prompt" />
          <q-btn v-if='!loading' type="submit" icon='send' class='col-auto' flat :disable='is_user_prompt_disabled' />
          <q-btn v-else icon='loop' class='col-auto rotate' flat :disable='is_user_prompt_disabled' />
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {ChatSettings, Message, Model} from 'components/models';
import {useStore} from 'stores/store';
import {send_prompt_to_api} from 'src/openai';

const store = useStore();

const current_chat_id = computed(() => store.current_chat_id);

const chat_settings = ref<ChatSettings>(store.current_chat_settings);
watch(chat_settings, set_chat_settings)
function set_chat_settings() {
  store.set_chat_settings(chat_settings.value);
}

const messages = computed<Message[]>(() => store.current_messages);
const models = computed<Model[]>(() => store.models);

const chat_title = ref<string>(store.current_chat);
function set_chat_title() {
  store.edit_chat_title(chat_title.value);
}

// Refresh values when changing chats
watch(current_chat_id, () => {
  chat_title.value = store.current_chat
  chat_settings.value = store.current_chat_settings
});

const system_prompt = ref<string>(messages.value[0].content);
watch(system_prompt, store.edit_system_message);
watch(current_chat_id, () => {
  system_prompt.value = messages.value[0].content
});

const user_prompt = ref<string>('');
const is_user_prompt_disabled = ref<boolean>(false);
const loading = ref<boolean>(false);

function add_message(role: 'system' | 'user' | 'assistant', content: string, name: string|undefined = undefined) {
  store.add_message(role, content, name);
}

const user_prompt_input = ref<HTMLInputElement>();

async function send_prompt() {
  if (user_prompt.value.trim() === '')
    return;
  const prompt = user_prompt.value;
  add_message('user', prompt);
  user_prompt.value = '';
  is_user_prompt_disabled.value = true;
  loading.value = true;
  // TODO : Make the api call to OpenAI
  const response = await send_prompt_to_api();
  if (response !== undefined)
    add_message('assistant', response);
  is_user_prompt_disabled.value = false;
  loading.value = false;
  user_prompt_input.value?.focus();
}

onMounted(async () => {
  console.log('On Mounted');
})
</script>

<style lang='scss'>
.q-page {
  height: calc(100vh - 50px);
}
.user-message {
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0;
  align-self: flex-end;
}
.assistant-message {
  background-color: #f1f0f0;
  color: #000;
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0;
}
.same-width {
  width: 100%;
  max-width: 1100px;
}
.pt-20px {
  padding-top: 20px;
}
.flex-0-0-auto {
  flex: 0 0 auto; /* Allow the div to be sized to its content */
  height: auto;
}
.flex-1-1-auto {
  flex: 1 1 auto; /* Allow the div to be sized to its content */
  overflow: auto;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.rotate .q-icon {
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>
