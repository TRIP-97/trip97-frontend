<script setup>
import { ref, defineProps } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  groupItem: Object,
});

const group = ref("");
group.value = props.groupItem;
group.value.startDate = formatVisitedDate(group.value.startDate);
group.value.endDate = formatVisitedDate(group.value.endDate);
console.log(props.groupItem);

// 날짜 포맷 변경 함수
function formatVisitedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
}

function goGroupDetail() {
  router.push({
    name: "groupDetail",
    params: { id: group.value.id },
  });
}
</script>

<template>
  <div class="card" @click="goGroupDetail" style="width: 18rem">
    <div class="card-header bg-transparent d-flex align-items-center">
      <div class="d-flex align-items-center">
        <img src="@/assets/images/profile.png" style="width: 30px" />
        <p class="writer-nickname mb-0 ms-2">{{ group.creatorNickname }}</p>
        <div class="custom-vr mx-3"></div>
      </div>
      <div class="header-date mt-3">
        <div class="d-flex">
          <i class="travel-date-icon fa-solid fa-calendar"></i>
          <p class="travel-date-label mb-0">모임 기간</p>
        </div>
        <p class="travel-date">{{ group.startDate }} ~ {{ group.endDate }}</p>
      </div>
    </div>
    <div class="position-relative group-image-area">
      <template v-if="group.fileInfos === null">
        <img src="@/assets/images/fubao.jpg" class="card-img-top group-image" alt="Group Image" />
      </template>
      <template v-else>
        <img :src="group.fileInfos[0].url" class="group-image" style="width: 300px" />
      </template>
      <div class="group-location position-absolute">
        <i class="fa-solid fa-location-dot"></i>
        {{ group.location }}
      </div>
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ group.name }}</h5>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  margin: 10px;
  overflow: hidden; /* 카드 범위 밖 내용 숨기기 */
  cursor: pointer;
}
.card:hover .group-location {
  color: white; /* 호버 시 글자 색 변경 */
  background-color: #00a1fc; /* 호버 시 배경 색 변경 */
}
.card:hover .group-image {
  transform: scale(1.15); /* 이미지 확대 */
  transition: transform 0.3s ease; /* 이미지 확대 트랜지션 효과 추가 */
}

.card-header {
  height: 50px;
  font-size: 11px;
  border-bottom: none; /* 하단 테두리 제거 */
}
.card-title {
  font-size: 17px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* 1줄로 제한 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: 1.5em; /* 높이 조절을 통해 텍스트 라인의 개수와 높이를 일치시킴 */
}
.custom-vr {
  border-left: 1px solid lightgray;
  height: 30px;
  align-self: center;
}
.writer-nickname {
  font-size: 13px;
}
.travel-date-icon {
  color: gray;
}
.travel-date-label {
  margin-left: 3px;
  color: gray;
}
.travel-date {
  color: #00a1fc;
}
.group-image-area {
  height: 160px;
  overflow: hidden;
  border-radius: 10px;
}
.group-image {
  border-radius: 10px;
  transition: transform 0.3s ease; /* 이미지 트랜지션 효과 추가 */
}
.group-location {
  top: 10px;
  left: 10px;
  height: 25px;
  padding-top: 2px;
  padding-left: 10px;
  padding-right: 10px;
  color: #00a1fc;
  background-color: white;
  border-radius: 10px;
  font-size: 14px;
}
.fa-calendar {
  margin-top: 2px;
}
</style>
