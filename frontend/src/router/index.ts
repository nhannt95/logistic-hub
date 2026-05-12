import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
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
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'dashboard' }
})

export default router
