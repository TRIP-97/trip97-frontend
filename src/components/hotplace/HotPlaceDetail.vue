<script setup>
  import { ref, onMounted, toRefs } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import {
    detailHotPlace,
    deleteHotPlace,
    listHotPlaceComment,
    registHotPlaceComment,
    checkHotPlaceLiked,
    updateLike,
  } from "@/api/hotplace";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";
  import HotPlaceCommentItem from "./item/HotPlaceCommentItem.vue";

  const route = useRoute();
  const router = useRouter();

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  const hotPlaceId = ref(route.params.id);
  const hotPlace = ref("");
  const memberId = ref("");
  const comments = ref([]);
  const commentContent = ref("");
  const isWriter = ref(false);
  const isLiked = ref(false);

  // 게시글 작성자인지 확인하는 함수
  const checkIsWriter = () => {
    if (hotPlace.value.writerId === memberId.value) {
      isWriter.value = true;
    }
  };

  // 핫플레이스 게시글 조회하는 함수
  async function getHotPlace() {
    detailHotPlace(
      hotPlaceId.value,
      (response) => {
        hotPlace.value = response.data;
        console.log("핫플레이스 게시글 로딩 성공!", hotPlace.value);

        hotPlace.value.startDate = formatVisitedDate(hotPlace.value.startDate);
        hotPlace.value.endDate = formatVisitedDate(hotPlace.value.endDate);

        checkIsWriter();
        getComments();
      },
      (error) => {
        console.log("HotPlace 게시글 불러오는 중 에러 발생!");
        console.dir(error);
      }
    );
  }

  // 날짜 포맷 변경 함수
  function formatVisitedDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  }

  // 핫플레이스 좋아요 여부 확인하는 함수
  function checkLike() {
    checkHotPlaceLiked(
      {
        memberId: memberId.value,
        hotPlaceId: hotPlaceId.value,
      },
      (response) => {
        isLiked.value = response.data;
      },
      (error) => {
        console.log("HotPlace 좋아요 여부 불러오는 중 에러 발생!");
        console.dir(error);
      }
    );
  }

  // 핫플레이스 좋아요하는 함수
  function addLike() {
    if (isLiked.value) {
      window.alert("이미 좋아요한 게시물입니다!");
    } else {
      console.log("좋아요추가 체크");
      updateLike(
        {
          memberId: memberId.value,
          hotPlaceId: hotPlaceId.value,
        },
        () => {
          isLiked.value = true;
          getHotPlace();
        },
        (error) => {
          console.log("HotPlace 좋아요하는 중 에러 발생!");
          console.dir(error);
        }
      );
    }
  }

  // 댓글 목록 조회하는 함수
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

  // 댓글 작성하는 함수
  const registComment = () => {
    const comment = ref({
      writerId: memberId.value,
      boardId: hotPlaceId.value,
      content: commentContent.value,
    });

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
    if (userInfo.value !== null) {
      memberId.value = userInfo.value.id;
    }
    getHotPlace();
    checkLike();

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
                <span class="action-text" @click="goHotPlaceModify">수정</span>
                <div class="custom-vr mx-2"></div>
                <span class="action-text" @click="removeHotPlace">삭제</span>
              </div>
            </div>

            <p class="schedule-label mb-2">여행 일정</p>
            <div class="schedule-box my-3">
              <strong> <i class="travel-date-icon fa-solid fa-calendar"></i></strong>
              {{ hotPlace.startDate }} ~ {{ hotPlace.endDate }}
              <br />
              <br />
              <strong><i class="fa-solid fa-location-dot"></i></strong> {{ hotPlace.location }}
            </div>
            <div class="my-2">
              <p class="content-label mb-4">여행 소개</p>
              <strong class="content">{{ hotPlace.content }}</strong>
            </div>

            <div class="col-lg-8 mx-auto image-list" v-if="hotPlace.fileInfos">
              <v-carousel style="height: 300px">
                <v-carousel-item
                  v-for="fileInfo in hotPlace.fileInfos"
                  :key="fileInfo.id"
                  :src="fileInfo.url"
                />
              </v-carousel>
            </div>

            <div class="like-button-section">
              <button class="btn like-button" @click="addLike">
                <i :class="{ 'fa-solid': isLiked, 'fa-regular': !isLiked }" class="fa-heart"></i>
              </button>
            </div>

            <div class="list-button-section mt-5">
              <hr class="mt-3" />
              <button class="btn btn-primary list-btn" @click="goHotPlaceList">목록으로</button>
            </div>

            <template v-if="memberId !== ''">
              <div class="comment-section">
                <p class="comment-label mb-3">댓글</p>
                <div class="input-group mb-3">
                  <input
                    type="text"
                    v-model="commentContent"
                    class="form-control"
                    id="commentContent"
                    placeholder="댓글을 입력하세요..."
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-outline-primary text-primary comment-write-btn"
                      @click="registComment"
                    >
                      작성
                    </button>
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

          <div class="col-lg-3 offset-lg-1">
            <h5 class="traveler-info-label mb-2">여행자</h5>
            <div class="author-info-box my-3">
              <div class="d-flex align-items-center mb-1">
                <img
                  v-if="hotPlace.writerProfileImage === null"
                  src="@/assets/images/profile.png"
                  alt="Author"
                  class="img-fluid rounded-circle profile-image mr-3"
                />
                <img
                  v-else
                  :src="hotPlace.writerProfileImage"
                  alt="Author"
                  class="img-fluid rounded-circle profile-image mr-3"
                />
                <p class="writer-nickname">{{ hotPlace.writerNickname }}</p>
              </div>
              <p v-if="hotPlace.writerIntroduction !== null && hotPlace.writerIntroduction !== ''" class="writer-introduction">
                {{ hotPlace.writerIntroduction }}
              </p>
              <p v-else class="writer-introduction">
                자기소개를 아직 작성하지 않았어요.
              </p>
            </div>
            <h5 class="location-info-label mb-2">여행 장소</h5>
            <div class="location-info-box my-3">
              <div>
                <p class="visited-places">{{ hotPlace.placeName }}</p>
                <hr />
                <!-- Horizontal line with margin -->
                <p class="city-name">{{ hotPlace.location }}</p>
              </div>
              <div
                id="map"
                class="side-map border border-white rounded"
                style="height: 250px"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .map {
    width: auto;
    height: 540px;
    margin-top: 15px;
    border: 1px solid;
    border-radius: 10px;
  }

  .map-area {
    border-radius: 15px;
    box-shadow: 2px 2px 2px 2px rgba(200, 200, 200, 0.8);
    background-color: rgb(255, 255, 255, 0.6);
  }

  .container {
    max-width: 1200px;
  }

  .title,
  .schedule-label,
  .content-label,
  .comment-label {
    font-family: NanumSquareRoundExtraBold;
  }

  .schedule-label,
  .content-label {
    font-size: 20px;
    margin-top: 50px;
  }

  .comment-label {
    font-size: 20px;
    margin-top: 30px;
  }

  .content {
    color: #3e4143;
  }

  .info-text {
    font-size: 0.9rem;
    color: #6c757d;
  }

  .custom-vr {
    display: inline;
    border-left: 1px solid lightgray;
    align-self: center;
  }

  .stat-text {
    margin-right: 5px;
  }

  .date-text {
    text-align: right;
  }

  .edit-actions {
    color: #6c757d;
    font-size: 0.8rem;
  }

  .action-text {
    cursor: pointer;
  }

  .schedule-box {
    color: gray;
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .image-list {
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .like-button-section {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  .btn.like-button {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    border: 1px solid lightpink;
    background-color: rgb(255, 255, 255);
    color: rgba(222, 70, 70, 0.868);
    font-size: 24px;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .btn.like-button:hover {
    background-color: #ffebeb;
  }

  .list-button-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .list-button-section .btn-primary {
    background-color: #689beb;
    border-color: #689beb;
    color: white;
  }

  hr {
    width: 100%;
    border: 0;
    height: 1px;
    background-color: #575555;
    margin-top: 5px;
  }

  .input-group .form-control {
    border-right: 0;
    font-size: 13px;
  }

  .input-group .input-group-append .btn {
    background-color: transparent;
    color: #00bfff;
    border: 0;
  }

  .input-group {
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .comment-write-btn {
    font-size: 15px;
  }

  .traveler-info-label {
    font-family: NanumSquareRoundExtraBold;
    font-size: 19px;
    color: #333;
    margin-top: 50px;
  }

  .author-info-box {
    background-color: #f1f1f1;
    padding: 1px 15px 1px 15px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  img.rounded-circle {
    margin-right: 15px;
  }

  .profile-image {
    border-radius: 50%;
    width: 40px;
    height: 40px;
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
    margin-top: 50px;
  }

  .location-info-box {
    background-image: linear-gradient(to bottom, #fafafa, #cfcfcf, #e0e0e0);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .visited-places {
    font-size: 16px;
    color: #333;
  }

  .city-name {
    font-size: 14px;
    color: #777777;
  }

  .side-map {
    width: 100%;
    border: 2px solid white;
    border-radius: 8px;
  }
</style>
