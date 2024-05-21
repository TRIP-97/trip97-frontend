<template>
  <div class="writeContent">
    <div class="body">
      <h2>제목</h2>
      <input class="title" type="text" v-model="title" />
      <h2>내용</h2>
      <div class="editor">
        <EditorContent :editor="editor" />
      </div>
      <div class="btn">
        <input type="file" @change="handleFileSelection" multiple />
        <button @click="saveHandler">글쓰기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { registBoard } from "@/api/board.js";
import { useMemberStore } from "@/stores/member";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import axios from "axios";
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

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("/board/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const url = response.data.fileUrl; // 업로드된 이미지의 URL이 반환된다고 가정
    console.log("Uploaded Image URL:", url); // URL이 올바르게 반환되는지 확인
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

const saveHandler = async () => {
  // 에디터 콘텐츠를 JSON으로 변환
  let contentJson = editor.value.getJSON();

  // 선택된 파일을 업로드하고, 반환된 URL을 에디터에 반영
  for (const file of selectedFiles.value) {
    try {
      const url = await uploadImage(file);
      if (url) {
        // base64 이미지 URL을 실제 업로드된 이미지 URL로 교체
        contentJson = replaceBase64WithUrl(contentJson, file, url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return;
    }
  }

  const board = ref({
    writerId: userInfo.value.id,
    title: title.value,
    content: JSON.stringify(contentJson),
    writerNickname: userInfo.value.nickname,
  });

  console.log(board.value);

  try {
    await registBoard(sessionStorage.getItem("accessToken"), board.value);
    console.log("Content saved successfully");
  } catch (error) {
    console.error("Error saving content:", error);
  }
};

// base64 이미지를 실제 업로드된 URL로 교체하는 함수
const replaceBase64WithUrl = (contentJson, file, url) => {
  if (Array.isArray(contentJson.content)) {
    contentJson.content.forEach((node) => {
      if (node.type === "image" && node.attrs.src === URL.createObjectURL(file)) {
        node.attrs.src = url;
      }
    });
  }
  return contentJson;
};
</script>

<style lang="scss">
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

.tiptap {
  > * + * {
    margin-top: 0.75em;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }
}

.body {
  background-color: white;
  border-radius: 20px;
  padding: 15px;
}

.editor {
  border: 1px solid black;
  margin: 10px;
  height: 500px;
}

.btn {
  padding: 5px;
}

.content {
  padding: 1rem 0 0;

  h3 {
    margin: 1rem 0 0.5rem;
  }

  pre {
    border-radius: 5px;
    color: #333;
  }

  code {
    display: block;
    white-space: pre-wrap;
    font-size: 0.8rem;
    padding: 0.75rem 1rem;
    background-color: #e9ecef;
    color: #495057;
  }
}
</style>
