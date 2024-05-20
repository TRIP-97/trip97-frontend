<script setup>
  import { ref } from "vue";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";
  import "vue3-carousel/dist/carousel.css";
  import { Carousel, Slide, Navigation } from "vue3-carousel";
  import testImage from "@/assets/images/HotPlacePageLogo.jpg";
  const memberStore = useMemberStore();
  const { userInfo, isLogin } = storeToRefs(memberStore);

  // 더미 데이터
  const attractions = ref([
    {
      id: 1,
      name: "남산타워",
      reviewCount: 17,
      rating: 4.0,
      image: testImage,
    },
    {
      id: 2,
      name: "제주도",
      reviewCount: 11,
      rating: 4.0,
      image: testImage,
    },
    {
      id: 3,
      name: "성심당",
      reviewCount: 11,
      rating: 4.0,
      image: testImage,
    },
    {
      id: 4,
      name: "경복궁",
      reviewCount: 20,
      rating: 4.5,
      image: testImage,
    },
    {
      id: 5,
      name: "부산타워",
      reviewCount: 10,
      rating: 4.2,
      image: testImage,
    },
    {
      id: 6,
      name: "인천공항",
      reviewCount: 8,
      rating: 3.8,
      image: testImage,
    },
    {
      id: 7,
      name: "서울대공원",
      reviewCount: 15,
      rating: 4.1,
      image: testImage,
    },
    {
      id: 8,
      name: "동대문",
      reviewCount: 12,
      rating: 3.9,
      image: testImage,
    },
    {
      id: 9,
      name: "창덕궁",
      reviewCount: 13,
      rating: 4.0,
      image: testImage,
    },
    {
      id: 10,
      name: "한강공원",
      reviewCount: 18,
      rating: 4.4,
      image: testImage,
    },
  ]);
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
            <button class="btn login-btn">내정보 보기</button>
          </div>
          <div v-else class="col-lg-4 my-profile-info">
            <div class="d-flex profile-header">
              <img src="@/assets/images/profile.png" class="profile-image" alt="" />
              <div class="default-message">
                <p>안녕하세요</p>
                <p>여행자님!</p>
              </div>
            </div>
            <button class="btn login-btn">로그인하기</button>
          </div>
          <div class="col-lg-7 my-group-area d-flex justify-content-center align-items-center">
            <div class="group-default-message">
              <h7>예정된 여행 모임이 없어요.</h7>
              <br />
              <h7>먼저, 여행 모임을 만들어볼까요?</h7>
            </div>
            <button class="btn create-group-btn">+</button>
          </div>
        </div>
        <div class="friends-area d-flex flex-column align-items-center">
          <div class="friends-header d-flex align-items-center">
            <span class="red-dot"></span>
            <div class="friends-text ms-2">
              <p class="main-text">나와 함께 하는 여행자들</p>
              <p class="sub-text">현재 10명이 함께 하고 있어요!</p>
            </div>
          </div>
          <div class="friends-list d-flex">
            <div class="friend" v-for="index in 5" :key="index">
              <img src="@/assets/images/profile.png" class="friend-image" alt="Friend Image" />
              <p>강세현</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6 move-page-area">
        <div class="row">
          <div class="col-lg-5 move-community">
            <img
              src="@/assets/images/mainImages/community.jpg"
              class="move-image"
              alt="Community"
            />
            <div class="overlay">
              <h2>커뮤니티</h2>
            </div>
          </div>
          <div class="col-lg-5 move-hotplace">
            <img src="@/assets/images/mainImages/hotplace.jpg" class="move-image" alt="Hotplace" />
            <div class="overlay">
              <h2>HOTPLACE</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row hot-attraction-area d-flex flex-column align-items-center">
      <h2 class="hot-attraction-title">TRIP97 인기 여행지</h2>
      <p class="hot-attraction-subtitle">많은 여행자들에게 인기있는 여행지에요!</p>
      <carousel :items-to-show="3" class="hot-attraction-slider">
        <slide v-for="attraction in attractions" :key="attraction.id">
          <div class="hot-attraction-card">
            <img :src="attraction.image" style="width: 300px" alt="" />
          </div>
        </slide>

        <template #addons>
          <navigation />
        </template>
      </carousel>
    </div>

    <div class="row hot-board-area">
      <h1>최근 커뮤니티 인기 게시글</h1>
    </div>
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

  .friends-text {
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
    justify-content: space-between;
    width: 100%;
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
    font-size: 30px;
    font-weight: bold;
    margin-top: 50px;
  }

  .hot-attraction-subtitle {
    font-family: NanumSquareRound;
    font-size: 18px;
    color: #7a7a7a;
    margin-bottom: 60px;
  }

  .hot-board-area {
    margin-top: 50px;
  }
</style>
