<script setup>
import "bootstrap/dist/js/bootstrap.bundle.min.js";
</script>

<template>
  <router-view :key="$route.fullPath" />
</template>
