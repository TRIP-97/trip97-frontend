<script setup>
import { ref } from "vue";
import { editHotPlaceComment, deleteHotPlaceComment } from "@/api/hotplace";

const props = defineProps({
  hotPlaceId: String,
  commentItem: Object,
});

const emit = defineEmits(["reloadCommentList"]);

const isEditing = ref(false);
const comment = ref(props.commentItem);

// 댓글의 수정 상태 여부를 바꾸는 함수
const changeEditStatus = () => {
  isEditing.value = !isEditing.value;
}

// 댓글을 수정하는 함수
const editComment = () => {
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
</script>

<template>
  <div class="card py-0 mt-3" v-if="!isEditing">
    <div class="card-header bg-light d-flex justify-content-between align-items-center">
      <div class="comment-author-info pt-1">
        <img
          class="img-fluid float-left mr-1 profile-img"
          src="@/assets/images/profile.png"
          width="30"
          height="30"
        />
        <span class="comment-writer"
          ><span class="card-text">{{ comment.writerNickname }}</span></span
        >
      </div>
      <div class="comment-info">
        <span class="date" id="commentDate">{{ comment.createdAt }}</span>
        <a class="comment-edit ml-2"
          ><i class="fa fa-pencil"></i><span class="card-text ml-1" @click="changeEditStatus">수정</span></a
        >
        <a class="comment-delete ml-2" id="commentDeleteBtn">
          <i class="fa-solid fa-trash-can"></i>
          <span class="card-text ml-1" @click="deleteComment">삭제</span>
        </a>
      </div>
    </div>
    <div class="card-body">
      <span class="comment-content"
        ><span class="card-text">{{ comment.content }}</span></span
      >
    </div>
  </div>
  <div class="card mt-3"  v-if="isEditing">
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
.comment-delete,
.comment-edit {
  cursor: pointer;
}
</style>
