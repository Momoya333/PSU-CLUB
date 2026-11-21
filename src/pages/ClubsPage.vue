<template>
  <q-page class="q-pa-md page">
    <div class="text-h5 q-mb-md">Clubs &amp; Societies</div>

    <div
      v-if="state.isLoading && state.clubs.length === 0"
      class="text-center q-pa-xl"
    >
      <q-spinner-dots color="primary" size="48px" />
      <div class="q-mt-sm text-grey-6">Loading clubs...</div>
    </div>

    <q-banner
      v-else-if="state.errorMessage && state.clubs.length === 0"
      class="bg-red-1 text-negative q-mb-md"
      rounded
    >
      <template #avatar>
        <q-icon name="error" color="negative" />
      </template>
      {{ state.errorMessage }}
    </q-banner>

    <div
      v-else-if="state.clubs.length === 0"
      class="text-center text-grey-6 q-pa-xl"
    >
      <q-icon name="groups" size="64px" />
      <div>No clubs found</div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div
        v-for="club in state.clubs"
        :key="club.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat bordered class="club-card">
          <router-link
            :to="'/clubs/' + club.id"
            :class="'banner bg-' + club.color"
          >
            <q-icon :name="club.icon" size="56px" color="white" />
          </router-link>
          <q-card-section>
            <div class="text-subtitle1">{{ club.name }}</div>
            <div class="text-caption text-grey-7"
              >{{ club.members }} members</div
            >
            <div class="text-body2 q-mt-sm">{{ club.description }}</div>
          </q-card-section>
          <q-card-actions class="q-px-md q-pb-md">
            <q-btn
              flat
              no-caps
              color="primary"
              label="View"
              :to="'/clubs/' + club.id"
            />
            <q-space />
            <q-btn
              unelevated
              no-caps
              :color="isJoined(club.id) ? 'grey-4' : 'primary'"
              :text-color="isJoined(club.id) ? 'black' : 'white'"
              :label="isJoined(club.id) ? 'Joined' : 'Join'"
              @click="onToggleJoin(club.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useCampusStore } from '@/stores/useCampusStore'

const $q = useQuasar()
const { state, isJoined, toggleJoin } = useCampusStore()

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
</script>
<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
}
.club-card {
  border-radius: 12px;
  height: 100%;
}
.banner {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px 12px 0 0;
}
</style>
