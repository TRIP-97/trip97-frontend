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
        <h1>로그인 화면입니다!!!</h1>
        <img class="naver-login-button" src="../assets/images/naverLoginBtn.png" @click="naverLogin" width="200" />
    </div>
</template>

<style scoped>

</style>