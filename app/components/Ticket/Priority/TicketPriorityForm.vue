<template>
  <div class="flex justify-center">
    <UiAlertDialog v-model:open="alertOpen">
      <UiAlertDialogTrigger as-child>
        <slot />
      </UiAlertDialogTrigger>
      <UiAlertDialogContent @escape-key-down="toggleAlert()">
        <UiAlertDialogTitle v-if="!props.edit">
          {{ $t("priority.createPriority") }}
        </UiAlertDialogTitle>
        <UiAlertDialogTitle v-else>
          {{ $t("priority.editPriority") }}
        </UiAlertDialogTitle>
        <UiAlertDialogDescription v-if="!props.edit">
          {{ $t("priority.createPriorityDesc") }}
        </UiAlertDialogDescription>
        <UiAlertDialogDescription v-else>
          {{ $t("priority.editPriorityDesc") }}
        </UiAlertDialogDescription>
        <div class="flex items-center gap-3">
          <UiInput v-model="priorityRef.name" type="text" placeholder="Name" />
          <UiPopover>
            <UiPopoverTrigger as-child>
              <UiButton variant="outline" class="w-fit justify-start gap-2 px-2">
                <div
                  class="border-input size-4 rounded border"
                  :style="{ backgroundColor: priorityRef.color }"
                ></div>
                <span class="font-mono text-xs">{{ priorityRef.color }}</span>
              </UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent class="w-auto p-3" align="start">
              <UiColorPicker v-model="priorityRef.color" format="hex" :show-format-toggle="false" />
            </UiPopoverContent>
          </UiPopover>
        </div>
        <UiTextarea v-model="priorityRef.description" placeholder="Description" />
        <GenericError :error="priorityErrors" v-if="priorityErrors" />
        <UiAlertDialogFooter>
          <UiAlertDialogCancel @click="alertOpen = false" />
          <UiButton @click="handleSubmit()" v-if="!props.edit">
            {{ $t("general.create") }}
          </UiButton>
          <UiButton @click="handleEdit(props.id!)" v-else>
            {{ $t("general.edit") }}
          </UiButton>
        </UiAlertDialogFooter>
      </UiAlertDialogContent>
    </UiAlertDialog>
  </div>
</template>

<script lang="ts" setup>
  import { z, treeifyError } from "zod";

  const props = withDefaults(
    defineProps<{
      edit?: boolean;
      id?: number;
      name?: string;
      description?: string;
      color?: string;
    }>(),
    {
      edit: false,
    }
  );

  const emits = defineEmits<{
    (e: "action-success", data: { name: string; description?: string; color: string }): void;
  }>();

  const PriorityCreateSchema = z.object({
    name: z.string().min(1, "error.nameRequired"),
    description: z.string().optional(),
    color: z.string().min(1, "error.colorRequired"),
  });

  const alertOpen = ref(false);

  const priorityRef = ref({
    name: props.name ?? "",
    description: props.description ?? "",
    color: props.color ?? "#3B82F6",
  });
  const priorityErrors = ref<any>("");

  const toggleAlert = () => {
    priorityErrors.value = "";
    alertOpen.value = !alertOpen.value;
  };

  const handleSubmit = async () => {
    priorityErrors.value = "";
    const parsedData = PriorityCreateSchema.safeParse(priorityRef.value);
    if (!parsedData.success) {
      priorityErrors.value = treeifyError(parsedData.error);
      return;
    }

    const { data, error } = await useFetch("/api/ticket/priority/create", {
      method: "POST",
      body: parsedData.data,
    });

    if (error.value) {
      priorityErrors.value = error.value.statusText!;
      return;
    }

    emits("action-success", parsedData.data);
    alertOpen.value = false;
  };

  const handleEdit = async (id: number) => {
    priorityErrors.value = "";
    const parsedData = PriorityCreateSchema.safeParse(priorityRef.value);
    if (!parsedData.success) {
      priorityErrors.value = treeifyError(parsedData.error);
      return;
    }

    const { data, error } = await useFetch("/api/ticket/priority/edit", {
      method: "PATCH",
      body: { id, ...parsedData.data },
    });

    if (error.value) {
      priorityErrors.value = error.value.statusText!;
      return;
    }

    emits("action-success", parsedData.data);
    alertOpen.value = false;
  };
</script>
