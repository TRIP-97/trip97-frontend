<script setup>
import { RouterView } from "vue-router";
import VHeadingNavbar from "./components/layout/VHeadingNavbar.vue";
import VFooter from "./components/layout/VFooter.vue";
</script>

<template>
  <div>
    <VHeadingNavbar />
    <div style="height: 150px"></div>
    <div>
      <RouterView />
    </div>
    <VFooter />
  </div>
</template>

<style scoped>
@import "@/assets/css/style.css";
</style>
