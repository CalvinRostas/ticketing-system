export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn } = useUserSession();
  const localePath = useLocalePath();

  if (!loggedIn.value) {
    return navigateTo(localePath("/login"));
  }
});
