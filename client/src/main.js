import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/style.css"; // nếu muốn
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "primeicons/primeicons.css";
import "leaflet/dist/leaflet.css";

createApp(App).use(router).mount("#app");
