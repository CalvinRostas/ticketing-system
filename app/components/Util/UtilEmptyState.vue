<template>
    <div class="flex items-center justify-center">
        <UiEmpty class="border border-dashed">
            <UiEmptyHeader>
                <UiEmptyMedia variant="icon">
                    <Icon :name="props.icon" />
                </UiEmptyMedia>
                <UiEmptyTitle>{{ props.title }}</UiEmptyTitle>
                <UiEmptyDescription>
                    {{ props.description }}
                </UiEmptyDescription>
            </UiEmptyHeader>
            <UiEmptyContent>
                <slot />
            </UiEmptyContent>
        </UiEmpty>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    title: string
    description: string
    icon?: string
}>(), {
    icon: "lucide:plus"
})
</script>
