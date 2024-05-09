<script setup>
import { deleteHotPlaceComment } from "@/api/hotplace";

const props = defineProps({
  hotPlaceId: String,
  comment: Object,
});

const emit = defineEmits(["reloadCommentList"]);

// 댓글을 삭제하는 함수
const deleteComment = () => {
  deleteHotPlaceComment(
    props.hotPlaceId,
    props.comment.id,
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
  <div class="card py-0 mt-3">
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
          ><i class="fa fa-pencil"></i><span class="card-text ml-1">수정</span></a
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
</template>

<style scoped>
.comment-delete,
.comment-edit {
  cursor: pointer;
}
</style>
