<template>
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
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
    </div>
  </template>
  
  <script setup>

    import { onMounted, watch, ref, defineProps, defineEmits } from "vue";
  import "bootstrap/dist/css/bootstrap.min.css";

    const props = defineProps({
    bookmark: object,
    });

    const attraction = ref({});

    onMounted(() => {
  attraction.value = props.bookmark;
    });

    const emits = defineEmits(["close"]);
const close = () => {
  emits("close");
};
</script>

<style scoped>
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

  .childBox {
  width: 97%;
  overflow-y: scroll;
}

  
  </style>
  