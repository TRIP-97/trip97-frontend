<script setup>
import { useRoute } from 'vue-router';
import { RouterView } from "vue-router";
import VHeadingNavbar from "./components/layout/VHeadingNavbar.vue";
import VFooter from "./components/layout/VFooter.vue";

const route = useRoute();
</script>

<template>
  <div>
    <VHeadingNavbar v-if="route.meta.showHeader"/>
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
