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

// 핫플레이스 게시글을 수정하는 함수
function modifyHotPlace(hotPlace, success, fail) {
  local.put(`/hotplace/${hotPlace.id}`, JSON.stringify(hotPlace)).then(success).catch(fail);
}

// 핫플레이스 게시글을 삭제하는 함수
function deleteHotPlace(hotPlaceId, success, fail) {
  local.delete(`/hotplace/${hotPlaceId}`).then(success).catch(fail);
}

// 핫플레이스 게시글의 댓글을 조회하는 함수
function listHotPlaceComment(hotPlaceId, success, fail) {
  local.get(`/hotplace/${hotPlaceId}/comment`).then(success).catch(fail);
}

// 핫플레이스 게시글의 댓글을 등록하는 함수
function registHotPlaceComment(comment, success, fail) {
  local
    .post(`/hotplace/${comment.boardId}/comment`, JSON.stringify(comment))
    .then(success)
    .catch(fail);
}

// 핫플레이스 게시글의 댓글을 수정하는 함수
function editHotPlaceComment(comment, success, fail) {
  local
    .put(`hotplace/${comment.boardId}/comment/${comment.id}`, JSON.stringify(comment))
    .then(success)
    .catch(fail);
}

// 핫플레이스 게시글의 댓글을 삭제하는 함수
function deleteHotPlaceComment(hotPlaceId, commentId, success, fail) {
  local.delete(`/hotplace/${hotPlaceId}/comment/${commentId}`).then(success).catch(fail);
}

export {
  listHotPlace,
  detailHotPlace,
  registHotPlace,
  modifyHotPlace,
  deleteHotPlace,
  listHotPlaceComment,
  registHotPlaceComment,
  deleteHotPlaceComment,
  editHotPlaceComment,
};
