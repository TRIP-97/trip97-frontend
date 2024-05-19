<script setup>
  import { ref, onMounted, toRefs} from "vue";
  import { useRoute, useRouter } from "vue-router";
  import {
    deletePlan,
    getPlanDetail,
    createDayPlanItem,
    deleteDayPlanItemById,
    updateDayPlanItemOrder,
  } from "@/api/plan";
  import PlanMemoModal from "./item/PlanMemoModal.vue"
  
  import draggable from "vuedraggable";

  const route = useRoute();
  const router = useRouter();

  const props = defineProps({
    selectedDayId: Number,
    addedPlaces: {
      type: Array,
      default: () => []
    }
  })
  const emit = defineEmits(['change-view']);

  const groupId = route.params.groupId;
  const planId = route.params.planId;
  const planInfo = ref({
    title: "",
    startDate: "",
    endDate: "",
    dayPlans: []
  });
  const selectedDayPlanId = ref(props.selectedDayId);
  const isModalActive = ref(false);
  const memoPlanId = ref(0);
  const memoPlanItemsLength = ref(0);
  const showDropdown = ref(false);

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

  // 계획 삭제 드롭다운 여부를 바꾸는 함수
  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
  };

  const removePlan = () => {
    const confirmation = window.confirm("정말 계획을 삭제하시겠어요?");
    if (confirmation) {
      deletePlan(
        {
          groupId: groupId,
          planId: planId,
        },
        () => {
          console.log("계획이 정상적으로 삭제되었습니다!");
          router.push({
            name: "myGroupDetail",
            params: {
              id: groupId,
            }
          })
        },
        (error) => {
          console.log("계획 삭제중 오류가 발생했습니다!");
          console.dir(error);
        }
      )
    }
  }

  // 장소 검색 화면으로 이동하는 함수
  const changeSearchView = (dayPlanId) => {
    emit('change-view', dayPlanId);
  }

  // 장소를 추가하는 함수
  const addPlace = () => {
    const places = props.addedPlaces;

    if (places) {
      places.forEach(place => {

        const dayPlan = planInfo.value.dayPlans.find(plan => plan.id === selectedDayPlanId.value);
        // dayPlan이 설정될 때까지 대기
        if (!dayPlan) {
          // dayPlan이 아직 설정되지 않은 경우 지연 실행
          const interval = setInterval(() => {
            if (dayPlan) {
              clearInterval(interval);
            }
          }, 100); // 100ms마다 확인
        }
        const newItem = {
          dayPlanId: selectedDayPlanId.value,
          type: "PLACE",
          title: place.title,
          content: "",
          contentTypeId: place.contentTypeId,
          latitude: place.latitude,
          longitude: place.longitude,
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
      });
      console.log("계획에 장소 추가 완료!");
    }
  };

  // 메모 추가 기능을 하는 함수
  const addMemo = (planId) => {
    memoPlanId.value = planId;
    const dayPlan = planInfo.value.dayPlans.find(plan => plan.id === memoPlanId.value);
    memoPlanItemsLength.value = dayPlan.items.length;
    isModalActive.value = true;
  };

  const saveMemo = (newMemo) => {
    createDayPlanItem(
        {
          groupId: groupId,
          planId: planId,
        },
        newMemo,
        () => {
          getPlanInfo();
        },
        (error) => {
          console.log("계획에 메모 추가중 에러 발생!");
          console.dir(error);
        }
      );
  };

  // 장소 및 메모 삭제 기능을 하는 함수
  const removeItem = (dayPlanId, itemId) => {
    const confirmation = window.confirm("정말 해당 계획을 삭제하시겠어요?");
    if (confirmation) {
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

  // 모임 상세 화면으로 이동하는 함수
  const goMyGroupDetail = () => {
    router.push({
      name: "myGroupDetail",
      params: { id: groupId },
    });
  }

  // 동적 이미지 경로를 얻는 함수
  const getImagePath = (contentTypeId) => {
    return new URL(`../../assets/images/planImages/planCategory${contentTypeId}.png`, import.meta.url).href;
  }

  defineExpose({
    addPlace
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
            <i @click="goMyGroupDetail" class="fa-solid fa-chevron-left"></i>
          </div>
          <div class="col-lg-8">
            <p>{{ planInfo.title }}</p>
          </div>
          <div class="col-lg-2 position-relative">
            <i class="fa-solid fa-ellipsis-vertical" @click="toggleDropdown"></i>
            <div class="dropdown" v-if="showDropdown">
              <button @click="removePlan">삭제</button>
            </div>
          </div>
        </div>

        <!-- 여행 일정 -->
        <div class="row justify-content-center plan-date">
          <div class="col-lg-12 plan-date-content">
            <i class="fa-regular fa-calendar-check"></i>
            <span class="date-span">{{ planInfo.startDate }}</span>
            <span class="dash">-</span>
            <span class="date-span">{{ planInfo.endDate }}</span>
          </div>
        </div>

        <!-- 일정 일차별 상세 계획 -->
        <div class="days">
          <div class="day" v-for="dayPlan in planInfo.dayPlans" :key="dayPlan.id">
            <div class="day-header">
              <p><i class="fa-regular fa-paper-plane"></i>Day {{ dayPlan.day }}</p>
            </div>

            <draggable v-model="dayPlan.items" @end="updateOrder(dayPlan.id)">
              <template #item="{ element }">
                <div v-if="element.type === 'PLACE'" class="item item-place justify-content-between">
                  <span>
                    <img v-if="element.contentTypeId !== 0" :src="getImagePath(element.contentTypeId)" class="item-title-image" alt="">
                    <span>{{ element.title }}</span>
                  </span>
                  <i class="fa-solid fa-trash item-delete-icon" @click="removeItem(dayPlan.id, element.id)"></i>
                </div>
                <div v-else class="item item-memo justify-content-between">
                  <span>
                    <i class="fa-solid fa-file-pen"></i>
                    <span>{{ element.content }}</span>
                  </span>
                  <i class="fa-solid fa-trash item-delete-icon" @click="removeItem(dayPlan.id, element.id)"></i>
                </div>
              </template>
            </draggable>
            <div class="actions justify-content-center">
              <button class="btn btn-outline-secondary add-place-btn" @click="changeSearchView(dayPlan.id)">
                장소 추가
              </button>
              <button class="btn btn-outline-secondary add-memo-btn" @click="addMemo(dayPlan.id)">
                메모 추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PlanMemoModal 
    :isActive="isModalActive" 
    :dayPlanId="memoPlanId"
    :dayPlanItemsLength="memoPlanItemsLength"
    @close="isModalActive = false" 
    :onSave="saveMemo" />
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
    margin-right: 30px;
  }

  .fa-chevron-left, .fa-house, .fa-ellipsis-vertical {
    cursor: pointer;
  }

  .position-relative {
    position: relative;
  }

  .dropdown {
    position: absolute;
    top: 60%;
    right: 40%;
    width: 50px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .dropdown button {
    background: none;
    border: none;
    padding: 10px 0px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    color: #333;
    margin-left: 9px;
  }

  .dropdown button:hover {
    background-color: #f5f5f5;
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

  .plan-date-content i,
  .plan-date-content span {
    margin: 0 10px;
  }

  .days {
    height: 520px;
    overflow-y: auto;
    margin-top: 20px;
    border-radius: 10px;
    margin-top: 15px;
    padding: 5px;
  }

  .day {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }

  .day-header {
    justify-content: space-between;
    align-items: center;
    margin: 5px 0px 10px 10px;
    font-size: 15px;
    color: white;
    background-color: rgb(199, 162, 231);
    width: fit-content;
    padding: 3px 7px 0px 7px;
    border-radius: 13px;
  }

  .fa-paper-plane {
    margin-right: 5px;
  }

  .actions {
    display: flex;
    justify-content: space-between;
  }

  .actions button {
    margin: 10px 10px;
    font-size: 14px;
    font-family: NanumSquareRound;
    background-color: rgb(242, 242, 242);
    border: 0px;
    border-radius: 20px;
    padding: 10px;
  }

  .item-place {
    border: 1px solid rgb(185, 185, 185);
    border-radius: 10px;
    padding: 7px 10px;
    margin: 10px 0px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-memo {
    background-color: #f1f1f1;
    border: 0px;
    border-radius: 10px;
    padding: 15px 10px;
    margin: 10px 0px;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fa-file-pen {
    margin-right: 10px;
    color: rgb(111, 111, 111);
  }

  .item-title-image {
    width: 20px;
    margin-right: 10px;
  }

  .item .item-delete-icon {
    margin-right: 10px;
    cursor: pointer;
    display: none;
    color: rgb(232, 117, 117);
  }

  .item:hover .item-delete-icon {
    display: block;
  }

  .days::-webkit-scrollbar,
  .days::-webkit-scrollbar {
    width: 10px; 
  }

  .days::-webkit-scrollbar-track,
  .days::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  .days::-webkit-scrollbar-thumb,
  .days::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px; 
  }

  .days::-webkit-scrollbar-thumb:hover,
  .days::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
