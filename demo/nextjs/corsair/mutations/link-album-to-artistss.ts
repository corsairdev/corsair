import { z } from "corsair/core";
import { mutation } from "../instances";
import { drizzle } from "corsair/db/types";

export const linkAlbumToArtistss = mutation({
  prompt: "link album to artistss",
  input_type: z.object({
    albumId: z.string().min(1, "albumId is required"),
    artistIds: z
      .array(z.string().min(1, "artistId required"))
      .min(1, "At least one artistId required"),
  }),
  pseudocode:
    "Inputs: albumId (string), artistIds (array of string)\nSteps:\n- Check that the album exists with the given albumId; throw if not found\n- Check that all provided artistIds exist; throw with a list of missing artist ids if any are missing\n- Fetch all album_artists rows for these artistIds and albumId to avoid duplicates\n- Prepare insert payload for only those artistIds not already linked\n- Bulk insert new links with Drizzle, collecting inserted records\n- Select and return all current links for this album from album_artists\nOutputs: array of all album_artists links for the album (id, album_id, artist_id)",
  function_name: "link-album-to-artists",

  handler: async (input, ctx) => {
    // Validate album existence
    const [album] = await ctx.db
      .select({ id: ctx.schema.albums.id })
      .from(ctx.schema.albums)
      .where(drizzle.eq(ctx.schema.albums.id, input.albumId))
      .limit(1);
    if (!album) {
      throw new Error("Album not found");
    }

    // Validate all artists exist
    const artists = await ctx.db
      .select({ id: ctx.schema.artists.id })
      .from(ctx.schema.artists)
      .where(drizzle.inArray(ctx.schema.artists.id, input.artistIds));

    const foundArtistIds = new Set(artists.map((a) => a.id));
    const missing = input.artistIds.filter((id) => !foundArtistIds.has(id));
    if (missing.length > 0) {
      throw new Error(`Artist(s) not found: ${missing.join(", ")}`);
    }

    // Find existing links to avoid duplicates
    const existingLinks = await ctx.db
      .select({ artist_id: ctx.schema.album_artists.artist_id })
      .from(ctx.schema.album_artists)
      .where(
        drizzle.and(
          drizzle.eq(ctx.schema.album_artists.album_id, input.albumId),
          drizzle.inArray(ctx.schema.album_artists.artist_id, input.artistIds),
        ),
      );
    const alreadyLinked = new Set(existingLinks.map((e) => e.artist_id));

    // Prepare new links to insert
    const newLinks = input.artistIds
      .filter((artistId) => !alreadyLinked.has(artistId))
      .map((artistId) => ({ album_id: input.albumId, artist_id: artistId }));

    let inserted = [];
    if (newLinks.length > 0) {
      inserted = await ctx.db
        .insert(ctx.schema.album_artists)
        .values(newLinks)
        .returning();
    }

    // Return all links for this album
    const allLinks = await ctx.db
      .select({
        id: ctx.schema.album_artists.id,
        album_id: ctx.schema.album_artists.album_id,
        artist_id: ctx.schema.album_artists.artist_id,
      })
      .from(ctx.schema.album_artists)
      .where(drizzle.eq(ctx.schema.album_artists.album_id, input.albumId));

    return allLinks;
  },
});
