<script setup>
import { ref, onMounted } from "vue";
import { editHotPlaceComment, deleteHotPlaceComment } from "@/api/hotplace";

const props = defineProps({
  hotPlaceId: String,
  commentItem: Object,
  memberId: Number
});

const emit = defineEmits(["reloadCommentList"]);

const isEditing = ref(false);
const comment = ref(props.commentItem);
const editedComment = ref(comment.value.content);
const isWriter = ref(false);


// 댓글 작성자인지 확인하는 함수
const checkIsWriter = () => {
  if (comment.value.writerId === props.memberId) {
    isWriter.value = true;
  }
}

// 댓글의 수정 상태 여부를 바꾸는 함수
const changeEditStatus = () => {
  isEditing.value = !isEditing.value;
}

// 댓글을 수정하는 함수
const editComment = () => {
  comment.value.content = editedComment.value;
  editHotPlaceComment(
    comment.value,
    () => {
      changeEditStatus();
    },
    (error) => {
      console.log("댓글 수정 중 에러 발생!", error);
    }
  )
}

// 댓글을 삭제하는 함수
const deleteComment = () => {
  deleteHotPlaceComment(
    props.hotPlaceId,
    props.commentItem.id,
    () => {
      emit("reloadCommentList");
    },
    (error) => {
      console.log("댓글 삭제 중 오류 발생!", error);
    }
  );
};

onMounted(() => {
  checkIsWriter();
})
</script>

<template>
  <div class="comment-card">
    <template v-if="!isEditing">
      <div class="comment-header">
        <img v-if="comment.writerProfileImage === null" src="@/assets/images/profile.png" alt="Profile" class="profile-img">
        <img v-else :src="comment.writerProfileImage" alt="" class="profile-img">
        <div class="comment-metadata">
          <span class="comment-writer">{{ comment.writerNickname }}</span>
          <span class="comment-date">{{ comment.createdAt }}</span>
        </div>
        <div class="comment-actions" v-if="checkIsWriter">
          <button @click="changeEditStatus" class="action-btn">
            <i class="fa fa-pencil"></i>
          </button>
          <button @click="deleteComment" class="action-btn">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
      <div class="comment-body">
        {{ comment.content }}
      </div>
    </template>
    <template v-else>
      <div class="comment-header">
        <img v-if="comment.writerProfileImage === null" src="@/assets/images/profile.png" alt="Profile" class="profile-img">
        <img v-else :src="comment.writerProfileImage" alt="" class="profile-img">
        <div class="comment-metadata">
          <span class="comment-writer">{{ comment.writerNickname }}</span>
          <span class="comment-date">{{ comment.createdAt }}</span>
        </div>
        <div class="comment-actions" v-if="checkIsWriter">
          <button @click="editComment" class="action-btn">
            <i class="fa fa-check"></i>
          </button>
          <button @click="changeEditStatus" class="action-btn">
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>
      <div class="comment-body">
        <input type="text" v-model="editedComment" class="form-control edit-input">
      </div>
    </template>
  </div>


  <div class="card mt-3"  v-if="isEditing == null">
    <div class="card-header bg-light">
      <i class="bi bi-pencil-square"></i>
      <span class="ml-2">댓글 수정</span>
    </div>
    <div class="card-body" id="editCommentCardBody">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <fieldset>
            <div class="cm_input">
              <p>
                <textarea
                  class="form-control"
                  id="commentContent"
                  name="commentContent"
                  v-model="comment.content"
                  rows="3"
                ></textarea>
              </p>
              <div class="d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-dark"
                  id="registCommentBtn"
                  @click.prevent="changeEditStatus"
                >
                  취소
                </button>
                <button
                  type="button"
                  class="btn btn-dark"
                  id="registCommentBtn"
                  @click.prevent="editComment"
                >
                  수정
                </button>
              </div>
            </div>
          </fieldset>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.comment-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.comment-metadata {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.comment-writer {
  font-weight: bold;
  color: #333;
}

.comment-date {
  font-size: 0.8rem;
  color: #666;
}

.comment-actions {
  display: flex;
  align-items: center;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #689beb; 
  font-size: 1rem;
  padding: 5px;
  margin-right: 15px; 
}

.comment-body {
  font-size: 0.9rem;
  color: #444;
  margin-top: 5px;
}

.fa-pencil, .fa-trash-can, .fa-check, .fa-times {
  width: 1px;
}

.edit-input {
  flex-grow: 1;
  margin-right: 10px;
  border: none;
  border-bottom: 1px solid #ccc; 
}
</style>
