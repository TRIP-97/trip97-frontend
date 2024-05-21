<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";
import GroupSideBar from "@/components/group/item/GroupSideBar.vue";
import videoFile from "@/assets/images/201737-916318941_small.mp4";

// 이미지 파일을 import 구문으로 불러옵니다
// import waveGifSrc from '@/assets/images/ship.gif';

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
      <div class="overlay">
        <h1 class="pageTitle">여행 계획</h1>
      </div>
    </div>
    <div class="body-color">
      <div class="container justify-content-center">
        <div class="row">
          <!-- 사이드바 섹션 -->
          <div class="col-md-2">
            <GroupSideBar class="side-bar" />
          </div>
          <!-- 주 콘텐츠 섹션 -->
          <div class="col-md-10">
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  height: 530px;
}

.header-image video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 70% 70%;
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
.side-bar {
  border-radius: 15px;
  box-shadow: 5px 5px 5px #ebebeb;
}
</style>
