import { z } from 'zod';

// Inputs and outputs carry the Directory API's own field names. Outputs are
// `.loose()` because Google adds fields to these resources, and every optional
// output field is `.nullish()`: the API omits unset fields and can send an
// explicit null.
//
// Sources: the Directory API reference for each resource
// (https://developers.google.com/workspace/admin/directory/v1/reference/users,
// .../groups, .../members, .../orgunits, .../domains), the users.list,
// groups.list and members.list reference pages for the query parameters and
// their documented maxima, the limits page for the page-size defaults, and
// https://developers.google.com/workspace/admin/directory/v1/guides/search-users
// for the query syntax. Response shapes come from the discovery document at
// https://admin.googleapis.com/$discovery/rest?version=directory_v1.

// ── shared pieces ────────────────────────────────────────────────────────────

const ETAG = z.string().nullish().describe('ETag of the resource');

/** The four projection values users.get and users.list accept. */
export const USER_PROJECTIONS = ['basic', 'custom', 'full'] as const;

const projection = z
	.enum(USER_PROJECTIONS)
	.nullish()
	.describe(
		'`basic` omits custom fields, `custom` returns the schemas named in customFieldMask, `full` returns everything.',
	);

const viewType = z
	.enum(['admin_view', 'domain_public'])
	.nullish()
	.describe(
		'`admin_view` includes administrator-only fields; `domain_public` is what another user in the domain can see.',
	);

const sortOrder = z.enum(['ASCENDING', 'DESCENDING']).nullish();

const UserNameSchema = z
	.object({
		givenName: z
			.string()
			.nullish()
			.describe('First name, at most 60 characters'),
		familyName: z
			.string()
			.nullish()
			.describe('Last name, at most 60 characters'),
		fullName: z
			.string()
			.nullish()
			.describe('Read-only. givenName and familyName joined'),
		displayName: z.string().nullish().describe('At most 256 characters'),
	})
	.loose();

const UserEmailSchema = z
	.object({
		address: z.string().nullish(),
		type: z
			.string()
			.nullish()
			.describe('`home`, `work`, `other`, or `custom` with customType set'),
		customType: z.string().nullish(),
		primary: z.boolean().nullish(),
	})
	.loose();

const UserPhoneSchema = z
	.object({
		value: z.string().nullish(),
		type: z.string().nullish(),
		customType: z.string().nullish(),
		primary: z.boolean().nullish(),
	})
	.loose();

const UserAddressSchema = z
	.object({
		type: z.string().nullish(),
		customType: z.string().nullish(),
		primary: z.boolean().nullish(),
		formatted: z.string().nullish(),
		streetAddress: z.string().nullish(),
		extendedAddress: z.string().nullish(),
		poBox: z.string().nullish(),
		locality: z.string().nullish(),
		region: z.string().nullish(),
		postalCode: z.string().nullish(),
		country: z.string().nullish(),
		countryCode: z.string().nullish().describe('ISO 3166-1 country code'),
		sourceIsStructured: z.boolean().nullish(),
	})
	.loose();

const UserOrganizationSchema = z
	.object({
		name: z.string().nullish(),
		title: z.string().nullish(),
		department: z.string().nullish(),
		description: z.string().nullish(),
		location: z.string().nullish(),
		costCenter: z.string().nullish(),
		primary: z.boolean().nullish(),
		type: z.string().nullish(),
		customType: z.string().nullish(),
		domain: z.string().nullish(),
		symbol: z.string().nullish(),
		fullTimeEquivalent: z.number().nullish(),
	})
	.loose();

const UserExternalIdSchema = z
	.object({
		value: z.string().nullish(),
		type: z.string().nullish(),
		customType: z.string().nullish(),
	})
	.loose();

const UserRelationSchema = z
	.object({
		value: z.string().nullish(),
		type: z.string().nullish(),
		customType: z.string().nullish(),
	})
	.loose();

const UserWebsiteSchema = z
	.object({
		value: z.string().nullish(),
		type: z.string().nullish(),
		customType: z.string().nullish(),
		primary: z.boolean().nullish(),
	})
	.loose();

const UserImSchema = z
	.object({
		im: z.string().nullish(),
		type: z.string().nullish(),
		protocol: z.string().nullish(),
		customProtocol: z.string().nullish(),
		customType: z.string().nullish(),
		primary: z.boolean().nullish(),
	})
	.loose();

const UserLocationSchema = z
	.object({
		type: z.string().nullish(),
		customType: z.string().nullish(),
		area: z.string().nullish(),
		buildingId: z.string().nullish(),
		floorName: z.string().nullish(),
		floorSection: z.string().nullish(),
		deskCode: z.string().nullish(),
	})
	.loose();

const UserLanguageSchema = z
	.object({
		languageCode: z.string().nullish().describe('ISO 639-2 language code'),
		preference: z.string().nullish().describe('`preferred` or `not_preferred`'),
		customLanguage: z.string().nullish(),
	})
	.loose();

const UserKeywordSchema = z
	.object({
		value: z.string().nullish(),
		type: z.string().nullish(),
		customType: z.string().nullish(),
	})
	.loose();

const UserGenderSchema = z
	.object({
		type: z
			.string()
			.nullish()
			.describe('`female`, `male`, `other` or `unknown`'), // unknown: Google's value name.
		customGender: z.string().nullish(),
		addressMeAs: z.string().nullish(),
	})
	.loose();

