<script setup>
defineProps(['innerHtml']);
</script>

<template>
  <div class="video" :key="innerHtml" v-html="innerHtml"></div>
</template>

<style scoped>
.video {
  width: 900px;
  height: 560px;
}
</style>
