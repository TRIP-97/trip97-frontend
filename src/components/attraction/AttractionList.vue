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

var listEl;

const map = toRefs(null); // 카카오 맵

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({
    position: new kakao.maps.LatLng(33.450701, 126.570667),
    content: 'open me plz.'
});

const content = ref({
  code: 0,
  name: "",
});

const sido = ref({
  code: 0,
  name: "",
});

const gugun = ref({
  code: 0,
  name: "",
});

// 관광지를 받아오는 함수
async function getAttractionList() {
  var bound = map.value.getBounds();
  console.log(gugun);
  getAttractions(
    content.value.code,
    sido.value.code,
    gugun.value.code,
    bound.ha,
    bound.qa,
    bound.oa,
    bound.pa,
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
    sido.value.code,
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

watch(sido, () => {
  // 키워드로 장소를 검색합니다
  // 장소 검색 객체를 생성합니다
  removeAllChildNods(listEl);
  var ps = new kakao.maps.services.Places();
  ps.keywordSearch(sido.value.name, placesSearchCB);
  getDropdownG();
});

watch(gugun, () => {
  var ps = new kakao.maps.services.Places();
  ps.keywordSearch(sido.value.name + gugun.value.name, placesSearchCB);
  removeAllChildNods(listEl);
});

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    var bounds = new kakao.maps.LatLngBounds();

    for (var i = 0; i < data.length; i++) {
      bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    }

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.value.setBounds(bounds);
  }
}

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

  listEl = document.getElementById('placesList');
  var menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(), 
    bounds = new kakao.maps.LatLngBounds(), 
    listStr = '';
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();
  console.log(contents.value);

  for (var i = 0; i < attractions.value.length; i++) {
    
    for(var j=0; j<contents.value.length; j++){
        if(attractions.value[i].contentTypeId==contents.value[j].code){
          var contentName = contents.value[j].name;
        }
    }

    var placePosition = new kakao.maps.LatLng(
      attractions.value[i].latitude,
      attractions.value[i].longitude
    ),
    marker = addMarker(placePosition, i),
    itemEl = getListItem(i, attractions.value[i],contentName); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function(marker, title) {

        kakao.maps.event.addListener(marker, 'mouseover', function() {
            displayInfowindow(marker, title);
        });

        kakao.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close();
        });

        itemEl.onmouseover =  function () {
            displayInfowindow(marker, title);
        };

        itemEl.onmouseout =  function () {
            infowindow.close();
        };
    })(marker, attractions.value[i].title);

      fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places, typeName) {

  var el = document.createElement('li'),
  itemStr = '<div class="info">' +
                '<div class="infoTop">' +
                  '<h5>' + places.title + '</h5>' + '<p>'+ typeName +'</p>'
                + '</div>';
  itemStr += '<span>' +  places.address  + '</span>'+
                '<p>'+places.rating+'</p>'+
                '<p>'+places.reviewCount+'</p>'+
           '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

  return el;
}


// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) { 
  if(el!=null){
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
  }
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {

    var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
    infowindow.setContent(content);
    infowindow.open(map.value, marker);
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
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
    "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=f866a7adcb3307f7c3c406e2ec39d7d0&libraries=services,clusterer,drawing";
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
      <option v-for="con in contents" :value="con">{{ con.name }}</option>
    </select>
    <select v-model="sido">
      <option :value="{ code: 0, name: '' }">전체</option>
      <option v-for="si in sidos" :value="si">{{ si.name }}</option>
    </select>
    <select v-model="gugun">
      <option :value="{ code: 0, name: '' }">전체</option>
      <option v-for="gu in guguns" :value="gu">{{ gu.name }}</option>
    </select>
  </div>
  <button @click="getAttractionList">검색</button>
  <div class="map_wrap">
    <div id="map" class="map"></div>
    <div id="menu_wrap" class="bg_white">  
      <hr>
        <ul id="placesList"></ul>
    </div>
</div>
</template>

<style scoped>
@import "@/assets/css/attraction/attractionList.css";
</style>
