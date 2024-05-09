import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 핫플레이스 목록을 불러오는 함수
function listHotPlace(success, fail) {
  local.get(`/hotplace`).then(success).catch(fail);
}

// 핫플레이스 상세내용을 불러오는 함수
function detailHotPlace(hotPlaceId, success, fail) {
  local.get(`/hotplace/${hotPlaceId}`).then(success).catch(fail);
}

// 핫플레이스 게시글을 등록하는 함수
function registHotPlace(token, hotPlace) {
  return local.post(`/hotplace`, JSON.stringify(hotPlace), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export { listHotPlace, detailHotPlace, registHotPlace };
