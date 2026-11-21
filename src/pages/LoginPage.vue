<template>
  <q-page
    class="flex flex-center q-pa-md"
    style="background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)"
  >
    <q-card
      class="q-pa-md shadow-8"
      style="width: 100%; max-width: 440px; border-radius: 20px"
    >
      <q-card-section class="text-center q-pb-sm">
        <q-avatar
          size="64px"
          color="primary"
          text-color="white"
          icon="school"
          class="q-mb-sm shadow-3"
        />
        <div class="text-h5 text-weight-bolder text-grey-9">PSU CLUB</div>
        <div class="text-caption text-grey-6">
          Campus Club &amp; Event Community
        </div>
      </q-card-section>

      <!-- Login, Register -->
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-7"
        active-color="primary"
        color="primary"
        @update:model-value="authStore.errorMessage = ''"
      >
        <q-tab name="login" label="Login" no-caps />
        <q-tab name="register" label="Register" no-caps />
      </q-tabs>

      <q-separator />

      <q-banner
        v-if="authStore.errorMessage"
        class="bg-red-1 text-negative q-mt-md"
        rounded
        dense
      >
        <template #avatar>
          <q-icon name="error" color="negative" />
        </template>
        {{ authStore.errorMessage }}
      </q-banner>

      <q-tab-panels v-model="tab" >
        <!-- LOGIN  -->
        <q-tab-panel name="login" class="q-px-sm q-pt-md">
          <q-form @submit.prevent="onLogin" class="q-gutter-y-md">
            <q-input
              v-model="loginForm.username"
              label="Username"
              outlined
              dense
              lazy-rules
              :rules="[val => !!val || 'Please enter your username']"
            >
              <template #prepend>
                <q-icon name="person" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="loginForm.password"
              :type="showPwd ? 'text' : 'password'"
              label="Password"
              outlined
              dense
              lazy-rules
              :rules="[val => !!val || 'Please enter your password']"
            >
              <template #prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template #append>
                <q-icon
                  :name="showPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPwd = !showPwd"
                />
              </template>
            </q-input>

            <q-btn
              type="submit"
              color="primary"
              label="Login"
              class="full-width text-weight-bold"
              size="md"
              rounded
              unelevated
              :loading="authStore.loading"
              :disable="!loginForm.username || !loginForm.password"
            />
          </q-form>
        </q-tab-panel>

        <!-- REGISTER  -->
        <q-tab-panel name="register" class="q-px-sm q-pt-md">
          <q-form @submit.prevent="onRegister" class="q-gutter-y-sm">
            <q-input
              v-model="regForm.name"
              label="Full Name"
              outlined
              dense
              lazy-rules
              :rules="[val => !!val || 'Please enter your full name']"
            >
              <template #prepend>
                <q-icon name="badge" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="regForm.username"
              label="Username"
              outlined
              dense
              lazy-rules
              :rules="[val => !!val || 'Please enter a username']"
            >
              <template #prepend>
                <q-icon name="person" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="regForm.email"
              type="email"
              label="PSU Email"
              outlined
              dense
              lazy-rules
              :rules="[val => !!val || 'Please enter your email']"
            >
              <template #prepend>
                <q-icon name="email" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="regForm.password"
              type="password"
              label="Password"
              outlined
              dense
              lazy-rules
              :rules="[
                val => (val && val.length >= 6) || 'Please enter 6 characters'
              ]"
            >
              <template #prepend>
                <q-icon name="lock" color="primary" />
              </template>
            </q-input>

            <q-select
              v-model="regForm.role"
              :options="roleOptions"
              emit-value
              map-options
              label="Account Role"
              outlined
              dense
            >
              <template #prepend>
                <q-icon name="verified_user" color="primary" />
              </template>
            </q-select>

            <q-btn
              type="submit"
              color="primary"
              label="Create Account"
              class="full-width text-weight-bold q-mt-md"
              size="md"
              rounded
              unelevated
              :loading="authStore.loading"
            />
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const tab = ref('login')
const showPwd = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const regForm = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'student'
})

const roleOptions = [
  { label: 'Student (นักศึกษาทั่วไป)', value: 'student' },
  { label: 'Club Admin (แอดมิน)', value: 'club_admin' }
]

const roleLabel = {
  student: 'Student',
  club_admin: 'Club Admin'
}

function fillDemo(username, password) {
  loginForm.username = username
  loginForm.password = password
}

async function onLogin() {
  try {
    await authStore.login(loginForm.username, loginForm.password)
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: `Welcome back, ${authStore.user.name}!`,
      caption: `Role: ${roleLabel[authStore.user.role] || authStore.user.role}`,
      timeout: 2000
    })
    router.push({ name: 'home' })
  } catch (error) {
    console.error(error)
  }
}

async function onRegister() {
  try {
    await authStore.register({ ...regForm })
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: `Account created! Welcome, ${authStore.user.name}`,
      caption: `Role: ${roleLabel[authStore.user.role] || authStore.user.role}`,
      timeout: 2000
    })
    router.push({ name: 'home' })
  } catch (error) {
    console.error(error)
  }
}
</script>