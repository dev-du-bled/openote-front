import { setUserStatus } from "~/composables/useCurrentUser";
import { logout } from "~/utils/logout";
import type { SessionContent } from "~/utils/logout";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;

  const config = useRuntimeConfig();
  const publicRoutes = ["/login", "/register"];

  if (publicRoutes.includes(to.path)) {
    return;
  }

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

    // Fetch user profile to validate token and get profile picture
    await $fetch<{ profile_picture: string }>(
      `${window.location.protocol}//${window.location.hostname}:8000/user`,
      {
        headers: {
          Authorization: session.value.session_token,
        },
      }
    )
      .then((data) => {
        setProfilePicture(data.profile_picture);
      })
      .catch((err) => {
        console.error("Error fetching user profile", err);
        return logout();
      });

    setUserStatus(session.value.role);
  } catch (e) {
    console.error("Error while parsing session", e);
    return logout();
  }
});
