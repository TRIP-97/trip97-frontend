import { localAxios } from "@/util/http-commons";
import axios from "axios";

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

// 모임의 여행 계획을 삭제하는 함수
function deletePlan(param, success, fail) {
  local.delete(`group/${param.groupId}/plan/${param.planId}`).then(success).catch(fail);
}

// 모임의 여행 계획에 아이템을 생성하는 함수
function createDayPlanItem(params, dayPlanItem, success, fail) {
  local
    .post(`group/${params.groupId}/plan/${params.planId}/dayPlanItem`, dayPlanItem)
    .then(success)
    .catch(fail);
}

// 모임의 여행 계획의 아이템을 삭제하는 함수
function deleteDayPlanItemById(params, success, fail) {
  local
    .delete(`group/${params.groupId}/plan/${params.planId}/dayPlanItem/${params.itemId}`)
    .then(success)
    .catch(fail);
}

// 모임의 여행 계획의 순서를 바꾸는 함수
function updateDayPlanItemOrder(param, success, fail) {
  local
    .put(`group/${param.groupId}/plan/${param.planId}/dayPlanItem/${param.itemId}`, param)
    .then(success)
    .catch(fail);
}

// 카카오 모빌리티 API에서 추천 경로를 받아오는 함수
function getRecommendPlanRoute(places, success, fail) {
  axios.post(`/api`,
    {
      origin: places.origin,
      destination: places.destination,
      waypoints: places.waypoints,
    },
    {
      headers: {
        "Authorization": "KakaoAK e7a082643c3fac69a31a2b74d74050aa",
        "Content-Type": "application/json",
      },
    }
  ).then(success).catch(fail);
}

// 오디세이 API에서 대중교통 경로를 받아오는 함수
function getPublicPlanRoute(params, success, fail) {
  axios.get(`https://api.odsay.com/v1/api/searchPubTransPath?SX=${params.sx}&SY=${params.sy}&EX=${params.ex}&EY=${params.ey}&apiKey=A%2BJ7R5YMqJMq5LZmH77cV9UUK7ALlhCNTvcISRlDBg0`)
  .then(success).catch(fail);
}

// 노선 그래픽 데이터를 호출하는 함수
function getPublicRouteGraphicData(mapObj, success, fail) {
  axios.post(`https://api.odsay.com/v1/api/loadLane?mapObject=0:0@${mapObj}&apiKey=A%2BJ7R5YMqJMq5LZmH77cV9UUK7ALlhCNTvcISRlDBg0`)
  .then(success).catch(fail);
}

// T Map API에서 보도 경로를 받아오는 함수
function getWalkPlanRoute(data, success, fail) {
  axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result`,
    data,
    {
      headers: {
        "appKey": "vUWoLVNYPf7xvU9zJGLlT7vV4095dwei7sidJ5U1",
      },
    },
  ).then(success).catch(fail);
}

export {
  getPlans,
  createPlan,
  deletePlan,
  getPlanDetail,
  createDayPlanItem,
  deleteDayPlanItemById,
  updateDayPlanItemOrder,
  getRecommendPlanRoute,
  getPublicPlanRoute,
  getPublicRouteGraphicData,
  getWalkPlanRoute,
};
