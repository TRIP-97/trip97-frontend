<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";

import videoFile from "@/assets/images/22609-328810354.mp4";

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

<template>
  <div>
    <div class="header-image">
      <video
        ref="videoPlayer"
        @ended="handleVideoEnded"
        :src="videoSrc"
        autoplay
        muted
        loop
      ></video>
      <div class="gradient-overlay"></div>
    </div>
    <div class="overlay">
      <h1 class="pageTitle">TRIP97</h1>
    </div>
    <div class="body-color">
      <RouterView />
    </div>
    <div class="empty-div" style="height: 1500px"></div>
  </div>
</template>

<style scoped>
.pageTitle {
  font-family: "PassionOneBold", sans-serif;
  font-size: 84px;
}

.body-color {
  background: linear-gradient(180deg, #918fda 0%, #ffffff 100%);
  width: 100%;
  height: 100vh; /* 전체 화면 높이 */
}

.header-image {
  text-align: center;
  position: relative;
  overflow: hidden;
  height: 530px;
}

.header-image video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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
    180deg,
    rgba(126, 126, 126, 0.65) 0%,
    rgba(227, 189, 189, 0) 48%,
    rgba(145, 143, 221, 1) 100%
  );
  pointer-events: none; /* 마우스 이벤트를 통과시켜 비디오 조작 가능 */
}

.overlay {
  position: absolute;
  top: 50%; /* 텍스트를 상단에 위치시키기 위해 조정 */
  left: 50%;
  transform: translate(-50%, -10%);
  padding: 10px 20px;
  border-radius: 10px; /* 둥근 모서리 */
  color: white;
  font-size: 2rem;
  z-index: 1; /* 텍스트를 최상위로 배치 */
}
</style>
