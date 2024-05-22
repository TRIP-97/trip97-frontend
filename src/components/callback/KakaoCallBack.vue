<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { kakaoLogin } from "@/api/member";

onMounted(() => {
  const router = useRouter();
  const queryParams = new URLSearchParams(window.location.search);
  const query = ref({
    authorizationCode: queryParams.get("code"),
  });
  if (query.value.authorizationCode) {
    kakaoLogin(
      query.value,
      (response) => {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        console.log("로그인 성공!");
        router.replace({ name: "main" });
        document.dispatchEvent(new CustomEvent("login-event"));
      },
      (error) => {
        console.error("로그인 실패:", error);
        // 에러 처리
        router.push({ name: "main" });
      }
    );
  }
});
</script>

<template>
  <div></div>
</template>

<style scoped></style>
