<template>
  <div>
    <UtilEmptyState
      v-if="isEmpty"
      title="No Categories yet"
      description="Create your first category to get started."
    >
      <TicketCategoryForm @action-success="(data) => refreshData(data)">
        <UiButton> <Icon name="lucide:plus" /> {{ $t("category.createCategory") }} </UiButton>
      </TicketCategoryForm>
    </UtilEmptyState>
    <template v-else>
      <div class="grid grid-cols-1 gap-5 md:flex md:items-center md:justify-between">
        <div class="flex flex-col">
          <h1 class="font-semibold">{{ $t("category.title", 2) }}</h1>
          <p class="text-muted-foreground text-sm">
            {{ $t("category.description") }}
          </p>
        </div>
        <div>
          <TicketCategoryForm @action-success="(data) => refreshData(data)">
            <UiButton variant="outline">
              <Icon name="lucide:plus" /> {{ $t("category.title") }}
            </UiButton>
          </TicketCategoryForm>
        </div>
      </div>
      <div class="mt-10 grid overflow-x-auto">
        <UiTable class="w-full table-auto">
          <UiTableHeader>
            <UiTableRow>
              <UiTableHead class="text-foreground pl-0 font-semibold">
                <div class="flex items-center gap-2">
                  <span>{{ $t("general.name") }}</span>
                  <UiButton variant="link" @click="isSearchOpen = true" v-if="!isSearchOpen">
                    <Icon name="lucide:search" />
                  </UiButton>
                  <UiInputGroup class="max-w-60" v-else>
                    <UiInputGroupInput
                      type="text"
                      name="search"
                      :placeholder="$t('general.search')"
                      v-model="searchQuery"
                    />
                    <UiInputGroupAddon align="inline-end">
                      <UiInputGroupButton
                        class="rounded-full"
                        size="icon-xs"
                        @click="closeSearch()"
                      >
                        <Icon name="lucide:x" />
                      </UiInputGroupButton>
                    </UiInputGroupAddon>
                  </UiInputGroup>
                </div>
              </UiTableHead>
              <UiTableHead class="text-foreground pl-0 font-semibold"
                >{{ $t("general.description") }}
              </UiTableHead>
              <UiTableHead class="text-foreground pl-0 font-semibold"
                >{{ $t("general.color") }}
              </UiTableHead>
              <UiTableHead class="pl-0">
                <span class="sr-only">{{ $t("general.actions") }}</span>
              </UiTableHead>
            </UiTableRow>
          </UiTableHeader>
          <UiTableBody>
            <template v-for="category in categories" :key="category.id">
              <UiTableRow>
                <UiTableCell class="pl-0 font-medium">{{ category.name }} </UiTableCell>
                <UiTableCell class="text-muted-foreground pl-0">{{
                  category.description
                }}</UiTableCell>
                <UiTableCell class="text-muted-foreground flex items-center gap-2 pl-0">
                  <div
                    class="size-4 rounded-full border"
                    :style="{ backgroundColor: category.color ?? 'green' }"
                  ></div>
                  {{ category.color }}
                </UiTableCell>
                <UiTableCell class="pl-0 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <TicketCategoryForm
                      @action-success="(data) => refreshEditedData(data)"
                      :edit="true"
                      :id="category.id"
                      :name="category.name"
                      :description="category.description!"
                      :color="category.color!"
                    >
                      <UiButton size="sm" variant="outline">
                        <Icon name="lucide:pen" />
                      </UiButton>
                    </TicketCategoryForm>
                    <UtilConfirmDialog @confirm="() => deleteCategory(category.id)">
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
  });

  const { data, error } = await useFetch("/api/ticket/category/list");

  const isEmpty = computed(() => categories.value.length === 0);

  const categories = ref(data.value?.data ?? []);
  const isSearchOpen = shallowRef(false);
  const searchQuery = ref("");

  const closeSearch = () => {
    isSearchOpen.value = false;
    searchQuery.value = "";
  };

  watch(searchQuery, (newQuery) => {
    categories.value =
      data.value?.data.filter((category) =>
        category.name.toLowerCase().includes(newQuery.toLowerCase())
      ) ?? [];
  });

  const refreshData = async (data: any) => {
    categories.value.push(data);
  };

  const refreshEditedData = async (newData: any) => {
    const index = categories.value.findIndex((category) => category.id === newData.id);
    if (index !== -1) {
      categories.value[index] = newData;
    }
  };

  const deleteCategory = async (id: number) => {
    const { data, error } = await useFetch(`/api/ticket/category/delete`, {
      method: "DELETE",
      body: { id },
    });

    if (!error.value) {
      categories.value = categories.value.filter((category) => category.id !== id);
    }
  };
</script>

<style scoped></style>