const UserNotesSchema = z
	.object({
		contentType: z.string().nullish().describe('`text_plain` or `text_html`'),
		value: z.string().nullish(),
	})
	.loose();

const UserPosixAccountSchema = z
	.object({
		username: z.string().nullish(),
		uid: z.string().nullish(),
		gid: z.string().nullish(),
		systemId: z.string().nullish(),
		homeDirectory: z.string().nullish(),
		shell: z.string().nullish(),
		gecos: z.string().nullish(),
		primary: z.boolean().nullish(),
		accountId: z.string().nullish(),
		operatingSystemType: z.string().nullish(),
	})
	.loose();

const UserSshPublicKeySchema = z
	.object({
		key: z.string().nullish(),
		expirationTimeUsec: z.string().nullish(),
		fingerprint: z.string().nullish(),
	})
	.loose();

/** The User resource, as users.get, users.list, users.insert and users.update return it. */
const UserSchema = z
	.object({
		// Every documented User resource carries both, so a success body without
		// them is not a user and must fail rather than become a blank row.
		id: z.string().describe('Unique user ID, usable as userKey'),
		primaryEmail: z.string(),
		name: UserNameSchema.nullish(),
		etag: ETAG,
		kind: z.string().nullish(),
		aliases: z
			.array(z.string())
			.nullish()
			.describe('Read-only. Alias email addresses of the user'),
		nonEditableAliases: z
			.array(z.string())
			.nullish()
			.describe('Read-only. Aliases outside the account domains'),
		customerId: z.string().nullish(),
		orgUnitPath: z
			.string()
			.nullish()
			.describe(
				'Full path of the parent organizational unit, `/` at the top level',
			),
		isAdmin: z
			.boolean()
			.nullish()
			.describe('Read-only. Edited through users.makeAdmin'),
		isDelegatedAdmin: z.boolean().nullish(),
		lastLoginTime: z.string().nullish().describe('RFC 3339 timestamp'),
		creationTime: z.string().nullish().describe('RFC 3339 timestamp'),
		deletionTime: z.string().nullish().describe('RFC 3339 timestamp'),
		agreedToTerms: z.boolean().nullish(),
		suspended: z.boolean().nullish(),
		suspensionReason: z.string().nullish(),
		suspensionTime: z.string().nullish(),
		archived: z.boolean().nullish(),
		archivalTime: z.string().nullish(),
		changePasswordAtNextLogin: z.boolean().nullish(),
		ipWhitelisted: z.boolean().nullish(),
		includeInGlobalAddressList: z.boolean().nullish(),
		isMailboxSetup: z.boolean().nullish(),
		isEnrolledIn2Sv: z.boolean().nullish(),
		isEnforcedIn2Sv: z.boolean().nullish(),
		isGuestUser: z.boolean().nullish(),
		thumbnailPhotoUrl: z
			.string()
			.nullish()
			.describe('Output only. The URL may be temporary or private'),
		thumbnailPhotoEtag: z.string().nullish(),
		recoveryEmail: z.string().nullish(),
		recoveryPhone: z
			.string()
			.nullish()
			.describe('E.164 format, e.g. +16506661212'),
		emails: z.array(UserEmailSchema).nullish(),
		phones: z.array(UserPhoneSchema).nullish(),
		addresses: z.array(UserAddressSchema).nullish(),
		organizations: z.array(UserOrganizationSchema).nullish(),
		externalIds: z.array(UserExternalIdSchema).nullish(),
		relations: z.array(UserRelationSchema).nullish(),
		websites: z.array(UserWebsiteSchema).nullish(),
		ims: z.array(UserImSchema).nullish(),
		locations: z.array(UserLocationSchema).nullish(),
		languages: z.array(UserLanguageSchema).nullish(),
		keywords: z.array(UserKeywordSchema).nullish(),
		gender: UserGenderSchema.nullish(),
		notes: UserNotesSchema.nullish(),
		posixAccounts: z.array(UserPosixAccountSchema).nullish(),
		sshPublicKeys: z.array(UserSshPublicKeySchema).nullish(),
		customSchemas: z
			// unknown: a custom schema holds whatever the admin defined.
			.record(z.string(), z.record(z.string(), z.unknown())) // unknown: values are open.
			.nullish()
			.describe('Custom fields, keyed by schema name then field name'),
	})
	.loose();

const GroupSchema = z
	.object({
		id: z.string().nullish().describe('Unique group ID, usable as groupKey'),
		email: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish().describe('At most 4,096 characters'),
		adminCreated: z.boolean().nullish().describe('Read-only'),
		directMembersCount: z
			.string()
			.nullish()
			.describe(
				'int64 as a string. Nested members of a child group are not counted',
			),
		etag: ETAG,
		kind: z.string().nullish(),
		aliases: z.array(z.string()).nullish().describe('Read-only'),
		nonEditableAliases: z.array(z.string()).nullish().describe('Read-only'),
	})
	.loose();

/** The three roles members.insert and members.update accept. */
export const MEMBER_ROLES = ['OWNER', 'MANAGER', 'MEMBER'] as const;

/** The five mail delivery preferences members.insert and members.update accept. */
export const MEMBER_DELIVERY_SETTINGS = [
	'ALL_MAIL',
	'DAILY',
	'DIGEST',
	'DISABLED',
	'NONE',
] as const;

