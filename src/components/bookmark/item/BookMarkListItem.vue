<script setup>
import { ref, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";
import { removeFavorite } from "@/api/favorite";
import HotAttractionModal from "@/components/attraction/item/HotAttractionModal.vue";

const router = useRouter();

const props = defineProps({
  bookmarkItem: Object,
});

const isModalActive = ref(false);
const selectFavoriteAttractionId = ref("");

const bookmark = ref("");
onMounted(() => {
  bookmark.value = props.bookmarkItem;
  console.log("??", bookmark.value);
});

// 날짜 포맷 변경 함수
function formatVisitedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
}

async function removeBookmark() {
  removeFavorite(
    sessionStorage.getItem("accessToken"),
    bookmark.value.attractionId,
    bookmark.value.memberId,
    (success) => {
      console.log("삭제 성공");
      closeChild();
    },
    (error) => {
      console.log(error);
    }
  );
}

const emit = defineEmits(["closeChildBox"]);
const closeChild = () => {
  emit("closeChildBox", false);
};

// 즐겨찾기 관광지 클릭시 모달창을 활성화시키는 함수
const viewFavoritePlaceModal = (attractionId) => {
  selectFavoriteAttractionId.value = attractionId;
  isModalActive.value = true;
};

function deleteBookmark() {
  removeBookmark();
}
</script>

<template>
  <div>
    <div class="card" style="width: 18rem" @click="viewFavoritePlaceModal(bookmark.attractionId)">
      <div class="card-header bg-transparent d-flex align-items-center">
        <div class="attractionName d-flex align-items-center">
          <p class="mb-0 ms-2">{{ bookmark.title }}</p>
        </div>
        <div class="header-date mt-3">
          <div class="d-flex">
            <i class="travel-date-icon fa-solid fa-calendar"></i>
            <p class="travel-date-label mb-0">즐겨찾기 등록 날짜</p>
          </div>
          <p class="travel-date">{{ bookmark.createdAt }}</p>
        </div>
        <div>
          <i
            class="fa-solid fa-trash-can ml-2"
            style="font-size: 17px"
            @click.stop="deleteBookmark"
          ></i>
        </div>
      </div>
      <div class="position-relative bookmark-image-area">
        <template v-if="bookmark.firstImage === null">
          <img src="@/assets/images/no_image.png" class="card-img-top" alt="bookmark Image" />
        </template>
        <template v-else>
          <img :src="bookmark.firstImage" class="bookmark-image" />
        </template>
      </div>
      <div class="card-body">
        <p class="card-title">{{ bookmark.title }}</p>
        <p class="card-content">{{ bookmark.address }}</p>
      </div>
    </div>
    <HotAttractionModal
      :isActive="isModalActive"
      :selectHotAttractionId="selectFavoriteAttractionId"
      @close="isModalActive = false"
    />
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  margin: 10px;
  overflow: hidden;
  cursor: pointer;
  height: 350px;
}
.card:hover .hotplace-location {
  color: white;
  background-color: #8280dd;
}
.card:hover .hotplace-image {
  transform: scale(1.15);
  transition: transform 0.3s ease;
}

.card-header {
  height: 50px;
  font-size: 11px;
  border-bottom: none;
  margin-top: 5px;
}

.card-title {
  font-size: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: 1.5em;
}

.card-body {
  height: 150px;
}

.card-content {
  font-size: 15px;
}

.attractionName {
  width: 50%;
}

.custom-vr {
  border-left: 1px solid lightgray;
  height: 30px;
  align-self: center;
}
.travel-date-icon {
  color: gray;
}
.travel-date-label {
  margin-left: 3px;
  color: gray;
}
.travel-date {
  color: #8280dd;
}
.bookmark-image-area {
  obejct-fit: cover;
  width: 300px;
  height: 200px;
  overflow: hidden;
}
.bookmark-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.bookmark-location {
  top: 10px;
  left: 10px;
  height: 25px;
  padding-top: 2px;
  padding-left: 10px;
  padding-right: 10px;
  color: #8280dd;
  background-color: white;
  border-radius: 10px;
  font-size: 14px;
}

.fa-calendar {
  margin-top: 2px;
}
.fa-eye,
.fa-heart {
  margin-top: 3px;
  margin-left: 15px;
}
</style>
