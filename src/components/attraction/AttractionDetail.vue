<template>
  <div class="childBox">
    <div>
      <img class="infoImage" :src="attraction.firstImage" />
    </div>
    <div class="titleContainer">
      <div>
        <p>{{ attraction.title }}</p>
        <p>{{ attraction.contentTypeId }}</p>
      </div>
      <div>
        <p>{{ attraction.rating }}</p>
        <p>{{ attraction.reviewCount }}</p>
      </div>
    </div>
    <div></div>
    <div class="contentContainer">
      <p>{{ attraction.address }}</p>
      <p>{{ attraction.overview }}</p>
    </div>
    <div class="reviewContainer"></div>
  </div>
  <button @click="close" class="closeBtn">Close</button>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { getAttractionId } from "@/api/attraction.js";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  attractionId: [String, Number],
});

const attraction = ref({});

async function getAttract(id) {
  getAttractionId(
    id,
    // 125266,
    (response) => {
      attraction.value = response.data;
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
