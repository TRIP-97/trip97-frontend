<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

onMounted(() => {
  const router = useRouter();
  const queryParams = new URLSearchParams(window.location.search);
  const authorizationCode = queryParams.get("code");
  const state = queryParams.get("state");
  console.log(authorizationCode);

  if (authorizationCode && state) {
    axios
      .post("http://localhost:8080/member/login/naver", { authorizationCode, state })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.accessToken);
        console.log("로그인 성공:", response.data);
        router.push({ name: "main" });
        document.dispatchEvent(new CustomEvent("login-event"));
      })
      .catch((error) => {
        console.error("로그인 실패:", error);
        // 에러 처리
        router.push({ name: "main" });
      });
  }
});
</script>

<template>
  <div></div>
</template>

<style scoped></style>
