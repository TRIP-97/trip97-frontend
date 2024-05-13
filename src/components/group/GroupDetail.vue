<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
    detailGroup,
    deleteGroup,
} from "@/api/group";
import { getMemberProfile } from "@/api/member";

const route = useRoute();
const router = useRouter();

const groupId = ref(route.params.id);
const group = ref("");
const token = ref("");
const memberId = ref("");
const isWriter = ref(false);

// 게시글 작성자인지 확인하는 함수
const checkIsWriter = () => {
  if (group.value.creatorId === memberId.value) {
    isWriter.value = true;
  }
};

// rmfnq 게시글 조회하는 함수
async function getGroup() {
    detailGroup(
        groupId.value,
    (response) => {
        group.value = response.data;
      console.log("Group 게시글 로딩 성공!", group.value);

      group.value.startDate = formatVisitedDate(group.value.startDate);
      group.value.endDate = formatVisitedDate(group.value.endDate);
    },
    (error) => {
      console.log("HotPlace 게시글 불러오는 중 에러 발생!");
      console.dir(error);
    }
  );
}

// 날짜 포맷 변경 함수
function formatVisitedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

// 사용자 정보 가져오는 함수
const fetchProfile = async () => {
  token.value = localStorage.getItem("accessToken");
  if (token.value) {
    try {
      const response = await getMemberProfile(token.value);

      if (response.data) {
        memberId.value = response.data.id;
        checkIsWriter();
      }
    } catch (error) {
      console.error("프로필 정보 조회 실패:", error);
    }
  }
};

// 그룹 목록으로 이동하는 함수
function goGroupList() {
  router.push({ name: "groupList" });
}

// 그룹 수정 화면으로 이동하는 함수
function goGroupModify() {
  router.push({
    name: "groupModify",
    params: { id: group.value.id },
  });
}

// 그룹 삭제하는 함수
function removeGroup() {
  deleteGroup(
    groupId.value,
    () => {
      router.replace({
        name: "groupList",
      });
    },
    (error) => {
      console.log("Group 게시글 삭제하는 중 에러 발생!");
      console.dir(error);
    }
  );
}

onMounted(() => {
  getGroup();
  fetchProfile();
});

</script>

<template>
    <div class="container">
    <div class="row justify-content-center">
      <div class="col-sm-11">
        <div class="row">
          <div class="col-lg-8 mt-4">
            <h3 class="title">{{ group.name }}</h3>
            <div class="d-flex justify-content-end mt-3 my-2 info-text">
              <span class="date-text">작성일: {{ group.createdDate }}</span>
            </div>
            <div class="d-flex justify-content-end mt-3 my-2" v-if="isWriter">
              <div class="edit-actions">
                <span class="action-text" @click="goGroupModify">수정</span>
                <div class="custom-vr mx-2"></div>
                <span class="action-text" @click="removeGroup">삭제</span>
              </div>
            </div>

            <p class="schedule-label mb-2">모임 일정</p>
            <div class="schedule-box my-3">
              <strong> <i class="travel-date-icon fa-solid fa-calendar"></i></strong>
              {{ group.startDate }} ~ {{ group.endDate }}
              <br />
              <br />
              <strong><i class="fa-solid fa-location-dot"></i></strong> {{ group.location }}
            </div>
            <div class="my-2">
              <p class="content-label mb-4">모임 소개</p>
              <strong class="content">{{ group.overview }}</strong>
            </div>

            <div class="col-lg-8 mx-auto image-list" v-if="group.fileInfos">
              <v-carousel style="height: 300px">
                <v-carousel-item
                  v-for="fileInfo in group.fileInfos"
                  :key="fileInfo.id"
                  :src="fileInfo.url"
                />
              </v-carousel>
            </div>

            <div class="list-button-section mt-5">
              <hr class="mt-3" />
              <button class="btn btn-primary list-btn" @click="goGroupList">목록으로</button>
            </div>
          </div>

          <div class="col-lg-3 offset-lg-1">
            <h5 class="traveler-info-label mb-2">모임장</h5>
            <div class="author-info-box my-3">
              <div class="d-flex align-items-center mb-1">
                <img
                  v-if="group.creatorProfileImage === null"
                  src="@/assets/images/profile.png"
                  alt="Author"
                  class="img-fluid rounded-circle mr-3"
                  style="width: 40px; height: 40px"
                />
                <p class="writer-nickname">{{ group.creatorNickname }}</p>
              </div>
              <p v-if="group.creatorIntroduction === null" class="writer-introduction">
                {{ "자기소개를 아직 작성하지 않았어요." }}
              </p>
            </div>
            

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.container {
  max-width: 1200px;
}

.title,
.schedule-label,
.content-label {
  font-family: NanumSquareRoundExtraBold;
}

.schedule-label,
.content-label {
  font-size: 20px;
  margin-top: 50px;
}

.content {
  color: #3e4143;
}

.info-text {
  font-size: 0.9rem; 
  color: #6c757d; 
}

.custom-vr {
  display: inline;
  border-left: 1px solid lightgray;
  align-self: center;
}

.stat-text {
  margin-right: 5px; 
}

.date-text {
  text-align: right; 
}

.edit-actions {
  color: #6c757d;
  font-size: 0.8rem; 
}

.action-text {
  cursor: pointer;
}

.schedule-box {
  color: gray;
  background-color: #f8f9fa; 
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.image-list {
  margin-top: 50px;
  margin-bottom: 50px;
}

.list-button-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.list-button-section .btn-primary {
  background-color: #689beb; 
  border-color: #689beb; 
  color: white;
}

hr {
  width: 100%;
  border: 0;
  height: 1px;
  background-color: #575555; 
  margin-top: 5px;
}

.input-group .form-control {
  border-right: 0;
  font-size: 13px;
}

.input-group .input-group-append .btn {
  background-color: transparent;
  color: #00bfff; 
  border: 0;
}

.input-group {
  border: 1px solid #ccc;
  border-radius: 5px;
}

.traveler-info-label {
  font-family: NanumSquareRoundExtraBold;
  font-size: 19px;
  color: #333;
  margin-top: 50px;
}

.author-info-box {
  background-color: #f1f1f1; 
  padding: 1px 15px 1px 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

img.rounded-circle {
  margin-right: 15px;
}

.writer-nickname {
  font-family: NanumSquareRound;
  margin-top: 13px;
  font-size: 16px;
}

.writer-introduction {
  font-family: NanumSquareRound;
  font-size: 13px;
  color: gray;
}

</style>