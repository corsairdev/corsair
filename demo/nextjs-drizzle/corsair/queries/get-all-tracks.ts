import { z } from "corsair";
import { procedure } from "../procedure";

export const getAllTracks = procedure
	.input(z.object({}))
	.query(async ({ input, ctx }) => {
		const tracks = await ctx.db.select().from(ctx.db._.fullSchema.tracks);
		return tracks;
	});
