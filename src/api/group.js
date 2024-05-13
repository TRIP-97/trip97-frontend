import { localAxios, localAxiosWithFile } from "@/util/http-commons";

const local = localAxios();
const localWithFile = localAxiosWithFile();

// 게시된 그룹 목록을 불러오는 함수
function listGroup(param, success, fail) {
  local.get(`/group`, { params: param }).then(success).catch(fail);
}

// 내 그룹 목록을 불러오는 함수
function listMyGroup(groupId, param, success, fail) {
  local.get(`/group/${groupId}/member`, { params: param }).then(success).catch(fail);
}

// 그룹 상세내용을 불러오는 함수
function detailGroup(groupId, success, fail) {
  local.get(`/group/${groupId}`).then(success).catch(fail);
}

// 그룹 게시글을 등록하는 함수
function registGroup(token, group) {
  return localWithFile.post(`/group`, group, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 그룹 게시글을 수정하는 함수
function modifyGroup(group, success, fail) {
  local.put(`/group/${group.id}`, JSON.stringify(group)).then(success).catch(fail);
}

// 그룹 게시글을 삭제하는 함수
function deleteGroup(groupId, success, fail) {
  local.delete(`/group/${groupId}`).then(success).catch(fail);
}
