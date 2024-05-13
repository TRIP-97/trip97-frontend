<script setup>
import { ref, onMounted, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAttractions, getDropdownContentSido, getDropdownGugun } from "@/api/attraction.js";

import axios from "axios";

const route = useRoute();
const router = useRouter();

const attractions = ref([]); // 불러온 관광지 목록들
const sidos = ref([]); // 드롭다운 메뉴
const contents = ref([]); // 드롭다운 메뉴 2
const guguns = ref([]); // 드롭다운 메뉴 3

const content = ref("0");
const sido = ref("0");
const gugun = ref("0");

// 관광지를 받아오는 함수
async function getAttractionList() {
  var bound = map.value.getBounds();
  getAttractions(
    content.value,
    sido.value,
    gugun.value,
    bound.ha,
    bound.qa,
    bound.oa,
    bound.pa,
    (response) => {
      attractions.value = response.data;
      //   for (var attraction of attractions.value) {
      //     console.log(attraction.latitude);
      //   }
      console.log(attractions.value);
      addMarkerAndRemovePrevious();
    },
    (error) => {
      console.log("관광지 불러오는 중 에러 발생");
      console.dir(error);
    }
  );
}

// 드롭다운
async function getDropdownCS() {
  getDropdownContentSido(
    (response) => {
      contents.value = response.data.content;
      sidos.value = response.data.sido;

      console.log(contents);
      console.log(sidos);
    },
    (error) => {
      console.log("드롭다운 불러오는 중 실패");
      console.dir(error);
    }
  );
}

async function getDropdownG() {
  console.log(sido.value);
  getDropdownGugun(
    sido.value,
    (response) => {
      guguns.value = response.data;
      console.log(guguns);
    },
    (error) => {
      console.log("드롭다운 불러오는 중 실패");
      console.dir(error);
    }
  );
}

watch(sido, (newValue, oldValue) => {
  console.log("시도바뀜?");
  getDropdownG();
});

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
  for (var i = 0; i < attractions.value.length; i++) {
    var placePosition = new kakao.maps.LatLng(
      attractions.value[i].latitude,
      attractions.value[i].longitude
    );
    console.log(attractions.value[i].longitude);
    console.log(attractions.value[i].latitude);
    var marker = addMarker(placePosition, i);
  }
}

function addMarker(position, idx, title) {
  var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
  var imageSize = new kakao.maps.Size(24, 35); // 마커 이미지의 크기

  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
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
  getDropdownCS();
});
</script>

<template>
  <div class="drop">
    <select v-model="content">
      <option v-for="con in contents" :value="con.code">{{ con.name }}</option>
    </select>
    <select v-model="sido">
      <option v-for="si in sidos" :value="si.code">{{ si.name }}</option>
    </select>
    <select v-model="gugun">
      <option v-for="gu in guguns" :value="gu.code">{{ gu.name }}</option>
    </select>
  </div>
  <button @click="getAttractionList">검색</button>
  <div class="map" id="map"></div>
</template>

<style scoped>
@import "@/assets/css/attraction/attractionList.css";
</style>
