<script setup>
  import { ref, defineProps } from "vue";
  import { useRouter } from "vue-router";

  const router = useRouter();

  const props = defineProps({
    hotPlaceItem: Object,
  });

  const hotPlace = ref("");
  hotPlace.value = props.hotPlaceItem;
  hotPlace.value.startDate = formatVisitedDate(hotPlace.value.startDate);
  hotPlace.value.endDate = formatVisitedDate(hotPlace.value.endDate);

  // 날짜 포맷 변경 함수
  function formatVisitedDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
  }

  function goHotPlaceDetail() {
    router.push({
      name: "hotPlaceDetail",
      params: { id: hotPlace.value.id },
    });
  }
</script>

<template>
  <div class="card" @click="goHotPlaceDetail" style="width: 18rem">
    <div class="card-header bg-transparent d-flex align-items-center">
      <div class="d-flex align-items-center">
        <img v-if="hotPlace.writerProfileImage === null" src="@/assets/images/profile.png" alt="Profile" class="profile-image">
        <img v-else :src="hotPlace.writerProfileImage" alt="" class="profile-image">
        <p class="writer-nickname mb-0 ms-2">{{ hotPlace.writerNickname }}</p>
        <div class="custom-vr mx-3"></div>
      </div>
      <div class="header-date mt-3">
        <div class="d-flex">
          <i class="travel-date-icon fa-solid fa-calendar"></i>
          <p class="travel-date-label mb-0">여행 기간</p>
        </div>
        <p class="travel-date">{{ hotPlace.startDate }} ~ {{ hotPlace.endDate }}</p>
      </div>
    </div>
    <div class="position-relative hotplace-image-area">
      <template v-if="hotPlace.fileInfos === null">
        <img
          src="@/assets/images/fubao.jpg"
          class="card-img-top hotplace-image"
          alt="HotPlace Image"
        />
      </template>
      <template v-else>
        <img :src="hotPlace.fileInfos[0].url" class="hotplace-image" style="width: 300px" />
      </template>
      <div class="hotplace-location position-absolute">
        <i class="fa-solid fa-location-dot"></i>
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
    overflow: hidden;
    cursor: pointer;
  }
  .card:hover .hotplace-location {
    color: white;
    background-color: #00a1fc;
  }
  .card:hover .hotplace-image {
    transform: scale(1.15);
    transition: transform 0.3s ease;
  }

  .card-header {
    height: 50px;
    font-size: 11px;
    border-bottom: none;
  }
  .card-title {
    font-size: 17px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    height: 1.5em;
  }
  .custom-vr {
    border-left: 1px solid lightgray;
    height: 30px;
    align-self: center;
  }
  .profile-image {
    border-radius: 50%;
    width: 30px;
    height: 30px;
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
  .hotplace-image-area {
    height: 160px;
    overflow: hidden;
    border-radius: 10px;
  }
  .hotplace-image {
    border-radius: 10px;
    transition: transform 0.3s ease;
  }
  .hotplace-location {
    top: 10px;
    left: 10px;
    height: 25px;
    padding-top: 2px;
    padding-left: 10px;
    padding-right: 10px;
    color: #00a1fc;
    background-color: white;
    border-radius: 10px;
    font-size: 14px;
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
