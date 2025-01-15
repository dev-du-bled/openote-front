import type { User, UserStatus } from "~/utils/types/user";

export const useUserStatus = () =>
  useState<UserStatus>("userStatus", () => "none");
export const useUserProfilePicture = () =>
  useState<string | null>("userProfilePicture", () => null);
export const useUser = () => useState<User | null>("user", () => null);
