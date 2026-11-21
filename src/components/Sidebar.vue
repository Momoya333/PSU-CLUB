<template>
  <q-drawer
    :model-value="modelValue"
    show-if-above
    bordered
    :width="240"
    :breakpoint="1024"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-list padding>
      <q-item
        v-for="item in menuList"
        :key="item.to"
        :to="item.to"
        :exact="item.to === '/'"
        clickable
        v-ripple
        active-class="menu-active"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
        <q-item-section v-if="item.badge" side>
          <q-badge color="primary" rounded>{{ item.badge }}</q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useCampusStore } from '@/stores/useCampusStore'
defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])
const { state } = useCampusStore()
const menuList = computed(() => {
  return [
    { label: 'Home Feed', icon: 'home', to: '/' },
    { label: 'Clubs & Societies', icon: 'groups', to: '/clubs' },
    {
      label: 'My Activities',
      icon: 'checklist',
      to: '/activities',
      badge: state.rsvp.length
    },
    {
      label: 'Saved Events',
      icon: 'bookmark_border',
      to: '/saved',
      badge: state.saved.length
    },
    { label: 'Settings', icon: 'settings', to: '/settings' }
  ]
})
</script>

<style scoped>
.menu-active {
  background-color: #eceff1;
  color: #0ea5e9;
  font-weight: bold;
}
</style>
