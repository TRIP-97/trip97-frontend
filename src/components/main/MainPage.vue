<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";
  import { Carousel, Slide, Navigation } from "vue3-carousel";
  import "vue3-carousel/dist/carousel.css";
  import testImage from "@/assets/images/HotPlacePageLogo.jpg";
  import HotAttractionModal from "@/components/attraction/item/HotAttractionModal.vue";

  const memberStore = useMemberStore();
  const { userInfo, isLogin } = storeToRefs(memberStore);

  import { listFriend } from "@/api/friend";
  import { getHotAttractions } from "@/api/attraction";
  import { getHotBoards } from "@/api/board";

  const router = useRouter();
  const friends = ref([]);
  const attractions = ref([]);
  const boards = ref([]);
  const isModalActive = ref(false);
  const selectHotAttractionId = ref("");

  async function getAttractions() {
    getHotAttractions(
      (response) => {
        attractions.value = response.data;
        console.log(attractions.value);
      },
      (error) => {
        console.log("인기 관광지 조회 실패");
        console.log(error);
      }
    );
  }

  async function getBoards() {
    getHotBoards(
      (response) => {
        boards.value = response.data;
        console.log("boards.value");
      },
      (error) => {
        console.log("인기 게시물 조회 실패");
        console.log(error);
      }
    );
  }

  async function getFriends() {
    if (isLogin.value) {
      console.log(userInfo.value.id);
      listFriend(
        userInfo.value.id,
        (response) => {
          friends.value = response.data;
          console.log(friends.value);
        },
        (error) => {
          console.log("친구목록 조회 실패");
          console.log(error);
        }
      );
    }
  }

  function gotoMyPage() {
    router.push({
      name: "profile",
    });
  }

  const hotplaces = ref([
    {
      id: 1,
      location: "서울",
      title: "남산타워에서의 일출",
      writerNickname: "홍길동",
      createdAt: "2024-05-01",
      image: testImage,
      likes: 11,
    },
    {
      id: 2,
      location: "제주",
      title: "제주도 여행 후기",
      writerNickname: "김철수",
      createdAt: "2024-05-02",
      image: testImage,
      likes: 11,
    },
    {
      id: 3,
      location: "부산",
      title: "부산 해운대 맛집 탐방",
      writerNickname: "이영희",
      createdAt: "2024-05-03",
      image: testImage,
      likes: 11,
    },
    {
      id: 4,
      location: "서울",
      title: "서울의 숨겨진 명소",
      writerNickname: "박민수",
      createdAt: "2024-05-04",
      image: testImage,
      likes: 11,
    },
    {
      id: 5,
      location: "서울",
      title: "경복궁 야경 투어",
      writerNickname: "최지우",
      createdAt: "2024-05-05",
      image: testImage,
      likes: 11,
    },
    {
      id: 6,
      location: "인천",
      title: "인천공항 탐방기",
      writerNickname: "이철수",
      createdAt: "2024-05-06",
      image: testImage,
      likes: 11,
    },
    {
      id: 7,
      location: "서울",
      title: "서울대공원 동물원 탐방",
      writerNickname: "김민희",
      createdAt: "2024-05-07",
      image: testImage,
      likes: 11,
    },
    {
      id: 8,
      location: "서울",
      title: "동대문 쇼핑 탐방",
      writerNickname: "박영수",
      createdAt: "2024-05-08",
      image: testImage,
      likes: 11,
    },
    {
      id: 9,
      location: "서울",
      title: "창덕궁의 아름다움",
      writerNickname: "최영희",
      createdAt: "2024-05-09",
      image: testImage,
      likes: 11,
    },
    {
      id: 10,
      location: "서울",
      title: "한강공원의 평화로움",
      writerNickname: "김철민",
      createdAt: "2024-05-10",
      image: testImage,
      likes: 11,
    },
  ]);

  // 로그인하기 버튼 클릭시 로그인 화면으로 이동하는 함수
  const moveToLoginPage = () => {
    router.push({
      name: "login",
    });
  };

  // 여행 모임 만들기 + 버튼 클릭시 여행 모임 화면으로 이동하는 함수
  const moveToGroupPage = () => {
    if (isLogin.value) {
      router.push({
        name: "groupWrite",
      });
    } else {
      window.alert("로그인을 먼저 해주세요!");
    }
  };

  // 커뮤니티 카드를 누르면 커뮤니티 화면으로 이동하는 함수
  const moveToCommunityPage = () => {
    router.push({
      name: "board",
    });
  };

  // 핫플레이스 카드를 누르면 핫플레이스 화면으로 이동하는 함수
  const moveToHotPlacePage = () => {
    router.push({
      name: "hotPlace",
    });
  };

  // 유명 관광지 클릭시 모달창을 활성화시키는 함수
  const viewHotPlaceModal = (attractionId) => {
    selectHotAttractionId.value = attractionId;
    isModalActive.value = true;
  };

  onMounted(() => {
    getFriends();
    getAttractions();
    getBoards();
  });
