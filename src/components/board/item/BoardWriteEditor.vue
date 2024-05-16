<template>
  <div v-if="editor">
    <editor-content :editor="editor" class="editorContent"/>
    <input
      ref="image"
      @change="addImage()"
      type="file"
      id="chooseFile"
      name="chooseFile"
      accept="image/*"
    />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

export default {
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      defualt: "",
    },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      editor: null,
    };
  },

  methods: {
    addImage() {
      var image = this.$refs["image"].files[0];
      const url = URL.createObjectURL(image);
      this.image = url;

      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },

  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value;
      if (isSame) {
        return;
      }
      this.editor.commands.setContent(value, false);
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [Document, Paragraph, Text, Image, Dropcursor],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit("update:modelValue", this.editor.getHTML());
      },

    });
  },

  beforeUnmount() {
    this.editor.destroy();
  },
};
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
