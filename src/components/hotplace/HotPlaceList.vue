<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listHotPlace } from "@/api/hotplace.js";

import axios from "axios";
import HotPlaceListItem from "./item/HotPlaceListItem.vue";

const hotPlaces = ref([]);
const router = useRouter();

// 핫플레이스 목록 조회
async function getHotPlaceList() {
  listHotPlace(
    (response) => {
      hotPlaces.value = response.data;
    },
    (error) => {
      console.log("HotPlaceList 불러오는 중 에러 발생!");
      console.dir(error);
    }
  );
}

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
    <h1 style="text-align: center; margin-bottom: 100px">HOTPLACE</h1>
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
        <HotPlaceListItem
          v-for="hotPlace in hotPlaces"
          :key="hotPlace.id"
          :hotPlace="hotPlace"
        ></HotPlaceListItem>
      </tbody>
    </table>
    <button class="btn btn-primary write-btn" @click="goWriteForm">글 작성</button>
  </div>
</template>

<style scoped></style>
