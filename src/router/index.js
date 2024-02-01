/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/pages/Home.vue'),
      },
    ],
  },
  {
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/client',
        name: 'Clientes',
        component: () => import('@/pages/Clientes.vue'),
      },
    ],
  },
  {
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/Login.vue'),
      },
    ],
  },
  {
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/usuarios',
        name: 'Usuários',
        component: () => import('@/pages/Usuarios.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
