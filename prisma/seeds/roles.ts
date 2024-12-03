import { Role } from "../../types";

export const roleData = [
	{
		role_name: Role.ADMIN,
	},
	{
		role_name: Role.MODERATOR,
	},
	{
		role_name: Role.CUSTOMER,
	},
] as const;
