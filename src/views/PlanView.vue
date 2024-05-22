<script setup>
  import { RouterView } from "vue-router";
  import { ref, onMounted } from "vue";
  import PlanDetail from "@/components/plan/PlanDetail.vue";
  import PlanPlaceSearch from "@/components/plan/PlanPlaceSearch.vue";
  import PlanFavoriteSearch from "@/components/plan/PlanFavoriteSearch.vue";

  const viewName = ref("planDetail");
  const addedPlaces = ref([]);
  const planDetailRef = ref(null);
  const selectedDayPlanId = ref(0);

  // 계획 화면을 바꾸는 함수
  const changeToDetailView = () => {
    viewName.value = "planDetail";
  };

  const changeToSearchView = (dayPlanId) => {
    selectedDayPlanId.value = dayPlanId;
    viewName.value = "planPlaceSearch";
  };

  const changeToFavoriteView = () => {
    viewName.value = "planFavoriteSearch";
  };

  // 여행 장소를 추가하는 함수
  const addPlace = (places) => {
    addedPlaces.value = places;

    // planDetailRef가 설정될 때까지 대기
    if (planDetailRef.value) {
      planDetailRef.value.addPlace();
    } else {
      // planDetailRef가 아직 설정되지 않은 경우 지연 실행
      const interval = setInterval(() => {
        if (planDetailRef.value) {
          planDetailRef.value.addPlace();
          clearInterval(interval);
        }
      }, 100); // 100ms마다 확인
    }
  };

  import videoFile from "@/assets/images/201737-916318941_small.mp4";

  // 이미지 파일을 import 구문으로 불러옵니다
  // import waveGifSrc from '@/assets/images/ship.gif';

  const videoPlayer = ref(null);
  const videoSrc = videoFile;

  const handleVideoEnded = () => {
    if (videoPlayer.value) {
      videoPlayer.value.currentTime = 0;
      videoPlayer.value.play();
    }
  };

  onMounted(() => {
    if (videoPlayer.value) {
      videoPlayer.value.play();
    }
  });
</script>

<template>
  <div>
    <div class="header-image">
      <video
        ref="videoPlayer"
        @ended="handleVideoEnded"
        :src="videoSrc"
        autoplay
        muted
        loop
      ></video>
      <div class="gradient-overlay"></div>
      <div class="overlay">
        <h1 class="pageTitle">여행 계획</h1>
      </div>
    </div>
    <div class="body-color">
      <PlanDetail
        v-if="viewName === 'planDetail'"
        ref="planDetailRef"
        @change-view="changeToSearchView"
        :selected-day-id="selectedDayPlanId"
        :added-places="addedPlaces"
      />
      <PlanPlaceSearch
        v-if="viewName === 'planPlaceSearch'"
        @change-view="changeToDetailView"
        @change-favorite="changeToFavoriteView"
        @add-place="addPlace"
      />
      <PlanFavoriteSearch
        v-if="viewName === 'planFavoriteSearch'"
        @change-view="changeToDetailView"
        @add-place="addPlace"
      />
    </div>
  </div>
</template>

<style scoped>
  .pageTitle {
    font-size: 48px;
  }

  .body-color {
    background-color: rgb(255, 255, 255);
    padding-top: 30px;
    padding-bottom: 80px;
  }

  .header-image {
    text-align: center;
    position: relative;
    overflow: hidden;
    height: 530px;
  }

  .header-image video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 70% 70%;
  }

  video {
    width: 100%;
    height: auto;
    display: block;
  }

  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(199, 197, 206, 0.404) 0%,
      rgba(255, 255, 255, 0.01) 32%,
      rgba(255, 255, 255, 0.01) 80%,
      rgba(246, 246, 255, 0.8) 92%,
      rgb(255, 255, 255) 100%
    );
    pointer-events: none; /* 마우스 이벤트를 통과시켜 비디오 조작 가능 */
  }

  .overlay {
    position: absolute;
    top: 40%; /* 텍스트를 상단에 위치시키기 위해 조정 */
    left: 50%;
    transform: translate(-50%, -10%);
    padding: 10px 20px;
    border-radius: 10px; /* 둥근 모서리 */
    color: white;
    font-size: 2rem;
    z-index: 2; /* 텍스트를 최상위로 배치 */
  }
</style>
