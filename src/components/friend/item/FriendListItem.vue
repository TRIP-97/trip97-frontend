<script setup>
import { ref } from "vue";
import { deleteFriend } from "@/api/friend";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

const props = defineProps({
  friend: Object,
});

const emit = defineEmits(["refresh-friends"]);

const friend = ref(props.friend);
const showDropdown = ref(false);

// 친구 삭제 드롭다운 여부를 바꾸는 함수
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// 친구를 삭제하는 함수
const removeFriend = (toMemberId) => {
  console.log(friend.value);
  deleteFriend(
    {
      id: toMemberId,
      fromId: userInfo.value.id,
    },
    () => {
      emit("refresh-friends");
      console.log("친구 삭제 성공!");
    },
    (error) => {
      console.log("친구 삭제중 에러 발생!");
      console.dir(error);
    }
  );
};
</script>

<template>
  <div class="col-lg-5 friend-card">
    <div class="friend-header-container">
      <div class="friend-image">
        <img
          v-if="friend.profileImage === null"
          src="@/assets/images/profile.png"
          class="profile_image"
        />
        <img v-else :src="friend.profileImage" class="profile_image" />
      </div>
      <div class="friend-header">
        <h3 class="text-center">{{ friend.nickname }}</h3>
      </div>
      <div class="dropdown-container">
        <i class="fa-solid fa-ellipsis-vertical" @click="toggleDropdown"></i>
        <div class="dropdown" v-if="showDropdown">
          <button @click="removeFriend(friend.memberId)">삭제</button>
        </div>
      </div>
    </div>
    <div class="friend-introduction">
      <p v-if="friend.introduction !== null && friend.introduction !== ''">
        자기소개를 아직 작성하지 않았어요
      </p>
      <p v-else>{{ friend.introduction }}</p>
    </div>
  </div>
</template>

<style scoped>
.friend-card {
  background-color: #d5e7f1;
  border: 1px solid #8280dd;
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
  color: #8280dd;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
}

.profile_image {
  border-radius: 50%;
  width: 60px;
  height: 60px;
}

.dropdown-container {
  position: relative;
  margin-top: -15px;
  margin-left: 10px;
}

.fa-ellipsis-vertical {
  cursor: pointer;
  color: #5f5f5f;
  margin-top: 15px;
}

.dropdown {
  position: absolute;
  top: 33px;
  right: 0;
  width: 50px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown button {
  background: none;
  border: none;
  padding: 10px 0px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: #333;
  margin-left: 9px;
}

.dropdown button:hover {
  background-color: #f5f5f5;
}

.friend-introduction {
  margin-top: 10px;
  font-size: 14px;
}

.default-message {
  color: #b1eac8;
}
</style>
