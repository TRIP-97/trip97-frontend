<script setup>
  import { ref } from "vue";

  const { VITE_GROUP_REQUEST_LIST_SIZE } = import.meta.env;

  const currentPage = ref(1);
  const totalPage = ref(0);

  const param = ref({
    pgno: currentPage.value,
    spp: VITE_GROUP_REQUEST_LIST_SIZE,
    filter: "requestTo",
  });

  const setFilter = (filter) => {
    param.value.filter = filter;
    //   getHotPlaceList();
  };
</script>

<template>
  <div>
    <div class="filter-search-container d-flex justify-content-between mb-3">
      <div class="filters">
        <div
          :class="{ 'filter-selected': param.filter === 'requestTo' }"
          class="filter-option"
          @click="setFilter('requestTo')"
        >
          보낸 신청
        </div>
        <div
          :class="{ 'filter-selected': param.filter === 'requestFrom' }"
          class="filter-option"
          @click="setFilter('requestFrom')"
        >
          받은 신청
        </div>
      </div>
    </div>
    모임 요청 화면입니다!
  </div>
</template>

<style scoped>
  .filter-search-container {
    display: flex;
    justify-content: space-between;
  }

  .filters {
    display: flex;
    gap: 10px;
  }

  .filter-option {
    font-size: 14px;
    font-family: NanumSquareRound;
    padding: 8px 16px;
    background-color: #ebebeb;
    color: rgb(4, 4, 4);
    border-radius: 8px;
    transition: background-color 0.3s ease, color 0.3s ease;
    cursor: pointer;
  }

  .filter-selected {
    background-color: black;
    color: white;
  }
</style>
