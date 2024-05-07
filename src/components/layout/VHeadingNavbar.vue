// VHeadingNavbar.vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import axios from "axios";

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
      const response = await axios.get("http://localhost:8080/member/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  fetchProfile();
  document.addEventListener("route-changed", handleRouteChange);
});

onUnmounted(() => {
  document.removeEventListener("route-changed", handleRouteChange);
});
</script>

<template>
  <div>
    <h1>헤더입니다!</h1>
    <RouterLink v-if="!isLoggedIn" :to="{ name: 'login' }">로그인</RouterLink>
    <br />
    <RouterLink :to="{ name: 'profile' }" v-if="isLoggedIn">프로필</RouterLink>
    <button @click="logout" v-if="isLoggedIn" class="logout-btn">로그아웃</button>
    <div v-if="isLoggedIn">{{ nickname }} 님 환영합니다!!!</div>
    <hr />
  </div>
</template>

<style scoped>
.logout-btn {
  margin-left: 10px;
}
</style>
