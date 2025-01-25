import type { User } from "~/utils/definitions/user";

/**
 * @description This is user himself. It is used to store the user data.
 */
export const useUser = () => useState<User | null>("user", () => null);
