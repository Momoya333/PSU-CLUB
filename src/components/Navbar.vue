<!-- <template>
  <q-header bordered class="bg-white text-dark">
    <q-toolbar>
      <q-btn
        flat
        round
        dense
        icon="menu"
        class="lt-md"
        @click="emit('toggle-drawer')"
      />
      <router-link to="/" class="logo">
        <q-avatar
          size="36px"
          color="primary"
          text-color="white"
          icon="school"
        />
        <span class="logo-text gt-xs">PSU CLUB</span>
      </router-link>
      <q-space />
      <q-input
        v-model="state.query"
        dense
        rounded
        filled
        clearable
        class="search-box"
        placeholder="Search clubs, events, activities..."
        @keyup.enter="router.push('/')"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-space />
      <q-btn flat round dense icon="notifications_none">
        <q-badge v-if="unreadCount > 0" color="red" floating rounded>{{
          unreadCount
        }}</q-badge>
        <q-menu @before-hide="markAllRead()">
          <q-list style="min-width: 260px">
            <q-item-label header>Notifications</q-item-label>
            <q-item
              v-for="n in state.notifications"
              :key="n.id"
              clickable
              v-close-popup
            >
              <q-item-section>
                <q-item-label>{{ n.text }}</q-item-label>
                <q-item-label caption>{{ n.time }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn flat round dense icon="chat_bubble_outline" class="gt-xs" />
      <q-btn flat round dense>
        <q-avatar
          size="34px"
          color="blue-grey-2"
          text-color="primary"
          icon="person"
        />
        <q-menu>
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup to="/profile">
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/settings">
              <q-item-section>Settings</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCampusStore } from '@/stores/useCampusStore'

const emit = defineEmits(['toggle-drawer'])
const router = useRouter()
const { state, unreadCount, markAllRead } = useCampusStore()
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}
.logo-text {
  font-size: 20px;
  font-weight: bold;
  margin-left: 8px;
}
.search-box {
  width: 100%;
  max-width: 500px;
}
</style> -->

<!-- V2 -->
 <template>
  <q-header bordered class="bg-white text-dark">
    <q-toolbar>
      <q-btn
        flat
        round
        dense
        icon="menu"
        class="lt-md"
        @click="emit('toggle-drawer')"
      />
      <router-link to="/" class="logo">
        <q-avatar
          size="36px"
          color="primary"
          text-color="white"
          icon="school"
        />
        <span class="logo-text gt-xs">PSU CLUB</span>
      </router-link>
      <q-space />
      <q-input
        v-model="state.query"
        dense
        rounded
        filled
        clearable
        class="search-box"
        placeholder="Search clubs, events, activities..."
        @keyup.enter="router.push('/')"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-space />

      <!-- กรณี Login แล้ว: แสดงแจ้งเตือน, ชื่อ, Role Badge และเมนู Logout -->
      <template v-if="authStore.isAuthenticated">
        <q-btn flat round dense icon="notifications_none" class="q-mr-xs">
          <q-badge v-if="unreadCount > 0" color="red" floating rounded>{{
            unreadCount
          }}</q-badge>
          <q-menu @before-hide="markAllRead()">
            <q-list style="min-width: 260px">
              <q-item-label header>Notifications</q-item-label>
              <q-item
                v-for="n in state.notifications"
                :key="n.id"
                clickable
                v-close-popup
              >
                <q-item-section>
                  <q-item-label>{{ n.text }}</q-item-label>
                  <q-item-label caption>{{ n.time }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- แสดงชื่อผู้ใช้ + Role Badge บนจอใหญ่ -->
        <div class="gt-xs row items-center q-mr-sm">
          <div class="text-right q-mr-xs">
            <div class="text-caption text-weight-bold text-grey-9" style="line-height: 1.1">
              {{ authStore.user?.name }}
            </div>
            <q-badge
              :color="authStore.isClubAdmin ? 'teal-7' : 'blue-7'"
              text-color="white"
              class="text-weight-medium"
            >
              {{ authStore.isClubAdmin ? 'Club Admin' : 'Student' }}
            </q-badge>
          </div>
        </div>

        <q-btn flat round dense>
          <q-avatar
            size="34px"
            :color="authStore.isClubAdmin ? 'teal-1' : 'blue-grey-2'"
            :text-color="authStore.isClubAdmin ? 'teal-8' : 'primary'"
            :icon="authStore.isClubAdmin ? 'admin_panel_settings' : 'person'"
          />
          <q-menu>
            <q-list style="min-width: 180px">
              <q-item-label header class="q-pb-xs">
                <div class="text-weight-bold text-dark">
                  {{ authStore.user?.name }}
                </div>
                <div class="text-caption text-grey-6">
                  Role: {{ authStore.isClubAdmin ? 'Club Admin' : 'Student' }}
                </div>
              </q-item-label>
              <q-separator />
              <q-item clickable v-close-popup to="/profile">
                <q-item-section avatar style="min-width: 32px">
                  <q-icon name="person" size="18px" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/settings">
                <q-item-section avatar style="min-width: 32px">
                  <q-icon name="settings" size="18px" />
                </q-item-section>
                <q-item-section>Settings</q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
                class="text-negative"
                @click="onLogout"
              >
                <q-item-section avatar style="min-width: 32px">
                  <q-icon name="logout" size="18px" color="negative" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>

      <!-- กรณียังไม่ได้ Login: แสดงปุ่ม Login -->
      <template v-else>
        <q-btn
          unelevated
          rounded
          no-caps
          color="primary"
          icon="login"
          label="Login"
          to="/login"
        />
      </template>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCampusStore } from '@/stores/useCampusStore'
import { useAuthStore } from '@/stores/auth-store'

const emit = defineEmits(['toggle-drawer'])
const router = useRouter()
const $q = useQuasar()
const { state, unreadCount, markAllRead } = useCampusStore()
const authStore = useAuthStore()

function onLogout() {
  $q.dialog({
    title: 'Logout',
    message: 'Are you sure you want to logout?',
    cancel: true,
    persistent: true,
    ok: {
      label: 'Logout',
      color: 'negative',
      unelevated: true,
      noCaps: true
    },
    cancelProps: {
      flat: true,
      noCaps: true
    }
  }).onOk(() => {
    authStore.logout()
    $q.notify({
      type: 'positive',
      message: 'Logout successful.',
      timeout: 1500
    })
    router.replace({ name: 'login' })
  })
}
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}
.logo-text {
  font-size: 20px;
  font-weight: bold;
  margin-left: 8px;
}
.search-box {
  width: 100%;
  max-width: 440px;
}
</style>