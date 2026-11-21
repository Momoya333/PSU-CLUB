<template>
  <q-page class="q-pa-md page">
    <div class="text-h5 q-mb-md">Settings</div>
    <q-list bordered class="bg-white" style="border-radius: 8px">
      <q-item tag="label" v-ripple>
        <q-item-section avatar>
          <q-icon name="dark_mode" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Dark mode</q-item-label>
          <q-item-label caption>เปลี่ยนธีมสีของแอป</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            :model-value="$q.dark.isActive"
            @update:model-value="onToggleDark"
          />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item tag="label" v-ripple>
        <q-item-section avatar>
          <q-icon name="notifications" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Event notifications</q-item-label>
          <q-item-label caption>แจ้งเตือนกิจกรรมจากชมรมที่เข้าร่วม</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="notify" @update:model-value="onToggleNotify" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const notify = ref(localStorage.getItem('campus_notify_pref') !== 'false')

function onToggleDark(val) {
  $q.dark.set(val)
  localStorage.setItem('campus_dark_pref', String(val))
  $q.notify({
    type: 'info',
    message: val ? 'Dark mode enabled' : 'Dark mode disabled',
    timeout: 1000
  })
}

function onToggleNotify(val) {
  localStorage.setItem('campus_notify_pref', String(val))
  $q.notify({
    type: 'info',
    message: val ? 'Notifications enabled' : 'Notifications muted',
    timeout: 1000
  })
}
</script>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
}
</style>
