<script setup>
  import { ref, onMounted, toRefs, defineEmits } from "vue";
  import { selectFavoritesByMemberId } from "@/api/favorite.js";

  import { storeToRefs } from "pinia";
  import { useMemberStore } from "@/stores/member";

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  const emit = defineEmits(["change-view", "add-place"]);

  const attractions = ref([]); // 불러온 관광지 목록들
  // 사용자가 지도를 클릭해서 선택한 장소 이름, 좌표
  const selectedPlaces = ref([]); // 선택된 장소들
  const checkedAttractions = ref([]); // 체크된 관광지 상태 관리

  // 계획 상세 화면으로 이동하는 함수
  const changeDetailView = () => {
    emit("change-view");
  };

  // 즐겨찾기한 관광지를 받아오는 함수
  async function getFavoriteList() {
    selectFavoritesByMemberId(
      userInfo.value.id,
      (response) => {
        attractions.value = response.data;
        console.log(attractions.value);
        console.log("즐겨찾기한 관광지 불러오기 성공!");
      },
      (error) => {
        console.log("즐겨찾기한 관광지 불러오는 중 에러 발생");
        console.dir(error);
      }
    );
  }

  // 관광지를 클릭하면 마커가 생기고 맵 중심이 이동하게 하는 함수
  const moveToAttraction = (attraction) => {
    const latlng = new kakao.maps.LatLng(attraction.latitude, attraction.longitude);
    map.value.setCenter(latlng);
    addMarkerAndRemovePrevious(latlng, attraction.contentTypeId);
  };

  // 검색된 관광지 체크박스 관리
  const handleCheckAttraction = (e, attractionId) => {
    checkedAttractions.value[attractionId] = e.target.checked;
  };

  // 장소 추가 기능을 하는 함수
  const handleAddPlace = () => {
    selectedPlaces.value = [];

    for (const attractionId in checkedAttractions.value) {
      if (checkedAttractions.value[attractionId]) {
        const attraction = attractions.value.find((a) => a.id === parseInt(attractionId));
        if (attraction) {
          selectedPlaces.value.push({
            title: attraction.title,
            latitude: attraction.latitude,
            longitude: attraction.longitude,
            contentTypeId: attraction.contentTypeId,
          });
        }
      }
    }
    emit("add-place", selectedPlaces.value);
    emit("change-view");
  };

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
  };

  var marker;
  // 마커를 추가하는 함수 (마커가 있다면 지운 뒤 추가)
  function addMarkerAndRemovePrevious(position, category) {
    if (marker != null) {
      marker.setMap(null);
    }

    if (category !== "") {
      const imageSrc = new URL(`../../assets/images/markIcon${category}.png`, import.meta.url).href;
      const imageSize = new kakao.maps.Size(53, 65);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      marker = new kakao.maps.Marker({
        position: position,
        map: map.value,
        image: markerImage,
      });
    } else {
      marker = new kakao.maps.Marker({
        position: position,
        map: map.value,
      });
    }
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

    getFavoriteList();
  });
</script>

<template>
  <div class="container">
    <div class="row justify-content-center plan-container">
      <!-- 여행 경로 맵 영역 -->
      <div class="col-lg-6 map-area border border-secondary">
        <div class="map" id="map"></div>
      </div>

      <!-- 여행 계획 내용 영역 -->
      <div class="col-lg-5">
        <!-- 헤더 -->
        <div class="row plan-header text-center">
          <div class="col-lg-3 d-flex align-items-center justify-content-start">
            <i @click="changeDetailView" class="fa-solid fa-chevron-left"></i>
          </div>
          <div class="col-lg-6 d-flex align-items-center justify-content-center position-relative">
            <p class="position-absolute start-50 translate-middle-x page-title">내 즐겨찾기</p>
          </div>
          <div class="col-lg-3 d-flex align-items-center justify-content-end">
            <button class="btn btn-primary add-place-btn" @click="handleAddPlace">추가하기</button>
          </div>
        </div>

        <!-- 내가 즐겨찾기한 관광지 목록 -->
        <div class="attraction-list overflow-auto">
          <div
            class="row attraction-section p-2 mb-2"
            v-for="attraction in attractions"
            :key="attraction.id"
            style="background-color: #f5f5f5; border-radius: 10px"
          >
            <div class="col-lg-10 attraction-info d-flex" @click="moveToAttraction(attraction)">
              <img
                v-if="attraction.firstImage !== ''"
                :src="attraction.firstImage"
                alt=""
                style="width: 50px"
              />
              <img v-else src="@/assets/images/no_image.png" alt="" style="width: 50px" />
              <div class="ms-2">
                <p class="mb-0 attraction-title">{{ attraction.title }}</p>
                <p class="mb-0 attraction-address">{{ attraction.address }}</p>
              </div>
            </div>
            <div class="col-lg-2 d-flex align-items-center justify-content-end">
              <input
                type="checkbox"
                class="custom-checkbox"
                @change="(e) => handleCheckAttraction(e, attraction.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .plan-container {
    margin-top: 50px;
  }

  .map-area {
    margin-right: 30px;
    border-radius: 15px;
    box-shadow: 2px 2px 2px 2px rgba(200, 200, 200, 0.8);
    background-color: rgb(255, 255, 255, 0.6);
  }

  .map {
    width: auto;
    height: 650px;
    margin-top: 15px;
    margin-bottom: 15px;
    border: 1px solid rgb(183, 183, 183);
    border-radius: 10px;
  }

  .fa-chevron-left {
    margin-left: 15px;
    cursor: pointer;
  }

  .page-title {
    padding-top: 13px;
  }

  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #ddd;
  }

  .add-place-btn {
    font-size: 14px;
    width: 80px;
    color: white;
  }

  .add-place-btn {
    border: 1px solid #8280dd;
    background-color: #8280dd;
  }

  .add-place-btn:hover {
    border: 1px solid #8280dd;
    background-color: #8280dd;
  }

  .attraction-list {
    height: 595px;
    overflow-y: auto;
    border: 1px solid rgb(214, 214, 214);
    border-radius: 10px;
    margin-top: 30px;
    box-shadow: 2px 2px 2px 2px rgba(200, 200, 200, 0.8);
    padding: 5px;
  }

  .attraction-section {
    background-color: #f5f5f5;
    border-radius: 10px;
    margin-right: 10px;
    margin-left: 10px;
    cursor: pointer;
  }

  .attraction-info img {
    margin-right: 10px;
  }

  .attraction-title {
    font-size: 16px;
  }

  .attraction-address {
    font-size: 13px;
    font-family: NanumSquareRound;
    color: gray;
  }

  .custom-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-radius: 4px;
    appearance: none;
    cursor: pointer;
    position: relative;
    background-color: white;
  }

  .custom-checkbox:checked {
    background-color: #8280dd; /* 파스텔톤 연보라색 */
    border: 2px solid #8280dd; /* 체크박스 테두리도 연보라색으로 */
  }

  .custom-checkbox:checked::after {
    content: "✔";
    color: white;
    font-size: 15px;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -42%);
  }

  .attraction-list::-webkit-scrollbar,
  .attraction-list::-webkit-scrollbar {
    width: 10px;
  }

  .attraction-list::-webkit-scrollbar-track,
  .attraction-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  .attraction-list::-webkit-scrollbar-thumb,
  .attraction-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  .attraction-list::-webkit-scrollbar-thumb:hover,
  .attraction-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
