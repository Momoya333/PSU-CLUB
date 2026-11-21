
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/HomeFeedPage.vue')
      },
      {
        path: 'clubs',
        name: 'clubs',
        component: () => import('@/pages/ClubsPage.vue')
      },
      {
        path: 'clubs/:id',
        name: 'club-detail',
        component: () => import('@/pages/ClubDetailPage.vue')
      },
      {
        path: 'activities',
        name: 'activities',
        component: () => import('@/pages/ActivitiesPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'saved',
        name: 'saved',
        component: () => import('@/pages/SavedEventsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/pages/SettingsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { guestOnly: true }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes