<template>
  <q-page class="q-pa-md page">
    <div v-if="state.isLoading && !state.user.name" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="48px" />
      <div class="q-mt-sm text-grey-6">Loading profile...</div>
    </div>

    <q-banner
      v-else-if="state.errorMessage && !state.user.name"
      class="bg-red-1 text-negative q-mb-md"
      rounded
    >
      {{ state.errorMessage }}
    </q-banner>

    <!-- ข้อมูลผู้ใช้ -->
    <template v-else>
      <q-card flat bordered class="profile-card">
        <q-card-section class="row items-center no-wrap">
          <q-avatar
            size="88px"
            color="blue-grey-2"
            text-color="primary"
            icon="person"
          />
          <div class="q-ml-md col">
            <div class="text-h5 text-weight-bold">{{ state.user.name }}</div>
            <div class="text-grey-7"
              >{{ state.user.faculty }} · Year {{ state.user.year }}</div
            >
            <div class="text-grey-7">{{ state.user.email }}</div>
          </div>
          <q-btn
            outline
            color="primary"
            icon="edit"
            label="Edit"
            no-caps
            class="q-px-sm"
            @click="openEditDialog"
          />
        </q-card-section>
        <q-card-section class="q-pt-none text-body1 text-grey-8">
          {{ state.user.bio || 'No bio yet.' }}
        </q-card-section>
        <q-separator />
        <q-card-section class="row text-center">
          <div class="col">
            <div class="text-h6 text-primary">{{
              state.joinedClubs.length
            }}</div>
            <div class="text-caption text-grey-7">Clubs</div>
          </div>
          <div class="col">
            <div class="text-h6 text-primary">{{ state.rsvp.length }}</div>
            <div class="text-caption text-grey-7">RSVPs</div>
          </div>
          <div class="col">
            <div class="text-h6 text-primary">{{ state.saved.length }}</div>
            <div class="text-caption text-grey-7">Saved</div>
          </div>
        </q-card-section>
      </q-card>

      <div class="text-h6 q-mt-lg q-mb-sm">My Clubs</div>
      <q-list bordered separator class="bg-white" style="border-radius: 8px">
        <q-item
          v-for="club in myClubs"
          :key="club.id"
          clickable
          :to="'/clubs/' + club.id"
        >
          <q-item-section avatar>
            <q-avatar
              :color="club.color"
              text-color="white"
              :icon="club.icon"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{
              club.name
            }}</q-item-label>
            <q-item-label caption>{{ club.members }} members</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-6" />
          </q-item-section>
        </q-item>
        <q-item v-if="myClubs.length === 0">
          <q-item-section class="text-grey-6 text-center q-pa-md">
            ยังไม่ได้เข้าร่วมชมรมใด
          </q-item-section>
        </q-item>
      </q-list>
    </template>

    <!-- Dialog แก้ไขโปรไฟล์ -->
    <q-dialog v-model="showEditDialog" :maximized="$q.screen.lt.sm">
      <q-card style="width: 480px; max-width: 95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Edit Profile</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="onSaveProfile">
          <q-card-section class="q-gutter-md q-pt-none">
            <q-input
              v-model="profileForm.name"
              outlined
              dense
              label="Full Name *"
              :rules="[v => !!v || 'Name is required']"
            />
            <q-input
              v-model="profileForm.faculty"
              outlined
              dense
              label="Faculty"
            />
            <q-input
              v-model.number="profileForm.year"
              outlined
              dense
              type="number"
              label="Year of Study"
            />
            <q-input
              v-model="profileForm.bio"
              outlined
              type="textarea"
              rows="3"
              label="Bio"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat no-caps label="Cancel" v-close-popup />
            <q-btn
              unelevated
              no-caps
              color="primary"
              label="Save"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useCampusStore } from '@/stores/useCampusStore'

const $q = useQuasar()
const { state, clubById, updateProfile } = useCampusStore()

const showEditDialog = ref(false)
const profileForm = reactive({
  name: '',
  faculty: '',
  year: 1,
  bio: ''
})

const myClubs = computed(() =>
  state.joinedClubs.map(id => clubById(id)).filter(Boolean)
)

function openEditDialog() {
  profileForm.name = state.user.name || ''
  profileForm.faculty = state.user.faculty || ''
  profileForm.year = state.user.year || 1
  profileForm.bio = state.user.bio || ''
  showEditDialog.value = true
}

async function onSaveProfile() {
  const success = await updateProfile({ ...profileForm })
  if (success) {
    showEditDialog.value = false
    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully',
      timeout: 1500
    })
  } else {
    $q.notify({
      type: 'negative',
      message: state.errorMessage || 'Failed to update profile',
      timeout: 2000
    })
  }
}
</script>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
}
.profile-card {
  border-radius: 12px;
}
</style>
