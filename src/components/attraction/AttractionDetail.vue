<template>
  <div class="childBox d-flex flex-column">
    <div class="attract d-flex flex-row">
      <div v-if="attraction && attraction.firstImage != ''">
        <img class="infoImage" :src="attraction.firstImage" />
      </div>
      <div v-else>
        <img class="infoImage" src="@/assets/images/no_image.png" />
      </div>
      <div class="infoText">
        <div class="first mb-2">
          <p class="title">{{ attraction.title }}</p>
          <p class="contentType mt-3 ms-2">{{ props.attractionContent }}</p>
          <button @click="close" class="closeBtn">Close</button>
        </div>
        <div class="d-flex flex-direction-row">
          <div v-if="attraction.rating !== undefined && attraction.rating !== null">
            <img
              v-for="n in attraction.rating % 5"
              :key="'star' + n"
              class="infoStar"
              src="@/assets/images/RaitingStar.png"
              alt="Star"
            />
            <img
              v-for="n in 5 - (attraction.rating % 5)"
              :key="'noStar' + n"
              class="infoStar"
              src="@/assets/images/RaitingNoStar.png"
              alt="No Star"
            />
          </div>
          <p class="reviewCount ml-5">리뷰 {{ attraction.reviewCount }}</p>
        </div>
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
import "bootstrap/dist/css/bootstrap.min.css";

const props = defineProps({
  attractionId: [String, Number],
  attractionContent: String,
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
