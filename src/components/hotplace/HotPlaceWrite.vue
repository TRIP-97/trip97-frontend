<script setup>
import { ref, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const nickname = ref("");
const title = ref("");
const content = ref("");
const placeName = ref("");
const visitedDate = ref("");
const location = ref("");
const latitude = ref(null);
const longitude = ref(null);

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

const writeHotPlace = async () => {
  const hotPlaceData = {
    title: title.value,
    content: content.value,
    placeName: placeName.value,
    visitedDate: visitedDate.value,
    location: location.value,
    latitude: latitude.value,
    longitude: longitude.value,
  };

  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post("http://localhost:8080/hotplace", hotPlaceData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      router.replace({ name: 'hotPlaceList' });
    }
  } catch (error) {
    console.error("핫플레이스 게시글 등록 실패:", error);
  }
};

onMounted(() => {
  fetchProfile();
});

// KAKAO MAP API 시작
const map = toRefs(null);

const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(36.35659864, 127.30901502),
    level: 6,
  };

    map.value = new kakao.maps.Map(container, options);

    // map 객체가 초기화된 이후에 이벤트 리스너를 추가
    kakao.maps.event.addListener(map.value, "click", function (mouseEvent) {
    var latlng = mouseEvent.latLng;
    latitude.value = latlng.getLat();
    longitude.value = latlng.getLng();

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
      "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=f866a7adcb3307f7c3c406e2ec39d7d0&libraries=services,clusterer,drawing";
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
            <form>

              <div class="form-group">
                <label for="title">제목</label>
                <input type="text" class="form-control" id="title" name="title" v-model="title" required />
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
                <input type="text" class="form-control" id="placeName" name="placeName" v-model="placeName" required />
              </div>
              <div class="form-group">
                <label for="date">방문 날짜</label>
                <input type="date" class="form-control" id="visitedDate" name="visitedDate" v-model="visitedDate" required />
              </div>
              <div class="form-group">
                <label for="placeName">위치</label>
                <input type="text" class="form-control" id="location" name="location" v-model="location" required />
              </div>
              <div class="form-group">
                <label for="content">상세 설명</label>
                <textarea
                  class="form-control"
                  id="content"
                  name="content"
                  rows="5"
                  v-model="content"
                  required
                ></textarea>
              </div>

              <button @click.prevent="writeHotPlace" class="btn btn-primary btn-block write-btn">등록</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import "@/assets/css/hotplace/hotplacewrite.css";

.write-btn {
  margin-top: 10px;
}
</style>
