<template>
    <div class="w-full">
        <UiCard>
            <UiCardHeader>
                <UiCardTitle>Create ticket</UiCardTitle>
                <UiCardDescription>Enter the details below to create a new ticket.</UiCardDescription>
            </UiCardHeader>
            <UiCardContent>
                <div class="grid sm:grid-cols-2 grid-cols-1 gap-3">
                    <div class="sm:col-span-2">
                        <GenericError v-if="creationError" :error="creationError" />
                    </div>
                    <div class="sm:col-span-2">
                        <div class="space-y-2">
                            <p class="text-muted-foreground">Title</p>
                            <UiInput placeholder="Enter value" v-model="createTicketData.title" />
                        </div>
                    </div>
                    <div>
                        <div class="space-y-2">
                            <p class="text-muted-foreground">Priority</p>
                            <UiDropdownMenu class="w-full" v-model="createTicketData.priority">
                                <UiDropdownMenuTrigger as-child>
                                    <UiButton variant="outline" class="w-full justify-between"
                                        v-if="createTicketData.priority">
                                        {{ getPriorityById(createTicketData.priority).name }}
                                        <Icon name="lucide:chevron-down" class="-me-1 size-4 opacity-60"
                                            aria-hidden="true" />
                                    </UiButton>
                                    <UiButton variant="outline" class="w-full justify-between" v-else>
                                        Select priority
                                        <Icon name="lucide:chevron-down" class="-me-1 size-4 opacity-60"
                                            aria-hidden="true" />
                                    </UiButton>
                                </UiDropdownMenuTrigger>
                                <UiDropdownMenuContent class="min-w-(--reka-dropdown-menu-trigger-width)">
                                    <UiDropdownMenuItem v-for="item in priorities" :key="item.id"
                                        @select="createTicketData.priority = item.id">
                                        <div class="flex items-center gap-2">
                                            <div class="size-2 rounded-full"
                                                :style="{ backgroundColor: item.color ?? 'green' }"></div>
                                            <span>{{ item.name }}</span>
                                        </div>
                                    </UiDropdownMenuItem>
                                </UiDropdownMenuContent>
                            </UiDropdownMenu>
                        </div>
                    </div>
                    <div>
                        <div class="space-y-2">
                            <p class="text-muted-foreground">Status</p>
                            <UiDropdownMenu class="w-full" v-model="createTicketData.status">
                                <UiDropdownMenuTrigger as-child>
                                    <UiButton variant="outline" class="w-full justify-between"
                                        v-if="createTicketData.status">
                                        {{ getStatusById(createTicketData.status).name }}
                                        <Icon name="lucide:chevron-down" class="-me-1 size-4 opacity-60"
                                            aria-hidden="true" />
                                    </UiButton>
                                    <UiButton variant="outline" class="w-full justify-between" v-else>
                                        Select status
                                        <Icon name="lucide:chevron-down" class="-me-1 size-4 opacity-60"
                                            aria-hidden="true" />
                                    </UiButton>
                                </UiDropdownMenuTrigger>
                                <UiDropdownMenuContent class="min-w-(--reka-dropdown-menu-trigger-width)">
                                    <UiDropdownMenuItem v-for="item in statuses" :key="item.id"
                                        @select="createTicketData.status = item.id">
                                        <div class="flex items-center gap-2">
                                            <div class="size-2 rounded-full"
                                                :style="{ backgroundColor: item.color ?? 'green' }"></div>
                                            <span>{{ item.name }}</span>
                                        </div>
                                    </UiDropdownMenuItem>
                                </UiDropdownMenuContent>
                            </UiDropdownMenu>
                        </div>
                    </div>
                    <div>
                        <div class="space-y-2">
                            <p class="text-muted-foreground">Category</p>
                            <UiDropdownMenu class="w-full">
                                <UiDropdownMenuTrigger as-child>
                                    <UiButton variant="outline" class="w-full justify-between"
                                        v-if="createTicketData.categories.length">
                                        {{ getCategoryById(createTicketData.categories[0]!).name }}
                                        <Icon name="lucide:chevron-down" class="-me-1 size-4 opacity-60"
                                            aria-hidden="true" />
                                    </UiButton>
                                    <UiButton variant="outline" class="w-full justify-between" v-else>
                                        Select category
                                        <Icon name="lucide:chevron-down" class="-me-1 size-4 opacity-60"
                                            aria-hidden="true" />
                                    </UiButton>
                                </UiDropdownMenuTrigger>
                                <UiDropdownMenuContent class="min-w-(--reka-dropdown-menu-trigger-width)">
                                    <UiDropdownMenuItem v-for="item in categories" :key="item.id"
                                        @select="createTicketData.categories = [item.id]">
                                        <div class="flex items-center gap-2">
                                            <div class="size-2 rounded-full"
                                                :style="{ backgroundColor: item.color ?? 'green' }"></div>
                                            <span>{{ item.name }}</span>
                                        </div>
                                    </UiDropdownMenuItem>
                                </UiDropdownMenuContent>
                            </UiDropdownMenu>
                        </div>
                    </div>
                    <div>
                        <div class="space-y-2">
                            <p class="text-muted-foreground">Assignee</p>
                            <TicketUserSelect v-model="createTicketData.assignees" :items="assignees" />
                        </div>
                    </div>
                    <div class="md:col-span-1 col-span-2">
                        <div class="space-y-2">
                            <p class="text-muted-foreground">Due Date</p>
                            <div class="flex w-full justify-center">
                                <UiPopover>
                                    <UiPopoverTrigger as-child>
                                        <UiButton variant="outline" class="w-full flex justify-between"><span
                                                v-if="date">{{ date.toLocaleDateString() }}</span> <span v-else>Pick
                                                Date</span>
                                            <Icon class="text-muted-foreground" name="lucide:chevron-down" />
                                        </UiButton>
                                    </UiPopoverTrigger>
                                    <UiPopoverContent class="w-(--reka-popover-trigger-width) p-6">
                                        <div class="flex gap-x-3 max-sm:flex-col max-sm:items-center">
                                            <div class="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
                                                <div class="h-full sm:border-e">
                                                    <div class="flex flex-col gap-1 px-2">
                                                        <UiButton size="sm" variant="ghost" class="w-full justify-start"
                                                            @click="date = new Date()">Today</UiButton>
                                                        <UiButton size="sm" variant="ghost" class="w-full justify-start"
                                                            @click="date = dayjs().add(1, 'day').toDate()">Tomorrow
                                                        </UiButton>
                                                        <UiButton size="sm" variant="ghost" class="w-full justify-start"
                                                            @click="date = dayjs().add(1, 'week').toDate()">Next Week
                                                        </UiButton>
                                                        <UiButton size="sm" variant="ghost" class="w-full justify-start"
                                                            @click="date = dayjs().add(2, 'week').toDate()">2 Weeks
                                                        </UiButton>
                                                        <UiButton size="sm" variant="ghost" class="w-full justify-start"
                                                            @click="date = dayjs().add(1, 'month').toDate()">Next Month
                                                        </UiButton>
                                                        <UiButton size="sm" variant="ghost" class="w-full justify-start"
                                                            @click="date = dayjs().add(3, 'month').toDate()">3 Months
                                                        </UiButton>
                                                        <UiButton size="sm" variant="ghost" class="w-full justify-start"
                                                            @click="date = dayjs().add(1, 'year').toDate()">1 Year
                                                        </UiButton>
                                                    </div>
                                                </div>
                                            </div>
                                            <UiDatepicker ref="datepicker" v-model="date" borderless transparent />
                                        </div>
                                    </UiPopoverContent>
                                </UiPopover>
                            </div>
                        </div>
                    </div>

                    <div class="sm:col-span-2">
                        <div class="space-y-2">
                            <p class="text-muted-foreground">Description</p>
                            <TicketTipTapEditor v-model="createTicketData.description" />
                        </div>
                    </div>
                </div>
            </UiCardContent>
            <UiCardFooter class="flex items-center gap-4">
                <UiButton type="submit" class="text-foreground" @click="handleCreation()">Create Ticket</UiButton>
                <UiButton variant="outline" class="text-foreground">Save as Draft</UiButton>
                <UiButton variant="destructive" class="text-foreground">Cancel</UiButton>
            </UiCardFooter>
        </UiCard>
    </div>
