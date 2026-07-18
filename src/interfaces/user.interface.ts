export type UserRole = "admin" | "owner" | "user";

export interface IUser {
  id: number;
  name: string;
  role: UserRole;
  createdAt: Date;
}
