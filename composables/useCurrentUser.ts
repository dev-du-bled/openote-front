// Used to define the UI based on the user status

export const userStatus = ref<UserStatus>("none");

export type UserStatus = "student" | "parent" | "teacher" | "admin" | "none";

export const setUserStatus = (status: UserStatus) =>
  (userStatus.value = status);
