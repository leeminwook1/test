import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Examples from "../components/Examples.vue";
import Technology from "../components/Technology.vue";
import FAQ from "../components/FAQ.vue";
import Feedback from "../components/Feedback.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/examples",
    name: "Examples",
    component: Examples,
  },
  {
    path: "/technology",
    name: "Technology",
    component: Technology,
  },
  {
    path: "/faq",
    name: "FAQ",
    component: FAQ,
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: Feedback,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
