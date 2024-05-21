<template>
  <div class="header-image">
    <video ref="videoPlayer" @ended="handleVideoEnded" :src="videoSrc" autoplay muted loop></video>
    <div class="gradient-overlay"></div>
    <div class="overlay">
      <h1 class="pageTitle">404 Not Found</h1>
      <div class="link">
        <router-link to="/">메인화면으로 이동하기</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";

import videoFile from "@/assets/images/211661_medium.mp4";

const videoPlayer = ref(null);
const videoSrc = videoFile;

const handleVideoEnded = () => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = 0;
    videoPlayer.value.play();
  }
};

onMounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.play();
  }
});
</script>

<style scoped>
.link a {
  color: white;
  text-decoration: none;
  background-color: rgba(0, 0, 0, 0.5);
}

.pageTitle {
  font-size: 48px;
}

.body-color {
  background-color: rgb(255, 255, 255);
  padding-top: 30px;
  padding-bottom: 80px;
}

.header-image {
  text-align: center;
  position: relative;
  overflow: hidden;
  height: 700px;
}

.header-image video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: bottom;
}

video {
  width: 100%;
  height: auto;
  display: block;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(199, 197, 206, 0.404) 0%,
    rgba(255, 255, 255, 0.01) 32%,
    rgba(255, 255, 255, 0.01) 80%,
    rgba(246, 246, 255, 0.8) 92%,
    rgb(255, 255, 255) 100%
  );
  pointer-events: none; /* 마우스 이벤트를 통과시켜 비디오 조작 가능 */
}

.overlay {
  position: absolute;
  top: 40%; /* 텍스트를 상단에 위치시키기 위해 조정 */
  left: 50%;
  transform: translate(-50%, -10%);
  padding: 10px 20px;
  border-radius: 10px; /* 둥근 모서리 */
  color: white;
  font-size: 2rem;
  z-index: 2; /* 텍스트를 최상위로 배치 */
}
</style>
