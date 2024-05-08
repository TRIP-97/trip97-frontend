<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const hotPlaceId = ref(route.params.id);
const hotPlace = ref(null);

// 핫플레이스 게시글 조회
async function getHotPlace() {
  axios
    .get(`http://localhost:8080/hotplace/${hotPlaceId.value}`)
    .then((response) => {
      hotPlace.value = response.data;
    })
    .catch((error) => {
      console.log("HotPlace 게시글 불러오는 중 에러 발생!");
      console.dir(error);
    });
}

function goHotPlaceList() {
  router.push({ name: "hotPlaceList" });
}

onMounted(() => {
  getHotPlace();
});
</script>

<template>
  <div class="container mt-5">
    <h1>게시판 상세</h1>
    <div v-if="hotPlace" class="card">
      <!-- <img :src="hotPlace.writerProfileImage" class="card-img-top" alt="작성자 프로필 이미지"> -->
      <div class="card-body">
        <h5 class="card-title">{{ hotPlace.title }}</h5>
        <h6 class="card-subtitle mb-2 text-muted">작성자: {{ hotPlace.writerNickname }}</h6>
        <p class="card-text">{{ hotPlace.content }}</p>
        <p class="card-text">
          <small class="text-muted">작성일: {{ hotPlace.createdAt }}</small>
        </p>
        <p class="card-text">
          <small class="text-muted"
            >조회수: {{ hotPlace.viewCount }} | 좋아요 수: {{ hotPlace.likeCount }}</small
          >
        </p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">위도: {{ hotPlace.latitude }}</li>
        <li class="list-group-item">경도: {{ hotPlace.longitude }}</li>
      </ul>
    </div>
    <div v-else>
      <p>핫플레이스의 정보를 불러오는 중입니다...</p>
    </div>
    <button class="btn btn-primary list-btn" @click="goHotPlaceList">목록으로</button>
  </div>
</template>

<style scoped>
.list-btn {
  margin-top: 10px;
}
</style>
