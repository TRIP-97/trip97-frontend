<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>즐겨찾기에 추가하시겠어요?</h2>
      <div class="d-flex flex-direction-row">
        <button class="addBtn" @click="addBookMark">추가</button>
        <button class="cancelBtn" @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from "vue";
import { registerFavorite, removeFavorite, selectFavorite } from "@/api/favorite.js";

import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

// Define properties that can be passed to the component
const props = defineProps({
  attractionId: [String, Number],
  modelValue: Boolean,
});

// Initialize visible state with the value of modelValue prop
const visible = ref(props.modelValue);

// Watch for changes in modelValue prop and update visible state accordingly
watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal;
  }
);

async function addBookMark() {
  const favorite = {
    memberId: userInfo.value.id,
    attractionId: props.attractionId,
  };

  console.log(favorite);

  registerFavorite(
    sessionStorage.getItem("accessToken"),
    favorite,
    (response) => {
      console.log("추가 완료");
      closeModal();
    },
    (error) => {
      console.log("즐겨찾기 추가 실패");
    }
  );
}

// Emit an event to notify the parent component about the change in visible state
const emit = defineEmits(["update:modelValue"]);
const closeModal = () => {
  visible.value = false;
  emit("update:modelValue", false);
};
</script>

<style scoped>
.addBtn,
.cancelBtn {
  width: 100px;
  height: 38px;
  background-color: #8280dd;
  color: white;
  font-size: 20px;
  margin: 0px 0px 0px 5px;
  box-shadow: 0 2px 4px 0px rgba(0, 0, 0, 0.5);
}

.addBtn:hover,
.cancelBtn:hover {
  background-color: #6867b1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* 지도보다 높은 값을 설정 */
}

.modal-content {
  background: white;
  width: 450px;
  height: 120px;
  padding: 20px;
  border-radius: 5px;
  min-width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  align-items: center;
}
</style>
