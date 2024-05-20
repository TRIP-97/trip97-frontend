<script setup>
import { useRoute } from 'vue-router';
import { RouterView } from "vue-router";
import VHeadingNavbarWhite from "./components/layout/VHeadingNavbarWhite.vue";
import VHeadingNavbarBlack from "./components/layout/VHeadingNavbarBlack.vue";
import VFooter from "./components/layout/VFooter.vue";

const route = useRoute();
</script>

<template>
  <div>
    <VHeadingNavbarWhite v-if="route.meta.showHeader === 'white'"/>
    <VHeadingNavbarBlack v-if="route.meta.showHeader === 'black'"/>
    <!-- <div style="height: 50px"></div> -->
    <div>
      <RouterView />
    </div>
    <VFooter />
  </div>
</template>

<style scoped>
@import "@/assets/css/style.css";
</style>
