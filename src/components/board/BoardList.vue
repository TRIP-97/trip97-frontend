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
  <div class="board-body d-flex flex-column align-items-center">
    <div class="board-container d-flex flex-column align-items-center">
      <h1></h1>
      <table class="board-list table table-hover">
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
          <tr
            @click="goDetail(board.id)"
            class="text-center"
            v-for="board in boards"
            :key="board.id"
          >
            <td>{{ board.id }}</td>
            <td>
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
    </div>
  </div>
  <div class="btnBox">
    <button class="writeBox" @click="goWrite">글작성</button>
  </div>
</template>

<style scoped>
table.board-list,
table.board-list th,
table.board-list td {
  background-color: transparent;
}

.board-container {
  width: 98%;
  justify-content: center;
  border-radius: 20px;
  background-color: white;
}

.writeBox {
  background-color: white;
  border-radius: 15px;
  width: 100px;
  height: 40px;
}

.btnBox {
  display: flex;
  justify-content: flex-end;
  margin-right: 40px;
  margin-top: 10px;
}
</style>
