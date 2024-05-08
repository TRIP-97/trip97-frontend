<script setup>
import { ref, onMounted, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const hotPlaceId = ref(route.params.id);
const hotPlace = ref('');

// 핫플레이스 게시글 조회
async function getHotPlace() {
  console.log("test");
  axios
    .get(`http://localhost:8080/hotplace/${hotPlaceId.value}`)
    .then((response) => {
      hotPlace.value = response.data;
      console.log(hotPlace.value);
    })
    .catch((error) => {
      console.log("HotPlace 게시글 불러오는 중 에러 발생!");
      console.dir(error);
    });
}

function goHotPlaceList() {
  router.push({ name: "hotPlaceList" });
}

// KAKAO MAP API 시작
const map = toRefs(null);

var marker;
function addMarker() {
  let latitude = hotPlace.value.latitude;
  let longitude =hotPlace.value.longitude;
  let position = new kakao.maps.LatLng(latitude, longitude);
  console.log(latitude, longitude);
  marker = new kakao.maps.Marker({
    position: position,
    map: map.value
  });
  
  map.value.setCenter(position);
}

const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(36.35659864, 127.30901502),
    level: 6,
  };

  map.value = new kakao.maps.Map(container, options);
  
  addMarker();
};

onMounted(() => {
  /* global kakao */
  getHotPlace();
  if (window.kakao && window.kakao.maps && hotPlace.value !== '') {
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
  <div class="container mt-5">
    <main>
      <div style="height:50px"></div>
      <div class="container mt-5">
        <h2 class="text-center mb-4 font-weight-bold">핫플 소개하기</h2>

        <div class="row mt-5">
          <div class="post-info">
            <div class="row justify-content-center pt-5">
              <div class="col-sm-12 mb-5">
                <div class="card bg-light py-0">
                  <div class="card-header" id="titleHeader">
                    <span class="card-text">{{ hotPlace.title }}</span>
                  </div>
                  <div class="card-body my-1 py-1 d-flex justify-content-between align-items-center" id="postInfoCardBody">
                      <span class="card-text" id="postAuthor">{{ hotPlace.writerNickname }}</span>
                      <div>
                          <span class="mr-2">
                              <span class="viewText">조회수</span>
                              <span class="viewText mr-1">{{ hotPlace.viewCount }}</span>
                          </span>
                          <span class="mr-2">
                              <span class="viewText">좋아요</span>
                              <span class="viewText mr-1">{{ hotPlace.likeCount }}</span>
                          </span>
                          <span class="mr-2">
                              <span class="createdDateText">작성일</span>
                              <span class="createdDateText mr-1">{{ hotPlace.createdAt }}</span>
                          </span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 map-area border border-secondary">
            <div class="row-md-5 map" id="map"></div>
          </div>
          <div class="col-lg-6">
            <form>
              <div class="form-group">
                <label for="placeName">핫플 이름</label>
                <input type="text" class="form-control" id="placeName" name="placeName" :value="hotPlace.placeName" disabled>
              </div>
              <div class="form-group">
                <label for="date">방문 날짜</label>
                <input type="text" class="form-control" id="date" name="date" :value="hotPlace.visitedDate" disabled>
              </div>
              <div class="form-group">
                <label for="location">위치</label>
                <input type="text" class="form-control" id="location" name="location" :value="hotPlace.location" disabled>
              </div>
              <div class="row px-3 justify-content-center">
                <div class="col-sm-12 pt-3 post-content">
                  {{ hotPlace.content }}
                </div>  
              </div>
              <div class="row px-3">
                <div class="col-sm-2 mt-2">
                  <a class="btn btn-primary" @click="goHotPlaceList">목록</a>
                </div>
                <div class="col-sm-10 mt-2 text-right">
                  <a class="btn btn-warning">수정</a>
                  <a class="btn btn-danger">삭제</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import "@/assets/css/hotplace/hotplacedetail.css";

</style>
