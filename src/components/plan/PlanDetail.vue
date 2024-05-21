<script setup>
  import { ref, onMounted, toRefs } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import {
    deletePlan,
    getPlanDetail,
    createDayPlanItem,
    deleteDayPlanItemById,
    updateDayPlanItemOrder,
    getRecommendPlanRoute,
    getPublicPlanRoute,
    getPublicRouteGraphicData,
    getWalkPlanRoute,
  } from "@/api/plan";
  import PlanMemoModal from "./item/PlanMemoModal.vue";

  import draggable from "vuedraggable";

  const route = useRoute();
  const router = useRouter();

  const props = defineProps({
    selectedDayId: Number,
    addedPlaces: {
      type: Array,
      default: () => [],
    },
  });
  const emit = defineEmits(["change-view"]);

  const groupId = route.params.groupId;
  const planId = route.params.planId;
  const planInfo = ref({
    title: "",
    startDate: "",
    endDate: "",
    dayPlans: [],
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
            },
          });
        },
        (error) => {
          console.log("계획 삭제중 오류가 발생했습니다!");
          console.dir(error);
        }
      );
    }
  };

  // 장소 검색 화면으로 이동하는 함수
  const changeSearchView = (dayPlanId) => {
    emit("change-view", dayPlanId);
  };

  // 장소를 추가하는 함수
  const addPlace = () => {
    const places = props.addedPlaces;

    if (places) {
      places.forEach((place) => {
        const dayPlan = planInfo.value.dayPlans.find((plan) => plan.id === selectedDayPlanId.value);
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
    const dayPlan = planInfo.value.dayPlans.find((plan) => plan.id === memoPlanId.value);
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
            clearMap(); // 기존 마커와 폴리라인 삭제
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
              clearMap(); // 기존 마커와 폴리라인 삭제
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
  };

  // 동적 이미지 경로를 얻는 함수
  const getImagePath = (contentTypeId) => {
    return new URL(
      `../../assets/images/planImages/planCategory${contentTypeId}.png`,
      import.meta.url
    ).href;
  };

  defineExpose({
    addPlace,
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
  };

  // 마커와 폴리라인을 저장할 배열
  const markers = ref([]);
  const polylines = ref([]);

  // 마커와 폴리라인을 제거하는 함수
  const clearMap = () => {
    markers.value.forEach((marker) => marker.setMap(null));
    markers.value = [];

    polylines.value.forEach((polyline) => polyline.setMap(null));
    polylines.value = [];
  };

  // 마커를 생성하고 지도 위에 숫자 마커를 표시하는 함수
  function addNumberMarker(mapInstance, position, idx, title) {
    var imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png",
      imageSize = new kakao.maps.Size(36, 37),
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
        offset: new kakao.maps.Point(13, 37),
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new kakao.maps.Marker({
        position: position,
        image: markerImage,
      });

    marker.setMap(mapInstance);
    markers.value.push(marker);
    return marker;
  }

  // Haversine 공식을 사용하여 두 좌표 간의 거리를 계산하는 함수
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  // 카카오 모빌리티 API에서 추천 경로를 받아오는 함수
  const createPlanRoute = (dayPlanId, priority) => {
    clearMap(); // 기존 마커와 폴리라인 삭제

    const dayPlan = planInfo.value.dayPlans.find((d) => d.id === dayPlanId);

    if (!dayPlan) {
      console.error("Day plan이 없습니다!");
      return;
    }
    let items = dayPlan.items.filter((item) => item.type === "PLACE");
    console.log(items);

    if (items.length < 2) {
      window.alert("경로를 만들기 전에 장소를 적어도 2개 추가해주세요!");
      console.error("경로를 만들기에 장소 개수가 부족합니다!");
      return;
    }

    if (items.length > 10) {
      window.alert("방문할 장소가 하루에 너무 많아요!");
      return;
    }

    // priority가 DISTANCE일 경우, 가까운 지점부터 방문하도록 순서 변경
    if (priority === "DISTANCE") {
      const startPoint = items[0];
      const distances = items.slice(1).map((item) => ({
        item: item,
        distance: calculateDistance(
          startPoint.latitude,
          startPoint.longitude,
          item.latitude,
          item.longitude
        ),
      }));

      distances.sort((a, b) => a.distance - b.distance);
      items = [startPoint, ...distances.map((d) => d.item)];
    }

    const places = {
      origin: {
        x: items[0].longitude,
        y: items[0].latitude,
      },
      destination: {
        x: items[items.length - 1].longitude,
        y: items[items.length - 1].latitude,
      },
      waypoints: items.slice(1, -1).map((item, index) => ({
        name: `waypoint${index + 1}`,
        x: item.longitude,
        y: item.latitude,
      })),
    };

    getRecommendPlanRoute(
      places,
      (response) => {
        console.log("Recommended route:", response.data);

        const { result_code, summary, sections } = response.data.routes[0];

        if (sections.length > 0) {
          sections.forEach((section, index) => {
            const { distance, duration, guides: arrays, roads } = section;

            const detailRoads = [];

            for (let i = 0; i < roads.length; i++) {
              const arg = roads[i];
              const mini = arg.vertexes;
              let cursor = 0;
              while (cursor < mini.length) {
                const obj = new kakao.maps.LatLng(mini[cursor + 1], mini[cursor]);
                detailRoads.push(obj);
                cursor += 2;
              }
            }

            const guidePositions = arrays.map((arg) => {
              const { x, y } = arg;
              if (x && y) {
                arg.position = new kakao.maps.LatLng(y, x);
              }
              return arg;
            });

            const mapInstance = map.value;

            if (guidePositions.length > 0) {
              const { title, position } = guidePositions[0];
              addNumberMarker(mapInstance, position, index, title);
            }

            if (index === sections.length - 1 && guidePositions.length > 1) {
              const { title: titleFirst, position: positionFirst } = guidePositions[0];
              const { title: titleLast, position: positionLast } =
                guidePositions[guidePositions.length - 1];

              addNumberMarker(mapInstance, positionFirst, index, titleFirst);
              addNumberMarker(mapInstance, positionLast, index + 1, titleLast);
            }

            const polyline = new kakao.maps.Polyline({
              path: detailRoads,
              strokeWeight: 5,
              strokeColor: "#8181F7",
              strokeOpacity: 0.8,
              strokeStyle: "solid",
            });

            polyline.setMap(mapInstance);
            polylines.value.push(polyline);
          });
        }

        centerMap(items[0].latitude, items[0].longitude);
      },
      (error) => {
        console.error("Failed to fetch route:", error);
      }
    );
  };


  const sxArr = ref([]), syArr = ref([]);
  const exArr = ref([]), eyArr = ref([]);
  const startArrIdx = ref(0), endArrIdx = ref(0);

  // 오디세이 API, 티맵 API를 활용해서 대중교통 경로를 생성하는 함수
  const createPlanPublicRoute = (dayPlanId) => {
    clearMap(); // 기존 마커와 폴리라인 삭제

    const dayPlan = planInfo.value.dayPlans.find((d) => d.id === dayPlanId);

    if (!dayPlan) {
      console.error("Day plan이 없습니다!");
      return;
    }
    let items = dayPlan.items.filter((item) => item.type === "PLACE");
    console.log(items);

    if (items.length < 2) {
      window.alert("경로를 만들기 전에 장소를 적어도 2개 추가해주세요!");
      console.error("경로를 만들기에 장소 개수가 부족합니다!");
      return;
    }

    if (items.length > 10) {
      window.alert("방문할 장소가 하루에 너무 많아요!");
      return;
    }

    for (let i = 0; i < items.length - 1; i++) {
      searchPubTransRoute(items[i].longitude, items[i].latitude, items[i + 1].longitude, items[i + 1].latitude);
    }

    for (let i = 0; i < items.length; i++) {
      addNumberMarker(map.value, new kakao.maps.LatLng(items[i].latitude, items[i].longitude), i, "");
    }

    centerMap(items[0].latitude, items[0].longitude);
  }

  // 대중교통 길찾기 지도에 표시하는 함수
  const searchPubTransRoute = (sx, sy, ex, ey) => {

    getPublicPlanRoute(
      {
        sx: sx,
        sy: sy,
        ex: ex,
        ey: ey,
      },
      ({ data }) => {
        console.log("대중교통 길찾기 API 호출 성공!");
        console.log(data);
        callPublicRouteGraphicData(data.result.path[0].info.mapObj);
        searchSubRoutes(data, sx, sy, ex, ey);
      },
      (error) => {
        console.log("대중교통 길찾기 API 호출 중 에러 발생!");
        console.dir(error);
      }
    )

    
  }

  // 노선 그래픽 데이터를 호출하는 함수
  const callPublicRouteGraphicData = (mabObj) => {
    getPublicRouteGraphicData(
        mabObj,
      ({ data }) => {
        console.log("노선 그래픽 데이터 호출 성공!");

        //즉시 실행 함수로 closure 발생 방지
        (function () {
            //도보 경로 표시와 시간 맞추기
            setTimeout(function () {
                drawPublicKakaoPolyLine(data);
            }, 1000);
        }());
      },
      (error) => {
        console.log("노선 그래픽 데이터 호출중 에러 발생!");
        console.dir(error);
      }
    )
  }

  // 노선그래픽 데이터를 이용하여 지도위 폴리라인 그려주는 함수
  const drawPublicKakaoPolyLine = (data) => {
    const mapInstance = map.value;
    let lineArray;

    for (let i = 0 ; i < data.result.lane.length; i++) {
      for (let j = 0 ; j < data.result.lane[i].section.length; j++) {
        lineArray = null;
        lineArray = new Array();
        for (let k = 0; k < data.result.lane[i].section[j].graphPos.length; k++ ){
            lineArray.push(new kakao.maps.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
        }

        let polyline;
        //지하철결과, 버스결과의 경우 노선에 따른 라인색상 지정하는 부분 (1~9호선 색상 추가)
        if (data.result.lane[i].type === 1) {
            polyline = new kakao.maps.Polyline({
                map: mapInstance,
                path: lineArray,
                strokeWeight : 5,
                strokeOpacity : 0.8,
                strokeColor: '#0D347F',
                strokeStyle: "solid",
            });
        } else if (data.result.lane[i].type === 2) {
            polyline = new kakao.maps.Polyline({
                map: mapInstance,
                path: lineArray,
                strokeWeight : 5,
                strokeOpacity : 0.8,
                strokeColor: '#3B9F37',
                strokeStyle: "solid",
            });
        } else if (data.result.lane[i].type === 3) {
            polyline = new kakao.maps.Polyline({
                map: mapInstance,
                path: lineArray,
                strokeWeight : 5,
                strokeOpacity : 0.8,
                strokeColor: '#fc4c02',
                strokeStyle: "solid",
            });
        } else if (data.result.lane[i].type == 4) {
            polyline = new kakao.maps.Polyline({
                map: mapInstance,
                path: lineArray,
                strokeWeight : 5,
                strokeOpacity : 0.8,
                strokeColor: '#3165A8',
                strokeStyle: "solid",
            });
        } else if (data.result.lane[i].type == 5) {
            polyline = new kakao.maps.Polyline({
                map: mapInstance,
                path: lineArray,
                strokeWeight : 5,
                strokeOpacity : 0.8,
                strokeColor: '#a05eb5',
                strokeStyle: "solid",
            });
        } else if (data.result.lane[i].type == 6) {
            polyline = new kakao.maps.Polyline({
                map: mapInstance,
                path: lineArray,
                strokeWeight : 5,
                strokeOpacity : 0.8,
                strokeColor: '#904D23',
                strokeStyle: "solid",
            });
        } else if (data.result.lane[i].type == 7) {
            polyline = new kakao.maps.Polyline({
                map: mapInstance,
                path: lineArray,
                strokeWeight : 5,
                strokeOpacity : 0.8,
                strokeColor: '#5B692E',
                strokeStyle: "solid",
            });
        } else if (data.result.lane[i].type == 8) {
            polyline = new kakao.maps.Polyline({
                map: mapInstance,
                path: lineArray,
                strokeWeight : 5,
                strokeOpacity : 0.8,
                strokeColor: '#e31c79',
                strokeStyle: "solid",
            });
        } else if (data.result.lane[i].type == 9) {
            polyline = new kakao.maps.Polyline({
                map: mapInstance,
                path: lineArray,
                strokeWeight : 5,
                strokeOpacity : 0.8,
                strokeColor: '#B39627',
                strokeStyle: "solid",
            });
        } else { // 버스의 경우
            polyline = new kakao.maps.Polyline({
                map: mapInstance,
                path: lineArray,
                strokeWeight : 5,
                strokeOpacity : 0.8,
                strokeColor: '#3673dd',
                strokeStyle: "solid",
            });
        }

        polyline.setMap(mapInstance);
        polylines.value.push(polyline);
      }
    }
  }

  // 대중교통 길찾기 경로내의 도보 경로를 구하는 함수
  const searchSubRoutes = (resultObj, sx, sy, ex, ey) => {
    clearSEArray();

    insertSEArray(sx, sy, 0);
    for (let i = 0; i < resultObj.result.path[0].subPath.length; i++) {
      let trafficType = resultObj.result.path[0].subPath[i].trafficType;
      if (trafficType === 1 || trafficType === 2) {
          insertSEArray(resultObj.result.path[0].subPath[i].startX, resultObj.result.path[0].subPath[i].startY, 1);
          insertSEArray(resultObj.result.path[0].subPath[i].endX, resultObj.result.path[0].subPath[i].endY, 0);
      }
    }
    insertSEArray(ex, ey, 1);

    //약간의 좌표 오차 어떻게 처리할 지 생각하기
    for(var i = 0; i < startArrIdx.value; i++) {
      if(i > 1) {
        searchWalkRoute(sxArr.value[i], syArr.value[i], exArr.value[i], eyArr.value[i], 2);
      } else {
        searchWalkRoute(sxArr.value[i], syArr.value[i], exArr.value[i], eyArr.value[i], 1);
      }
    }
  }

  // 보행자 길찾기 경로 탐색 함수
  function searchWalkRoute(sx, sy, ex, ey, option) {
    let drawInfoArr = [];
    console.log(sx, " ", sy, " ", ex, " ", ey);

    getWalkPlanRoute(
      {
        "startX" : sx,
        "startY" : sy,
        "endX" : ex,
        "endY" : ey,
        "reqCoordType" : "WGS84GEO",
        "resCoordType" : "EPSG3857",
        "startName" : "출발지",
        "endName" : "도착지"
      },
      ({ data }) => {
        console.log("보도 경로 불러오기 성공!");
        console.log(data);
        let resultData = data.features;

        for (let i in resultData) {
          var geometry = resultData[i].geometry;

          if (geometry.type == "LineString") {
            for ( var j in geometry.coordinates) {
              // 경로들의 결과값(구간)들을 포인트 객체로 변환
              var latlng = new kakao.maps.Point(
                  geometry.coordinates[j][0],
                  geometry.coordinates[j][1]);
              // 포인트 객체를 받아 좌표값으로 변환
              var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
              // 포인트객체의 정보로 좌표값 변환 객체로 저장
              var convertChange = new kakao.maps.LatLng(convertPoint._lat, convertPoint._lng);
              // 배열에 담기
              drawInfoArr.push(convertChange);
            }
          }
        }

        drawWalkLine(drawInfoArr);
      },
      (error) => {
        console.log("보도 경로 불러오는 중 에러 발생!");
        console.log(error);
      }
    )
  }

  // 도보 경로를 그리는 함수
  function drawWalkLine(arrPoint) {
    let polyline;

    polyline = new kakao.maps.Polyline({
        path : arrPoint,
        strokeColor : "#585858",
        strokeWeight : 5,
        strokeOpacity : 0.8,
        map: map.value
    });

    polyline.setMap(map.value);
    polylines.value.push(polyline);
  }

  // 도보 출발, 도착지점 배열에 삽입하는 함수
  function insertSEArray(x, y, select) {
      if(select == 0) {
          sxArr.value[startArrIdx.value] = x;
          syArr.value[startArrIdx.value] = y;
          startArrIdx.value++;
      } else if(select == 1) {
          exArr.value[endArrIdx.value] = x;
          eyArr.value[endArrIdx.value] = y;
          endArrIdx.value++;
      } else {
          console.log('insertSEArray Error');
      }
  }

  // 도보 출발, 도착지점 배열을 초기화하는 함수
  function clearSEArray() {
      sxArr.value = [];
      syArr.value = [];
      exArr.value = [];
      eyArr.value = [];
      startArrIdx.value = 0;
      endArrIdx.value = 0;
  }

  // 지도 중심을 변경하는 함수
  const centerMap = (latitude, longitude) => {
    const mapInstance = map.value;
    const moveLatLon = new kakao.maps.LatLng(latitude, longitude);
    // eslint-disable-next-line vue/no-ref-as-operand
    mapInstance.setCenter(moveLatLon);
  };
  // KAKAO MAP API 끝

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
            <div class="day-container">
              <div class="day-header">
                <p><i class="fa-regular fa-paper-plane"></i>Day {{ dayPlan.day }}</p>
              </div>
              <div class="route-make-buttons">
                <div class="route-make-button" @click="createPlanRoute(dayPlan.id, 'RECOMMEND')">
                  <p><i class="fa-solid fa-route"></i>경로 만들기</p>
                </div>
                <div class="route-optimize-button" @click="createPlanRoute(dayPlan.id, 'DISTANCE')">
                  <p><i class="fa-solid fa-wand-magic-sparkles"></i>경로 최적화</p>
                </div>
                <div class="route-public-button" @click="createPlanPublicRoute(dayPlan.id)">
                  <p><i class="fa-solid fa-train-subway"></i>대중교통 경로</p>
                </div>
              </div>
            </div>
            <draggable v-model="dayPlan.items" @end="updateOrder(dayPlan.id)">
              <template #item="{ element }">
                <div
                  v-if="element.type === 'PLACE'"
                  class="item item-place justify-content-between"
                >
                  <span
                    @mouseover="centerMap(element.latitude, element.longitude)"
                    class="item-info"
                  >
                    <img
                      v-if="element.contentTypeId !== 0"
                      :src="getImagePath(element.contentTypeId)"
                      class="item-title-image"
                      alt=""
                    />
                    <span>{{ element.title }}</span>
                  </span>
                  <i
                    class="fa-solid fa-trash item-delete-icon"
                    @click="removeItem(dayPlan.id, element.id)"
                  ></i>
                </div>
                <div v-else class="item item-memo justify-content-between">
                  <span>
                    <i class="fa-solid fa-file-pen"></i>
                    <span>{{ element.content }}</span>
                  </span>
                  <i
                    class="fa-solid fa-trash item-delete-icon"
                    @click="removeItem(dayPlan.id, element.id)"
                  ></i>
                </div>
              </template>
            </draggable>
            <div class="actions justify-content-center">
              <button
                class="btn btn-outline-secondary add-place-btn"
                @click="changeSearchView(dayPlan.id)"
              >
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
      :onSave="saveMemo"
    />
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

  .fa-chevron-left,
  .fa-house,
  .fa-ellipsis-vertical {
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
    color: #8280dd;
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

  .day-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .day-header {
    margin: 5px 0px 10px 3px;
    font-size: 15px;
    color: white;
    background-color: rgb(199, 162, 231);
    width: fit-content;
    height: 30px;
    padding: 4px 7px 0px 7px;
    border-radius: 13px;
  }

  .fa-paper-plane,
  .fa-route,
  .fa-wand-magic-sparkles,
  .fa-train-subway {
    margin-right: 5px;
  }

  .route-make-buttons {
    display: flex;
  }

  .route-make-button {
    margin: 5px 10px 10px 0px;
    font-size: 15px;
    color: white;
    background-color: #8280dd;
    width: fit-content;
    height: 30px;
    padding: 4px 7px 0px 7px;
    border-radius: 13px;
    cursor: pointer;
  }

  .route-optimize-button {
    margin: 5px 10px 10px 0px;
    font-size: 15px;
    color: white;
    background-color: #7688ee;
    width: fit-content;
    height: 30px;
    padding: 4px 7px 0px 7px;
    border-radius: 13px;
    cursor: pointer;
  }

  .route-public-button {
    margin: 5px 10px 10px 0px;
    font-size: 15px;
    color: white;
    background-color: #8aa3ee;
    width: fit-content;
    height: 30px;
    padding: 4px 7px 0px 7px;
    border-radius: 13px;
    cursor: pointer;
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

  .item-info {
    cursor: default;
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
