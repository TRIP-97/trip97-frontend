<script setup>
import { ref, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  bookmarkItem: Object,
});

const bookmark = ref("");
onMounted(() => {
  bookmark.value = props.bookmarkItem;
  console.log("??", bookmark.value);
});

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
        <p class="writer-nickname mb-0 ms-2">{{ bookmark.title }}</p>
      </div>
      <div class="header-date mt-3">
        <div class="d-flex">
          <i class="travel-date-icon fa-solid fa-calendar"></i>
          <p class="travel-date-label mb-0">즐겨찾기 등록 날짜</p>
        </div>
        <p class="travel-date">{{ bookmark.createdAt }}</p>
      </div>
    </div>
    <div class="position-relative bookmark-image-area">
      <template v-if="bookmark.first_image === null">
        <img
          src="@/assets/images/no_image.png"
          class="card-img-top hotplace-image"
          alt="bookmark Image"
        />
      </template>
      <template v-else>
        <img :src="bookmark.first_image" class="bookmark-image" style="width: 300px" />
      </template>
    </div>
    <div class="card-body">
      <p class="card-title">{{ bookmark.title }}</p>
      <p class="card-content">{{ bookmark.address }}</p>
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
  background-color: #8280dd;
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
  font-size: 20px;
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
.travel-date-icon {
  color: gray;
}
.travel-date-label {
  margin-left: 3px;
  color: gray;
}
.travel-date {
  color: #8280dd;
}
.bookmark-image-area {
  height: 160px;
  overflow: hidden;
  /* border-radius: 10px; */
}
.bookmark-image {
  /* border-radius: 10px; */
  transition: transform 0.3s ease;
}
.bookmark-location {
  top: 10px;
  left: 10px;
  height: 25px;
  padding-top: 2px;
  padding-left: 10px;
  padding-right: 10px;
  color: #8280dd;
  background-color: white;
  border-radius: 10px;
  font-size: 14px;
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
