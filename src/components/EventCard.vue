<template>
  <q-card flat bordered class="event-card">
    <router-link
      :to="`/clubs/${event.clubId}`"
      class="cover flex flex-center"
      :class="`bg-${event.club?.color || 'grey-6'}`"
    >
      <q-icon
        :name="event.club?.icon || 'event'"
        size="64px"
        color="white"
        style="opacity: 0.85"
      />
    </router-link>

    <!-- MenuของAdmin -->
    <div class="card-actions-top row items-center">
      <q-btn
        v-if="authStore.isClubAdmin"
        round
        flat
        dense
        class="action-btn bg-white"
        icon="more_vert"
        color="grey-8"
        aria-label="Event options"
      >
        <q-menu auto-close anchor="bottom right" self="top right">
          <q-list style="min-width: 130px">
            <q-item clickable @click="$emit('edit', event)">
              <q-item-section avatar style="min-width: 32px">
                <q-icon name="edit" size="18px" color="primary" />
              </q-item-section>
              <q-item-section>Edit</q-item-section>
            </q-item>
            <q-separator />
            <q-item
              clickable
              class="text-negative"
              @click="$emit('delete', event)"
            >
              <q-item-section avatar style="min-width: 32px">
                <q-icon name="delete" size="18px" color="negative" />
              </q-item-section>
              <q-item-section>Delete</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn
        round
        flat
        dense
        class="action-btn bg-white q-ml-xs"
        :icon="saved ? 'bookmark' : 'bookmark_border'"
        :color="saved ? 'primary' : 'grey-7'"
        :aria-label="saved ? 'Unsave event' : 'Save event'"
        @click="$emit('save', event.id)"
      />
    </div>

    <q-card-section class="q-pb-sm">
      <div class="text-subtitle1 text-weight-medium ellipsis-2-lines">
        {{ event.title }}
      </div>
      <div class="text-caption text-grey-7 q-mt-xs">
        <q-icon name="place" size="14px" /> {{ event.location }} ·
        {{ event.club?.name || 'Unknown club' }}
      </div>
    </q-card-section>

    <q-card-section class="row items-center q-py-none">
      <q-chip
        v-for="t in event.tags"
        :key="t"
        dense
        square
        color="grey-2"
        text-color="grey-8"
        class="q-ml-none"
      >
        #{{ t }}
      </q-chip>
      <q-space />
      <q-chip dense square color="grey-2" text-color="grey-8" icon="groups">
        {{ event.attendees }}
      </q-chip>
    </q-card-section>

    <q-card-actions class="q-px-md q-pb-md q-pt-sm">
      <div class="row items-center text-grey-8">
        <q-icon name="event" size="20px" class="q-mr-xs" />
        <span>{{ formattedDate }}</span>
      </div>
      <q-space />
      <q-btn
        unelevated
        no-caps
        :color="going ? 'grey-5' : event.club?.color || 'primary'"
        :text-color="going ? 'dark' : 'white'"
        :icon="going ? 'check' : undefined"
        :label="going ? 'Joined' : 'RSVP / Join'"
        @click="$emit('rsvp', event.id)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth-store'

const authStore = useAuthStore()

const props = defineProps({
  event: { type: Object, required: true },
  going: Boolean,
  saved: Boolean
})

defineEmits(['rsvp', 'save', 'edit', 'delete'])

const formattedDate = computed(() =>
  new Date(props.event.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
)
</script>

<style scoped lang="scss">
.event-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.event-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}
.cover {
  height: 150px;
  text-decoration: none;
}
.card-actions-top {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}
.action-btn {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>