<template>
  <q-page class="q-pa-md page">
    <!-- 1. สถานะกำลังโหลดข้อมูลจาก API -->
    <div v-if="state.isLoading && !club" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="48px" />
      <div class="q-mt-sm text-grey-6">Loading club details...</div>
    </div>

    <!-- 2. สถานะเกิด Error จาก API -->
    <q-banner
      v-else-if="state.errorMessage && !club"
      class="bg-red-1 text-negative q-mb-md"
      rounded
    >
      <template #avatar>
        <q-icon name="error" color="negative" />
      </template>
      {{ state.errorMessage }}
    </q-banner>

    <!-- 3. ไม่พบข้อมูลคลับ (หลังจากโหลดเสร็จแล้วเท่านั้น) -->
    <div v-else-if="!club" class="text-center q-pa-xl text-grey-6">
      <q-icon name="error_outline" size="64px" />
      <div class="q-my-md">Club not found</div>
      <q-btn color="primary" no-caps label="Back to clubs" to="/clubs" />
    </div>

    <!-- 4. แสดงรายละเอียดคลับและกิจกรรม -->
    <template v-else>
      <q-btn
        flat
        dense
        no-caps
        icon="arrow_back"
        label="Clubs"
        to="/clubs"
        class="q-mb-sm"
      />

      <q-card flat bordered style="border-radius: 12px; overflow: hidden">
        <div class="hero flex flex-center" :class="`bg-${club.color}`">
          <q-icon :name="club.icon" size="80px" color="white" />
        </div>
        <q-card-section class="row items-center q-col-gutter-md">
          <div class="col-12 col-sm">
            <div class="text-h5 text-weight-bold">{{ club.name }}</div>
            <div class="text-grey-7"
              ><q-icon name="groups" /> {{ club.members }} members</div
            >
          </div>
          <div class="col-12 col-sm-auto">
            <q-btn
              unelevated
              no-caps
              :color="isJoined(club.id) ? 'grey-4' : 'primary'"
              :text-color="isJoined(club.id) ? 'dark' : 'white'"
              :label="isJoined(club.id) ? 'Joined' : 'Join Club'"
              @click="onToggleJoin(club.id)"
            />
          </div>
        </q-card-section>

        <q-tabs
          v-model="tab"
          align="left"
          active-color="primary"
          indicator-color="primary"
          dense
        >
          <q-tab name="events" label="Events" no-caps />
          <q-tab name="about" label="About" no-caps />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab" animated class="bg-grey-2">
          <q-tab-panel name="events">
            <div v-if="!events.length" class="text-grey-6 text-center q-pa-lg"
              >No upcoming events</div
            >
            <div class="row q-col-gutter-md">
              <div v-for="e in events" :key="e.id" class="col-12 col-sm-6">
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
          </q-tab-panel>
          <q-tab-panel name="about" class="bg-white">
            <div class="text-body1">{{ club.description }}</div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </template>

    <EditEventModal
      v-model="showEditModal"
      :event="selectedEvent"
      @submit="onUpdate"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import EventCard from '@/components/EventCard.vue'
import EditEventModal from '@/components/EditEventModal.vue'
import { useCampusStore } from '@/stores/useCampusStore'

const route = useRoute()
const $q = useQuasar()
const {
  state,
  clubById,
  eventsByClub,
  isRsvp,
  isSaved,
  isJoined,
  toggleRsvp,
  toggleSave,
  toggleJoin,
  updateEvent,
  deleteEvent
} = useCampusStore()

const tab = ref('events')
const showEditModal = ref(false)
const selectedEvent = ref(null)

const club = computed(() => clubById(route.params.id))
const events = computed(() => eventsByClub(route.params.id))

async function onToggleJoin(clubId) {
  const joined = await toggleJoin(clubId)
  if (state.errorMessage) {
    $q.notify({ type: 'negative', message: state.errorMessage, timeout: 2000 })
    return
  }

  $q.notify({
    type: joined ? 'positive' : 'info',
    message: joined ? 'Joined club' : 'Left club',
    timeout: 1500
  })
}

async function onRsvp(id) {
  const going = await toggleRsvp(id)
  if (state.errorMessage) {
    $q.notify({ type: 'negative', message: state.errorMessage, timeout: 2000 })
    return
  }

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

<style scoped lang="scss">
.page {
  max-width: 960px;
  margin: 0 auto;
}
.hero {
  height: 160px;
}
</style>
