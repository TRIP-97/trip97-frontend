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
  { text: "제목", value: "name" },
  { text: "내용", value: "overview" },
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

    <div class="main-content ml-5">
      <div class="search-container d-flex justify-content-end mb-3">
        <form class="search-form d-flex" @submit.prevent="getGroupList">
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

      <div class="row">
        <div class="col-lg-4 group-item" v-for="group in groups" :key="group.id">
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
  padding: 20px;
  gap: 16px;
}

.search-container {
  display: flex;
  justify-content: space-between;
}

.search-form {
  display: flex;
  gap: 10px;
}

.search-form button {
  background-color: #a3d8f4;
  color: white;
  border: none; 
}

.search-form button:hover {
  background-color: #91c7e1;
}

.write-btn {
  width: fit-content;
  margin-top: 20px;
  margin-bottom: 30px;
  margin-right: 30px;
}
</style>
