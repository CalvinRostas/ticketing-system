<template>
    <div class="w-full flex justify-between items-center">
        <UiPopover v-model:open="open">
            <UiPopoverTrigger as-child>
                <UiButton variant="outline" role="combobox" :aria-expanded="open" class="w-full justify-between">
                    <span v-if="model.length === 0">Select assignee</span>
                    <span v-else>Selected {{ model.length }} assignees</span>
                    <Icon name="lucide:chevron-down" class="ml-auto size-4 shrink-0 opacity-50" />
                </UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent align="start" class="w-(--reka-popover-trigger-width) p-0">
                <UiCommand v-model="value" class="w-full">
                    <UiCommandInput placeholder="Search users..." v-model="searchInput" />
                    <UiCommandList>
                        <UiCommandEmpty>No users found.</UiCommandEmpty>
                        <UiCommandGroup>
                            <UiCommandItem v-for="item in filteredItems" :key="item.id" :value="item"
                                @select="toggleUser(item)">
                                <div class="flex items-center justify-between w-full">
                                    <div class="flex items-center gap-2">
                                        <UiAvatar class="size-8">
                                            <UiAvatarFallback>
                                                {{ item.firstname?.charAt(0) ?? '' }}{{ item.lastname?.charAt(0) ?? '' }}
                                            </UiAvatarFallback>
                                        </UiAvatar>
                                        <span>{{ item.firstname }} {{ item.lastname }}</span>
                                    </div>
                                    <Icon name="lucide:check" v-if="model.includes(item.id)" />
                                </div>
                            </UiCommandItem>
                        </UiCommandGroup>
                    </UiCommandList>
                </UiCommand>
            </UiPopoverContent>
        </UiPopover>
    </div>
</template>

<script setup lang="ts">
type SelectableUser = {
    id: number
    firstname: string | null
    lastname: string | null
}

const props = defineProps<{
    items: SelectableUser[]
}>()

const model = defineModel<number[]>({ default: () => [] })

const open = ref(false);
const value = ref();
const searchInput = ref("");

const filteredItems = computed(() => {
    if (!searchInput.value) return props.items
    return props.items.filter(item =>
        `${item.firstname} ${item.lastname}`.toLowerCase().includes(searchInput.value.toLowerCase())
    )
})

const toggleUser = (user: SelectableUser) => {
    const index = model.value.indexOf(user.id)
    if (index === -1) {
        model.value = [...model.value, user.id]
    } else {
        model.value = model.value.filter(id => id !== user.id)
    }
}
</script>
