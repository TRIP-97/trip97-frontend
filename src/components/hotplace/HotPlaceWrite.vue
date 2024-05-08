<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const nickname = ref("");

// 사용자 정보 가져오기
const fetchProfile = async () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const response = await axios.get("http://localhost:8080/member/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        nickname.value = response.data.nickname;
      }
    } catch (error) {
      console.error("프로필 정보 조회 실패:", error);
      logout(); // 토큰이 유효하지 않은 경우 로그아웃 처리
    }
  }
};

onMounted(() => {
  fetchProfile();
});

// KAKAO MAP API 시작
const map = ref(null);

const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 5,
  };

    map.value = new kakao.maps.Map(container, options);

    // map 객체가 초기화된 이후에 이벤트 리스너를 추가
    kakao.maps.event.addListener(map.value, "click", function (mouseEvent) {
    var latlng = mouseEvent.latLng;
    let lat = latlng.getLat();
    let lng = latlng.getLng();
    let latlngInput = `
        <input type="hidden" name="latitude" value="${lat}">
        <input type="hidden" name="longitude" value="${lng}">
    `;
    console.log(latlngInput);

    document.getElementById("latlng").innerHTML = latlngInput;
    addMarkerAndRemovePrevious(latlng);
    });
};

var marker;
function addMarkerAndRemovePrevious(position) {
    if (marker != null) {
        marker.setMap(null);
    }
    marker = new kakao.maps.Marker({
        position: position,
        map: map.value,
    });
}

onMounted(() => {
  /* global kakao */
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=f866a7adcb3307f7c3c406e2ec39d7d0";
    script.addEventListener("load", () => {
      kakao.maps.load(() => {
        // 카카오맵 API가 로딩이 완료된 후 지도의 기본적인 세팅을 시작해야 한다.
        initMap();
      });
    });
    document.head.appendChild(script);
  }
});
// KAKAO MAP API 끝
</script>

<template>
  <div>
    <main>
      <div style="height: 50px"></div>
      <div class="container mt-5">
        <h2 class="text-center mb-4 font-weight-bold">핫플 소개하기</h2>

        <div class="row mt-5">
          <div class="col-lg-6 map-area border border-secondary">
            <div class="row-md-5 map" id="map"></div>
          </div>
          <div class="col-lg-6">
            <form method="post" action="${pageContext.request.contextPath}/hotplace">
              <input type="hidden" name="action" value="regist" />
              <input type="hidden" name="userId" value="${user.id}" />
              <input type="hidden" name="writer" value="${user.nickname}" />
              <input type="hidden" id="pageType" value="form" />
              <input type="hidden" id="msg" value="${msg}" />
              <div id="latlng"></div>

              <div class="form-group">
                <label for="title">제목</label>
                <input type="text" class="form-control" id="title" name="title" required />
              </div>
              <div class="form-group">
                <label for="writer">작성자</label>
                <input
                  type="text"
                  class="form-control"
                  id="writer"
                  name="writer"
                  :value="nickname"
                  readonly
                />
              </div>
              <div class="form-group">
                <label for="placeName">핫플 이름</label>
                <input type="text" class="form-control" id="placeName" name="placeName" required />
              </div>
              <div class="form-group">
                <label for="date">방문 날짜</label>
                <input type="date" class="form-control" id="date" name="date" required />
              </div>
              <div class="form-group">
                <label for="location">장소 유형</label>
                <select class="form-control" id="location" name="location" required>
                  <option value="">선택하세요</option>
                  <option value="관광지">관광지</option>
                  <option value="문화시설">문화시설</option>
                  <option value="레포츠">레포츠</option>
                  <option value="숙박">숙박</option>
                  <option value="쇼핑">쇼핑</option>
                  <option value="음식점">음식점</option>
                  <option value="카페">카페</option>
                  <!-- 기타 장소 유형 추가 -->
                </select>
              </div>
              <div class="form-group">
                <label for="description">상세 설명</label>
                <textarea
                  class="form-control"
                  id="description"
                  name="description"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block write-btn">작성</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import "@/assets/css/hotplacewrite.css";

.write-btn {
  margin-top: 10px;
}
</style>
