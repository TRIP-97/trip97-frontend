<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { listHotPlace } from "@/api/hotplace.js";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";

  import HotPlaceListItem from "./item/HotPlaceListItem.vue";
  import PageNavigation from "../common/PageNavigation.vue";
  import VSelect from "../common/VSelect.vue";

  const router = useRouter();

  const hotPlaces = ref([]);
  const currentPage = ref(1);
  const totalPage = ref(0);
  const { VITE_HOTPLACE_LIST_SIZE } = import.meta.env;

  const memberStore = useMemberStore();
  const { isLogin } = storeToRefs(memberStore);

  const param = ref({
    pgno: currentPage.value,
    spp: VITE_HOTPLACE_LIST_SIZE,
    key: "",
    word: "",
    filter: "createdDate",
  });

  const selectOption = ref([
    { text: "검색조건", value: "" },
    { text: "제목", value: "title" },
    { text: "내용", value: "content" },
    { text: "위치", value: "location" },
    { text: "닉네임", value: "member_nickname" },
  ]);

  const changeKey = (val) => {
    console.log("HotPlaceList에서 선택한 조건 : " + val);
    param.value.key = val;
  };

  const setFilter = (filter) => {
    param.value.filter = filter;
    getHotPlaceList();
  };

  // 핫플레이스 목록 조회
  async function getHotPlaceList() {
    listHotPlace(
      param.value,
      ({ data }) => {
        hotPlaces.value = data.hotPlaces;
        currentPage.value = data.currentPage;
        totalPage.value = data.totalPageCount;
      },
      (error) => {
        console.log("HotPlaceList 불러오는 중 에러 발생!");
        console.dir(error);
      }
    );
  }

  const onPageChange = (val) => {
    currentPage.value = val;
    param.value.pgno = val;
    getHotPlaceList();
  };

  function goWriteForm() {
    router.push({
      name: "hotPlaceWrite",
    });
  }

  onMounted(() => {
    getHotPlaceList();
  });
</script>

<template>
  <div>
    <div class="container">
      <div class="filter-search-container d-flex justify-content-between mb-3">
        <div class="filters">
          <div
            :class="{ 'filter-selected': param.filter === 'createdDate' }"
            class="filter-option"
            @click="setFilter('createdDate')"
          >
            최신 순
          </div>
          <div
            :class="{ 'filter-selected': param.filter === 'viewCount' }"
            class="filter-option"
            @click="setFilter('viewCount')"
          >
            조회수 순
          </div>
          <div
            :class="{ 'filter-selected': param.filter === 'likeCount' }"
            class="filter-option"
            @click="setFilter('likeCount')"
          >
            좋아요 순
          </div>
        </div>
        <form class="search-form d-flex" @submit.prevent="getHotPlaceList">
          <VSelect :selectOption="selectOption" @onKeySelect="changeKey" />
          <div class="input-group input-group-sm">
            <input
              type="text"
              class="form-control"
              v-model="param.word"
              placeholder="검색어를 입력해주세요."
            />
            <button class="btn btn-dark" type="button" @click="getHotPlaceList">검색</button>
          </div>
        </form>
      </div>

      <div class="row">
        <div class="col-md-3" v-for="hotPlace in hotPlaces" :key="hotPlace.id">
          <HotPlaceListItem :hot-place-item="hotPlace" />
        </div>
      </div>
      <div class="row mt-3 justify-content-end">
        <button v-if="isLogin" class="btn btn-primary write-btn" @click="goWriteForm">
          글 작성
        </button>
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
