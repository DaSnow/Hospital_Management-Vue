import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/patients',
    name: 'patients',
    component: () => import('../views/Patients.vue')
  },
  {
    path: '/doctors',
    name: 'doctors',
    component: () => import('../views/Doctors.vue')
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: () => import('../views/Appointments.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/Users.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router