import type { ContactField, Person } from '../schema/database';

// Only the entity client is needed here; a structural type keeps the helper
// testable with a stub context and accepts the full plugin context.
export type PersonCacheContext = {
	db: {
		people: {
			findByEntityId: (
				id: string,
			) => Promise<{ data: Person } | null | undefined>;
			// unknown: the entity client's save return type varies by database
			// driver and is never read here.
			upsertByEntityId: (id: string, data: Person) => Promise<unknown>;
		};
	};
};

// Partial identity facts about one person. Every field is optional except the
// person_id key; undefined means "this response said nothing about it".
export type PersonPatch = {
	providerId: string;
	name?: string | null;
	headline?: string | null;
	company?: string | null;
	location?: string | null;
	linkedinUrl?: string | null;
	profileUrl?: string | null;
	githubUrl?: string | null;
	xUrl?: string | null;
	identityVerified?: boolean;
	confidence?: number | null;
	summary?: string | null;
	workEmail?: ContactField;
	personalEmail?: ContactField;
	phone?: ContactField;
	sources?: string[];
};

function merge<T>(
	current: T | undefined,
	incoming: T | undefined,
): T | undefined {
	if (incoming === undefined) return current;
	return incoming;
}

// Saves for one person id run strictly one at a time, so a second enrich
// reads the row the first one wrote instead of a shared stale snapshot.
const saveChains = new Map<string, Promise<void>>();

async function writePerson(
	ctx: PersonCacheContext,
	patch: PersonPatch,
): Promise<void> {
	try {
		// upsertByEntityId replaces the stored JSON. Read the row first so a
		// later enrich does not drop the identity a resolve planted.
		const existing = await ctx.db.people.findByEntityId(patch.providerId);
		const data: Person = {
			...(existing?.data ?? {}),
			personId: patch.providerId,
			updatedAt: new Date(),
		};
		data.name = merge(data.name, patch.name);
		data.headline = merge(data.headline, patch.headline);
		data.company = merge(data.company, patch.company);
		data.location = merge(data.location, patch.location);
		data.linkedinUrl = merge(data.linkedinUrl, patch.linkedinUrl);
		data.profileUrl = merge(data.profileUrl, patch.profileUrl);
		data.githubUrl = merge(data.githubUrl, patch.githubUrl);
		data.xUrl = merge(data.xUrl, patch.xUrl);
		data.identityVerified = merge(
			data.identityVerified,
			patch.identityVerified,
		);
		data.confidence = merge(data.confidence, patch.confidence);
		data.summary = merge(data.summary, patch.summary);
		data.workEmail = merge(data.workEmail, patch.workEmail);
		data.personalEmail = merge(data.personalEmail, patch.personalEmail);
		data.phone = merge(data.phone, patch.phone);
		if (patch.sources !== undefined && patch.sources.length > 0) {
			// Union, not concat: re-resolving the same person must not grow
			// the row with duplicate URLs.
			data.sources = [...new Set([...(data.sources ?? []), ...patch.sources])];
		}

		await ctx.db.people.upsertByEntityId(patch.providerId, data);
	} catch (error) {
		// A failed cache write must not fail the endpoint: the caller already
		// paid ACU for the response. Swallowing here also keeps a rejected
		// link from poisoning the queued saves behind it.
		console.warn(`[ploid] Failed to cache person ${patch.providerId}:`, error);
	}
}

export function rememberPerson(
	ctx: PersonCacheContext,
	patch: PersonPatch,
): Promise<void> {
	// Serialize per person id: two concurrent enriches for one person must
	// not both read the pre-save row and drop each other's contact fields.
	const previous = saveChains.get(patch.providerId) ?? Promise.resolve();
	const next = previous.catch(() => {}).then(() => writePerson(ctx, patch));
	saveChains.set(patch.providerId, next);
	// Drop the tail entry once it settles so the map does not grow unbounded.
	void next.finally(() => {
		if (saveChains.get(patch.providerId) === next) {
			saveChains.delete(patch.providerId);
		}
	});
	return next;
}
