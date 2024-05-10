<script setup>
import { ref, defineProps } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  hotPlaceItem: Object,
});

const hotPlace = ref("");
hotPlace.value = props.hotPlaceItem;
hotPlace.value.visitedDate = formatVisitedDate(hotPlace.value.visitedDate);

// 날짜 포맷 변경 함수
function formatVisitedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
}
</script>

<template>
  <div class="card" style="width: 18rem">
    <div class="card-header bg-transparent d-flex align-items-center">
      <div class="d-flex align-items-center">
        <img src="@/assets/images/profile.png" style="width: 30px" />
        <p class="writer-nickname mb-0 ms-2">{{ hotPlace.writerNickname }}</p>
        <div class="custom-vr mx-3"></div>
      </div>
      <div class="header-date mt-3">
        <div class="d-flex">
          <i class="travel-date-icon fa-solid fa-calendar"></i>
          <p class="travel-date-label mb-0">여행 기간</p>
        </div>
        <p class="travel-date">{{ hotPlace.visitedDate }} ~ {{ hotPlace.visitedDate }}</p>
      </div>
    </div>
    <div class="position-relative">
      <img src="@/assets/images/fubao.jpg" class="card-img-top" alt="HotPlace Image" />
      <div
        class="hotplace-location position-absolute bg-white p-2 rounded-start rounded-end"
        style="top: 10px; left: 10px; height: 30px"
      >
        {{ hotPlace.location }}
      </div>
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ hotPlace.title }}</h5>
      <div class="d-flex justify-content-end align-items-center hotplace-info">
        <div class="d-flex">
          <i class="fa-solid fa-eye"></i>
          <p class="view-count card-text">{{ hotPlace.viewCount }}</p>
        </div>
        <div class="d-flex">
          <i class="fa-solid fa-heart"></i>
          <p class="like-count card-text">{{ hotPlace.likeCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  margin: 10px;
}
.card-header {
  height: 50px;
  font-size: 11px;
}
.card-title {
  font-size: 18px;
}
.custom-vr {
  border-left: 1px solid lightgray;
  height: 30px;
  align-self: center;
}
.writer-nickname {
  font-size: 13px;
}
.travel-date-icon {
  color: gray;
}
.travel-date-label {
  margin-left: 3px;
  color: gray;
}
.travel-date {
  color: #00a1fc;
}
.hotplace-info {
  color: gray;
  font-size: 16px;
}
.view-count,
.like-count {
  margin-left: 5px;
}

.fa-calendar {
  margin-top: 2px;
}
.fa-eye,
.fa-heart {
  margin-top: 3px;
  margin-left: 15px;
}
</style>
