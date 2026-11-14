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
			.optional(),
		totalCount: z
			.number()
			.describe('The total number of system users.')
			.optional(),
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
		_id: z.string().optional(),
		account_locked: z.boolean().optional(),
		account_locked_date: z.unknown().optional(),
		activated: z.boolean().optional(),
		admin: z.unknown().optional(),
		addresses: z
			.array(
				z
					.object({
						country: z.string().optional(),
						extendedAddress: z.string().optional(),
						id: z.string().optional(),
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
		attributes: z.array(z.unknown()).optional(),
		badLoginAttempts: z.number().optional(),
		company: z.string().optional(),
		costCenter: z.string().optional(),
		created: z.string().optional(),
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
		mfaEnrollment: z
			.object({
				totpStatus: z.unknown().optional(),
				webAuthnStatus: z.unknown().optional(),
				pushStatus: z.unknown().optional(),
				smsStatus: z.unknown().optional(),
				overallStatus: z.unknown().optional(),
				jcGoStatus: z.unknown().optional(),
			})
			.loose()
			.optional(),
		middlename: z.string().optional(),
		organization: z.string().optional(),
		password_date: z.unknown().optional(),
		password_expiration_date: z.unknown().optional(),
		password_expired: z.boolean().optional(),
		password_never_expires: z.boolean().optional(),
		passwordless_sudo: z.boolean().optional(),
		phoneNumbers: z
			.array(
				z
					.object({
						id: z.string().optional(),
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
				verified: z.boolean().optional(),
				verifiedAt: z.string().optional(),
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
		ssh_keys: z.array(z.unknown()).optional(),
		state: z.enum(['STAGED', 'ACTIVATED', 'SUSPENDED']).optional(),
		sudo: z.boolean().optional(),
		suspended: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		totp_enabled: z.boolean().optional(),
		unix_guid: z.number().optional(),
		unix_uid: z.number().optional(),
		username: z.string().optional(),
		managedAppleId: z.string().optional(),
		creationSource: z.string().optional(),
		delegatedAuthority: z
			.unknown()
			.describe('Used by auth to determine password delegation authority')
			.optional(),
		restrictedFields: z.array(z.unknown()).optional(),
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
		_id: z.string().optional(),
		account_locked: z.boolean().optional(),
		account_locked_date: z.unknown().optional(),
		activated: z.boolean().optional(),
		admin: z.unknown().optional(),
		addresses: z
			.array(
				z
					.object({
						country: z.string().optional(),
						extendedAddress: z.string().optional(),
						id: z.string().optional(),
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
		attributes: z.array(z.unknown()).optional(),
		badLoginAttempts: z.number().optional(),
		company: z.string().optional(),
		costCenter: z.string().optional(),
		created: z.string().optional(),
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
		mfaEnrollment: z
			.object({
				totpStatus: z.unknown().optional(),
				webAuthnStatus: z.unknown().optional(),
				pushStatus: z.unknown().optional(),
				smsStatus: z.unknown().optional(),
				overallStatus: z.unknown().optional(),
				jcGoStatus: z.unknown().optional(),
			})
			.loose()
			.optional(),
		middlename: z.string().optional(),
		organization: z.string().optional(),
		password_date: z.unknown().optional(),
		password_expiration_date: z.unknown().optional(),
		password_expired: z.boolean().optional(),
		password_never_expires: z.boolean().optional(),
		passwordless_sudo: z.boolean().optional(),
		phoneNumbers: z
			.array(
				z
					.object({
						id: z.string().optional(),
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
				verified: z.boolean().optional(),
				verifiedAt: z.string().optional(),
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
		ssh_keys: z.array(z.unknown()).optional(),
		state: z.enum(['STAGED', 'ACTIVATED', 'SUSPENDED']).optional(),
		sudo: z.boolean().optional(),
		suspended: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		totp_enabled: z.boolean().optional(),
		unix_guid: z.number().optional(),
		unix_uid: z.number().optional(),
		username: z.string().optional(),
		managedAppleId: z.string().optional(),
		creationSource: z.string().optional(),
		delegatedAuthority: z
			.unknown()
			.describe('Used by auth to determine password delegation authority')
			.optional(),
		restrictedFields: z.array(z.unknown()).optional(),
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
		_id: z.string().optional(),
		account_locked: z.boolean().optional(),
		account_locked_date: z.unknown().optional(),
		activated: z.boolean().optional(),
		admin: z.unknown().optional(),
		addresses: z
			.array(
				z
					.object({
						country: z.string().optional(),
						extendedAddress: z.string().optional(),
						id: z.string().optional(),
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
		attributes: z.array(z.unknown()).optional(),
		badLoginAttempts: z.number().optional(),
		company: z.string().optional(),
		costCenter: z.string().optional(),
		created: z.string().optional(),
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
		mfaEnrollment: z
			.object({
				totpStatus: z.unknown().optional(),
				webAuthnStatus: z.unknown().optional(),
				pushStatus: z.unknown().optional(),
				smsStatus: z.unknown().optional(),
				overallStatus: z.unknown().optional(),
				jcGoStatus: z.unknown().optional(),
			})
			.loose()
			.optional(),
		middlename: z.string().optional(),
		organization: z.string().optional(),
		password_date: z.unknown().optional(),
		password_expiration_date: z.unknown().optional(),
		password_expired: z.boolean().optional(),
		password_never_expires: z.boolean().optional(),
		passwordless_sudo: z.boolean().optional(),
		phoneNumbers: z
			.array(
				z
					.object({
						id: z.string().optional(),
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
				verified: z.boolean().optional(),
				verifiedAt: z.string().optional(),
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
		ssh_keys: z.array(z.unknown()).optional(),
		state: z.enum(['STAGED', 'ACTIVATED', 'SUSPENDED']).optional(),
		sudo: z.boolean().optional(),
		suspended: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		totp_enabled: z.boolean().optional(),
		unix_guid: z.number().optional(),
		unix_uid: z.number().optional(),
		username: z.string().optional(),
		managedAppleId: z.string().optional(),
		creationSource: z.string().optional(),
		delegatedAuthority: z
			.unknown()
			.describe('Used by auth to determine password delegation authority')
			.optional(),
		restrictedFields: z.array(z.unknown()).optional(),
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
		_id: z.string().optional(),
		account_locked: z.boolean().optional(),
		account_locked_date: z.unknown().optional(),
		activated: z.boolean().optional(),
		admin: z.unknown().optional(),
		addresses: z
			.array(
				z
					.object({
						country: z.string().optional(),
						extendedAddress: z.string().optional(),
						id: z.string().optional(),
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
		attributes: z.array(z.unknown()).optional(),
		badLoginAttempts: z.number().optional(),
		company: z.string().optional(),
		costCenter: z.string().optional(),
		created: z.string().optional(),
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
		mfaEnrollment: z
			.object({
				totpStatus: z.unknown().optional(),
				webAuthnStatus: z.unknown().optional(),
				pushStatus: z.unknown().optional(),
				smsStatus: z.unknown().optional(),
				overallStatus: z.unknown().optional(),
				jcGoStatus: z.unknown().optional(),
			})
			.loose()
			.optional(),
		middlename: z.string().optional(),
		organization: z.string().optional(),
		password_date: z.unknown().optional(),
		password_expiration_date: z.unknown().optional(),
		password_expired: z.boolean().optional(),
		password_never_expires: z.boolean().optional(),
		passwordless_sudo: z.boolean().optional(),
		phoneNumbers: z
			.array(
				z
					.object({
						id: z.string().optional(),
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
				verified: z.boolean().optional(),
				verifiedAt: z.string().optional(),
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
		ssh_keys: z.array(z.unknown()).optional(),
		state: z.enum(['STAGED', 'ACTIVATED', 'SUSPENDED']).optional(),
		sudo: z.boolean().optional(),
		suspended: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		totp_enabled: z.boolean().optional(),
		unix_guid: z.number().optional(),
		unix_uid: z.number().optional(),
		username: z.string().optional(),
		managedAppleId: z.string().optional(),
		creationSource: z.string().optional(),
		delegatedAuthority: z
			.unknown()
			.describe('Used by auth to determine password delegation authority')
			.optional(),
		restrictedFields: z.array(z.unknown()).optional(),
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

export const UsersExpirePasswordOutputSchema = z.string();

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

export const UsersSyncMfaOutputSchema = z.void();

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
			_id: z.string().describe('The ID of the SSH key.').optional(),
			create_date: z
				.string()
				.describe('The date the SSH key was created.')
				.optional(),
			name: z.string().describe('The name of the SSH key.').optional(),
			public_key: z.string().describe('The Public SSH key.').optional(),
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
		results: z.array(z.unknown()).describe('The list of systems.').optional(),
		totalCount: z.number().describe('The total number of systems.').optional(),
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
		_id: z.string().optional(),
		active: z.boolean().optional(),
		agentHasFullDiskAccess: z.boolean().optional(),
		agentVersion: z.string().optional(),
		allowMultiFactorAuthentication: z.boolean().optional(),
		allowPublicKeyAuthentication: z.boolean().optional(),
		allowSshPasswordAuthentication: z.boolean().optional(),
		allowSshRootLogin: z.boolean().optional(),
		amazonInstanceID: z.string().optional(),
		arch: z.string().optional(),
		archFamily: z.string().optional(),
		attributes: z.array(z.unknown()).optional(),
		connectionHistory: z.array(z.record(z.string(), z.unknown())).optional(),
		created: z.string().optional(),
		description: z.string().optional(),
		desktopCapable: z.boolean().optional(),
		displayName: z.string().optional(),
		fde: z
			.object({
				active: z.boolean().optional(),
				keyPresent: z.boolean().optional(),
			})
			.loose()
			.describe('Indicates if the Full Disk Encryption is active in the system')
			.optional(),
		fileSystem: z.unknown().optional(),
		hasServiceAccount: z.boolean().optional(),
		hostname: z.string().optional(),
		hwVendor: z.string().optional(),
		isPolicyBound: z.boolean().optional(),
		lastContact: z.unknown().optional(),
		modifySSHDConfig: z.boolean().optional(),
		networkInterfaces: z
			.array(
				z
					.object({
						address: z.string().optional(),
						family: z.enum(['IPv4', 'IPv6']).optional(),
						internal: z.boolean().optional(),
						name: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		networkInfo: z
			.object({
				imei: z.string().describe('PII data; do not log.').optional(),
				macAddress: z.string().describe('PII data; do not log.').optional(),
				simInfo: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.loose()
			.optional(),
		organization: z.string().optional(),
		os: z.string().optional(),
		osVersionDetail: z
			.object({
				osName: z.string().optional(),
				releaseName: z.string().optional(),
				major: z.string().optional(),
				minor: z.string().optional(),
				patch: z.string().optional(),
				majorNumber: z.number().optional(),
				minorNumber: z.number().optional(),
				patchNumber: z.number().optional(),
				revision: z.string().optional(),
				distributionName: z.string().optional(),
				version: z.string().optional(),
			})
			.loose()
			.optional(),
		policyStats: z
			.object({
				duplicate: z.number().optional(),
				failed: z.number().optional(),
				pending: z.number().optional(),
				success: z.number().optional(),
				total: z.number().optional(),
				unsupportedOs: z.number().optional(),
			})
			.loose()
			.optional(),
		provisionMetadata: z
			.object({
				provisioner: z
					.object({
						type: z.enum(['administrator', 'mdm', 'user']).optional(),
						provisionerId: z.string().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		primarySystemUser: z
			.object({
				id: z.unknown().optional(),
			})
			.loose()
			.optional(),
		remoteIP: z.string().optional(),
		serialNumber: z.string().optional(),
		sshRootEnabled: z.boolean().optional(),
		sshdParams: z
			.array(
				z
					.object({
						name: z.string().optional(),
						value: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		systemInsights: z
			.object({
				state: z.enum(['enabled', 'disabled', 'deferred']).optional(),
			})
			.loose()
			.optional(),
		systemTimezone: z.number().optional(),
		tags: z.array(z.string()).optional(),
		templateName: z.string().optional(),
		version: z.string().optional(),
		mdm: z
			.object({
				vendor: z.enum(['unknown', 'none', 'internal', 'external']).optional(),
				internal: z
					.object({
						deviceId: z.string().optional(),
						windowsDeviceId: z.string().optional(),
					})
					.loose()
					.optional(),
				profileIdentifier: z.string().optional(),
				dep: z.boolean().optional(),
				userApproved: z.boolean().optional(),
				enrollmentType: z
					.enum(['unknown', 'automated device', 'device', 'user'])
					.optional(),
				providerId: z.string().optional(),
				windows: z
					.object({
						upn: z.string().optional(),
					})
					.loose()
					.optional(),
				lostModeStatus: z.string().optional(),
				deviceLockStatus: z.number().optional(),
				enrollmentStatus: z.number().optional(),
			})
			.loose()
			.optional(),
		builtInCommands: z
			.array(
				z
					.object({
						type: z.enum(['security']).optional(),
						name: z.enum(['erase', 'lock', 'restart', 'shutdown']).optional(),
					})
					.loose(),
			)
			.optional(),
		osFamily: z.string().optional(),
		domainInfo: z
			.object({
				partOfDomain: z.boolean().optional(),
				domainName: z.string().optional(),
			})
			.loose()
			.optional(),
		userMetrics: z
			.array(
				z
					.object({
						userName: z.string().optional(),
						admin: z.boolean().optional(),
						managed: z.boolean().optional(),
						suspended: z.boolean().optional(),
						secureTokenEnabled: z.boolean().optional(),
					})
					.loose(),
			)
			.optional(),
		serviceAccountState: z
			.object({
				hasSecureToken: z.boolean().optional(),
				passwordODValid: z.boolean().optional(),
				passwordAPFSValid: z.boolean().optional(),
			})
			.loose()
			.optional(),
		azureAdJoined: z.boolean().optional(),
		displayManager: z.string().optional(),
		secureLogin: z
			.object({
				supported: z.boolean().optional(),
				enabled: z.boolean().optional(),
			})
			.loose()
			.optional(),
		remoteAssistAgentVersion: z.string().optional(),
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
		_id: z.string().optional(),
		active: z.boolean().optional(),
		agentHasFullDiskAccess: z.boolean().optional(),
		agentVersion: z.string().optional(),
		allowMultiFactorAuthentication: z.boolean().optional(),
		allowPublicKeyAuthentication: z.boolean().optional(),
		allowSshPasswordAuthentication: z.boolean().optional(),
		allowSshRootLogin: z.boolean().optional(),
		amazonInstanceID: z.string().optional(),
		arch: z.string().optional(),
		archFamily: z.string().optional(),
		attributes: z.array(z.unknown()).optional(),
		connectionHistory: z.array(z.record(z.string(), z.unknown())).optional(),
		created: z.string().optional(),
		description: z.string().optional(),
		desktopCapable: z.boolean().optional(),
		displayName: z.string().optional(),
		fde: z
			.object({
				active: z.boolean().optional(),
				keyPresent: z.boolean().optional(),
			})
			.loose()
			.describe('Indicates if the Full Disk Encryption is active in the system')
			.optional(),
		fileSystem: z.unknown().optional(),
		hasServiceAccount: z.boolean().optional(),
		hostname: z.string().optional(),
		hwVendor: z.string().optional(),
		isPolicyBound: z.boolean().optional(),
		lastContact: z.unknown().optional(),
		modifySSHDConfig: z.boolean().optional(),
		networkInterfaces: z
			.array(
				z
					.object({
						address: z.string().optional(),
						family: z.enum(['IPv4', 'IPv6']).optional(),
						internal: z.boolean().optional(),
						name: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		networkInfo: z
			.object({
				imei: z.string().describe('PII data; do not log.').optional(),
				macAddress: z.string().describe('PII data; do not log.').optional(),
				simInfo: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.loose()
			.optional(),
		organization: z.string().optional(),
		os: z.string().optional(),
		osVersionDetail: z
			.object({
				osName: z.string().optional(),
				releaseName: z.string().optional(),
				major: z.string().optional(),
				minor: z.string().optional(),
				patch: z.string().optional(),
				majorNumber: z.number().optional(),
				minorNumber: z.number().optional(),
				patchNumber: z.number().optional(),
				revision: z.string().optional(),
				distributionName: z.string().optional(),
				version: z.string().optional(),
			})
			.loose()
			.optional(),
		policyStats: z
			.object({
				duplicate: z.number().optional(),
				failed: z.number().optional(),
				pending: z.number().optional(),
				success: z.number().optional(),
				total: z.number().optional(),
				unsupportedOs: z.number().optional(),
			})
			.loose()
			.optional(),
		provisionMetadata: z
			.object({
				provisioner: z
					.object({
						type: z.enum(['administrator', 'mdm', 'user']).optional(),
						provisionerId: z.string().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		primarySystemUser: z
			.object({
				id: z.unknown().optional(),
			})
			.loose()
			.optional(),
		remoteIP: z.string().optional(),
		serialNumber: z.string().optional(),
		sshRootEnabled: z.boolean().optional(),
		sshdParams: z
			.array(
				z
					.object({
						name: z.string().optional(),
						value: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		systemInsights: z
			.object({
				state: z.enum(['enabled', 'disabled', 'deferred']).optional(),
			})
			.loose()
			.optional(),
		systemTimezone: z.number().optional(),
		tags: z.array(z.string()).optional(),
		templateName: z.string().optional(),
		version: z.string().optional(),
		mdm: z
			.object({
				vendor: z.enum(['unknown', 'none', 'internal', 'external']).optional(),
				internal: z
					.object({
						deviceId: z.string().optional(),
						windowsDeviceId: z.string().optional(),
					})
					.loose()
					.optional(),
				profileIdentifier: z.string().optional(),
				dep: z.boolean().optional(),
				userApproved: z.boolean().optional(),
				enrollmentType: z
					.enum(['unknown', 'automated device', 'device', 'user'])
					.optional(),
				providerId: z.string().optional(),
				windows: z
					.object({
						upn: z.string().optional(),
					})
					.loose()
					.optional(),
				lostModeStatus: z.string().optional(),
				deviceLockStatus: z.number().optional(),
				enrollmentStatus: z.number().optional(),
			})
			.loose()
			.optional(),
		builtInCommands: z
			.array(
				z
					.object({
						type: z.enum(['security']).optional(),
						name: z.enum(['erase', 'lock', 'restart', 'shutdown']).optional(),
					})
					.loose(),
			)
			.optional(),
		osFamily: z.string().optional(),
		domainInfo: z
			.object({
				partOfDomain: z.boolean().optional(),
				domainName: z.string().optional(),
			})
			.loose()
			.optional(),
		userMetrics: z
			.array(
				z
					.object({
						userName: z.string().optional(),
						admin: z.boolean().optional(),
						managed: z.boolean().optional(),
						suspended: z.boolean().optional(),
						secureTokenEnabled: z.boolean().optional(),
					})
					.loose(),
			)
			.optional(),
		serviceAccountState: z
			.object({
				hasSecureToken: z.boolean().optional(),
				passwordODValid: z.boolean().optional(),
				passwordAPFSValid: z.boolean().optional(),
			})
			.loose()
			.optional(),
		azureAdJoined: z.boolean().optional(),
		displayManager: z.string().optional(),
		secureLogin: z
			.object({
				supported: z.boolean().optional(),
				enabled: z.boolean().optional(),
			})
			.loose()
			.optional(),
		remoteAssistAgentVersion: z.string().optional(),
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
		body: z
			.object({
				filter: z
					.array(
						z
							.object({
								field: z.string(),
								operator: z.string(),
								// unknown: the spec accepts any JSON value in a filter entry,
								// so the value has no published shape to type.
								value: z.unknown().optional(),
							})
							.loose(),
					)
					.describe(
						'Array of field/operator/value filters, e.g. {"field":"lastname","operator":"$eq","value":"Smith"}.',
					)
					.optional(),
				andLogic: z
					.boolean()
					.describe('Whether the filters are ANDed (default) or ORed.')
					.optional(),
				limit: z.number().optional(),
				skip: z.number().optional(),
				sort: z.string().optional(),
				fields: z.string().optional(),
			})
			.loose(),
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
			.optional(),
		totalCount: z
			.number()
			.describe('The total number of system users.')
			.optional(),
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
		body: z
			.object({
				filter: z
					.array(
						z
							.object({
								field: z.string(),
								operator: z.string(),
								// unknown: the spec accepts any JSON value in a filter entry,
								// so the value has no published shape to type.
								value: z.unknown().optional(),
							})
							.loose(),
					)
					.describe('Array of field/operator/value filters.')
					.optional(),
				andLogic: z
					.boolean()
					.describe('Whether the filters are ANDed (default) or ORed.')
					.optional(),
				limit: z.number().optional(),
				skip: z.number().optional(),
				sort: z.string().optional(),
				fields: z.string().optional(),
			})
			.loose(),
	})
	.loose();

export type SearchSystemsInput = z.infer<typeof SearchSystemsInputSchema>;

export const SearchSystemsOutputSchema = z
	.object({
		results: z.array(z.unknown()).describe('The list of systems.').optional(),
		totalCount: z.number().describe('The total number of systems.').optional(),
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
						_id: z.string().describe('The ID of the command.').optional(),
						command: z
							.string()
							.describe('The Command to execute, truncated to 10k characters.')
							.optional(),
						commandType: z.string().describe('The Command OS.').optional(),
						launchType: z
							.string()
							.describe('How the Command is executed.')
							.optional(),
						listensTo: z.string().optional(),
						name: z.string().describe('The name of the Command.').optional(),
						organization: z
							.string()
							.describe('The ID of the Organization.')
							.optional(),
						schedule: z
							.string()
							.describe(
								'A crontab that consists of: [ (seconds) (minutes) (hours) (days of month) (months) (weekdays) ] or [ immediate ]. If you send this as an empty string, it will run immediately.',
							)
							.optional(),
						scheduleRepeatType: z
							.string()
							.describe('When the command will repeat.')
							.optional(),
						trigger: z
							.string()
							.describe('Trigger to execute command.')
							.optional(),
						description: z
							.string()
							.describe('Description of the command.')
							.optional(),
						aiGenerated: z
							.boolean()
							.describe(
								'Whether this command was generated with AI assistance.',
							)
							.optional(),
						templatingRequired: z
							.boolean()
							.describe(
								'Whether this command requires templating before execution.',
							)
							.optional(),
						managedBy: z
							.enum(['enterprise', 'organization'])
							.describe('Command owner type (`enterprise` or `organization`).')
							.optional(),
					})
					.loose(),
			)
			.optional(),
		totalCount: z.number().describe('The total number of commands').optional(),
	})
	.loose();

export type CommandsListOutput = z.infer<typeof CommandsListOutputSchema>;

export const CommandsCreateInputSchema = z
	.object({
		body: z
			.object({
				name: z.string().describe('The name of the command.').optional(),
				command: z.string().describe('The command to run.'),
				commandType: z
					.string()
					.describe('The OS of the command target: mac, windows, or linux.'),
				listenerHost: z.string().optional(),
				timeout: z
					.number()
					.describe('The command timeout in seconds.')
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
			.optional(),
		commandTarget: z
			.enum(['enterprise', 'organization'])
			.describe(
				'EP create target when enterprise command sharing is enabled. `enterprise`\ncreates a default-shared Enterprise command (grants all current child orgs).\n`organization` creates a local command in `targetOrganizationId` (or the\npinned org). Ignored when sharing is disabled.\n',
			)
			.optional(),
		targetOrganizationId: z
			.string()
			.describe(
				'Child organization ID for a local command when `commandTarget` is\n`organization` in Enterprise / View All context. Ignored for Enterprise\ncreate and when sharing is disabled.\n',
			)
			.optional(),
		commandType: z.string().describe('The Command OS'),
		files: z
			.array(z.string())
			.describe('An array of file IDs to include with the command.')
			.optional(),
		launchType: z.string().describe('How the command will execute.').optional(),
		listensTo: z.string().optional(),
		name: z.string(),
		organization: z.string().describe('The ID of the organization.').optional(),
		schedule: z
			.string()
			.describe(
				'A crontab that consists of: [ (seconds) (minutes) (hours) (days of month) (months) (weekdays) ] or [ immediate ]. If you send this as an empty string, it will run immediately.\n',
			)
			.optional(),
		scheduleRepeatType: z
			.string()
			.describe('When the command will repeat.')
			.optional(),
		sudo: z.boolean().optional(),
		systems: z
			.array(z.string())
			.describe(
				'Not used. Use /api/v2/commands/{id}/associations to bind commands to systems.',
			)
			.optional(),
		template: z
			.string()
			.describe('The template this command was created from')
			.optional(),
		timeout: z
			.string()
			.describe(
				'The time in seconds to allow the command to run for. The maximum value is 86400 seconds (1 day).',
			)
			.optional(),
		trigger: z.string().describe('The name of the command trigger.').optional(),
		user: z
			.string()
			.describe(
				'The ID of the system user to run the command as. This field is required when creating a command with a commandType of "mac" or "linux".',
			)
			.optional(),
		shell: z.string().describe('The shell used to run the command.').optional(),
		timeToLiveSeconds: z
			.number()
			.describe(
				'Time in seconds a command can wait in the queue to be run before timing out',
			)
			.optional(),
		scheduleYear: z
			.number()
			.describe('The year that a scheduled command will launch in.')
			.optional(),
		filesS3: z
			.array(z.unknown())
			.describe('An array of file stored in S3 to include with the command.')
			.optional(),
		description: z.string().describe('Description of the command.').optional(),
		aiGenerated: z
			.boolean()
			.describe('Whether this command was generated with AI assistance.')
			.optional(),
		templatingRequired: z
			.boolean()
			.describe('Whether this command requires templating before execution.')
			.optional(),
		managedBy: z
			.enum(['enterprise', 'organization'])
			.describe('Command owner type (`enterprise` or `organization`).')
			.optional(),
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
			.optional(),
		commandRunners: z
			.array(z.string())
			.describe(
				'An array of IDs of the Command Runner Users that can execute this command.',
			)
			.optional(),
		commandTarget: z
			.enum(['enterprise', 'organization'])
			.describe(
				'EP create target when enterprise command sharing is enabled. `enterprise`\ncreates a default-shared Enterprise command (grants all current child orgs).\n`organization` creates a local command in `targetOrganizationId` (or the\npinned org). Ignored when sharing is disabled.\n',
			)
			.optional(),
		targetOrganizationId: z
			.string()
			.describe(
				'Child organization ID for a local command when `commandTarget` is\n`organization` in Enterprise / View All context. Ignored for Enterprise\ncreate and when sharing is disabled.\n',
			)
			.optional(),
		commandType: z.string().describe('The Command OS').optional(),
		files: z
			.array(z.string())
			.describe('An array of file IDs to include with the command.')
			.optional(),
		launchType: z.string().describe('How the command will execute.').optional(),
		listensTo: z.string().optional(),
		name: z.string().optional(),
		organization: z.string().describe('The ID of the organization.').optional(),
		schedule: z
			.string()
			.describe(
				'A crontab that consists of: [ (seconds) (minutes) (hours) (days of month) (months) (weekdays) ] or [ immediate ]. If you send this as an empty string, it will run immediately.\n',
			)
			.optional(),
		scheduleRepeatType: z
			.string()
			.describe('When the command will repeat.')
			.optional(),
		sudo: z.boolean().optional(),
		systems: z
			.array(z.string())
			.describe(
				'Not used. Use /api/v2/commands/{id}/associations to bind commands to systems.',
			)
			.optional(),
		template: z
			.string()
			.describe('The template this command was created from')
			.optional(),
		timeout: z
			.string()
			.describe(
				'The time in seconds to allow the command to run for. The maximum value is 86400 seconds (1 day).',
			)
			.optional(),
		trigger: z.string().describe('The name of the command trigger.').optional(),
		user: z
			.string()
			.describe(
				'The ID of the system user to run the command as. This field is required when creating a command with a commandType of "mac" or "linux".',
			)
			.optional(),
		shell: z.string().describe('The shell used to run the command.').optional(),
		timeToLiveSeconds: z
			.number()
			.describe(
				'Time in seconds a command can wait in the queue to be run before timing out',
			)
			.optional(),
		scheduleYear: z
			.number()
			.describe('The year that a scheduled command will launch in.')
			.optional(),
		filesS3: z
			.array(z.unknown())
			.describe('An array of file stored in S3 to include with the command.')
			.optional(),
		description: z.string().describe('Description of the command.').optional(),
		aiGenerated: z
			.boolean()
			.describe('Whether this command was generated with AI assistance.')
			.optional(),
		templatingRequired: z
			.boolean()
			.describe('Whether this command requires templating before execution.')
			.optional(),
		managedBy: z
			.enum(['enterprise', 'organization'])
			.describe('Command owner type (`enterprise` or `organization`).')
			.optional(),
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
		queueIds: z.array(z.string()).optional(),
		workflowInstanceId: z.string().optional(),
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
		name: z.string().optional(),
		results: z
			.array(z.unknown())
			.describe('The list of applications.')
			.optional(),
		totalCount: z
			.number()
			.describe('The total number of applications.')
			.optional(),
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
		_id: z.string().optional(),
		active: z.boolean().optional(),
		beta: z.boolean().optional(),
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
			.optional(),
		config: z
			.object({
				spErrorFlow: z.unknown().optional(),
				signAssertion: z.unknown().optional(),
				signResponse: z.unknown().optional(),
				acsUrl: z
					.object({
						label: z.string().optional(),
						options: z.unknown().optional(),
						position: z.number().optional(),
						readOnly: z.boolean().optional(),
						required: z.boolean().optional(),
						toggle: z.unknown().optional(),
						tooltip: z.unknown().optional(),
						type: z.string().optional(),
						value: z.string().optional(),
						visible: z.boolean().optional(),
					})
					.loose()
					.optional(),
				constantAttributes: z.unknown().optional(),
				databaseAttributes: z
					.object({
						position: z.number().optional(),
					})
					.loose()
					.optional(),
				idpCertificate: z
					.object({
						label: z.string().optional(),
						options: z.unknown().optional(),
						position: z.number().optional(),
						readOnly: z.boolean().optional(),
						required: z.boolean().optional(),
						toggle: z.unknown().optional(),
						tooltip: z.unknown().optional(),
						type: z.string().optional(),
						value: z.string().optional(),
						visible: z.boolean().optional(),
					})
					.loose()
					.optional(),
				idpEntityId: z
					.object({
						label: z.string().optional(),
						options: z.unknown().optional(),
						position: z.number().optional(),
						readOnly: z.boolean().optional(),
						required: z.boolean().optional(),
						toggle: z.unknown().optional(),
						tooltip: z.unknown().optional(),
						type: z.string().optional(),
						value: z.string().optional(),
						visible: z.boolean().optional(),
					})
					.loose()
					.optional(),
				idpPrivateKey: z
					.object({
						label: z.string().optional(),
						options: z.unknown().optional(),
						position: z.number().optional(),
						readOnly: z.boolean().optional(),
						required: z.boolean().optional(),
						toggle: z.unknown().optional(),
						tooltip: z.unknown().optional(),
						type: z.string().optional(),
						value: z.string().optional(),
						visible: z.boolean().optional(),
					})
					.loose()
					.optional(),
				spEntityId: z
					.object({
						label: z.string().optional(),
						options: z.unknown().optional(),
						position: z.number().optional(),
						readOnly: z.boolean().optional(),
						required: z.boolean().optional(),
						toggle: z.unknown().optional(),
						tooltip: z.unknown().optional(),
						type: z.string().optional(),
						value: z.string().optional(),
						visible: z.boolean().optional(),
					})
					.loose()
					.optional(),
				authClaimConfiguration: z.unknown().optional(),
			})
			.loose()
			.describe(
				'Only required for SAML configuration (not required for Bookmarks)',
			),
		created: z.string().optional(),
		databaseAttributes: z.array(z.record(z.string(), z.unknown())).optional(),
		description: z.string().optional(),
		displayLabel: z.string().optional(),
		displayName: z.string().optional(),
		learnMore: z.string().optional(),
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
					.optional(),
				url: z.string().optional(),
			})
			.loose()
			.optional(),
		name: z.string(),
		organization: z.string().optional(),
		sso: z
			.object({
				type: z.string().optional(),
				beta: z.boolean().optional(),
				jit: z.boolean().optional(),
				idpCertExpirationAt: z.string().optional(),
				idpCertificateUpdatedAt: z.string().optional(),
				idpPrivateKeyUpdatedAt: z.string().optional(),
				spCertificateUpdatedAt: z.string().optional(),
				hidden: z.boolean().optional(),
			})
			.loose()
			.optional(),
		ssoUrl: z.string(),
		parentApp: z.string().optional(),
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
			.optional(),
		aiReady: z
			.boolean()
			.describe(
				'Admin opt-in that this application instance should appear as AI Ready in the User Portal. Informational only — does not grant access. Setting to true requires at least one configured MCP connection. Gated by feature flag DC-4194-app-ai-ready.',
			)
			.optional(),
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
						_id: z.string().describe('The ID of the organization.').optional(),
						displayName: z
							.string()
							.describe('The name of the organization.')
							.optional(),
						logoUrl: z
							.unknown()
							.describe('The organization logo image URL. ')
							.optional(),
					})
					.loose(),
			)
			.describe('The list of organizations.')
			.optional(),
		totalCount: z
			.number()
			.describe('The total number of organizations. ')
			.optional(),
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
		_id: z.string().optional(),
		created: z.string().optional(),
		customEmailSettings: z
			.object({
				enabled: z
					.boolean()
					.describe(
						'Used to enable or disable custom emails for an organization.',
					)
					.optional(),
			})
			.loose()
			.describe('Custom email settings for an organization')
			.optional(),
		displayName: z.string().optional(),
		entitlement: z
			.object({
				billingModel: z.string().optional(),
				capUserQuantity: z.boolean().optional(),
				maxUserQuantity: z.number().optional(),
				purchaseChannel: z.string().optional(),
				entitlementProducts: z
					.array(z.record(z.string(), z.unknown()))
					.optional(),
				isManuallyBilled: z.boolean().optional(),
				pricePerUserSum: z.number().optional(),
			})
			.loose()
			.optional(),
		hasStripeCustomerId: z.boolean().optional(),
		hasCreditCard: z.boolean().optional(),
		lastEstimateCalculationTimeStamp: z.string().optional(),
		lastSfdcSyncStatus: z.record(z.string(), z.unknown()).optional(),
		accountsReceivable: z.string().optional(),
		accessRestriction: z.string().optional(),
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
			.describe(
				'Salesforce Account Type (`Account_Type__c`) written back to the org via BSS sync. Returned only when requested via the `fields` query parameter.',
			)
			.optional(),
		logoUrl: z.unknown().optional(),
		provider: z.unknown().optional(),
		settings: z
			.object({
				agentVersion: z.string().optional(),
				betaFeatures: z.record(z.string(), z.unknown()).optional(),
				chromeDTCEnabled: z.boolean().optional(),
				contactEmail: z.string().optional(),
				contactName: z.string().optional(),
				disableCommandRunner: z.boolean().optional(),
				disableLdap: z.boolean().optional(),
				disableUM: z.boolean().optional(),
				duplicateLDAPGroups: z.boolean().optional(),
				emailDisclaimer: z.string().optional(),
				enableGoogleApps: z.boolean().optional(),
				enableManagedUID: z.boolean().optional(),
				enableO365: z.boolean().optional(),
				enableUserPortalAgentInstall: z.boolean().optional(),
				features: z.record(z.string(), z.unknown()).optional(),
				growthData: z
					.record(z.string(), z.unknown())
					.describe(
						'Object containing Optimizely experimentIds and states corresponding to them',
					)
					.optional(),
				logo: z.string().optional(),
				name: z.string().optional(),
				newSystemUserStateDefaults: z
					.record(z.string(), z.unknown())
					.optional(),
				passwordCompliance: z.enum(['custom', 'pci3', 'windows']).optional(),
				passwordPolicy: z.record(z.string(), z.unknown()).optional(),
				pendingDelete: z.boolean().optional(),
				requireAdminMFA: z.boolean().optional(),
				showIntro: z.boolean().optional(),
				systemUserDefaults: z.record(z.string(), z.unknown()).optional(),
				systemUserPasswordExpirationInDays: z.number().optional(),
				systemUsersCanEdit: z.boolean().optional(),
				disableGoogleLogin: z.boolean().optional(),
				userPortal: z.record(z.string(), z.unknown()).optional(),
				deviceIdentificationEnabled: z.boolean().optional(),
				trustedAppConfig: z.unknown().optional(),
				maxSystemUsers: z.number().optional(),
				windowsMDM: z.record(z.string(), z.unknown()).optional(),
			})
			.loose()
			.optional(),
		totalBillingEstimate: z.number().optional(),
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
			attributes: z.unknown().optional(),
			email: z.string().describe('Email address of a User Group').optional(),
			description: z
				.string()
				.describe('Description of a User Group')
				.optional(),
			id: z
				.string()
				.describe('ObjectId uniquely identifying a User Group.')
				.optional(),
			memberQuery: z.unknown().optional(),
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
			memberQueryErrorFlags: z.unknown().optional(),
			membershipMethod: z.unknown().optional(),
			name: z.string().describe('Display name of a User Group.').optional(),
			organizationObjectId: z
				.unknown()
				.describe('id of the organization owning this group')
				.optional(),
			suggestionCounts: z.unknown().optional(),
			type: z
				.enum(['user_group'])
				.describe('The type of the group.')
				.optional(),
		})
		.loose(),
);

export type UserGroupsListOutput = z.infer<typeof UserGroupsListOutputSchema>;

export const UserGroupsCreateInputSchema = z
	.object({
		body: z
			.object({
				attributes: z
					.object({
						name: z.string().describe('The name of the user group.'),
						description: z
							.string()
							.describe('The description of the user group.')
							.optional(),
						email: z
							.string()
							.describe('The email address of the user group.')
							.optional(),
					})
					.loose(),
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
			.optional(),
		email: z.string().describe('Email address of a User Group').optional(),
		description: z.string().describe('Description of a User Group').optional(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a User Group.')
			.optional(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.optional(),
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
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
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
		name: z.string().describe('Display name of a User Group.').optional(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.optional(),
		suggestionCounts: z
			.object({
				add: z.number().optional(),
				remove: z.number().optional(),
				total: z.number().optional(),
			})
			.loose()
			.optional(),
		type: z.enum(['user_group']).describe('The type of the group.').optional(),
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
			.optional(),
		email: z.string().describe('Email address of a User Group').optional(),
		description: z.string().describe('Description of a User Group').optional(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a User Group.')
			.optional(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.optional(),
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
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
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
		name: z.string().describe('Display name of a User Group.').optional(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.optional(),
		suggestionCounts: z
			.object({
				add: z.number().optional(),
				remove: z.number().optional(),
				total: z.number().optional(),
			})
			.loose()
			.optional(),
		type: z.enum(['user_group']).describe('The type of the group.').optional(),
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
			.optional(),
		email: z.string().describe('Email address of a User Group').optional(),
		description: z.string().describe('Description of a User Group').optional(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a User Group.')
			.optional(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.optional(),
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
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
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
		name: z.string().describe('Display name of a User Group.').optional(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.optional(),
		suggestionCounts: z
			.object({
				add: z.number().optional(),
				remove: z.number().optional(),
				total: z.number().optional(),
			})
			.loose()
			.optional(),
		type: z.enum(['user_group']).describe('The type of the group.').optional(),
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
			.optional(),
		email: z.string().describe('Email address of a User Group').optional(),
		description: z.string().describe('Description of a User Group').optional(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a User Group.')
			.optional(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.optional(),
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
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
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
		name: z.string().describe('Display name of a User Group.').optional(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.optional(),
		suggestionCounts: z
			.object({
				add: z.number().optional(),
				remove: z.number().optional(),
				total: z.number().optional(),
			})
			.loose()
			.optional(),
		type: z.enum(['user_group']).describe('The type of the group.').optional(),
	})
	.loose();

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
			attributes: z.unknown().optional(),
			from: z.unknown().optional(),
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
			compiledAttributes: z.unknown().optional(),
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
				.optional(),
			syncStatus: z.unknown().optional(),
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
			attributes: z.unknown().optional(),
			description: z
				.string()
				.describe('Description of a System Group')
				.optional(),
			email: z
				.string()
				.describe('E-mail address associated with a System Group')
				.optional(),
			id: z
				.string()
				.describe('ObjectId uniquely identifying a System Group.')
				.optional(),
			memberQuery: z.unknown().optional(),
			memberQueryErrorFlags: z.unknown().optional(),
			// unknown: GraphObjects are polymorphic provider-defined objects, and
			// the spec publishes no item shape for the exemptions array.
			memberQueryExemptions: z
				.array(z.unknown())
				.describe('Array of GraphObjects exempted from the query')
				.optional(),
			membershipMethod: z.unknown().optional(),
			memberSuggestionsNotify: z
				.boolean()
				.describe(
					'True if notification emails are to be sent for membership suggestions.',
				)
				.optional(),
			name: z.string().describe('Display name of a System Group.').optional(),
			organizationObjectId: z
				.unknown()
				.describe('id of the organization owning this group')
				.optional(),
			type: z
				.enum(['system_group'])
				.describe("The type of the group; always 'system' for a System Group.")
				.optional(),
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
		attributes: z.unknown().describe('The graph attributes.').optional(),
		description: z
			.string()
			.describe('Description of a System Group')
			.optional(),
		email: z
			.string()
			.describe('E-mail address associated with a System Group')
			.optional(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a System Group.')
			.optional(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.optional(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.optional(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
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
		name: z.string().describe('Display name of a System Group.').optional(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.optional(),
		type: z
			.enum(['system_group'])
			.describe("The type of the group; always 'system' for a System Group.")
			.optional(),
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
		attributes: z.unknown().describe('The graph attributes.').optional(),
		description: z
			.string()
			.describe('Description of a System Group')
			.optional(),
		email: z
			.string()
			.describe('E-mail address associated with a System Group')
			.optional(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a System Group.')
			.optional(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.optional(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.optional(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
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
		name: z.string().describe('Display name of a System Group.').optional(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.optional(),
		type: z
			.enum(['system_group'])
			.describe("The type of the group; always 'system' for a System Group.")
			.optional(),
	})
	.loose();

export type SystemGroupsGetOutput = z.infer<typeof SystemGroupsGetOutputSchema>;

export const SystemGroupsUpdateInputSchema = z
	.object({
		id: safePathParam.describe('ObjectID of the System Group.'),
		body: z
			.object({
				attributes: z
					.object({
						name: z
							.string()
							.describe('The name of the system group.')
							.optional(),
						description: z
							.string()
							.describe('The description of the system group.')
							.optional(),
					})
					.loose()
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
		attributes: z.unknown().describe('The graph attributes.').optional(),
		description: z
			.string()
			.describe('Description of a System Group')
			.optional(),
		email: z
			.string()
			.describe('E-mail address associated with a System Group')
			.optional(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a System Group.')
			.optional(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.optional(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.optional(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
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
		name: z.string().describe('Display name of a System Group.').optional(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.optional(),
		type: z
			.enum(['system_group'])
			.describe("The type of the group; always 'system' for a System Group.")
			.optional(),
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
		attributes: z.unknown().describe('The graph attributes.').optional(),
		description: z
			.string()
			.describe('Description of a System Group')
			.optional(),
		email: z
			.string()
			.describe('E-mail address associated with a System Group')
			.optional(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a System Group.')
			.optional(),
		memberQuery: z
			.unknown()
			.describe(
				'Dynamic group member query. v1 (default): include queryType (FilterQuery, Filter, or Search). v2 (x-query-dsl: v2): omit queryType; filters use field, operation, and value.',
			)
			.optional(),
		memberQueryErrorFlags: z
			.array(z.string())
			.describe(
				'Group error flags indicating errors encountered during member query evaluation.\n\nPossible flag values:\n- CYCLE: A cyclic dependency was detected in group membership\n- INVALID_GROUP_REFERENCE: The group reference is invalid or does not exist\n\nThe `member_query_error_flags` as a field supports array-b',
			)
			.optional(),
		memberQueryExemptions: z
			.array(z.unknown())
			.describe('Array of GraphObjects exempted from the query')
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
		name: z.string().describe('Display name of a System Group.').optional(),
		organizationObjectId: z
			.unknown()
			.describe('id of the organization owning this group')
			.optional(),
		type: z
			.enum(['system_group'])
			.describe("The type of the group; always 'system' for a System Group.")
			.optional(),
	})
	.loose();

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
				.optional(),
			name: z
				.string()
				.describe('The description for this specific Policy.')
				.optional(),
			template: z.unknown().optional(),
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
		configFields: z.array(z.unknown()).optional(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a Policy.')
			.optional(),
		name: z
			.string()
			.describe('The description for this specific Policy.')
			.optional(),
		notes: z
			.string()
			.describe('The notes for this specific Policy.')
			.optional(),
		template: z
			.object({
				activation: z
					.string()
					.describe('Requirements before the policy can be activated.')
					.optional(),
				behavior: z
					.string()
					.describe('Specifics about the behavior of the policy.')
					.optional(),
				deliveryTypes: z
					.array(z.enum(['agent', 'mdm']))
					.describe(
						'The supported delivery mechanisms for this policy template.',
					)
					.optional(),
				description: z
					.string()
					.describe('The default description for the Policy.')
					.optional(),
				displayName: z
					.string()
					.describe('The default display name for the Policy.')
					.optional(),
				id: z
					.string()
					.describe('ObjectId uniquely identifying a Policy Template.')
					.optional(),
				name: z
					.string()
					.describe('The unique name for the Policy Template.')
					.optional(),
				osMetaFamily: z
					.enum(['linux', 'darwin', 'windows', 'ios', 'universal', 'android'])
					.optional(),
				state: z
					.string()
					.describe(
						'String describing the release status of the policy template.',
					)
					.optional(),
				alert: z
					.unknown()
					.describe('Text to describe any risk associated with this policy.')
					.optional(),
				reference: z
					.unknown()
					.describe('URL to visit for further information.')
					.optional(),
				osRestrictions: z.array(z.unknown()).optional(),
			})
			.loose()
			.describe('The shallow information about a Policy Template.')
			.optional(),
		values: z.array(z.unknown()).optional(),
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
		configFields: z.array(z.unknown()).optional(),
		id: z
			.string()
			.describe('ObjectId uniquely identifying a Policy.')
			.optional(),
		name: z
			.string()
			.describe('The description for this specific Policy.')
			.optional(),
		notes: z
			.string()
			.describe('The notes for this specific Policy.')
			.optional(),
		template: z
			.object({
				activation: z
					.string()
					.describe('Requirements before the policy can be activated.')
					.optional(),
				behavior: z
					.string()
					.describe('Specifics about the behavior of the policy.')
					.optional(),
				deliveryTypes: z
					.array(z.enum(['agent', 'mdm']))
					.describe(
						'The supported delivery mechanisms for this policy template.',
					)
					.optional(),
				description: z
					.string()
					.describe('The default description for the Policy.')
					.optional(),
				displayName: z
					.string()
					.describe('The default display name for the Policy.')
					.optional(),
				id: z
					.string()
					.describe('ObjectId uniquely identifying a Policy Template.')
					.optional(),
				name: z
					.string()
					.describe('The unique name for the Policy Template.')
					.optional(),
				osMetaFamily: z
					.enum(['linux', 'darwin', 'windows', 'ios', 'universal', 'android'])
					.optional(),
				state: z
					.string()
					.describe(
						'String describing the release status of the policy template.',
					)
					.optional(),
				alert: z
					.unknown()
					.describe('Text to describe any risk associated with this policy.')
					.optional(),
				reference: z
					.unknown()
					.describe('URL to visit for further information.')
					.optional(),
				osRestrictions: z.array(z.unknown()).optional(),
			})
			.loose()
			.describe('The shallow information about a Policy Template.')
			.optional(),
		values: z.array(z.unknown()).optional(),
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
			.optional(),
		name: z
			.string()
			.describe('The description for this specific Policy.')
			.optional(),
		template: z
			.object({
				activation: z
					.string()
					.describe('Requirements before the policy can be activated.')
					.optional(),
				behavior: z
					.string()
					.describe('Specifics about the behavior of the policy.')
					.optional(),
				deliveryTypes: z
					.array(z.enum(['agent', 'mdm']))
					.describe(
						'The supported delivery mechanisms for this policy template.',
					)
					.optional(),
				description: z
					.string()
					.describe('The default description for the Policy.')
					.optional(),
				displayName: z
					.string()
					.describe('The default display name for the Policy.')
					.optional(),
				id: z
					.string()
					.describe('ObjectId uniquely identifying a Policy Template.')
					.optional(),
				name: z
					.string()
					.describe('The unique name for the Policy Template.')
					.optional(),
				osMetaFamily: z
					.enum(['linux', 'darwin', 'windows', 'ios', 'universal', 'android'])
					.optional(),
				state: z
					.string()
					.describe(
						'String describing the release status of the policy template.',
					)
					.optional(),
				alert: z
					.unknown()
					.describe('Text to describe any risk associated with this policy.')
					.optional(),
				reference: z
					.unknown()
					.describe('URL to visit for further information.')
					.optional(),
				osRestrictions: z.array(z.unknown()).optional(),
			})
			.loose()
			.describe('The shallow information about a Policy Template.')
			.optional(),
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
				.optional(),
			endedAt: z
				.string()
				.describe('The end of the policy application.')
				.optional(),
			exitStatus: z
				.number()
				.describe(
					'The 32-bit unsigned exit status from the applying the policy.',
				)
				.optional(),
			id: z
				.string()
				.describe('ObjectId uniquely identifying a Policy Result.')
				.optional(),
			policyID: z
				.string()
				.describe('ObjectId uniquely identifying the parent Policy.')
				.optional(),
			startedAt: z
				.string()
				.describe('The start of the policy application.')
				.optional(),
			state: z
				.string()
				.describe(
					'Enumeration describing the state of the policy. Success, failed, or pending.',
				)
				.optional(),
			stdErr: z
				.string()
				.describe('The STDERR output from applying the policy.')
				.optional(),
			stdOut: z
				.string()
				.describe('The STDOUT output from applying the policy.')
				.optional(),
			success: z
				.boolean()
				.describe(
					'True if the policy was successfully applied; false otherwise.',
				)
				.optional(),
			systemID: z
				.string()
				.describe('ObjectId uniquely identifying the parent System.')
				.optional(),
			userObjectId: z
				.string()
				.describe('ObjectId uniquely identifying the parent User.')
				.optional(),
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
			compiledAttributes: z.unknown().optional(),
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
				.optional(),
			syncStatus: z.unknown().optional(),
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
				.optional(),
			endedAt: z
				.string()
				.describe('The end of the policy application.')
				.optional(),
			exitStatus: z
				.number()
				.describe(
					'The 32-bit unsigned exit status from the applying the policy.',
				)
				.optional(),
			id: z
				.string()
				.describe('ObjectId uniquely identifying a Policy Result.')
				.optional(),
			policyID: z
				.string()
				.describe('ObjectId uniquely identifying the parent Policy.')
				.optional(),
			startedAt: z
				.string()
				.describe('The start of the policy application.')
				.optional(),
			state: z
				.string()
				.describe(
					'Enumeration describing the state of the policy. Success, failed, or pending.',
				)
				.optional(),
			stdErr: z
				.string()
				.describe('The STDERR output from applying the policy.')
				.optional(),
			stdOut: z
				.string()
				.describe('The STDOUT output from applying the policy.')
				.optional(),
			success: z
				.boolean()
				.describe(
					'True if the policy was successfully applied; false otherwise.',
				)
				.optional(),
			systemID: z
				.string()
				.describe('ObjectId uniquely identifying the parent System.')
				.optional(),
			userObjectId: z
				.string()
				.describe('ObjectId uniquely identifying the parent User.')
				.optional(),
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
			attributes: z.unknown().optional(),
			from: z.unknown().optional(),
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