const MemberSchema = z
	.object({
		id: z.string().nullish().describe('Unique member ID, usable as memberKey'),
		email: z.string().nullish(),
		role: z.string().nullish().describe('`OWNER`, `MANAGER` or `MEMBER`'),
		type: z
			.string()
			.nullish()
			.describe('`USER`, `GROUP`, `CUSTOMER` or `EXTERNAL`'),
		status: z.string().nullish().describe('Read-only'),
		delivery_settings: z
			.string()
			.nullish()
			.describe(
				"`ALL_MAIL`, `DAILY`, `DIGEST`, `DISABLED` or `NONE`. Snake case is Google's spelling",
			),
		etag: ETAG,
		kind: z.string().nullish(),
	})
	.loose();

const OrgUnitSchema = z
	.object({
		orgUnitId: z.string().nullish(),
		orgUnitPath: z
			.string()
			.nullish()
			.describe('Derived full path, e.g. `/engineering/apps`'),
		name: z.string().nullish().describe('The path segment, e.g. `apps`'),
		description: z.string().nullish(),
		parentOrgUnitId: z.string().nullish(),
		parentOrgUnitPath: z.string().nullish(),
		etag: ETAG,
		kind: z.string().nullish(),
	})
	.loose();

const DomainAliasSchema = z
	.object({
		domainAliasName: z.string().nullish(),
		parentDomainName: z.string().nullish(),
		verified: z.boolean().nullish().describe('Read-only'),
		creationTime: z.string().nullish().describe('Unix time in milliseconds'),
		etag: ETAG,
		kind: z.string().nullish(),
	})
	.loose();

const DomainSchema = z
	.object({
		domainName: z.string().nullish(),
		domainAliases: z.array(DomainAliasSchema).nullish().describe('Read-only'),
		isPrimary: z.boolean().nullish().describe('Read-only'),
		verified: z.boolean().nullish().describe('Read-only'),
		creationTime: z.string().nullish().describe('Unix time in milliseconds'),
		etag: ETAG,
		kind: z.string().nullish(),
	})
	.loose();

const CustomerPostalAddressSchema = z
	.object({
		contactName: z.string().nullish(),
		organizationName: z.string().nullish(),
		addressLine1: z.string().nullish(),
		addressLine2: z.string().nullish(),
		addressLine3: z.string().nullish(),
		locality: z.string().nullish(),
		region: z.string().nullish(),
		postalCode: z.string().nullish(),
		countryCode: z.string().nullish(),
	})
	.loose();

const CustomerSchema = z
	.object({
		id: z
			.string()
			.nullish()
			.describe('The customer ID, the `my_customer` alias target'),
		customerDomain: z.string().nullish(),
		alternateEmail: z.string().nullish(),
		phoneNumber: z.string().nullish().describe('E.164 format'),
		language: z.string().nullish().describe('ISO 639-2 language code'),
		customerCreationTime: z.string().nullish(),
		postalAddress: CustomerPostalAddressSchema.nullish(),
		etag: ETAG,
		kind: z.string().nullish(),
	})
	.loose();

const UserPhotoSchema = z
	.object({
		id: z.string().nullish(),
		primaryEmail: z.string().nullish(),
		photoData: z
			.string()
			.nullish()
			.describe('Base64-encoded image bytes, on read and on write'),
		mimeType: z.string().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		etag: ETAG,
		kind: z.string().nullish(),
	})
	.loose();

// ── users ────────────────────────────────────────────────────────────────────

/** A user field list for `personFields`-style selection is not used here: users.list takes `projection`. */
const customerOrDomain = {
	customer: z
		.string()
		.nullish()
		.describe(
			"The unique customer ID, or `my_customer` for the caller's own account",
		),
	domain: z
		.string()
		.nullish()
		.describe('A domain name. Send this or customer, not both'),
};

const UsersListInputSchema = z
	.object({
		...customerOrDomain,
		query: z
			.string()
			.nullish()
			.describe(
				'Search clauses such as `email:ada*`, `orgUnitPath=/sales`, or `isSuspended=true`; see Search for users',
			),
		maxResults: z
			.number()
			.int()
			.min(1)
			.max(500)
			.nullish()
			.describe('1 to 500. The API default is 100'),
		pageToken: z
			.string()
			.nullish()
			.describe('nextPageToken from a previous page. Valid for three days'),
		orderBy: z
			.enum(['email', 'familyName', 'givenName'])
			.nullish()
			.describe('Column to sort by'),
		sortOrder,
		projection,
		customFieldMask: z
			.string()
			.nullish()
			.describe(
				'Comma-separated schema names. Only read when projection is `custom`',
			),
		showDeleted: z
			.string()
			.nullish()
			.describe(
				'Google types this one as a string, not a boolean. `true` lists deleted users',
			),
		viewType,
	})
	.strict()
	.superRefine((value, ctx) => {
		// Google answers 400 when neither is sent; failing here says why.
		if (!value.customer && !value.domain) {
			ctx.addIssue({
				code: 'custom',
				path: ['customer'],
				message: 'Send customer (`my_customer` for your own account) or domain',
			});
		}
	});

const UsersGetInputSchema = z
	.object({
		userKey: z
			.string()
			.describe('Primary email, alias email, or the unique user ID'),
		projection,
		customFieldMask: z
			.string()
			.nullish()
			.describe('Comma-separated schema names, only with projection `custom`'),
		viewType,
	})
	.strict();

const UserNameInputSchema = z
	.object({
		givenName: z.string().describe('First name, at most 60 characters'),
		familyName: z.string().describe('Last name, at most 60 characters'),
		displayName: z.string().nullish().describe('At most 256 characters'),
	})
	.strict();

