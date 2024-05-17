<script setup>
  import { ref, onMounted, toRefs } from "vue";
  import { useRoute } from "vue-router";
  import {
    getPlanDetail,
    createDayPlanItem,
    deleteDayPlanItemById,
    updateDayPlanItemOrder,
  } from "@/api/plan";
  import draggable from "vuedraggable";

  const route = useRoute();

  const groupId = route.params.groupId;
  const planId = route.params.planId;
  const planInfo = ref({
  title: "",
  startDate: "",
  endDate: "",
  dayPlans: []
});

  // 여행 계획 상세 정보를 가져오는 함수
  const getPlanInfo = () => {
    getPlanDetail(
      {
        groupId: groupId,
        planId: planId,
      },
      ({ data }) => {
        planInfo.value = data;
        console.log("planInfo: ", planInfo.value);

        planInfo.value.startDate = formatDate(planInfo.value.startDate);
        planInfo.value.endDate = formatDate(planInfo.value.endDate);
      },
      (error) => {
        console.log("여행 계획 정보 불러오는 중 에러 발생!");
        console.dir(error);
      }
    );
  };

  // 날짜 포맷 변경 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month.toString().padStart(2, "0")}월 ${day.toString().padStart(2, "0")}일`;
  }

  // 장소 추가 기능을 하는 함수
  const addPlace = (dayPlanId) => {
    const dayPlan = planInfo.value.dayPlans.find((d) => d.id === dayPlanId);
    if (dayPlan) {
      const newItem = {
        dayPlanId,
        type: "PLACE",
        title: "새로운 장소",
        content: "",
        attractionId: null,
        latitude: null,
        longitude: null,
        order: dayPlan.items.length + 1,
      };

      createDayPlanItem(
        {
          groupId: groupId,
          planId: planId,
        },
        newItem,
        () => {
          getPlanInfo();
        },
        (error) => {
          console.log("계획에 장소 추가중 에러 발생!");
          console.dir(error);
        }
      );
    }
  };

  // 메모 추가 기능을 하는 함수
  const addMemo = (dayPlanId) => {
    const dayPlan = planInfo.value.dayPlans.find((d) => d.id === dayPlanId);
    if (dayPlan) {
      const newItem = {
        dayPlanId,
        type: "MEMO",
        title: "",
        content: "새로운 내용",
        attractionId: null,
        latitude: null,
        longitude: null,
        order: dayPlan.items.length + 1,
      };

      createDayPlanItem(
        {
          groupId: groupId,
          planId: planId,
        },
        newItem,
        () => {
          getPlanInfo();
        },
        (error) => {
          console.log("계획에 메모 추가중 에러 발생!");
          console.dir(error);
        }
      );
    }
  };

  // 장소 및 메모 삭제 기능을 하는 함수
  const removeItem = (dayPlanId, itemId) => {
    const dayPlan = planInfo.value.dayPlans.find((d) => d.id === dayPlanId);
    if (dayPlan) {
      deleteDayPlanItemById(
        {
          groupId: groupId,
          planId: planId,
          itemId: itemId,
        },
        () => {
          getPlanInfo();
        },
        (error) => {
          console.log("계획에서 장소, 메모 삭제중 에러 발생!");
          console.dir(error);
        }
      );
    }
  };

  // 장소 및 메모 순서를 바꾸는 함수
  const updateOrder = (dayPlanId) => {
    const dayPlan = planInfo.value.dayPlans.find((d) => d.id === dayPlanId);
    if (dayPlan) {
      dayPlan.items.forEach((item, index) => {
        const newOrder = index + 1;
        if (item.order !== newOrder) {
          item.order = newOrder;
          updateDayPlanItemOrder(
            {
              groupId: groupId,
              planId: planId,
              itemId: item.id,
              order: item.order,
            },
            () => {
              console.log("순서가 성공적으로 업데이트되었습니다.");
            },
            (error) => {
              console.log("순서 업데이트 중 에러 발생!");
              console.dir(error);
            }
          );
        }
      });
    }
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

    // map 객체가 초기화된 이후에 이벤트 리스너를 추가
    kakao.maps.event.addListener(map.value, "click", function (mouseEvent) {
      var latlng = mouseEvent.latLng;
      // latitude.value = latlng.getLat();
      // longitude.value = latlng.getLng();

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
          <div class="col-lg-8">
            <p>{{ planInfo.title }}</p>
          </div>
          <div class="col-lg-2">
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

        <!-- 일정 일차별 상세 계획 -->
        <div class="days">
          <div class="day" v-for="dayPlan in planInfo.dayPlans" :key="dayPlan.id">
            <div class="day-header">
              <h3>Day {{ dayPlan.day }}</h3>
            </div>

            <draggable v-model="dayPlan.items" @end="updateOrder(dayPlan.id)">
              <template #item="{ element }">
                <div class="item">
                  <span>{{ element.title }} ({{ element.type }})</span>
                  <button @click="removeItem(dayPlan.id, element.id)">삭제</button>
                </div>
              </template>
            </draggable>
            <div class="actions">
              <button class="btn btn-outline-secondary" @click="addPlace(dayPlan.id)">
                장소 추가
              </button>
              <button class="btn btn-outline-secondary" @click="addMemo(dayPlan.id)">
                메모 추가
              </button>
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
    margin-left: 5px;
    margin-right: 5px;
  }

  .fa-angle-down {
    color: gray;
  }

  .plan-date-content i,
  .plan-date-content span {
    margin: 0 10px;
  }

  .day {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }

  .day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .actions {
    display: flex;
    justify-content: space-between;
  }

  .actions button {
    margin-right: 5px;
  }

  .item {
    background-color: #ddd;
    margin: 5px 0px;
  }
</style>
