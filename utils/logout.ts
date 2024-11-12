import apiUrl from "./apiUrl";
import { setUserStatus, type UserStatus } from "~/composables/currentUser";

type SessionContent = {
  session_token: string;
  expires_at: number;
  role: UserStatus;
};

// Create a function to get the session cookie
const getSession = () => useCookie<SessionContent | null>("session");

const backToLogin = (expired: boolean = false) => {
  setUserStatus("none");
  const session = getSession();
  if (session.value) {
    session.value = null;
  }
  return navigateTo(`login${expired ? "?expired" : "?logout"}`);
};

const logout = async (expired: boolean = true) => {
  const session = getSession();
  const token = session.value?.session_token;

  if (token) {
    await $fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }).catch(() => {}); // Ignore errors if token is invalid/expired
  }
  return backToLogin(expired);
};

export { logout };
export type { SessionContent };
