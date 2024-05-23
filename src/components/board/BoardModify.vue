<template>
  <div class="writeContent">
    <div class="body">
      <h2>제목</h2>
      <input class="title" type="text" v-model="title" />
      <h2>내용</h2>
      <div id="editor-container" class="editor-container">
        <EditorContent :editor="editor" class="custom-editor" />
      </div>
      <div class="btn">
        <input type="file" @change="handleFileSelection" multiple />
        <button class="writeBtn" @click="saveHandler">수정하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { detailBoard, modifyBoard, uploadImage } from "@/api/board.js";
import { useMemberStore } from "@/stores/member";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { storeToRefs } from "pinia";

import { useRoute, useRouter } from "vue-router";

const title = ref("");
const selectedFiles = ref([]); // 선택된 파일을 저장하는 배열

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

const route = useRoute();
const router = useRouter();
const board = ref([]);

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
  editable: true,
});

async function getBoard() {
  detailBoard(
    no,
    (response) => {
      board.value = response.data;
      title.value = board.value.title;

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

onMounted(() => {
  getBoard();
  const editorElement = document.querySelector(".custom-editor");
  if (editorElement) {
    editorElement.style.border = "none";
  }
});

const handleFileSelection = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      editor.value
        .chain()
        .focus()
        .setImage({
          src: e.target.result,
          width: 500,
          height: 500,
        })
        .run();
    };
    reader.readAsDataURL(file);
  });
  selectedFiles.value = files; // 선택된 파일을 배열에 저장
};

function editBoard() {
  console.log("게시판", board.value);
  modifyBoard(
    sessionStorage.getItem("accessToken"),
    board.value,
    (success) => {
      router.push({ name: "boardDetail", params: { id: no } });
      console.log("success");
    },
    (error) => {
      console.log("수정실패!");
    }
  );
}

const saveHandler = async () => {
  // 에디터 콘텐츠를 JSON으로 변환
  let contentJson = editor.value.getJSON();

  // 선택된 파일을 업로드하고, 반환된 URL을 에디터에 반영
  for (const file of selectedFiles.value) {
    try {
      const url = await uploadImage(file);
      console.log("Received URL:", url); // URL이 제대로 받아와지는지 확인하기 위해 로그 추가
      if (url) {
        // base64 이미지 URL을 실제 업로드된 이미지 URL로 교체
        contentJson = await replaceBase64WithUrl(contentJson, file, url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return;
    }
  }

  board.value.title = title.value;
  board.value.content = JSON.stringify(contentJson);
  board.value.id = no;

  try {
    editBoard();
  } catch (error) {
    console.error("Error saving content:", error);
  }
};

// base64 이미지를 실제 업로드된 URL로 교체하는 함수
const replaceBase64WithUrl = async (contentJson, file, url) => {
  const fileReader = new FileReader();
  const base64String = await new Promise((resolve, reject) => {
    fileReader.onload = (e) => resolve(e.target.result);
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsDataURL(file);
  });

  if (Array.isArray(contentJson.content)) {
    contentJson.content.forEach((node) => {
      if (node.type === "image" && node.attrs.src === base64String) {
        node.attrs.src = url;
      }
    });
  }

  return contentJson;
};
</script>

<style scoped>
.title {
  width: 700px;
  border: 1px solid black;
  margin: 10px;
  height: 40px;
  padding-left: 10px;
}

.writeContent {
  display: flex;
  justify-content: center;
}

.body {
  background-color: white;
  width: 800px;
  border-radius: 20px;
  padding: 20px;
  padding-left: 40px;
}

.editor-container {
  border: 1px solid black;
  margin: 10px;
  width: 700px;
  height: 500px;
  display: flex;
  flex-direction: column;
}

.btn {
  display: flex;
  justify-content: space-between;
}

.writeBtn {
  margin-right: 10px;
  width: 80px;
  height: 38px;
  background-color: #8280dd;
  color: white;
  border-radius: 5px;
}

.writeBtn:hover {
  background-color: #6b6ab8;
}

#editor-container .custom-editor {
  width: 700px;
  min-height: 500px;
  max-height: 500px;
  padding: 10px;
  overflow-y: scroll;
}
</style>
