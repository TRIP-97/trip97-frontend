<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { listBoard } from "@/api/board.js";

import axios from "axios";
import PageNavigation from "../common/PageNavigation.vue";
import VSelect from "../common/VSelect.vue";

import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

const router = useRouter();

const boards = ref([]);

const currentPage = ref(1);
const totalPage = ref(0);
const { VITE_BOARD_LIST_SIZE } = import.meta.env;

const param = ref({
  pgno: currentPage.value,
  spp: VITE_BOARD_LIST_SIZE,
  key: "",
  word: "",
  filter: "newest",
});

const selectOption = ref([
  { text: "검색조건", value: "" },
  { text: "제목", value: "title" },
  { text: "내용", value: "content" },
  { text: "작성자", value: "writer" },
]);

const changeKey = (val) => {
  console.log("즐겨찾기에서 선택한 조건 : " + val);
  param.value.key = val;
  getBoardList();
};

const setFilter = (filter) => {
  param.value.filter = filter;
  getBoardList();
};

const onPageChange = (val) => {
  currentPage.value = val;
  param.value.pgno = val;
  getBoardList();
};

async function getBoardList() {
  listBoard(
    param.value,
    ({ data }) => {
      boards.value = data.list;
      currentPage.value = data.currentPage;
      totalPage.value = data.totalPageCount;
      console.log("게시물들");
      console.log(boards.value);
      if (Array.isArray(boards.value)) {
        for (let board of boards.value) {
          board.createdAt = formatVisitedDate(board.createdAt);
        }
      }
    },
    (error) => {
      console.log("BoardList 불러오는 중 에러 발생");
      console.dir(error);
    }
  );
}

// 날짜 포맷 변경 함수
function formatVisitedDate(dateString) {
  const [datePart, timePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
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

watch([currentPage, param], () => {
  getBoardList();
});
</script>

<template>
  <div class="board-body d-flex flex-column align-items-center">
    <div class="board-container d-flex flex-column align-items-center">
      <div class="filter-search-container d-flex justify-content-between mb-3">
        <div class="filters">
          <div
            :class="{ 'filter-selected': param.filter === 'newest' }"
            class="filter-option"
            @click="setFilter('newest')"
          >
            최신 순
          </div>
          <div
            :class="{ 'filter-selected': param.filter === 'oldest' }"
            class="filter-option"
            @click="setFilter('oldest')"
          >
            오래된 순
          </div>
        </div>
        <form class="search-form d-flex" @submit.prevent="getBoardList">
          <VSelect :selectOption="selectOption" @onKeySelect="changeKey" />
          <div class="input-group input-group-sm">
            <input
              type="text"
              class="form-control"
              v-model="param.word"
              placeholder="검색어를 입력해주세요."
            />
            <button class="btn btn-dark" type="button" @click="getBoardList">검색</button>
          </div>
        </form>
      </div>
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
    <PageNavigation
      :current-page="currentPage"
      :total-page="totalPage"
      @pageChange="onPageChange"
    ></PageNavigation>
  </div>
  <div v-if="userInfo" class="btnBox">
    <button class="writeBox" @click="goWrite">글작성</button>
  </div>
</template>

<style scoped>
table.board-list,
table.board-list th,
table.board-list td {
  background-color: transparent;
}

.filter-search-container {
  width: 98%;
}

.filters {
  display: flex;
  justify-content: left;
  gap: 10px;
}

.filter-option {
  font-size: 14px;
  font-family: NanumSquareRound;
  padding: 8px 16px;
  background-color: #8280dd;
  color: rgb(255, 255, 255);
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
}

.filter-selected {
  background-color: #615fac;
  color: white;
}

.input-group {
  width: 500px;
}

.form-control {
  width: 300px;
}

.search-form {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.search-form button {
  background-color: #8280dd;
  color: white;
  border: none;
}

.search-form button:hover {
  background-color: #6b6ab8;
}

.board-container {
  width: 98%;
  padding: 15px;
  margin-bottom: 20px;
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
