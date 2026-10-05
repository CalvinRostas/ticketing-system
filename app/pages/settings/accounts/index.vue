<template>
    <div>
        <UtilEmptyState v-if="isEmpty" title="No Accounts yet" description="Create your first account to get started.">
            <TicketStatusForm @action-success="(data) => refreshData(data)">
                <UiButton>
                    <Icon name="lucide:plus" /> {{ $t('status.createStatus') }}
                </UiButton>
            </TicketStatusForm>
        </UtilEmptyState>
        <template v-else>
            <div class="grid grid-cols-1 gap-5 md:flex md:items-center md:justify-between">
                <div class="flex flex-col">
                    <h1 class="font-semibold">Accounts</h1>
                    <p class="text-muted-foreground text-sm">
                        Manage your accounts
                    </p>
                </div>
                <div>
                    <TicketStatusForm @action-success="(data) => refreshData(data)">
                        <UiButton variant="outline">
                            <Icon name="lucide:plus" /> Account
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
                            <UiTableHead class="text-foreground pl-0 font-semibold">Email
                            </UiTableHead>
                            <UiTableHead class="text-foreground pl-0 font-semibold">Permissions
                            </UiTableHead>
                            <UiTableHead class="pl-0">
                                <span class="sr-only">{{ $t('general.actions') }}</span>
                            </UiTableHead>
                        </UiTableRow>
                    </UiTableHeader>
                    <UiTableBody>
                        <template v-for="account in accounts" :key="account.id">
                            <UiTableRow>
                                <UiTableCell class="pl-0 font-medium">{{ account.firstname }} {{ account.lastname }} </UiTableCell>
                                <UiTableCell class="text-muted-foreground pl-0">{{ account.email }}</UiTableCell>
                                <UiTableCell class="text-muted-foreground pl-0 flex items-center gap-2">
                                    {{ account.permissions }}
                                </UiTableCell>
                                <UiTableCell class="pl-0 text-right">
                                    Actions
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

const { data, error } = await useFetch('/api/accounts/list')

const isEmpty = computed(() => data.value?.data.length === 0)

const accounts = ref(data.value?.data ?? [])
const isSearchOpen = shallowRef(false)
const searchQuery = ref('')

const closeSearch = () => {
    isSearchOpen.value = false
    searchQuery.value = ''
}

watch(searchQuery, (newQuery) => {
    accounts.value = data.value?.data.filter((account) =>
        account.firstname!.toLowerCase().includes(newQuery.toLowerCase())
    ) ?? []
})

const refreshData = async (data: any) => {
    accounts.value.push(data)
}

const refreshEditedData = async (newData: any) => {
    const index = accounts.value.findIndex(account => account.id === newData.id)
    if (index !== -1) {
        accounts.value[index] = newData
    }
}

const deleteStatus = async (id: number) => {
    const { data, error } = await useFetch(`/api/accounts/delete`, {
        method: 'DELETE',
        body: { id }
    })

    if (!error.value) {
        accounts.value = accounts.value.filter(account => account.id !== id)
    }
}

</script>

<style scoped></style>