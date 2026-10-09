<template>
    <div class="flex justify-center">
        <UiAlertDialog v-model:open="alertOpen">
            <UiAlertDialogTrigger as-child>
                <slot />
            </UiAlertDialogTrigger>
            <UiAlertDialogContent @escape-key-down="toggleAlert()">
                <UiAlertDialogTitle v-if="!props.edit">
                    {{ $t('status.createStatus') }}
                </UiAlertDialogTitle>
                <UiAlertDialogTitle v-else>
                    {{ $t('status.editStatus') }}
                </UiAlertDialogTitle>
                <UiAlertDialogDescription v-if="!props.edit">
                    {{ $t('status.createStatusDesc') }}
                </UiAlertDialogDescription>
                <UiAlertDialogDescription v-else>
                    {{ $t('status.editStatusDesc') }}
                </UiAlertDialogDescription>
                <div class="flex gap-3 items-center">
                    <UiInput v-model="statusRef.name" type="text" placeholder="Name" />
                    <UiPopover>
                        <UiPopoverTrigger as-child>
                            <UiButton variant="outline" class="w-fit justify-start gap-2 px-2">
                                <div class="border-input size-4 rounded border" :style="{ backgroundColor: statusRef.color }">
                                </div>
                                <span class="font-mono text-xs">{{ statusRef.color }}</span>
                            </UiButton>
                        </UiPopoverTrigger>
                        <UiPopoverContent class="w-auto p-3" align="start">
                            <UiColorPicker v-model="statusRef.color" format="hex" :show-format-toggle="false" />
                        </UiPopoverContent>
                    </UiPopover>
                </div>
                <UiTextarea v-model="statusRef.description" placeholder="Description" />
                <GenericError :error="statusErrors" v-if="statusErrors" />
                <UiAlertDialogFooter>
                    <UiAlertDialogCancel @click="alertOpen = false" />
                    <UiButton @click="handleSubmit()" v-if="!props.edit">
                        {{ $t('general.create') }}
                    </UiButton>
                    <UiButton @click="handleEdit(props.id!)" v-else>
                        {{ $t('general.edit') }}
                    </UiButton>
                </UiAlertDialogFooter>
            </UiAlertDialogContent>
        </UiAlertDialog>
    </div>
</template>

<script lang="ts" setup>
import { z, treeifyError } from "zod"

const props = withDefaults(defineProps<{
    edit?: boolean
    id?: number
    name?: string
    description?: string
    color?: string
}>(), {
    edit: false
})

const emits = defineEmits<{
    (e: 'action-success', data: { name: string, description?: string, color: string }): void
}>()

const StatusCreateSchema = z.object({
    name: z.string().min(1, "error.nameRequired"),
    description: z.string().optional(),
    color: z.string().min(1, "error.colorRequired")
});

const alertOpen = ref(false);

const statusRef = ref({
    name: props.name ?? "",
    description: props.description ?? "",
    color: props.color ?? "#3B82F6"
})
const statusErrors = ref<any>("")

const toggleAlert = () => {
    statusErrors.value = ""
    alertOpen.value = !alertOpen.value;
}

const handleSubmit = async () => {
    statusErrors.value = ""
    const parsedData = StatusCreateSchema.safeParse(statusRef.value)
    if (!parsedData.success) {
        statusErrors.value = treeifyError(parsedData.error)
        return
    }

    const { data, error } = await useFetch("/api/ticket/status/create", {
        method: "POST",
        body: parsedData.data
    })

    if (error.value) {
        statusErrors.value = error.value.statusText!
        return
    }

    emits('action-success', parsedData.data)
    alertOpen.value = false;
}

const handleEdit = async (id: number) => {
    statusErrors.value = ""
    const parsedData = StatusCreateSchema.safeParse(statusRef.value)
    if (!parsedData.success) {
        statusErrors.value = treeifyError(parsedData.error)
        return
    }

    const { data, error } = await useFetch("/api/ticket/status/edit", {
        method: "PATCH",
        body: { id, ...parsedData.data }
    })

    if (error.value) {
        statusErrors.value = error.value.statusText!
        return
    }

    emits('action-success', parsedData.data)
    alertOpen.value = false;
}


</script>
