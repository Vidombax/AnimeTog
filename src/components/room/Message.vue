<script setup>

</script>

<template>
  <div class="message">
    <div class="message-info">
      <span>Имя</span>
      <span>Сообщение</span>
    </div>
    <div class="message-time">
      <span>00:00</span>
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  position: absolute;
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