/**
 * users.update keeps the name parts it is not sent, so either part can be
 * changed alone; Google's update guide changes `givenName` by itself.
 */
const UserNameUpdateInputSchema = z
	.object({
		givenName: z
			.string()
			.optional()
			.describe('First name, at most 60 characters'),
		familyName: z
			.string()
			.optional()
			.describe('Last name, at most 60 characters'),
		displayName: z.string().nullish().describe('At most 256 characters'),
	})
	.strict();

/** The hashes users.insert accepts as `hashFunction`. */
export const USER_HASH_FUNCTIONS = ['MD5', 'SHA-1', 'crypt'] as const;

/**
 * The 8 to 100 character rule is for a plain password. A hash is checked by
 * Google instead: a SHA-512 crypt hash with a 16-character salt is already 106
 * characters, so the plain-text limit would refuse a valid one.
 */
function checkPasswordLength(
	value: { password?: string | null; hashFunction?: string | null },
	ctx: z.RefinementCtx,
): void {
	if (value.password == null || value.hashFunction) return;
	const { length } = value.password;
	if (length < 8 || length > 100) {
		ctx.addIssue({
			code: 'custom',
			path: ['password'],
			message:
				'A plain password must be 8 to 100 characters; set hashFunction to send a hash',
		});
	}
}

/**
 * users.insert takes the full User resource. Only the fields Google documents
 * as writable are accepted, so a read-only field fails here instead of being
 * silently dropped by the API.
 */
const UsersInsertInputSchema = z
	.object({
		primaryEmail: z
			.string()
			.describe('Required. Unique, and not an alias of another user'),
		name: UserNameInputSchema,
		password: z
			.string()
			.min(1)
			.describe(
				'Required. Either the plain password (8 to 100 characters) or a hash when hashFunction is set',
			),
		hashFunction: z
			.enum(USER_HASH_FUNCTIONS)
			.nullish()
			.describe(
				'Set when `password` is already a hash: hex for MD5 and SHA-1; `crypt` takes DES, $1$, $5$ and $6$ hashes',
			),
		orgUnitPath: z
			.string()
			.nullish()
			.describe(
				'Full path of the parent organizational unit, `/` for the top level',
			),
		includeInGlobalAddressList: z.boolean().nullish(),
		changePasswordAtNextLogin: z.boolean().nullish(),
		suspended: z.boolean().nullish(),
		archived: z.boolean().nullish(),
		ipWhitelisted: z.boolean().nullish(),
		recoveryEmail: z.string().nullish(),
		recoveryPhone: z
			.string()
			.nullish()
			.describe('E.164 format starting with +, e.g. +16506661212'),
		isGuestUser: z.boolean().nullish().describe('Immutable once set'),
		emails: z.array(UserEmailSchema).nullish(),
		phones: z.array(UserPhoneSchema).nullish(),
		addresses: z.array(UserAddressSchema).nullish(),
		organizations: z.array(UserOrganizationSchema).nullish(),
		externalIds: z.array(UserExternalIdSchema).nullish(),
		relations: z.array(UserRelationSchema).nullish(),
		websites: z.array(UserWebsiteSchema).nullish(),
		ims: z.array(UserImSchema).nullish(),
		locations: z.array(UserLocationSchema).nullish(),
		languages: z.array(UserLanguageSchema).nullish(),
		keywords: z.array(UserKeywordSchema).nullish(),
		gender: UserGenderSchema.nullish(),
		notes: UserNotesSchema.nullish(),
		posixAccounts: z.array(UserPosixAccountSchema).nullish(),
		sshPublicKeys: z.array(UserSshPublicKeySchema).nullish(),
		customSchemas: z
			// unknown: a custom schema holds whatever the admin defined.
			.record(z.string(), z.record(z.string(), z.unknown())) // unknown: values are open.
			.nullish(),
	})
	.strict()
	.superRefine(checkPasswordLength);

/**
 * users.update is a PUT with patch semantics: absent fields are preserved and a
 * field set to null is cleared. Google recommends it over users.patch, which it
 * documents as the slower method with the same behaviour.
 *
 * Repeated fields cannot be patched piecemeal: the docs say every item in an
 * array must be supplied with the value it should end up with, so sending one
 * email address replaces the whole list.
 */
const UsersUpdateInputSchema = z
	.object({
		userKey: z
			.string()
			.describe('Primary email, alias email, or unique user ID'),
		primaryEmail: z
			.string()
			.nullish()
			.describe('Renaming can take up to 10 minutes to propagate'),
		name: UserNameUpdateInputSchema.nullish().describe(
			'Only the name parts that are sent change; the others keep their value',
		),
		password: z
			.string()
			.min(1)
			.nullish()
			.describe(
				'Optional on update. Setting it changes the password: plain text of 8 to 100 characters, or a hash when hashFunction is set',
			),
		hashFunction: z.enum(USER_HASH_FUNCTIONS).nullish(),
		orgUnitPath: z.string().nullish(),
		includeInGlobalAddressList: z.boolean().nullish(),
		changePasswordAtNextLogin: z.boolean().nullish(),
		suspended: z.boolean().nullish(),
		archived: z.boolean().nullish(),
		ipWhitelisted: z.boolean().nullish(),
		recoveryEmail: z.string().nullish(),
		recoveryPhone: z.string().nullish(),
		emails: z.array(UserEmailSchema).nullish(),
		phones: z.array(UserPhoneSchema).nullish(),
		addresses: z.array(UserAddressSchema).nullish(),
		organizations: z.array(UserOrganizationSchema).nullish(),
		externalIds: z.array(UserExternalIdSchema).nullish(),
		relations: z.array(UserRelationSchema).nullish(),
		websites: z.array(UserWebsiteSchema).nullish(),
		ims: z.array(UserImSchema).nullish(),
		locations: z.array(UserLocationSchema).nullish(),
		languages: z.array(UserLanguageSchema).nullish(),
		keywords: z.array(UserKeywordSchema).nullish(),
		gender: UserGenderSchema.nullish(),
		notes: UserNotesSchema.nullish(),
		posixAccounts: z.array(UserPosixAccountSchema).nullish(),
		sshPublicKeys: z.array(UserSshPublicKeySchema).nullish(),
		customSchemas: z
			// unknown: a custom schema holds whatever the admin defined.
			.record(z.string(), z.record(z.string(), z.unknown())) // unknown: values are open.
			.nullish(),
	})
	.strict()
	.superRefine(checkPasswordLength);

