<template>
    <div>
        <UtilEmptyState v-if="isEmpty" title="No Statuses yet" description="Create your first status to get started.">
            <TicketStatusForm @action-success="(data) => refreshData(data)">
                <UiButton>
                    <Icon name="lucide:plus" /> {{ $t('status.createStatus') }}
                </UiButton>
            </TicketStatusForm>
        </UtilEmptyState>
        <template v-else>
            <div class="grid grid-cols-1 gap-5 md:flex md:items-center md:justify-between">
                <div class="flex flex-col">
                    <h1 class="font-semibold">{{ $t('status.title', 2) }}</h1>
                    <p class="text-muted-foreground text-sm">
                        {{ $t('status.description') }}
                    </p>
                </div>
                <div>
                    <TicketStatusForm @action-success="(data) => refreshData(data)">
                        <UiButton variant="outline">
                            <Icon name="lucide:plus" /> {{ $t('status.title') }}
                        </UiButton>
                    </TicketStatusForm>
                </div>
            </div>
            <div class="mt-10 grid overflow-x-auto">
                <UiTable class="w-full table-auto">
                    <UiTableHeader>
                        <UiTableRow>
                            <UiTableHead class="text-foreground pl-0 font-semibold">
                                <div class="flex items-center gap-2">
                                    <span>{{ $t('general.name') }}</span>
                                    <UiButton variant="link" @click="isSearchOpen = true" v-if="!isSearchOpen">
                                        <Icon name="lucide:search" />
                                    </UiButton>
                                    <UiInputGroup class="max-w-60" v-else>
                                        <UiInputGroupInput type="text" name="search" :placeholder="$t('general.search')"
                                            v-model="searchQuery" />
                                        <UiInputGroupAddon align="inline-end">
                                            <UiInputGroupButton class="rounded-full" size="icon-xs"
                                                @click="closeSearch()">
                                                <Icon name="lucide:x" />
                                            </UiInputGroupButton>
                                        </UiInputGroupAddon>
                                    </UiInputGroup>
                                </div>
                            </UiTableHead>
                            <UiTableHead class="text-foreground pl-0 font-semibold">{{ $t('general.description') }}
                            </UiTableHead>
                            <UiTableHead class="text-foreground pl-0 font-semibold">{{ $t('general.color') }}
                            </UiTableHead>
                            <UiTableHead class="pl-0">
                                <span class="sr-only">{{ $t('general.actions') }}</span>
                            </UiTableHead>
                        </UiTableRow>
                    </UiTableHeader>
                    <UiTableBody>
                        <template v-for="status in statuses" :key="status.id">
                            <UiTableRow>
                                <UiTableCell class="pl-0 font-medium">{{ status.name }} </UiTableCell>
                                <UiTableCell class="text-muted-foreground pl-0">{{ status.description }}</UiTableCell>
                                <UiTableCell class="text-muted-foreground pl-0 flex items-center gap-2">
                                    <div class="size-4 rounded-full border"
                                        :style="{ backgroundColor: status.color ?? 'green' }"></div>{{
                                            status.color }}
                                </UiTableCell>
                                <UiTableCell class="pl-0 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <TicketStatusForm @action-success="(data) => refreshEditedData(data)" :edit="true"
                                            :id="status.id" :name="status.name" :description="status.description!"
                                            :color="status.color!">
                                            <UiButton size="sm" variant="outline">
                                                <Icon name="lucide:pen" />
                                            </UiButton>
                                        </TicketStatusForm>
                                        <UtilConfirmDialog @confirm="() => deleteStatus(status.id)">
                                            <UiButton size="sm" variant="outline">
                                                <Icon name="lucide:trash" />
                                            </UiButton>
                                        </UtilConfirmDialog>
                                    </div>
                                </UiTableCell>
                            </UiTableRow>
                        </template>
                    </UiTableBody>
                </UiTable>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
})

const { data, error } = await useFetch('/api/ticket/status/list')

const isEmpty = computed(() => statuses.value.length === 0)

const statuses = ref(data.value?.data ?? [])
const isSearchOpen = shallowRef(false)
const searchQuery = ref('')

const closeSearch = () => {
    isSearchOpen.value = false
    searchQuery.value = ''
}

watch(searchQuery, (newQuery) => {
    statuses.value = data.value?.data.filter((status) =>
        status.name.toLowerCase().includes(newQuery.toLowerCase())
    ) ?? []
})

const refreshData = async (data: any) => {
    statuses.value.push(data)
}

const refreshEditedData = async (newData: any) => {
    const index = statuses.value.findIndex(status => status.id === newData.id)
    if (index !== -1) {
        statuses.value[index] = newData
    }
}

const deleteStatus = async (id: number) => {
    const { data, error } = await useFetch(`/api/ticket/status/delete`, {
        method: 'DELETE',
        body: { id }
    })

    if (!error.value) {
        statuses.value = statuses.value.filter(status => status.id !== id)
    }
}

</script>

<style scoped></style>