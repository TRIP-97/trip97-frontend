<template>
  <div class="childBox d-flex flex-column">
  <div class="attract d-flex flex-row">
    <img class="infoImage" :src="attraction.firstImage" />
    <div class="infoText">
      <div class="first">
        <p class="title">{{ attraction.title }}</p>
        <p class="contentType ms-2">{{ props.attractionContent }}</p>
        <button @click="close" class="closeBtn">Close</button>
      </div>
      <p class="rating">평점: {{ attraction.rating }}</p>
      <p class="reviewCount">리뷰 수: {{ attraction.reviewCount }}</p>
      <p class="address">{{ attraction.address }}</p>
      <p class="overview">{{ attraction.overview }}</p>
    </div>
  </div>
    <div class="reviewContainer">
      <h1>리뷰</h1>
      <p>작성된 리뷰가 없습니다</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { getAttractionId } from "@/api/attraction.js";
import { defineProps, defineEmits } from "vue";
import 'bootstrap/dist/css/bootstrap.min.css';

const props = defineProps({
  attractionId: [String, Number],
  attractionContent : String,
});

const attraction = ref({});

async function getAttract(id) {
  getAttractionId(
    id,
    // 125266,
    (response) => {
      attraction.value = response.data;
      console.log(props.attractionContent);
    },
    (error) => {
      console.log("관광지 불러오는 중 에러 발생");
      console.dir(error);
    }
  );
}

watch(
  () => props.attractionId,
  (newId) => {
    getAttract(newId);
  }
);

onMounted(() => {
  getAttract(props.attractionId);
});

const emits = defineEmits(["close"]);
const close = () => {
  emits("close");
};
</script>

<style scoped>
@import "@/assets/css/attraction/attractionDetail.css";
</style>