const UsersDeleteInputSchema = z
	.object({
		userKey: z
			.string()
			.describe('Primary email, alias email, or unique user ID'),
	})
	.strict();

const UsersUndeleteInputSchema = z
	.object({
		userKey: z
			.string()
			.describe('The immutable user ID. An email address is not accepted here'),
		orgUnitPath: z
			.string()
			.nullish()
			.describe('Organizational unit to restore the user into'),
	})
	.strict();

const UsersMakeAdminInputSchema = z
	.object({
		userKey: z.string(),
		status: z
			.boolean()
			.describe('true grants super administrator, false revokes it'),
	})
	.strict();

const UsersSignOutInputSchema = z
	.object({
		userKey: z.string(),
	})
	.strict();

const UsersListOutputSchema = z.object({
	kind: z.string().nullish(),
	etag: z.string().nullish(),
	users: z
		.array(UserSchema)
		.nullish()
		.describe('Absent when the domain has no matching users'),
	nextPageToken: z.string().nullish(),
	trigger_event: z
		.string()
		.nullish()
		.describe('Only set on a push notification response'),
});

const UsersAliasesListInputSchema = z
	.object({
		userKey: z.string(),
	})
	.strict();

const UsersAliasesInsertInputSchema = z
	.object({
		userKey: z.string(),
		alias: z
			.string()
			.describe('The alias email address, inside one of the account domains'),
	})
	.strict();

const UsersAliasesDeleteInputSchema = z
	.object({
		userKey: z.string(),
		alias: z.string().describe('The alias to remove'),
	})
	.strict();

const AliasSchema = z
	.object({
		id: z.string().nullish(),
		primaryEmail: z.string().nullish(),
		alias: z.string().nullish(),
		etag: ETAG,
		kind: z.string().nullish(),
	})
	.loose();

const AliasesListOutputSchema = z.object({
	kind: z.string().nullish(),
	etag: z.string().nullish(),
	aliases: z.array(AliasSchema).nullish(),
});

const UsersPhotosGetInputSchema = z.object({ userKey: z.string() }).strict();

const UsersPhotosUpdateInputSchema = z
	.object({
		userKey: z.string(),
		photoData: z.string().describe('Base64-encoded image bytes'),
		mimeType: z
			.string()
			.nullish()
			.describe('`image/jpeg` or `image/png`; the API infers it when omitted'),
	})
	.strict();

const UsersPhotosDeleteInputSchema = z.object({ userKey: z.string() }).strict();

// ── groups ───────────────────────────────────────────────────────────────────

const GroupsListInputSchema = z
	.object({
		...customerOrDomain,
		userKey: z
			.string()
			.nullish()
			.describe(
				'List only the groups this user belongs to. Cannot be combined with customer',
			),
		query: z
			.string()
			.nullish()
			.describe('Search clauses such as `name:engineering` or `email:eng*`'),
		maxResults: z
			.number()
			.int()
			.min(1)
			.max(200)
			.nullish()
			.describe(
				'1 to 200. 200 is both the default and the maximum, per the limits page',
			),
		pageToken: z
			.string()
			.nullish()
			.describe('nextPageToken from a previous page'),
		orderBy: z.enum(['email']).nullish().describe('The only documented value'),
		sortOrder,
	})
	.strict()
	.superRefine((value, ctx) => {
		// groups.list needs one of the three to know which groups to list.
		if (!value.customer && !value.domain && !value.userKey) {
			ctx.addIssue({
				code: 'custom',
				path: ['customer'],
				message:
					'Send customer (`my_customer` for your own account), domain or userKey',
			});
		}
	});

const GroupsGetInputSchema = z.object({ groupKey: z.string() }).strict();

const GroupsInsertInputSchema = z
	.object({
		email: z
			.string()
			.describe('Required. The group address, unique in the account'),
		name: z.string().nullish().describe('The group display name'),
		description: z.string().nullish().describe('At most 4,096 characters'),
	})
	.strict();

const GroupsUpdateInputSchema = z
	.object({
		groupKey: z.string(),
		email: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
	})
	.strict();

const GroupsDeleteInputSchema = z.object({ groupKey: z.string() }).strict();

const GroupsAliasesListInputSchema = z
	.object({ groupKey: z.string() })
	.strict();

const GroupsAliasesInsertInputSchema = z
	.object({
		groupKey: z.string(),
		alias: z.string().describe('The alias email address to add'),
	})
	.strict();

