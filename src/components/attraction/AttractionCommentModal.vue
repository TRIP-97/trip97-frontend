<script setup>
import { ref, defineProps } from "vue";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

const props = defineProps({
  isActive: Boolean,
  onSave: Function,
  attractionId: Number,
});

const emit = defineEmits(["close"]);

const review = ref({
  attractionId: props.attractionId,
  writerId: userInfo.value.id,
  content: "",
  rating: 0,
});

const closeModal = () => {
  emit("close");
};

const saveReview = () => {
  props.onSave(review.value);
  
  closeModal();
};

// 별 아이콘을 클릭했을 때 rating을 업데이트하는 함수
const setRating = (index) => {
  review.value.rating = index + 1; // 클릭한 별의 인덱스를 기반으로 rating 설정
};
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="title text-center">리뷰 작성하기</h3>
        <div class="field">
          <label class="label rating-label">평점</label>
          <div class="stars">
            <!-- 5개의 별 아이콘을 반복해서 생성 -->
            <i
              v-for="index in 5"
              :key="index"
              :class="index <= review.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"
              @click="setRating(index - 1)"
            ></i>
          </div>
          <label class="label review-label">리뷰 내용</label>
          <div class="control">
            <input class="input review-content" type="text" v-model="review.content" />
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" @click="saveReview">저장</button>
          </div>
          <div class="control">
            <button class="button is-light" @click="closeModal">취소</button>
          </div>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" @click="closeModal" aria-label="close"></button>
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
  width: 500px;
  max-width: 90%;
  z-index: 1001;
}

.box {
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.field {
  margin-bottom: 15px;
}

.field .label {
  font-weight: bold;
}

.field .control .input,
.field .control .textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.field.is-grouped {
  display: flex;
  justify-content: flex-end;
}

.field.is-grouped .control {
  margin-left: 10px;
}

.fa-star {
  color: rgb(224, 213, 109);
  cursor: pointer; /* 클릭 가능하도록 포인터 커서 설정 */
}

.rating-label {
  margin-bottom: 3px;
}

.review-label {
  margin-top: 30px;
  margin-bottom: 10px;
}

.review-content {
  font-family: NanumSquareRound;
  font-size: 14px;
}

.button {
  padding: 10px 20px;
}

.button.is-link {
  background-color: #4285cc;
  color: white;
  border-radius: 15px;
}

.button.is-light {
  background-color: #e4e4e4;
  color: #333;
  border-radius: 15px;
}
</style>
