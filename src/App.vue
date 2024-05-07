<script setup>
import { RouterView } from "vue-router";
import VHeadingNavbar from "./components/layout/VHeadingNavbar.vue";
import VFooter from "./components/layout/VFooter.vue";

</script>

<template>
  <div>
    <VHeadingNavbar />
    <div>
      <RouterView />
    </div>
    <VFooter />
  </div>
</template>

<style scoped></style>
