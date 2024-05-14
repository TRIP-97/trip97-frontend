<script setup>
  import { RouterView } from "vue-router";
  import GroupSideBar from "@/components/group/item/GroupSideBar.vue";
</script>

<template>
  <div>
    <div class="header-image">
      <img src="@/assets/images/HotPlacePageLogo.jpg" alt="HotPlace Page Logo" />
      <div class="overlay">
        <h1>여행 계획</h1>
      </div>
    </div>
    <div class="container justify-content-center">
      <div class="row">
        <!-- 사이드바 섹션 -->
        <div class="col-md-2">
          <GroupSideBar />
        </div>
        <!-- 주 콘텐츠 섹션 -->
        <div class="col-md-9 ml-5">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .header-image {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    margin-bottom: 30px;
  }

  .header-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
  }
</style>
