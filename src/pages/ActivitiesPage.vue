<template>
  <q-page class="q-pa-md page">
    <div class="text-h5 q-mb-md">My Activities</div>
    <div
      v-if="state.isLoading && state.events.length === 0"
      class="text-center q-pa-xl"
    >
      <q-spinner-dots color="primary" size="48px" />
      <div class="q-mt-sm text-grey-6">Loading activities...</div>
    </div>
    <q-banner
      v-else-if="state.errorMessage && state.events.length === 0"
      class="bg-red-1 text-negative q-mb-md"
      rounded
    >
      {{ state.errorMessage }}
    </q-banner>
    <div
      v-else-if="myActivities.length === 0"
      class="text-center text-grey-6 q-pa-xl"
    >
      <q-icon name="event_busy" size="64px" />
      <div class="q-my-md">คุณยังไม่ได้ RSVP กิจกรรมใด ๆ</div>
      <q-btn color="primary" no-caps unelevated label="Browse events" to="/" />
    </div>
    <div v-else class="row q-col-gutter-md">
      <div v-for="e in myActivities" :key="e.id" class="col-12 col-sm-6">
        <EventCard
          :event="e"
          :going="true"
          :saved="isSaved(e.id)"
          @rsvp="onRsvp"
          @save="onSave"
          @edit="onEdit"
          @delete="onDelete"
        />
      </div>
    </div>

    <EditEventModal
      v-model="showEditModal"
      :event="selectedEvent"
      @submit="onUpdate"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import EventCard from '@/components/EventCard.vue'
import EditEventModal from '@/components/EditEventModal.vue'
import { useCampusStore } from '@/stores/useCampusStore'

const $q = useQuasar()
const {
  state,
  myActivities,
  isSaved,
  toggleRsvp,
  toggleSave,
  updateEvent,
  deleteEvent
} = useCampusStore()

const showEditModal = ref(false)
const selectedEvent = ref(null)

async function onRsvp(id) {
  const going = await toggleRsvp(id)
  $q.notify({
    type: going ? 'positive' : 'info',
    message: going ? 'RSVP confirmed' : 'RSVP cancelled',
    timeout: 1500
  })
}

async function onSave(id) {
  const saved = await toggleSave(id)
  $q.notify({
    type: saved ? 'positive' : 'info',
    message: saved
      ? 'Event saved to bookmarks'
      : 'Event removed from bookmarks',
    timeout: 1500
  })
}

function onEdit(event) {
  selectedEvent.value = { ...event }
  showEditModal.value = true
}

function onDelete(event) {
  $q.dialog({
    title: 'Delete Event',
    message: `Are you sure you want to delete "${event.title}"?`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'Delete',
      color: 'negative',
      unelevated: true,
      noCaps: true
    },
    cancelProps: {
      flat: true,
      noCaps: true
    }
  }).onOk(async () => {
    const success = await deleteEvent(event.id)
    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Event deleted successfully',
        timeout: 1500
      })
    } else {
      $q.notify({
        type: 'negative',
        message: state.errorMessage || 'Failed to delete event',
        timeout: 2000
      })
    }
  })
}

async function onUpdate(updatedData) {
  const success = await updateEvent(updatedData.id, updatedData)
  if (success) {
    $q.notify({
      type: 'positive',
      message: 'Event updated successfully',
      timeout: 1500
    })
  } else {
    $q.notify({
      type: 'negative',
      message: state.errorMessage || 'Failed to update event',
      timeout: 2000
    })
  }
}
</script>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
}
</style>
