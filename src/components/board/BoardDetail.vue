<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailBoard, deleteBoard } from "@/api/board.js";

import axios from "axios";

const route = useRoute();
const router = useRouter();
const board = ref("");

const no = route.params.id;
// const no = route.params.no;

async function getBoard() {
  detailBoard(
    no,
    (response) => {
      board.value = response.data;
    },
    (error) => {
      console.log("Board 불러오는 중 에러 발생");
      console.dir(error);
    }
  );
}

async function removeBoard() {
  deleteBoard(
    no,
    (response) => {
      console.log(response);
    },
    (error) => {
      console.log("Board 삭제중 에러");
      console.dir(error);
    }
  );
}

const moveList = () => {
  // 목록 페이지로 이동
  // router.push("list"); // 일반적으로 사용, path방식
  router.push({ name: "boardList" });
};

const moveModify = () => {
  router.push({ name: "boardModify" });
};

const moveDelete = () => {
  removeBoard();
};

onMounted(() => {
  getBoard();
});
</script>

<template>
  <div class="d-flex flex-column justify-content-center">
    <h2>제목 : {{ board.title }}</h2>
    <p>번호 : {{ board.id }}</p>
    <h2>내용</h2>
    <p>{{ board.content }}</p>
    <div class="d-flex flex-row">
      <button @click="moveList">목록</button>
      <button @click="moveModify">수정</button>
      <button @click="moveDelete">삭제</button>
    </div>
  </div>
</template>

<style scoped></style>