const GroupsAliasesDeleteInputSchema = z
	.object({
		groupKey: z.string(),
		alias: z.string().describe('The alias to remove'),
	})
	.strict();

const GroupsListOutputSchema = z.object({
	kind: z.string().nullish(),
	etag: z.string().nullish(),
	groups: z
		.array(GroupSchema)
		.nullish()
		.describe('Absent when the domain has no groups'),
	nextPageToken: z.string().nullish(),
});

// ── members ──────────────────────────────────────────────────────────────────

const MembersListInputSchema = z
	.object({
		groupKey: z.string(),
		includeDerivedMembership: z
			.boolean()
			.nullish()
			.describe('Also list members inherited from nested groups'),
		roles: z
			.string()
			.nullish()
			.describe('A comma-separated subset of `OWNER`, `MANAGER`, `MEMBER`'),
		maxResults: z
			.number()
			.int()
			.min(1)
			.max(200)
			.nullish()
			.describe('1 to 200. 200 is both the default and the maximum'),
		pageToken: z.string().nullish(),
	})
	.strict();

const MembersGetInputSchema = z
	.object({ groupKey: z.string(), memberKey: z.string() })
	.strict();

const MembersHasMemberInputSchema = z
	.object({
		groupKey: z.string(),
		memberKey: z
			.string()
			.describe("The user's primary email, alias, or unique ID"),
	})
	.strict();

const MembersInsertInputSchema = z
	.object({
		groupKey: z.string(),
		email: z.string().describe('Required. The member address'),
		role: z.enum(MEMBER_ROLES).nullish().describe('Defaults to MEMBER'),
		type: z
			.enum(['USER', 'GROUP', 'CUSTOMER', 'EXTERNAL'])
			.nullish()
			.describe('Required when the member is outside the account domains'),
		delivery_settings: z.enum(MEMBER_DELIVERY_SETTINGS).nullish(),
	})
	.strict();

const MembersUpdateInputSchema = z
	.object({
		groupKey: z.string(),
		memberKey: z.string(),
		role: z.enum(MEMBER_ROLES).nullish(),
		delivery_settings: z
			.enum(MEMBER_DELIVERY_SETTINGS)
			.nullish()
			.describe(
				'Needs `role` too: Google takes a delivery change only through the PUT update, which replaces the role as well',
			),
	})
	.strict()
	.superRefine((value, ctx) => {
		// The plugin does not read the current role and send it back: an admin
		// could change the role between that read and the PUT, and the PUT
		// would silently restore the old one.
		if (value.delivery_settings && !value.role) {
			ctx.addIssue({
				code: 'custom',
				path: ['role'],
				message:
					'Pass role with delivery_settings: the PUT that changes delivery replaces the role too',
			});
		}
	});

const MembersDeleteInputSchema = z
	.object({ groupKey: z.string(), memberKey: z.string() })
	.strict();

const MembersListOutputSchema = z.object({
	kind: z.string().nullish(),
	etag: z.string().nullish(),
	members: z
		.array(MemberSchema)
		.nullish()
		.describe('Absent when the group has no members'),
	nextPageToken: z.string().nullish(),
});

const MembersHasMemberOutputSchema = z.object({
	// Required: a body without the flag says nothing, and a read that cannot
	// answer "is this member in the group" must fail rather than answer false.
	isMember: z.boolean().describe('True for a direct or nested membership'),
});

// ── organizational units ─────────────────────────────────────────────────────

/** The three orgunits.list type values, documented as ALL, CHILDREN, ALL_INCLUDING_PARENT. */
export const ORG_UNIT_TYPES = [
	'all',
	'children',
	'allIncludingParent',
] as const;

const OrgUnitsListInputSchema = z
	.object({
		customerId: z
			.string()
			.describe(
				"The customer ID, or `my_customer` for the caller's own account",
			),
		orgUnitPath: z
			.string()
			.nullish()
			.describe('Full path or unique ID; lists the children of this unit'),
		type: z.enum(ORG_UNIT_TYPES).nullish().describe('Defaults to `children`'),
	})
	.strict();

const OrgUnitsGetInputSchema = z
	.object({
		customerId: z.string(),
		orgUnitPath: z
			.string()
			.describe(
				'Full path without the leading slash, e.g. `engineering/apps`, or the unique ID',
			),
	})
	.strict();

const OrgUnitsInsertInputSchema = z
	.object({
		customerId: z.string(),
		name: z
			.string()
			.describe('Required. The path segment, e.g. `sales_support`'),
		description: z.string().nullish(),
		parentOrgUnitPath: z
			.string()
			.nullish()
			.describe('Required unless parentOrgUnitId is set, e.g. `/corp/sales`'),
		parentOrgUnitId: z
			.string()
			.nullish()
			.describe('Required unless parentOrgUnitPath is set'),
	})
	.strict()
	.superRefine((value, ctx) => {
		// The docs mark either parent as required, and a create with neither is
		// rejected after the request has been sent.
		if (!value.parentOrgUnitPath && !value.parentOrgUnitId) {
			ctx.addIssue({
				code: 'custom',
				path: ['parentOrgUnitPath'],
				message:
					'One of parentOrgUnitPath or parentOrgUnitId is required to place the unit',
			});
		}
	});

