<template>
  <div class="w-full space-y-3 md:flex md:gap-3">
    <div class="ticket-main-content w-full md:w-[60%]">
      <UiCard>
        <UiCardHeader>
          <UiCardTitle class="space-y-3">
            <h1 class="text-2xl">
              {{ ticket.title }}
              <span class="text-muted-foreground text-sm italic">- #{{ ticket.id }}</span>
            </h1>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UiAvatar>
                  <UiAvatarImage
                    src="https://www.gravatar.com/avatar/{{ ticket.author.email }}"
                    alt="{{ ticket.author.firstname }} {{ ticket.author.lastname }}"
                  />
                  <UiAvatarFallback>
                    {{ ticket.author.firstname?.[0] }}{{ ticket.author.lastname?.[0] }}
                  </UiAvatarFallback>
                </UiAvatar>
                <p class="text-muted-foreground font-normal">
                  {{ ticket.author.firstname }} {{ ticket.author.lastname }}
                </p>
              </div>
              <p class="text-muted-foreground text-sm font-normal italic">
                Created On: {{ new Date(ticket.createdAt).toLocaleString(locale) }}
              </p>
            </div>
          </UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <div class="mb-5 grid grid-cols-2 gap-3">
            <div>
              <p class="text-muted-foreground mb-2">Assignees:</p>
              <template v-if="ticket.assignees.length > 0">
                <template v-for="(assignee, index) in ticket.assignees" :key="assignee.id">
                  <div class="mb-2 flex items-center gap-2" v-if="index < 2">
                    <UiAvatar>
                      <UiAvatarImage
                        src="https://www.gravatar.com/avatar/{{ assignee.email }}"
                        alt="{{ assignee.firstname }} {{ assignee.lastname }}"
                      />
                      <UiAvatarFallback>
                        {{ assignee.firstname?.[0] }}{{ assignee.lastname?.[0] }}
                      </UiAvatarFallback>
                    </UiAvatar>
                    <p>{{ assignee.firstname }} {{ assignee.lastname }}</p>
                  </div>
                  <div v-else-if="index === 2">
                    <UiPopover>
                      <UiPopoverTrigger>
                        <p class="text-muted-foreground underline">
                          +{{ ticket.assignees.length - 2 }} more
                        </p>
                      </UiPopoverTrigger>
                      <UiPopoverContent>
                        <ul>
                          <li
                            v-for="(assignee, index) in ticket.assignees"
                            :key="assignee.id"
                            v-if="index >= 2"
                          >
                            {{ assignee.firstname }} {{ assignee.lastname }}
                          </li>
                        </ul>
                      </UiPopoverContent>
                    </UiPopover>
                  </div>
                </template>
              </template>
              <template v-else>
                <p class="text-muted-foreground">No assignees</p>
              </template>
            </div>
            <div>
              <p class="text-muted-foreground mb-2">Due Date:</p>
              <p>{{ new Date(ticket.dueDate).toLocaleDateString(locale) }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3">
            <div class="max-md:mb-3">
              <p class="text-muted-foreground mb-1">Priority:</p>
              <UtilBadge :label="ticket.priority.name" :color="ticket.priority.color" />
            </div>
            <div class="max-md:mb-3">
              <p class="text-muted-foreground mb-1">Status:</p>
              <UtilBadge :label="ticket.status.name" :color="ticket.status.color" />
            </div>
            <div class="max-md:mb-3">
              <p class="text-muted-foreground mb-1">Categories:</p>
              <div class="flex flex-wrap gap-3" v-for="cat in ticket.categories" :key="cat.id">
                <UtilBadge :label="cat.name" :color="cat.color" />
              </div>
            </div>
          </div>
          <div class="mt-5 w-full">
            <h3 class="text-muted-foreground">Description</h3>
            <UiDivider class="my-2" />
            <p v-html="sanitizeHtml(ticket.description)" />
          </div>
        </UiCardContent>
        <UiCardFooter>
          <div class="flex w-full items-center gap-3">
            <UiButton> <Icon name="lucide:check" /> Close Ticket </UiButton>
            <UiButton variant="outline"> <Icon name="lucide:pen" /> Edit Ticket </UiButton>
            <UiButton variant="destructive"> <Icon name="lucide:trash" /> Delete Ticket </UiButton>
          </div>
        </UiCardFooter>
      </UiCard>
    </div>
    <div class="ticket-side-content w-full md:w-[40%]">
      <h1 class="mb-2 text-xl">
        Comments
        <span class="text-muted-foreground text-sm"> - {{ ticket.comments.length }} total</span>
      </h1>
      <UiButton size="sm" v-if="!showAddComment" @click="showAddComment = true"
        >Add Comment</UiButton
      >
      <UiTextarea v-if="showAddComment" v-model="newCommentContent" />
      <p v-if="commentError" class="mt-1 text-sm text-red-500">{{ $t("error.noEmptyComment") }}</p>
      <div class="mt-2 flex gap-2">
        <UiButton size="sm" v-if="showAddComment" variant="outline" @click="showAddComment = false"
          >Cancel
        </UiButton>
        <UiButton size="sm" v-if="showAddComment" @click="addComment()">Submit</UiButton>
      </div>
      <TicketCommentRenderer :comments="ticketComments" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import sanitizeHtml from "sanitize-html";
  import { z } from "zod";

  definePageMeta({
    middleware: "auth",
  });

  const { user } = useUserSession();

  const createCommentSchema = z.string().min(1, "error.noEmptyComment");

  const { locale } = useI18n();

  const { data, error } = await useFetch(`/api/ticket/${useRoute().params.id}`);

  const ticket = ref(data.value.data);

  const ticketComments = ref(ticket.value.comments);

  const showAddComment = ref(false);
  const newCommentContent = ref("");
  const commentError = ref("");

  const addComment = async () => {
    const parsed = createCommentSchema.safeParse(newCommentContent.value);
    if (!parsed.success) {
      console.error(parsed.error);
      commentError.value = parsed.error.message;
      return;
    }

    try {
      const { data: response, error: e } = await useFetch(`/api/ticket/comment/create`, {
        method: "POST",
        body: {
          content: newCommentContent.value,
          authorId: user.value.id,
          ticketId: Number(useRoute().params.id),
        },
      });

      if (e.value) {
        console.error(e.value);
        commentError.value = e.value.message;
        return;
      }

      ticketComments.value.push(response.value!.data);
      newCommentContent.value = "";
      showAddComment.value = false;
    } catch (err: Error) {
      console.error(err);
      commentError.value = err.message;
    }
  };
</script>

<style scoped></style>
