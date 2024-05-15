import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 모임의 여행 계획 목록을 조회하는 함수
function getPlans(groupId, success, fail) {
  local.get(`group/${groupId}/plan`).then(success).catch(fail);
}

export {
  getPlans,
};