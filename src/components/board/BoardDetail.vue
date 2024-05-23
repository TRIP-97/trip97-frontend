<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  detailBoard,
  deleteBoard,
  getBoardComment,
  registBoardComment,
  updateBoardComment,
  deleteBoardComment,
} from "@/api/board.js";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

import axios from "axios";

const route = useRoute();
const router = useRouter();
const board = ref("");

const no = route.params.id;

const editor = useEditor({
  extensions: [
    StarterKit,
    Image.extend({
      addAttributes() {
        return {
          src: {},
          alt: {},
          title: {},
          width: {
            default: "auto",
          },
          height: {
            default: "auto",
          },
        };
      },
    }),
  ],
  content: "",
  editable: false, // 읽기 전용 모드로 설정
});

async function getBoard() {
  detailBoard(
    no,
    (response) => {
      board.value = response.data;

      // JSON 형태의 콘텐츠를 TipTap 에디터에 설정
      if (board.value.content) {
        const content = JSON.parse(board.value.content);

        // 이미지 경로를 웹 접근 가능한 URL로 변환
        convertLocalImagePaths(content);
        editor.value.commands.setContent(content);
      }

      board.value.createdAt = formatVisitedDate(board.value.createdAt);
    },
    (error) => {
      console.log("Board 불러오는 중 에러 발생");
      console.dir(error);
    }
  );
}

const loading = ref(true); // 로딩 상태 변수 추가

const comments = ref([]);
const comment = ref({
  id: null,
  boardId: no,
  writerId: userInfo.value.id,
  content: "",
  writerNickname: userInfo.value.nickname,
  writerProfileImage: userInfo.value.profileImage,
});
const editCommentInfo = ref({
  id: null,
  boardId: no,
  writerId: userInfo.value.id,
  content: "",
  writerNickname: userInfo.value.nickname,
  writerProfileImage: userInfo.value.profileImage,
});

// 댓글 불러오기
async function getComment() {
  loading.value = true;
  console.log("들어오긴함?");
  getBoardComment(
    no,
    (response) => {
      comments.value = response.data;
      console.log("댓글들", comments.value);
      loading.value = false;
    },
    (error) => {
      console.log(error);
    }
  );
}

async function editComment() {
  updateBoardComment(
    sessionStorage.getItem("accessToken"),
    editCommentInfo.value,
    () => {
      getComment();
    },
    (error) => {}
  );
}

async function deleteComment() {
  await deleteBoardComment(
    sessionStorage.getItem("accessToken"),
    no,
    comment.value.id,
    () => {
      getComment();
    },
    (error) => {}
  );
}

function writeComment() {
  console.log("댓글정보 ", comment.value);
  registBoardComment(
    sessionStorage.getItem("accessToken"),
    comment.value,
    () => {
      getComment();
    },
    (error) => {}
  );
  comment.value.content = ""; // 입력 필드 초기화
}

const state = ref("state");

async function writeCommentClick() {
  await writeComment();
}

function editOpenCommentClick(id) {
  state.value = `editing${id}`;
  editCommentInfo.value.content = comments.value.find((c) => c.id === id).content;
}

async function editCommentClick(id) {
  editCommentInfo.value.id = id;
  await editComment();
  state.value = "state"; // 상태를 초기화
  await getComment();
}

async function deleteCommentClick(id) {
  comment.value.id = id;
  await deleteComment();
}

