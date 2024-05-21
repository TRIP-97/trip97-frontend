<script setup>
import { RouterLink, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const isActiveFriendList = computed(() => route.name === "friendList");
const isActiveFriendRequestList = computed(() => route.name === "friendRequestList");
</script>

<template>
  <div
    class="d-flex flex-column flex-shrink-0 p-3 bg-light"
    style="width: 200px; height: 200px; text-align: center"
  >
    <span class="fs-4">내 친구</span>
    <hr />
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item" :class="{ active: isActiveFriendList }">
        <RouterLink
          :to="{ name: 'friendList' }"
          class="nav-link"
          :class="{ active: isActiveFriendList }"
          aria-current="page"
        >
          친구 목록
        </RouterLink>
      </li>
      <li class="nav-item" :class="{ active: isActiveFriendRequestList }">
        <RouterLink
          :to="{ name: 'friendRequestList' }"
          class="nav-link"
          :class="{ active: isActiveFriendRequestList }"
          aria-current="page"
        >
          친구 요청
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.nav-item {
  margin-top: 10px;
}

.nav-item:not(.active) a:hover {
  background-color: #e5e4ff;
}

.nav-link.active {
  background-color: #8280dd !important;
  border-color: #dee2e6;
}

.nav-link:not(.active) {
  color: #8280dd;
}
</style>
