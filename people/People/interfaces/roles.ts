export interface Role {
  name: string;
  permissions: string[];
  rank: number;
}

export type AllowedRoles = "hyperuser" | "superuser" | "user";
