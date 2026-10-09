<template>
  <div class="space-y-5">
    <h1 class="text-2xl font-bold">Hey, {{ user?.firstname }}</h1>
    <div class="grid w-full grid-cols-1 items-center gap-3 md:grid-cols-3">
      <UiCard>
        <UiCardContent>
          <div class="flex items-center gap-5 font-bold">
            <div class="text-muted-foreground rounded-md border p-3">
              <Icon name="lucide:notepad-text" class="size-6" />
            </div>
            <div>
              <h1 class="text-primary text-2xl">{{ data?.openTickets.length ?? 0 }}</h1>
              <p class="text-muted-foreground">Open Tickets</p>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
      <UiCard>
        <UiCardContent>
          <div class="flex items-center gap-5 font-bold">
            <div class="text-muted-foreground rounded-md border p-3">
              <Icon name="lucide:folder-kanban" class="size-6" />
            </div>
            <div>
              <h1 class="text-2xl text-(--chart-4)">{{ data?.openTickets.length ?? 0 }}</h1>
              <p class="text-muted-foreground">Assigned Projects</p>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
      <UiCard>
        <UiCardContent>
          <div class="flex items-center gap-5 font-bold">
            <div class="text-muted-foreground rounded-md border p-3">
              <Icon name="lucide:clock" class="size-6" />
            </div>
            <div>
              <h1 class="text-destructive text-2xl">{{ data?.openTickets.length ?? 0 }}</h1>
              <p class="text-muted-foreground">Overdue Tickets</p>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>
    <UiTable>
      <UiTableHeader>
        <UiTableRow class="hover:bg-transparent">
          <UiTableHead>ID</UiTableHead>
          <UiTableHead>Title</UiTableHead>
          <UiTableHead>Description</UiTableHead>
          <UiTableHead>Priority</UiTableHead>
          <UiTableHead>Status</UiTableHead>
          <UiTableHead>Due Date</UiTableHead>
          <UiTableHead class="text-right">Category</UiTableHead>
          <UiTableHead class="text-right">Assignee</UiTableHead>
        </UiTableRow>
      </UiTableHeader>
      <tbody aria-hidden="true" class="table-row h-2" />
      <UiTableBody class="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
        <UiTableRow
          v-for="item in ticketData?.data"
          :key="item.id"
          class="odd:bg-muted/50 odd:hover:bg-muted/90 hover:bg-muted/90 cursor-pointer border-none"
          @click="navigateTo($localePath(`/ticket/${item.id}`))"
        >
          <UiTableCell class="py-2.5">{{ item.id }}</UiTableCell>
          <UiTableCell class="py-2.5 font-medium">{{ item.title }}</UiTableCell>
          <UiTableCell class="py-2.5">{{ formatDescription(item.description!) }}</UiTableCell>
          <UiTableCell class="py-2.5">
            <UtilBadge :label="item.priority.name" :color="item.priority.color!" />
          </UiTableCell>
          <UiTableCell class="py-2.5">
            <UtilBadge :label="item.status.name" :color="item.status.color!" />
          </UiTableCell>
          <UiTableCell class="py-2.5">{{
            new Date(item.dueDate as string).toLocaleDateString(locale)
          }}</UiTableCell>
          <UiTableCell class="py-2.5 text-right">{{
            item.categories.map((c) => c.name).join(", ")
          }}</UiTableCell>
          <UiTableCell class="flex items-center justify-end gap-4 py-2.5 text-right">
            <template v-if="item.assignees">
              <div
                class="flex flex-wrap items-center gap-2"
                v-for="assignee in item.assignees"
                :key="assignee.id"
                v-if="item.assignees.length < 2"
              >
                <UiAvatar :src="assignee.avatarUrl">
                  <UiAvatarFallback>
                    {{ assignee.firstname!.charAt(0) }}{{ assignee.lastname!.charAt(0) }}
                  </UiAvatarFallback>
                </UiAvatar>
                <span>{{ assignee.firstname }}</span>
              </div>
              <UiAvatarGroup class="grayscale" v-else>
                <UiAvatar v-for="assignee in item.assignees" :key="assignee.id">
                  <UiAvatarImage :src="assignee.avatarUrl" :alt="assignee.firstname!" />
                  <UiAvatarFallback
                    >{{ assignee.firstname!.charAt(0)
                    }}{{ assignee.lastname!.charAt(0) }}</UiAvatarFallback
                  >
                </UiAvatar>
              </UiAvatarGroup>
            </template>
          </UiTableCell>
        </UiTableRow>
      </UiTableBody>
      <tbody aria-hidden="true" class="table-row h-2" />
      <UiTableFooter class="border-t-0 bg-transparent">
        <p>FOOTER</p>
      </UiTableFooter>
    </UiTable>
    <p>Hey</p>
    <p>{{ loggedIn }}</p>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
  });

  const { loggedIn, user } = useUserSession();
  const { locale } = useI18n();

  const { data, error } = await useFetch("/api/internal/user/overview");
  if (error.value) {
    console.error(error.value);
  }

  const { data: ticketData, error: ticketError } = await useFetch("/api/ticket/list", {
    method: "GET",
    params: {
      page: 1,
      pageSize: 10,
      author: user.value?.id,
      isClosed: false,
    },
  });

  const formatDescription = (description: string) => {
    description = description.replace(/<\/?[^>]+(>|$)/g, ""); // Remove all HTML tags
    if (!description) return "";
    if (description.length <= 50) return description;
    return description.slice(0, 50) + "...";
  };
</script>

<style scoped></style>
