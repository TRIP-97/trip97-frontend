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

// 날짜 포맷 변경 함수
function formatVisitedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
}

function goMyGroupDetail() {
  router.push({
    name: "myGroupDetail",
    params: { id: group.value.id },
  });
}
</script>

<template>
  <div class="card" @click="goMyGroupDetail" style="width: 18rem">
    <div class="card-header bg-transparent d-flex align-items-center">
      <div class="d-flex align-items-center">
        <img
          v-if="group.creatorProfileImage"
          :src="group.creatorProfileImage"
          class="profile-image"
        />
        <img v-else src="@/assets/images/profile.png" class="profile-image" />
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
      <div class="d-flex justify-content-end align-items-center group-info">
        <div class="d-flex">
          <i class="fa-solid fa-users"></i>
          <p class="member-count card-text">
            {{ group.currentMemberCount }} / {{ group.maxMemberCount }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  margin: 10px;
  overflow: hidden;
  cursor: pointer;
}
.card:hover .group-location {
  color: white;
  background-color: #7371c4;
}
.card:hover .group-image {
  transform: scale(1.15);
  transition: transform 0.3s ease;
}

.card-header {
  height: 50px;
  font-size: 11px;
  border-bottom: none;
}
.card-title {
  font-size: 17px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: 1.5em;
}
.custom-vr {
  border-left: 1px solid lightgray;
  height: 30px;
  align-self: center;
}
.profile-image {
  border-radius: 50%;
  width: 30px;
  height: 30px;
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
  color: #8280dd;
}
.group-image-area {
  height: 160px;
  overflow: hidden;
  border-radius: 10px;
}
.group-image {
  border-radius: 10px;
  transition: transform 0.3s ease;
}
.group-location {
  top: 10px;
  left: 10px;
  height: 25px;
  padding-top: 2px;
  padding-left: 10px;
  padding-right: 10px;
  color: #8280dd;
  background-color: white;
  border-radius: 10px;
  font-size: 14px;
}
.fa-calendar {
  margin-top: 2px;
}

.group-info {
  color: gray;
  font-size: 16px;
}

.member-count {
  margin-left: 5px;
}

.fa-users {
  margin-top: 3px;
  margin-left: 15px;
}
</style>
