import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/MainView.vue";
import LoginView from "@/views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";
import NaverCallBack from "@/components/callback/NaverCallBack.vue";
import HotPlaceView from "@/views/HotPlaceView.vue";
import GroupView from "@/views/GroupView.vue";

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
      redirect: { name: "hotPlaceList" },
      children: [
        {
          path: "list",
          name: "hotPlaceList",
          component: () => import("../components/hotplace/HotPlaceList.vue"),
        },
        {
          path: "detail/:id",
          name: "hotPlaceDetail",
          component: () => import("../components/hotplace/HotPlaceDetail.vue"),
        },
        {
          path: "write",
          name: "hotPlaceWrite",
          component: () => import("../components/hotplace/HotPlaceWrite.vue"),
        },
        {
          path: "modify/:id",
          name: "hotPlaceModify",
          component: () => import("../components/hotplace/HotPlaceModify.vue"),
        },
      ],
    },
    {
      path: "/group",
      name: "group",
      component: GroupView,
      redirect: { name: "groupList" },
      children: [
        {
          path: "list",
          name: "groupList",
          component: () => import("../components/group/GroupList.vue"),
        },
        {
          path: "detail/:id",
          name: "groupDetail",
          component: () => import("../components/group/GroupDetail.vue"),
        },
        {
          path: "write",
          name: "groupWrite",
          component: () => import("../components/group/GroupWrite.vue"),
        },
        {
          path: "modify/:id",
          name: "groupModify",
          component: () => import("../components/group/GroupModify.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from) => {
  if (to.name !== from.name) {
    document.dispatchEvent(new CustomEvent("route-changed"));
  }
});

export default router;
