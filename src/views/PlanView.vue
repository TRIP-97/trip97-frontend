<script setup>
import { ref } from "vue";
import PlanDetail from "@/components/plan/PlanDetail.vue";
import PlanPlaceSearch from "@/components/plan/PlanPlaceSearch.vue";

const viewName = ref("planDetail");
const addedPlaces = ref([]);
const planDetailRef = ref(null);
const selectedDayPlanId = ref(0);

// 계획 화면을 바꾸는 함수
const changeToDetailView = () => {
  viewName.value = 'planDetail';
}

const changeToSearchView = (dayPlanId) => {
  selectedDayPlanId.value = dayPlanId;
  viewName.value = 'planPlaceSearch';
}

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
}
</script>

<template>
  <div>
    <div class="header-image">
      <img src="@/assets/images/PlanPageLogo.jpg" alt="Plan Page Logo">
      <div class="overlay">
        <h1>여행 계획</h1>
      </div>
    </div>
    
    <PlanDetail
    v-if="viewName === 'planDetail'"
    ref="planDetailRef"
    @change-view="changeToSearchView"
    :selected-day-id="selectedDayPlanId"
    :added-places="addedPlaces" />
    <PlanPlaceSearch
    v-if="viewName === 'planPlaceSearch'"
    @change-view="changeToDetailView"
    @add-place="addPlace" />
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