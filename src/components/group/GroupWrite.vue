<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { registGroup } from "@/api/group";
  import { useMemberStore } from "@/stores/member";
  import { storeToRefs } from "pinia";

  const router = useRouter();

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  const creatorId = ref("");
  const name = ref("");
  const nickname = ref("");
  const location = ref("");
  const maxMemberCount = ref("");
  const startDate = ref("");
  const endDate = ref("");
  const overview = ref("");
  const files = ref([]);
  const token = ref("");

  const handleFiles = (event) => {
    files.value = event.target.files;
  };

  // 모임 글을 작성하는 함수
  const createGroup = async () => {
    const groupData = new FormData();
    const group = {
      name: name.value,
      creatorId: creatorId.value,
      location: location.value,
      maxMemberCount: maxMemberCount.value,
      startDate: startDate.value,
      endDate: endDate.value,
      overview: overview.value,
    };

    const groupDto = new Blob([JSON.stringify(group)], {
      type: "application/json",
    });

    groupData.append("group", groupDto);

    for (let i = 0; i < files.value.length; i++) {
      groupData.append("upfile", files.value[i]);
    }

    try {
      token.value = sessionStorage.getItem("accessToken");
      const response = await registGroup(token.value, groupData);
      if (response.status === 201) {
        router.replace({
          name: "groupDetail",
          params: { id: response.data.id },
        });
      }
    } catch (error) {
      console.error("모임 글 등록 실패:", error);
    }
  };

  onMounted(() => {
    creatorId.value = userInfo.value.id;
    nickname.value = userInfo.value.nickname;
  });
</script>

<template>
  <div>
    <div>
      <main>
        <div class="container">
          <div class="row mt-5 justify-content-center">
            <div class="col-lg-5">
              <form>
                <div class="form-group">
                  <label for="name">모임명</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    name="name"
                    v-model="name"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="creator">모임장</label>
                  <input
                    type="text"
                    class="form-control"
                    id="creator"
                    name="creator"
                    :value="nickname"
                    readonly
                  />
                </div>
                <div class="form-group">
                  <label for="location">모임 지역</label>
                  <input
                    type="text"
                    class="form-control"
                    id="location"
                    name="location"
                    v-model="location"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="maxMemberCount">최대 인원수</label>
                  <input
                    type="number"
                    class="form-control"
                    id="maxMemberCount"
                    name="maxMemberCount"
                    min="1"
                    max="100"
                    v-model="maxMemberCount"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-heading">모임 날짜</label>
                  <div class="date-field">
                    <label for="startDate">시작일</label>
                    <input
                      type="date"
                      class="form-control"
                      id="startDate"
                      name="startDate"
                      v-model="startDate"
                      required
                    />
                  </div>
                  <div class="date-field">
                    <label for="endDate">종료일</label>
                    <input
                      type="date"
                      class="form-control"
                      id="endDate"
                      name="endDate"
                      v-model="endDate"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="overview">상세 설명</label>
                  <textarea
                    class="form-control"
                    id="overview"
                    name="overview"
                    rows="5"
                    v-model="overview"
                    required
                  ></textarea>
                </div>
                <input class="file-upload-btn" type="file" multiple @change="handleFiles" />

                <div class="text-right">
                  <button @click.prevent="createGroup" class="btn btn-primary btn-block write-btn">
                    등록
                  </button>
                </div>
              </form>
            </div>

            <div class="col-lg-5 image-area border border-secondary">
              <div class="row-md-5 side-image-area">
                <img src="@/assets/images/groupWriteFormImage.jpg" class="side-image" alt="" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
  .image-area {
    margin-right: 30px;
    border-radius: 15px;
    box-shadow: 2px 2px 2px 2px rgba(200, 200, 200, 0.8);
    background-color: rgb(255, 255, 255, 0.6);
  }

  .side-image-area {
    width: auto;
    height: 790px;
    margin-top: 15px;
    border-radius: 10px;
    overflow: hidden;
  }

  .side-image {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .form-heading,
  label {
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #f8f9fa;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .date-field {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .date-field label {
    margin-right: 10px;
    white-space: nowrap;
  }

  .form-control {
    flex-grow: 1;
  }

  .file-upload-btn {
    margin-top: 10px;
  }

  .write-btn {
    margin-top: 10px;
    background-color: #8280dd;
    border: 1px solid #8280dd;
    color: white;
  }
</style>
