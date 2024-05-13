<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listGroup } from "@/api/group.js";

import GroupSideBar from "./item/GroupSideBar.vue";
import GroupListItem from "./item/GroupListItem.vue";
import PageNavigation from "../common/PageNavigation.vue";
import VSelect from "../common/VSelect.vue";

const router = useRouter();

const groups = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const { VITE_GROUP_LIST_SIZE } = import.meta.env;

const param = ref({
  pgno: currentPage.value,
  spp: VITE_GROUP_LIST_SIZE,
  key: "",
  word: "",
});

const selectOption = ref([
  { text: "검색조건", value: "" },
  { text: "제목", value: "title" },
  { text: "내용", value: "content" },
  { text: "위치", value: "location" },
  { text: "닉네임", value: "member_nickname" },
]);

const changeKey = (val) => {
  console.log("Group에서 선택한 조건 : " + val);
  param.value.key = val;
};

// 그룹 목록 조회
async function getGroupList() {
  listGroup(
    param.value,
    ({ data }) => {
      groups.value = data.groups;
      currentPage.value = data.currentPage;
      totalPage.value = data.totalPageCount;
    },
    (error) => {
      console.log("GroupList 불러오는 중 에러 발생!");
      console.dir(error);
    }
  );
}

const onPageChange = (val) => {
  currentPage.value = val;
  param.value.pgno = val;
  getGroupList();
};

function goWriteForm() {
  router.push({
    name: "groupWrite",
  });
}

onMounted(() => {
  console.log("check");
  getGroupList();
});
</script>

<template>
  <div class="list-container d-flex">
    <div class="margin-div"></div>

    <GroupSideBar />

    <div class="main-content flex-grow-1">
      <div class="search-container d-flex justify-content-end mb-3">
        <form class="search-form d-flex">
          <VSelect :selectOption="selectOption" @onKeySelect="changeKey" />
          <div class="input-group input-group-sm">
            <input
              type="text"
              class="form-control"
              v-model="param.word"
              placeholder="검색어를 입력해주세요."
            />
            <button class="btn btn-dark" type="button" @click="getGroupList">검색</button>
          </div>
        </form>
      </div>

      <div class="row content">
        <div class="col-md-3" v-for="group in groups" :key="group.id">
          <GroupListItem :group-item="group" />
        </div>
        <div class="row mt-3 justify-content-end">
          <button class="btn btn-primary write-btn" @click="goWriteForm">글 작성</button>
        </div>
        <PageNavigation
          :current-page="currentPage"
          :total-page="totalPage"
          @pageChange="onPageChange"
        ></PageNavigation>
      </div>
    </div>
  </div>
</template>

<style scoped>
.margin-div {
  height: 30px;
}

.list-container {
  display: flex;
  height: 100%;
}

.main-content {
  flex-grow: 1;
  padding: 20px; /* 메인 콘텐트에 패딩 추가 */
  overflow: auto; /* 필요한 경우 스크롤바 자동 추가 */
}

.search-container {
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
  background-color: #a3d8f4; /* 파스텔톤 하늘색 */
  color: white; /* 버튼 글씨 색상을 흰색으로 설정 */
  border: none; /* 테두리 제거 */
}

.search-form button:hover {
  background-color: #91c7e1; /* 마우스 오버 시 좀 더 진한 하늘색으로 변경 */
}
</style>
