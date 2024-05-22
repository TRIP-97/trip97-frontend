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
        <button @click="saveHandler">글쓰기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { registBoard, uploadImage } from "@/api/board.js";
import { useMemberStore } from "@/stores/member";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { storeToRefs } from "pinia";

const title = ref("");
const selectedFiles = ref([]); // 선택된 파일을 저장하는 배열

const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

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

onMounted(() => {
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

  const board = {
    writerId: userInfo.value.id,
    title: title.value,
    content: JSON.stringify(contentJson),
    writerNickname: userInfo.value.nickname,
  };

  console.log(board);

  try {
    await registBoard(sessionStorage.getItem("accessToken"), board);
    console.log("Content saved successfully");
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
  width: 640px;
  border: 1px solid black;
  margin: 10px;
  height: 30px;
}

.writeContent {
  display: flex;
  justify-content: center;
}

.body {
  background-color: white;
  border-radius: 20px;
  padding: 15px;
}

.editor-container {
  border: 1px solid black;
  margin: 10px;
  height: 500px;
  display: flex;
  flex-direction: column;
}

#editor-container .custom-editor {
  min-height: 500px;
  max-height: 500px;
  padding: 10px;
  overflow-y: scroll;
}
</style>
