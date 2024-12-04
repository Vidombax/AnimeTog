<script setup>

</script>
<template>
  <header class="site-header">
    <h2 class="site-title"><a href="http://localhost:5173/">AnimeTogether</a></h2>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  padding: 12px;
}
h2 {
  cursor: pointer;
}
a {
  font-weight: bold;
  color: #ffffff;
}
</style>