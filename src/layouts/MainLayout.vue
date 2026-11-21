<template>
  <q-layout
    view="hHh LpR lFf"
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'"
  >
    <Navbar @toggle-drawer="drawer = !drawer" />
    <Sidebar v-model="drawer" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useCampusStore } from '@/stores/useCampusStore'

const $q = useQuasar()
const drawer = ref(false)
const { fetchAll } = useCampusStore()

onMounted(() => {
  const darkPref = localStorage.getItem('campus_dark_pref')
  if (darkPref === 'true') {
    $q.dark.set(true)
  }
  fetchAll()
})
</script>
