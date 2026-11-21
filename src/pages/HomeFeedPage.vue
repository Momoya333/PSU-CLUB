<template>
  <q-page class="q-pa-md feed">
    <!-- แถบที่แสดงเฉพาะแอดมิน -->
    <q-card
      v-if="authStore.isClubAdmin"
      flat
      bordered
      class="create-bar q-mb-md"
      @click="showModal = true"
    >
      <q-card-section class="row items-center no-wrap">
        <q-avatar
          size="40px"
          color="teal-1"
          text-color="teal-8"
          icon="admin_panel_settings"
        />
        <div class="q-ml-md col ellipsis">
          What's happening in your club?
          <span class="text-primary text-weight-medium">Create Post...</span>
        </div>
        <q-btn
          flat
          dense
          round
          icon="image"
          color="primary"
          class="q-mr-sm"
          @click.stop="showModal = true"
        />
        <q-btn
          flat
          dense
          round
          icon="event"
          color="primary"
          @click.stop="showModal = true"
        />
      </q-card-section>
    </q-card>

    <!-- โหลดข้อมูลจาก api -->
    <div
      v-if="state.isLoading && state.events.length === 0"
      class="text-center q-pa-xl"
    >
      <q-spinner-dots color="primary" size="48px" />
      <div class="q-mt-sm text-grey-6">Loading events...</div>
    </div>

    <!-- สถานะErrorถ้ามีอะไรผิดพลาดจาก api -->
    <q-banner
      v-else-if="state.errorMessage && state.events.length === 0"
      class="bg-red-1 text-negative q-mb-md"
      rounded
    >
      <template #avatar>
        <q-icon name="error" color="negative" />
      </template>
      {{ state.errorMessage }}
    </q-banner>

    <!-- แสดงผลการค้นหาและรายการ -->
    <template v-else>
      <div v-if="state.query" class="q-mb-sm text-grey-7">
        Found {{ filteredEvents.length }} event(s) for "{{ state.query }}"
      </div>

      <div class="row q-col-gutter-md">
        <div v-for="e in filteredEvents" :key="e.id" class="col-12 col-sm-6">
          <EventCard
            :event="e"
            :going="isRsvp(e.id)"
            :saved="isSaved(e.id)"
            @rsvp="onRsvp"
            @save="onSave"
            @edit="onEdit"
            @delete="onDelete"
          />
        </div>
      </div>

      <div
        v-if="filteredEvents.length === 0"
        class="text-center text-grey-6 q-pa-xl"
      >
        <q-icon name="search_off" size="64px" />
        <div>No events found</div>
      </div>
    </template>

    <CreatePostModal v-model="showModal" @submit="onPost" />
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
import CreatePostModal from '@/components/CreatePostModal.vue'
import EditEventModal from '@/components/EditEventModal.vue'
import { useCampusStore } from '@/stores/useCampusStore'
import { useAuthStore } from '@/stores/auth-store'

const $q = useQuasar()
const authStore = useAuthStore()
const {
  state,
  filteredEvents,
  isRsvp,
  isSaved,
  toggleRsvp,
  toggleSave,
  addPost,
  updateEvent,
  deleteEvent
} = useCampusStore()

const showModal = ref(false)
const showEditModal = ref(false)
const selectedEvent = ref(null)

async function onRsvp(id) {
  const going = await toggleRsvp(id)
  if (state.errorMessage) {
    $q.notify({ type: 'negative', message: state.errorMessage, timeout: 2000 })
    return
  }

  if (going) {
    $q.notify({ type: 'positive', message: 'RSVP confirmed', timeout: 1500 })
  } else {
    $q.notify({ type: 'info', message: 'RSVP cancelled', timeout: 1500 })
  }
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

async function onPost(post) {
  const newId = await addPost(post)
  if (state.errorMessage || !newId) {
    $q.notify({
      type: 'negative',
      message: state.errorMessage || 'Failed to create post',
      timeout: 2000
    })
    return
  }

  $q.notify({ type: 'positive', message: 'Post created', timeout: 1500 })
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
.feed {
  max-width: 960px;
  margin: 0 auto;
}
.create-bar {
  border-radius: 12px;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.15s;
}
.create-bar:hover {
  background-color: #f8fafc;
}
</style>