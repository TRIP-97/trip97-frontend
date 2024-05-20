import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/MainView.vue";
import LoginView from "@/views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";
import NaverCallBack from "@/components/callback/NaverCallBack.vue";
import KakaoCallBack from '@/components/callback/KakaoCallBack.vue'
import HotPlaceView from "@/views/HotPlaceView.vue";
import GroupView from "@/views/GroupView.vue";
import PlanView from "@/views/PlanView.vue";
import BoardView from "@/views/BoardView.vue";
import AttractionView from "@/views/AttractionView.vue";
import FriendView from "@/views/FriendView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
      meta : { showHeader : false},
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta : { showHeader : true },
    },
    {
      path: "/naver/callback",
      name: "naverCallBack",
      component: NaverCallBack,
      meta : { showHeader : true },
    },
    {
      path : "/kakao/callback",
      name : "kakaoCallBack",
      component : KakaoCallBack,
      meta : {showHeader : true},
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta : { showHeader : true },
      redirect: { name: "profileDetail" },
      children: [
        {
          path: "/detail",
          name: "profileDetail",
          component: () => import("../components/profile/ProfileDetail.vue"),
        },
        {
          path: "/modify",
          name: "profileModify",
          component: () => import("../components/profile/ProfileModify.vue"),
        }
      ]
    },
    {
      path: "/hotplace",
      name: "hotPlace",
      component: HotPlaceView,
      meta : { showHeader : true },
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
      meta : { showHeader : true },
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
        {
          path: "myList",
          name: "myGroupList",
          component: () => import("../components/group/MyGroupList.vue"),
        },
        {
          path: "myDetail/:id",
          name: "myGroupDetail",
          component: () => import("../components/group/MyGroupDetail.vue"),
        },
        {
          path: "myRequest",
          name: "myGroupRequest",
          component: () => import("../components/group/MyGroupRequest.vue"),
        },
        {
          path: "myInvitedRequest",
          name: "myInvitedGroupRequest",
          component: () => import("../components/group/MyInvitedGroupRequest.vue"),
        },
      ],
    },
    {
      path: "/group/:groupId/plan/:planId",
      name: "plan",
      component: PlanView,
      meta : { showHeader : true },
    },
    {
      path: "/board",
      name: "board",
      component: BoardView,
      meta : { showHeader : true },
      redirect: { name: "boardList" },
      children: [
        {
          path: "/",
          name: "boardList",
          component: () => import("../components/board/BoardList.vue"),
        },
        {
          path: "/:id",
          name: "boardDetail",
          component: () => import("../components/board/BoardDetail.vue"),
        },
        {
          path: "/",
          name: "boardWrite",
          component: () => import("../components/board/BoardWrite.vue"),
        },
        {
          path: "/:id",
          name: "boardModify",
          component: () => import("../components/board/BoardModify.vue"),
        },
      ],
    },
    {
      path: "/attraction",
      name: "attraction",
      component: AttractionView,
      meta : { showHeader : true },
      redirect: { name: "attractionList" },
      children: [
        {
          path: "/",
          name: "attractionList",
          component: () => import("../components/attraction/AttractionList.vue"),
        },
      ],
    },
    {
      path: "/friend",
      name: "friend",
      component: FriendView,
      meta : { showHeader : true },
      redirect: { name: "friendList" },
      children: [
        {
          path: "list",
          name: "friendList",
          component: () => import("../components/friend/FriendList.vue"),
        },
        {
          path: "/request/list",
          name: "friendRequestList",
          component: () => import("../components/friend/FriendRequestList.vue"),
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