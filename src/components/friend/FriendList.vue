<script setup>
  import { ref, onMounted } from "vue";
  import { listFriend } from "@/api/friend";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";
  import FriendListItem from "./item/FriendListItem.vue";
  import FriendSearchModal from "./item/FriendSearchModal.vue";

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  const friends = ref([]);
  const isModalActive = ref(false);

  // 친구 목록을 조회하는 함수
  const getFriendList = () => {
    listFriend(
      userInfo.value.id,
      ({ data }) => {
        friends.value = data;
        console.log(data);
      },
      (error) => {
        console.log("친구 목록 불러오는 중 에러 발생!");
        console.dir(error);
      }
    );
  };

  // 친구 검색 모달창을 활성화시키는 함수
  const searchFriend = () => {
    isModalActive.value = true;
  };

  onMounted(() => {
    getFriendList();
  });
</script>

<template>
  <div class="friends" :class="{ 'center-content': !(friends && friends.length > 0) }">
    <div class="header">
      <button class="add-friend-btn" @click="searchFriend">친구 검색</button>
    </div>
    <div v-if="friends === null || friends.length === 0" class="empty-friends">
      현재 친구가 없습니다!
    </div>
    <div v-else class="row">
      <template v-for="friend in friends" :key="friend.memberId">
        <FriendListItem :friend="friend" @refresh-friends="getFriendList" />
      </template>
    </div>
    <FriendSearchModal :isActive="isModalActive" @close="isModalActive = false" />
  </div>
</template>

<style scoped>
  .friends {
    min-height: 500px;
    color: #333;
    padding: 20px;
    border: 1px solid rgb(201, 201, 201);
    border-radius: 10px;
    box-shadow: 5px 5px 5px #e6e6e6;
  }

  .center-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .empty-friends {
    color: #888;
    font-size: 16px;
  }

  .header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  .add-friend-btn {
    background-color: #88a8c9;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease, color 0.3s ease;
    margin-top: 20px;
    margin-right: 30px;
    box-shadow: 5px 5px 5px #e6e6e6;
  }

  .add-friend-btn:hover {
    background-color: #6986a3;
    color: white;
  }
</style>
