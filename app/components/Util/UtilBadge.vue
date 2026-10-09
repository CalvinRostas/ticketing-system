<template>
  <div>
    <div
      class="flex w-fit items-center justify-center rounded-lg border px-3 py-1 text-center"
      :style="{ borderColor: props.color }"
    >
      <span :style="{ color: props.color }">{{ props.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label: string;
    color: string;
  }>();
</script>

<style scoped></style>
