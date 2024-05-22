<script setup>
  import { ref, onMounted, defineEmits } from "vue";
  import { useRoute } from "vue-router";
  import { listWaitingRequest, acceptRequest, refuseRequest } from "@/api/group.js";

  const route = useRoute();

  const groupId = route.params.id;
  const groupRequests = ref([]);

  const emit = defineEmits(["refresh-members"]);

  // 대기중인 참가 신청들 가져오는 함수
  const getListWaitingRequest = () => {
    listWaitingRequest(
      groupId,
      ({ data }) => {
        groupRequests.value = data;
      },
      (error) => {
        console.log("Group 신청자 여부 확인 중 에러 발생!");
        console.dir(error);
      }
    );
  };

  // 참가 신청을 수락하는 함수
  const acceptRequestFunc = (memberId) => {
    acceptRequest(
      groupId,
      memberId,
      () => {
        getListWaitingRequest();
        emit("refresh-members");
        console.log("모임 참가 신청 수락!");
      },
      (error) => {
        console.log("모임 참가 신청 수락중 에러 발생!");
        console.dir(error);
      }
    );
  };

  // 참가 신청을 거절하는 함수
  const refuseRequestFunc = (memberId) => {
    refuseRequest(
      groupId,
      memberId,
      () => {
        getListWaitingRequest();
        console.log("모임 참가 신청 거절!");
      },
      (error) => {
        console.log("모임 참가 신청 거절중 에러 발생!");
        console.dir(error);
      }
    );
  };

  onMounted(() => {
    getListWaitingRequest();
  });
</script>

<template>
  <div class="requests" :class="{ 'center-content': !(groupRequests && groupRequests.length > 0) }">
    <template v-for="request in groupRequests" :key="request.id">
      <div class="row request">
        <div class="col-lg-9 member-info d-flex align-items-center">
          <img
            v-if="request.memberProfileImage !== null"
            :src="request.memberProfileImage"
            alt="Profile Image"
            class="profile-image"
          />
          <img v-else src="@/assets/images/profile.png" class="profile-image" />
          <div class="member-text">
            <h2 class="nickname">{{ request.memberNickname }}</h2>
            <p
              v-if="request.memberIntroduction !== null && request.memberIntroduction !== ''"
              class="introduction"
            >
              자기소개를 아직 작성하지 않았어요.
            </p>
            <p v-else class="introduction">{{ request.memberIntroduction }}</p>
          </div>
        </div>

        <div class="col-lg-3 request-btn d-flex flex-column justify-content-center">
          <button class="btn accept-btn mb-2" @click.prevent="acceptRequestFunc(request.memberId)">
            수락
          </button>
          <button class="btn refuse-btn" @click.prevent="refuseRequestFunc(request.memberId)">
            거절
          </button>
        </div>
      </div>
    </template>

    <div v-if="groupRequests === null || groupRequests.length === 0" class="empty-request">
      현재 모임 신청이 없습니다!
    </div>
  </div>
</template>

<style scoped>
  .requests {
    min-height: 500px;
    color: #333;
    padding: 20px;
  }

  .center-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .empty-request {
    color: #888;
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

  .member-info h2,
  .member-info p {
    font-size: 14px;
    color: #666;
  }

  .member-info h2 {
    color: #8280dd;
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
    background-color: #8280dd;
  }

  .accept-btn:hover {
    background-color: #6765af;
  }

  .refuse-btn {
    background-color: #8fa0da;
  }

  .refuse-btn:hover {
    background-color: #768dda;
  }
</style>
