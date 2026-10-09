<template>
    <div>
        <div v-if="props.comments.length == 0" class="w-full">
            <div class="flex flex-col items-center justify-center">
                <Icon name="lucide:ghost" class="text-muted-foreground size-8" />
                <p class="text-muted-foreground">No comments yet. Be the first!</p>
            </div>
        </div>
        <div v-else>
            <div v-for="(comments, date) in groupedComments" :key="date" class="mb-4">
                <UiDivider :label="new Date(date).toLocaleDateString(locale)" class="text-muted-foreground" />
                <div v-for="comment in comments" :key="comment.id" class="mb-3">
                    <div class="flex gap-2">
                        <UiAvatar>
                            <UiAvatarImage :src="comment.author.avatarUrl" :alt="comment.author.name" />
                            <UiAvatarFallback>{{ comment.author.firstname?.charAt(0) }}{{ comment.author.lastname?.charAt(0) }}</UiAvatarFallback>
                        </UiAvatar>
                        <div class="space-y-1">
                            <p class="italic">{{ comment.author.firstname }} {{ comment.author.lastname }} <span class="text-muted-foreground text-sm">{{ new Date(comment.createdAt).toLocaleTimeString(locale) }}</span></p>
                            <p>{{ comment.content }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Comment } from '~~/shared/types'

const props = defineProps<{
    comments: Comment[]
}>()

const { locale } = useI18n()

const groupedComments = computed<Record<string, Comment[]>>(() => {
    return props.comments.reduce<Record<string, Comment[]>>((groups, comment) => {
        const date = new Date(comment.createdAt).toLocaleDateString(locale.value)
            ; (groups[date] ??= []).push(comment)
        return groups
    }, {})
})
</script>

<style scoped></style>