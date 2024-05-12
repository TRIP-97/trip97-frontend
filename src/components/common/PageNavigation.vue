<script setup>
import { computed } from "vue";

const props = defineProps({ currentPage: Number, totalPage: Number });
const emit = defineEmits(["pageChange"]);

const navigationSize = parseInt(import.meta.env.VITE_ARTICLE_NAVIGATION_SIZE);

const startPage = computed(() => {
  return parseInt((props.currentPage - 1) / navigationSize) * navigationSize + 1;
});

const endPage = computed(() => {
  let lastPage =
    parseInt((props.currentPage - 1) / navigationSize) * navigationSize + navigationSize;
  return props.totalPage < lastPage ? props.totalPage : lastPage;
});

const endRange = computed(() => {
  return parseInt((props.totalPage - 1) / navigationSize) * navigationSize < props.currentPage;
});

function range(start, end) {
  const list = [];
  for (let i = start; i <= end; i++) list.push(i);
  return list;
}

function onPageChange(pg) {
  emit("pageChange", pg);
}
</script>

<template>
  <div class="row">
    <ul class="pagination justify-content-center">
      <li class="page-item">
        <a class="page-link" @click="onPageChange(1)"><i class="fa-solid fa-angles-left"></i></a>
      </li>
      <li class="page-item">
        <a class="page-link" @click="onPageChange(startPage == 1 ? 1 : startPage - 1)"><i class="fa-solid fa-chevron-left"></i></a>
      </li>
      <template v-for="pg in range(startPage, endPage)" :key="pg">
        <li :class="currentPage === pg ? 'page-item active' : 'page-item'">
          <a class="page-link" @click="onPageChange(pg)">{{ pg }}</a>
        </li>
      </template>
      <li class="page-item">
        <a class="page-link" @click="onPageChange(endRange ? totalPage : endPage + 1)"><i class="fa-solid fa-chevron-right"></i></a>
      </li>
      <li class="page-item"><a class="page-link" @click="onPageChange(totalPage)"><i class="fa-solid fa-angles-right"></i></a></li>
    </ul>
  </div>
</template>

<style scoped>
a {
  cursor: pointer;
}

.fa-chevron-left, .fa-chevron-right {
  padding-left: 10px;
}

.page-item .page-link {
  margin: 0 3px;
  border: none;
  color: rgb(121, 121, 121);
}

.page-link:hover, .page-item:hover, .fa-solid:hover {
  background-color: transparent;
}

.page-item.active .page-link {
  background-color: white;
  color: #007bff;
  border: none; 
}
</style>
