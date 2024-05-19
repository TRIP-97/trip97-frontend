<template>
  <div v-if="editor">
    <editor-content :editor="editor" class="editorContent"/>
    <input
      ref="image"
      @change="addImage"
      type="file"
      id="chooseFile"
      name="chooseFile"
      accept="image/*"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import axios from 'axios';

// 컴포넌트 참조 및 에디터 인스턴스 설정
const editor = ref(null);
const imageInput = ref(null);
const postId = ref(1); // 예제용으로 고정된 글 번호
let imageOrder = ref(1); // 이미지 순서 초기화

// props 및 emits 정의
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

// 이미지 업로드 처리 함수
const handleImageUpload = async () => {
  const file = imageInput.value.files[0];
  const formData = new FormData();
  formData.append('image', file);
  formData.append('postId', postId.value);
  formData.append('imageOrder', imageOrder.value);

  try {
    const response = await axios.post('http://localhost:8080/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const url = response.data;

    if (url) {
      editor.value.chain().focus().setImage({ src: url }).run();
      imageOrder.value += 1; // 이미지 순서 증가
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

// 에디터 초기화 및 업데이트 핸들러
onMounted(() => {
  editor.value = new Editor({
    extensions: [Document, Paragraph, Text, Image, Dropcursor, StarterKit],
    content: props.modelValue,
    onUpdate: () => {
      emit('update:modelValue', editor.value.getHTML());
    },
  });
});

// 에디터 내용이 변경되었을 때의 처리
watch(
  () => props.modelValue,
  (value) => {
    if (editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value, false);
    }
  }
);

// 컴포넌트 언마운트 시 에디터 정리
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style lang="scss">
/* Basic editor styles */
.editorContent {
  width : 700px;
  height : 500px;
  overflow : scroll;
  border : solid 1px black;
  padding : 15px;
}

.tiptap {
  > * + * {
    margin-top: 0.75em;
  }


  img {
    max-width: 500px;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid #68cef8;
    }
  }
}
</style>
