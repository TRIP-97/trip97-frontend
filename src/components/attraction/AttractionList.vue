<template>
  <div class="listBody">
    <div class="map_body">
      <div id="menu_wrap" class="bg_white">
        <div class="searchDiv">
          <button class="searchBtn" @click="getAttractionList">
          <i class="fa fa-search searchIcon"></i>
        </button>
          <input 
          type="text" 
          class="form-search" 
          v-model="title"
          placeholder="장소명을 입력해주세요"
          @keyup.enter="getAttractionList">
        </input>
        <!-- <button class="searchBtn" @click="getAttractionList">
        </button> -->
      </div>
      <ul
          v-for="(list, contentTypeId) in listsByContentTypeId"
          :key="contentTypeId"
          :id="'placesList_' + contentTypeId"
          class="placesList"
        >
          <li
            v-for="place in list"
            :key="place"
            class="item"
            @mouseover="() => windowOnOff(place.marker, place.attraction,'on')"
            @mouseout="() => windowOnOff(place.marker, place.attraction, 'off')"
            @click="showAttractionDetail(place.attraction.id,contentTypeId)"
          >
            <div class="info">
              <div class="infoTop">
                <h4 class="infoTitle">{{ place.attraction.title }}</h4>
                <p class="infoType">
                  {{ categories.find((category) => category.code === parseInt(contentTypeId))?.name }}
                </p>
              </div>
              <div class="infoBottom d-flex flex-column">
                <p class="infoAddress">{{ place.attraction.address }}</p>
                <div class = "mt-0 d-flex flex-row">
                  <p class="infoRating mr-2">{{ place.attraction.rating }}</p>
                  <img
                    v-for="n in Math.floor(place.attraction.rating)"
                    :key="'star' + n"
                    class="infoStar"
                    src="@/assets/images/RaitingStar.png"
                    alt="Star"
                  />
                  <img
                    v-for="n in (5 - Math.floor(place.attraction.rating))"
                    :key="'noStar' + n"
                    class="infoStar"
                    src="@/assets/images/RaitingNoStar.png"
                    alt="No Star"
                  />
                  <p class="infoReview">리뷰 {{ place.attraction.reviewCount }}</p>
                </div>
              </div>
              <img
                class="infoImg"
                v-if="place.attraction.firstImage"
                :src="place.attraction.firstImage"
                alt="Place Image"
              />
            </div>
          </li>
        </ul>
      </div>
      <div class="right">
        <div class="map_wrap">
          <div class="drop">
            <div class="select-container">
              <label class="select-label" for="sido">시도</label>
              <select class="sido" id="sido" v-model="sido">
                <option :value="{ code: 0, name: '' }">전체</option>
                <option v-for="si in sidos" :value="si">{{ si.name }}</option>
              </select>
              <svg viewBox="0 0 20 20" fill="currentColor" class="chevron-down w-6 h-6">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="select-container">
              <label class="select-label" for="gugun">구군</label>
              <select class="gugun" id="gugun" v-model="gugun">
                <option :value="{ code: 0, name: '' }">전체</option>
                <option v-for="gu in guguns" :value="gu">{{ gu.name }}</option>
              </select>
              <svg viewBox="0 0 20 20" fill="currentColor" class="chevron-down w-6 h-6">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <button class="searchBtn" @click="getAttractionList">검색</button>
          </div>
          <div id="map" class="map">
            <ul id="category" class="category-list">
              <li
                v-for="category in categories"
                :key="category.code"
                :id="category.code"
                :data-order="category.order"
                @click="onClickCategory($event)"
                :class="{
                  on: category.code === content.code,
                  off: category.code !== content.code,
                }"
              >
                <img :src="getIconPath(category.code)" alt="" class="category-icon" />
                {{ category.name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="child" ref="section">
          <transition name="slide">
            <div v-if="selectedAttractionId" class="attraction-detail-container">
              <img class="bookmark" src="@/assets/images/BookMark.png" @click="showModal = true"/>
              <AttarctionDetail :attraction-id="selectedAttractionId" :attraction-content="selectedAttractionContent" @close="closeAttractionDetail"/>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAttractions, getDropdownContentSido, getDropdownGugun } from "@/api/attraction.js";
import { registerFavorite, removeFavorite, selectFavorite } from "@/api/favorite.js";
import AttarctionDetail from "@/components/attraction/AttractionDetail.vue";
import axios from "axios";

import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/member";

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

// 라우터 및 라우트 사용
const route = useRoute();
const router = useRouter();

// 상태 변수
const attractions = ref([]); // 불러온 관광지 목록들
const categories = ref([]); // 콘텐츠 목록
const sidos = ref([]); // 드롭다운 메뉴
const guguns = ref([]); // 드롭다운 메뉴 2

const listsByContentTypeId = ref({}); // 관광지 내용을 저장한 배열, contentType에 따라 다르게 저장됨

const map = ref(null); // 카카오 맵
const markers = ref([]);
const title = ref("");
const infowindows = ref([]);
const selectedAttractionId = ref(""); // 자식에게 보낼 id 값
const selectedAttractionContent = ref(""); // 자식에게 보낼 관광지 타입 값 
const section = ref(null);



// 자식 컴포넌트에 보낼 파라미터 값 
const showAttractionDetail = (attractionId,contentTypeId) => {
  console.log("attractionDetail", attractionId);
  if (selectedAttractionId.value === attractionId) {
    selectedAttractionId.value = null;
  } else {
    section.value.scrollIntoView({behavior : 'smooth'});
    selectedAttractionId.value = attractionId;
    selectedAttractionContent.value = categories.value.find((category) => category.code === parseInt(contentTypeId))?.name;
  }
};

// 자식 컴포넌트 닫기 
const closeAttractionDetail = () => {
  selectedAttractionId.value = null;
};

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
  const bound = map.value.getBounds();
  getAttractions(
    content.value.code,
    sido.value.code,
    gugun.value.code,
    bound.ha,
    bound.qa,
    bound.oa,
    bound.pa,
    title.value,
    (response) => {
      attractions.value = response.data;
      if (content.value.code === 0) {
        removeAllList();
        removeAllMarkers();
      }
      if(attractions.value.length>0){
        addMarkerAndPrevious();
      }
      content.value.code = 0;
      content.value.name = "";
    },
    (error) => {
      console.log("관광지 불러오는 중 에러 발생");
      console.dir(error);
    }
  );
}

