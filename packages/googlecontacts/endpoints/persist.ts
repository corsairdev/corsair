import type { GoogleContactsContext } from '../index';
import type { ContactGroup, Person } from '../types';

export const DEFAULT_PERSON_FIELDS = [
	'names',
	'emailAddresses',
	'phoneNumbers',
];

/** Row keys derived from each People API person field. */
const ROW_KEYS_BY_PERSON_FIELD: Record<string, string[]> = {
	names: ['displayName', 'givenName', 'familyName'],
	emailAddresses: ['primaryEmail', 'emails'],
	phoneNumbers: ['primaryPhone', 'phones'],
	organizations: ['organization', 'jobTitle'],
	photos: ['photoUrl'],
};

function primaryOf<T extends { metadata?: { primary?: boolean } }>(
	values: T[] | undefined,
): T | undefined {
	return values?.find((v) => v.metadata?.primary) ?? values?.[0];
}

async function evict(
	store: { deleteByEntityId: (id: string) => Promise<boolean> },
	entityId: string,
	label: string,
): Promise<void> {
	try {
		await store.deleteByEntityId(entityId);
	} catch (error) {
		console.warn(`Failed to delete ${label} from database:`, error);
	}
}

export async function persistContact(
	ctx: GoogleContactsContext,
	person: Person,
	requestedFields: string[] = DEFAULT_PERSON_FIELDS,
): Promise<void> {
	if (!ctx.db.contacts) return;

	// Sync reads return deleted people as bare tombstones; storing one would
	// leave a blank row that nothing ever cleans up.
	if (person.metadata?.deleted) {
		await evict(ctx.db.contacts, person.resourceName, 'contact');
		return;
	}

	const name = primaryOf(person.names);
	const organization = primaryOf(person.organizations);

	const derived: Record<string, unknown> = {
		displayName: name?.displayName,
		givenName: name?.givenName,
		familyName: name?.familyName,
		primaryEmail: primaryOf(person.emailAddresses)?.value,
		emails: person.emailAddresses
			?.map((e) => e.value)
			.filter((v): v is string => !!v),
		primaryPhone: primaryOf(person.phoneNumbers)?.value,
		phones: person.phoneNumbers
			?.map((p) => p.value)
			.filter((v): v is string => !!v),
		organization: organization?.name,
		jobTitle: organization?.title,
		photoUrl: primaryOf(person.photos)?.url,
	};

	// A field the caller asked for but Google returned empty has been cleared
	// upstream, so it must overwrite. A field never asked for says nothing
	// about the stored value and must be left alone.
	const incoming: Record<string, unknown> = {};
	for (const field of requestedFields) {
		for (const key of ROW_KEYS_BY_PERSON_FIELD[field] ?? []) {
			incoming[key] = derived[key];
		}
	}
	if (person.etag !== undefined) incoming.etag = person.etag;

	try {
		// upsertByEntityId replaces the whole row, so unrequested fields have to
		// be carried over from what is already stored.
		const existing = await ctx.db.contacts.findByEntityId(person.resourceName);
		await ctx.db.contacts.upsertByEntityId(person.resourceName, {
			...existing?.data,
			...incoming,
			resourceName: person.resourceName,
			createdAt: existing?.data.createdAt ?? new Date(),
		});
	} catch (error) {
		console.warn('Failed to save contact to database:', error);
	}
}

export async function persistContacts(
	ctx: GoogleContactsContext,
	people: Person[] | undefined,
	requestedFields?: string[],
): Promise<void> {
	if (!people?.length) return;
	for (const person of people) {
		await persistContact(ctx, person, requestedFields);
	}
}

export async function persistContactGroup(
	ctx: GoogleContactsContext,
	group: ContactGroup,
): Promise<void> {
	if (!ctx.db.contactGroups) return;

	if (group.metadata?.deleted) {
		await evict(ctx.db.contactGroups, group.resourceName, 'contact group');
		return;
	}

	const incoming: Record<string, unknown> = {
		name: group.name,
		formattedName: group.formattedName,
		groupType: group.groupType,
		memberCount: group.memberCount,
	};
	if (group.etag !== undefined) incoming.etag = group.etag;

	try {
		const existing = await ctx.db.contactGroups.findByEntityId(
			group.resourceName,
		);
		await ctx.db.contactGroups.upsertByEntityId(group.resourceName, {
			...existing?.data,
			...incoming,
			resourceName: group.resourceName,
			createdAt: existing?.data.createdAt ?? new Date(),
		});
	} catch (error) {
		console.warn('Failed to save contact group to database:', error);
	}
}
