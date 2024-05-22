<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailBoard, deleteBoard } from "@/api/board.js";
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
// const no = route.params.no;

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
    },
    (error) => {
      console.log("Board 불러오는 중 에러 발생");
      console.dir(error);
    }
  );
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
  deleteBoard(
    no,
    (response) => {
      console.log(response);
    },
    (error) => {
      console.log("Board 삭제중 에러");
      console.dir(error);
    }
  );
  router.push({ name: "boardList" });
}

const moveList = () => {
  // 목록 페이지로 이동
  // router.push("list"); // 일반적으로 사용, path방식
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
  console.log(userInfo.value);
});
</script>

<template>
  <div class="body d-flex flex-column align-items-center">
    <div class="content d-flex flex-column justify-content-center">
      <div class="d-flex flex-row titleBox">
        <p class="mb-0" style="font-size: 16px; margin-top: 10px; margin-right: 10px">
          {{ board.id }}.
        </p>
        <h2 class="mb-0">{{ board.title }}</h2>
      </div>
      <hr />
      <div class="d-flex flex-row">
        <img :src="board.profileImage" style="width: 32px; height: 30px" />
        <p style="font-size: 15px; margin-left: 10px; margin-top: 5px">
          작성자 : {{ board.writerNickname }}
        </p>
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
  </div>
</template>

<style scoped>
hr {
  margin: 10px;
}

.titleBox {
  margin-bottom: 0px;
}

.editor {
  padding: 20px;
  border: 1px solid rgb(177, 177, 177);
  border-radius: 15px;
  min-height: 250px;
  margin-top: 20px;
}

.content {
  width: 800px;
  background-color: white;
  border-radius: 15px;
  padding: 50px;
}

.btn button {
  background-color: white;
  width: 60px;
  height: 40px;
  border-radius: 15px;
  margin: 3px;
  font-size: 20px;
}
</style>
