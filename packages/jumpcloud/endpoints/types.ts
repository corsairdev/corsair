import { z } from 'zod';

// Wire contracts for the JumpCloud API (API 1.0 at https://console.jumpcloud.com/api,
// API 2.0 at https://console.jumpcloud.com/api/v2). Every input schema mirrors the
// published parameters and request body of its operation in the official OpenAPI
// specs (docs.jumpcloud.com/api/1.0/index.yaml, docs.jumpcloud.com/api/2.0/index.yaml)
// with the provider's wire names. Response schemas come from the documented 2xx
// bodies; ops the API documents without a JSON body parse as void.
//
// The JumpCloud specs leave many response fields without a type or a property
// schema (e.g. `mfaEnrollment.*`, `fileSystem`, `lastContact`, unrestricted
// arrays). Those output fields are mirrored verbatim as `z.unknown()` or
// `z.record(z.string(), z.unknown())`: a stricter type would invent structure
// the provider does not publish, and `.loose()` output objects keep a response
// parsing when JumpCloud adds or drops such a field.
// Output fields are `.nullish()`: the live API sends null for fields the spec
// types as plain strings (e.g. an application's `parentApp`).
// Output enums are `.or(z.string())`: JumpCloud adds values over time (new
// device states, colors, account types) and a new value must not fail a read.
const safePathParam = z
	.string()
	.min(1)
	.refine(
		(value) =>
			!value.includes('/') &&
			!value.includes('\\') &&
			value !== '.' &&
			value !== '..',
		{ message: 'path parameters must not contain traversal characters' },
	);

// POST /search/* bodies (docs.jumpcloud.com/api/1.0 search_systemusers_post):
// `filter` is either an array of query expressions (all must match) or an
// object with a single `and` or `or` key holding that array. A query
// expression maps a field name to a value or an operator object, e.g.
// {"department":"IT"} or {"lastContact":{"$gt":"2026-01-01"}}.
// unknown: expression values are any JSON the provider's query language
// accepts (strings, numbers, operator objects), so they stay unknown.
const SearchQueryExpressionSchema = z.record(z.string(), z.unknown());

const SearchFilterSchema = z.union([
	z.array(SearchQueryExpressionSchema),
	z
		.object({
			and: z.array(SearchQueryExpressionSchema).optional(),
			or: z.array(SearchQueryExpressionSchema).optional(),
		})
		.strict(),
]);

const SearchBodySchema = z
	.object({
		filter: SearchFilterSchema.describe(
			'Query expressions that must all match, e.g. [{"department":"IT"}], or {"or":[{"department":"IT"},{"department":"Sales"}]} to match any.',
		).optional(),
		searchFilter: z
			.object({
				searchTerm: z
					.union([z.string(), z.array(z.string())])
					.describe('Text (or list of texts) to match partially.'),
				fields: z
					.array(z.string())
					.describe('Fields to search in, e.g. ["email"].'),
			})
			.describe(
				'Partial text search: records where any of `fields` contains `searchTerm`.',
			)
			.optional(),
		fields: z
			.string()
			.describe('Space separated fields to include in each record.')
			.optional(),
	})
	.loose();

