<template>
    <div>

    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: "auth",
})

const { data, error } = await useFetch(`/api/ticket/${useRoute().params.id}`)

console.log(error.value)

console.log(data.value)
</script>

<style scoped>

</style>