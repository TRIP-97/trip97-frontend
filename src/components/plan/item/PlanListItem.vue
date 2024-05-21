<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  plan: Object,
});

const plan = ref(props.plan);

plan.value.startDate = formatVisitedDate(plan.value.startDate);
plan.value.endDate = formatVisitedDate(plan.value.endDate);

// 날짜 형식을 변경하는 함수
function formatVisitedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}.${month.toString().padStart(2, "0")}.${day.toString().padStart(2, "0")}`;
}

// 두 날짜 사이의 일수를 계산하는 함수
function getTotalDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

// 여행 계획 페이지로 이동하는 함수
const goPlanPage = (planId) => {
  router.push({
    name: "plan",
    params: {
      groupId: route.params.id,
      planId: planId,
    },
  });
};
</script>

<template>
  <div class="col-lg-5 plan-card">
    <div class="plan-header-container">
      <div class="plan-header">
        <h3>{{ plan.title }}</h3>
        <p>
          <i class="travel-date-icon fa-solid fa-calendar"></i>{{ plan.startDate }} -
          {{ plan.endDate }}
        </p>
        <p class="default-message">곧 떠날 여행 일정을 확인해보세요!</p>
      </div>
      <div class="plan-day">
        <div class="day-label">Day</div>
        <div class="day-number">{{ getTotalDays(plan.startDate, plan.endDate) }}</div>
      </div>
    </div>
    <button class="add-plan-btn" @click.prevent="goPlanPage(plan.id)">여행 일정 보러가기</button>
  </div>
</template>

<style scoped>
.plan-card {
  background-color: #8280dd;
  border-radius: 15px;
  padding: 20px;
  color: white;
  text-align: center;
  margin: 20px;
  margin-left: 50px;
}

.plan-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-header {
  text-align: left;
  flex-grow: 1;
}

.plan-header h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.plan-header p {
  font-size: 14px;
  margin: 5px 0;
}

.plan-day {
  background-color: white;
  color: #8280dd;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  font-family: NanumSquareRoundExtraBold;
}

.day-label {
  font-size: 12px;
}

.day-number {
  font-size: 18px;
  font-weight: bold;
}

.add-plan-btn {
  background-color: white;
  color: #8280dd;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 15px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.add-plan-btn:hover {
  background-color: #6d6cbd;
  color: white;
}

.travel-date-icon {
  margin-right: 10px;
}

.default-message {
  color: #1f0e52;
}
</style>
