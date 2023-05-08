<template>
  <q-item
    clickable
    target="_top"
    @click='set_current_chat_id'
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import {useStore} from 'stores/store';

interface EssentialLinkProps {
  id: number;
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
}

const store = useStore();

const props = withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});

function set_current_chat_id() {
  store.set_current_chat_id(props.id);
}
</script>
