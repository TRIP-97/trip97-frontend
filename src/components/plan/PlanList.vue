<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getPlans } from "@/api/plan";
import PlanListItem from "./item/PlanListItem.vue";

const route = useRoute();

const groupId = route.params.id;
const plans = ref([]);

// 모임의 여행 계획 목록을 조회하는 함수
const getPlanList = () => {
  getPlans(
    groupId,
    ({ data }) => {
      plans.value = data;
      console.log(data);
    },
    (error) => {
      console.log("여행 계획 불러오는 중 에러 발생!");
      console.dir(error);
    }
  );
}

// 여행 계획 추가하기 버튼 클릭 이벤트
const addPlan = () => {
  console.log("여행 계획 추가하기 버튼 클릭됨");
  // 여기에 여행 계획 추가하기 로직을 구현하거나 다른 페이지로 이동할 수 있습니다.
};

onMounted(() => {
  getPlanList();
})

</script>

<template>
  <div class="plans" :class="{ 'center-content': !(plans && plans.length > 0) }">
    <div class="header">
      <button class="add-plan-btn" @click="addPlan">여행 계획 추가하기 +</button>
    </div>
    <div v-if="plans === null || plans.length === 0" class="empty-plans">
      현재 여행 계획이 없습니다!
    </div>
    <div v-else class="row">
      <template v-for="plan in plans" :key="plan.id">
        <PlanListItem :plan="plan" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.plans {
  min-height: 500px;
  color: #333;
  padding: 20px;
}

.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-plans {
  color: #888;
  font-size: 16px;
}

.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.add-plan-btn {
  background-color: #a7c7e7; 
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin-top: 20px;
  margin-right: 30px; 
}

.add-plan-btn:hover {
  background-color: #90b6db; 
  color: white;
}
</style>

