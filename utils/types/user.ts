export type User = {
  email: string;
  firstname: string;
  lastname: string;
  profile_picture: string;
  pronouns: string;
  role: string;
};
export type UserStatus = "student" | "parent" | "teacher" | "admin" | "none";
