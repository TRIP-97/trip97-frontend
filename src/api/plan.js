import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 모임의 여행 계획 목록을 조회하는 함수
function getPlans(groupId, success, fail) {
  local.get(`group/${groupId}/plan`).then(success).catch(fail);
}

// 모임의 여행 계획의 상세 내용을 조회하는 함수
function getPlanDetail(params, success, fail) {
  local.get(`group/${params.groupId}/plan/${params.planId}`).then(success).catch(fail);
}

// 모임의 여행 계획을 생성하는 함수
function createPlan(plan, success, fail) {
  local.post(`group/${plan.travelGroupId}/plan`, plan).then(success).catch(fail);
}

export {
  getPlans,
  createPlan,
  getPlanDetail,
};