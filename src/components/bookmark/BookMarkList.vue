<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { selectFavorites } from "@/api/favorite";

import PageNavigation from "../common/PageNavigation.vue";
import BookMarkListItem from "./item/BookMarkListItem.vue";
import VSelect from "../common/VSelect.vue";

import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const router = useRouter();

const attractions = ref([]); // 즐겨찾기 목록들

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

const currentPage = ref(1);
const totalPage = ref(0);
const { VITE_BOOKMARK_LIST_SIZE } = import.meta.env;

const param = ref({
  id: userInfo.value.id,
  pgno: currentPage.value,
  spp: VITE_BOOKMARK_LIST_SIZE,
  key: "",
  word: "",
  filter: "newest",
});

const selectOption = ref([
  { text: "검색조건", value: "" },
  { text: "제목", value: "title" },
  { text: "내용", value: "content" },
  { text: "위치", value: "location" },
]);

const changeKey = (val) => {
  console.log("즐겨찾기에서 선택한 조건 : " + val);
  param.value.key = val;
};

const setFilter = (filter) => {
  param.value.filter = filter;
  getFavoriteList();
};

const onPageChange = (val) => {
  currentPage.value = val;
  param.value.pgno = val;
  getFavoriteList();
};

function getFavoriteList() {
  console.log(param.value);

  selectFavorites(
    sessionStorage.getItem("accessToken"),
    param.value,
    ({ data }) => {
      attractions.value = data.favorites;
      currentPage.value = data.currentPage;
      totalPage.value = data.totalPageCount;
      console.log(attractions);
    },
    (error) => {
      console.log("즐겨찾기 불러오는 중 에러 발생");
      console.log(error);
    }
  );
}

function closeBookMark() {
  getFavoriteList();
  console.log(attractions.value);
}

onMounted(() => {
  getFavoriteList();
});
</script>

<template>
  <div>
    <div class="container">
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
        <form class="search-form d-flex" @submit.prevent="getFavoriteList">
          <VSelect :selectOption="selectOption" @onKeySelect="changeKey" />
          <div class="input-group input-group-sm">
            <input
              type="text"
              class="form-control"
              v-model="param.word"
              placeholder="검색어를 입력해주세요."
            />
            <button class="btn btn-dark" type="button" @click="getFavoriteList">검색</button>
          </div>
        </form>
      </div>
      <div class="row">
        <div class="col-md-3" v-for="attraction in attractions" :key="attraction.id">
          <BookMarkListItem :bookmark-item="attraction" @closeChildBox="closeBookMark" />
        </div>
      </div>
      <PageNavigation
        :current-page="currentPage"
        :total-page="totalPage"
        @pageChange="onPageChange"
      ></PageNavigation>
    </div>
  </div>
</template>

<style scoped>
.filter-search-container {
  display: flex;
  justify-content: space-between;
}

.filters {
  display: flex;
  gap: 10px;
}

.filter-option {
  font-size: 14px;
  font-family: NanumSquareRound;
  padding: 8px 16px;
  background-color: #ebebeb;
  color: rgb(4, 4, 4);
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
}

.filter-selected {
  background-color: black;
  color: white;
}

.search-form {
  display: flex;
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

.write-btn {
  width: fit-content;
  background-color: #8280dd;
  border: 1px solid #8280dd;
  margin-top: 20px;
  margin-bottom: 30px;
  margin-right: 30px;
}
</style>
