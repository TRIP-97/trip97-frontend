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
const isWriter = ref(false);


// 게시글 작성자인지 확인하는 함수
const checkIsWriter = () => {
  if (hotPlace.value.writerId === memberId.value) {
    isWriter.value = true;
  }
}

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
  if (token.value) {
    try {
      const response = await getMemberProfile(token.value);

      if (response.data) {
        memberId.value = response.data.id;
        checkIsWriter();
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
    level: 7,
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
    <div class="row justify-content-center">
      <div class="col-sm-11">
        
        <div class="img-area my-3">
          <img class="main-image" src="@/assets/images/fubao.jpg" alt="">
        </div>
        
        <div class="row">
          <div class="col-lg-8 mt-4">
            <h3 class="title">{{ hotPlace.title }}</h3>
            <div class="d-flex justify-content-between mt-3 my-2 info-text">
              <div>
                <span class="stat-text">조회수 {{ hotPlace.viewCount }}</span>
                <div class="custom-vr mx-3"></div>
                <span class="stat-text ml-2">좋아요 {{ hotPlace.likeCount }}</span>
              </div>
              <span class="date-text">작성일: {{ hotPlace.createdAt }}</span>
            </div>
            <div class="d-flex justify-content-end mt-3 my-2" v-if="isWriter">
              <div class="edit-actions">
                <span class="action-text " @click="goHotPlaceModify">수정</span>
                <div class="custom-vr mx-2"></div>
                <span class="action-text" @click="removeHotPlace">삭제</span>
              </div>
            </div>

           <p class="schedule-label mt-5 mb-2">여행 일정</p>
           <div class="schedule-box my-3">
              <strong> <i class="travel-date-icon fa-solid fa-calendar"></i></strong>
               {{ hotPlace.startDate }} - {{ hotPlace.endDate }}
              <br>
              <br>
              <strong><i class="fa-solid fa-location-dot"></i></strong> {{ hotPlace.location }}
            </div>
            <div class="my-2">
              <p class="content-label mt-5 mb-4">여행 소개</p>
              <strong class="content">{{ hotPlace.content }}</strong>
            </div>
            <div class="list-button-section mt-5">
              <button class="btn btn-primary list-btn" @click="goHotPlaceList">목록으로</button>
              <hr class="mt-3"> 
            </div>

            <template v-if="memberId !== ''">
              <div class="comment-section">
                <p class="comment-label mb-3">댓글</p>
                <div class="input-group mb-3">
                  <input type="text" 
                  v-model="commentContent" 
                  class="form-control" 
                  id="commentContent"
                  placeholder="댓글을 입력하세요...">
                  <div class="input-group-append">
                    <button class="btn btn-outline-primary text-primary comment-write-btn" 
                    @click="registComment">작성</button>
                  </div>
                </div>
              </div>
            </template>

            <HotPlaceCommentItem
              v-for="comment in comments"
              :key="comment.id"
              :comment-item="comment"
              :member-id="memberId"
              :hot-place-id="hotPlaceId"
              @reload-comment-list="getComments"
            />
          </div>
          <!-- Sidebar for Author Information -->
          <div class="col-lg-3 offset-lg-1">
            <h5 class="traveler-info-label mt-5 mb-2">여행자</h5>
            <div class="author-info-box my-3">
              <div class="d-flex align-items-center mb-1">
                <img v-if="hotPlace.writerProfileImage === null" src="@/assets/images/profile.png" alt="Author" class="img-fluid rounded-circle mr-3" style="width: 40px; height: 40px;">
                <p class="writer-nickname">{{ hotPlace.writerNickname }}</p>
              </div>
              <p v-if="hotPlace.writerIntroduction === null" class="writer-introduction">{{ "자기소개를 아직 작성하지 않았어요." }}</p>
            </div>
            <h5 class="location-info-label mt-5 mb-2">여행 장소</h5>
            <div class="location-info-box my-3">
              <div >
                <p class="visited-places">{{ hotPlace.placeName}}</p>
                <hr> <!-- Horizontal line with margin -->
                <p class="city-name">{{ hotPlace.location }}</p>
              </div>
              <div id="map" class="border border-white rounded" style="height: 250px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/hotplace/hotplacedetail.css";

.container {
  max-width: 1200px; /* Adjust the max width of the container */
}

.img-area {
  height: 300px;
  overflow: hidden;
  background-color: antiquewhite;
  border-radius: 20px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the image covers the area */
}

.title, .schedule-label, .content-label, .comment-label {
  font-family: NanumSquareRoundExtraBold;
}

.schedule-label, .content-label, .comment-label {
  font-size: 20px;
}

.content {
  color: #3e4143;
}

.info-text {
  font-size: 0.9rem; /* Smaller font size for stats and date */
  color: #6c757d; /* Grey color */
}

.custom-vr {
  display: inline;
  border-left: 1px solid lightgray;
  align-self: center;
}

.stat-text {
  margin-right: 5px; /* Space between statistics */
}

.date-text {
  text-align: right; /* Right align for the date */
}

.edit-actions {
  color: #6c757d; /* Grey color for actions */
  font-size: 0.8rem; /* Smaller font size for edit/delete actions */
}

.action-text {
  cursor: pointer;
}

.schedule-box {
  color: gray;
  background-color: #f8f9fa; /* Light grey background */
  padding: 10px;
  border-radius: 10px; /* Rounded corners for the box */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
}

.list-button-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Aligns the button and line to the right */
}

.list-button-section .btn-primary {
  background-color: #689beb; /* Sky blue color */
  border-color: #689beb; /* Border color to match the background */
  color: white; /* White text color */
}

hr {
  width: 100%; /* Full width line */
  border: 0;
  height: 1px;
  background-color: #575555; /* Light grey line */
  margin-top: 5px; /* Space above the line */
}

.input-group .form-control {
  border-right: 0; /* Remove the right border */
  font-size: 13px;
}

.input-group .input-group-append .btn {
  background-color: transparent; /* Transparent background */
  color: #00BFFF; /* Sky blue color for the text */
  border: 0; /* Remove the left border */
}

.input-group {
  border: 1px solid #ccc; /* Border around the input group */
  border-radius: 5px; /* Rounded corners for the input group */
}

.comment-write-btn {
  font-size: 15px;
}

.traveler-info-label {
  font-family: NanumSquareRoundExtraBold;
  font-size: 19px;
  color: #333;
}

.author-info-box {
  background-color: #f1f1f1; /* Light grey background */
  padding: 1px 15px 1px 15px;
  border-radius: 10px; /* Rounded corners for the box */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
}

img.rounded-circle {
  margin-right: 15px; /* Space between image and text */
}

.writer-nickname {
  font-family: NanumSquareRound;
  margin-top: 13px;
  font-size: 16px;
}

.writer-introduction {
  font-family: NanumSquareRound;
  font-size: 13px;
  color: gray;
}

.location-info-label {
  font-family: NanumSquareRoundExtraBold;
  font-size: 19px;
}

.location-info-box {
  background-image: linear-gradient(to bottom, #fafafa, #cfcfcf, #e0e0e0);
  padding: 15px;
  border-radius: 10px; /* Rounded corners for the box */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
}

.visited-places {
  font-size: 16px;
  color: #333;
}

.city-name {
  font-size: 14px;
  color: #777777;
}

#map {
  width: 100%; /* Full width of the container */
  border: 2px solid white; /* White border around the map */
  border-radius: 8px; /* Rounded corners for the map */
}
</style>

