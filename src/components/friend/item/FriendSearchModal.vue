<script setup>
  import { ref } from "vue";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";
  import { sendFriendRequest, isMemberInFriendships } from "@/api/friend";
  import { getMemberByFriendCode } from "@/api/member";

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  const props = defineProps({
    isActive: Boolean,
  });

  const emit = defineEmits(["close"]);

  const params = ref({
    toUserId: "",
    fromUserId: userInfo.value.id,
  });
  const friendCode = ref("");
  const findMember = ref("");

  const searchMemberByFriendCode = () => {
    getMemberByFriendCode(
      {
        friendCode: friendCode.value,
      },
      ({ data }) => {
        findMember.value = data;
        params.value.toUserId = findMember.value.id;
        console.log(findMember.value);
      },
      (error) => {
        console.log("친구 코드로 멤버 검색중 오류 발생!");
        console.dir(error);
      }
    );
  };

  const sendRequest = () => {
    isMemberInFriendships(
      userInfo.value.id,
      ({ data }) => {
        if (data) {
          window.alert("이미 친구 요청을 했거나 받았습니다!");
          return;
        }

        sendFriendRequest(
          params.value,
          () => {
            window.alert("친구 요청 성공!");
            console.log("친구 요청 보내기 성공!");
          },
          (error) => {
            console.log("친구 요청 보내는 중 에러 발생!");
            console.dir(error);
          }
        );
      },
      (error) => {
        console.log("친구 요청 여부 확인 중 에러 발생!");
        console.dir(error);
      }
    );
  };

  const closeModal = () => {
    emit("close");
  };
</script>
<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="title text-center">친구 찾기</h3>
        <form class="field" @submit.prevent="searchMemberByFriendCode">
          <label class="label">친구 코드</label>
          <div class="control is-flex">
            <input class="input" type="text" v-model="friendCode" />
            <button class="btn btn-primary search-button">검색</button>
          </div>
        </form>

        <div class="search-result">
          <p class="empty-result text-center" v-if="findMember === ''">검색 결과가 없습니다!</p>
          <div v-else class="find-member-info">
            <img
              v-if="findMember.profileImage"
              :src="findMember.profileImage"
              alt=""
              class="profile-image"
            />
            <img v-else src="@/assets/images/profile.png" class="profile-image" />
            <p class="nickname">{{ findMember.nickname }}</p>
            <button class="btn btn-primary send-request-button" @click.prevent="sendRequest">
              친구 신청
            </button>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control-btn">
            <button class="button is-light close-btn" @click="closeModal">닫기</button>
          </div>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" @click="closeModal" aria-label="close"></button>
  </div>
</template>

<style scoped>
  .modal.is-active {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    z-index: 1001;
  }

  .box {
    padding: 20px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .field {
    margin-bottom: 15px;
  }

  .field .label {
    font-weight: bold;
  }

  .field .control {
    box-shadow: 3px 3px 3px #e6e6e6;
  }

  .field .control.is-flex {
    display: flex;
  }

  .field .control .input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
  }

  .search-button {
    padding: 10px 20px;
    background-color: #a0d8ef; /* 파스텔톤 하늘색 */
    border-radius: 0 4px 4px 0;
    border: 1px solid #ddd;
  }

  .search-result {
    display: flex;
    align-items: center;
    justify-content: center; /* 가로 중심 정렬 */
    min-height: 100px;
    border: 1px solid rgb(187, 187, 187);
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 3px 3px 3px #e6e6e6;
  }

  .empty-result {
    color: gray;
    margin: 30px 0px;
  }

  .find-member-info {
    display: flex;
    align-items: center; /* 세로 중심 정렬 */
    background-color: #f5f5f5; /* 부드러운 회색 */
    padding: 10px;
    border-radius: 10px;
    width: calc(100% - 30px);
    margin: 0 10px; /* 좌우 마진 추가 */
  }

  .profile-image {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .nickname {
    flex-grow: 1;
    margin: 0;
  }

  .send-request-button {
    margin-left: auto;
    background-color: #4285cc;
    color: white;
    border-radius: 15px;
  }

  .field.is-grouped {
    display: flex;
    justify-content: flex-end;
  }

  .button {
    padding: 10px 20px;
  }

  .button.is-light {
    background-color: #c2c2c2;
    color: #333;
    border: 1px solid rgb(189, 189, 189);
    border-radius: 15px;
    box-shadow: 3px 3px 3px #e6e6e6;
  }
</style>