export const UsersListInputSchema = z
	.object({
		limit: z
			.number()
			.describe('The number of records to return at once.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.string()
			.describe(
				'The space separated fields used to sort the collection.\nUser-entered text fields such as lastname, firstname, and jobTitle are sorted ignoring case.\nEmail, status, and category fields use stored ordering.\nDefault sort is ascending, prefix with `-` to sort descending.\n',
			)
			.optional(),
		fields: z
			.string()
			.describe(
				'The space separated fields included in the returned records.\nIf omitted the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.string()
			.describe(
				'A filter to apply to the query. See the supported operators below. For more complex searches,\nsee the related `/search/<domain>` endpoints,\ne.g. `/search/systems`.\n\n**Filter structure**: The filter syntax follows a consistent pattern of `<field>:<operator>:<value>` (e.g. `department:$eq:Finance`)\n\n*',
			)
			.optional(),
		search: z
			.string()
			.describe(
				'A nested object containing a `searchTerm` string or array of strings and a list of `fields` to search on.',
			)
			.optional(),
	})
	.loose();

export type UsersListInput = z.infer<typeof UsersListInputSchema>;

export const UsersListOutputSchema = z
	.object({
		results: z
			.array(z.unknown())
			.describe('The list of system users.')
			.nullish(),
		totalCount: z
			.number()
			.describe('The total number of system users.')
			.nullish(),
	})
	.loose();

export type UsersListOutput = z.infer<typeof UsersListOutputSchema>;

export const UsersCreateInputSchema = z
	.object({
		fullValidationDetails: z
			.string()
			.describe(
				'Pass this query parameter when a client wants all validation errors\nto be returned with a detailed error response for the form field\nspecified. The current form fields are allowed:\n\n* `password`\n\n#### Password validation flag\nUse the `password` validation flag to receive details on a possible\nbad re',
			)
			.optional(),
		body: z
			.object({
				account_locked: z.boolean().optional(),
				activated: z.boolean().optional(),
				addresses: z
					.array(
						z
							.object({
								country: z.string().optional(),
								extendedAddress: z.string().optional(),
								locality: z.string().optional(),
								poBox: z.string().optional(),
								postalCode: z.string().optional(),
								region: z.string().optional(),
								streetAddress: z.string().optional(),
								type: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
				allow_public_key: z.boolean().optional(),
				alternateEmail: z.string().optional(),
				attributes: z
					.array(
						z
							.object({
								name: z.string().optional(),
								value: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
				company: z.string().optional(),
				costCenter: z.string().optional(),
				department: z.string().optional(),
				description: z.string().optional(),
				disableDeviceMaxLoginAttempts: z.boolean().optional(),
				displayname: z.string().optional(),
				email: z.string(),
				employeeIdentifier: z
					.string()
					.describe('Must be unique per user. ')
					.optional(),
				employeeType: z.string().optional(),
				enable_managed_uid: z.boolean().optional(),
				enable_user_portal_multifactor: z.boolean().optional(),
				external_dn: z.string().optional(),
				external_password_expiration_date: z.string().optional(),
				external_source_type: z.string().optional(),
				externally_managed: z
					.boolean()
					.describe(
						'The externally_managed property has been deprecated. Whenever a user has their externally_managed field modified their restrictedFields property gets populated with the appropriate value, even if it is already set to a value an administrator manually set.',
					)
					.optional(),
				firstname: z.string().optional(),
				jobTitle: z.string().optional(),
				lastname: z.string().optional(),
				ldap_binding_user: z.boolean().optional(),
				location: z.string().optional(),
				manager: z
					.string()
					.describe(
						'Relation with another systemuser to identify the last as a manager.',
					)
					.optional(),
				mfa: z
					.object({
						configured: z.boolean().optional(),
						exclusion: z.boolean().optional(),
						exclusionUntil: z.string().optional(),
						exclusionDays: z.number().optional(),
					})
					.loose()
					.optional(),
				middlename: z.string().optional(),
				password: z.string().optional(),
				password_never_expires: z.boolean().optional(),
				passwordless_sudo: z.boolean().optional(),
				phoneNumbers: z
					.array(
						z
							.object({
								number: z.string().optional(),
								type: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
				public_key: z.string().optional(),
				recoveryEmail: z
					.object({
						address: z.string().optional(),
					})
					.loose()
					.optional(),
				relationships: z
					.array(
						z
							.object({
								type: z.string().optional(),
								value: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
				samba_service_user: z.boolean().optional(),
				state: z.enum(['STAGED', 'ACTIVATED', 'SUSPENDED']).optional(),
				sudo: z.boolean().optional(),
				suspended: z.boolean().optional(),
				tags: z.array(z.string()).optional(),
				unix_guid: z.number().optional(),
				unix_uid: z.number().optional(),
				username: z.string(),
				managedAppleId: z.string().optional(),
				// unknown: the spec declares delegatedAuthority without a type, so the
				// delegation payload has no published shape to type.
				delegatedAuthority: z
					.unknown()
					.describe('Used by auth to determine password delegation authority')
					.optional(),
				// unknown: restrictedFields is an untyped array in the spec and its
				// item shape is not published.
				restrictedFields: z.array(z.unknown()).optional(),
			})
			.loose(),
	})
	.loose();

export type UsersCreateInput = z.infer<typeof UsersCreateInputSchema>;

export const UsersCreateOutputSchema = z
	.object({
		_id: z.string().nullish(),
		account_locked: z.boolean().nullish(),
		account_locked_date: z.unknown().nullish(),
		activated: z.boolean().nullish(),
		admin: z.unknown().nullish(),
		addresses: z
			.array(
				z
					.object({
						country: z.string().nullish(),
						extendedAddress: z.string().nullish(),
						id: z.string().nullish(),
						locality: z.string().nullish(),
						poBox: z.string().nullish(),
						postalCode: z.string().nullish(),
						region: z.string().nullish(),
						streetAddress: z.string().nullish(),
						type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		allow_public_key: z.boolean().nullish(),
		alternateEmail: z.string().nullish(),
		attributes: z.array(z.unknown()).nullish(),
		badLoginAttempts: z.number().nullish(),
		company: z.string().nullish(),
		costCenter: z.string().nullish(),
		created: z.string().nullish(),
		department: z.string().nullish(),
		description: z.string().nullish(),
		disableDeviceMaxLoginAttempts: z.boolean().nullish(),
		displayname: z.string().nullish(),
		email: z.string().nullish(),
		employeeIdentifier: z
			.string()
			.describe('Must be unique per user. ')
			.nullish(),
		employeeType: z.string().nullish(),
		enable_managed_uid: z.boolean().nullish(),
		enable_user_portal_multifactor: z.boolean().nullish(),
		external_dn: z.string().nullish(),
		external_password_expiration_date: z.string().nullish(),
		external_source_type: z.string().nullish(),
		externally_managed: z
			.boolean()
			.describe(
				'The externally_managed property has been deprecated. Whenever a user has their externally_managed field modified their restrictedFields property gets populated with the appropriate value, even if it is already set to a value an administrator manually set.',
			)
			.nullish(),
		firstname: z.string().nullish(),
		jobTitle: z.string().nullish(),
		lastname: z.string().nullish(),
		ldap_binding_user: z.boolean().nullish(),
		location: z.string().nullish(),
		manager: z
			.string()
			.describe(
				'Relation with another systemuser to identify the last as a manager.',
			)
			.nullish(),
		mfa: z
			.object({
				configured: z.boolean().nullish(),
				exclusion: z.boolean().nullish(),
				exclusionUntil: z.string().nullish(),
				exclusionDays: z.number().nullish(),
			})
			.loose()
			.nullish(),
		mfaEnrollment: z
			.object({
				totpStatus: z.unknown().nullish(),
				webAuthnStatus: z.unknown().nullish(),
				pushStatus: z.unknown().nullish(),
				smsStatus: z.unknown().nullish(),
				overallStatus: z.unknown().nullish(),
				jcGoStatus: z.unknown().nullish(),
			})
			.loose()
			.nullish(),
		middlename: z.string().nullish(),
		organization: z.string().nullish(),
		password_date: z.unknown().nullish(),
		password_expiration_date: z.unknown().nullish(),
		password_expired: z.boolean().nullish(),
		password_never_expires: z.boolean().nullish(),
		passwordless_sudo: z.boolean().nullish(),
		phoneNumbers: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						number: z.string().nullish(),
						type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		public_key: z.string().nullish(),
		recoveryEmail: z
			.object({
				address: z.string().nullish(),
				verified: z.boolean().nullish(),
				verifiedAt: z.string().nullish(),
			})
			.loose()
			.nullish(),
		relationships: z
			.array(
				z
					.object({
						type: z.string().nullish(),
						value: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		samba_service_user: z.boolean().nullish(),
		ssh_keys: z.array(z.unknown()).nullish(),
		state: z
			.enum(['STAGED', 'ACTIVATED', 'SUSPENDED'])
			.or(z.string())
			.nullish(),
		sudo: z.boolean().nullish(),
		suspended: z.boolean().nullish(),
		tags: z.array(z.string()).nullish(),
		totp_enabled: z.boolean().nullish(),
		unix_guid: z.number().nullish(),
		unix_uid: z.number().nullish(),
		username: z.string().nullish(),
		managedAppleId: z.string().nullish(),
		creationSource: z.string().nullish(),
		delegatedAuthority: z
			.unknown()
			.describe('Used by auth to determine password delegation authority')
			.nullish(),
		restrictedFields: z.array(z.unknown()).nullish(),
	})
	.loose();

export type UsersCreateOutput = z.infer<typeof UsersCreateOutputSchema>;

export const UsersGetInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
		fields: z
			.string()
			.describe(
				'Use a space seperated string of field parameters to include the data in the response. If omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.string()
			.describe(
				'A filter to apply to the query. See the supported operators below. For more complex searches,\nsee the related `/search/<domain>` endpoints,\ne.g. `/search/systems`.\n\n**Filter structure**: The filter syntax follows a consistent pattern of `<field>:<operator>:<value>` (e.g. `department:$eq:Finance`)\n\n*',
			)
			.optional(),
	})
	.loose();

export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

export const UsersGetOutputSchema = z
	.object({
		_id: z.string().nullish(),
		account_locked: z.boolean().nullish(),
		account_locked_date: z.unknown().nullish(),
		activated: z.boolean().nullish(),
		admin: z.unknown().nullish(),
		addresses: z
			.array(
				z
					.object({
						country: z.string().nullish(),
						extendedAddress: z.string().nullish(),
						id: z.string().nullish(),
						locality: z.string().nullish(),
						poBox: z.string().nullish(),
						postalCode: z.string().nullish(),
						region: z.string().nullish(),
						streetAddress: z.string().nullish(),
						type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		allow_public_key: z.boolean().nullish(),
		alternateEmail: z.string().nullish(),
		attributes: z.array(z.unknown()).nullish(),
		badLoginAttempts: z.number().nullish(),
		company: z.string().nullish(),
		costCenter: z.string().nullish(),
		created: z.string().nullish(),
		department: z.string().nullish(),
		description: z.string().nullish(),
		disableDeviceMaxLoginAttempts: z.boolean().nullish(),
		displayname: z.string().nullish(),
		email: z.string().nullish(),
		employeeIdentifier: z
			.string()
			.describe('Must be unique per user. ')
			.nullish(),
		employeeType: z.string().nullish(),
		enable_managed_uid: z.boolean().nullish(),
		enable_user_portal_multifactor: z.boolean().nullish(),
		external_dn: z.string().nullish(),
		external_password_expiration_date: z.string().nullish(),
		external_source_type: z.string().nullish(),
		externally_managed: z
			.boolean()
			.describe(
				'The externally_managed property has been deprecated. Whenever a user has their externally_managed field modified their restrictedFields property gets populated with the appropriate value, even if it is already set to a value an administrator manually set.',
			)
			.nullish(),
		firstname: z.string().nullish(),
		jobTitle: z.string().nullish(),
		lastname: z.string().nullish(),
		ldap_binding_user: z.boolean().nullish(),
		location: z.string().nullish(),
		manager: z
			.string()
			.describe(
				'Relation with another systemuser to identify the last as a manager.',
			)
			.nullish(),
		mfa: z
			.object({
				configured: z.boolean().nullish(),
				exclusion: z.boolean().nullish(),
				exclusionUntil: z.string().nullish(),
				exclusionDays: z.number().nullish(),
			})
			.loose()
			.nullish(),
		mfaEnrollment: z
			.object({
				totpStatus: z.unknown().nullish(),
				webAuthnStatus: z.unknown().nullish(),
				pushStatus: z.unknown().nullish(),
				smsStatus: z.unknown().nullish(),
				overallStatus: z.unknown().nullish(),
				jcGoStatus: z.unknown().nullish(),
			})
			.loose()
			.nullish(),
		middlename: z.string().nullish(),
		organization: z.string().nullish(),
		password_date: z.unknown().nullish(),
		password_expiration_date: z.unknown().nullish(),
		password_expired: z.boolean().nullish(),
		password_never_expires: z.boolean().nullish(),
		passwordless_sudo: z.boolean().nullish(),
		phoneNumbers: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						number: z.string().nullish(),
						type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		public_key: z.string().nullish(),
		recoveryEmail: z
			.object({
				address: z.string().nullish(),
				verified: z.boolean().nullish(),
				verifiedAt: z.string().nullish(),
			})
			.loose()
			.nullish(),
		relationships: z
			.array(
				z
					.object({
						type: z.string().nullish(),
						value: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		samba_service_user: z.boolean().nullish(),
		ssh_keys: z.array(z.unknown()).nullish(),
		state: z
			.enum(['STAGED', 'ACTIVATED', 'SUSPENDED'])
			.or(z.string())
			.nullish(),
		sudo: z.boolean().nullish(),
		suspended: z.boolean().nullish(),
		tags: z.array(z.string()).nullish(),
		totp_enabled: z.boolean().nullish(),
		unix_guid: z.number().nullish(),
		unix_uid: z.number().nullish(),
		username: z.string().nullish(),
		managedAppleId: z.string().nullish(),
		creationSource: z.string().nullish(),
		delegatedAuthority: z
			.unknown()
			.describe('Used by auth to determine password delegation authority')
			.nullish(),
		restrictedFields: z.array(z.unknown()).nullish(),
	})
	.loose();

export type UsersGetOutput = z.infer<typeof UsersGetOutputSchema>;

export const UsersUpdateInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
		fullValidationDetails: z
			.string()
			.describe(
				'This endpoint can take in a query when a client wants all validation errors to be returned with error response for the form field specified, i.e. \'password\'\n#### Password validation flag\nUse the "password" validation flag to receive details on a possible bad request response\nWithout the `password` f',
			)
			.optional(),
		body: z
			.object({
				account_locked: z.boolean().optional(),
				addresses: z
					.array(
						z
							.object({
								country: z.string().optional(),
								extendedAddress: z.string().optional(),
								locality: z.string().optional(),
								poBox: z.string().optional(),
								postalCode: z.string().optional(),
								region: z.string().optional(),
								streetAddress: z.string().optional(),
								type: z.string().optional(),
							})
							.loose(),
					)
					.describe(
						'type, poBox, extendedAddress, streetAddress, locality, region, postalCode, country',
					)
					.optional(),
				allow_public_key: z.boolean().optional(),
				alternateEmail: z.string().optional(),
				attributes: z
					.array(
						z
							.object({
								name: z.string().optional(),
								value: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
				company: z.string().optional(),
				costCenter: z.string().optional(),
				department: z.string().optional(),
				description: z.string().optional(),
				disableDeviceMaxLoginAttempts: z.boolean().optional(),
				displayname: z.string().optional(),
				email: z.string().optional(),
				employeeIdentifier: z
					.string()
					.describe('Must be unique per user. ')
					.optional(),
				employeeType: z.string().optional(),
				enable_managed_uid: z.boolean().optional(),
				enable_user_portal_multifactor: z.boolean().optional(),
				external_dn: z.string().optional(),
				external_password_expiration_date: z.string().optional(),
				external_source_type: z.string().optional(),
				externally_managed: z
					.boolean()
					.describe(
						'The externally_managed property has been deprecated. Whenever a user has their externally_managed field modified their restrictedFields property gets populated with the appropriate value, even if it is already set to a value an administrator manually set.',
					)
					.optional(),
				firstname: z.string().optional(),
				jobTitle: z.string().optional(),
				lastname: z.string().optional(),
				ldap_binding_user: z.boolean().optional(),
				location: z.string().optional(),
				manager: z
					.string()
					.describe(
						'Relation with another systemuser to identify the last as a manager.',
					)
					.optional(),
				mfa: z
					.object({
						configured: z.boolean().optional(),
						exclusion: z.boolean().optional(),
						exclusionUntil: z.string().optional(),
						exclusionDays: z.number().optional(),
					})
					.loose()
					.optional(),
				middlename: z.string().optional(),
				password: z.string().optional(),
				password_never_expires: z.boolean().optional(),
				phoneNumbers: z
					.array(
						z
							.object({
								number: z.string().optional(),
								type: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
				public_key: z.string().optional(),
				relationships: z
					.array(
						z
							.object({
								type: z.string().optional(),
								value: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
				samba_service_user: z.boolean().optional(),
				// unknown: ssh_keys is an untyped array in the update spec; the typed
				// key shape is only published on the sshkeys read endpoint.
				ssh_keys: z.array(z.unknown()).optional(),
				state: z.enum(['ACTIVATED', 'SUSPENDED']).optional(),
				sudo: z.boolean().optional(),
				suspended: z.boolean().optional(),
				tags: z.array(z.string()).optional(),
				unix_guid: z.number().optional(),
				unix_uid: z.number().optional(),
				username: z.string().optional(),
				managedAppleId: z.string().optional(),
				// unknown: the spec declares delegatedAuthority without a type, so the
				// delegation payload has no published shape to type.
				delegatedAuthority: z
					.unknown()
					.describe('Used by auth to determine password delegation authority')
					.optional(),
				// unknown: restrictedFields is an untyped array in the spec and its
				// item shape is not published.
				restrictedFields: z.array(z.unknown()).optional(),
			})
			.loose(),
	})
	.loose();

export type UsersUpdateInput = z.infer<typeof UsersUpdateInputSchema>;

export const UsersUpdateOutputSchema = z
	.object({
		_id: z.string().nullish(),
		account_locked: z.boolean().nullish(),
		account_locked_date: z.unknown().nullish(),
		activated: z.boolean().nullish(),
		admin: z.unknown().nullish(),
		addresses: z
			.array(
				z
					.object({
						country: z.string().nullish(),
						extendedAddress: z.string().nullish(),
						id: z.string().nullish(),
						locality: z.string().nullish(),
						poBox: z.string().nullish(),
						postalCode: z.string().nullish(),
						region: z.string().nullish(),
						streetAddress: z.string().nullish(),
						type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		allow_public_key: z.boolean().nullish(),
		alternateEmail: z.string().nullish(),
		attributes: z.array(z.unknown()).nullish(),
		badLoginAttempts: z.number().nullish(),
		company: z.string().nullish(),
		costCenter: z.string().nullish(),
		created: z.string().nullish(),
		department: z.string().nullish(),
		description: z.string().nullish(),
		disableDeviceMaxLoginAttempts: z.boolean().nullish(),
		displayname: z.string().nullish(),
		email: z.string().nullish(),
		employeeIdentifier: z
			.string()
			.describe('Must be unique per user. ')
			.nullish(),
		employeeType: z.string().nullish(),
		enable_managed_uid: z.boolean().nullish(),
		enable_user_portal_multifactor: z.boolean().nullish(),
		external_dn: z.string().nullish(),
		external_password_expiration_date: z.string().nullish(),
		external_source_type: z.string().nullish(),
		externally_managed: z
			.boolean()
			.describe(
				'The externally_managed property has been deprecated. Whenever a user has their externally_managed field modified their restrictedFields property gets populated with the appropriate value, even if it is already set to a value an administrator manually set.',
			)
			.nullish(),
		firstname: z.string().nullish(),
		jobTitle: z.string().nullish(),
		lastname: z.string().nullish(),
		ldap_binding_user: z.boolean().nullish(),
		location: z.string().nullish(),
		manager: z
			.string()
			.describe(
				'Relation with another systemuser to identify the last as a manager.',
			)
			.nullish(),
		mfa: z
			.object({
				configured: z.boolean().nullish(),
				exclusion: z.boolean().nullish(),
				exclusionUntil: z.string().nullish(),
				exclusionDays: z.number().nullish(),
			})
			.loose()
			.nullish(),
		mfaEnrollment: z
			.object({
				totpStatus: z.unknown().nullish(),
				webAuthnStatus: z.unknown().nullish(),
				pushStatus: z.unknown().nullish(),
				smsStatus: z.unknown().nullish(),
				overallStatus: z.unknown().nullish(),
				jcGoStatus: z.unknown().nullish(),
			})
			.loose()
			.nullish(),
		middlename: z.string().nullish(),
		organization: z.string().nullish(),
		password_date: z.unknown().nullish(),
		password_expiration_date: z.unknown().nullish(),
		password_expired: z.boolean().nullish(),
		password_never_expires: z.boolean().nullish(),
		passwordless_sudo: z.boolean().nullish(),
		phoneNumbers: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						number: z.string().nullish(),
						type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		public_key: z.string().nullish(),
		recoveryEmail: z
			.object({
				address: z.string().nullish(),
				verified: z.boolean().nullish(),
				verifiedAt: z.string().nullish(),
			})
			.loose()
			.nullish(),
		relationships: z
			.array(
				z
					.object({
						type: z.string().nullish(),
						value: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		samba_service_user: z.boolean().nullish(),
		ssh_keys: z.array(z.unknown()).nullish(),
		state: z
			.enum(['STAGED', 'ACTIVATED', 'SUSPENDED'])
			.or(z.string())
			.nullish(),
		sudo: z.boolean().nullish(),
		suspended: z.boolean().nullish(),
		tags: z.array(z.string()).nullish(),
		totp_enabled: z.boolean().nullish(),
		unix_guid: z.number().nullish(),
		unix_uid: z.number().nullish(),
		username: z.string().nullish(),
		managedAppleId: z.string().nullish(),
		creationSource: z.string().nullish(),
		delegatedAuthority: z
			.unknown()
			.describe('Used by auth to determine password delegation authority')
			.nullish(),
		restrictedFields: z.array(z.unknown()).nullish(),
	})
	.loose();

export type UsersUpdateOutput = z.infer<typeof UsersUpdateOutputSchema>;

export const UsersDeleteInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
		cascade_manager: z
			.string()
			.describe(
				'This is an optional flag that can be enabled on the DELETE call, DELETE /systemusers/{id}?cascade_manager=null. This parameter will clear the Manager attribute on all direct reports and then delete the account.',
			)
			.optional(),
	})
	.loose();

export type UsersDeleteInput = z.infer<typeof UsersDeleteInputSchema>;

export const UsersDeleteOutputSchema = z
	.object({
		_id: z.string().nullish(),
		account_locked: z.boolean().nullish(),
		account_locked_date: z.unknown().nullish(),
		activated: z.boolean().nullish(),
		admin: z.unknown().nullish(),
		addresses: z
			.array(
				z
					.object({
						country: z.string().nullish(),
						extendedAddress: z.string().nullish(),
						id: z.string().nullish(),
						locality: z.string().nullish(),
						poBox: z.string().nullish(),
						postalCode: z.string().nullish(),
						region: z.string().nullish(),
						streetAddress: z.string().nullish(),
						type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		allow_public_key: z.boolean().nullish(),
		alternateEmail: z.string().nullish(),
		attributes: z.array(z.unknown()).nullish(),
		badLoginAttempts: z.number().nullish(),
		company: z.string().nullish(),
		costCenter: z.string().nullish(),
		created: z.string().nullish(),
		department: z.string().nullish(),
		description: z.string().nullish(),
		disableDeviceMaxLoginAttempts: z.boolean().nullish(),
		displayname: z.string().nullish(),
		email: z.string().nullish(),
		employeeIdentifier: z
			.string()
			.describe('Must be unique per user. ')
			.nullish(),
		employeeType: z.string().nullish(),
		enable_managed_uid: z.boolean().nullish(),
		enable_user_portal_multifactor: z.boolean().nullish(),
		external_dn: z.string().nullish(),
		external_password_expiration_date: z.string().nullish(),
		external_source_type: z.string().nullish(),
		externally_managed: z
			.boolean()
			.describe(
				'The externally_managed property has been deprecated. Whenever a user has their externally_managed field modified their restrictedFields property gets populated with the appropriate value, even if it is already set to a value an administrator manually set.',
			)
			.nullish(),
		firstname: z.string().nullish(),
		jobTitle: z.string().nullish(),
		lastname: z.string().nullish(),
		ldap_binding_user: z.boolean().nullish(),
		location: z.string().nullish(),
		manager: z
			.string()
			.describe(
				'Relation with another systemuser to identify the last as a manager.',
			)
			.nullish(),
		mfa: z
			.object({
				configured: z.boolean().nullish(),
				exclusion: z.boolean().nullish(),
				exclusionUntil: z.string().nullish(),
				exclusionDays: z.number().nullish(),
			})
			.loose()
			.nullish(),
		mfaEnrollment: z
			.object({
				totpStatus: z.unknown().nullish(),
				webAuthnStatus: z.unknown().nullish(),
				pushStatus: z.unknown().nullish(),
				smsStatus: z.unknown().nullish(),
				overallStatus: z.unknown().nullish(),
				jcGoStatus: z.unknown().nullish(),
			})
			.loose()
			.nullish(),
		middlename: z.string().nullish(),
		organization: z.string().nullish(),
		password_date: z.unknown().nullish(),
		password_expiration_date: z.unknown().nullish(),
		password_expired: z.boolean().nullish(),
		password_never_expires: z.boolean().nullish(),
		passwordless_sudo: z.boolean().nullish(),
		phoneNumbers: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						number: z.string().nullish(),
						type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		public_key: z.string().nullish(),
		recoveryEmail: z
			.object({
				address: z.string().nullish(),
				verified: z.boolean().nullish(),
				verifiedAt: z.string().nullish(),
			})
			.loose()
			.nullish(),
		relationships: z
			.array(
				z
					.object({
						type: z.string().nullish(),
						value: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		samba_service_user: z.boolean().nullish(),
		ssh_keys: z.array(z.unknown()).nullish(),
		state: z
			.enum(['STAGED', 'ACTIVATED', 'SUSPENDED'])
			.or(z.string())
			.nullish(),
		sudo: z.boolean().nullish(),
		suspended: z.boolean().nullish(),
		tags: z.array(z.string()).nullish(),
		totp_enabled: z.boolean().nullish(),
		unix_guid: z.number().nullish(),
		unix_uid: z.number().nullish(),
		username: z.string().nullish(),
		managedAppleId: z.string().nullish(),
		creationSource: z.string().nullish(),
		delegatedAuthority: z
			.unknown()
			.describe('Used by auth to determine password delegation authority')
			.nullish(),
		restrictedFields: z.array(z.unknown()).nullish(),
	})
	.loose();

export type UsersDeleteOutput = z.infer<typeof UsersDeleteOutputSchema>;

export const UsersSetPasswordInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
		body: z
			.object({
				password: z.string().optional(),
			})
			.loose(),
	})
	.loose();

export type UsersSetPasswordInput = z.infer<typeof UsersSetPasswordInputSchema>;

export const UsersSetPasswordOutputSchema = z.void();

export type UsersSetPasswordOutput = z.infer<
	typeof UsersSetPasswordOutputSchema
>;

export const UsersUnlockInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
	})
	.loose();

export type UsersUnlockInput = z.infer<typeof UsersUnlockInputSchema>;

// The live API answers text/plain "OK".
export const UsersUnlockOutputSchema = z.string();

export type UsersUnlockOutput = z.infer<typeof UsersUnlockOutputSchema>;

export const UsersExpirePasswordInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
	})
	.loose();

export type UsersExpirePasswordInput = z.infer<
	typeof UsersExpirePasswordInputSchema
>;

// Documented as a string; the live API answers {"orgPasswordPolicyUpdate":false}.
export const UsersExpirePasswordOutputSchema = z.union([
	z.string(),
	z.object({ orgPasswordPolicyUpdate: z.boolean().nullish() }).loose(),
]);

export type UsersExpirePasswordOutput = z.infer<
	typeof UsersExpirePasswordOutputSchema
>;

export const UsersResetMfaInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
		body: z
			.object({
				exclusion: z.boolean().optional(),
				exclusionUntil: z.string().optional(),
				exclusionDays: z.number().optional(),
			})
			.loose(),
	})
	.loose();

export type UsersResetMfaInput = z.infer<typeof UsersResetMfaInputSchema>;

export const UsersResetMfaOutputSchema = z.string();

export type UsersResetMfaOutput = z.infer<typeof UsersResetMfaOutputSchema>;

export const UsersEnforceMfaInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
		body: z
			.object({
				enable_user_portal_multifactor: z
					.boolean()
					.describe('Whether to require MFA for user portal login')
					.optional(),
				mfa: z
					.object({
						configured: z.boolean().optional(),
						exclusion: z.boolean().optional(),
						exclusionUntil: z.string().optional(),
						exclusionDays: z.number().optional(),
					})
					.loose()
					.optional(),
			})
			.loose(),
	})
	.loose();

export type UsersEnforceMfaInput = z.infer<typeof UsersEnforceMfaInputSchema>;

export const UsersEnforceMfaOutputSchema = z.void();

export type UsersEnforceMfaOutput = z.infer<typeof UsersEnforceMfaOutputSchema>;

export const UsersSyncMfaInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
	})
	.loose();

export type UsersSyncMfaInput = z.infer<typeof UsersSyncMfaInputSchema>;

// Documented without a body; the live API answers text/plain "OK".
export const UsersSyncMfaOutputSchema = z.string().optional();

export type UsersSyncMfaOutput = z.infer<typeof UsersSyncMfaOutputSchema>;

export const UsersListSshKeysInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
	})
	.loose();

export type UsersListSshKeysInput = z.infer<typeof UsersListSshKeysInputSchema>;

export const UsersListSshKeysOutputSchema = z.array(
	z
		.object({
			_id: z.string().describe('The ID of the SSH key.').nullish(),
			create_date: z
				.string()
				.describe('The date the SSH key was created.')
				.nullish(),
			name: z.string().describe('The name of the SSH key.').nullish(),
			public_key: z.string().describe('The Public SSH key.').nullish(),
		})
		.loose(),
);

export type UsersListSshKeysOutput = z.infer<
	typeof UsersListSshKeysOutputSchema
>;

export const SystemsListInputSchema = z
	.object({
		fields: z
			.string()
			.describe(
				'Use a space seperated string of field parameters to include the data in the response. If omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		search: z
			.string()
			.describe(
				'A nested object containing a `searchTerm` string or array of strings and a list of `fields` to search on.',
			)
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.string()
			.describe(
				'Use space separated sort parameters to sort the collection.\nDefault sort is ascending. Prefix with `-` to sort descending.\n',
			)
			.optional(),
		filter: z
			.string()
			.describe(
				'A filter to apply to the query. See the supported operators below. For more complex searches,\nsee the related `/search/<domain>` endpoints,\ne.g. `/search/systems`.\n\n**Filter structure**: The filter syntax follows a consistent pattern of `<field>:<operator>:<value>` (e.g. `department:$eq:Finance`)\n\n*',
			)
			.optional(),
	})
	.loose();

export type SystemsListInput = z.infer<typeof SystemsListInputSchema>;

export const SystemsListOutputSchema = z
	.object({
		results: z.array(z.unknown()).describe('The list of systems.').nullish(),
		totalCount: z.number().describe('The total number of systems.').nullish(),
	})
	.loose();

export type SystemsListOutput = z.infer<typeof SystemsListOutputSchema>;

export const SystemsGetInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
		fields: z
			.string()
			.describe(
				'Use a space seperated string of field parameters to include the data in the response. If omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.string()
			.describe(
				'A filter to apply to the query. See the supported operators below. For more complex searches,\nsee the related `/search/<domain>` endpoints,\ne.g. `/search/systems`.\n\n**Filter structure**: The filter syntax follows a consistent pattern of `<field>:<operator>:<value>` (e.g. `department:$eq:Finance`)\n\n*',
			)
			.optional(),
	})
	.loose();

export type SystemsGetInput = z.infer<typeof SystemsGetInputSchema>;

export const SystemsGetOutputSchema = z
	.object({
		_id: z.string().nullish(),
		active: z.boolean().nullish(),
		agentHasFullDiskAccess: z.boolean().nullish(),
		agentVersion: z.string().nullish(),
		allowMultiFactorAuthentication: z.boolean().nullish(),
		allowPublicKeyAuthentication: z.boolean().nullish(),
		allowSshPasswordAuthentication: z.boolean().nullish(),
		allowSshRootLogin: z.boolean().nullish(),
		amazonInstanceID: z.string().nullish(),
		arch: z.string().nullish(),
		archFamily: z.string().nullish(),
		attributes: z.array(z.unknown()).nullish(),
		connectionHistory: z.array(z.record(z.string(), z.unknown())).nullish(),
		created: z.string().nullish(),
		description: z.string().nullish(),
		desktopCapable: z.boolean().nullish(),
		displayName: z.string().nullish(),
		fde: z
			.object({
				active: z.boolean().nullish(),
				keyPresent: z.boolean().nullish(),
			})
			.loose()
			.describe('Indicates if the Full Disk Encryption is active in the system')
			.nullish(),
		fileSystem: z.unknown().nullish(),
		hasServiceAccount: z.boolean().nullish(),
		hostname: z.string().nullish(),
		hwVendor: z.string().nullish(),
		isPolicyBound: z.boolean().nullish(),
		lastContact: z.unknown().nullish(),
		modifySSHDConfig: z.boolean().nullish(),
		networkInterfaces: z
			.array(
				z
					.object({
						address: z.string().nullish(),
						family: z.enum(['IPv4', 'IPv6']).or(z.string()).nullish(),
						internal: z.boolean().nullish(),
						name: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		networkInfo: z
			.object({
				imei: z.string().describe('PII data; do not log.').nullish(),
				macAddress: z.string().describe('PII data; do not log.').nullish(),
				simInfo: z.array(z.record(z.string(), z.unknown())).nullish(),
			})
			.loose()
			.nullish(),
		organization: z.string().nullish(),
		os: z.string().nullish(),
		osVersionDetail: z
			.object({
				osName: z.string().nullish(),
				releaseName: z.string().nullish(),
				major: z.string().nullish(),
				minor: z.string().nullish(),
				patch: z.string().nullish(),
				majorNumber: z.number().nullish(),
				minorNumber: z.number().nullish(),
				patchNumber: z.number().nullish(),
				revision: z.string().nullish(),
				distributionName: z.string().nullish(),
				version: z.string().nullish(),
			})
			.loose()
			.nullish(),
		policyStats: z
			.object({
				duplicate: z.number().nullish(),
				failed: z.number().nullish(),
				pending: z.number().nullish(),
				success: z.number().nullish(),
				total: z.number().nullish(),
				unsupportedOs: z.number().nullish(),
			})
			.loose()
			.nullish(),
		provisionMetadata: z
			.object({
				provisioner: z
					.object({
						type: z
							.enum(['administrator', 'mdm', 'user'])
							.or(z.string())
							.nullish(),
						provisionerId: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		primarySystemUser: z
			.object({
				id: z.unknown().nullish(),
			})
			.loose()
			.nullish(),
		remoteIP: z.string().nullish(),
		serialNumber: z.string().nullish(),
		sshRootEnabled: z.boolean().nullish(),
		sshdParams: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						value: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		systemInsights: z
			.object({
				state: z
					.enum(['enabled', 'disabled', 'deferred'])
					.or(z.string())
					.nullish(),
			})
			.loose()
			.nullish(),
		systemTimezone: z.number().nullish(),
		tags: z.array(z.string()).nullish(),
		templateName: z.string().nullish(),
		version: z.string().nullish(),
		mdm: z
			.object({
				vendor: z
					.enum(['unknown', 'none', 'internal', 'external'])
					.or(z.string())
					.nullish(),
				internal: z
					.object({
						deviceId: z.string().nullish(),
						windowsDeviceId: z.string().nullish(),
					})
					.loose()
					.nullish(),
				profileIdentifier: z.string().nullish(),
				dep: z.boolean().nullish(),
				userApproved: z.boolean().nullish(),
				enrollmentType: z
					.enum(['unknown', 'automated device', 'device', 'user'])
					.or(z.string())
					.nullish(),
				providerId: z.string().nullish(),
				windows: z
					.object({
						upn: z.string().nullish(),
					})
					.loose()
					.nullish(),
				lostModeStatus: z.string().nullish(),
				deviceLockStatus: z.number().nullish(),
				enrollmentStatus: z.number().nullish(),
			})
			.loose()
			.nullish(),
		builtInCommands: z
			.array(
				z
					.object({
						type: z.enum(['security']).or(z.string()).nullish(),
						name: z
							.enum(['erase', 'lock', 'restart', 'shutdown'])
							.or(z.string())
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
		osFamily: z.string().nullish(),
		domainInfo: z
			.object({
				partOfDomain: z.boolean().nullish(),
				domainName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		userMetrics: z
			.array(
				z
					.object({
						userName: z.string().nullish(),
						admin: z.boolean().nullish(),
						managed: z.boolean().nullish(),
						suspended: z.boolean().nullish(),
						secureTokenEnabled: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
		serviceAccountState: z
			.object({
				hasSecureToken: z.boolean().nullish(),
				passwordODValid: z.boolean().nullish(),
				passwordAPFSValid: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		azureAdJoined: z.boolean().nullish(),
		displayManager: z.string().nullish(),
		secureLogin: z
			.object({
				supported: z.boolean().nullish(),
				enabled: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		remoteAssistAgentVersion: z.string().nullish(),
	})
	.loose();

export type SystemsGetOutput = z.infer<typeof SystemsGetOutputSchema>;

export const SystemsDeleteInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
	})
	.loose();

export type SystemsDeleteInput = z.infer<typeof SystemsDeleteInputSchema>;

export const SystemsDeleteOutputSchema = z
	.object({
		_id: z.string().nullish(),
		active: z.boolean().nullish(),
		agentHasFullDiskAccess: z.boolean().nullish(),
		agentVersion: z.string().nullish(),
		allowMultiFactorAuthentication: z.boolean().nullish(),
		allowPublicKeyAuthentication: z.boolean().nullish(),
		allowSshPasswordAuthentication: z.boolean().nullish(),
		allowSshRootLogin: z.boolean().nullish(),
		amazonInstanceID: z.string().nullish(),
		arch: z.string().nullish(),
		archFamily: z.string().nullish(),
		attributes: z.array(z.unknown()).nullish(),
		connectionHistory: z.array(z.record(z.string(), z.unknown())).nullish(),
		created: z.string().nullish(),
		description: z.string().nullish(),
		desktopCapable: z.boolean().nullish(),
		displayName: z.string().nullish(),
		fde: z
			.object({
				active: z.boolean().nullish(),
				keyPresent: z.boolean().nullish(),
			})
			.loose()
			.describe('Indicates if the Full Disk Encryption is active in the system')
			.nullish(),
		fileSystem: z.unknown().nullish(),
		hasServiceAccount: z.boolean().nullish(),
		hostname: z.string().nullish(),
		hwVendor: z.string().nullish(),
		isPolicyBound: z.boolean().nullish(),
		lastContact: z.unknown().nullish(),
		modifySSHDConfig: z.boolean().nullish(),
		networkInterfaces: z
			.array(
				z
					.object({
						address: z.string().nullish(),
						family: z.enum(['IPv4', 'IPv6']).or(z.string()).nullish(),
						internal: z.boolean().nullish(),
						name: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		networkInfo: z
			.object({
				imei: z.string().describe('PII data; do not log.').nullish(),
				macAddress: z.string().describe('PII data; do not log.').nullish(),
				simInfo: z.array(z.record(z.string(), z.unknown())).nullish(),
			})
			.loose()
			.nullish(),
		organization: z.string().nullish(),
		os: z.string().nullish(),
		osVersionDetail: z
			.object({
				osName: z.string().nullish(),
				releaseName: z.string().nullish(),
				major: z.string().nullish(),
				minor: z.string().nullish(),
				patch: z.string().nullish(),
				majorNumber: z.number().nullish(),
				minorNumber: z.number().nullish(),
				patchNumber: z.number().nullish(),
				revision: z.string().nullish(),
				distributionName: z.string().nullish(),
				version: z.string().nullish(),
			})
			.loose()
			.nullish(),
		policyStats: z
			.object({
				duplicate: z.number().nullish(),
				failed: z.number().nullish(),
				pending: z.number().nullish(),
				success: z.number().nullish(),
				total: z.number().nullish(),
				unsupportedOs: z.number().nullish(),
			})
			.loose()
			.nullish(),
		provisionMetadata: z
			.object({
				provisioner: z
					.object({
						type: z
							.enum(['administrator', 'mdm', 'user'])
							.or(z.string())
							.nullish(),
						provisionerId: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		primarySystemUser: z
			.object({
				id: z.unknown().nullish(),
			})
			.loose()
			.nullish(),
		remoteIP: z.string().nullish(),
		serialNumber: z.string().nullish(),
		sshRootEnabled: z.boolean().nullish(),
		sshdParams: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						value: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		systemInsights: z
			.object({
				state: z
					.enum(['enabled', 'disabled', 'deferred'])
					.or(z.string())
					.nullish(),
			})
			.loose()
			.nullish(),
		systemTimezone: z.number().nullish(),
		tags: z.array(z.string()).nullish(),
		templateName: z.string().nullish(),
		version: z.string().nullish(),
		mdm: z
			.object({
				vendor: z
					.enum(['unknown', 'none', 'internal', 'external'])
					.or(z.string())
					.nullish(),
				internal: z
					.object({
						deviceId: z.string().nullish(),
						windowsDeviceId: z.string().nullish(),
					})
					.loose()
					.nullish(),
				profileIdentifier: z.string().nullish(),
				dep: z.boolean().nullish(),
				userApproved: z.boolean().nullish(),
				enrollmentType: z
					.enum(['unknown', 'automated device', 'device', 'user'])
					.or(z.string())
					.nullish(),
				providerId: z.string().nullish(),
				windows: z
					.object({
						upn: z.string().nullish(),
					})
					.loose()
					.nullish(),
				lostModeStatus: z.string().nullish(),
				deviceLockStatus: z.number().nullish(),
				enrollmentStatus: z.number().nullish(),
			})
			.loose()
			.nullish(),
		builtInCommands: z
			.array(
				z
					.object({
						type: z.enum(['security']).or(z.string()).nullish(),
						name: z
							.enum(['erase', 'lock', 'restart', 'shutdown'])
							.or(z.string())
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
		osFamily: z.string().nullish(),
		domainInfo: z
			.object({
				partOfDomain: z.boolean().nullish(),
				domainName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		userMetrics: z
			.array(
				z
					.object({
						userName: z.string().nullish(),
						admin: z.boolean().nullish(),
						managed: z.boolean().nullish(),
						suspended: z.boolean().nullish(),
						secureTokenEnabled: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
		serviceAccountState: z
			.object({
				hasSecureToken: z.boolean().nullish(),
				passwordODValid: z.boolean().nullish(),
				passwordAPFSValid: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		azureAdJoined: z.boolean().nullish(),
		displayManager: z.string().nullish(),
		secureLogin: z
			.object({
				supported: z.boolean().nullish(),
				enabled: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		remoteAssistAgentVersion: z.string().nullish(),
	})
	.loose();

export type SystemsDeleteOutput = z.infer<typeof SystemsDeleteOutputSchema>;

export const SearchSystemUsersInputSchema = z
	.object({
		fields: z
			.string()
			.describe(
				'Use a space seperated string of field parameters to include the data in the response. If omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.string()
			.describe(
				'A filter to apply to the query. See the supported operators below. For more complex searches,\nsee the related `/search/<domain>` endpoints,\ne.g. `/search/systems`.\n\n**Filter structure**: The filter syntax follows a consistent pattern of `<field>:<operator>:<value>` (e.g. `department:$eq:Finance`)\n\n*',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		body: SearchBodySchema,
	})
	.loose();

export type SearchSystemUsersInput = z.infer<
	typeof SearchSystemUsersInputSchema
>;

export const SearchSystemUsersOutputSchema = z
	.object({
		results: z
			.array(z.unknown())
			.describe('The list of system users.')
			.nullish(),
		totalCount: z
			.number()
			.describe('The total number of system users.')
			.nullish(),
	})
	.loose();

export type SearchSystemUsersOutput = z.infer<
	typeof SearchSystemUsersOutputSchema
>;

export const SearchSystemsInputSchema = z
	.object({
		fields: z
			.string()
			.describe(
				'Use a space seperated string of field parameters to include the data in the response. If omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		filter: z
			.string()
			.describe(
				'A filter to apply to the query. See the supported operators below. For more complex searches,\nsee the related `/search/<domain>` endpoints,\ne.g. `/search/systems`.\n\n**Filter structure**: The filter syntax follows a consistent pattern of `<field>:<operator>:<value>` (e.g. `department:$eq:Finance`)\n\n*',
			)
			.optional(),
		body: SearchBodySchema,
	})
	.loose();

export type SearchSystemsInput = z.infer<typeof SearchSystemsInputSchema>;

export const SearchSystemsOutputSchema = z
	.object({
		results: z.array(z.unknown()).describe('The list of systems.').nullish(),
		totalCount: z.number().describe('The total number of systems.').nullish(),
	})
	.loose();

export type SearchSystemsOutput = z.infer<typeof SearchSystemsOutputSchema>;

export const CommandsListInputSchema = z
	.object({
		fields: z
			.string()
			.describe(
				'Use a space seperated string of field parameters to include the data in the response. If omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.string()
			.describe(
				'A filter to apply to the query. See the supported operators below. For more complex searches,\nsee the related `/search/<domain>` endpoints,\ne.g. `/search/systems`.\n\n**Filter structure**: The filter syntax follows a consistent pattern of `<field>:<operator>:<value>` (e.g. `department:$eq:Finance`)\n\n*',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.string()
			.describe(
				'Use space separated sort parameters to sort the collection.\nDefault sort is ascending. Prefix with `-` to sort descending.\n',
			)
			.optional(),
	})
	.loose();

export type CommandsListInput = z.infer<typeof CommandsListInputSchema>;

export const CommandsListOutputSchema = z
	.object({
		results: z
			.array(
				z
					.object({
						_id: z.string().describe('The ID of the command.').nullish(),
						command: z
							.string()
							.describe('The Command to execute, truncated to 10k characters.')
							.nullish(),
						commandType: z.string().describe('The Command OS.').nullish(),
						launchType: z
							.string()
							.describe('How the Command is executed.')
							.nullish(),
						listensTo: z.string().nullish(),
						name: z.string().describe('The name of the Command.').nullish(),
						organization: z
							.string()
							.describe('The ID of the Organization.')
							.nullish(),
						schedule: z
							.string()
							.describe(
								'A crontab that consists of: [ (seconds) (minutes) (hours) (days of month) (months) (weekdays) ] or [ immediate ]. If you send this as an empty string, it will run immediately.',
							)
							.nullish(),
						scheduleRepeatType: z
							.string()
							.describe('When the command will repeat.')
							.nullish(),
						trigger: z
							.string()
							.describe('Trigger to execute command.')
							.nullish(),
						description: z
							.string()
							.describe('Description of the command.')
							.nullish(),
						aiGenerated: z
							.boolean()
							.describe(
								'Whether this command was generated with AI assistance.',
							)
							.nullish(),
						templatingRequired: z
							.boolean()
							.describe(
								'Whether this command requires templating before execution.',
							)
							.nullish(),
						managedBy: z
							.enum(['enterprise', 'organization'])
							.or(z.string())
							.describe('Command owner type (`enterprise` or `organization`).')
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
		totalCount: z.number().describe('The total number of commands').nullish(),
	})
	.loose();

export type CommandsListOutput = z.infer<typeof CommandsListOutputSchema>;

export const CommandsCreateInputSchema = z
	.object({
		body: z
			.object({
				name: z.string().describe('The name of the command.'),
				command: z.string().describe('The command to run.'),
				commandType: z
					.string()
					.describe('The OS of the command target: mac, windows, or linux.'),
				user: z
					.string()
					.describe(
						'The ID of the system user to run the command as. Required for mac and linux commands; 000000000000000000000000 runs it as root.',
					)
					.optional(),
				sudo: z.boolean().optional(),
				shell: z
					.string()
					.describe('The shell used to run the command.')
					.optional(),
				launchType: z
					.string()
					.describe('How the command will execute, e.g. manual.')
					.optional(),
				timeout: z
					.union([z.string(), z.number()])
					.describe(
						'The time in seconds to allow the command to run (max 86400).',
					)
					.optional(),
				schedule: z.string().optional(),
				trigger: z.string().optional(),
			})
			.loose(),
	})
	.loose();

export type CommandsCreateInput = z.infer<typeof CommandsCreateInputSchema>;

export const CommandsCreateOutputSchema = z
	.object({
		command: z.string().describe('The command to execute on the server.'),
		commandRunners: z
			.array(z.string())
			.describe(
				'An array of IDs of the Command Runner Users that can execute this command.',
			)
			.nullish(),
		commandTarget: z
			.enum(['enterprise', 'organization'])
			.or(z.string())
			.describe(
				'EP create target when enterprise command sharing is enabled. `enterprise`\ncreates a default-shared Enterprise command (grants all current child orgs).\n`organization` creates a local command in `targetOrganizationId` (or the\npinned org). Ignored when sharing is disabled.\n',
			)
			.nullish(),
		targetOrganizationId: z
			.string()
			.describe(
				'Child organization ID for a local command when `commandTarget` is\n`organization` in Enterprise / View All context. Ignored for Enterprise\ncreate and when sharing is disabled.\n',
			)
			.nullish(),
		commandType: z.string().describe('The Command OS'),
		files: z
			.array(z.string())
			.describe('An array of file IDs to include with the command.')
			.nullish(),
		launchType: z.string().describe('How the command will execute.').nullish(),
		listensTo: z.string().nullish(),
		name: z.string(),
		organization: z.string().describe('The ID of the organization.').nullish(),
		schedule: z
			.string()
			.describe(
				'A crontab that consists of: [ (seconds) (minutes) (hours) (days of month) (months) (weekdays) ] or [ immediate ]. If you send this as an empty string, it will run immediately.\n',
			)
			.nullish(),
		scheduleRepeatType: z
			.string()
			.describe('When the command will repeat.')
			.nullish(),
		sudo: z.boolean().nullish(),
		systems: z
			.array(z.string())
			.describe(
				'Not used. Use /api/v2/commands/{id}/associations to bind commands to systems.',
			)
			.nullish(),
		template: z
			.string()
			.describe('The template this command was created from')
			.nullish(),
		timeout: z
			.string()
			.describe(
				'The time in seconds to allow the command to run for. The maximum value is 86400 seconds (1 day).',
			)
			.nullish(),
		trigger: z.string().describe('The name of the command trigger.').nullish(),
		user: z
			.string()
			.describe(
				'The ID of the system user to run the command as. This field is required when creating a command with a commandType of "mac" or "linux".',
			)
			.nullish(),
		shell: z.string().describe('The shell used to run the command.').nullish(),
		timeToLiveSeconds: z
			.number()
			.describe(
				'Time in seconds a command can wait in the queue to be run before timing out',
			)
			.nullish(),
		scheduleYear: z
			.number()
			.describe('The year that a scheduled command will launch in.')
			.nullish(),
		filesS3: z
			.array(z.unknown())
			.describe('An array of file stored in S3 to include with the command.')
			.nullish(),
		description: z.string().describe('Description of the command.').nullish(),
		aiGenerated: z
			.boolean()
			.describe('Whether this command was generated with AI assistance.')
			.nullish(),
		templatingRequired: z
			.boolean()
			.describe('Whether this command requires templating before execution.')
			.nullish(),
		managedBy: z
			.enum(['enterprise', 'organization'])
			.or(z.string())
			.describe('Command owner type (`enterprise` or `organization`).')
			.nullish(),
	})
	.loose();

export type CommandsCreateOutput = z.infer<typeof CommandsCreateOutputSchema>;

export const CommandsGetInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
		fields: z
			.string()
			.describe(
				'Use a space seperated string of field parameters to include the data in the response. If omitted, the default list of fields will be returned.\n',
			)
			.optional(),
	})
	.loose();

export type CommandsGetInput = z.infer<typeof CommandsGetInputSchema>;

export const CommandsGetOutputSchema = z
	// commands.get forwards the documented `fields` selector, so JumpCloud
	// may omit any field from a successful response (e.g. fields=name).
	// Every documented field is optional and missing fields parse as absent.
	.object({
		command: z
			.string()
			.describe('The command to execute on the server.')
			.nullish(),
		commandRunners: z
			.array(z.string())
			.describe(
				'An array of IDs of the Command Runner Users that can execute this command.',
			)
			.nullish(),
		commandTarget: z
			.enum(['enterprise', 'organization'])
			.or(z.string())
			.describe(
				'EP create target when enterprise command sharing is enabled. `enterprise`\ncreates a default-shared Enterprise command (grants all current child orgs).\n`organization` creates a local command in `targetOrganizationId` (or the\npinned org). Ignored when sharing is disabled.\n',
			)
			.nullish(),
		targetOrganizationId: z
			.string()
			.describe(
				'Child organization ID for a local command when `commandTarget` is\n`organization` in Enterprise / View All context. Ignored for Enterprise\ncreate and when sharing is disabled.\n',
			)
			.nullish(),
		commandType: z.string().describe('The Command OS').nullish(),
		files: z
			.array(z.string())
			.describe('An array of file IDs to include with the command.')
			.nullish(),
		launchType: z.string().describe('How the command will execute.').nullish(),
		listensTo: z.string().nullish(),
		name: z.string().nullish(),
		organization: z.string().describe('The ID of the organization.').nullish(),
		schedule: z
			.string()
			.describe(
				'A crontab that consists of: [ (seconds) (minutes) (hours) (days of month) (months) (weekdays) ] or [ immediate ]. If you send this as an empty string, it will run immediately.\n',
			)
			.nullish(),
		scheduleRepeatType: z
			.string()
			.describe('When the command will repeat.')
			.nullish(),
		sudo: z.boolean().nullish(),
		systems: z
			.array(z.string())
			.describe(
				'Not used. Use /api/v2/commands/{id}/associations to bind commands to systems.',
			)
			.nullish(),
		template: z
			.string()
			.describe('The template this command was created from')
			.nullish(),
		timeout: z
			.string()
			.describe(
				'The time in seconds to allow the command to run for. The maximum value is 86400 seconds (1 day).',
			)
			.nullish(),
		trigger: z.string().describe('The name of the command trigger.').nullish(),
		user: z
			.string()
			.describe(
				'The ID of the system user to run the command as. This field is required when creating a command with a commandType of "mac" or "linux".',
			)
			.nullish(),
		shell: z.string().describe('The shell used to run the command.').nullish(),
		timeToLiveSeconds: z
			.number()
			.describe(
				'Time in seconds a command can wait in the queue to be run before timing out',
			)
			.nullish(),
		scheduleYear: z
			.number()
			.describe('The year that a scheduled command will launch in.')
			.nullish(),
		filesS3: z
			.array(z.unknown())
			.describe('An array of file stored in S3 to include with the command.')
			.nullish(),
		description: z.string().describe('Description of the command.').nullish(),
		aiGenerated: z
			.boolean()
			.describe('Whether this command was generated with AI assistance.')
			.nullish(),
		templatingRequired: z
			.boolean()
			.describe('Whether this command requires templating before execution.')
			.nullish(),
		managedBy: z
			.enum(['enterprise', 'organization'])
			.or(z.string())
			.describe('Command owner type (`enterprise` or `organization`).')
			.nullish(),
	})
	.loose();

export type CommandsGetOutput = z.infer<typeof CommandsGetOutputSchema>;

export const CommandsRunInputSchema = z
	.object({
		body: z
			.object({
				_id: z.string().describe('The ID of the command.').optional(),
				systemIds: z
					.array(z.string())
					.describe(
						'An optional list of device IDs to run the command on. If omitted, the command will run on devices bound to the command.',
					)
					.optional(),
			})
			.loose(),
	})
	.loose();

export type CommandsRunInput = z.infer<typeof CommandsRunInputSchema>;

export const CommandsRunOutputSchema = z
	.object({
		queueIds: z.array(z.string()).nullish(),
		workflowInstanceId: z.string().nullish(),
	})
	.loose();

export type CommandsRunOutput = z.infer<typeof CommandsRunOutputSchema>;

export const ApplicationsListInputSchema = z
	.object({
		fields: z
			.string()
			.describe(
				'The space separated fields included in the returned records. If omitted the default list of fields will be returned.',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.string()
			.describe(
				'The space separated fields used to sort the collection. Default sort is ascending, prefix with - to sort descending.',
			)
			.optional(),
		filter: z
			.string()
			.describe(
				'A filter to apply to the query. See the supported operators below. For more complex searches,\nsee the related `/search/<domain>` endpoints,\ne.g. `/search/systems`.\n\n**Filter structure**: The filter syntax follows a consistent pattern of `<field>:<operator>:<value>` (e.g. `department:$eq:Finance`)\n\n*',
			)
			.optional(),
	})
	.loose();

export type ApplicationsListInput = z.infer<typeof ApplicationsListInputSchema>;

export const ApplicationsListOutputSchema = z
	.object({
		name: z.string().nullish(),
		results: z
			.array(z.unknown())
			.describe('The list of applications.')
			.nullish(),
		totalCount: z
			.number()
			.describe('The total number of applications.')
			.nullish(),
	})
	.loose();

export type ApplicationsListOutput = z.infer<
	typeof ApplicationsListOutputSchema
>;

export const ApplicationsGetInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
	})
	.loose();

export type ApplicationsGetInput = z.infer<typeof ApplicationsGetInputSchema>;

export const ApplicationsGetOutputSchema = z
	.object({
		_id: z.string().nullish(),
		active: z.boolean().nullish(),
		beta: z.boolean().nullish(),
		color: z
			.enum([
				'',
				'#202D38',
				'#005466',
				'#3E8696',
				'#006CAC',
				'#0617AC',
				'#7C6ADA',
				'#D5779D',
				'#9E2F00',
				'#FFB000',
				'#58C469',
				'#57C49F',
				'#FF6C03',
			])
			.or(z.string())
			.nullish(),
		config: z
			.object({
				spErrorFlow: z.unknown().nullish(),
				signAssertion: z.unknown().nullish(),
				signResponse: z.unknown().nullish(),
				acsUrl: z
					.object({
						label: z.string().nullish(),
						options: z.unknown().nullish(),
						position: z.number().nullish(),
						readOnly: z.boolean().nullish(),
						required: z.boolean().nullish(),
						toggle: z.unknown().nullish(),
						tooltip: z.unknown().nullish(),
						type: z.string().nullish(),
						value: z.string().nullish(),
						visible: z.boolean().nullish(),
					})
					.loose()
					.nullish(),
				constantAttributes: z.unknown().nullish(),
				databaseAttributes: z
					.object({
						position: z.number().nullish(),
					})
					.loose()
					.nullish(),
				idpCertificate: z
					.object({
						label: z.string().nullish(),
						options: z.unknown().nullish(),
						position: z.number().nullish(),
						readOnly: z.boolean().nullish(),
						required: z.boolean().nullish(),
						toggle: z.unknown().nullish(),
						tooltip: z.unknown().nullish(),
						type: z.string().nullish(),
						value: z.string().nullish(),
						visible: z.boolean().nullish(),
					})
					.loose()
					.nullish(),
				idpEntityId: z
					.object({
						label: z.string().nullish(),
						options: z.unknown().nullish(),
						position: z.number().nullish(),
						readOnly: z.boolean().nullish(),
						required: z.boolean().nullish(),
						toggle: z.unknown().nullish(),
						tooltip: z.unknown().nullish(),
						type: z.string().nullish(),
						value: z.string().nullish(),
						visible: z.boolean().nullish(),
					})
					.loose()
					.nullish(),
				idpPrivateKey: z
					.object({
						label: z.string().nullish(),
						options: z.unknown().nullish(),
						position: z.number().nullish(),
						readOnly: z.boolean().nullish(),
						required: z.boolean().nullish(),
						toggle: z.unknown().nullish(),
						tooltip: z.unknown().nullish(),
						type: z.string().nullish(),
						value: z.string().nullish(),
						visible: z.boolean().nullish(),
					})
					.loose()
					.nullish(),
				spEntityId: z
					.object({
						label: z.string().nullish(),
						options: z.unknown().nullish(),
						position: z.number().nullish(),
						readOnly: z.boolean().nullish(),
						required: z.boolean().nullish(),
						toggle: z.unknown().nullish(),
						tooltip: z.unknown().nullish(),
						type: z.string().nullish(),
						value: z.string().nullish(),
						visible: z.boolean().nullish(),
					})
					.loose()
					.nullish(),
				authClaimConfiguration: z.unknown().nullish(),
			})
			.loose()
			.describe(
				'Only required for SAML configuration (not required for Bookmarks)',
			),
		created: z.string().nullish(),
		databaseAttributes: z.array(z.record(z.string(), z.unknown())).nullish(),
		description: z.string().nullish(),
		displayLabel: z.string().nullish(),
		displayName: z.string().nullish(),
		learnMore: z.string().nullish(),
		logo: z
			.object({
				color: z
					.enum([
						'',
						'#202D38',
						'#005466',
						'#3E8696',
						'#006CAC',
						'#0617AC',
						'#7C6ADA',
						'#D5779D',
						'#9E2F00',
						'#FFB000',
						'#58C469',
						'#57C49F',
						'#FF6C03',
					])
					.or(z.string())
					.nullish(),
				url: z.string().nullish(),
			})
			.loose()
			.nullish(),
		name: z.string(),
		organization: z.string().nullish(),
		sso: z
			.object({
				type: z.string().nullish(),
				beta: z.boolean().nullish(),
				jit: z.boolean().nullish(),
				idpCertExpirationAt: z.string().nullish(),
				idpCertificateUpdatedAt: z.string().nullish(),
				idpPrivateKeyUpdatedAt: z.string().nullish(),
				spCertificateUpdatedAt: z.string().nullish(),
				hidden: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		ssoUrl: z.string(),
		parentApp: z.string().nullish(),
		referenceApplications: z
			.array(
				z
					.object({
						id: z
							.string()
							.describe('Application id for the copy in that organization.'),
						orgId: z.string().describe('Organization id for the copy.'),
					})
					.loose(),
			)
			.describe(
				"Organization-specific copies of this shared SSO application chain. Returned only for all-organizations list requests (x-org-id '-').",
			)
			.nullish(),
		aiReady: z
			.boolean()
			.describe(
				'Admin opt-in that this application instance should appear as AI Ready in the User Portal. Informational only — does not grant access. Setting to true requires at least one configured MCP connection. Gated by feature flag DC-4194-app-ai-ready.',
			)
			.nullish(),
	})
	.loose();

export type ApplicationsGetOutput = z.infer<typeof ApplicationsGetOutputSchema>;

export const OrganizationsListInputSchema = z
	.object({
		fields: z
			.string()
			.describe(
				'Use a space seperated string of field parameters to include the data in the response. If omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.string()
			.describe(
				'A filter to apply to the query. See the supported operators below. For more complex searches,\nsee the related `/search/<domain>` endpoints,\ne.g. `/search/systems`.\n\n**Filter structure**: The filter syntax follows a consistent pattern of `<field>:<operator>:<value>` (e.g. `department:$eq:Finance`)\n\n*',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		search: z
			.string()
			.describe(
				'A nested object containing a `searchTerm` string or array of strings and a list of `fields` to search on.',
			)
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.string()
			.describe(
				'Use space separated sort parameters to sort the collection.\nDefault sort is ascending. Prefix with `-` to sort descending.\n',
			)
			.optional(),
		sortIgnoreCase: z
			.string()
			.describe(
				'Use space separated sort parameters to sort the collection, ignoring case.\nDefault sort is ascending. Prefix with `-` to sort descending.\n',
			)
			.optional(),
	})
	.loose();

export type OrganizationsListInput = z.infer<
	typeof OrganizationsListInputSchema
>;

export const OrganizationsListOutputSchema = z
	.object({
		results: z
			.array(
				z
					.object({
						_id: z.string().describe('The ID of the organization.').nullish(),
						displayName: z
							.string()
							.describe('The name of the organization.')
							.nullish(),
						logoUrl: z
							.unknown()
							.describe('The organization logo image URL. ')
							.nullish(),
					})
					.loose(),
			)
			.describe('The list of organizations.')
			.nullish(),
		totalCount: z
			.number()
			.describe('The total number of organizations. ')
			.nullish(),
	})
	.loose();

export type OrganizationsListOutput = z.infer<
	typeof OrganizationsListOutputSchema
>;

export const OrganizationsGetInputSchema = z
	.object({
		id: safePathParam.describe('id (path)'),
		fields: z
			.string()
			.describe(
				'Use a space seperated string of field parameters to include the data in the response. If omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.string()
			.describe(
				'A filter to apply to the query. See the supported operators below. For more complex searches,\nsee the related `/search/<domain>` endpoints,\ne.g. `/search/systems`.\n\n**Filter structure**: The filter syntax follows a consistent pattern of `<field>:<operator>:<value>` (e.g. `department:$eq:Finance`)\n\n*',
			)
			.optional(),
	})
	.loose();

export type OrganizationsGetInput = z.infer<typeof OrganizationsGetInputSchema>;

export const OrganizationsGetOutputSchema = z
	.object({
		_id: z.string().nullish(),
		created: z.string().nullish(),
		customEmailSettings: z
			.object({
				enabled: z
					.boolean()
					.describe(
						'Used to enable or disable custom emails for an organization.',
					)
					.nullish(),
			})
			.loose()
			.describe('Custom email settings for an organization')
			.nullish(),
		displayName: z.string().nullish(),
		entitlement: z
			.object({
				billingModel: z.string().nullish(),
				capUserQuantity: z.boolean().nullish(),
				maxUserQuantity: z.number().nullish(),
				purchaseChannel: z.string().nullish(),
				entitlementProducts: z
					.array(z.record(z.string(), z.unknown()))
					.nullish(),
				isManuallyBilled: z.boolean().nullish(),
				pricePerUserSum: z.number().nullish(),
			})
			.loose()
			.nullish(),
		hasStripeCustomerId: z.boolean().nullish(),
		hasCreditCard: z.boolean().nullish(),
		lastEstimateCalculationTimeStamp: z.string().nullish(),
		lastSfdcSyncStatus: z.record(z.string(), z.unknown()).nullish(),
		accountsReceivable: z.string().nullish(),
		accessRestriction: z.string().nullish(),
		accountType: z
			.enum([
				'Alliance',
				'Distributor',
				'MSP',
				'VAR',
				'Direct',
				'Indirect',
				'Tenant',
				'Deleted Organization',
				'Partner',
				'Customer',
				'Prospective Customer',
				'Prospective Partner',
			])
			.or(z.string())
			.describe(
				'Salesforce Account Type (`Account_Type__c`) written back to the org via BSS sync. Returned only when requested via the `fields` query parameter.',
			)
			.nullish(),
		logoUrl: z.unknown().nullish(),
		provider: z.unknown().nullish(),
		settings: z
			.object({
				agentVersion: z.string().nullish(),
				betaFeatures: z.record(z.string(), z.unknown()).nullish(),
				chromeDTCEnabled: z.boolean().nullish(),
				contactEmail: z.string().nullish(),
				contactName: z.string().nullish(),
				disableCommandRunner: z.boolean().nullish(),
				disableLdap: z.boolean().nullish(),
				disableUM: z.boolean().nullish(),
				duplicateLDAPGroups: z.boolean().nullish(),
				emailDisclaimer: z.string().nullish(),
				enableGoogleApps: z.boolean().nullish(),
				enableManagedUID: z.boolean().nullish(),
				enableO365: z.boolean().nullish(),
				enableUserPortalAgentInstall: z.boolean().nullish(),
				features: z.record(z.string(), z.unknown()).nullish(),
				growthData: z
					.record(z.string(), z.unknown())
					.describe(
						'Object containing Optimizely experimentIds and states corresponding to them',
					)
					.nullish(),
				logo: z.string().nullish(),
				name: z.string().nullish(),
				newSystemUserStateDefaults: z.record(z.string(), z.unknown()).nullish(),
				passwordCompliance: z
					.enum(['custom', 'pci3', 'windows'])
					.or(z.string())
					.nullish(),
				passwordPolicy: z.record(z.string(), z.unknown()).nullish(),
				pendingDelete: z.boolean().nullish(),
				requireAdminMFA: z.boolean().nullish(),
				showIntro: z.boolean().nullish(),
				systemUserDefaults: z.record(z.string(), z.unknown()).nullish(),
				systemUserPasswordExpirationInDays: z.number().nullish(),
				systemUsersCanEdit: z.boolean().nullish(),
				disableGoogleLogin: z.boolean().nullish(),
				userPortal: z.record(z.string(), z.unknown()).nullish(),
				deviceIdentificationEnabled: z.boolean().nullish(),
				trustedAppConfig: z.unknown().nullish(),
				maxSystemUsers: z.number().nullish(),
				windowsMDM: z.record(z.string(), z.unknown()).nullish(),
			})
			.loose()
			.nullish(),
		totalBillingEstimate: z.number().nullish(),
	})
	.loose();

export type OrganizationsGetOutput = z.infer<
	typeof OrganizationsGetOutputSchema
>;

export const UserGroupsListInputSchema = z
	.object({
		fields: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields included in the returned records.\nIf omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'A filter to apply to the query.\n\n**Filter structure**: `<field>:<operator>:<value>`.\n\n**field** = Populate with a valid field from an endpoint response.\n\n**operator** =  Supported operators are: eq, ne, gt, ge, lt, le, between, search, in.\n_Note: v1 operators differ from v2 operators._\n\n**value** = ',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields used to sort the collection.\nDefault sort is ascending, prefix with `-` to sort descending.\n',
			)
			.optional(),
	})
	.loose();

export type UserGroupsListInput = z.infer<typeof UserGroupsListInputSchema>;

export const UserGroupsListOutputSchema = z.array(
	z
		.object({
			attributes: z.unknown().nullish(),
			email: z.string().describe('Email address of a User Group').nullish(),
			description: z.string().describe('Description of a User Group').nullish(),
			id: z
				.string()
				.describe('ObjectId uniquely identifying a User Group.')
				.nullish(),
			memberQuery: z.unknown().nullish(),
			// unknown: GraphObjects are polymorphic provider-defined objects, and
			// the spec publishes no item shape for the exemptions array.
			memberQueryExemptions: z
				.array(z.unknown())
				.describe('Array of GraphObjects exempted from the query')
				.nullish(),
			memberSuggestionsNotify: z
				.boolean()
				.describe(
					'True if notification emails are to be sent for membership suggestions.',
				)
				.nullish(),
			memberQueryErrorFlags: z.unknown().nullish(),
			membershipMethod: z.unknown().nullish(),
			name: z.string().describe('Display name of a User Group.').nullish(),
			organizationObjectId: z
				.unknown()
				.describe('id of the organization owning this group')
				.nullish(),
			suggestionCounts: z.unknown().nullish(),
			type: z
				.enum(['user_group'])
				.or(z.string())
				.describe('The type of the group.')
				.nullish(),
		})
		.loose(),
);

export type UserGroupsListOutput = z.infer<typeof UserGroupsListOutputSchema>;

export const UserGroupsCreateInputSchema = z
	.object({
		body: z
			.object({
				// unknown: the spec does not publish a shape for UserGroup graph
				// attributes, so no stricter type exists to model.
				attributes: z
					.unknown()
					.describe('The graph attributes for a UserGroup.')
					.optional(),
				email: z.string().describe('Email address of a User Group').optional(),
				description: z
					.string()
					.describe('Description of a User Group')
					.optional(),
				// unknown: the member query DSL is provider-defined (v1 FilterQuery or
				// v2 filter objects) and has no closed published shape to type.
				memberQuery: z
					.unknown()
					.describe(
						'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
					)
					.optional(),
				// unknown: GraphObjects are polymorphic provider-defined objects, and
				// the spec publishes no item shape for the exemptions array.
				memberQueryExemptions: z
					.array(z.unknown())
					.describe('Array of GraphObjects exempted from the query')
					.optional(),
				memberSuggestionsNotify: z
					.boolean()
					.describe(
						'True if notification emails are to be sent for membership suggestions.',
					)
					.optional(),
				membershipMethod: z
					.enum([
						'NOTSET',
						'STATIC',
						'DYNAMIC_REVIEW_REQUIRED',
						'DYNAMIC_AUTOMATED',
					])
					.describe(
						'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
					)
					.optional(),
				name: z.string().describe('Display name of a User Group.'),
			})
			.loose(),
	})
	.loose();

export type UserGroupsCreateInput = z.infer<typeof UserGroupsCreateInputSchema>;

export const UserGroupsCreateOutputSchema = z
	.object({
		attributes: z
			.unknown()
			.describe('The graph attributes for a UserGroup.')
			.nullish(),
		email: z.string().describe('Email address of a User Group').nullish(),
		description: z.string().describe('Description of a User Group').nullish(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a User Group.')
			.nullish(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.nullish(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
			.nullish(),
		memberSuggestionsNotify: z
			.boolean()
			.describe(
				'True if notification emails are to be sent for membership suggestions.',
			)
			.nullish(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.nullish(),
		membershipMethod: z
			.enum([
				'NOTSET',
				'STATIC',
				'DYNAMIC_REVIEW_REQUIRED',
				'DYNAMIC_AUTOMATED',
			])
			.or(z.string())
			.describe(
				'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
			)
			.nullish(),
		name: z.string().describe('Display name of a User Group.').nullish(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.nullish(),
		suggestionCounts: z
			.object({
				add: z.number().nullish(),
				remove: z.number().nullish(),
				total: z.number().nullish(),
			})
			.loose()
			.nullish(),
		type: z
			.enum(['user_group'])
			.or(z.string())
			.describe('The type of the group.')
			.nullish(),
	})
	.loose();

export type UserGroupsCreateOutput = z.infer<
	typeof UserGroupsCreateOutputSchema
>;

export const UserGroupsGetInputSchema = z
	.object({
		id: safePathParam.describe('ObjectID of the User Group.'),
	})
	.loose();

export type UserGroupsGetInput = z.infer<typeof UserGroupsGetInputSchema>;

export const UserGroupsGetOutputSchema = z
	.object({
		attributes: z
			.unknown()
			.describe('The graph attributes for a UserGroup.')
			.nullish(),
		email: z.string().describe('Email address of a User Group').nullish(),
		description: z.string().describe('Description of a User Group').nullish(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a User Group.')
			.nullish(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.nullish(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
			.nullish(),
		memberSuggestionsNotify: z
			.boolean()
			.describe(
				'True if notification emails are to be sent for membership suggestions.',
			)
			.nullish(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.nullish(),
		membershipMethod: z
			.enum([
				'NOTSET',
				'STATIC',
				'DYNAMIC_REVIEW_REQUIRED',
				'DYNAMIC_AUTOMATED',
			])
			.or(z.string())
			.describe(
				'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
			)
			.nullish(),
		name: z.string().describe('Display name of a User Group.').nullish(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.nullish(),
		suggestionCounts: z
			.object({
				add: z.number().nullish(),
				remove: z.number().nullish(),
				total: z.number().nullish(),
			})
			.loose()
			.nullish(),
		type: z
			.enum(['user_group'])
			.or(z.string())
			.describe('The type of the group.')
			.nullish(),
	})
	.loose();

export type UserGroupsGetOutput = z.infer<typeof UserGroupsGetOutputSchema>;

export const UserGroupsUpdateInputSchema = z
	.object({
		id: safePathParam.describe('ObjectID of the User Group.'),
		body: z
			.object({
				// unknown: the spec does not publish a shape for UserGroup graph
				// attributes, so no stricter type exists to model.
				attributes: z
					.unknown()
					.describe('The graph attributes for a UserGroup.')
					.optional(),
				email: z.string().describe('Email address of a User Group').optional(),
				description: z
					.string()
					.describe('Description of a User Group')
					.optional(),
				// unknown: the member query DSL is provider-defined (v1 FilterQuery or
				// v2 filter objects) and has no closed published shape to type.
				memberQuery: z
					.unknown()
					.describe(
						'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
					)
					.optional(),
				// unknown: GraphObjects are polymorphic provider-defined objects, and
				// the spec publishes no item shape for the exemptions array.
				memberQueryExemptions: z
					.array(z.unknown())
					.describe('Array of GraphObjects exempted from the query')
					.optional(),
				memberSuggestionsNotify: z
					.boolean()
					.describe(
						'True if notification emails are to be sent for membership suggestions.',
					)
					.optional(),
				membershipMethod: z
					.enum([
						'NOTSET',
						'STATIC',
						'DYNAMIC_REVIEW_REQUIRED',
						'DYNAMIC_AUTOMATED',
					])
					.describe(
						'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
					)
					.optional(),
				name: z.string().describe('Display name of a User Group.'),
			})
			.loose(),
	})
	.loose();

export type UserGroupsUpdateInput = z.infer<typeof UserGroupsUpdateInputSchema>;

export const UserGroupsUpdateOutputSchema = z
	.object({
		attributes: z
			.unknown()
			.describe('The graph attributes for a UserGroup.')
			.nullish(),
		email: z.string().describe('Email address of a User Group').nullish(),
		description: z.string().describe('Description of a User Group').nullish(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a User Group.')
			.nullish(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.nullish(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
			.nullish(),
		memberSuggestionsNotify: z
			.boolean()
			.describe(
				'True if notification emails are to be sent for membership suggestions.',
			)
			.nullish(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.nullish(),
		membershipMethod: z
			.enum([
				'NOTSET',
				'STATIC',
				'DYNAMIC_REVIEW_REQUIRED',
				'DYNAMIC_AUTOMATED',
			])
			.or(z.string())
			.describe(
				'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
			)
			.nullish(),
		name: z.string().describe('Display name of a User Group.').nullish(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.nullish(),
		suggestionCounts: z
			.object({
				add: z.number().nullish(),
				remove: z.number().nullish(),
				total: z.number().nullish(),
			})
			.loose()
			.nullish(),
		type: z
			.enum(['user_group'])
			.or(z.string())
			.describe('The type of the group.')
			.nullish(),
	})
	.loose();

export type UserGroupsUpdateOutput = z.infer<
	typeof UserGroupsUpdateOutputSchema
>;

export const UserGroupsDeleteInputSchema = z
	.object({
		id: safePathParam.describe('ObjectID of the User Group.'),
	})
	.loose();

export type UserGroupsDeleteInput = z.infer<typeof UserGroupsDeleteInputSchema>;

export const UserGroupsDeleteOutputSchema = z
	.object({
		attributes: z
			.unknown()
			.describe('The graph attributes for a UserGroup.')
			.nullish(),
		email: z.string().describe('Email address of a User Group').nullish(),
		description: z.string().describe('Description of a User Group').nullish(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a User Group.')
			.nullish(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.nullish(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
			.nullish(),
		memberSuggestionsNotify: z
			.boolean()
			.describe(
				'True if notification emails are to be sent for membership suggestions.',
			)
			.nullish(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.nullish(),
		membershipMethod: z
			.enum([
				'NOTSET',
				'STATIC',
				'DYNAMIC_REVIEW_REQUIRED',
				'DYNAMIC_AUTOMATED',
			])
			.or(z.string())
			.describe(
				'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
			)
			.nullish(),
		name: z.string().describe('Display name of a User Group.').nullish(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.nullish(),
		suggestionCounts: z
			.object({
				add: z.number().nullish(),
				remove: z.number().nullish(),
				total: z.number().nullish(),
			})
			.loose()
			.nullish(),
		type: z
			.enum(['user_group'])
			.or(z.string())
			.describe('The type of the group.')
			.nullish(),
	})
	.loose()
	// The API answers 200 with the deleted group or 204 with no body.
	.optional();

export type UserGroupsDeleteOutput = z.infer<
	typeof UserGroupsDeleteOutputSchema
>;

export const UserGroupsListMembersInputSchema = z
	.object({
		group_id: safePathParam.describe('ObjectID of the User Group.'),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
	})
	.loose();

export type UserGroupsListMembersInput = z.infer<
	typeof UserGroupsListMembersInputSchema
>;

export const UserGroupsListMembersOutputSchema = z.array(
	z
		.object({
			attributes: z.unknown().nullish(),
			from: z.unknown().nullish(),
			to: z.unknown(),
		})
		.loose()
		.describe(
			'Represents an edge between two graph objects. From can be omitted if it is clear from context.',
		),
);

export type UserGroupsListMembersOutput = z.infer<
	typeof UserGroupsListMembersOutputSchema
>;

// The members POST body is the spec's GraphOperation-UserGroup-Member: one
// graph operation naming the member ObjectID, the modification, and the
// member type. Loose because the spec sets no additionalProperties: false.
export const UserGroupsManageMembersInputSchema = z
	.object({
		group_id: safePathParam.describe('ObjectID of the User Group.'),
		body: z
			.object({
				id: z
					.string()
					.describe(
						'The ObjectID of graph object being added or removed as an association.',
					),
				op: z
					.enum(['add', 'remove', 'update'])
					.describe('How to modify the graph connection.'),
				type: z.literal('user').describe('The member type.'),
				// unknown: GraphAttributes is documented as an open object
				// (additionalProperties true, nullable), so its contents are
				// provider-defined and have no closed shape to type.
				attributes: z
					.record(z.string(), z.unknown())
					.nullable()
					.optional()
					.describe('The graph attributes.'),
			})
			.loose(),
	})
	.loose();

export type UserGroupsManageMembersInput = z.infer<
	typeof UserGroupsManageMembersInputSchema
>;

export const UserGroupsManageMembersOutputSchema = z.void();

export type UserGroupsManageMembersOutput = z.infer<
	typeof UserGroupsManageMembersOutputSchema
>;

export const UserGroupsListMembershipInputSchema = z
	.object({
		group_id: safePathParam.describe('ObjectID of the User Group.'),
		filter: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'A filter to apply to the query.\n\n**Filter structure**: `<field>:<operator>:<value>`.\n\n**field** = Populate with a valid field from an endpoint response.\n\n**operator** =  Supported operators are: eq, ne, gt, ge, lt, le, between, search, in.\n_Note: v1 operators differ from v2 operators._\n\n**value** = ',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields used to sort the collection.\nDefault sort is ascending, prefix with `-` to sort descending.\n',
			)
			.optional(),
	})
	.loose();

export type UserGroupsListMembershipInput = z.infer<
	typeof UserGroupsListMembershipInputSchema
>;

export const UserGroupsListMembershipOutputSchema = z.array(
	z
		.object({
			compiledAttributes: z.unknown().nullish(),
			id: z.string().describe('Object ID of this graph object.'),
			paths: z
				.array(z.array(z.unknown()))
				.describe(
					'Every path through the graph from the requested object to this object. Each path lists the groupings and associations it follows; all of them would have to be removed to remove this object from the requested object.',
				),
			type: z.unknown(),
			externalId: z
				.string()
				.describe(
					'The external resource ID that is being synced. Only present when syncStatus query parameter is true.',
				)
				.nullish(),
			syncStatus: z.unknown().nullish(),
		})
		.loose(),
);

export type UserGroupsListMembershipOutput = z.infer<
	typeof UserGroupsListMembershipOutputSchema
>;

export const SystemGroupsListInputSchema = z
	.object({
		fields: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields included in the returned records.\nIf omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'A filter to apply to the query.\n\n**Filter structure**: `<field>:<operator>:<value>`.\n\n**field** = Populate with a valid field from an endpoint response.\n\n**operator** =  Supported operators are: eq, ne, gt, ge, lt, le, between, search, in.\n_Note: v1 operators differ from v2 operators._\n\n**value** = ',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields used to sort the collection.\nDefault sort is ascending, prefix with `-` to sort descending.\n',
			)
			.optional(),
	})
	.loose();

export type SystemGroupsListInput = z.infer<typeof SystemGroupsListInputSchema>;

export const SystemGroupsListOutputSchema = z.array(
	z
		.object({
			attributes: z.unknown().nullish(),
			description: z
				.string()
				.describe('Description of a System Group')
				.nullish(),
			email: z
				.string()
				.describe('E-mail address associated with a System Group')
				.nullish(),
			id: z
				.string()
				.describe('ObjectId uniquely identifying a System Group.')
				.nullish(),
			memberQuery: z.unknown().nullish(),
			memberQueryErrorFlags: z.unknown().nullish(),
			// unknown: GraphObjects are polymorphic provider-defined objects, and
			// the spec publishes no item shape for the exemptions array.
			memberQueryExemptions: z
				.array(z.unknown())
				.describe('Array of GraphObjects exempted from the query')
				.nullish(),
			membershipMethod: z.unknown().nullish(),
			memberSuggestionsNotify: z
				.boolean()
				.describe(
					'True if notification emails are to be sent for membership suggestions.',
				)
				.nullish(),
			name: z.string().describe('Display name of a System Group.').nullish(),
			organizationObjectId: z
				.unknown()
				.describe('id of the organization owning this group')
				.nullish(),
			type: z
				.enum(['system_group'])
				.or(z.string())
				.describe("The type of the group; always 'system' for a System Group.")
				.nullish(),
		})
		.loose(),
);

export type SystemGroupsListOutput = z.infer<
	typeof SystemGroupsListOutputSchema
>;

export const SystemGroupsCreateInputSchema = z
	.object({
		body: z
			.object({
				// unknown: the spec does not publish a shape for SystemGroup graph
				// attributes, so no stricter type exists to model.
				attributes: z.unknown().describe('The graph attributes.').optional(),
				email: z
					.string()
					.describe('Email address of a System Group')
					.optional(),
				description: z
					.string()
					.describe('Description of a System Group')
					.optional(),
				name: z.string().describe('Display name of a System Group.'),
				// unknown: the member query DSL is provider-defined (v1 FilterQuery or
				// v2 filter objects) and has no closed published shape to type.
				memberQuery: z
					.unknown()
					.describe(
						'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
					)
					.optional(),
				membershipMethod: z
					.enum([
						'NOTSET',
						'STATIC',
						'DYNAMIC_REVIEW_REQUIRED',
						'DYNAMIC_AUTOMATED',
					])
					.describe(
						'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
					)
					.optional(),
				memberSuggestionsNotify: z
					.boolean()
					.describe(
						'True if notification emails are to be sent for membership suggestions.',
					)
					.optional(),
				// unknown: GraphObjects are polymorphic provider-defined objects, and
				// the spec publishes no item shape for the exemptions array.
				memberQueryExemptions: z
					.array(z.unknown())
					.describe('Array of GraphObjects exempted from the query')
					.optional(),
			})
			.loose(),
	})
	.loose();

export type SystemGroupsCreateInput = z.infer<
	typeof SystemGroupsCreateInputSchema
>;

export const SystemGroupsCreateOutputSchema = z
	.object({
		attributes: z.unknown().describe('The graph attributes.').nullish(),
		description: z.string().describe('Description of a System Group').nullish(),
		email: z
			.string()
			.describe('E-mail address associated with a System Group')
			.nullish(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a System Group.')
			.nullish(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.nullish(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.nullish(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
			.nullish(),
		membershipMethod: z
			.enum([
				'NOTSET',
				'STATIC',
				'DYNAMIC_REVIEW_REQUIRED',
				'DYNAMIC_AUTOMATED',
			])
			.or(z.string())
			.describe(
				'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
			)
			.nullish(),
		memberSuggestionsNotify: z
			.boolean()
			.describe(
				'True if notification emails are to be sent for membership suggestions.',
			)
			.nullish(),
		name: z.string().describe('Display name of a System Group.').nullish(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.nullish(),
		type: z
			.enum(['system_group'])
			.or(z.string())
			.describe("The type of the group; always 'system' for a System Group.")
			.nullish(),
	})
	.loose();

export type SystemGroupsCreateOutput = z.infer<
	typeof SystemGroupsCreateOutputSchema
>;

export const SystemGroupsGetInputSchema = z
	.object({
		id: safePathParam.describe('ObjectID of the System Group.'),
	})
	.loose();

export type SystemGroupsGetInput = z.infer<typeof SystemGroupsGetInputSchema>;

export const SystemGroupsGetOutputSchema = z
	.object({
		attributes: z.unknown().describe('The graph attributes.').nullish(),
		description: z.string().describe('Description of a System Group').nullish(),
		email: z
			.string()
			.describe('E-mail address associated with a System Group')
			.nullish(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a System Group.')
			.nullish(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.nullish(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.nullish(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
			.nullish(),
		membershipMethod: z
			.enum([
				'NOTSET',
				'STATIC',
				'DYNAMIC_REVIEW_REQUIRED',
				'DYNAMIC_AUTOMATED',
			])
			.or(z.string())
			.describe(
				'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
			)
			.nullish(),
		memberSuggestionsNotify: z
			.boolean()
			.describe(
				'True if notification emails are to be sent for membership suggestions.',
			)
			.nullish(),
		name: z.string().describe('Display name of a System Group.').nullish(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.nullish(),
		type: z
			.enum(['system_group'])
			.or(z.string())
			.describe("The type of the group; always 'system' for a System Group.")
			.nullish(),
	})
	.loose();

export type SystemGroupsGetOutput = z.infer<typeof SystemGroupsGetOutputSchema>;

export const SystemGroupsUpdateInputSchema = z
	.object({
		id: safePathParam.describe('ObjectID of the System Group.'),
		body: z
			.object({
				// unknown: the spec does not publish a shape for SystemGroup graph
				// attributes, so no stricter type exists to model.
				attributes: z.unknown().describe('The graph attributes.').optional(),
				email: z
					.string()
					.describe('Email address of a System Group')
					.optional(),
				description: z
					.string()
					.describe('Description of a System Group')
					.optional(),
				name: z.string().describe('Display name of a System Group.'),
				// unknown: the member query DSL is provider-defined (v1 FilterQuery or
				// v2 filter objects) and has no closed published shape to type.
				memberQuery: z
					.unknown()
					.describe(
						'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
					)
					.optional(),
				membershipMethod: z
					.enum([
						'NOTSET',
						'STATIC',
						'DYNAMIC_REVIEW_REQUIRED',
						'DYNAMIC_AUTOMATED',
					])
					.describe(
						'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
					)
					.optional(),
				memberSuggestionsNotify: z
					.boolean()
					.describe(
						'True if notification emails are to be sent for membership suggestions.',
					)
					.optional(),
				// unknown: GraphObjects are polymorphic provider-defined objects, and
				// the spec publishes no item shape for the exemptions array.
				memberQueryExemptions: z
					.array(z.unknown())
					.describe('Array of GraphObjects exempted from the query')
					.optional(),
			})
			.loose(),
	})
	.loose();

export type SystemGroupsUpdateInput = z.infer<
	typeof SystemGroupsUpdateInputSchema
>;

export const SystemGroupsUpdateOutputSchema = z
	.object({
		attributes: z.unknown().describe('The graph attributes.').nullish(),
		description: z.string().describe('Description of a System Group').nullish(),
		email: z
			.string()
			.describe('E-mail address associated with a System Group')
			.nullish(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a System Group.')
			.nullish(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.nullish(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.nullish(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
			.nullish(),
		membershipMethod: z
			.enum([
				'NOTSET',
				'STATIC',
				'DYNAMIC_REVIEW_REQUIRED',
				'DYNAMIC_AUTOMATED',
			])
			.or(z.string())
			.describe(
				'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
			)
			.nullish(),
		memberSuggestionsNotify: z
			.boolean()
			.describe(
				'True if notification emails are to be sent for membership suggestions.',
			)
			.nullish(),
		name: z.string().describe('Display name of a System Group.').nullish(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.nullish(),
		type: z
			.enum(['system_group'])
			.or(z.string())
			.describe("The type of the group; always 'system' for a System Group.")
			.nullish(),
	})
	.loose();

export type SystemGroupsUpdateOutput = z.infer<
	typeof SystemGroupsUpdateOutputSchema
>;

export const SystemGroupsDeleteInputSchema = z
	.object({
		id: safePathParam.describe('ObjectID of the System Group.'),
	})
	.loose();

export type SystemGroupsDeleteInput = z.infer<
	typeof SystemGroupsDeleteInputSchema
>;

export const SystemGroupsDeleteOutputSchema = z
	.object({
		attributes: z.unknown().describe('The graph attributes.').nullish(),
		description: z.string().describe('Description of a System Group').nullish(),
		email: z
			.string()
			.describe('E-mail address associated with a System Group')
			.nullish(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a System Group.')
			.nullish(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.nullish(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.nullish(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
			.nullish(),
		membershipMethod: z
			.enum([
				'NOTSET',
				'STATIC',
				'DYNAMIC_REVIEW_REQUIRED',
				'DYNAMIC_AUTOMATED',
			])
			.or(z.string())
			.describe(
				'The type of membership method for this group. Valid values include NOTSET, STATIC, DYNAMIC_REVIEW_REQUIRED, and DYNAMIC_AUTOMATED.\n\nNote DYNAMIC_AUTOMATED and DYNAMIC_REVIEW_REQUIRED group rules will supersede any group enrollment for [group-associated MDM-enrolled devices](https://jumpcloud.com/sup',
			)
			.nullish(),
		memberSuggestionsNotify: z
			.boolean()
			.describe(
				'True if notification emails are to be sent for membership suggestions.',
			)
			.nullish(),
		name: z.string().describe('Display name of a System Group.').nullish(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.nullish(),
		type: z
			.enum(['system_group'])
			.or(z.string())
			.describe("The type of the group; always 'system' for a System Group.")
			.nullish(),
	})
	.loose()
	// The API answers 200 with the deleted group or 204 with no body.
	.optional();

export type SystemGroupsDeleteOutput = z.infer<
	typeof SystemGroupsDeleteOutputSchema
>;

// The members POST body is the spec's GraphOperation-SystemGroup-Member: one
// graph operation naming the member ObjectID, the modification, and the
// member type. Loose because the spec sets no additionalProperties: false.
export const SystemGroupsManageMembersInputSchema = z
	.object({
		group_id: safePathParam.describe('ObjectID of the System Group.'),
		body: z
			.object({
				id: z
					.string()
					.describe(
						'The ObjectID of graph object being added or removed as an association.',
					),
				op: z
					.enum(['add', 'remove', 'update'])
					.describe('How to modify the graph connection.'),
				type: z.literal('system').describe('The member type.'),
				// unknown: GraphAttributes is documented as an open object
				// (additionalProperties true, nullable), so its contents are
				// provider-defined and have no closed shape to type.
				attributes: z
					.record(z.string(), z.unknown())
					.nullable()
					.optional()
					.describe('The graph attributes.'),
			})
			.loose(),
	})
	.loose();

export type SystemGroupsManageMembersInput = z.infer<
	typeof SystemGroupsManageMembersInputSchema
>;

export const SystemGroupsManageMembersOutputSchema = z.void();

export type SystemGroupsManageMembersOutput = z.infer<
	typeof SystemGroupsManageMembersOutputSchema
>;

export const PoliciesListInputSchema = z
	.object({
		fields: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields included in the returned records.\nIf omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'A filter to apply to the query.\n\n**Filter structure**: `<field>:<operator>:<value>`.\n\n**field** = Populate with a valid field from an endpoint response.\n\n**operator** =  Supported operators are: eq, ne, gt, ge, lt, le, between, search, in.\n_Note: v1 operators differ from v2 operators._\n\n**value** = ',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields used to sort the collection.\nDefault sort is ascending, prefix with `-` to sort descending.\n',
			)
			.optional(),
	})
	.loose();

export type PoliciesListInput = z.infer<typeof PoliciesListInputSchema>;

export const PoliciesListOutputSchema = z.array(
	z
		.object({
			id: z
				.string()
				.describe('ObjectId uniquely identifying a Policy.')
				.nullish(),
			name: z
				.string()
				.describe('The description for this specific Policy.')
				.nullish(),
			template: z.unknown().nullish(),
		})
		.loose()
		.describe('An instance of a policy template.'),
);

export type PoliciesListOutput = z.infer<typeof PoliciesListOutputSchema>;

export const PoliciesCreateInputSchema = z
	.object({
		body: z
			.object({
				name: z.string().describe('The description for this specific Policy.'),
				notes: z
					.string()
					.describe('The notes for this specific Policy.')
					.optional(),
				template: z
					.object({
						id: z
							.string()
							.describe('ObjectId uniquely identifying a Policy instance.'),
					})
					.loose(),
				// unknown: policy template values are template-defined key/value
				// pairs, so the spec publishes no item shape to type.
				values: z.array(z.unknown()).optional(),
			})
			.loose()
			.describe('A request to create an instance of a policy template.'),
	})
	.loose();

export type PoliciesCreateInput = z.infer<typeof PoliciesCreateInputSchema>;

export const PoliciesCreateOutputSchema = z
	.object({
		configFields: z.array(z.unknown()).nullish(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a Policy.')
			.nullish(),
		name: z
			.string()
			.describe('The description for this specific Policy.')
			.nullish(),
		notes: z.string().describe('The notes for this specific Policy.').nullish(),
		template: z
			.object({
				activation: z
					.string()
					.describe('Requirements before the policy can be activated.')
					.nullish(),
				behavior: z
					.string()
					.describe('Specifics about the behavior of the policy.')
					.nullish(),
				deliveryTypes: z
					.array(z.enum(['agent', 'mdm']).or(z.string()))
					.describe(
						'The supported delivery mechanisms for this policy template.',
					)
					.nullish(),
				description: z
					.string()
					.describe('The default description for the Policy.')
					.nullish(),
				displayName: z
					.string()
					.describe('The default display name for the Policy.')
					.nullish(),
				id: z
					.string()
					.describe('ObjectId uniquely identifying a Policy Template.')
					.nullish(),
				name: z
					.string()
					.describe('The unique name for the Policy Template.')
					.nullish(),
				osMetaFamily: z
					.enum(['linux', 'darwin', 'windows', 'ios', 'universal', 'android'])
					.or(z.string())
					.nullish(),
				state: z
					.string()
					.describe(
						'String describing the release status of the policy template.',
					)
					.nullish(),
				alert: z
					.unknown()
					.describe('Text to describe any risk associated with this policy.')
					.nullish(),
				reference: z
					.unknown()
					.describe('URL to visit for further information.')
					.nullish(),
				osRestrictions: z.array(z.unknown()).nullish(),
			})
			.loose()
			.describe('The shallow information about a Policy Template.')
			.nullish(),
		values: z.array(z.unknown()).nullish(),
	})
	.loose()
	.describe('An instance of a policy template.');

export type PoliciesCreateOutput = z.infer<typeof PoliciesCreateOutputSchema>;

export const PoliciesGetInputSchema = z
	.object({
		id: safePathParam.describe('ObjectID of the Policy object.'),
	})
	.loose();

export type PoliciesGetInput = z.infer<typeof PoliciesGetInputSchema>;

export const PoliciesGetOutputSchema = z
	.object({
		configFields: z.array(z.unknown()).nullish(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a Policy.')
			.nullish(),
		name: z
			.string()
			.describe('The description for this specific Policy.')
			.nullish(),
		notes: z.string().describe('The notes for this specific Policy.').nullish(),
		template: z
			.object({
				activation: z
					.string()
					.describe('Requirements before the policy can be activated.')
					.nullish(),
				behavior: z
					.string()
					.describe('Specifics about the behavior of the policy.')
					.nullish(),
				deliveryTypes: z
					.array(z.enum(['agent', 'mdm']).or(z.string()))
					.describe(
						'The supported delivery mechanisms for this policy template.',
					)
					.nullish(),
				description: z
					.string()
					.describe('The default description for the Policy.')
					.nullish(),
				displayName: z
					.string()
					.describe('The default display name for the Policy.')
					.nullish(),
				id: z
					.string()
					.describe('ObjectId uniquely identifying a Policy Template.')
					.nullish(),
				name: z
					.string()
					.describe('The unique name for the Policy Template.')
					.nullish(),
				osMetaFamily: z
					.enum(['linux', 'darwin', 'windows', 'ios', 'universal', 'android'])
					.or(z.string())
					.nullish(),
				state: z
					.string()
					.describe(
						'String describing the release status of the policy template.',
					)
					.nullish(),
				alert: z
					.unknown()
					.describe('Text to describe any risk associated with this policy.')
					.nullish(),
				reference: z
					.unknown()
					.describe('URL to visit for further information.')
					.nullish(),
				osRestrictions: z.array(z.unknown()).nullish(),
			})
			.loose()
			.describe('The shallow information about a Policy Template.')
			.nullish(),
		values: z.array(z.unknown()).nullish(),
	})
	.loose()
	.describe('An instance of a policy template.');

export type PoliciesGetOutput = z.infer<typeof PoliciesGetOutputSchema>;

export const PoliciesUpdateInputSchema = z
	.object({
		id: safePathParam.describe('ObjectID of the Policy object.'),
		body: z
			.object({
				name: z.string().describe('The description for this specific Policy.'),
				notes: z
					.string()
					.describe('The notes for this specific Policy.')
					.optional(),
				// unknown: policy template values are template-defined key/value
				// pairs, so the spec publishes no item shape to type.
				values: z.array(z.unknown()).optional(),
			})
			.loose()
			.describe('A request to update an instance of a policy template.'),
	})
	.loose();

export type PoliciesUpdateInput = z.infer<typeof PoliciesUpdateInputSchema>;

export const PoliciesUpdateOutputSchema = z
	.object({
		id: z
			.string()
			.describe('ObjectId uniquely identifying a Policy.')
			.nullish(),
		name: z
			.string()
			.describe('The description for this specific Policy.')
			.nullish(),
		template: z
			.object({
				activation: z
					.string()
					.describe('Requirements before the policy can be activated.')
					.nullish(),
				behavior: z
					.string()
					.describe('Specifics about the behavior of the policy.')
					.nullish(),
				deliveryTypes: z
					.array(z.enum(['agent', 'mdm']).or(z.string()))
					.describe(
						'The supported delivery mechanisms for this policy template.',
					)
					.nullish(),
				description: z
					.string()
					.describe('The default description for the Policy.')
					.nullish(),
				displayName: z
					.string()
					.describe('The default display name for the Policy.')
					.nullish(),
				id: z
					.string()
					.describe('ObjectId uniquely identifying a Policy Template.')
					.nullish(),
				name: z
					.string()
					.describe('The unique name for the Policy Template.')
					.nullish(),
				osMetaFamily: z
					.enum(['linux', 'darwin', 'windows', 'ios', 'universal', 'android'])
					.or(z.string())
					.nullish(),
				state: z
					.string()
					.describe(
						'String describing the release status of the policy template.',
					)
					.nullish(),
				alert: z
					.unknown()
					.describe('Text to describe any risk associated with this policy.')
					.nullish(),
				reference: z
					.unknown()
					.describe('URL to visit for further information.')
					.nullish(),
				osRestrictions: z.array(z.unknown()).nullish(),
			})
			.loose()
			.describe('The shallow information about a Policy Template.')
			.nullish(),
	})
	.loose()
	.describe('An instance of a policy template.');

export type PoliciesUpdateOutput = z.infer<typeof PoliciesUpdateOutputSchema>;

export const PoliciesDeleteInputSchema = z
	.object({
		id: safePathParam.describe('ObjectID of the Policy object.'),
	})
	.loose();

export type PoliciesDeleteInput = z.infer<typeof PoliciesDeleteInputSchema>;

export const PoliciesDeleteOutputSchema = z.void();

export type PoliciesDeleteOutput = z.infer<typeof PoliciesDeleteOutputSchema>;

export const PoliciesListStatusesInputSchema = z
	.object({
		policy_id: safePathParam.describe('policy_id (path)'),
		fields: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields included in the returned records.\nIf omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'A filter to apply to the query.\n\n**Filter structure**: `<field>:<operator>:<value>`.\n\n**field** = Populate with a valid field from an endpoint response.\n\n**operator** =  Supported operators are: eq, ne, gt, ge, lt, le, between, search, in.\n_Note: v1 operators differ from v2 operators._\n\n**value** = ',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields used to sort the collection.\nDefault sort is ascending, prefix with `-` to sort descending.\n',
			)
			.optional(),
	})
	.loose();

export type PoliciesListStatusesInput = z.infer<
	typeof PoliciesListStatusesInputSchema
>;

export const PoliciesListStatusesOutputSchema = z.array(
	z
		.object({
			detail: z
				.string()
				.describe('Details pertaining to the policy result.')
				.nullish(),
			endedAt: z
				.string()
				.describe('The end of the policy application.')
				.nullish(),
			exitStatus: z
				.number()
				.describe(
					'The 32-bit unsigned exit status from the applying the policy.',
				)
				.nullish(),
			id: z
				.string()
				.describe('ObjectId uniquely identifying a Policy Result.')
				.nullish(),
			policyID: z
				.string()
				.describe('ObjectId uniquely identifying the parent Policy.')
				.nullish(),
			startedAt: z
				.string()
				.describe('The start of the policy application.')
				.nullish(),
			state: z
				.string()
				.describe(
					'Enumeration describing the state of the policy. Success, failed, or pending.',
				)
				.nullish(),
			stdErr: z
				.string()
				.describe('The STDERR output from applying the policy.')
				.nullish(),
			stdOut: z
				.string()
				.describe('The STDOUT output from applying the policy.')
				.nullish(),
			success: z
				.boolean()
				.describe(
					'True if the policy was successfully applied; false otherwise.',
				)
				.nullish(),
			systemID: z
				.string()
				.describe('ObjectId uniquely identifying the parent System.')
				.nullish(),
			userObjectId: z
				.string()
				.describe('ObjectId uniquely identifying the parent User.')
				.nullish(),
		})
		.loose(),
);

export type PoliciesListStatusesOutput = z.infer<
	typeof PoliciesListStatusesOutputSchema
>;

export const SystemsListUsersInputSchema = z
	.object({
		system_id: safePathParam.describe('ObjectID of the System.'),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		filter: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'A filter to apply to the query.\n\n**Filter structure**: `<field>:<operator>:<value>`.\n\n**field** = Populate with a valid field from an endpoint response.\n\n**operator** =  Supported operators are: eq, ne, gt, ge, lt, le, between, search, in.\n_Note: v1 operators differ from v2 operators._\n\n**value** = ',
			)
			.optional(),
	})
	.loose();

export type SystemsListUsersInput = z.infer<typeof SystemsListUsersInputSchema>;

export const SystemsListUsersOutputSchema = z.array(
	z
		.object({
			compiledAttributes: z.unknown().nullish(),
			id: z.string().describe('Object ID of this graph object.'),
			paths: z
				.array(z.array(z.unknown()))
				.describe(
					'Every path through the graph from the requested object to this object. Each path lists the groupings and associations it follows; all of them would have to be removed to remove this object from the requested object.',
				),
			type: z.unknown(),
			externalId: z
				.string()
				.describe(
					'The external resource ID that is being synced. Only present when syncStatus query parameter is true.',
				)
				.nullish(),
			syncStatus: z.unknown().nullish(),
		})
		.loose(),
);

export type SystemsListUsersOutput = z.infer<
	typeof SystemsListUsersOutputSchema
>;

export const SystemsListPolicyStatusesInputSchema = z
	.object({
		system_id: safePathParam.describe('ObjectID of the System.'),
		fields: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields included in the returned records.\nIf omitted, the default list of fields will be returned.\n',
			)
			.optional(),
		filter: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'A filter to apply to the query.\n\n**Filter structure**: `<field>:<operator>:<value>`.\n\n**field** = Populate with a valid field from an endpoint response.\n\n**operator** =  Supported operators are: eq, ne, gt, ge, lt, le, between, search, in.\n_Note: v1 operators differ from v2 operators._\n\n**value** = ',
			)
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
		sort: z
			.array(z.union([z.string(), z.number()]))
			.describe(
				'The comma separated fields used to sort the collection.\nDefault sort is ascending, prefix with `-` to sort descending.\n',
			)
			.optional(),
	})
	.loose();

export type SystemsListPolicyStatusesInput = z.infer<
	typeof SystemsListPolicyStatusesInputSchema
>;

export const SystemsListPolicyStatusesOutputSchema = z.array(
	z
		.object({
			detail: z
				.string()
				.describe('Details pertaining to the policy result.')
				.nullish(),
			endedAt: z
				.string()
				.describe('The end of the policy application.')
				.nullish(),
			exitStatus: z
				.number()
				.describe(
					'The 32-bit unsigned exit status from the applying the policy.',
				)
				.nullish(),
			id: z
				.string()
				.describe('ObjectId uniquely identifying a Policy Result.')
				.nullish(),
			policyID: z
				.string()
				.describe('ObjectId uniquely identifying the parent Policy.')
				.nullish(),
			startedAt: z
				.string()
				.describe('The start of the policy application.')
				.nullish(),
			state: z
				.string()
				.describe(
					'Enumeration describing the state of the policy. Success, failed, or pending.',
				)
				.nullish(),
			stdErr: z
				.string()
				.describe('The STDERR output from applying the policy.')
				.nullish(),
			stdOut: z
				.string()
				.describe('The STDOUT output from applying the policy.')
				.nullish(),
			success: z
				.boolean()
				.describe(
					'True if the policy was successfully applied; false otherwise.',
				)
				.nullish(),
			systemID: z
				.string()
				.describe('ObjectId uniquely identifying the parent System.')
				.nullish(),
			userObjectId: z
				.string()
				.describe('ObjectId uniquely identifying the parent User.')
				.nullish(),
		})
		.loose(),
);

export type SystemsListPolicyStatusesOutput = z.infer<
	typeof SystemsListPolicyStatusesOutputSchema
>;

export const SystemsListAssociationsInputSchema = z
	.object({
		system_id: safePathParam.describe('ObjectID of the System.'),
		targets: z
			.array(z.union([z.string(), z.number()]))
			.describe('Targets which a "system" can be associated to.')
			.optional(),
		limit: z
			.number()
			.describe('The number of records to return at once. Limited to 100.')
			.optional(),
		skip: z
			.number()
			.describe('The offset into the records to return.')
			.optional(),
	})
	.loose();

export type SystemsListAssociationsInput = z.infer<
	typeof SystemsListAssociationsInputSchema
>;

export const SystemsListAssociationsOutputSchema = z.array(
	z
		.object({
			attributes: z.unknown().nullish(),
			from: z.unknown().nullish(),
			to: z.unknown(),
		})
		.loose()
		.describe(
			'Represents an edge between two graph objects. From can be omitted if it is clear from context.',
		),
);

export type SystemsListAssociationsOutput = z.infer<
	typeof SystemsListAssociationsOutputSchema
>;

export type JumpCloudEndpointInputs = {
	'users.list': UsersListInput;
	'users.create': UsersCreateInput;
	'users.get': UsersGetInput;
	'users.update': UsersUpdateInput;
	'users.delete': UsersDeleteInput;
	'users.setPassword': UsersSetPasswordInput;
	'users.unlock': UsersUnlockInput;
	'users.expirePassword': UsersExpirePasswordInput;
	'users.resetMfa': UsersResetMfaInput;
	'users.enforceMfa': UsersEnforceMfaInput;
	'users.syncMfa': UsersSyncMfaInput;
	'users.listSshKeys': UsersListSshKeysInput;
	'systems.list': SystemsListInput;
	'systems.get': SystemsGetInput;
	'systems.delete': SystemsDeleteInput;
	'search.systemUsers': SearchSystemUsersInput;
	'search.systems': SearchSystemsInput;
	'commands.list': CommandsListInput;
	'commands.create': CommandsCreateInput;
	'commands.get': CommandsGetInput;
	'commands.run': CommandsRunInput;
	'applications.list': ApplicationsListInput;
	'applications.get': ApplicationsGetInput;
	'organizations.list': OrganizationsListInput;
	'organizations.get': OrganizationsGetInput;
	'userGroups.list': UserGroupsListInput;
	'userGroups.create': UserGroupsCreateInput;
	'userGroups.get': UserGroupsGetInput;
	'userGroups.update': UserGroupsUpdateInput;
	'userGroups.delete': UserGroupsDeleteInput;
	'userGroups.listMembers': UserGroupsListMembersInput;
	'userGroups.manageMembers': UserGroupsManageMembersInput;
	'userGroups.listMembership': UserGroupsListMembershipInput;
	'systemGroups.list': SystemGroupsListInput;
	'systemGroups.create': SystemGroupsCreateInput;
	'systemGroups.get': SystemGroupsGetInput;
	'systemGroups.update': SystemGroupsUpdateInput;
	'systemGroups.delete': SystemGroupsDeleteInput;
	'systemGroups.manageMembers': SystemGroupsManageMembersInput;
	'policies.list': PoliciesListInput;
	'policies.create': PoliciesCreateInput;
	'policies.get': PoliciesGetInput;
	'policies.update': PoliciesUpdateInput;
	'policies.delete': PoliciesDeleteInput;
	'policies.listStatuses': PoliciesListStatusesInput;
	'systems.listUsers': SystemsListUsersInput;
	'systems.listPolicyStatuses': SystemsListPolicyStatusesInput;
	'systems.listAssociations': SystemsListAssociationsInput;
};

export type JumpCloudEndpointOutputs = {
	'users.list': UsersListOutput;
	'users.create': UsersCreateOutput;
	'users.get': UsersGetOutput;
	'users.update': UsersUpdateOutput;
	'users.delete': UsersDeleteOutput;
	'users.setPassword': UsersSetPasswordOutput;
	'users.unlock': UsersUnlockOutput;
	'users.expirePassword': UsersExpirePasswordOutput;
	'users.resetMfa': UsersResetMfaOutput;
	'users.enforceMfa': UsersEnforceMfaOutput;
	'users.syncMfa': UsersSyncMfaOutput;
	'users.listSshKeys': UsersListSshKeysOutput;
	'systems.list': SystemsListOutput;
	'systems.get': SystemsGetOutput;
	'systems.delete': SystemsDeleteOutput;
	'search.systemUsers': SearchSystemUsersOutput;
	'search.systems': SearchSystemsOutput;
	'commands.list': CommandsListOutput;
	'commands.create': CommandsCreateOutput;
	'commands.get': CommandsGetOutput;
	'commands.run': CommandsRunOutput;
	'applications.list': ApplicationsListOutput;
	'applications.get': ApplicationsGetOutput;
	'organizations.list': OrganizationsListOutput;
	'organizations.get': OrganizationsGetOutput;
	'userGroups.list': UserGroupsListOutput;
	'userGroups.create': UserGroupsCreateOutput;
	'userGroups.get': UserGroupsGetOutput;
	'userGroups.update': UserGroupsUpdateOutput;
	'userGroups.delete': UserGroupsDeleteOutput;
	'userGroups.listMembers': UserGroupsListMembersOutput;
	'userGroups.manageMembers': UserGroupsManageMembersOutput;
	'userGroups.listMembership': UserGroupsListMembershipOutput;
	'systemGroups.list': SystemGroupsListOutput;
	'systemGroups.create': SystemGroupsCreateOutput;
	'systemGroups.get': SystemGroupsGetOutput;
	'systemGroups.update': SystemGroupsUpdateOutput;
	'systemGroups.delete': SystemGroupsDeleteOutput;
	'systemGroups.manageMembers': SystemGroupsManageMembersOutput;
	'policies.list': PoliciesListOutput;
	'policies.create': PoliciesCreateOutput;
	'policies.get': PoliciesGetOutput;
	'policies.update': PoliciesUpdateOutput;
	'policies.delete': PoliciesDeleteOutput;
	'policies.listStatuses': PoliciesListStatusesOutput;
	'systems.listUsers': SystemsListUsersOutput;
	'systems.listPolicyStatuses': SystemsListPolicyStatusesOutput;
	'systems.listAssociations': SystemsListAssociationsOutput;
};

export const JumpCloudEndpointInputSchemas = {
	'users.list': UsersListInputSchema,
	'users.create': UsersCreateInputSchema,
	'users.get': UsersGetInputSchema,
	'users.update': UsersUpdateInputSchema,
	'users.delete': UsersDeleteInputSchema,
	'users.setPassword': UsersSetPasswordInputSchema,
	'users.unlock': UsersUnlockInputSchema,
	'users.expirePassword': UsersExpirePasswordInputSchema,
	'users.resetMfa': UsersResetMfaInputSchema,
	'users.enforceMfa': UsersEnforceMfaInputSchema,
	'users.syncMfa': UsersSyncMfaInputSchema,
	'users.listSshKeys': UsersListSshKeysInputSchema,
	'systems.list': SystemsListInputSchema,
	'systems.get': SystemsGetInputSchema,
	'systems.delete': SystemsDeleteInputSchema,
	'search.systemUsers': SearchSystemUsersInputSchema,
	'search.systems': SearchSystemsInputSchema,
	'commands.list': CommandsListInputSchema,
	'commands.create': CommandsCreateInputSchema,
	'commands.get': CommandsGetInputSchema,
	'commands.run': CommandsRunInputSchema,
	'applications.list': ApplicationsListInputSchema,
	'applications.get': ApplicationsGetInputSchema,
	'organizations.list': OrganizationsListInputSchema,
	'organizations.get': OrganizationsGetInputSchema,
	'userGroups.list': UserGroupsListInputSchema,
	'userGroups.create': UserGroupsCreateInputSchema,
	'userGroups.get': UserGroupsGetInputSchema,
	'userGroups.update': UserGroupsUpdateInputSchema,
	'userGroups.delete': UserGroupsDeleteInputSchema,
	'userGroups.listMembers': UserGroupsListMembersInputSchema,
	'userGroups.manageMembers': UserGroupsManageMembersInputSchema,
	'userGroups.listMembership': UserGroupsListMembershipInputSchema,
	'systemGroups.list': SystemGroupsListInputSchema,
	'systemGroups.create': SystemGroupsCreateInputSchema,
	'systemGroups.get': SystemGroupsGetInputSchema,
	'systemGroups.update': SystemGroupsUpdateInputSchema,
	'systemGroups.delete': SystemGroupsDeleteInputSchema,
	'systemGroups.manageMembers': SystemGroupsManageMembersInputSchema,
	'policies.list': PoliciesListInputSchema,
	'policies.create': PoliciesCreateInputSchema,
	'policies.get': PoliciesGetInputSchema,
	'policies.update': PoliciesUpdateInputSchema,
	'policies.delete': PoliciesDeleteInputSchema,
	'policies.listStatuses': PoliciesListStatusesInputSchema,
	'systems.listUsers': SystemsListUsersInputSchema,
	'systems.listPolicyStatuses': SystemsListPolicyStatusesInputSchema,
	'systems.listAssociations': SystemsListAssociationsInputSchema,
} as const;

export const JumpCloudEndpointOutputSchemas = {
	'users.list': UsersListOutputSchema,
	'users.create': UsersCreateOutputSchema,
	'users.get': UsersGetOutputSchema,
	'users.update': UsersUpdateOutputSchema,
	'users.delete': UsersDeleteOutputSchema,
	'users.setPassword': UsersSetPasswordOutputSchema,
	'users.unlock': UsersUnlockOutputSchema,
	'users.expirePassword': UsersExpirePasswordOutputSchema,
	'users.resetMfa': UsersResetMfaOutputSchema,
	'users.enforceMfa': UsersEnforceMfaOutputSchema,
	'users.syncMfa': UsersSyncMfaOutputSchema,
	'users.listSshKeys': UsersListSshKeysOutputSchema,
	'systems.list': SystemsListOutputSchema,
	'systems.get': SystemsGetOutputSchema,
	'systems.delete': SystemsDeleteOutputSchema,
	'search.systemUsers': SearchSystemUsersOutputSchema,
	'search.systems': SearchSystemsOutputSchema,
	'commands.list': CommandsListOutputSchema,
	'commands.create': CommandsCreateOutputSchema,
	'commands.get': CommandsGetOutputSchema,
	'commands.run': CommandsRunOutputSchema,
	'applications.list': ApplicationsListOutputSchema,
	'applications.get': ApplicationsGetOutputSchema,
	'organizations.list': OrganizationsListOutputSchema,
	'organizations.get': OrganizationsGetOutputSchema,
	'userGroups.list': UserGroupsListOutputSchema,
	'userGroups.create': UserGroupsCreateOutputSchema,
	'userGroups.get': UserGroupsGetOutputSchema,
	'userGroups.update': UserGroupsUpdateOutputSchema,
	'userGroups.delete': UserGroupsDeleteOutputSchema,
	'userGroups.listMembers': UserGroupsListMembersOutputSchema,
	'userGroups.manageMembers': UserGroupsManageMembersOutputSchema,
	'userGroups.listMembership': UserGroupsListMembershipOutputSchema,
	'systemGroups.list': SystemGroupsListOutputSchema,
	'systemGroups.create': SystemGroupsCreateOutputSchema,
	'systemGroups.get': SystemGroupsGetOutputSchema,
	'systemGroups.update': SystemGroupsUpdateOutputSchema,
	'systemGroups.delete': SystemGroupsDeleteOutputSchema,
	'systemGroups.manageMembers': SystemGroupsManageMembersOutputSchema,
	'policies.list': PoliciesListOutputSchema,
	'policies.create': PoliciesCreateOutputSchema,
	'policies.get': PoliciesGetOutputSchema,
	'policies.update': PoliciesUpdateOutputSchema,
	'policies.delete': PoliciesDeleteOutputSchema,
	'policies.listStatuses': PoliciesListStatusesOutputSchema,
	'systems.listUsers': SystemsListUsersOutputSchema,
	'systems.listPolicyStatuses': SystemsListPolicyStatusesOutputSchema,
	'systems.listAssociations': SystemsListAssociationsOutputSchema,
} as const;
