<template>
  <div class="flex justify-center">
    <UiAlertDialog v-model:open="open">
      <UiAlertDialogTrigger as-child>
        <slot />
      </UiAlertDialogTrigger>
      <UiAlertDialogContent @escape-key-down="open = false">
        <UiAlertDialogHeader>
          <UiAlertDialogTitle>{{ $t("general.confirm") }}</UiAlertDialogTitle>
          <UiAlertDialogDescription>
            {{ $t("general.confirmationMessage") }}
          </UiAlertDialogDescription>
        </UiAlertDialogHeader>
        <UiAlertDialogFooter>
          <UiAlertDialogCancel @click="() => emits('cancel')" />
          <UiAlertDialogAction @click="() => emits('confirm')" />
        </UiAlertDialogFooter>
      </UiAlertDialogContent>
    </UiAlertDialog>
  </div>
</template>

<script lang="ts" setup>
  const open = ref(false);

  const emits = defineEmits<{
    (e: "confirm"): void;
    (e: "cancel"): void;
  }>();
</script>
