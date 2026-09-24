import { z } from 'zod';
import type {
	ContactGroup,
	ListConnectionsResponse,
	ListContactGroupsResponse,
	ListOtherContactsResponse,
	ModifyContactGroupMembersResponse,
	Person,
	SearchResponse,
} from '../types';

// ─── Shared sub-schemas ───────────────────────────────────────────────────────

const FieldMetadataSchema = z.object({
	primary: z.boolean().optional(),
	verified: z.boolean().optional(),
	source: z
		.object({ type: z.string().optional(), id: z.string().optional() })
		.optional(),
});

const PersonNameSchema = z.object({
	metadata: FieldMetadataSchema.optional(),
	displayName: z.string().optional(),
	familyName: z.string().optional(),
	givenName: z.string().optional(),
	middleName: z.string().optional(),
	honorificPrefix: z.string().optional(),
	honorificSuffix: z.string().optional(),
});

const EmailAddressSchema = z.object({
	metadata: FieldMetadataSchema.optional(),
	value: z.string().optional(),
	type: z.string().optional().describe('e.g. "home", "work", "other"'),
	displayName: z.string().optional(),
});

const PhoneNumberSchema = z.object({
	metadata: FieldMetadataSchema.optional(),
	value: z.string().optional(),
	canonicalForm: z.string().optional(),
	type: z.string().optional().describe('e.g. "mobile", "home", "work"'),
});

const OrganizationSchema = z.object({
	metadata: FieldMetadataSchema.optional(),
	name: z.string().optional(),
	title: z.string().optional(),
	department: z.string().optional(),
});

const AddressSchema = z.object({
	metadata: FieldMetadataSchema.optional(),
	formattedValue: z.string().optional(),
	streetAddress: z.string().optional(),
	city: z.string().optional(),
	region: z.string().optional(),
	postalCode: z.string().optional(),
	country: z.string().optional(),
	countryCode: z.string().optional(),
	type: z.string().optional(),
});

const PhotoSchema = z.object({
	metadata: FieldMetadataSchema.optional(),
	url: z.string().optional(),
	default: z.boolean().optional(),
});

const BiographySchema = z.object({
	metadata: FieldMetadataSchema.optional(),
	value: z.string().optional(),
	contentType: z.string().optional(),
});

const MembershipSchema = z.object({
	metadata: FieldMetadataSchema.optional(),
	contactGroupMembership: z
		.object({
			contactGroupId: z.string().optional(),
			contactGroupResourceName: z.string().optional(),
		})
		.optional(),
});

const PersonSchema = z.object({
	resourceName: z.string(),
	etag: z.string().optional(),
	metadata: z
		.object({
			sources: z
				.array(
					z.object({
						type: z.string().optional(),
						id: z.string().optional(),
						etag: z.string().optional(),
					}),
				)
				.optional(),
			deleted: z.boolean().optional(),
			objectType: z.string().optional(),
		})
		.optional(),
	names: z.array(PersonNameSchema).optional(),
	emailAddresses: z.array(EmailAddressSchema).optional(),
	phoneNumbers: z.array(PhoneNumberSchema).optional(),
	organizations: z.array(OrganizationSchema).optional(),
	addresses: z.array(AddressSchema).optional(),
	photos: z.array(PhotoSchema).optional(),
	biographies: z.array(BiographySchema).optional(),
	memberships: z.array(MembershipSchema).optional(),
});

/** Fields the API accepts on write; server-managed fields are rejected. */
const WritablePersonSchema = z.object({
	names: z.array(PersonNameSchema).optional(),
	emailAddresses: z.array(EmailAddressSchema).optional(),
	phoneNumbers: z.array(PhoneNumberSchema).optional(),
	organizations: z.array(OrganizationSchema).optional(),
	addresses: z.array(AddressSchema).optional(),
	biographies: z.array(BiographySchema).optional(),
});

const ContactGroupSchema = z.object({
	resourceName: z.string(),
	etag: z.string().optional(),
	metadata: z
		.object({
			updateTime: z.string().optional(),
			deleted: z.boolean().optional(),
		})
		.optional(),
	groupType: z.string().optional(),
	name: z.string().optional(),
	formattedName: z.string().optional(),
	memberResourceNames: z.array(z.string()).optional(),
	memberCount: z.number().optional(),
});

const personFields = z
	.array(z.string())
	.optional()
	.describe(
		'Person fields to return, e.g. ["names","emailAddresses","phoneNumbers"]. Defaults to names, emailAddresses and phoneNumbers.',
	);

// ─── contacts ─────────────────────────────────────────────────────────────────