const OrgUnitsUpdateInputSchema = z
	.object({
		customerId: z.string(),
		orgUnitPath: z
			.string()
			.describe('Full path of the unit to update, e.g. `engineering/apps`'),
		name: z.string().nullish().describe('A new path segment'),
		description: z.string().nullish(),
		parentOrgUnitPath: z.string().nullish(),
		parentOrgUnitId: z.string().nullish(),
	})
	.strict();

const OrgUnitsDeleteInputSchema = z
	.object({
		customerId: z.string(),
		orgUnitPath: z.string(),
	})
	.strict();

const OrgUnitsListOutputSchema = z.object({
	kind: z.string().nullish(),
	etag: z.string().nullish(),
	organizationUnits: z.array(OrgUnitSchema).nullish(),
});

// ── domains and the customer ─────────────────────────────────────────────────

const DomainsListInputSchema = z
	.object({
		customer: z
			.string()
			.describe(
				"The customer ID, or `my_customer` for the caller's own account",
			),
	})
	.strict();

const DomainsGetInputSchema = z
	.object({
		customer: z.string(),
		domainName: z.string(),
	})
	.strict();

const DomainAliasesListInputSchema = z
	.object({
		customer: z.string(),
		parentDomainName: z
			.string()
			.nullish()
			.describe('Only list the aliases of this parent domain'),
	})
	.strict();

const DomainsListOutputSchema = z.object({
	kind: z.string().nullish(),
	etag: z.string().nullish(),
	domains: z.array(DomainSchema).nullish(),
});

const DomainAliasesListOutputSchema = z.object({
	kind: z.string().nullish(),
	etag: z.string().nullish(),
	domainAliases: z.array(DomainAliasSchema).nullish(),
});

const CustomersGetInputSchema = z
	.object({
		customerKey: z
			.string()
			.describe(
				"The customer ID, or `my_customer` for the caller's own account",
			),
	})
	.strict();

// ── exports ──────────────────────────────────────────────────────────────────

export type GoogleAdminEndpointInputs = {
	usersList: z.input<typeof UsersListInputSchema>;
	usersGet: z.input<typeof UsersGetInputSchema>;
	usersInsert: z.input<typeof UsersInsertInputSchema>;
	usersUpdate: z.input<typeof UsersUpdateInputSchema>;
	usersDelete: z.input<typeof UsersDeleteInputSchema>;
	usersUndelete: z.input<typeof UsersUndeleteInputSchema>;
	usersMakeAdmin: z.input<typeof UsersMakeAdminInputSchema>;
	usersSignOut: z.input<typeof UsersSignOutInputSchema>;
	usersAliasesList: z.input<typeof UsersAliasesListInputSchema>;
	usersAliasesInsert: z.input<typeof UsersAliasesInsertInputSchema>;
	usersAliasesDelete: z.input<typeof UsersAliasesDeleteInputSchema>;
	usersPhotosGet: z.input<typeof UsersPhotosGetInputSchema>;
	usersPhotosUpdate: z.input<typeof UsersPhotosUpdateInputSchema>;
	usersPhotosDelete: z.input<typeof UsersPhotosDeleteInputSchema>;
	groupsList: z.input<typeof GroupsListInputSchema>;
	groupsGet: z.input<typeof GroupsGetInputSchema>;
	groupsInsert: z.input<typeof GroupsInsertInputSchema>;
	groupsUpdate: z.input<typeof GroupsUpdateInputSchema>;
	groupsDelete: z.input<typeof GroupsDeleteInputSchema>;
	groupsAliasesList: z.input<typeof GroupsAliasesListInputSchema>;
	groupsAliasesInsert: z.input<typeof GroupsAliasesInsertInputSchema>;
	groupsAliasesDelete: z.input<typeof GroupsAliasesDeleteInputSchema>;
	membersList: z.input<typeof MembersListInputSchema>;
	membersGet: z.input<typeof MembersGetInputSchema>;
	membersHasMember: z.input<typeof MembersHasMemberInputSchema>;
	membersInsert: z.input<typeof MembersInsertInputSchema>;
	membersUpdate: z.input<typeof MembersUpdateInputSchema>;
	membersDelete: z.input<typeof MembersDeleteInputSchema>;
	orgUnitsList: z.input<typeof OrgUnitsListInputSchema>;
	orgUnitsGet: z.input<typeof OrgUnitsGetInputSchema>;
	orgUnitsInsert: z.input<typeof OrgUnitsInsertInputSchema>;
	orgUnitsUpdate: z.input<typeof OrgUnitsUpdateInputSchema>;
	orgUnitsDelete: z.input<typeof OrgUnitsDeleteInputSchema>;
	domainsList: z.input<typeof DomainsListInputSchema>;
	domainsGet: z.input<typeof DomainsGetInputSchema>;
	domainAliasesList: z.input<typeof DomainAliasesListInputSchema>;
	customersGet: z.input<typeof CustomersGetInputSchema>;
};

