<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const memberInfo = ref({
  email: "",
  nickname: "",
});

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem("accessToken");
  console.log("프로필 요청시 보내는 토큰: ", token);
  axios
    .get("http://localhost:8080/member/profile", { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      console.log("회원 정보:", response.data);
      memberInfo.value.nickname = response.data.nickname;
      memberInfo.value.email = response.data.email;
      console.log(response.data);
    })
    .catch((error) => {
      console.error("회원 정보 가져오기 실패:", error);
      // 에러 처리 로직
    });
});

const goMainView = () => {
  router.push({ name: "main" });
};
</script>

<template>
  <div>
    <h1>프로필 화면입니다!!!</h1>
    <div>
      <p>닉네임: {{ memberInfo.nickname }}</p>
      <p>이메일: {{ memberInfo.email }}</p>
    </div>
    <button @click.prevent="goMainView">메인화면으로</button>
  </div>
</template>

<style scoped></style>
