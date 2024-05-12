<script setup>
import { ref } from 'vue';

const stateValue = ref('');

function generateRandomString(length) {
  const array = new Uint32Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

const naverLogin = () => {
    stateValue.value = generateRandomString(40);
    const redirect_uri = 'http://localhost:5173/naver/callback';
    const clientId = 'HVfS8Bx6TTsiC8oIVVib'
    const auth_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}&state=${stateValue.value}`;

    window.location.href = auth_url;
}
</script>

<template>
    <div>
        <div class="header-image">
            <img src="@/assets/images/loginPageLogo.png" alt="HotPlace Page Logo">
            <div class="overlay">
                <h1>로그인</h1>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-lg-3 login-container">
                <p class="login-message">간편 로그인으로 쉽고 빠르게 시작하세요!</p>
                <img class="login-button naver-btn" src="../assets/images/naverLoginBtn.png" @click="naverLogin" width="200" />
                <img class="login-button kakao-btn" src="../assets/images/kakaoLoginBtn.png" width="200" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.header-image {
  position: relative;
  width: 100%;
  height: 300px; 
  overflow: hidden;
  margin-bottom: 30px;
}

.header-image img {
  width: 100%;
  height: 100%; 
  object-fit: cover; 
  object-position: center; 
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center; 
  justify-content: center; 
  color: white;
  font-size: 2rem; 
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #f7f7f7;
    padding: 20px;
    border-radius: 8px; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 30px;
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
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 30px; 
}
</style>