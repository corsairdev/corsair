import type { ContactField, Person } from '../schema/database';

// Only the entity client is needed here; a structural type keeps the helper
// testable with a stub context and accepts the full plugin context.
export type PersonCacheContext = {
	db: {
		people: {
			findByEntityId: (
				id: string,
			) => Promise<{ data: Person } | null | undefined>;
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

export async function rememberPerson(
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
			data.sources = [...(data.sources ?? []), ...patch.sources];
		}

		await ctx.db.people.upsertByEntityId(patch.providerId, data);
	} catch (error) {
		// A failed cache write must not fail the endpoint: the caller already
		// paid ACU for the response.
		console.warn(`[ploid] Failed to cache person ${patch.providerId}:`, error);
	}
}
