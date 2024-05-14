import { ref } from "vue";
import { defineStore } from "pinia";

export const useMemberStore = defineStore("memberStore", () => {
  const isLogin = ref(false);
  const userInfo = ref(null);

  return {
    isLogin,
    userInfo,
  };
});
