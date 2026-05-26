import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoading } from '@/lib/loading'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingPage.vue'),
      meta: { public: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/app',
      component: () => import('@/layouts/AppLayout.vue'),
      children: [
        { path: '', redirect: { name: 'dashboard' } },
        { path: 'dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
        { path: 'dieu-do', name: 'dieu-do', component: () => import('@/views/DieuDoView.vue') },
        { path: 'tai-xe', name: 'tai-xe', component: () => import('@/views/DriverView.vue') },
        { path: 'ke-toan', name: 'ke-toan', component: () => import('@/views/KeToanView.vue') },
        { path: 'settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
        { path: 'master', redirect: { name: 'settings', query: { group: 'master' } } },
        { path: 'users', redirect: { name: 'settings', query: { group: 'users' } } },
      ],
    },
    // Legacy paths (pre /app prefix)
    { path: '/dashboard', redirect: '/app/dashboard' },
    { path: '/dieu-do', redirect: '/app/dieu-do' },
    { path: '/tai-xe', redirect: '/app/tai-xe' },
    { path: '/ke-toan', redirect: '/app/ke-toan' },
    { path: '/settings', redirect: '/app/settings' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to, from) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'dashboard' }
  // Chỉ show loading khi vào trang dashboard
  if (to.name === 'dashboard' && to.fullPath !== from.fullPath) useLoading().start()
})

router.afterEach((to) => {
  if (to.name === 'dashboard') useLoading().stop()
})

router.onError(() => {
  useLoading().stop()
})

export default router