</script>

<template>
  <div class="container">
    <div class="row main-area">
      <div class="col-lg-6 my-info-area">
        <div class="row">
          <div v-if="isLogin" class="col-lg-4 my-profile-info">
            <div class="d-flex profile-header">
              <img :src="userInfo.profileImage" class="profile-image" alt="" />
              <div class="default-message">
                <p>안녕하세요</p>
                <p>{{ userInfo.nickname }}님!</p>
              </div>
            </div>
            <button class="btn login-btn" @click="gotoMyPage">내정보 보기</button>
          </div>
          <div v-else class="col-lg-4 my-profile-info">
            <div class="d-flex profile-header">
              <img src="@/assets/images/profile.png" class="profile-image" alt="" />
              <div class="default-message">
                <p>안녕하세요</p>
                <p>여행자님!</p>
              </div>
            </div>
            <button class="btn login-btn" @click="moveToLoginPage">로그인하기</button>
          </div>
          <div class="col-lg-7 my-group-area d-flex justify-content-center align-items-center">
            <div class="group-default-message">
              <h7>예정된 여행 모임이 없어요.</h7>
              <br />
              <h7>먼저, 여행 모임을 만들어볼까요?</h7>
            </div>
            <button @click="moveToGroupPage" class="btn create-group-btn">+</button>
          </div>
        </div>
        <div class="friends-area">
          <div class="friends-header d-flex align-items-center">
            <span class="red-dot"></span>
            <div class="friends-text ms-2">
              <p class="main-text">나와 함께 하는 여행자들</p>
              <p class="sub-text">현재 {{ friends.length }}명이 함께 하고 있어요!</p>
            </div>
          </div>
          <div class="friends-list">
            <carousel
              :items-to-show="5"
              :wrap-around="true"
              :transition="1000"
              :autoplay="300"
              class="friend-slider"
            >
              <slide v-for="friend in friends" :key="friend.id">
                <div class="friend">
                  <img
                    v-if="friend.profileImage === null"
                    src="@/assets/images/profile.png"
                    class="profile-image"
                  />
                  <img v-else :src="friend.profileImage" class="profile_image" />
                  <p>{{ friend.nickname }}</p>
                </div>
              </slide>
            </carousel>
          </div>
        </div>
      </div>

      <div class="col-lg-6 move-page-area">
        <div class="row">
          <div @click="moveToCommunityPage" class="col-lg-5 move-community">
            <img
              src="@/assets/images/mainImages/community.jpg"
              class="move-image"
              alt="Community"
            />
            <div class="overlay">
              <h2>커뮤니티</h2>
            </div>
          </div>
          <div @click="moveToHotPlacePage" class="col-lg-5 move-hotplace">
            <img src="@/assets/images/mainImages/hotplace.jpg" class="move-image" alt="Hotplace" />
            <div class="overlay">
              <h2>HOTPLACE</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row hot-attraction-area d-flex flex-column align-items-center">
      <h1 class="hot-attraction-title">TRIP97 인기 여행지</h1>
      <p class="hot-attraction-subtitle">많은 여행자들에게 인기있는 여행지에요!</p>
      <carousel :items-to-show="3" class="hot-attraction-slider">
        <slide v-for="attraction in attractions" :key="attraction.id">
          <div class="card hot-attraction-card" @click="viewHotPlaceModal(attraction.id)">
            <img :src="attraction.firstImage" class="hot-card-image" alt="" />
            <div class="overlay">
              <h2>{{ attraction.title }}</h2>
              <div class="review">
                <i class="fa-solid fa-message"></i>
                <span
                  ><strong class="attraction-review-count">{{ attraction.reviewCount }}</strong
                  >개의 리뷰</span
                >
              </div>
              <div clase="rating">
                <i class="fa-solid fa-star"></i>
                <span class="attraction-rating">{{ attraction.rating.toFixed(1) }}</span>
              </div>
            </div>
          </div>
        </slide>

        <template #addons>
          <navigation />
        </template>
      </carousel>
    </div>

    <div class="hot-board">
      <div class="hot-board-header d-flex align-items-center">
        <i class="fa-solid fa-fire"></i>
        <div class="hot-board-text ms-2">
          <p class="hot-board-main-text">최근 인기 커뮤니티 게시글</p>
          <p class="hot-board-sub-text">최근에 여행자들에게 인기있는 게시글을 확인해보세요!</p>
        </div>
      </div>

      <table class="table hot-post-table text-center">
        <thead class="table-light">
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="board in boards" :key="board.id">
            <td>{{ board.title }}</td>
            <td>{{ board.author }}</td>
            <td>{{ board.views }}</td>
            <td>{{ board.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pick-list">
      <div class="pick-header d-flex align-items-center">
        <i class="fa-solid fa-crown"></i>
        <div class="hot-board-text ms-2">
          <p class="pick-main-text">TRIP97's PICK</p>
          <p class="pick-sub-text">TRIP97 운영자가 추천하는 여행지를 확인해보세요!</p>
        </div>
      </div>

      <carousel :items-to-show="3" class="hotplace-slider">
        <slide v-for="hotplace in hotplaces" :key="hotplace.id">
          <div class="card hotplace-card">
            <img :src="hotplace.image" class="card-image" alt="" />
            <div class="card-body">
              <div class="location">
                <div>
                  <i class="fa-solid fa-location-dot"></i>
                  <span>{{ hotplace.location }}</span>
                </div>
                <div class="like">
                  <i class="fa-solid fa-heart"></i>
                  <span>{{ hotplace.likes }}</span>
                </div>
              </div>
              <p class="title">{{ hotplace.title }}</p>
              <div class="writer-info">
                <span>{{ hotplace.writerNickname }}</span>
                <span class="created-at">{{ hotplace.createdAt }}</span>
              </div>
            </div>
          </div>
        </slide>

        <template #addons>
          <navigation />
        </template>
      </carousel>
    </div>

    <HotAttractionModal
      :isActive="isModalActive"
      :selectHotAttractionId="selectHotAttractionId"
      @close="isModalActive = false"
    />
  </div>
</template>

<style scoped>
  .main-area {
    display: flex;
    justify-content: space-between;
  }

  .my-info-area {
    margin-top: 200px;
    border-radius: 10px;
  }

  .my-profile-info {
    padding: 20px;
    background-color: white;
    border: 1px solid rgb(179, 179, 179);
    border-radius: 15px;
    margin-bottom: 20px;
    box-shadow: 2px 2px 2px 2px rgba(128, 128, 128, 0.6);
  }

  .default-message {
    margin-top: 5px;
    margin-left: 20px;
    font-family: NanumSquareRound;
    font-weight: bold;
  }

  .default-message p {
    margin: 0; /* 상하 좌우 여백 제거 */
  }

  .profile-image {
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }

  .login-btn,
  .change-login-btn {
    margin-top: 30px;
  }

  .login-btn {
    background-color: #8280dd;
    color: white;
    border-radius: 6px;
    height: 35px;
    width: 180px;
  }

  .my-group-area {
    padding: 20px;
    background-color: white;
    border: 2px solid #adabff;
    border-radius: 15px;
    margin-bottom: 20px;
    margin-left: 30px;
    justify-content: center;
    align-items: center;
    text-align: center;
    box-shadow: 2px 2px 2px 2px rgba(128, 128, 128, 0.6);
  }

  .group-default-message {
    font-family: NanumSquareRound;
    font-weight: bold;
    margin-right: 60px;
  }

  .create-group-btn {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 30px;
    color: #3431bc;
    border: 1px dotted #3431bc;
  }

  .friends-area {
    padding: 20px;
    border-radius: 15px;
    width: 100%;
  }

  .friends-header {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .red-dot {
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
    box-shadow: 0 0 10px red;
  }

  .friends-text,
  .hot-board-text {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  .main-text {
    margin: 0px 0px 0px 10px;
    padding-top: 27px;
    font-weight: bold;
    font-family: NanumSquareRound;
    font-size: 20px;
  }

  .sub-text {
    margin: 0px 0px 0px 10px;
    font-family: NanumSquareRound;
    font-weight: bold;
    margin-top: 5px;
    color: #3431bc;
    font-size: 14px;
  }

  .friends-list {
    margin-top: 20px;
    display: flex;
    width: 600px;
  }

  .friend-slider {
    width: 600px;
  }

  .friend {
    text-align: center;
    font-family: NanumSquareRound;
    font-weight: bold;
  }

  .friend-image {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-bottom: 5px;
  }

  .move-page-area {
    margin-top: 200px;
    border-radius: 10px;
    height: 400px;
  }

  .move-community,
  .move-hotplace {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    height: 400px;
    cursor: pointer;
    margin-left: 50px;
    border-radius: 10px;
    background-color: #86b4a6;
    transition: background-color 0.3s ease;
    box-shadow: 2px 2px 2px 2px rgba(128, 128, 128, 0.6);
  }

  .move-community:hover,
  .move-hotplace:hover {
    background-color: #f0f0f0;
  }

  .move-image {
    height: 400px;
    border-radius: 10px;
    transition: transform 0.3s ease;
  }

  .move-page-area p {
    margin-top: 10px;
    font-size: 1.2em;
    font-weight: bold;
  }

  .move-community .overlay,
  .move-hotplace .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* 이미지 어둡게 */
    display: flex;
    align-items: flex-start; /* 좌상단 정렬 */
    justify-content: flex-start; /* 좌상단 정렬 */
    color: white;
    padding: 30px;
    box-sizing: border-box;
  }

  .move-community h3,
  .move-hotplace h3 {
    margin-top: 30px;
    z-index: 1; /* 텍스트가 이미지 위에 표시되도록 */
  }
  .move-community:hover .move-image,
  .move-hotplace:hover .move-image {
    transform: scale(1.05); /* 마우스 호버 시 확대 효과 */
  }

  .hot-attraction-area {
    margin-top: 50px;
    width: 100%;
    text-align: center;
  }

  .hot-attraction-title {
    font-family: NanumSquareRound;
    font-size: 36px;
    font-weight: bold;
    margin-top: 50px;
  }

  .hot-attraction-subtitle {
    font-family: NanumSquareRound;
    font-size: 18px;
    color: #7a7a7a;
    margin-bottom: 60px;
  }

  .hot-attraction-card {
    width: 250px;
    height: 350px;
    border-radius: 20px;
    text-align: center;
    overflow: hidden;
    box-shadow: 2px 2px 2px 2px rgba(128, 128, 128, 0.4);
    cursor: pointer;
  }

  .hot-attraction-card .hot-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지가 카드 크기에 맞게 조정 */
    position: absolute; /* 부모 요소 기준으로 절대 위치 */
    top: 0;
    left: 0;
  }

  .hot-attraction-card .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* 이미지 어둡게 */
    display: flex;
    flex-direction: column; /* 수직 정렬을 위해 flex-direction 추가 */
    align-items: flex-start;
    justify-content: flex-start; /* 좌상단 정렬 */
    color: white;
    padding: 30px;
    box-sizing: border-box;
  }

  .hot-attraction-card .overlay h2 {
    margin-bottom: 10px; /* 제목 아래에 여백 추가 */
  }

  .hot-attraction-card .overlay .review,
  .hot-attraction-card .overlay .rating {
    display: flex;
    align-items: center;
    margin-top: 5px; /* 아이템 간 여백 추가 */
  }

  .fa-message {
    margin-right: 10px; /* 아이콘과 텍스트 간 여백 추가 */
    color: #88debf;
  }

  .fa-star {
    margin-right: 10px;
    color: #f9ac66;
  }

  .attraction-review-count {
    color: #88debf;
    margin-right: 3px;
  }

  .attraction-rating {
    color: #f9ac66;
  }

  .hot-board-header {
    margin-top: 100px;
    background-color: #eeeeff;
    border-radius: 15px;
    padding-left: 30px;
    padding-bottom: 30px;
    box-shadow: 2px 2px 2px 2px rgba(128, 128, 128, 0.3);
  }

  .fa-fire {
    font-size: 25px;
    color: #df4242;
  }

  .hot-board-main-text {
    margin: 0px 0px 0px 3px;
    padding-top: 27px;
    font-weight: bold;
    font-family: NanumSquareRound;
    font-size: 24px;
  }

  .hot-board-sub-text {
    margin: 0px 0px 0px 3px;
    font-family: NanumSquareRound;
    font-weight: bold;
    margin-top: 5px;
    color: #3431bc;
    font-size: 16px;
  }

  .hot-post-table {
    margin-top: 30px;
  }

  .pick-header {
    margin-top: 100px;
    margin-bottom: 50px;
    background-color: #eeeeff;
    border-radius: 15px;
    padding-left: 30px;
    padding-bottom: 30px;
    box-shadow: 2px 2px 2px 2px rgba(128, 128, 128, 0.3);
  }

  .fa-crown {
    font-size: 25px;
    color: #613fe9;
  }

  .pick-main-text {
    margin: 0px 0px 0px 3px;
    padding-top: 27px;
    font-weight: bold;
    font-family: NanumSquareRound;
    font-size: 24px;
  }

  .pick-sub-text {
    margin: 0px 0px 0px 3px;
    font-family: NanumSquareRound;
    font-weight: bold;
    margin-top: 5px;
    color: #3431bc;
    font-size: 16px;
  }

  /* .hotplace-card {
    width: 300px;
    height: 350px;
    border-radius: 20px;
    text-align: center;
    overflow: hidden;
    box-shadow: 2px 2px 2px 2px rgba(128, 128, 128, 0.4);
  } */

  .hotplace-card {
    width: 300px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 2px 2px 2px 2px rgba(128, 128, 128, 0.4);
    position: relative;
    margin-bottom: 20px;
  }

  .card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .card-body {
    padding: 15px;
    background-color: white;
  }

  .location {
    display: flex;
    justify-content: space-between; /* 두 요소를 양 끝으로 배치 */
    align-items: center;
    font-size: 14px;
    color: #666;
  }

  .location .fa-location-dot {
    color: #613fe9;
    margin-right: 5px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0;
    color: #333;
    text-align: left;
  }

  .writer-info {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #999;
  }

  .writer-info .created-at {
    font-size: 12px;
    color: #999;
  }

  .like {
    display: flex;
    align-items: center;
    color: rgb(236, 87, 87);
    font-size: 14px;
  }

  .like i {
    margin-right: 5px;
  }
</style>
