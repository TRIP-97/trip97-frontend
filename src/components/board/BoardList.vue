<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listBoard } from "@/api/board.js";

import axios from "axios";

const router = useRouter();

const boards = ref([]);

async function getBoardList() {
  listBoard(
    (response) => {
      boards.value = response.data;
      console.log(boards.value);
    },
    (error) => {
      console.log("BoardList 불러오는 중 에러 발생");
      console.dir(error);
    }
  );
}

function goDetail(no) {
  router.push({
    name: "boardDetail",
    params: { id: no },
  });
}

function goWrite() {
  router.push({
    name: "boardWrite",
  });
}

onMounted(() => {
  getBoardList();
});
</script>

<template>
  <div>
    <h1>게시판 목록</h1>
    <table class="table table-hover">
      <thead>
        <tr class="text-center">
          <th scope="col">글번호</th>
          <th scope="col">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">작성일</th>
          <th scope="col">조회수</th>
          <th scope="col">좋아요</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="board in boards" :key="board.id">
          <td>{{ board.id }}</td>
          <td @click="goDetail(board.id)">
            <!-- <RouterLink :to="'detail?no=' + board.no">{{ board.title }}</RouterLink> -->
            <!-- <RouterLink :to="'/board/' + board.no">{{ board.title }}</RouterLink> -->
            <!-- <RouterLink :to="{ name: 'boarddetail', params: { id: board.no } }">{{board.title}}</RouterLink> -->
            <!-- <RouterLink :to="{ name: 'boarddetail', query: { id: board.no } }">{{board.title}}</RouterLink> -->
            {{ board.title }}
          </td>
          <td>{{ board.writerNickname }}</td>
          <td>{{ board.createdAt }}</td>
          <td>{{ board.viewCount }}</td>
          <td>{{ board.likeCount }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="goWrite">글작성</button>
  </div>
</template>

<style scoped></style>