const ContactsListInputSchema = z.object({
	personFields,
	pageSize: z.number().min(1).max(1000).optional(),
	pageToken: z.string().optional(),
	sortOrder: z
		.enum([
			'LAST_MODIFIED_ASCENDING',
			'LAST_MODIFIED_DESCENDING',
			'FIRST_NAME_ASCENDING',
			'LAST_NAME_ASCENDING',
		])
		.optional(),
	requestSyncToken: z
		.boolean()
		.optional()
		.describe(
			'Return a nextSyncToken for incremental reads. Expires after 7 days.',
		),
	syncToken: z
		.string()
		.optional()
		.describe(
			'Return only changes since this token. Expired tokens 400; re-list in full.',
		),
});

const ContactsGetInputSchema = z.object({
	resourceName: z
		.string()
		.describe('e.g. "people/c123456789" or "people/me" for the signed-in user'),
	personFields,
});

const ContactsSearchInputSchema = z.object({
	query: z
		.string()
		.describe('Prefix-matched against names, nicknames, emails and phones'),
	readMask: personFields,
	pageSize: z.number().min(1).max(30).optional(),
});

const ContactsCreateInputSchema = z.object({
	person: WritablePersonSchema,
	personFields,
});

const ContactsUpdateInputSchema = z.object({
	resourceName: z.string(),
	etag: z
		.string()
		.describe('etag from a prior read; the API rejects updates without it'),
	person: WritablePersonSchema,
	updatePersonFields: z
		.array(z.string())
		.min(1)
		.describe(
			'Fields to overwrite, e.g. ["emailAddresses"]. Omitted fields are left untouched.',
		),
	personFields,
});

const ContactsDeleteInputSchema = z.object({
	resourceName: z.string(),
});

const ContactsUpdatePhotoInputSchema = z.object({
	resourceName: z.string(),
	photoBytes: z.string().describe('Base64-encoded image'),
	personFields,
});

const ContactsDeletePhotoInputSchema = z.object({
	resourceName: z.string(),
	personFields,
});

// ─── otherContacts ────────────────────────────────────────────────────────────

/**
 * "Other contacts" are auto-saved addresses the user never filed. Google only
 * serves this restricted field set for them.
 */
const OtherContactsReadMaskSchema = z
	.array(z.enum(['emailAddresses', 'metadata', 'names', 'phoneNumbers']))
	.optional();

const OtherContactsListInputSchema = z.object({
	readMask: OtherContactsReadMaskSchema,
	pageSize: z.number().min(1).max(1000).optional(),
	pageToken: z.string().optional(),
	requestSyncToken: z
		.boolean()
		.optional()
		.describe(
			'Return a nextSyncToken for incremental reads. Expires after 7 days.',
		),
	syncToken: z
		.string()
		.optional()
		.describe(
			'Return only changes since this token. Deleted contacts come back with metadata.deleted set.',
		),
});

const OtherContactsSearchInputSchema = z.object({
	query: z.string(),
	readMask: OtherContactsReadMaskSchema,
	pageSize: z.number().min(1).max(30).optional(),
});

const OtherContactsCopyInputSchema = z.object({
	resourceName: z.string().describe('e.g. "otherContacts/c123456789"'),
	copyMask: z
		.array(z.enum(['emailAddresses', 'names', 'phoneNumbers']))
		.optional()
		.describe('Fields to carry over. Google permits only these three.'),
	personFields,
});

// ─── contactGroups ────────────────────────────────────────────────────────────

const ContactGroupsListInputSchema = z.object({
	pageSize: z.number().min(1).max(1000).optional(),
	pageToken: z.string().optional(),
	syncToken: z.string().optional(),
	groupFields: z.array(z.string()).optional(),
});

const ContactGroupsGetInputSchema = z.object({
	resourceName: z.string().describe('e.g. "contactGroups/myContacts"'),
	maxMembers: z.number().optional(),
	groupFields: z.array(z.string()).optional(),
});

const ContactGroupsCreateInputSchema = z.object({
	name: z.string(),
});

const ContactGroupsUpdateInputSchema = z.object({
	resourceName: z.string(),
	etag: z.string(),
	name: z.string(),
});

const ContactGroupsDeleteInputSchema = z.object({
	resourceName: z.string(),
	deleteContacts: z
		.boolean()
		.optional()
		.describe('Also delete the contacts in the group, not just the group'),
});

const ContactGroupsModifyMembersInputSchema = z.object({
	resourceName: z.string(),
	resourceNamesToAdd: z.array(z.string()).optional(),
	resourceNamesToRemove: z.array(z.string()).optional(),
});

// ─── Response schemas ─────────────────────────────────────────────────────────

const ListConnectionsResponseSchema = z.object({
	connections: z.array(PersonSchema).optional(),
	nextPageToken: z.string().optional(),
	nextSyncToken: z.string().optional(),
	totalPeople: z.number().optional(),
	totalItems: z.number().optional(),
});

const ListOtherContactsResponseSchema = z.object({
	otherContacts: z.array(PersonSchema).optional(),
	nextPageToken: z.string().optional(),
	nextSyncToken: z.string().optional(),
	totalSize: z.number().optional(),
});

