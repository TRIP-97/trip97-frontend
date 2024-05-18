<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getWaitingByFriendGroupsForMember, acceptRequest, refuseRequest } from "@/api/group.js";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const route = useRoute();

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

const groupRequests = ref([]);

// 내 모임 신청들을 가져오는 함수
const getListWaitingRequest = () => {
  getWaitingByFriendGroupsForMember(
    userInfo.value.id,
    ({ data }) => {
      groupRequests.value = data;
      console.log(data);
    },
    (error) => {
      console.log("내 모임 신청 목록 조회 중 에러 발생!");
      console.dir(error);
    }
  );
}

// 참가 신청을 수락하는 함수
const acceptRequestFunc = (groupId) => {
  acceptRequest(
    groupId, userInfo.value.id,
    () => {
      getListWaitingRequest();
      console.log("모임 참가 신청 수락!");
    },
    (error) => {
      console.log("모임 참가 신청 수락중 에러 발생!");
      console.dir(error);
    }
  )
}

// 참가 신청을 거절하는 함수
const refuseRequestFunc = (groupId) => {
  refuseRequest(
    groupId, userInfo.value.id,
    () => {
      getListWaitingRequest();
      console.log("모임 참가 신청 거절!");
    },
    (error) => {
      console.log("모임 참가 신청 거절중 에러 발생!");
      console.dir(error);
    }
  )
}

onMounted(() => {
  getListWaitingRequest();
})

</script>

<template>
  <div class="requests" :class="{ 'center-content': !(groupRequests && groupRequests.length > 0) }">
    <template v-for="request in groupRequests" :key="request.requestId">
      <div class="row request">
        <div class="col-lg-9 member-info d-flex align-items-center">
          <img v-if="request.creatorProfileImage !== null" :src="request.creatorProfileImage" alt="Profile Image" class="profile-image">
          <img v-else src="@/assets/images/profile.png" class="profile-image" />
          <div class="member-text">
            <h2 class="nickname">{{ request.creatorNickname }}</h2>
            <p class="groupName">{{ request.groupName }}</p>
          </div>
        </div>

        <div class="col-lg-3 request-btn d-flex flex-column justify-content-center">
          <button class="btn accept-btn mb-2" @click.prevent="acceptRequestFunc(request.groupId)">수락</button>
          <button class="btn refuse-btn" @click.prevent="refuseRequestFunc(request.groupId)">거절</button>
        </div>
      </div>
    </template>

    <div v-if="groupRequests === null || groupRequests.length === 0" class="empty-request">
      내가 친구에게 받은 모임 신청이 없습니다!
    </div>
  </div>
</template>

<style scoped>
.requests {
  min-height: 500px;
  color: #333;
  padding: 20px;
  border: 1px solid rgb(201, 201, 201);
    border-radius: 10px;
    box-shadow: 5px 5px 5px #ebebeb;
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-request {
  color: #888;  /* 회색 텍스트 */
  font-size: 16px;
}

.request {
  background-color: aliceblue;
  margin: 10px;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}

.member-info {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  transform: translateY(-5px);
}

.member-text {
  transform: translateY(5px); 
}

.member-info h2, .member-info p {
  font-size: 14px;  
  color: #666;
}

.member-info h2 {
  color: #007BFF; 
  margin-bottom: 3px;
}

.btn {
  padding: 5px 10px;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.accept-btn {
  background-color: #ace0f9; 
}

.accept-btn:hover {
  background-color: #7ac0e5; 
}

.refuse-btn {
  background-color: #f9d6ac; 
}

.refuse-btn:hover {
  background-color: #e5b97a; 
}
</style>

