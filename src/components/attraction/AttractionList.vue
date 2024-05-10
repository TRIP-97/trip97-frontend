<script setup>
import { ref, onMounted, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAttractions, getDropdownContentSido, getDropdownGugun } from "@/api/attraction.js";

import axios from "axios";

const route = useRoute();
const router = useRouter();

const attractions = ref([]);

const content = ref("");
const sido = ref("");
const gugun = ref("");

// 관광지를 받아오는 함수
async function getAttractionList() {
  getAttractions(
    content,
    sido,
    gugun,
    (response) => {
      attractions.value = response.data;
    //   for (var attraction of attractions.value) {
    //     console.log(attraction.latitude);
    //   }
      addMarkerAndRemovePrevious();
    },
    (error) => {
      console.log("관광지 불러오는 중 에러 발생");
      console.dir(error);
    }
  );
}

const map = toRefs(null);

const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 5,
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

const markers = ref([]);

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  for (var i = 0; i < markers.value.length; i++) {
    markers.value[i].setMap(null);
  }
  markers.value = [];
}

// 마커를 추가하는 함수 (마커가 있다면 지운 뒤 추가)
function addMarkerAndRemovePrevious() {
  removeMarker();
  var i = 0;
  for (var attraction of attractions.value) {
    var placePosition = new kakao.maps.LatLng(attraction.longitude, attraction.latitude);
    var marker = addMarker(placePosition, i);
  }
}

function addMarker(position, idx, title) {
  var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
  var imageSize = new kakao.maps.Size(36, 37); // 마커 이미지의 크기
  var imgOptions = {
    spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
    spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
    offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
  };

  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
  var marker = new kakao.maps.Marker({
    position: position, // 마커의 위치
    image: markerImage,
  });

  marker.setMap(map.value); // 지도 위에 마커를 표출합니다
  markers.value.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
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
</script>

<template>
  <button @click="getAttractionList">검색</button>
  <b-container>
    <b-row>
      <b-col col lg="2"></b-col>
      <b-col cols="12" md="auto"></b-col>
      <b-col col lg="2" class="map-area">
        <div class="map" id="map"></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<style scoped>
@import "@/assets/css/attraction/attractionList.css";
</style>
