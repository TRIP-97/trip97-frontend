<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id;
// const no = route.params.no;
const moveList = () => {
  // 목록 페이지로 이동
  // router.push("list"); // 일반적으로 사용, path방식
  router.push({ name: "boardList" });
};
</script>

<template>
  <div>
    <h2>게시판 상세</h2>
    <h3>글 번호 : {{ id }}</h3>
    <button @click="moveList">목록</button>
  </div>
</template>

<style scoped></style>
