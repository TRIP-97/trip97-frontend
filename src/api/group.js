import { localAxios, localAxiosWithFile } from "@/util/http-commons";

const local = localAxios();
const localWithFile = localAxiosWithFile();

// 게시된 모임 목록을 불러오는 함수
function listGroup(param, success, fail) {
  local.get(`/group`, { params: param }).then(success).catch(fail);
}

// 내 모임 목록을 불러오는 함수
function listMyGroup(param, success, fail) {
  local.get(`/group/member/${param.memberId}`, { params: param }).then(success).catch(fail);
}

// 모임 상세내용을 불러오는 함수
function detailGroup(groupId, success, fail) {
  local.get(`/group/${groupId}`).then(success).catch(fail);
}

// 모임 게시글을 등록하는 함수
function registGroup(token, group) {
  return localWithFile.post(`/group`, group, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 모임 게시글을 수정하는 함수
function modifyGroup(group, success, fail) {
  local.put(`/group/${group.id}`, JSON.stringify(group)).then(success).catch(fail);
}

// 모임 게시글을 삭제하는 함수
function deleteGroup(groupId, success, fail) {
  local.delete(`/group/${groupId}`).then(success).catch(fail);
}

// 모임 멤버이거나 신청했는지 확인하는 함수
function checkGroupMember(param, success, fail) {
  local.get(`group/${param.groupId}/member/${param.memberId}`).then(success).catch(fail);
}

// 모임 참가 신청하는 함수
function requestGroupMember(request, success, fail) {
  local.post(`group/${request.groupId}/member`, request).then(success).catch(fail);
}

// 모임 참가 신청 대기중인 멤버들을 가져오는 함수
function listWaitingRequest(groupId, success, fail) {
  local.get(`group/${groupId}/member/wait`).then(success).catch(fail);
}

// 모임 참가 신청을 수락하는 함수
function acceptRequest(groupId, memberId, success, fail) {
  local.patch(`group/${groupId}/member/${memberId}`).then(success).catch(fail);
}

// 모임 참가 신청을 거절하는 함수
function refuseRequest(groupId, memberId, success, fail) {
  local.delete(`group/${groupId}/member/${memberId}`).then(success).catch(fail);
}

// 모임에 참가중인 멤버를 조회하는 함수
function listGroupMembers(groupId, success, fail) {
  local.get(`group/${groupId}/member/accept`).then(success).catch(fail);
}

export {
  listGroup,
  listMyGroup,
  detailGroup,
  registGroup,
  modifyGroup,
  deleteGroup,
  checkGroupMember,
  requestGroupMember,
  listWaitingRequest,
  acceptRequest,
  refuseRequest,
  listGroupMembers,
};
