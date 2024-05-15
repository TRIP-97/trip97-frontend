<script setup>
import { ref } from 'vue';

const props = defineProps({
  isActive: Boolean,
  onSave: Function,
});

const emit = defineEmits(['close']);

const plan = ref({
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
        <h3 class="title">여행 계획 추가하기</h3>
        <div class="field">
          <label class="label">제목</label>
          <div class="control">
            <input class="input" type="text" v-model="plan.title" />
          </div>
        </div>
        <div class="field">
          <label class="label">설명</label>
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
  display: flex;
}
</style>
