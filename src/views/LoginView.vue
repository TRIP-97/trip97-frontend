<script setup>
  import { ref, onMounted } from "vue";

  import videoFile from "@/assets/images/188057-881538748_small.mp4";

  const stateValue = ref("");

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

  function generateRandomString(length) {
    const array = new Uint32Array(length / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join("");
  }

  const naverLogin = () => {
    stateValue.value = generateRandomString(40);
    const redirect_uri = "http://192.168.120.61:5173/naver/callback";
    const clientId = "HVfS8Bx6TTsiC8oIVVib";
    const auth_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}&state=${stateValue.value}`;

    window.location.href = auth_url;
  };

  const kakaoLogin = () => {
    const redirect_uri = "http://localhost:5173/kakao/callback";
    const clientId = "b2240391a7cf9244a35289b7633cab62";
    const auth_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}&scope=profile_nickname account_email`;

    window.location.href = auth_url;
  };
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
        <h1 class="pageTitle">로그인</h1>
      </div>
    </div>
    <div class="body-color row justify-content-center">
      <div class="col-lg-3 login-container">
        <!-- <p class="login-message">Login</p> -->
        <img
          class="login-button naver-btn"
          src="../assets/images/naverLoginBtn.png"
          @click="naverLogin"
          width="200"
        />
        <img
          class="login-button kakao-btn"
          src="../assets/images/kakaoLoginBtn.png"
          @click="kakaoLogin"
          width="200"
        />
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
    padding-top: 55px;
    padding-bottom: 100px;
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
      rgba(119, 119, 156, 0.4) 0%,
      rgba(255, 255, 255, 0.01) 32%,
      rgba(255, 255, 255, 0.01) 80%,
      rgba(250, 250, 255, 0.8) 92%,
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

  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
    margin-top: 30px;
    width: 350px;
  }

  .login-button {
    cursor: pointer;
    transition: transform 0.2s;
  }

  .login-button:hover {
    transform: scale(1.1);
  }

  .kakao-btn {
    margin-top: 10px;
  }

  .login-message {
    font-family: "PassionOneBold", sans-serif;
    font-size: 55px;
    color: #000000;
    margin-bottom: 30px;
  }
</style>
