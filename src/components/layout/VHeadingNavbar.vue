// VHeadingNavbar.vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { getMemberProfile } from "@/api/member";

const router = useRouter();
const isLoggedIn = ref(false);
const nickname = ref("");

const logout = () => {
  // 세션 스토리지에서 accessToken 삭제
  localStorage.removeItem("accessToken");
  isLoggedIn.value = false;
  nickname.value = "";
  router.push({ name: "main" });
};

const fetchProfile = async () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const response = await getMemberProfile(token);

      if (response.data) {
        isLoggedIn.value = true;
        nickname.value = response.data.nickname;
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
  // fetchProfile();
  document.addEventListener("route-changed", handleRouteChange);
});

onUnmounted(() => {
  document.removeEventListener("route-changed", handleRouteChange);
});
</script>

<template>
  <div>
    <header class="navbar navbar-expand-md shadow bg-light navbar-light fixed-top">
      <div class="container-fluid">
        <RouterLink class="navbar-brand logo text-primary fw-bold" :to="{ name: 'main' }">
          Trip 97
        </RouterLink>
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
          <ul class="navbar-nav content-menu me-auto ms-5">
            <li class="nav-item menu-item">
              <RouterLink class="nav-link" style="cursor: pointer" :to="{name : 'attraction'}">
                <i class="fa-solid fa-earth-asia"></i>
                여행 지도
              </RouterLink>
            </li>
            <template v-if="isLoggedIn">
              <li class="nav-item menu-item">
                <RouterLink class="nav-link" style="cursor: pointer" :to="{ name: 'group' }">
                  <i class="fa-solid fa-paper-plane"></i>
                  여행 계획
                </RouterLink>
              </li>
            </template>
            <li class="nav-item menu-item">
              <RouterLink class="nav-link" style="cursor: pointer" :to="{name : 'board'}">
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
            <template v-if="!isLoggedIn">
              <li class="nav-item">
                <RouterLink
                  class="nav-link"
                  style="cursor: pointer"
                  v-if="!isLoggedIn"
                  :to="{ name: 'login' }"
                  >로그인</RouterLink
                >
              </li>
            </template>
            <template v-if="isLoggedIn">
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="@/assets/images/profile.png"
                    alt="프로필 이미지"
                    class="profile-image"
                    style="height: 30px; margin-right: 5px"
                  />
                  {{ nickname }}
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <li class="dropdown-item">
                    <RouterLink class="header-dropdown" :to="{ name: 'profile' }" v-if="isLoggedIn"
                      >마이페이지</RouterLink
                    >
                  </li>
                  <li>
                    <a class="header-dropdown dropdown-item" @click="logout" v-if="isLoggedIn"
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
.nav-item.menu-item .nav-link {
  color: #00a1fc;
}

.header-dropdown {
  color: gray;
  text-decoration: none;
  cursor: pointer;
}

.header-dropdown:hover {
  color: gray;
  text-decoration: none;
}

.logo {
  font-family: NanumSquareRound;
  margin-left: 120px;
}

.navbar-nav {
  margin-right: 120px;
}
</style>
