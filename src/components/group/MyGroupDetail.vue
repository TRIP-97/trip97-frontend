<script setup>
  import { ref } from "vue";
  import MyGroupDetailItem from "@/components/group/item/MyGroupDetailItem.vue";
  import MyGroupRequestList from "@/components/group/item/MyGroupRequestList.vue";

  const groupMenu = ref("groupDetail");
  const groupDetailRef = ref(null);

  // 모임 메뉴를 선택하는 함수
  const setFilter = (menu) => {
    groupMenu.value = menu;
  }

  const refreshMembers = () => {
    if (groupDetailRef.value) {
      groupDetailRef.value.getGroup();
    }
  }

</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-sm-11">
        <div class="filter-container d-flex justify-content-between mb-3">
          <div class="filters">
            <div
              :class="{ 'filter-selected': groupMenu === 'groupDetail' }"
              class="filter-option"
              @click="setFilter('groupDetail')"
            >
              모임 상세
            </div>
            <div
              :class="{ 'filter-selected': groupMenu === 'travelPlan' }"
              class="filter-option"
              @click="setFilter('travelPlan')"
            >
              여행 계획
            </div>
            <div
              :class="{ 'filter-selected': groupMenu === 'requestList' }"
              class="filter-option"
              @click="setFilter('requestList')"
            >
              신청 목록
            </div>
          </div>
        </div>
        
        <MyGroupDetailItem 
        v-show="groupMenu === 'groupDetail'"
        ref="groupDetailRef"
        class="my-group-detail-item"/>
        <MyGroupRequestList 
        v-show="groupMenu === 'requestList'"
        @refresh-members="refreshMembers"
        class="my-groop-request-item"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    max-width: 1200px;
  }

  .filter-container {
    display: flex;
    justify-content: space-between;
  }

  .filters {
    display: flex;
    gap: 10px;
  }

  .filter-option {
    font-size: 14px;
    font-family: NanumSquareRound;
    padding: 8px 16px;
    background-color: #ebebeb;
    color: rgb(4, 4, 4);
    border-radius: 8px;
    transition: background-color 0.3s ease, color 0.3s ease;
    cursor: pointer;
    box-shadow: 3px 3px 3px #ebebeb;
  }

  .filter-selected {
    background-color: black;
    color: white;
  }

  .my-group-detail-item, .my-groop-request-item {
    border: 1px solid rgb(201, 201, 201);
    padding: 10px;
    border-radius: 10px;
    box-shadow: 5px 5px 5px #ebebeb;
  }
</style>
