<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const route = useRoute();

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

const props = defineProps({
  isActive: Boolean,
  onSave: Function,
});

const emit = defineEmits(['close']);

const plan = ref({
  travelGroupId: route.params.id,
  creatorId: userInfo.value.id,
  title: '',
  overview: '',
  startDate: '',
  endDate: '',
});

const closeModal = () => {
  emit('close');
};

const savePlan = () => {
  props.onSave(plan.value);
  closeModal();
};
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="title text-center">여행 계획 만들기</h3>
        <div class="field">
          <label class="label">제목</label>
          <div class="control">
            <input class="input" type="text" v-model="plan.title" />
          </div>
        </div>
        <div class="field">
          <label class="label">내용</label>
          <div class="control">
            <textarea class="textarea" v-model="plan.overview"></textarea>
          </div>
        </div>
        <div class="field">
          <label class="label">시작일</label>
          <div class="control">
            <input class="input" type="date" v-model="plan.startDate" />
          </div>
        </div>
        <div class="field">
          <label class="label">종료일</label>
          <div class="control">
            <input class="input" type="date" v-model="plan.endDate" />
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" @click="savePlan">저장</button>
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


