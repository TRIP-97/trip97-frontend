import { localAxios } from "@/util/http-commons";

const local = localAxios();

function getDropdownContentSido(success, fail) {
  local.get(`/attraction/type`).then(success).catch(fail);
}

function getDropdownGugun(sidoCode, success, fail) {
  local.get(`/attraction/type/${sidoCode}`).then(success).catch(fail);
}

function getAttractions(content, sido, gugun, ha, qa, oa, pa, title, success, fail) {
  const url = `/attraction?contentType=${content}&sidoCode=${sido}&gugunCode=${gugun}&ha=${ha}&qa=${qa}&oa=${oa}&pa=${pa}&title=${title}`;
  local.get(url).then(success).catch(fail);
}

function getAttractionId(attractionId, success, fail) {
  local.get(`/attraction/${attractionId}`).then(success).catch(fail);
}

function getHotAttractions(success, fail) {
  local.get(`/attraction/hot`).then(success).catch(fail);
}

export {
  getDropdownContentSido,
  getDropdownGugun,
  getAttractions,
  getAttractionId,
  getHotAttractions,
};
