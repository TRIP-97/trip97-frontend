<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  isActive: Boolean,
  onSave: Function,
  dayPlanId: Number,
  dayPlanItemsLength: Number,
});

const emit = defineEmits(["close"]);

const memo = ref({
  dayPlanId: props.dayPlanId,
  type: "MEMO",
  title: "",
  content: "",
  attractionId: null,
  contentTypeId: 0,
  latitude: null,
  longitude: null,
  order: props.dayPlanItemsLength + 1,
});

watch(
  () => [props.dayPlanId, props.dayPlanItemsLength],
  () => {
    memo.value.dayPlanId = props.dayPlanId;
    memo.value.order = props.dayPlanItemsLength + 1;
  }
);

const closeModal = () => {
  memo.value.content = "";
  emit("close");
};

const saveMemo = () => {
  props.onSave(memo.value);
  closeModal();
};
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="title text-center">메모 작성</h3>
        <div class="field">
          <label class="label">내용</label>
          <div class="control">
            <textarea class="textarea" v-model="memo.content"></textarea>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" @click="saveMemo">저장</button>
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
  background: rgba(0, 0, 0, 0.3);
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
  background-color: #8280dd;
  color: white;
  border-radius: 15px;
}

.button.is-light {
  background-color: #e4e4e4;
  color: #333;
  border-radius: 15px;
}
</style>
