<template>
  <div class="flex justify-center">
    <UiAlertDialog v-model:open="alertOpen">
      <UiAlertDialogTrigger as-child>
        <slot />
      </UiAlertDialogTrigger>
      <UiAlertDialogContent @escape-key-down="toggleAlert()">
        <UiAlertDialogTitle v-if="!props.edit">
          {{ $t("category.createCategory") }}
        </UiAlertDialogTitle>
        <UiAlertDialogTitle v-else>
          {{ $t("category.editCategory") }}
        </UiAlertDialogTitle>
        <UiAlertDialogDescription v-if="!props.edit">
          {{ $t("category.createCategoryDesc") }}
        </UiAlertDialogDescription>
        <UiAlertDialogDescription v-else>
          {{ $t("category.editCategoryDesc") }}
        </UiAlertDialogDescription>
        <div class="flex items-center gap-3">
          <UiInput v-model="categoryRef.name" type="text" placeholder="Name" />
          <UiPopover>
            <UiPopoverTrigger as-child>
              <UiButton variant="outline" class="w-fit justify-start gap-2 px-2">
                <div
                  class="border-input size-4 rounded border"
                  :style="{ backgroundColor: categoryRef.color }"
                ></div>
                <span class="font-mono text-xs">{{ categoryRef.color }}</span>
              </UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent class="w-auto p-3" align="start">
              <UiColorPicker v-model="categoryRef.color" format="hex" :show-format-toggle="false" />
            </UiPopoverContent>
          </UiPopover>
        </div>
        <UiTextarea v-model="categoryRef.description" placeholder="Description" />
        <GenericError :error="categoryErrors" v-if="categoryErrors" />
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

  const CategoryCreateSchema = z.object({
    name: z.string().min(1, "error.nameRequired"),
    description: z.string().optional(),
    color: z.string().min(1, "error.colorRequired"),
  });

  const alertOpen = ref(false);

  const categoryRef = ref({
    name: props.name ?? "",
    description: props.description ?? "",
    color: props.color ?? "#3B82F6",
  });
  const categoryErrors = ref<any>("");

  const toggleAlert = () => {
    categoryErrors.value = "";
    alertOpen.value = !alertOpen.value;
  };

  const handleSubmit = async () => {
    categoryErrors.value = "";
    const parsedData = CategoryCreateSchema.safeParse(categoryRef.value);
    if (!parsedData.success) {
      categoryErrors.value = treeifyError(parsedData.error);
      return;
    }

    const { data, error } = await useFetch("/api/ticket/category/create", {
      method: "POST",
      body: parsedData.data,
    });

    if (error.value) {
      categoryErrors.value = error.value.statusText!;
      return;
    }

    emits("action-success", parsedData.data);
    alertOpen.value = false;
  };

  const handleEdit = async (id: number) => {
    categoryErrors.value = "";
    const parsedData = CategoryCreateSchema.safeParse(categoryRef.value);
    if (!parsedData.success) {
      categoryErrors.value = treeifyError(parsedData.error);
      return;
    }

    const { data, error } = await useFetch("/api/ticket/category/edit", {
      method: "PATCH",
      body: { id, ...parsedData.data },
    });

    if (error.value) {
      categoryErrors.value = error.value.statusText!;
      return;
    }

    emits("action-success", parsedData.data);
    alertOpen.value = false;
  };
</script>
