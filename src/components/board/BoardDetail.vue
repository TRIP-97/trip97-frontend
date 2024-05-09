<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailBoard } from "@/api/board.js";

import axios from "axios";

const route = useRoute();
const router = useRouter();
const board = ref("");

const no = route.params.id;
// const no = route.params.no;

async function getBoard(){
  detailBoard(no,
    (response) => {
      board.value = response.data;
    },
    (error) => {
      console.log("Board 불러오는 중 에러 발생");
      console.dir(error);
    }
  )
}

const moveList = () => {
  // 목록 페이지로 이동
  // router.push("list"); // 일반적으로 사용, path방식
  router.push({ name: "boardList" });
};

onMounted(()=>{
  getBoard();
});
</script>

<template>
  <div>
    <h2>게시판 상세</h2>
    <h3>글 번호 : {{ board.id }}</h3>
    <h2>글 내용</h2>
    <p>{{ board.content }}</p>
    <button @click="moveList">목록</button>
  </div>
</template>

<style scoped></style>
