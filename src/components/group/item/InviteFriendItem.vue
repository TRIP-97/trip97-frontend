<script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { inviteGroupMember, checkGroupMember } from "@/api/group";

  const route = useRoute();

  const props = defineProps({
    friend: Object,
  });

  const emit = defineEmits(['refresh-friends']);

  const groupId = ref(route.params.id);
  const friend = ref(props.friend);
  const isAlreadyGroupMember = ref(false);

  // 친구를 모임에 초대하는 함수
  const inviteFriend = () => {
    if (isAlreadyGroupMember) {
      window.alert("이미 친구를 모임에 초대했어요!")
      return;
    }
    inviteGroupMember(
      {
        groupId: groupId.value,
        memberId: friend.value.memberId
      },
      () => {
        emit('refresh-friends');
        window.alert("친구를 모임에 초대했어요!");
        console.log("모임에 친구 초대 성공!");
      },
      (error) => {
        console.log("모임에 친구 초대중 에러 발생!");
        console.dir(error);
      }
    )
  }

  // 친구가 모임 멤버이거나 참가 신청을 받은 상태인지 확인하는 함수
  const checkGroupMemberOrInvited = () => {
    checkGroupMember(
      {
        groupId: groupId.value,
        memberId: friend.value.memberId
      },
      ({ data }) => {
        if (data) {
          isAlreadyGroupMember.value = true;
        }
      },
      (error) => {
        console.log("친구가 모임 멤버이거나 이미 신청했는지 여부를 확인하는 중 에러 발생!");
        console.dir(error);
      }
    )
  }

  onMounted(() => {
    checkGroupMemberOrInvited();
  })
  
</script>

<template>
  <div class="col-lg-5 friend-card">
    <div class="friend-header-container">
      <div class="friend-image">
        <img
          v-if="friend.profileImage === null"
          src="@/assets/images/profile.png"
          style="width: 60px"
        />
        <img v-else :src="friend.profileImage" style="width: 60px" />
      </div>
      <div class="friend-header">
        <h3 class="text-center">{{ friend.nickname }}</h3>
      </div>
      <button v-if="!isAlreadyGroupMember" class="invite-btn" @click.prevent="inviteFriend">초대</button>
    </div>
    <div class="friend-introduction">
      <p v-if="friend.introduction === null">자기소개를 아직 작성하지 않았어요</p>
      <p v-else>{{ friend.introduction }}</p>
    </div>
  </div>
</template>

<style scoped>
  .friend-card {
    background-color: #d5e7f1;
    border: 1px solid #6bb7d5;
    border-radius: 15px;
    color: rgb(65, 65, 65);
    text-align: center;
    padding-top: 10px;
    margin: 20px;
    margin-left: 50px;
    box-shadow: 5px 5px 5px #e6e6e6;
  }

  .friend-header-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
  }

  .friend-header {
    text-align: left;
    flex-grow: 1;
    margin-top: 20px;
  }

  .friend-header h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .friend-header p {
    font-size: 14px;
    margin: 5px 0;
  }

  .friend-image {
    background-color: white;
    color: #6bd5b3;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
  }

  .friend-introduction {
    margin-top: 10px;
    font-size: 14px;
  }

  .invite-btn {
    background-color: #a7c7e7;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease, color 0.3s ease;
    margin-top: 25px;
  }

  .invite-btn:hover {
    background-color: #90b6db;
    color: white;
  }

  .default-message {
    color: #b1eac8;
  }
</style>
