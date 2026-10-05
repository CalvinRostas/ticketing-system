<template>
    <UiAlert variant="destructive" icon="lucide:alert-circle">
        <UiAlertTitle>
            {{ $t('error.general.title') }}
        </UiAlertTitle>
        <UiAlertDescription class="space-y-2">
            <ul class="list-inside list-disc text-sm">
                <li v-for="msg in errorMessages" :key="msg">{{ $t(msg) }}</li>
            </ul>
        </UiAlertDescription>
    </UiAlert>
</template>

<script setup lang="ts">
import { formatError, type ZodErrorType } from "~~/shared/errorFormatter";

const props = defineProps<{
    error: string | ZodErrorType
}>()

const errorMessages = computed(() => {
    return formatError(props.error)
})
</script>

<style scoped></style>