import type { GoogleContactsContext } from '../index';
import type { ContactGroup, Person } from '../types';

export const DEFAULT_PERSON_FIELDS = [
	'names',
	'emailAddresses',
	'phoneNumbers',
];

function primaryOf<T extends { metadata?: { primary?: boolean } }>(
	values: T[] | undefined,
): T | undefined {
	return values?.find((v) => v.metadata?.primary) ?? values?.[0];
}

function definedOnly<T extends Record<string, unknown>>(row: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(row).filter(([, v]) => v !== undefined),
	) as Partial<T>;
}

export async function persistContact(
	ctx: GoogleContactsContext,
	person: Person,
): Promise<void> {
	if (!ctx.db.contacts) return;

	// Sync reads return deleted people as bare tombstones; storing one would
	// leave a blank row that nothing ever cleans up.
	if (person.metadata?.deleted) {
		try {
			await ctx.db.contacts.deleteByEntityId(person.resourceName);
		} catch (error) {
			console.warn('Failed to delete contact from database:', error);
		}
		return;
	}

	const name = primaryOf(person.names);
	const organization = primaryOf(person.organizations);

	const incoming = definedOnly({
		etag: person.etag,
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
	});

	try {
		// upsertByEntityId replaces the whole row, so a narrow readMask would
		// wipe fields an earlier wider read stored.
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
): Promise<void> {
	if (!people?.length) return;
	for (const person of people) {
		await persistContact(ctx, person);
	}
}

export async function persistContactGroup(
	ctx: GoogleContactsContext,
	group: ContactGroup,
): Promise<void> {
	if (!ctx.db.contactGroups) return;

	const incoming = definedOnly({
		etag: group.etag,
		name: group.name,
		formattedName: group.formattedName,
		groupType: group.groupType,
		memberCount: group.memberCount,
	});

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
