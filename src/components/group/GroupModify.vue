<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailGroup, modifyGroup } from "@/api/group";

const route = useRoute();
const router = useRouter();

const groupId = ref(route.params.id);
const group = ref("");
// 그룹 게시글 조회
function getGroup() {
  detailGroup(
    groupId.value,
    (response) => {
      group.value = response.data;
      group.value.startDate = formatVisitedDate(group.value.startDate);
      group.value.endDate = formatVisitedDate(group.value.endDate);
      console.log(group.value);
    },
    (error) => {
      console.log("Group 게시글 불러오는 중 에러 발생!");
      console.dir(error);
    }
  );
}

// 날짜 포맷 변경 함수
function formatVisitedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

// 그룹 게시글 수정
const updateGroup = async () => {
  const response = modifyGroup(
    group.value,
    () => {
      router.replace({
        name: "groupDetail",
        params: { id: group.value.id },
      });
    },
    (error) => {
      console.log("게시글 수정 중 에러 발생:", error);
    }
  );
};

onMounted(() => {
  getGroup();
})
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
                                    v-model="group.name"
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
                                    :value="group.creatorNickname"
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
                                    v-model="group.location"
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
                                    v-model="group.maxMemberCount"
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
                                        v-model="group.startDate"
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
                                        v-model="group.endDate"
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
                                    v-model="group.overview"
                                    required
                                    >
                                    {{ group.overview }}
                                  </textarea>
                                </div>
                                <input class="file-upload-btn" type="file" multiple @change="handleFiles">
                                
                                <div class="text-right">
                                    <button @click.prevent="updateGroup" class="btn btn-primary btn-block write-btn">
                                    수정하기
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div class="col-lg-5 image-area border border-secondary">
                            <div class="row-md-5 side-image-area">
                                <img src="@/assets/images/groupModifyFormImage.jpg" class="side-image" alt="">
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
    width: 130%;
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
}
</style>