<script setup>
  import { ref, onMounted } from "vue";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";
  import { getWaitingFriendShips, approveFriendship, refuseFriendship } from "@/api/friend.js";

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  const friendRequests = ref([]);

  // 대기중인 친구 신청들 가져오는 함수
  const getListWaitingRequest = () => {
    getWaitingFriendShips(
      {
        memberId: userInfo.value.id,
      },
      ({ data }) => {
        friendRequests.value = data;
      },
      (error) => {
        console.log("친구 신청 목록 확인 중 에러 발생!");
        console.dir(error);
      }
    );
  };

  // 참가 신청을 수락하는 함수
  const acceptRequestFunc = (requestId) => {
    approveFriendship(
      requestId,
      () => {
        getListWaitingRequest();
        console.log("친구 신청 수락!");
      },
      (error) => {
        console.log("친구 신청 수락중 에러 발생!");
        console.dir(error);
      }
    );
  };

  // 참가 신청을 거절하는 함수
  const refuseRequestFunc = (requestId) => {
    refuseFriendship(
      requestId,
      () => {
        getListWaitingRequest();
        console.log("친구 신청 거절!");
      },
      (error) => {
        console.log("친구 신청 거절중 에러 발생!");
        console.dir(error);
      }
    );
  };

  onMounted(() => {
    getListWaitingRequest();
  });
</script>

<template>
  <div
    class="requests"
    :class="{ 'center-content': !(friendRequests && friendRequests.length > 0) }"
  >
    <template v-for="friendRequest in friendRequests" :key="friendRequest.id">
      <div class="row request">
        <div class="col-lg-9 member-info d-flex align-items-center">
          <img
            v-if="friendRequest.friendProfileImage !== null"
            :src="friendRequest.friendProfileImage"
            alt="Profile Image"
            class="profile-image"
          />
          <img v-else src="@/assets/images/profile.png" class="profile-image" />
          <div class="member-text">
            <h2 class="nickname">{{ friendRequest.friendNickname }}</h2>
            <p v-if="friendRequest.friendIntroduction === null" class="introduction">
              자기소개를 아직 작성하지 않았어요.
            </p>
            <p v-else class="introduction">{{ friendRequest.friendIntroduction }}</p>
          </div>
        </div>

        <div class="col-lg-3 request-btn d-flex flex-column justify-content-center">
          <button
            class="btn accept-btn mb-2"
            @click.prevent="acceptRequestFunc(friendRequest.friendshipId)"
          >
            수락
          </button>
          <button
            class="btn refuse-btn"
            @click.prevent="refuseRequestFunc(friendRequest.friendshipId)"
          >
            거절
          </button>
        </div>
      </div>
    </template>

    <div v-if="friendRequests === null || friendRequests.length === 0" class="empty-request">
      현재 받은 친구 신청이 없습니다!
    </div>
  </div>
</template>

<style scoped>
  .requests {
    min-height: 500px;
    color: #333;
    padding: 20px;
    border: 1px solid rgb(201, 201, 201);
    padding: 10px;
    border-radius: 10px;
    box-shadow: 5px 5px 5px #ebebeb;
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
    color: #007bff;
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
