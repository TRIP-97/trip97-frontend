<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="d-flex flex-column flex-shrink-0 p-3 bg-light" style="width: 200px; height: 250px; text-align: center;">
    <span class="fs-4">여행 모임</span>
    <hr />
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item active">
        <RouterLink :to="{ name: 'groupList' }" class="nav-link active" aria-current="page"> 모임 찾기 </RouterLink>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link"> 내 모임 </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link"> 모임 신청 </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.nav-item:not(.active) a:hover {
  background-color: #ebebeb; 
}

.nav-link.active {
  background-color: #71b8ff;
  border-color: #dee2e6;
}
</style>
