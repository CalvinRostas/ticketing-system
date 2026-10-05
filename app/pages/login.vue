<template>
  <div class="flex h-screen items-center justify-between">
    <div class="w-full md:w-1/2">
      <div class="mx-auto w-full max-w-82.5 px-5 space-y-4">
        <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">Log in</h1>
        <p class="text-muted-foreground mt-1">Enter your email & password to log in.</p>

        <form @submit="handleSubmit">
          <fieldset :disabled="false" class="grid gap-5">
            <div>
              <UiInput type="email" name="email" placeholder="Email" v-model="login.email" />
            </div>
            <div>
              <UiInputGroup>
                <UiInputGroupInput :type="showPassword ? 'text' : 'password'" name="password" placeholder="Password"
                  v-model="login.password" />
                <UiInputGroupAddon align="inline-end">
                  <UiInputGroupButton class="rounded-full" size="icon-xs" @click="showPassword = !showPassword">
                    <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" />
                  </UiInputGroupButton>
                </UiInputGroupAddon>
              </UiInputGroup>
            </div>
            <div>
              <UiButton class="text-foreground w-full" type="submit" text="Log in" />
            </div>
          </fieldset>
        </form>
        <GenericError v-if="loginErrors" :error="loginErrors" />
        <p class="text-sm">
          <NuxtLink class="text-primary font-semibold underline-offset-2 hover:underline" to="#">Forgot password?
          </NuxtLink>
        </p>
      </div>
    </div>
    <div class="hidden h-screen md:block md:w-1/2 lg:w-1/2">
      <img :src="loginImage!.src" :alt="loginImage!.alt" class="size-full object-cover" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { z, treeifyError } from "zod";

useSeoMeta({
  title: "Log in",
  description: "Enter your email & password to log in.",
});

definePageMeta({
  layout: "no-layout"
})

const LoginSchema = z.object({
  email: z.email("error.emailRequired"),
  password: z.string().min(4, "error.passwordMinLength"),
});

const login = ref({
  email: "",
  password: "",
});

const loginErrors = ref<any>("")

const showPassword = ref(false);

const loginImages = [
  {
    src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop",
    alt: "Colorful mountain landscape beneath a blue sky",
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
    alt: "Turquoise lake surrounded by green mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1600&auto=format&fit=crop",
    alt: "Bright green valley with mountains and a lake",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
    alt: "Sunlit mountain range under a vivid blue sky",
  },
];

const loginImage = ref(loginImages[0]);

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * loginImages.length)
  loginImage.value = loginImages[randomIndex]
});

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  loginErrors.value = ""

  const parsedData = LoginSchema.safeParse(login.value)
  if (!parsedData.success) {
    loginErrors.value = treeifyError(parsedData.error)
    return
  }

  const { data, error } = await useFetch("/api/auth/login", {
    method: "POST",
    body: parsedData.data
  })

  if (error.value) {
    loginErrors.value = error.value.statusText!
    return
  }

  if (data.value!.user) {
    navigateTo("/")
  }
};
</script>
