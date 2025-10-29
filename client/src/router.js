import { createRouter, createWebHistory } from "vue-router";
import Layout from "./components/Layout.vue";
import Home from "./components/user/Home.vue";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import CreateEvent from "./components/admin/CreateEvent.vue";
import Profile from "./components/user/Profile.vue";
import EventReviewForm from "./components/EventReviewForm.vue";
import TicketPayment from "./components/TicketPayment.vue";
import ExploreEvents from "./components/ExploreEvents.vue";
import MyTicket from "./components/MyTicket.vue";
import CustomerSupport from "./components/CustomerSupport.vue";
import TicketInformation from "./components/TicketInformation.vue";
import EventDetail from "./components/user/EventDetail.vue";


const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "/login", name: "Login", component: LoginForm },
      { path: "/register", name: "Register", component: RegisterForm },
      { path: "/create-event", name: "CreateEvent", component: CreateEvent },
      { path: "/profile", name: "Profile", component: Profile },
      // { path: '', name: 'Home', component: TicketPayment },
      { path: "/tickets", name: "Tickets", component: MyTicket },
      { path: "/support", name: "CustomerSupport", component: CustomerSupport },
      {
        path: "/tickets/:id",
        name: "TicketInformation",
        component: TicketInformation,
        props: true
      },
      { path: "/event-detail/:id", name: "EventDetail", component: EventDetail, props: true },
      { path: "/ticket-payment", name: "TicketPayment", component: TicketPayment },
      { path: "/event-previewform", name: "EventReviewForm", component: EventReviewForm },
      { path: "/exlore-events", name: "ExploreEvents", component: ExploreEvents },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
