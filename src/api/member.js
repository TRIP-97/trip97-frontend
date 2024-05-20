import { localAxios, localAxiosWithFile } from "@/util/http-commons";

const local = localAxios();
const localWithFile = localAxiosWithFile();

// 네이버 로그인 함수
function naverLogin(query, success, fail) {
  local.post(`/member/login/naver`, JSON.stringify(query)).then(success).catch(fail);
}

function kakaoLogin(query, success, fail) {
  local.post(`/member/login/kakao`, JSON.stringify(query)).then(success).catch(fail);
}

// JWT를 통해 멤버 프로필을 얻어오는 함수
function getMemberProfile(token) {
  return local.get(`/member/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 내 정보를 수정하는 함수
function updateMember(token, member, success, fail) {
  localWithFile.put(`/member`, member, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(success).catch(fail);
}

// 친구 코드로 멤버 검색하는 함수
function getMemberByFriendCode(friendCode, success, fail) {
  local.get(`/member/search/friendCode`, { params: friendCode }).then(success).catch(fail);
}

export { naverLogin, kakaoLogin, getMemberProfile, getMemberByFriendCode, updateMember };
