import { logout } from "~/utils/logout";
import type { SessionContent } from "~/utils/logout";
import type { User } from "~/utils/types/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;
  const user = useUser();

  const publicRoutes = ["/login", "/register"];
  const config = useRuntimeConfig();

  if (publicRoutes.includes(to.path)) {
    return;
  }

  const session = useCookie<SessionContent>("session");

  // No session, login page
  if (!session.value) {
    console.log("No session found");
    return navigateTo("/login");
  }

  try {
    // Session is not correct, logout
    if (!session.value.session_token || !session.value.expires_at) {
      console.log("Session expired/invalid");
      return logout();
    }

    // Fetch user profile to validate token and get profile picture
    // This call is made here because it's avoid to have another one in the header component
    await $fetch<User>(`${config.public.apiBaseUrl}/user/`, {
      headers: {
        Authorization: session.value.session_token,
      },
    })
      .then((data) => {
        user.value = data;
      })
      .catch((err) => {
        console.error("Error fetching user profile", err);
        return logout();
      });
  } catch (e) {
    console.error("Error while parsing session", e);
    return logout();
  }
});
