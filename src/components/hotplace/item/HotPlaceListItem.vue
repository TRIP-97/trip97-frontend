<script setup>
import { RouterLink } from "vue-router";

defineProps({
    hotPlace: Object
})
</script>

<template>
    <tr class="text-center">
        <th scope="row">{{ hotPlace.id }}</th>
        <td class="text-start">
            <RouterLink
            class="hotplace-title link-dark"
            :to="{
                name: 'hotPlaceDetail',
                params: { id: hotPlace.id },
            }"
            >{{ hotPlace.title }}</RouterLink>
        </td>
        <td>{{ hotPlace.writerNickname }}</td>
        <td>{{ hotPlace.createdAt }}</td>
        <td>{{ hotPlace.viewCount }}</td>
        <td>{{ hotPlace.likeCount }}</td>
    </tr>
</template>

<style scoped>

</style>