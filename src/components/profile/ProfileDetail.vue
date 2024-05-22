<script setup>
  import { useRouter } from "vue-router";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";

  const router = useRouter();

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  console.log(userInfo.value);

  const editMember = () => {
    router.push({
      name: "profileModify",
    });
  };
</script>

<template>
  <div class="member-info-container">
    <div class="member-info">
      <img
        v-if="userInfo.profileImage === null"
        class="member-profile-image"
        src="@/assets/images/profile.png"
        alt=""
      />
      <img v-else class="member-profile-image" :src="userInfo.profileImage" alt="" />
      <div class="member-details">
        <div><strong>닉네임:</strong> {{ userInfo.nickname }}</div>
        <div><strong>이메일:</strong> {{ userInfo.email }}</div>
        <div v-if="userInfo.introduction !== null && userInfo.introduction !== ''">
          <strong>자기소개:</strong> {{ userInfo.introduction }}
        </div>
        <div v-else><strong>자기소개:</strong> 아직 자기소개가 없어요!</div>
        <div><strong>친구 코드:</strong> {{ userInfo.friendCode }}</div>
      </div>
      <button class="edit-button" @click="editMember">정보 수정</button>
    </div>
  </div>
</template>

<style scoped>
  .member-info-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
  }

  .member-info {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 300px;
  }

  .member-profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
  }

  .member-details {
    text-align: left; /* 텍스트를 왼쪽 정렬 */
    margin-top: 10px;
  }

  .member-details div {
    margin-bottom: 10px;
  }

  .edit-button {
    background-color: #8280dd;
    color: white;
    border: none;
    padding: 8px 16px; /* 버튼 크기를 약간 줄임 */
    font-size: 14px; /* 글씨 크기를 약간 줄임 */
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 20px; /* 위쪽 마진을 추가 */
  }

  .edit-button:hover {
    background-color: #6968b3;
  }
</style>