// 날짜 포맷 변경 함수
function formatVisitedDate(dateString) {
  const [datePart, timePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

function convertLocalImagePaths(content) {
  const baseUrl = "http://192.168.120.61:8080/"; // 실제 웹 서버 URL로 변경

  function traverseNodes(node) {
    if (node.type === "image" && node.attrs.src.startsWith("C:/trip97/board/")) {
      const fileName = node.attrs.src.split("/").pop();
      node.attrs.src = baseUrl + fileName;
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverseNodes);
    }
  }

  traverseNodes(content);
}

async function removeBoard() {
  await deleteBoard(no);
  router.push({ name: "boardList" });
}

const moveList = () => {
  router.push({ name: "boardList" });
};

const moveModify = () => {
  router.push({ name: "boardModify" });
};

const moveDelete = () => {
  removeBoard();
};

onMounted(() => {
  getBoard();
  getComment();
  console.log(userInfo.value);
});
</script>

<template>
  <div class="body d-flex flex-column align-items-center">
    <div class="boardBody">
      <div class="content d-flex flex-column justify-content-center">
        <div class="d-flex flex-row titleBox">
          <h2 class="title ml-3 mb-3">{{ board.title }}</h2>
          <p class="createDate">{{ board.createdAt }}</p>
        </div>
        <hr />
        <div class="d-flex flex-row">
          <div class="writerBox d-flex flex-row">
            <img :src="board.profileImage" class="profileImage" />
            <p style="font-size: 15px; margin-left: 8px; margin-top: 9px">
              {{ board.writerNickname }}
            </p>
          </div>
          <div class="viewContainer">
            <p>조회수 : {{ board.viewCount }}</p>
            <p class="ml-2">댓글 수:</p>
          </div>
        </div>
        <div class="editor">
          <EditorContent :editor="editor" class="custom-editor" />
        </div>
      </div>
      <div class="btn d-flex flex-row justify-content-center">
        <button @click="moveList">목록</button>
        <div v-if="userInfo && board.writerId === userInfo.id">
          <button @click="moveModify">수정</button>
          <button @click="moveDelete">삭제</button>
        </div>
      </div>
      <div>
        <hr class="commentHr" />
        <div v-if="userInfo" class="commentBox">
          <input
            type="text"
            class="commentInput"
            placeholder="댓글을 입력해주세요."
            v-model="comment.content"
            @keyup.enter="writeCommentClick"
          />
          <button class="inputBtn" @click="writeCommentClick">입력</button>
          <div v-if="loading">Loading...</div>
          <div v-else>
            <div class="commentList" v-for="commentChild in comments" :key="commentChild.id">
              <div class="d-flex flex-column">
                <div class="d-flex flex-row">
                  <img :src="commentChild.writerProfileImage" class="commentProfileImage" />
                  <p class="commentNickname">{{ commentChild.writerNickname }}</p>
                  <div class="commentBtn" v-if="commentChild.writerId === userInfo.id">
                    <button
                      v-if="state !== `editing${commentChild.id}`"
                      @click="editOpenCommentClick(commentChild.id)"
                    >
                      수정
                    </button>
                    <button
                      class="editEndBtn"
                      v-if="state === `editing${commentChild.id}`"
                      @click="editCommentClick(commentChild.id)"
                      @keyup.enter="editCommentClick(commentChild.id)"
                    >
                      수정 완료
                    </button>
                    <button @click="deleteCommentClick(commentChild.id)">삭제</button>
                  </div>
                </div>
                <p class="commentContent" v-if="state !== `editing${commentChild.id}`">
                  {{ commentChild.content }}
                </p>
                <input
                  type="text"
                  v-if="state === `editing${commentChild.id}`"
                  v-model="editCommentInfo.content"
                  class="editContent"
                  @keyup.enter="editCommentClick(commentChild.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.boardBody {
  width: 800px;
  background-color: white;
  border-radius: 15px;
}

.commentHr {
  width: 780px;
  margin-top: 0px;
  margin-left: 5px;
  margin-bottom: 10px;
}

.profileImage {
  border-radius: 12px;
  width: 40px;
  height: 40px;
}

.writerBox {
  margin-top: 2px;
}

.titleBox {
  margin-bottom: 0px;
}

.viewContainer {
  margin-top: 7px;
  margin-left: auto;
  display: flex;
  flex-direction: row;
}

.createDate {
  margin-left: auto;
  margin-top: 10px;
  margin-bottom: 0px;
}

.writeBox {
  display: flex;
  justify-content: center;
}

.editor {
  padding: 20px;
  border: 1px solid rgb(177, 177, 177);
  border-radius: 15px;
  min-height: 250px;
  margin-top: 8px;
}

.content {
  width: 800px;
  background-color: white;
  border-radius: 15px;
  padding: 50px;
}

.btn button {
  width: 60px;
  margin: 3px;
  font-size: 20px;
}

.commentBox {
  background-color: white;
  border-radius: 15px;
  width: 800px;
  min-height: 500px;
  margin-bottom: 10px;
}

.commentProfileImage {
  width: 34px;
  height: 32px;
}

.commentContent {
  margin-top: 0px;
  margin-bottom: 5px;
  margin-left: 6%;
}

.editContent {
  margin-top: 0px;
  margin-bottom: 5px;
  margin-left: 6%;
}

.commentBtn {
  display: flex;
  margin-left: auto;
  width: 140px;
}

.editEndBtn {
  width: 80px !important; /* 수정완료 버튼의 너비를 적절히 조정 */
}

.commentBtn button {
  width: 60px; /* 모든 버튼의 너비를 통일 */
  height: 30px;
  background-color: #c5c4f1;
  border-radius: 5px;
  font-size: 15px;
  margin-left: 5px;
}

.commentNickname {
  margin-left: 8px;
  font-size: 20px;
}

.commentInput {
  border: 1px solid black;
  width: 650px;
  height: 40px;
  margin-top: 40px;
  margin-bottom: 15px;
  margin-left: 20px;
  padding-left: 10px;
}

.commentList {
  width: 780px;
  background-color: rgb(232, 232, 255);
  border-radius: 10px;
  margin-top: 5px;
  margin-left: 10px;
  padding: 9px;
}

.inputBtn {
  width: 100px;
  height: 40px;
  margin-left: 10px;
  background-color: #8280dd;
  color: white;
  border-radius: 15px;
}
</style>
