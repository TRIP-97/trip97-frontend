import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 즐겨찾기 등록
function registerFavorite(token, favorite, success, fail) {
  local.post(`/favorite`, { favorite: favorite }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(success).catch(fail);
}

// 즐겨찾기 삭제
function removeFavorite(token, id, success, fail) {
  local.delete(`/favorite/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(success).catch(fail);
}

// 즐겨찾기 전체 조회
function selectFavorites(token, memberId, success, fail) {
  local.get(`/favorite?memberid=${memberId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(success).catch(fail);
}

// 즐겨찾기 관광지 하나 조회
function selectFavorite(token, id, memberId, success, fail) {
  local.get(`/favorite?id=${id}&memberid=${memberId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(success).catch(fail);
}

export { registerFavorite, removeFavorite, selectFavorites, selectFavorite };