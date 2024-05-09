import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 네이버 로그인 함수
function naverLogin(query, success, fail) {
  local.post(`/member/login/naver`, JSON.stringify(query)).then(success).catch(fail);
}

// JWT를 통해 멤버 프로필을 얻어오는 함수
function getMemberProfile(token) {
  return local.get(`/member/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export { naverLogin, getMemberProfile };
