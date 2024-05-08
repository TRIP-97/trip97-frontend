import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/MainView.vue";
import LoginView from "@/views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";
import NaverCallBack from "@/components/callback/NaverCallBack.vue";
import HotPlaceView from "@/views/HotPlaceView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/naver/callback",
      name: "naverCallBack",
      component: NaverCallBack,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/hotplace",
      name: "hotPlace",
      component: HotPlaceView,
    },
  ],
});

router.afterEach((to, from) => {
  if (to.name !== from.name) {
    document.dispatchEvent(new CustomEvent("route-changed"));
  }
});

export default router;
