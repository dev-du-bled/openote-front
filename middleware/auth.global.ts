import { setUserStatus } from "~/composables/currentUser";
import { logout } from "~/utils/logout";
import type { SessionContent } from "~/utils/logout";

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.env.SSR) return;

  const config = useRuntimeConfig();
  const publicRoutes = ["/login", "/register"];

  if (publicRoutes.includes(to.path)) {
    return;
  }

  // Move cookie initialization inside middleware
  const session = useCookie<SessionContent>("session");

  if (!session.value) {
    console.log("No session found");
    return navigateTo("/login");
  }

  try {
    if (!session.value.session_token || !session.value.expires_at) {
      console.log("Session expired/invalid");
      return logout();
    }

    const now = new Date().getTime();
    const expiresAt = new Date(session.value.expires_at * 1000).getTime();

    if (now > expiresAt) {
      console.log("Session expired");
      return logout();
    }

    setUserStatus(session.value.role);
    // Session is valid, continue navigation
  } catch (e) {
    console.error("Error while parsing session", e);
    return logout();
  }
});
