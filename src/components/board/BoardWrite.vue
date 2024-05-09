<template>
  <div>
    <editor v-model="content" />
    <button @click="saveHandler">글쓰기</button>
  </div>
</template>

<script>
import Editor from "./item/BoardWriteEditor.vue";

export default {
  components: {
    Editor,
  },

  data() {
    return {
      content: "",
    };
  },

  methods: {
    saveHandler() {},
  },

  //   created() {
  //     if () {
  //       this.$api.GET_CONTENT_DATA(this.$route.params.id).then((res) => {
  //         this.content = res.data.content;
  //       });
  //     }
  //   },
};
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  > * + * {
    margin-top: 0.75em;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }
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