</template>

<script setup lang="ts">
import { treeifyError } from "zod"
import sanitizeHtml from "sanitize-html"
import dayjs from "dayjs";

definePageMeta({
    middleware: "auth",
})

export type CreateTicketData = {
    title: string;
    priority: number | null;
    status: number | null;
    categories: number[];
    assignees: number[];
    description: string;
}

type HelperType = {
    id: number;
    name: string;
    color: string;
}

const { data, error } = await useFetch('/api/internal/ticket/create-options')

const createTicketData = ref<CreateTicketData>({
    title: "",
    priority: null,
    status: null,
    categories: [],
    assignees: [],
    description: "",
})

const categories = ref(data.value?.categories ?? [])
const priorities = ref(data.value?.priorities ?? [])
const statuses = ref(data.value?.statuses ?? [])
const assignees = ref(data.value?.users ?? [])
const creationError = ref()

const date = ref(new Date());
const datepicker = useTemplateRef("datepicker");

watch(date, (newDate) => {
    datepicker.value?.datepickerRef?.move(newDate);
});

const getPriorityById = (priorityId: number): HelperType => {
    const priority = priorities.value.find(p => p.id === priorityId)
    // @ts-ignore - the priority always exists because you can only select priorities that are available in the list
    return priority!
}

const getStatusById = (statusId: number): HelperType => {
    const status = statuses.value.find(s => s.id === statusId)
    // @ts-ignore - the status always exists because you can only select statuses that are available in the list
    return status!
}

const getCategoryById = (categoryId: number): HelperType => {
    const category = categories.value.find(c => c.id === categoryId)
    // @ts-ignore - the category always exists because you can only select categories that are available in the list
    return category!
}

const handleCreation = async () => {
    creationError.value = null
    const sanitizedDescription = sanitizeHtml(createTicketData.value.description)
    const { data, error } = await useFetch('/api/ticket/create', {
        method: 'POST',
        body: { ...createTicketData.value, description: sanitizedDescription, dueDate: date.value }
    })

    if (error.value) {
        // @ts-ignore - if an error is thrown from this endpoint, the data object always exists (Zod error)
        creationError.value = error.value.data.data
    }
}
</script>