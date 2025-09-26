import { createRouter, createWebHistory } from 'vue-router'
import Layout from './components/Layout.vue'
import App from './components/App.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import MyTicket from './components/MyTicket.vue'
import CustomerSupport from './components/CustomerSupport.vue'
import TicketInformation from './components/TicketInformation.vue'
import EventDetail from "./components/user/EventDetail.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      { path: '', name: 'Home', component: App },
      { path: '/login', name: 'Login', component: LoginForm },
      { path: '/register', name: 'Register', component: RegisterForm },
      { path: '/tickets', name: 'Tickets', component: MyTicket },
      { path: '/support', name: 'CustomerSupport', component: CustomerSupport },
      { path: "/tickets/:id", name: "TicketInformation", component: TicketInformation, props: true }
      { path: "/event-detail", name: "EventDetail", component: EventDetail },

    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
