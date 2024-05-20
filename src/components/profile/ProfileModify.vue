<script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";
  import { updateMember } from "@/api/member";

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  const router = useRouter();

  const memberInfo = ref({
    id: userInfo.value.id,
    email: userInfo.value.email,
    nickname: userInfo.value.nickname,
    profileImage: userInfo.value.profileImage,
    introduction: userInfo.value.introduction,
    friendCode: userInfo.value.friendCode,
  });

  const fileDto = ref("");
  const previewImage = ref(userInfo.value.profileImage);

  const handleFile = (event) => {
    const files = event.target?.files;
    if (files && files.length > 0) {
      const file = files[0];
      fileDto.value = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const editMember = () => {
    const memberData = new FormData();
    const member = {
      id: memberInfo.value.id,
      email: memberInfo.value.email,
      nickname: memberInfo.value.nickname,
      introduction: memberInfo.value.introduction,
      friendCode: memberInfo.value.friendCode,
      profileImage: memberInfo.value.profileImage,
    };

    const memberDto = new Blob([JSON.stringify(member)], {
      type: "application/json",
    });

    memberData.append("member", memberDto);
    if (fileDto.value) {
      memberData.append("upfile", fileDto.value);
    }

    updateMember(
      sessionStorage.getItem("accessToken"),
      memberData,
      () => {
        console.log("멤버 정보 수정 성공!");
        router.replace({
          name: "profileDetail",
        });
      },
      (error) => {
        console.log("멤버 정보 수정 중 에러 발생!");
        console.dir(error);
      }
    );
  };
</script>

<template>
  <div class="member-info-container">
    <div class="member-info">
      <img class="member-profile-image" :src="previewImage" alt="" />
      <div>
        <label for="nickname">닉네임</label>
        <input id="nickname" v-model="memberInfo.nickname" type="text" />
      </div>
      <div>
        <label for="introduction">자기소개</label>
        <textarea id="introduction" v-model="memberInfo.introduction"></textarea>
      </div>
      <div>
        <label for="file-upload">프로필 이미지</label>
        <input class="file-upload-btn" id="file-upload" type="file" @change="handleFile" />
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

  .member-info div {
    margin-bottom: 15px;
    text-align: left;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .file-upload-btn {
    display: block;
    margin-top: 10px;
  }

  .edit-button {
    background-color: rgb(199, 162, 231);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .edit-button:hover {
    background-color: rgb(172, 119, 218);
  }
</style>
