import { localAxios } from "@/util/http-commons";

const local = localAxios();

function getDropdownContentSido(success, fail) {
  local.get(`/attraction/type`).then(success).catch(fail);
}

function getDropdownGugun(sidoCode, success, fail) {
  local.get(`/attraction/${sidoCode}`).then(success).catch(fail);
}

function getAttractions(content, sido, gugun, success, fail) {
  local.get(`/attraction`).then(success).catch(fail);
}

function getAttractionId(attractionId, succes, fail) {
  local.get(`/attraction/${attractionId}`).then(success).catch(fail);
}

export { getDropdownContentSido, getDropdownGugun, getAttractions, getAttractionId };
