<script setup>
  import { ref, watch, defineProps, defineEmits } from "vue";
  import { getAttractionId } from "@/api/attraction";
  import { getReviews } from "@/api/review";

  const props = defineProps({
    isActive: Boolean,
    selectHotAttractionId: Number,
  });

  const emit = defineEmits(["close"]);

  const attraction = ref("");
  const reviews = ref([]);

  const getHotAttractionDetail = (id) => {
    getAttractionId(
      id,
      ({ data }) => {
        console.log("인기 관광지 상세 조회 성공!");
        console.log(data);
        attraction.value = data;
      },
      (error) => {
        console.log("인기 관광지 상세 조회 중 에러 발생!");
        console.log(error);
      }
    );
  };

  const getHotAttractionReviews = (id) => {
    getReviews(
      id,
      ({ data }) => {
        console.log("인기 관광지의 리뷰 목록 조회 성공!");
        console.log(data);
        reviews.value = data;
      },
      (error) => {
        console.log("인기 관광지의 리뷰 목록 조회 중 에러 발생!");
        console.log(error);
      }
    );
  };

  watch(
    () => props.isActive,
    (newValue) => {
      if (newValue) {
        console.log(newValue);
        getHotAttractionDetail(props.selectHotAttractionId);
        getHotAttractionReviews(props.selectHotAttractionId);
      }
    }
  );

  const closeModal = () => {
    emit("close");
  };
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="childBox d-flex flex-column">
        <div class="attract d-flex flex-row">
          <div v-if="attraction && attraction.firstImage != ''">
            <img class="infoImage" :src="attraction.firstImage" />
          </div>
          <div v-else>
            <img class="infoImage" src="@/assets/images/no_image.png" />
          </div>
          <div class="infoText">
            <div class="first mb-2">
              <p class="title">{{ attraction.title }}</p>
              <p class="contentType mt-3 ms-2">{{ props.attractionContent }}</p>
              <button @click="closeModal" class="closeBtn">Close</button>
            </div>
            <div class="d-flex flex-direction-row">
              <div v-if="attraction.rating !== undefined && attraction.rating !== null">
                <img
                  v-for="n in Math.round(attraction.rating)"
                  :key="'star' + n"
                  class="infoStar"
                  src="@/assets/images/RaitingStar.png"
                  alt="Star"
                />
                <img
                  v-for="n in 5 - Math.round(attraction.rating)"
                  :key="'noStar' + n"
                  class="infoStar"
                  src="@/assets/images/RaitingNoStar.png"
                  alt="No Star"
                />
              </div>
              <p class="reviewCount ml-5">리뷰 {{ attraction.reviewCount }}</p>
            </div>
            <p class="address">{{ attraction.address }}</p>
            <p class="overview">{{ attraction.overview }}</p>
          </div>
        </div>

        <hr />

        <div class="reviewContainer">
          <div class="header d-flex justify-content-between">
            <h1>리뷰</h1>
          </div>

          <div class="review-list" v-for="review in reviews" :key="review.id">
            <div class="review-info d-flex flex-column">
              <div class="d-flex align-items-center mb-2">
                <img :src="review.writerProfileImage" class="writer-profile-image" alt="" />
                <p class="review-name ml-3">{{ review.writerNickname }}</p>
              </div>

              <!-- 평점 별 아이콘 표시 -->
              <div class="rating">
                <i
                  v-for="index in 5"
                  :key="index"
                  :class="index <= review.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"
                >
                </i>
              </div>

              <p class="review-content">{{ review.content }}</p>
              <p class="review-createAt">{{ review.createdAt }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal.is-active {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 1000px; /* 가로 길이를 늘립니다 */
    max-width: 90%;
    max-height: 80vh; /* 세로 길이를 줄이기 위해 최대 높이 설정 */
    overflow-y: auto; /* 내용이 넘칠 경우 스크롤바 추가 */
    z-index: 1001;
  }

  .childBox {
    display: flex;
    flex-direction: column;
    padding: 2px;
    border-radius: 10px;
    background-color: #fff;
    width: 100%; /* 가로 길이를 늘리기 위해 100%로 설정 */
    margin: 20px;
    overflow-x: hidden;
  }

  .attract {
    width: 100%;
  }

  .infoImage {
    width: 200px;
    height: auto;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .first {
    display: flex;
    flex-direction: row;
    height: 45px;
  }

  .infoText {
    width: 70%;
    text-align: left;
    margin-left: 10px;
  }

  .title {
    font-size: 35px;
    font-weight: bold;
  }

  .contentType {
    font-size: 1.3em;
  }

  .contentType,
  .rating,
  .reviewCount,
  .address,
  .overview {
    margin: 5px 0;
  }

  .reviewCount {
    font-size: 20px;
  }

  .address {
    font-size: 20px;
  }

  .reviewContainer {
    margin-top: 20px;
    height: 200px; /* 세로 길이를 줄입니다 */
    text-align: left;
  }

  .reviewContainer h3 {
    font-size: 1.2em;
  }

  .closeBtn {
    margin-left: auto;
    margin-bottom: 3px;
    padding: 10px 13px;
    font-size: 1em;
    border: none;
    border-radius: 5px;
    background-color: #8280dd;
    color: white;
    cursor: pointer;
  }

  .closeBtn:hover {
    background-color: #4e4d8a;
  }

  .infoStar {
    width: 30px;
    height: 30px;
  }

  .reviewContainer {
    margin-top: 20px;
    height: 320px;
  }

  .reviewContainer h3 {
    font-size: 1.2em;
  }

  .add-review-btn {
    height: 40px;
    background-color: #9d9cd6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease, color 0.3s ease;
    margin-right: 30px;
  }

  .add-review-btn:hover {
    background-color: #7271bb;
    color: white;
  }

  .review-list {
    margin-top: 10px;
  }

  .review-name {
    font-size: 20px;
    margin-top: 5px;
    margin-bottom: 0px;
  }

  .review-content {
    margin-bottom: 3px;
  }

  .review-createAt {
    margin-bottom: 3px;
  }

  .rating {
    color: #57559b;
  }

  .review-info {
    padding: 20px;
    background-color: #e4e3ff;
    border-radius: 10px;
    width: 99%;
    display: flex;
    flex-direction: column;
  }

  .ml-3 {
    margin-left: 1rem; /* profileImage와 review-name 사이의 간격을 위해 추가 */
  }

  .mb-2 {
    margin-bottom: 0.5rem; /* 프로필 이미지와 별점 사이의 간격을 위해 추가 */
  }

  .writer-profile-image {
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }
</style>
