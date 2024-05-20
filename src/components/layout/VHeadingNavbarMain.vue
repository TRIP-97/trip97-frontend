<script setup>

import { ref,onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { getMemberProfile } from "@/api/member";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

import blackIcon from '@/assets/images/profileDropBlack.png';
import whiteIcon from '@/assets/images/profileDropWhite.png';

const router = useRouter();

const memberStore = useMemberStore();

const dropdownIconSrc = ref(whiteIcon);

const toggleDropdownIcon = (isHovered) => {
  dropdownIconSrc.value = isHovered ? blackIcon : whiteIcon;
};

const { isLogin, userInfo } = storeToRefs(memberStore);

const logout = () => {
  // 세션 스토리지에서 accessToken 삭제
  sessionStorage.removeItem("accessToken");
  isLogin.value = false;
  userInfo.value = null;
  router.push({ name: "main" });
};

const fetchProfile = async () => {
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    try {
      const response = await getMemberProfile(token);

      if (response.data) {
        isLogin.value = true;
        userInfo.value = response.data;
      }
      } catch (error) {
        console.error("프로필 정보 조회 실패:", error);
        logout(); // 토큰이 유효하지 않은 경우 로그아웃 처리
      }
    }
  };

  const handleRouteChange = () => {
    fetchProfile();
  };

  onMounted(() => {
    document.addEventListener("route-changed", handleRouteChange);
  });

  onUnmounted(() => {
    document.removeEventListener("route-changed", handleRouteChange);
  });
</script>

<template>
  <div>
    <header class="navbar navbar-expand-md bg-transparent-custom navbar-light fixed-top">
      <div class="container-fluid">
        <!-- <RouterLink class="navbar-brand logo text-primary fw-bold" :to="{ name: 'main' }">
          Trip 97
        </RouterLink> -->
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
          <ul class="navbar-nav content-menu mx-auto">
            <li class="nav-item menu-item">
              <RouterLink class="nav-link" style="cursor: pointer" :to="{ name: 'attraction' }">
                <i class="fa-solid fa-earth-asia"></i>
                여행 지도
              </RouterLink>
            </li>
            <template v-if="isLogin">
              <li class="nav-item menu-item">
                <RouterLink class="nav-link" style="cursor: pointer" :to="{ name: 'group' }">
                  <i class="fa-solid fa-paper-plane"></i>
                  여행 계획
                </RouterLink>
              </li>
            </template>
            <li class="nav-item menu-item">
              <RouterLink class="nav-link" style="cursor: pointer" :to="{ name: 'board' }">
                <i class="fa-solid fa-user-group"></i>
                여행 커뮤니티
              </RouterLink>
            </li>
            <li class="nav-item menu-item">
              <RouterLink class="nav-link" style="cursor: pointer" :to="{ name: 'hotPlace' }">
                <i class="fa-solid fa-martini-glass-citrus"></i>
                HOTPLACE
              </RouterLink>
            </li>
          </ul>
          <ul class="navbar-nav member-menu ms-auto">
            <template v-if="!isLogin">
              <li class="nav-item">
                <RouterLink class="nav-link" style="cursor: pointer" :to="{ name: 'login' }">
                  로그인
                </RouterLink>
              </li>
            </template>
            <template v-if="isLogin">
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  @mouseover="toggleDropdownIcon(true)"
                  @mouseout="toggleDropdownIcon(false)"
                >
                  <img
                    :src="userInfo.profileImage"
                    alt="프로필 이미지"
                    class="profile-image"
                  />
                  {{ userInfo.nickname }}
                  <img 
                  :src="dropdownIconSrc"
                  alt = "드롭다운 아이콘"
                  class="profile-drop"/>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <li class="dropdown-item">
                    <RouterLink class="header-dropdown" :to="{ name: 'profile' }" v-if="isLogin"
                      >마이페이지</RouterLink
                    >
                  </li>
                  <li class="dropdown-item">
                    <RouterLink class="header-dropdown" :to="{ name: 'friend' }" v-if="isLogin"
                      >내 친구</RouterLink
                    >
                  </li>
                  <li>
                    <a class="header-dropdown dropdown-item" @click="logout" v-if="isLogin"
                      >로그아웃</a
                    >
                  </li>
                </ul>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped>
@import "@/assets/css/style.css";

.navbar {
    padding : 8px;
    margin-top : 10px;
}

.bg-transparent-custom {
  background-color: rgb(255, 255, 255,0); /* 배경을 반투명하게 설정 */
}

.navbar-nav .nav-item .nav-link {
  color: white; /* 네비게이션 링크 색상 */
  padding: 10px 15px; /* 패딩 추가 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

.nav-item {
  font-size: 23px;
  /* text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); */
  width: 343px;
}

.navbar-nav {
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar-nav .nav-item .nav-link:hover {
  color: #ccc; /* 링크 호버 시 색상 */
}

.profile-image {
  height: 30px;
  margin-right: 5px;
  border-radius: 50%; /* 프로필 이미지 둥글게 설정 */
}

.header-dropdown {
  color: black; /* 드롭다운 링크 색상 */
}

.dropdown-menu {
  background-color: rgba(255, 255, 255, 0.9); /* 드롭다운 메뉴 배경 반투명하게 설정 */
}

.dropdown-item:hover{
  background-color: rgba(0, 0, 0, 0.1); /* 드롭다운 항목 호버 시 배경색 */
}

.nav-link.dropdown-toggle::after {
  display: none;
}

.nav-link.dropdown-toggle {
  display: flex;
  align-items: center;
}

.nickname {
  margin-right: 5px;
}

.profile-drop {
  height : 20px;
}

.member-menu {
  width : 200px;
}

.navbar-brand.logo {
  margin-left: 40px;
  color: black !important;
  font-weight: bold;
  font-family: "PassionOneBold", sans-serif;
  font-size: 40px; /* 로고 텍스트 크기 */
}

.navbar-brand.logo:hover {
  color: #ccc; /* 로고 텍스트 호버 시 색상 */
}

.text-primary {
  color: inherit; /* 기본 색상을 상속 */
}
</style>
