<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listHotPlace } from "@/api/hotplace.js";

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
    <div class="container">
      <h1 style="text-align: center; margin-bottom: 100px">HOTPLACE</h1>
      <div class="row">
        <div class="col-md-3" v-for="hotPlace in hotPlaces" :key="hotPlace.id">
          <HotPlaceListItem :hot-place-item="hotPlace" />
        </div>
      </div>
      <button class="btn btn-primary write-btn" @click="goWriteForm">글 작성</button>
    </div>
  </div>
</template>

<style scoped></style>
