<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";

import videoFile from '@/assets/images/11490-230853032.mp4';

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

// const waveGif = ref(waveGifSrc);
</script>

<template>
  <div>
    <div class="header-image">
      <!-- <img :src="waveGif" alt="Attraction Page Logo" /> -->
      <video ref="videoPlayer" @ended="handleVideoEnded" :src="videoSrc" autoplay muted loop>
    </video>
      <div class="overlay">
        <h1>여행 지도</h1>
      </div>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.header-image {
  text-align: center;
  position: relative;
  overflow: hidden;
  height : 500px;
  margin-bottom: 30px;
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

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(52, 62, 66, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}
</style>
