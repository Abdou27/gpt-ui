<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          GPT UI By Rahim
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Credentials
        </q-item-label>

        <q-form @submit="set_api_key" class='row full-width q-pl-md'>
          <q-input v-model='api_key' label='API Key' type='password' class='col' dense>
            <template v-slot:append>
              <q-icon name='verified' v-if='verified' />
              <q-icon name='error' v-else />
            </template>
          </q-input>
          <q-btn type='submit' icon='sync' flat />
        </q-form>
      </q-list>

      <q-list class='q-pt-lg'>
        <q-item class=' justify-between'>
          <q-item-label
            header
            class='q-pl-none'
          >
            Chat History
          </q-item-label>
          <q-btn flat color='primary' icon='add' @click='new_chat'>New Chat</q-btn>
        </q-item>


        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useStore } from 'stores/store';
import {EssentialLinkProps} from 'components/models';

const store = useStore();

const current_chat_id = computed(() => store.current_chat_id);
const api_key = ref<string>(store.api_key);
const verified = computed(() => store.api_key_verified);

const essentialLinks: EssentialLinkProps[] = store.chats;

store.$subscribe(((mutation, state) => {
  console.log('Saving store in local storage');
  localStorage.setItem('store', JSON.stringify(state));
}))

const leftDrawerOpen = ref<boolean>(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function set_api_key() {
  store.set_api_key(api_key.value);
}

function new_chat() {
  store.create_new_chat();
}
</script>
