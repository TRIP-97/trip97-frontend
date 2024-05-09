<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const boards = ref([
  {
    no: 3,
    title: "제목1",
    writer: "글쓴1",
  },
  {
    no: 2,
    title: "제목2",
    writer: "글쓴2",
  },
  {
    no: 1,
    title: "제목3",
    writer: "글쓴3",
  },
]);

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
</script>

<template>
  <div>
    <h2>게시판 목록</h2>
    <table>
      <tr>
        <th>번호</th>
        <th>제목</th>
        <th>작성자</th>
      </tr>
      <tr v-for="board in boards" :key="board.no">
        <td>{{ board.no }}</td>
        <td @click="goDetail(board.no)">
          <!-- <RouterLink :to="'detail?no=' + board.no">{{ board.title }}</RouterLink> -->
          <!-- <RouterLink :to="'/board/' + board.no">{{ board.title }}</RouterLink> -->
          <!-- <RouterLink :to="{ name: 'boarddetail', params: { id: board.no } }">{{board.title}}</RouterLink> -->
          <!-- <RouterLink :to="{ name: 'boarddetail', query: { id: board.no } }">{{board.title}}</RouterLink> -->
          {{ board.title }}
        </td>
        <td>{{ board.writer }}</td>
      </tr>
    </table>
    <button @click="goWrite">글작성</button>
  </div>
</template>

<style scoped></style>
