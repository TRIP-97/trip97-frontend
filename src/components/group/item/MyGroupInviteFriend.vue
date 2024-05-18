<script setup>
  import { ref, onMounted } from "vue";
  import { listFriend } from "@/api/friend";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";
  import InviteFriendItem from "@/components/group/item/InviteFriendItem.vue";

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  const friends = ref([]);

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

  onMounted(() => {
    getFriendList();
  });
</script>

<template>
  <div class="friends" :class="{ 'center-content': !(friends && friends.length > 0) }">
    <div v-if="friends === null || friends.length === 0" class="empty-friends">
      현재 친구가 없습니다!
    </div>
    <div v-else class="row">
      <template v-for="friend in friends" :key="friend.memberId">
        <InviteFriendItem :friend="friend" />
      </template>
    </div>
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
</style>