// 지도에 카테고리 추가
const addCategoryClickEvent = () => {
  const category = document.getElementById("category");
  Array.from(category.children).forEach((child) => {
    child.onclick = onClickCategory;
  });
};

// 특정 카테고리에 해당하는 마커 제거 함수
const removeCategoryMarkers = (category) => {
  markers.value = markers.value.filter((marker) => {
    if (String(marker.category) === String(category)) {
      marker.setMap(null);
      return false;
    }
    return true;
  });
};

const onClickCategory = (event) => {
  let target = event.target;

  // 클릭된 요소가 <img>인 경우 부모 <li> 요소를 찾습니다.
  if (target.tagName === "IMG") {
    target = target.closest("li");
  }

  const id = target.id;
  const className = target.className;

  console.log("눌렀더니?", id);

  if (className.includes("on")) {
    // className.includes로 클래스 이름을 확인
    content.value = { code: 0, name: "" };
    changeCategoryClass(target);
    removeCategoryMarkers(id);
    removeContentChildNodes(id);
  } else {
    content.value = { code: id, name: target.innerText };
    changeCategoryClass(target);
    getAttractionList();
  }
};

// 클릭된 카테고리에 스타일 적용 함수
const changeCategoryClass = (el) => {
  const category = document.getElementById("category");

  if (el) {
    // 클릭된 요소의 클래스가 'on'이면 'off'로, 'off'이면 'on'으로 변경
    if (el.classList.contains("on")) {
      el.classList.remove("on");
      el.classList.add("off");
    } else {
      el.classList.remove("off");
      el.classList.add("on");
    }
  }
};

// 드롭다운 데이터 가져오기
async function getDropdownCS() {
  getDropdownContentSido(
    (response) => {
      categories.value = response.data.content;
      sidos.value = response.data.sido;
      addCategoryClickEvent();
    },
    (error) => {
      console.log("드롭다운 불러오는 중 실패");
      console.dir(error);
    }
  );
}

async function getDropdownG() {
  getDropdownGugun(
    sido.value.code,
    (response) => {
      guguns.value = response.data;
    },
    (error) => {
      console.log("드롭다운 불러오는 중 실패");
      console.dir(error);
    }
  );
}

// 시도 선택 변경 시 구군 데이터 가져오기
watch(sido, () => {
  resetCategorySelection();
  removeAllMarkers();
  removeAllList();
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(sido.value.name, placesSearchCB);
  getDropdownG();
});

// 구군 선택 변경 시 데이터 가져오기
watch(gugun, () => {
  resetCategorySelection();
  removeAllMarkers();
  removeAllList();
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(`${sido.value.name} ${gugun.value.name}`, placesSearchCB);
});

// 해당 카테고리 관광지가 있으면 카테고리 선택
function addCategorySelection(category) {
  const categoryElements = document.querySelectorAll("#category .off");
  categoryElements.forEach((el) => {
    if (el.id == category) {
      el.classList.remove("off");
      el.classList.add("on");
    }
  })
}

// 카테고리 전부 선택 해제
function resetCategorySelection() {
  const categoryElements = document.querySelectorAll("#category .on");
  categoryElements.forEach((el) => {
    el.classList.remove("on");
    el.classList.add("off");
  });
}

// 지도 위 모든 마커들 삭제
function removeAllMarkers() {
  markers.value.forEach((marker) => {
    if (marker.setMap) {
      marker.setMap(null);
    }
  });
  markers.value = [];
}

// 옆에 있는 모든 관광지 목록들 삭제
function removeAllList() {
  // 객체의 키를 배열로 반환하고 길이를 확인
  if (Object.keys(listsByContentTypeId.value).length > 0) {
    Object.keys(listsByContentTypeId.value).forEach((categoryId) => {
      delete listsByContentTypeId.value[categoryId];
    });
  }
}

