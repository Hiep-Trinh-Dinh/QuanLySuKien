import { createRouter, createWebHistory } from 'vue-router'
import Layout from './components/Layout.vue'
import Home from './components/user/Home.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import CreateEvent from './components/admin/CreateEvent.vue'  
import Profile from './components/user/Profile.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: '/login', name: 'Login', component: LoginForm },
      { path: '/register', name: 'Register', component: RegisterForm },
      { path: '/create-event', name: 'CreateEvent', component: CreateEvent },
      { path: '/profile', name: 'Profile', component: Profile }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
