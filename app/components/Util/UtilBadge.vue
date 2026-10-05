<template>
    <div>
        <div class="flex items-center justify-center text-center border rounded-lg w-fit px-3 py-1" :style="{ borderColor: props.color }">
            <span :style="{ color: props.color }">{{ props.label }}</span>
        </div>

    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string
    color: string
}>()
</script>

<style scoped>

</style>