<script setup>
  import { RouterView } from "vue-router";
  import { ref, onMounted } from "vue";

  import videoFile from "@/assets/images/163123-827112905_medium.mp4";

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
        <h1 class="pageTitle">HOTPLACE</h1>
      </div>
    </div>
    <div class="body-color">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
  .pageTitle {
    font-size: 48px;
    background-color: white;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .body-color {
    background-color: rgb(251, 251, 255);
    padding-top: 55px;
    margin-bottom: 30px;
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
    object-position: 72% 72%;
  }

  video {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }

  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(255, 255, 255, 0.01) 32%,
      rgba(255, 255, 255, 0.01) 80%,
      rgb(133, 133, 167, 0.8) 92%,
      rgb(251, 251, 255) 100%
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
    font-size: 2rem;
    z-index: 2; /* 텍스트를 최상위로 배치 */
  }
</style>
