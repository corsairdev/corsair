import { procedure } from "@/corsair/procedure";

/**
 * INPUT: {}
 * OUTPUT: Array<{ id: string; name: string | null; email: string; avatar_url: string | null; }>
 *
 * PSEUDO CODE:
 * 1. No input parameters required
 * 2. Query the users table to fetch all users
 * 3. Select only the fields needed for comment author selection (id, name, email, avatar_url)
 * 4. Return the array of user objects for the client
 *
 * USER INSTRUCTIONS: fetch all users for comment author selection
 */
export const getAllUsers = procedure.query(async ({ ctx }) => {
	const users = await ctx.db
		.select({
			id: ctx.db._.fullSchema.users.id,
			name: ctx.db._.fullSchema.users.name,
			email: ctx.db._.fullSchema.users.email,
			avatar_url: ctx.db._.fullSchema.users.avatar_url,
		})
		.from(ctx.db._.fullSchema.users);

	return users;
});
