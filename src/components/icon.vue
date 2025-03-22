<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>
<template>
  <svg class="icon" width="24" height="24">
    <use :xlink:href="`./sprite.svg#${name}`"></use>
  </svg>
</template>
