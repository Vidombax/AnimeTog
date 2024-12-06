<script setup>
defineProps({
  name: String,
  message: String,
  time: String
});
</script>

<template>
  <div class="message">
    <div class="message-info">
      <span>{{ name }}</span>
      <span>{{ message }}</span>
    </div>
    <div class="message-time">
      <span>{{ time.replace(/\.\d+$/, '') }}</span>
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  position: relative;
  left: 0;
  margin-left: 12px;
  gap: 4px;
  padding: 12px;
  align-items: flex-start;
  flex-direction: column;
  width: 400px;
}
.message-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.message-info span:first-child {
  font-size: 14px;
  font-weight: bold;
}
.message-info span:last-child {
  font-size: 16px;
}
.message-time {
  position: absolute;
  right: 0;
}
</style>
