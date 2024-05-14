<script setup>
  import { RouterLink, useRoute } from "vue-router";
  import { computed } from "vue";

  const route = useRoute();

  const isActiveGroupList = computed(
    () => route.name === "groupList" || route.name === "groupDetail"
  );
  const isActiveMyGroupList = computed(() => route.name === "myGroupList" || route.name === "myGroupDetail"
    || route.name === "groupWrite" || route.name === "groupModify");
  const isActiveMyGroupRequest = computed(() => route.name === "myGroupRequest");
</script>

<template>
  <div
    class="d-flex flex-column flex-shrink-0 p-3 bg-light"
    style="width: 200px; height: 230px; text-align: center"
  >
    <span class="fs-4">여행 모임</span>
    <hr />
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item" :class="{ active: isActiveGroupList }">
        <RouterLink
          :to="{ name: 'groupList' }"
          class="nav-link"
          :class="{ active: isActiveGroupList }"
          aria-current="page"
        >
          모임 찾기
        </RouterLink>
      </li>
      <li class="nav-item" :class="{ active: isActiveMyGroupList }">
        <RouterLink
          :to="{ name: 'myGroupList' }"
          class="nav-link"
          :class="{ active: isActiveMyGroupList }"
          aria-current="page"
        >
          내 모임
        </RouterLink>
      </li>
      <li class="nav-item" :class="{ active: isActiveMyGroupRequest }">
        <RouterLink
          :to="{ name: 'myGroupRequest' }"
          class="nav-link"
          :class="{ active: isActiveMyGroupRequest }"
          aria-current="page"
        >
          모임 신청
        </RouterLink>
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