// 키워드 검색 완료 시 호출되는 콜백함수
function placesSearchCB(data, status) {
  if (status === kakao.maps.services.Status.OK) {
    const bounds = new kakao.maps.LatLngBounds();
    data.forEach((item) => {
      bounds.extend(new kakao.maps.LatLng(item.y, item.x));
    });
    map.value.setBounds(bounds);
  }
}

// 지도 초기화 함수
const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 5,
  };
  map.value = new kakao.maps.Map(container, options);

  const mapTypeControl = new kakao.maps.MapTypeControl();
  map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  const zoomControl = new kakao.maps.ZoomControl();
  map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
};

// 마커를 생성하고 지도 위에 마커를 표시하는 함수
function addMarker(position, idx, category) {
  const imageSrc = new URL(`../../assets/images/markIcon${category}.png`, import.meta.url).href;
  const imageSize = new kakao.maps.Size(43, 55);
  const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
  const marker = new kakao.maps.Marker({
    position,
    image: markerImage,
  });

  marker.setMap(map.value);
  marker.category = category;
  markers.value.push(marker);

  return marker;
}

// 마커, 목록 추가 함수
function addMarkerAndPrevious() {

  const bounds = ref(null);

  if(title.value!="" && title.value!=null){
    bounds.value = new kakao.maps.LatLngBounds();
  }

  attractions.value.forEach((attraction, index) => {
    const placePosition = new kakao.maps.LatLng(attraction.latitude, attraction.longitude);
    const marker = addMarker(placePosition, index, attraction.contentTypeId);
    markers.value.push(marker);

    if(bounds.value){
      bounds.value.extend(placePosition);
    }

    // attraction.contentTypeId를 사용하여 contentTypeId 기반으로 관리
    const contentTypeId = attraction.contentTypeId;

    if (!listsByContentTypeId.value[contentTypeId]) {
      listsByContentTypeId.value[contentTypeId] = [];
      addCategorySelection(contentTypeId);
    }

    listsByContentTypeId.value[contentTypeId].push({
      attraction: attraction,
      marker: marker,
    });

    // 이벤트 리스너를 추가할 때 콜백 함수에 접근하는 데이터를 클로저로 처리
    kakao.maps.event.addListener(marker, "mouseover", function () {
      displayInfowindow(marker, attraction);
    });

    kakao.maps.event.addListener(marker, "click", function() {
      showAttractionDetail(attraction.id, attraction.contentTypeId);
    });
    
    kakao.maps.event.addListener(marker, "mouseout", function () {
          closeAllInfoWindows();
    });

  });

  console.log("listsByContentTypeId: ", listsByContentTypeId.value);

  try {
    if (bounds.value) {
      map.value.setBounds(bounds.value);
    }
  } catch (error) {
    console.error('Error setting map bounds:', error);
  }

  nextTick(() => {
    const menuEl = document.getElementById("menu_wrap");
    if (menuEl) {
      menuEl.scrollTop = 0;
    }
  });
}


function removeContentChildNodes(id) {
  // 모든 마커를 순회하면서 category가 일치하는 마커를 삭제
  if (Array.isArray(markers.value)) {
    // 필터를 사용하여 category가 일치하지 않는 마커들만 남김
    markers.value = markers.value.filter((marker) => {
      if (marker.category === id) {
        // 지도에서 해당 마커를 제거
        marker.setMap(null);
        return false; // 이 마커는 제거할 것이므로 필터링
      }
      return true; // 이 마커는 유지
    });

    // listsByContentTypeId에서 해당 id를 삭제
    delete listsByContentTypeId.value[id];
  } else {
    console.error(`Markers is not an array`);
  }
}

function windowOnOff(marker, attraction, status) {
      closeAllInfoWindows();

      if (status === "on") {
        displayInfowindow(marker, attraction);
      }
    }

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
function displayInfowindow(marker, attraction,window) {
  const content =
  `<div style="padding:5px; z-index:1; width:250px; max-height:300px;">${attraction.title}` +
    `<div style="font-size:12px">${attraction.address}</div>` +
    `<div><img src="${attraction.firstImage}" style="width:200px"/></div>` +
    `</div>`;

    const infowindow = new kakao.maps.InfoWindow({
        content: content,
        position: new kakao.maps.LatLng(attraction.latitude, attraction.longitude)
    });
      
    infowindow.open(map.value, marker);
      infowindows.value.push(infowindow);
      return infowindow;
}

function closeAllInfoWindows() {
      infowindows.value.forEach(infowindow => infowindow.close());
      infowindows.value = [];
    }

// 카테고리 아이콘 경로를 동적으로 반환하는 함수
const getIconPath = (code) => {
  return new URL(`../../assets/images/categoryIcon${code}.png`, import.meta.url).href;
};

// 컴포넌트가 마운트될 때 초기화
onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=f866a7adcb3307f7c3c406e2ec39d7d0&libraries=services,clusterer,drawing";
    script.addEventListener("load", () => {
      kakao.maps.load(() => {
        initMap();
      });
    });
    document.head.appendChild(script);
  }
  getDropdownCS();
});
</script>

<style scoped>
@import "@/assets/css/attraction/attractionList.css";
</style>
