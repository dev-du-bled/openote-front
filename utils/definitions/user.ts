export type User = {
  email: string;
  firstname: string;
  lastname: string;
  profile_picture: string;
  pronouns: string;
  role: UserRole;
};
export type UserRole = "student" | "parent" | "teacher" | "admin" | "none";
