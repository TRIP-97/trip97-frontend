<script setup>
import { ref, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { getMemberProfile } from "@/api/member";
import { registHotPlace } from "@/api/hotplace";

const router = useRouter();
const nickname = ref("");
const title = ref("");
const content = ref("");
const placeName = ref("");
const startDate = ref("");
const endDate = ref("");
const location = ref("");
const latitude = ref(null);
const longitude = ref(null);

const token = ref("");
// 사용자 정보 가져오기
const fetchProfile = async () => {
  token.value = localStorage.getItem("accessToken");
  if (token) {
    try {
      const response = await getMemberProfile(token.value);

      if (response.data) {
        nickname.value = response.data.nickname;
      }
    } catch (error) {
      console.error("프로필 정보 조회 실패:", error);
    }
  }
};

// 핫플레이스 게시글을 작성하는 함수
const writeHotPlace = async () => {
  const hotPlaceData = {
    title: title.value,
    content: content.value,
    placeName: placeName.value,
    startDate: startDate.value,
    endDate: endDate.value,
    location: location.value,
    latitude: latitude.value,
    longitude: longitude.value,
  };

  try {
    console.log("try token", token.value);
    const response = await registHotPlace(token.value, hotPlaceData);
    console.log(response);
    if (response.status === 201) {
      router.replace({
        name: "hotPlaceDetail",
        params: { id: response.data.id },
      });
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

  // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
  let mapTypeControl;
  mapTypeControl = new kakao.maps.MapTypeControl();
  // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
  // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
  map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
  let zoomControl = new kakao.maps.ZoomControl();
  map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

  // map 객체가 초기화된 이후에 이벤트 리스너를 추가
  kakao.maps.event.addListener(map.value, "click", function (mouseEvent) {
    var latlng = mouseEvent.latLng;
    latitude.value = latlng.getLat();
    longitude.value = latlng.getLng();

    addMarkerAndRemovePrevious(latlng);
  });
};

var marker;
// 마커를 추가하는 함수 (마커가 있다면 지운 뒤 추가)
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
      <h1 style="text-align: center; margin-bottom: 100px">HOTPLACE 등록</h1>
      <div class="container">
        <div class="row mt-5">
          <div class="col-lg-6 map-area border border-secondary">
            <div class="row-md-5 map" id="map"></div>
          </div>
          <div class="col-lg-6">
            <form>
              <div class="form-group">
                <label for="title">제목</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  name="title"
                  v-model="title"
                  required
                />
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
                <input
                  type="text"
                  class="form-control"
                  id="placeName"
                  name="placeName"
                  v-model="placeName"
                  required
                />
              </div>
              <div class="form-group">
                <label for="date">방문 날짜</label>
                <input
                  type="date"
                  class="form-control"
                  id="startDate"
                  name="startDate"
                  v-model="startDate"
                  required
                />
                <input
                  type="date"
                  class="form-control"
                  id="endDate"
                  name="endDate"
                  v-model="endDate"
                  required
                />
              </div>
              <div class="form-group">
                <label for="placeName">위치</label>
                <input
                  type="text"
                  class="form-control"
                  id="location"
                  name="location"
                  v-model="location"
                  required
                />
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

              <button @click.prevent="writeHotPlace" class="btn btn-primary btn-block write-btn">
                등록
              </button>
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
