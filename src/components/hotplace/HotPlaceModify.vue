<script setup>
import { ref, onMounted, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailHotPlace, modifyHotPlace } from "@/api/hotplace";

const route = useRoute();
const router = useRouter();

const hotPlaceId = ref(route.params.id);
const hotPlace = ref("");

// 핫플레이스 게시글 조회
function getHotPlace() {
  detailHotPlace(
    hotPlaceId.value,
    (response) => {
      hotPlace.value = response.data;
      hotPlace.value.startDate = formatVisitedDate(hotPlace.value.startDate);
      hotPlace.value.endDate = formatVisitedDate(hotPlace.value.endDate);
      console.log(hotPlace.value);
    },
    (error) => {
      console.log("HotPlace 게시글 불러오는 중 에러 발생!");
      console.dir(error);
    }
  );
}

// 날짜 포맷 변경 함수
function formatVisitedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

// 핫플레이스 게시글 수정
const updateHotPlace = async () => {
  const response = modifyHotPlace(
    hotPlace.value,
    () => {
      router.replace({
        name: "hotPlaceDetail",
        params: { id: hotPlace.value.id },
      });
    },
    (error) => {
      console.log("게시글 수정 중 에러 발생:", error);
    }
  );
};

// KAKAO MAP API 시작
const map = toRefs(null);

var marker;

// 맵 생성시 마커를 추가하는 함수
function addMarker() {
  let latitude = hotPlace.value.latitude;
  let longitude = hotPlace.value.longitude;
  let position = new kakao.maps.LatLng(latitude, longitude);

  marker = new kakao.maps.Marker({
    position: position,
    map: map.value,
  });

  map.value.setCenter(position);
}

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

// 카카오맵을 그리는 함수
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

  // 마커를 추가합니다.
  addMarker();

  // map 객체가 초기화된 이후에 이벤트 리스너를 추가
  kakao.maps.event.addListener(map.value, "click", function (mouseEvent) {
    var latlng = mouseEvent.latLng;
    hotPlace.value.latitude = latlng.getLat();
    hotPlace.value.longitude = latlng.getLng();

    addMarkerAndRemovePrevious(latlng);
  });
};

onMounted(() => {
  /* global kakao */
  getHotPlace();
  if (window.kakao && window.kakao.maps && hotPlace.value !== "") {
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
      <div class="container">
        <div class="row mt-5 justify-content-center">
          <div class="col-lg-5 map-area border border-secondary">
            <div class="row-md-5 map" id="map"></div>
          </div>
          <div class="col-lg-5">
            <div class="form-group">
              <label for="title">제목</label>
              <input
                type="text"
                class="form-control"
                id="title"
                name="title"
                v-model="hotPlace.title"
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
                :value="hotPlace.writerNickname"
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
                v-model="hotPlace.placeName"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-heading">방문 날짜</label>
              <div class="date-field">
                  <label for="startDate">시작일</label>
                  <input
                    type="date"
                    class="form-control"
                    id="startDate"
                    name="startDate"
                    v-model="hotPlace.startDate"
                    required
                  />
              </div>
              <div class="date-field">
                  <label for="endDate">종료일</label>
                  <input
                    type="date"
                    class="form-control"
                    id="endDate"
                    name="endDate"
                    v-model="hotPlace.endDate"
                    required
                  />
              </div>
            </div>
            <div class="form-group">
              <label for="placeName">위치</label>
              <input
                type="text"
                class="form-control"
                id="location"
                name="location"
                v-model="hotPlace.location"
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
                v-model="hotPlace.content"
                required
              >
                {{ hotPlace.content }}
                </textarea
              >
            </div>
            
            <div class="text-right">
              <button @click.prevent="updateHotPlace" class="btn btn-primary btn-block write-btn">
                수정하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.map-area {
  margin-right: 30px; /* 맵과 폼 사이의 간격을 조절 */
}

.map {
  width: auto;
  height: 755px;
  margin-top: 15px;
  border: 1px solid;
  border-radius: 10px;
}

.map-area {
  border-radius: 15px;
  box-shadow: 2px 2px 2px 2px rgba(200, 200, 200, 0.8);
  background-color: rgb(255, 255, 255, 0.6);
}

.form-heading,
label {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #f8f9fa; /* 라벨 배경색 */
  padding: 5px 10px; /* 라벨 내부 여백 */
  border-radius: 5px; /* 모서리 둥글게 처리 */
}

.date-field {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.date-field label {
  margin-right: 10px; /* 라벨과 입력 필드 사이의 간격 */
  white-space: nowrap; /* 라벨을 한 줄로 유지 */
}

.form-control {
  flex-grow: 1; /* 입력 필드가 가능한 공간을 모두 차지하도록 확장 */
}

.file-upload-btn {
  margin-top: 10px;
}

.write-btn {
  margin-top: 10px;
}
</style>