const SearchResponseSchema = z.object({
	results: z.array(z.object({ person: PersonSchema.optional() })).optional(),
});

const ListContactGroupsResponseSchema = z.object({
	contactGroups: z.array(ContactGroupSchema).optional(),
	nextPageToken: z.string().optional(),
	nextSyncToken: z.string().optional(),
	totalItems: z.number().optional(),
});

const ModifyContactGroupMembersResponseSchema = z.object({
	notFoundResourceNames: z.array(z.string()).optional(),
	canNotRemoveLastContactGroupResourceNames: z.array(z.string()).optional(),
});

export type GoogleContactsEndpointInputs = {
	contactsList: z.infer<typeof ContactsListInputSchema>;
	contactsGet: z.infer<typeof ContactsGetInputSchema>;
	contactsSearch: z.infer<typeof ContactsSearchInputSchema>;
	contactsCreate: z.infer<typeof ContactsCreateInputSchema>;
	contactsUpdate: z.infer<typeof ContactsUpdateInputSchema>;
	contactsDelete: z.infer<typeof ContactsDeleteInputSchema>;
	contactsUpdatePhoto: z.infer<typeof ContactsUpdatePhotoInputSchema>;
	contactsDeletePhoto: z.infer<typeof ContactsDeletePhotoInputSchema>;
	otherContactsList: z.infer<typeof OtherContactsListInputSchema>;
	otherContactsSearch: z.infer<typeof OtherContactsSearchInputSchema>;
	otherContactsCopyToContacts: z.infer<typeof OtherContactsCopyInputSchema>;
	contactGroupsList: z.infer<typeof ContactGroupsListInputSchema>;
	contactGroupsGet: z.infer<typeof ContactGroupsGetInputSchema>;
	contactGroupsCreate: z.infer<typeof ContactGroupsCreateInputSchema>;
	contactGroupsUpdate: z.infer<typeof ContactGroupsUpdateInputSchema>;
	contactGroupsDelete: z.infer<typeof ContactGroupsDeleteInputSchema>;
	contactGroupsModifyMembers: z.infer<
		typeof ContactGroupsModifyMembersInputSchema
	>;
};

export type GoogleContactsEndpointOutputs = {
	contactsList: ListConnectionsResponse;
	contactsGet: Person;
	contactsSearch: SearchResponse;
	contactsCreate: Person;
	contactsUpdate: Person;
	contactsDelete: void;
	contactsUpdatePhoto: Person;
	contactsDeletePhoto: Person;
	otherContactsList: ListOtherContactsResponse;
	otherContactsSearch: SearchResponse;
	otherContactsCopyToContacts: Person;
	contactGroupsList: ListContactGroupsResponse;
	contactGroupsGet: ContactGroup;
	contactGroupsCreate: ContactGroup;
	contactGroupsUpdate: ContactGroup;
	contactGroupsDelete: void;
	contactGroupsModifyMembers: ModifyContactGroupMembersResponse;
};

export const GoogleContactsEndpointInputSchemas = {
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsSearch: ContactsSearchInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	contactsUpdatePhoto: ContactsUpdatePhotoInputSchema,
	contactsDeletePhoto: ContactsDeletePhotoInputSchema,
	otherContactsList: OtherContactsListInputSchema,
	otherContactsSearch: OtherContactsSearchInputSchema,
	otherContactsCopyToContacts: OtherContactsCopyInputSchema,
	contactGroupsList: ContactGroupsListInputSchema,
	contactGroupsGet: ContactGroupsGetInputSchema,
	contactGroupsCreate: ContactGroupsCreateInputSchema,
	contactGroupsUpdate: ContactGroupsUpdateInputSchema,
	contactGroupsDelete: ContactGroupsDeleteInputSchema,
	contactGroupsModifyMembers: ContactGroupsModifyMembersInputSchema,
} as const;

export const GoogleContactsEndpointOutputSchemas = {
	contactsList: ListConnectionsResponseSchema,
	contactsGet: PersonSchema,
	contactsSearch: SearchResponseSchema,
	contactsCreate: PersonSchema,
	contactsUpdate: PersonSchema,
	contactsDelete: z.void(),
	contactsUpdatePhoto: PersonSchema,
	contactsDeletePhoto: PersonSchema,
	otherContactsList: ListOtherContactsResponseSchema,
	otherContactsSearch: SearchResponseSchema,
	otherContactsCopyToContacts: PersonSchema,
	contactGroupsList: ListContactGroupsResponseSchema,
	contactGroupsGet: ContactGroupSchema,
	contactGroupsCreate: ContactGroupSchema,
	contactGroupsUpdate: ContactGroupSchema,
	contactGroupsDelete: z.void(),
	contactGroupsModifyMembers: ModifyContactGroupMembersResponseSchema,
} as const;
