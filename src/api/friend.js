import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 친구 목록을 불러오는 함수
function listFriend(memberId, success, fail) {
  local.get(`/friend/${memberId}`).then(success).catch(fail);
}

// 친구 요청을 하는 함수
function sendFriendRequest(param, success, fail) {
  local.post(`/friendship`, null, { params: param }).then(success).catch(fail);
}

// 이미 친구 요청을 했거나 받았는지 확인하는 함수
function isMemberInFriendships(memberId, success, fail) {
  local.get(`/friendship/member/${memberId}`).then(success).catch(fail);
}

// 자신한테 온 대기중인 친구 요청 목록 확인하는 함수
function getWaitingFriendShips(memberId, success, fail) {
  local.get(`/friendship`, { params: memberId }).then(success).catch(fail);
}

// 친구 수락하는 함수
function approveFriendship(requestId, success, fail) {
  local.put(`/friendship/${requestId}`).then(success).catch(fail);
}

// 친구 거절하는 함수
function refuseFriendship(requestId, success, fail) {
  local.delete(`/friendship/${requestId}`).then(success).catch(fail);
}

// 친구 삭제하는 함수
function deleteFriend(params, success, fail) {
  local.delete(`/friend/${params.id}`, { params: params }).then(success).catch(fail);
}

export {
  listFriend,
  sendFriendRequest,
  isMemberInFriendships,
  getWaitingFriendShips,
  approveFriendship,
  refuseFriendship,
  deleteFriend,
};
