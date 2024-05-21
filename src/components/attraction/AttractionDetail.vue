<template>
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
          <button @click="close" class="closeBtn">Close</button>
        </div>
        <div class="d-flex flex-direction-row">
          <div v-if="attraction.rating !== undefined && attraction.rating !== null">
            <img
              v-for="n in Math.floor(attraction.rating)"
              :key="'star' + n"
              class="infoStar"
              src="@/assets/images/RaitingStar.png"
              alt="Star"
            />
            <img
              v-for="n in 5 - Math.floor(attraction.rating)"
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
        <button class="add-review-btn" @click="addReview">리뷰 작성하기 +</button>
      </div>

      <div class="review-list" v-for="review in reviews" :key="review.id">
        <div class="review-info">
          <img :src="review.writerProfileImage" class="writer-profile-image" alt="" />
          <p>{{ review.writerNickname }}</p>

          <!-- 평점 별 아이콘 표시 -->
          <div class="rating">
            <i
              v-for="index in 5"
              :key="index"
              :class="index <= review.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"
            >
            </i>
          </div>

          <p>{{ review.content }}</p>
          <p>{{ review.createdAt }}</p>
        </div>
      </div>

      <AttractionCommentModal
        :attractionId="attractionId"
        :isActive="isModalActive"
        @close="isModalActive = false"
        :onSave="saveReview"
      />
    </div>
  </div>
</template>

<script setup>
  import { onMounted, watch, ref } from "vue";
  import { getAttractionId } from "@/api/attraction.js";
  import { defineProps, defineEmits } from "vue";
  import { getReviews, registerReview, updateReview, removeReview } from "@/api/review.js";
  import AttractionCommentModal from "@/components/attraction/AttractionCommentModal.vue";
  import "bootstrap/dist/css/bootstrap.min.css";

  const props = defineProps({
    attractionId: [String, Number],
    attractionContent: String,
  });

  const attraction = ref({});
  const reviews = ref([]);
  const isModalActive = ref(false);

  async function getAttract(id) {
    getAttractionId(
      id,
      // 125266,
      (response) => {
        attraction.value = response.data;
        console.log(props.attractionContent);
        getReviewList();
      },
      (error) => {
        console.log("관광지 불러오는 중 에러 발생");
        console.dir(error);
      }
    );
  }

  // 날짜 포맷 변경 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${month.toString().padStart(2, "0")}.${day.toString().padStart(2, "0")}`;
  }

  // 관광지의 리뷰 목록을 조회하는 함수
  const getReviewList = () => {
    getReviews(
      attraction.value.id,
      ({ data }) => {
        console.dir(data);
        reviews.value = data.map((review) => ({
          ...review,
          createdAt: formatDate(review.createdAt),
        }));
        console.log(data);
      },
      (error) => {
        console.log("리뷰 목록 불러오는 중 에러 발생!");
        console.dir(error);
      }
    );
  };

  // 리뷰 모달창 여부를 바꾸는 함수
  const addReview = () => {
    isModalActive.value = true;
  };

  // 리뷰를 저장하는 함수
  const saveReview = (newReview) => {
    registerReview(
      newReview,
      () => {
        getAttract(props.attractionId);
        getReviewList();
      },
      (error) => {
        console.log("리뷰 저장 중 에러 발생!");
        console.dir(error);
      }
    );
  };

  watch(
    () => props.attractionId,
    (newId) => {
      getAttract(newId);
    }
  );

  onMounted(() => {
    getAttract(props.attractionId);
  });

  const emits = defineEmits(["close"]);
  const close = () => {
    emits("close");
  };
</script>

<style scoped>
  @import "@/assets/css/attraction/attractionDetail.css";

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

  .review-info {
    background-color: rgb(221, 221, 221);
  }

  .writer-profile-image {
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }
</style>
