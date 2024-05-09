<script setup>
import { ref, onMounted, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  detailHotPlace,
  deleteHotPlace,
  listHotPlaceComment,
  registHotPlaceComment,
} from "@/api/hotplace";
import { getMemberProfile } from "@/api/member";
import HotPlaceCommentItem from "./item/HotPlaceCommentItem.vue";

const route = useRoute();
const router = useRouter();

const hotPlaceId = ref(route.params.id);
const hotPlace = ref("");
const token = ref("");
const memberId = ref("");
const comments = ref([]);
const commentContent = ref("");

// 핫플레이스 게시글 조회
async function getHotPlace() {
  detailHotPlace(
    hotPlaceId.value,
    (response) => {
      hotPlace.value = response.data;
      getComments();
    },
    (error) => {
      console.log("HotPlace 게시글 불러오는 중 에러 발생!");
      console.dir(error);
    }
  );
}

// 사용자 정보 가져오기
const fetchProfile = async () => {
  token.value = localStorage.getItem("accessToken");
  if (token) {
    try {
      const response = await getMemberProfile(token.value);

      if (response.data) {
        memberId.value = response.data.id;
      }
    } catch (error) {
      console.error("프로필 정보 조회 실패:", error);
    }
  }
};

// 댓글 목록 조회하기
const getComments = () => {
  listHotPlaceComment(
    hotPlace.value.id,
    (response) => {
      comments.value = response.data;
    },
    (error) => {
      console.error("댓글 조회 실패!", error);
    }
  );
};

// 댓글 작성하기
const registComment = () => {
  const comment = ref({
    writerId: memberId.value,
    boardId: hotPlaceId.value,
    content: commentContent.value,
  });
  console.log(comment.value);
  registHotPlaceComment(
    comment.value,
    () => {
      getComments();
      commentContent.value = "";
    },
    (error) => {
      console.error("댓글 작성 실패!", error);
    }
  );
};

// 핫플레이스 목록으로 이동하는 함수
function goHotPlaceList() {
  router.push({ name: "hotPlaceList" });
}

// 핫플레이스 수정 화면으로 이동하는 함수
function goHotPlaceModify() {
  router.push({
    name: "hotPlaceModify",
    params: { id: hotPlace.value.id },
  });
}

// 핫플레이스 삭제하는 함수
function removeHotPlace() {
  deleteHotPlace(
    hotPlaceId.value,
    () => {
      router.replace({
        name: "hotPlaceList",
      });
    },
    (error) => {
      console.log("HotPlace 게시글 삭제하는 중 에러 발생!");
      console.dir(error);
    }
  );
}

// KAKAO MAP API 시작
const map = toRefs(null);

var marker;

// 맵 생성시 마커를 추가하는 함수
function addMarker() {
  let latitude = hotPlace.value.latitude;
  let longitude = hotPlace.value.longitude;
  let position = new kakao.maps.LatLng(latitude, longitude);

  marker = new kakao.maps.Marker({
    position: position,
    map: map.value,
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
  // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
  let mapTypeControl;
  mapTypeControl = new kakao.maps.MapTypeControl();
  // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
  // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
  map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
  let zoomControl = new kakao.maps.ZoomControl();
  map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

  // 마커를 추가합니다.
  addMarker();
};

onMounted(() => {
  /* global kakao */
  getHotPlace();
  fetchProfile();

  if (window.kakao && window.kakao.maps && hotPlace.value !== "") {
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
  <div class="container">
    <main>
      <h1 style="text-align: center; margin-bottom: 50px">HOTPLACE 소개하기</h1>
      <div class="container mt-5">
        <div class="row mt-5">
          <div class="post-info">
            <div class="row justify-content-center pt-5">
              <div class="col-sm-12 mb-5">
                <div class="card bg-light py-0">
                  <div class="card-header" id="titleHeader">
                    <span class="card-text">{{ hotPlace.title }}</span>
                  </div>
                  <div
                    class="card-body my-1 py-1 d-flex justify-content-between align-items-center"
                    id="postInfoCardBody"
                  >
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
                <input
                  type="text"
                  class="form-control"
                  id="placeName"
                  name="placeName"
                  :value="hotPlace.placeName"
                  disabled
                />
              </div>
              <div class="form-group">
                <label for="date">방문 날짜</label>
                <input
                  type="text"
                  class="form-control"
                  id="date"
                  name="date"
                  :value="hotPlace.visitedDate"
                  disabled
                />
              </div>
              <div class="form-group">
                <label for="location">위치</label>
                <input
                  type="text"
                  class="form-control"
                  id="location"
                  name="location"
                  :value="hotPlace.location"
                  disabled
                />
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
                  <a class="btn btn-warning" @click="goHotPlaceModify">수정</a>
                  <a class="btn btn-danger" @click="removeHotPlace">삭제</a>
                </div>
              </div>
            </form>
          </div>
        </div>
        <!--/* 댓글 작성 */-->
        <template v-if="memberId !== ''">
          <div class="row mt-5">
            <div class="cm_write">
              <div class="card mb-2">
                <div class="card-header bg-light">
                  <i class="bi bi-pencil-square"></i>
                  <span class="ml-2">댓글 쓰기</span>
                </div>
                <div class="card-body" id="writeCommentCardBody">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                      <fieldset>
                        <div class="cm_input">
                          <p>
                            <textarea
                              class="form-control"
                              id="commentContent"
                              name="commentContent"
                              v-model="commentContent"
                              rows="3"
                            ></textarea>
                          </p>
                          <div class="d-flex justify-content-end">
                            <button
                              type="button"
                              class="btn btn-dark"
                              id="registCommentBtn"
                              @click.prevent="registComment"
                            >
                              작성
                            </button>
                          </div>
                        </div>
                      </fieldset>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </template>
        <HotPlaceCommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :hot-place-id="hotPlaceId"
          @reload-comment-list="getComments"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
@import "@/assets/css/hotplace/hotplacedetail.css";
</style>
