<script setup>
  import { ref, onMounted, toRefs } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { getPlanDetail } from "@/api/plan";

  const route = useRoute();
  const router = useRouter();

  const groupId = route.params.groupId;
  const planId = route.params.planId;
  const planInfo = ref("");

  // 여행 계획 상세 정보를 가져오는 함수
  const getPlanInfo = () => {
    getPlanDetail(
      {
        groupId: groupId,
        planId: planId,
      },
      ({ data }) => {
        planInfo.value = data;

        planInfo.value.startDate = formatDate(planInfo.value.startDate);
        planInfo.value.endDate = formatDate(planInfo.value.endDate);
      },
      (error) => {
        console.log("여행 계획 정보 불러오는 중 에러 발생!");
        console.dir(error);
      }
    )
  }

  // 날짜 포맷 변경 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month.toString().padStart(2, "0")}월 ${day.toString().padStart(2, "0")}일`;
  }

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
    getPlanInfo();

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
          <div class="col-lg-2">
            <i class="fa-solid fa-chevron-left"></i>
            <i class="fa-solid fa-house"></i>
          </div>
          <div class="col-lg-8 ">
            <p>{{ planInfo.title }}</p>
          </div>
          <div class="col-lg-2 ">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </div>
        </div>

        <!-- 여행 일정 -->
        <div class="row justify-content-center plan-date">
          <div class="col-lg-12 plan-date-content">
            <i class="fa-regular fa-calendar-check"></i>
            <span class="date-span">{{ planInfo.startDate }}</span>
            <span class="dash">-</span>
            <span class="date-span">{{ planInfo.endDate }}</span>
            <i class="fa-solid fa-angle-down"></i>
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
  height: 800px;
  margin-top: 15px;
  margin-bottom: 15px;
  border: 1px solid rgb(183, 183, 183);
  border-radius: 10px;
}

.fa-chevron-left {
  margin-right: 30px;
}

.plan-date {
  height: 80px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  background-color: rgb(244, 244, 244);
  border-radius: 20px;
}

.plan-date-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-family: NanumSquareRound;
  font-size: 14px;
}

.fa-calendar-check {
  color: rgb(90, 155, 205);
}

.plan-date-content .dash {
  margin-left: 5px; /* 날짜와 - 기호 사이의 간격을 늘림 */
  margin-right: 5px; /* - 기호와 날짜 사이의 간격을 늘림 */
}

.fa-angle-down {
  color: gray;
}

.plan-date-content i,
.plan-date-content span {
  margin: 0 10px; 
}

</style>