import type { UserStatus } from "./types/user";

type SessionContent = {
  session_token: string;
  expires_at: number;
  role: UserStatus;
};

// Create a function to get the session cookie
const getSession = () => useCookie<SessionContent | null>("session");

const backToLogin = (expired: boolean = false) => {
  const userStatus = useUserStatus();
  userStatus.value = "none";
  const session = getSession();
  if (session.value) {
    session.value = null;
  }
  return navigateTo(`login${expired ? "?expired" : "?logout"}`);
};

const logout = async (expired: boolean = true) => {
  const session = getSession();
  const token = session.value?.session_token;
  const config = useRuntimeConfig();

  if (token) {
    await $fetch(`${config.public.api_base_url}/auth/logout`, {
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