export type GoogleAdminEndpointOutputs = {
	usersList: z.output<typeof UsersListOutputSchema>;
	usersGet: z.output<typeof UserSchema>;
	usersInsert: z.output<typeof UserSchema>;
	usersUpdate: z.output<typeof UserSchema>;
	usersDelete: void;
	usersUndelete: void;
	usersMakeAdmin: void;
	usersSignOut: void;
	usersAliasesList: z.output<typeof AliasesListOutputSchema>;
	usersAliasesInsert: z.output<typeof AliasSchema>;
	usersAliasesDelete: void;
	usersPhotosGet: z.output<typeof UserPhotoSchema>;
	usersPhotosUpdate: z.output<typeof UserPhotoSchema>;
	usersPhotosDelete: void;
	groupsList: z.output<typeof GroupsListOutputSchema>;
	groupsGet: z.output<typeof GroupSchema>;
	groupsInsert: z.output<typeof GroupSchema>;
	groupsUpdate: z.output<typeof GroupSchema>;
	groupsDelete: void;
	groupsAliasesList: z.output<typeof AliasesListOutputSchema>;
	groupsAliasesInsert: z.output<typeof AliasSchema>;
	groupsAliasesDelete: void;
	membersList: z.output<typeof MembersListOutputSchema>;
	membersGet: z.output<typeof MemberSchema>;
	membersHasMember: z.output<typeof MembersHasMemberOutputSchema>;
	membersInsert: z.output<typeof MemberSchema>;
	membersUpdate: z.output<typeof MemberSchema>;
	membersDelete: void;
	orgUnitsList: z.output<typeof OrgUnitsListOutputSchema>;
	orgUnitsGet: z.output<typeof OrgUnitSchema>;
	orgUnitsInsert: z.output<typeof OrgUnitSchema>;
	orgUnitsUpdate: z.output<typeof OrgUnitSchema>;
	orgUnitsDelete: void;
	domainsList: z.output<typeof DomainsListOutputSchema>;
	domainsGet: z.output<typeof DomainSchema>;
	domainAliasesList: z.output<typeof DomainAliasesListOutputSchema>;
	customersGet: z.output<typeof CustomerSchema>;
};

export const GoogleAdminEndpointInputSchemas = {
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	usersInsert: UsersInsertInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	usersDelete: UsersDeleteInputSchema,
	usersUndelete: UsersUndeleteInputSchema,
	usersMakeAdmin: UsersMakeAdminInputSchema,
	usersSignOut: UsersSignOutInputSchema,
	usersAliasesList: UsersAliasesListInputSchema,
	usersAliasesInsert: UsersAliasesInsertInputSchema,
	usersAliasesDelete: UsersAliasesDeleteInputSchema,
	usersPhotosGet: UsersPhotosGetInputSchema,
	usersPhotosUpdate: UsersPhotosUpdateInputSchema,
	usersPhotosDelete: UsersPhotosDeleteInputSchema,
	groupsList: GroupsListInputSchema,
	groupsGet: GroupsGetInputSchema,
	groupsInsert: GroupsInsertInputSchema,
	groupsUpdate: GroupsUpdateInputSchema,
	groupsDelete: GroupsDeleteInputSchema,
	groupsAliasesList: GroupsAliasesListInputSchema,
	groupsAliasesInsert: GroupsAliasesInsertInputSchema,
	groupsAliasesDelete: GroupsAliasesDeleteInputSchema,
	membersList: MembersListInputSchema,
	membersGet: MembersGetInputSchema,
	membersHasMember: MembersHasMemberInputSchema,
	membersInsert: MembersInsertInputSchema,
	membersUpdate: MembersUpdateInputSchema,
	membersDelete: MembersDeleteInputSchema,
	orgUnitsList: OrgUnitsListInputSchema,
	orgUnitsGet: OrgUnitsGetInputSchema,
	orgUnitsInsert: OrgUnitsInsertInputSchema,
	orgUnitsUpdate: OrgUnitsUpdateInputSchema,
	orgUnitsDelete: OrgUnitsDeleteInputSchema,
	domainsList: DomainsListInputSchema,
	domainsGet: DomainsGetInputSchema,
	domainAliasesList: DomainAliasesListInputSchema,
	customersGet: CustomersGetInputSchema,
} as const;

export const GoogleAdminEndpointOutputSchemas = {
	usersList: UsersListOutputSchema,
	usersGet: UserSchema,
	usersInsert: UserSchema,
	usersUpdate: UserSchema,
	usersDelete: z.void(),
	usersUndelete: z.void(),
	usersMakeAdmin: z.void(),
	usersSignOut: z.void(),
	usersAliasesList: AliasesListOutputSchema,
	usersAliasesInsert: AliasSchema,
	usersAliasesDelete: z.void(),
	usersPhotosGet: UserPhotoSchema,
	usersPhotosUpdate: UserPhotoSchema,
	usersPhotosDelete: z.void(),
	groupsList: GroupsListOutputSchema,
	groupsGet: GroupSchema,
	groupsInsert: GroupSchema,
	groupsUpdate: GroupSchema,
	groupsDelete: z.void(),
	groupsAliasesList: AliasesListOutputSchema,
	groupsAliasesInsert: AliasSchema,
	groupsAliasesDelete: z.void(),
	membersList: MembersListOutputSchema,
	membersGet: MemberSchema,
	membersHasMember: MembersHasMemberOutputSchema,
	membersInsert: MemberSchema,
	membersUpdate: MemberSchema,
	membersDelete: z.void(),
	orgUnitsList: OrgUnitsListOutputSchema,
	orgUnitsGet: OrgUnitSchema,
	orgUnitsInsert: OrgUnitSchema,
	orgUnitsUpdate: OrgUnitSchema,
	orgUnitsDelete: z.void(),
	domainsList: DomainsListOutputSchema,
	domainsGet: DomainSchema,
	domainAliasesList: DomainAliasesListOutputSchema,
	customersGet: CustomerSchema,
} as const;

export { UserSchema, GroupSchema, MemberSchema, OrgUnitSchema, DomainSchema };
