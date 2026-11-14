import { z } from 'zod';

// `unknown`: DigiCert's OpenAPI spec omits these provider-defined value shapes,
// so narrower validation would require inventing undocumented constraints.
const unspecifiedProviderValue = () => z.unknown();

const r_2db205955e7eInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ user_id: z.string() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_2db205955e7eOutput = z.array(
	z
		.object({
			id: z.string().optional(),
			user_id: z.string().optional(),
			name: z.string().optional(),
			token: z.string().optional(),
			end_date: z.string().optional(),
			start_date: z.string().optional(),
			active: z.boolean().optional(),
			enabled: z.boolean().optional(),
			masked_api_key: z.string().optional(),
		})
		.passthrough(),
);
const r_e8f57cffa958Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string(),
				end_date: z.string().optional(),
				user_id: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_e8f57cffa958Output = z
	.object({
		id: z.string().optional(),
		user_id: z.string().optional(),
		name: z.string().optional(),
		token: z.string().optional(),
		end_date: z.string().optional(),
		start_date: z.string().optional(),
		active: z.boolean().optional(),
		enabled: z.boolean().optional(),
		masked_api_key: z.string().optional(),
	})
	.passthrough();
const r_4c5572cd02e5Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_4c5572cd02e5Output = z
	.object({
		id: z.string().optional(),
		user_id: z.string().optional(),
		name: z.string().optional(),
		token: z.string().optional(),
		end_date: z.string().optional(),
		start_date: z.string().optional(),
		active: z.boolean().optional(),
		enabled: z.boolean().optional(),
		masked_api_key: z.string().optional(),
	})
	.passthrough();
const r_601a73f00551Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string(),
				end_date: z.string().optional(),
				enabled: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_601a73f00551Output = z
	.object({
		id: z.string().optional(),
		user_id: z.string().optional(),
		name: z.string().optional(),
		token: z.string().optional(),
		end_date: z.string().optional(),
		start_date: z.string().optional(),
		active: z.boolean().optional(),
		enabled: z.boolean().optional(),
		masked_api_key: z.string().optional(),
	})
	.passthrough();
const r_4ad10b0eab03Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_4ad10b0eab03Output = z.undefined();
const r_0e428a8d097bInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				active: z
					.union([z.literal('all'), z.literal(true), z.literal(false)])
					.optional(),
				name: z.string().optional(),
				account_ids: z.array(z.string()).optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_0e428a8d097bOutput = z.array(
	z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			active: z.boolean().optional(),
			service_period: z
				.object({ from: z.string().optional(), to: z.string().optional() })
				.passthrough()
				.optional(),
			friendly_identifier: z.string().optional(),
			admins: z
				.array(
					z
						.object({
							id: z.string().optional(),
							name: z.string().optional(),
							email: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
			auth_config: z
				.array(
					z
						.object({
							id: z.string().optional(),
							status: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
			sign_in_methods: z
				.array(
					z
						.object({
							mfaStatus: z
								.enum(['enabled', 'disabled'])
								.or(z.string())
								.optional(),
							signInMethod: z
								.enum(['standard', 'sso'])
								.or(z.string())
								.optional(),
							status: z.enum(['enabled', 'disabled']).or(z.string()).optional(),
							clientAuthCertLoginEnabled: z.boolean().optional(),
						})
						.passthrough(),
				)
				.optional(),
			oauth_clients: z
				.array(
					z
						.object({
							id: z.string().optional(),
							name: z.string().optional(),
							status: z.enum(['ENABLED', 'DISABLED']).or(z.string()).optional(),
							oauthClientId: z.string().optional(),
							oauthClientAccountId: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
			locale: z.string().optional(),
			type: z.enum(['standard', 'partner']).or(z.string()).optional(),
			federated_account_id: z.string().optional(),
			packages: z
				.array(
					z
						.object({
							package_code: z.string().optional(),
							application_code: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_1628177be371Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string(),
				service_period: z
					.object({ from: z.string().optional(), to: z.string() })
					.passthrough(),
				is_standard_login: z.boolean().optional(),
				mfa_enabled: z.boolean().optional(),
				locale: z.string().optional(),
				type: z.enum(['standard', 'partner']).optional(),
				partner_account_id: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_1628177be371Output = z
	.object({ id: z.string().optional() })
	.passthrough();
const r_e9990a55db83Input = z
	.object({
		path: z.object({ account_id: z.string() }).strict(),
		query: z
			.object({ is_federated_account_id: z.boolean().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_e9990a55db83Output = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		active: z.boolean().optional(),
		service_period: z
			.object({ from: z.string().optional(), to: z.string().optional() })
			.passthrough()
			.optional(),
		friendly_identifier: z.string().optional(),
		admins: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		auth_config: z
			.array(
				z
					.object({ id: z.string().optional(), status: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		sign_in_methods: z
			.array(
				z
					.object({
						mfaStatus: z
							.enum(['enabled', 'disabled'])
							.or(z.string())
							.optional(),
						signInMethod: z.enum(['standard', 'sso']).or(z.string()).optional(),
						status: z.enum(['enabled', 'disabled']).or(z.string()).optional(),
						clientAuthCertLoginEnabled: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		oauth_clients: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						status: z.enum(['ENABLED', 'DISABLED']).or(z.string()).optional(),
						oauthClientId: z.string().optional(),
						oauthClientAccountId: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		locale: z.string().optional(),
		type: z.enum(['standard', 'partner']).or(z.string()).optional(),
		federated_account_id: z.string().optional(),
		packages: z
			.array(
				z
					.object({
						package_code: z.string().optional(),
						application_code: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_15fb6b740e87Input = z
	.object({
		path: z.object({ account_id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string(),
				service_period: z
					.object({ from: z.string().optional(), to: z.string() })
					.passthrough(),
				is_standard_login: z.boolean().optional(),
				mfa_enabled: z.boolean().optional(),
				locale: z.string().optional(),
				type: z.enum(['standard', 'partner']).optional(),
				partner_account_id: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_15fb6b740e87Output = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		active: z.boolean().optional(),
		service_period: z
			.object({ from: z.string().optional(), to: z.string().optional() })
			.passthrough()
			.optional(),
		friendly_identifier: z.string().optional(),
		admins: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		auth_config: z
			.array(
				z
					.object({ id: z.string().optional(), status: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		sign_in_methods: z
			.array(
				z
					.object({
						mfaStatus: z
							.enum(['enabled', 'disabled'])
							.or(z.string())
							.optional(),
						signInMethod: z.enum(['standard', 'sso']).or(z.string()).optional(),
						status: z.enum(['enabled', 'disabled']).or(z.string()).optional(),
						clientAuthCertLoginEnabled: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		oauth_clients: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						status: z.enum(['ENABLED', 'DISABLED']).or(z.string()).optional(),
						oauthClientId: z.string().optional(),
						oauthClientAccountId: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		locale: z.string().optional(),
		type: z.enum(['standard', 'partner']).or(z.string()).optional(),
		federated_account_id: z.string().optional(),
		packages: z
			.array(
				z
					.object({
						package_code: z.string().optional(),
						application_code: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_a85d7ecc25d2Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				user_name: z.string().optional(),
				action: z
					.enum([
						'CREATE',
						'UPDATE',
						'DELETE',
						'LOGIN',
						'EXPIRE',
						'LOGOUT',
						'UPDATE_PASSWORD',
						'RESET_PASSWORD',
						'TERMS_AND_CONDITIONS',
						'LOGIN_ERROR',
						'SEND_RESET_PASSWORD',
						'UPDATE_TOTP',
						'DISABLED',
						'ENABLED',
						'LICENSE_REGISTERED',
						'LOW_LICENSE_WARNING_SENT',
						'ACCOUNT_EXPIRY_EMAIL_SENT',
						'API_ACCESS_TOKEN_EXPIRY_EMAIL_SENT',
						'CLIENT_AUTH_CERT_EXPIRY_EMAIL_SENT',
						'FEATURE_ENABLED',
						'FEATURE_DISABLED',
						'SERVICE_USER_EXPIRY_EMAIL_SENT',
						'SAML_IDP_CERT_EXPIRY_EMAIL_SENT',
						'RESET_PASSWORD_ERROR',
						'LINK_ACCOUNT',
						'LINK_USER',
						'MIGRATE_ACCOUNT',
						'MIGRATE_USER',
						'PACKAGE_SELECTED',
						'PACKAGE_UPGRADED',
						'MIGRATE_ROLES',
					])
					.optional(),
				resource_types: z
					.enum([
						'ACCOUNT',
						'USER',
						'SERVICE_USER',
						'APIKEY',
						'CLIENT_AUTH_CERT',
						'SAML2_CONFIG',
						'OIDC_CONFIG',
						'SSO_SAML',
						'BASIC_AUTH',
						'DIGEST_AUTH',
						'OAUTH_CLIENT',
						'OAUTH_CONFIG',
						'LICENSE',
						'BASIC_AUTH_MFA',
						'SSO_SAML_MFA',
						'CLIENT_AUTH_CERT_MFA',
						'SSO_OIDC',
						'SSO_OIDC_MFA',
						'DIGICERT',
						'DIGICERT_MFA',
						'ROLE',
						'ORGANIZATION',
						'SSO_OIDC_IDP_MFA',
					])
					.optional(),
				resource_id: z.string().optional(),
				status: z.enum(['SUCCESS', 'FAILURE']).optional(),
				account_id: z.string().optional(),
				from: z.string().optional(),
				to: z.string().optional(),
				sort: z.string().optional(),
				offset: z.number().int().optional(),
				limit: z.number().int().max(1000).optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a85d7ecc25d2Output = z
	.object({
		total: z.number().int().optional(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		items: z
			.array(
				z
					.object({
						id: z.string().optional(),
						account: z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough()
							.optional(),
						resource_type: z.string().optional(),
						resource_id: z.string().optional(),
						resource_name: z.string().optional(),
						action: z.string().optional(),
						user: z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough()
							.optional(),
						timestamp: z.string().optional(),
						description: z.string().optional(),
						status: z.enum(['success', 'failure']).or(z.string()).optional(),
						client_ip: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_ee246cdb3f55Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ user_id: z.string().optional() }).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ee246cdb3f55Output = z.array(
	z.intersection(
		z
			.object({
				id: z.string().optional(),
				user_id: z.string().optional(),
				name: z.string().optional(),
				common_name: z.string().optional(),
				end_date: z.string().optional(),
				start_date: z.string().optional(),
				enabled: z.boolean().optional(),
				serial_number: z.string().optional(),
				public_key: z.string().optional(),
			})
			.passthrough(),
		z
			.object({
				x509_cert: z.string().optional(),
				ca_cert: z.string().optional(),
			})
			.passthrough(),
	),
);
const r_5f5cde1e7cc7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				csr: z.string(),
				name: z.string().max(256),
				expiration_date: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_5f5cde1e7cc7Output = z.intersection(
	z
		.object({
			id: z.string().optional(),
			user_id: z.string().optional(),
			name: z.string().optional(),
			common_name: z.string().optional(),
			end_date: z.string().optional(),
			start_date: z.string().optional(),
			enabled: z.boolean().optional(),
			serial_number: z.string().optional(),
			public_key: z.string().optional(),
		})
		.passthrough(),
	z
		.object({
			x509_cert: z.string().optional(),
			ca_cert: z.string().optional(),
		})
		.passthrough(),
);
const r_06d703452777Input = z
	.object({
		path: z.object({ certificate_id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ enabled: z.boolean().optional() })
			.passthrough()
			.optional(),
	})
	.strict();
const r_06d703452777Output = z
	.object({
		id: z.string().optional(),
		user_id: z.string().optional(),
		name: z.string().optional(),
		common_name: z.string().optional(),
		end_date: z.string().optional(),
		start_date: z.string().optional(),
		enabled: z.boolean().optional(),
		serial_number: z.string().optional(),
		public_key: z.string().optional(),
	})
	.passthrough();
const r_91d0541033a3Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.string().optional() }).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_91d0541033a3Output = z.array(
	z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			address: z.string().optional(),
			address2: z.string().optional(),
			zip_code: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			country: z.string().optional(),
			phone: z.string().optional(),
			account: z
				.object({ id: z.string().optional(), name: z.string().optional() })
				.passthrough()
				.optional(),
			active: z.boolean().optional(),
			editable: z.boolean().optional(),
		})
		.passthrough(),
);
const r_c8653461a11eInput = z
	.object({
		path: z.object({ organization_id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c8653461a11eOutput = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		address: z.string().optional(),
		address2: z.string().optional(),
		zip_code: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		country: z.string().optional(),
		phone: z.string().optional(),
		account: z
			.object({ id: z.string().optional(), name: z.string().optional() })
			.passthrough()
			.optional(),
		active: z.boolean().optional(),
		editable: z.boolean().optional(),
	})
	.passthrough();
const r_f05dba0a427dInput = z
	.object({
		path: z.object({ user_id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_f05dba0a427dOutput = z
	.object({
		id: z.string().optional(),
		user_name: z.string().optional(),
		saml_user_name: z.string().optional(),
		oidc_user_name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		status: z
			.enum(['ACTIVE', 'DELETED', 'PENDING', 'LOCKED'])
			.or(z.string())
			.optional(),
		access_scope: z.enum(['account']).or(z.string()).optional(),
		active: z.boolean().optional(),
		primary_account_id: z.string().optional(),
		created_at: z.string().optional(),
		created_by: z.string().optional(),
		user_type: z.enum(['standard', 'service']).or(z.string()).optional(),
		friendly_name: z.string().optional(),
		description: z.string().optional(),
		end_date: z.string().optional(),
		locale: z.string().optional(),
		user_confirmed_lang: z.boolean().optional(),
		disable_api_access_token: z.boolean().optional(),
		disable_cac_upload: z.boolean().optional(),
		applications: z.array(unspecifiedProviderValue()).optional(),
		accounts: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						active: z.boolean().optional(),
						service_period: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.passthrough()
							.optional(),
						friendly_identifier: z.string().optional(),
						admins: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						auth_config: z
							.array(
								z
									.object({
										id: z.string().optional(),
										status: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						sign_in_methods: z
							.array(
								z
									.object({
										mfaStatus: z
											.enum(['enabled', 'disabled'])
											.or(z.string())
											.optional(),
										signInMethod: z
											.enum(['standard', 'sso'])
											.or(z.string())
											.optional(),
										status: z
											.enum(['enabled', 'disabled'])
											.or(z.string())
											.optional(),
										clientAuthCertLoginEnabled: z.boolean().optional(),
									})
									.passthrough(),
							)
							.optional(),
						oauth_clients: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
										status: z
											.enum(['ENABLED', 'DISABLED'])
											.or(z.string())
											.optional(),
										oauthClientId: z.string().optional(),
										oauthClientAccountId: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						locale: z.string().optional(),
						type: z.enum(['standard', 'partner']).or(z.string()).optional(),
						federated_account_id: z.string().optional(),
						packages: z
							.array(
								z
									.object({
										package_code: z.string().optional(),
										application_code: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_b3e6d7c8268cInput = z
	.object({
		path: z.object({ user_id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b3e6d7c8268cOutput = z.undefined();
const r_bcad0157f637Input = z
	.object({
		path: z.object({ user_id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				user_type: z.enum(['standard', 'service']).optional(),
				user_name: z.string(),
				first_name: z.string(),
				last_name: z.string(),
				end_date: z.string().optional(),
				friendly_name: z.string().max(255),
				roles: z.array(z.string()),
				permissions: z.array(z.string()).optional(),
				description: z.string().max(255).optional(),
				accounts: z.array(z.string()),
				email: z.string().max(255),
				locale: z.string().optional(),
				phone_number: z.string().optional(),
				password: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_bcad0157f637Output = z
	.object({
		id: z.string().optional(),
		email: z.string().optional(),
		status: z
			.enum(['ACTIVE', 'DELETED', 'PENDING', 'LOCKED'])
			.or(z.string())
			.optional(),
		access_scope: z.enum(['account']).or(z.string()).optional(),
		primary_account_id: z.string().optional(),
		created_at: z.string().optional(),
		friendly_name: z.string().optional(),
		description: z.string().optional(),
		end_date: z.string().optional(),
		api_token: z
			.object({
				id: z.string().optional(),
				user_id: z.string().optional(),
				name: z.string().optional(),
				token: z.string().optional(),
				end_date: z.string().optional(),
				start_date: z.string().optional(),
				active: z.boolean().optional(),
				enabled: z.boolean().optional(),
				masked_api_key: z.string().optional(),
			})
			.passthrough()
			.optional(),
		accounts: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						active: z.boolean().optional(),
						service_period: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.passthrough()
							.optional(),
						friendly_identifier: z.string().optional(),
						admins: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						auth_config: z
							.array(
								z
									.object({
										id: z.string().optional(),
										status: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						sign_in_methods: z
							.array(
								z
									.object({
										mfaStatus: z
											.enum(['enabled', 'disabled'])
											.or(z.string())
											.optional(),
										signInMethod: z
											.enum(['standard', 'sso'])
											.or(z.string())
											.optional(),
										status: z
											.enum(['enabled', 'disabled'])
											.or(z.string())
											.optional(),
										clientAuthCertLoginEnabled: z.boolean().optional(),
									})
									.passthrough(),
							)
							.optional(),
						oauth_clients: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
										status: z
											.enum(['ENABLED', 'DISABLED'])
											.or(z.string())
											.optional(),
										oauthClientId: z.string().optional(),
										oauthClientAccountId: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						locale: z.string().optional(),
						type: z.enum(['standard', 'partner']).or(z.string()).optional(),
						federated_account_id: z.string().optional(),
						packages: z
							.array(
								z
									.object({
										package_code: z.string().optional(),
										application_code: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		applications: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						app_code: z
							.enum([
								'account_manager',
								'ca_manager',
								'device_manager',
								'enterprise_manager',
								'secure_software_manager',
								'document_signing_manager',
							])
							.optional(),
						optional: z.boolean().optional(),
						app_name: z
							.enum([
								'Account',
								'CA',
								'Trust Lifecycle',
								'IOT Trust',
								'Software Trust',
								'Document Trust',
							])
							.optional(),
						icon: z.string().optional(),
						url: z.string().optional(),
						context: z.string().optional(),
						short_app_code: z.string().optional(),
						permissions: z.array(z.string()).optional(),
						roles: z.array(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_fbfdfcedaba1Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.array(z.string()).max(1000).optional(),
	})
	.strict();
const r_fbfdfcedaba1Output = z.array(
	z
		.object({
			id: z.string().optional(),
			user_name: z.string().optional(),
			saml_user_name: z.string().optional(),
			oidc_user_name: z.string().optional(),
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			email: z.string().optional(),
			phone: z.string().optional(),
			status: z
				.enum(['ACTIVE', 'DELETED', 'PENDING', 'LOCKED'])
				.or(z.string())
				.optional(),
			access_scope: z.enum(['account']).or(z.string()).optional(),
			active: z.boolean().optional(),
			primary_account_id: z.string().optional(),
			created_at: z.string().optional(),
			created_by: z.string().optional(),
			user_type: z.enum(['standard', 'service']).or(z.string()).optional(),
			friendly_name: z.string().optional(),
			description: z.string().optional(),
			end_date: z.string().optional(),
			locale: z.string().optional(),
			user_confirmed_lang: z.boolean().optional(),
			disable_api_access_token: z.boolean().optional(),
			disable_cac_upload: z.boolean().optional(),
			applications: z.array(unspecifiedProviderValue()).optional(),
			accounts: z
				.array(
					z
						.object({
							id: z.string().optional(),
							name: z.string().optional(),
							active: z.boolean().optional(),
							service_period: z
								.object({
									from: z.string().optional(),
									to: z.string().optional(),
								})
								.passthrough()
								.optional(),
							friendly_identifier: z.string().optional(),
							admins: z
								.array(
									z
										.object({
											id: z.string().optional(),
											name: z.string().optional(),
											email: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							auth_config: z
								.array(
									z
										.object({
											id: z.string().optional(),
											status: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							sign_in_methods: z
								.array(
									z
										.object({
											mfaStatus: z
												.enum(['enabled', 'disabled'])
												.or(z.string())
												.optional(),
											signInMethod: z
												.enum(['standard', 'sso'])
												.or(z.string())
												.optional(),
											status: z
												.enum(['enabled', 'disabled'])
												.or(z.string())
												.optional(),
											clientAuthCertLoginEnabled: z.boolean().optional(),
										})
										.passthrough(),
								)
								.optional(),
							oauth_clients: z
								.array(
									z
										.object({
											id: z.string().optional(),
											name: z.string().optional(),
											status: z
												.enum(['ENABLED', 'DISABLED'])
												.or(z.string())
												.optional(),
											oauthClientId: z.string().optional(),
											oauthClientAccountId: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							locale: z.string().optional(),
							type: z.enum(['standard', 'partner']).or(z.string()).optional(),
							federated_account_id: z.string().optional(),
							packages: z
								.array(
									z
										.object({
											package_code: z.string().optional(),
											application_code: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_97a1d92f48f0Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.string().optional(),
				user_type: z.enum(['service', 'standard']).optional(),
				user_name: z.string().optional(),
				email: z.string().optional(),
				status: z
					.enum(['active', 'disabled', 'pending', 'locked', 'deleted'])
					.optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_97a1d92f48f0Output = z.array(
	z
		.object({
			id: z.string().optional(),
			user_name: z.string().optional(),
			saml_user_name: z.string().optional(),
			oidc_user_name: z.string().optional(),
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			email: z.string().optional(),
			phone: z.string().optional(),
			status: z
				.enum(['ACTIVE', 'DELETED', 'PENDING', 'LOCKED'])
				.or(z.string())
				.optional(),
			access_scope: z.enum(['account']).or(z.string()).optional(),
			active: z.boolean().optional(),
			primary_account_id: z.string().optional(),
			created_at: z.string().optional(),
			created_by: z.string().optional(),
			user_type: z.enum(['standard', 'service']).or(z.string()).optional(),
			friendly_name: z.string().optional(),
			description: z.string().optional(),
			end_date: z.string().optional(),
			locale: z.string().optional(),
			user_confirmed_lang: z.boolean().optional(),
			disable_api_access_token: z.boolean().optional(),
			disable_cac_upload: z.boolean().optional(),
			applications: z.array(unspecifiedProviderValue()).optional(),
			accounts: z
				.array(
					z
						.object({
							id: z.string().optional(),
							name: z.string().optional(),
							active: z.boolean().optional(),
							service_period: z
								.object({
									from: z.string().optional(),
									to: z.string().optional(),
								})
								.passthrough()
								.optional(),
							friendly_identifier: z.string().optional(),
							admins: z
								.array(
									z
										.object({
											id: z.string().optional(),
											name: z.string().optional(),
											email: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							auth_config: z
								.array(
									z
										.object({
											id: z.string().optional(),
											status: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							sign_in_methods: z
								.array(
									z
										.object({
											mfaStatus: z
												.enum(['enabled', 'disabled'])
												.or(z.string())
												.optional(),
											signInMethod: z
												.enum(['standard', 'sso'])
												.or(z.string())
												.optional(),
											status: z
												.enum(['enabled', 'disabled'])
												.or(z.string())
												.optional(),
											clientAuthCertLoginEnabled: z.boolean().optional(),
										})
										.passthrough(),
								)
								.optional(),
							oauth_clients: z
								.array(
									z
										.object({
											id: z.string().optional(),
											name: z.string().optional(),
											status: z
												.enum(['ENABLED', 'DISABLED'])
												.or(z.string())
												.optional(),
											oauthClientId: z.string().optional(),
											oauthClientAccountId: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							locale: z.string().optional(),
							type: z.enum(['standard', 'partner']).or(z.string()).optional(),
							federated_account_id: z.string().optional(),
							packages: z
								.array(
									z
										.object({
											package_code: z.string().optional(),
											application_code: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_40f39944750fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				user_type: z.enum(['standard', 'service']).optional(),
				user_name: z.string(),
				first_name: z.string(),
				last_name: z.string(),
				end_date: z.string().optional(),
				friendly_name: z.string().max(255),
				roles: z.array(z.string()),
				permissions: z.array(z.string()).optional(),
				description: z.string().max(255).optional(),
				accounts: z.array(z.string()),
				email: z.string().max(255),
				locale: z.string().optional(),
				phone_number: z.string().optional(),
				password: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_40f39944750fOutput = z
	.object({
		id: z.string().optional(),
		email: z.string().optional(),
		status: z
			.enum(['ACTIVE', 'DELETED', 'PENDING', 'LOCKED'])
			.or(z.string())
			.optional(),
		access_scope: z.enum(['account']).or(z.string()).optional(),
		primary_account_id: z.string().optional(),
		created_at: z.string().optional(),
		friendly_name: z.string().optional(),
		description: z.string().optional(),
		end_date: z.string().optional(),
		api_token: z
			.object({
				id: z.string().optional(),
				user_id: z.string().optional(),
				name: z.string().optional(),
				token: z.string().optional(),
				end_date: z.string().optional(),
				start_date: z.string().optional(),
				active: z.boolean().optional(),
				enabled: z.boolean().optional(),
				masked_api_key: z.string().optional(),
			})
			.passthrough()
			.optional(),
		accounts: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						active: z.boolean().optional(),
						service_period: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.passthrough()
							.optional(),
						friendly_identifier: z.string().optional(),
						admins: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						auth_config: z
							.array(
								z
									.object({
										id: z.string().optional(),
										status: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						sign_in_methods: z
							.array(
								z
									.object({
										mfaStatus: z
											.enum(['enabled', 'disabled'])
											.or(z.string())
											.optional(),
										signInMethod: z
											.enum(['standard', 'sso'])
											.or(z.string())
											.optional(),
										status: z
											.enum(['enabled', 'disabled'])
											.or(z.string())
											.optional(),
										clientAuthCertLoginEnabled: z.boolean().optional(),
									})
									.passthrough(),
							)
							.optional(),
						oauth_clients: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
										status: z
											.enum(['ENABLED', 'DISABLED'])
											.or(z.string())
											.optional(),
										oauthClientId: z.string().optional(),
										oauthClientAccountId: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						locale: z.string().optional(),
						type: z.enum(['standard', 'partner']).or(z.string()).optional(),
						federated_account_id: z.string().optional(),
						packages: z
							.array(
								z
									.object({
										package_code: z.string().optional(),
										application_code: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		applications: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						app_code: z
							.enum([
								'account_manager',
								'ca_manager',
								'device_manager',
								'enterprise_manager',
								'secure_software_manager',
								'document_signing_manager',
							])
							.optional(),
						optional: z.boolean().optional(),
						app_name: z
							.enum([
								'Account',
								'CA',
								'Trust Lifecycle',
								'IOT Trust',
								'Software Trust',
								'Document Trust',
							])
							.optional(),
						icon: z.string().optional(),
						url: z.string().optional(),
						context: z.string().optional(),
						short_app_code: z.string().optional(),
						permissions: z.array(z.string()).optional(),
						roles: z.array(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_b224a0eca017Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				application_code: z
					.enum([
						'account_manager',
						'ca_manager',
						'device_manager',
						'document_signing_manager',
						'enterprise_manager',
						'secure_software_manager',
					])
					.optional(),
				account_id: z.string().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b224a0eca017Output = z
	.object({
		ca_manager: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						display_name: z.string().optional(),
						description: z.string().optional(),
						type: z.string().optional(),
						status: z.enum(['ACTIVE', 'ARCHIVED']).or(z.string()).optional(),
						access_scope: z.enum(['account']).or(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		account_manager: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						display_name: z.string().optional(),
						description: z.string().optional(),
						type: z.string().optional(),
						status: z.enum(['ACTIVE', 'ARCHIVED']).or(z.string()).optional(),
						access_scope: z.enum(['account']).or(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		secure_software_manager: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						display_name: z.string().optional(),
						description: z.string().optional(),
						type: z.string().optional(),
						status: z.enum(['ACTIVE', 'ARCHIVED']).or(z.string()).optional(),
						access_scope: z.enum(['account']).or(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		enterprise_manager: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						display_name: z.string().optional(),
						description: z.string().optional(),
						type: z.string().optional(),
						status: z.enum(['ACTIVE', 'ARCHIVED']).or(z.string()).optional(),
						access_scope: z.enum(['account']).or(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		device_manager: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						display_name: z.string().optional(),
						description: z.string().optional(),
						type: z.string().optional(),
						status: z.enum(['ACTIVE', 'ARCHIVED']).or(z.string()).optional(),
						access_scope: z.enum(['account']).or(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		document_signing_manager: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						display_name: z.string().optional(),
						description: z.string().optional(),
						type: z.string().optional(),
						status: z.enum(['ACTIVE', 'ARCHIVED']).or(z.string()).optional(),
						access_scope: z.enum(['account']).or(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		device_trust_manager: z
			.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						display_name: z.string().optional(),
						description: z.string().optional(),
						type: z.string().optional(),
						status: z.enum(['ACTIVE', 'ARCHIVED']).or(z.string()).optional(),
						access_scope: z.enum(['account']).or(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_d37ec173c239Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_d37ec173c239Output = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							active: z.boolean().optional(),
							blob: z.string().optional(),
							ca: z
								.object({
									id: z.string().optional(),
									name: z.string().optional(),
								})
								.passthrough()
								.optional(),
							created_date: z.string().optional(),
							file_format: z.string().optional(),
							file_name: z.string().optional(),
							file_path: z.string().optional(),
							id: z.string().optional(),
							is_aia_file_warning: z.boolean().optional(),
							updated_date: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_836448818f1bInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_836448818f1bOutput = z
	.object({
		active: z.boolean().optional(),
		blob: z.string().optional(),
		ca: z
			.object({ id: z.string().optional(), name: z.string().optional() })
			.passthrough()
			.optional(),
		created_date: z.string().optional(),
		file_format: z.string().optional(),
		file_name: z.string().optional(),
		file_path: z.string().optional(),
		id: z.string().optional(),
		is_aia_file_warning: z.boolean().optional(),
		updated_date: z.string().optional(),
	})
	.passthrough();
const r_450b135c4c8bInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_450b135c4c8bOutput = z
	.object({
		active: z.boolean().optional(),
		blob: z.string().optional(),
		ca: z
			.object({ id: z.string().optional(), name: z.string().optional() })
			.passthrough()
			.optional(),
		created_date: z.string().optional(),
		file_format: z.string().optional(),
		file_name: z.string().optional(),
		file_path: z.string().optional(),
		id: z.string().optional(),
		is_aia_file_warning: z.boolean().optional(),
		updated_date: z.string().optional(),
	})
	.passthrough();
const r_a497c207ff38Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a497c207ff38Output = z.number().int();
const r_4413aec93603Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				active: z.boolean().optional(),
				blob: z.string().optional(),
				ca: z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough()
					.optional(),
				created_date: z.string().optional(),
				file_format: z.string().optional(),
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
				is_aia_file_warning: z.boolean().optional(),
				updated_date: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_4413aec93603Output = z.undefined();
const r_d2466ae03b22Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_d2466ae03b22Output = z
	.object({ enabled: z.boolean().optional(), script: z.string().optional() })
	.passthrough();
const r_7edc4cabae54Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_7edc4cabae54Output = z
	.object({ message: z.string().optional() })
	.passthrough();
const r_ca00d8bde2a5Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ca00d8bde2a5Output = z
	.object({
		createdAt: z.string().optional(),
		enabled: z.boolean().optional(),
		id: z.string().optional(),
		idpEntityId: z.string().optional(),
		idpMetadataUrl: z.string().optional(),
		idpSsoUrl: z.string().optional(),
		roleMappingJson: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.passthrough();
const r_5f4fc2d8f440Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				enabled: z.boolean().optional(),
				idpCertificate: z.string(),
				idpEntityId: z.string(),
				idpMetadataUrl: z.string().optional(),
				idpMetadataXml: z.string(),
				idpSloUrl: z.string().optional(),
				idpSsoUrl: z.string(),
				roleMappingJson: z.string().optional(),
				spAcsUrl: z.string(),
				spEntityId: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_5f4fc2d8f440Output = z
	.object({ message: z.string().optional() })
	.passthrough();
const r_30806dc12876Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				metadataUrl: z.string().optional(),
				metadataXml: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_30806dc12876Output = z
	.object({
		certificate: z.string().optional(),
		entityId: z.string().optional(),
		metadataXml: z.string().optional(),
		ssoUrl: z.string().optional(),
	})
	.passthrough();
const r_9cd2e581f2a1Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.number().int().optional(),
				limit: z.number().int().optional(),
				from_date: z.string().optional(),
				to_date: z.string().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_9cd2e581f2a1Output = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							account_id: z.string().optional(),
							action: z.string().optional(),
							created_date: z.string().optional(),
							data: z.string().optional(),
							description: z.string().optional(),
							error_message: z.string().optional(),
							id: z.string().optional(),
							resource_id: z.string().optional(),
							resource_type: z.string().optional(),
							status: z.string().optional(),
							user_id: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_35f6309030acInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ SAMLResponse: z.string(), RelayState: z.string().optional() })
			.passthrough(),
	})
	.strict();
const r_35f6309030acOutput = unspecifiedProviderValue();
const r_6ab53e3e6059Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_6ab53e3e6059Output = z
	.object({ enabled: z.boolean().optional() })
	.passthrough();
const r_a48e8840fc8cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ RelayState: z.string().optional() }).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a48e8840fc8cOutput = unspecifiedProviderValue();
const r_9e9cfb59b47aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_9e9cfb59b47aOutput = z
	.object({ message: z.string().optional() })
	.passthrough();
const r_b4af3ae8430dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b4af3ae8430dOutput = z.string();
const r_2053c0b686d7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ SAMLRequest: z.string() }).passthrough(),
	})
	.strict();
const r_2053c0b686d7Output = z.string();
const r_419129d1877aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_419129d1877aOutput = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							account_assignments: z
								.array(
									z
										.object({
											id: z.string().optional(),
											name: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							active_aia_issuer: z
								.object({
									file_name: z.string().optional(),
									id: z.string().optional(),
								})
								.passthrough()
								.optional(),
							active_arl: z
								.object({
									file_name: z.string().optional(),
									file_path: z.string().optional(),
									id: z.string().optional(),
								})
								.passthrough()
								.optional(),
							active_crl: z
								.object({
									file_name: z.string().optional(),
									file_path: z.string().optional(),
									id: z.string().optional(),
								})
								.passthrough()
								.optional(),
							active_crl_cdps: z
								.object({ cdps: z.array(z.string()).optional() })
								.passthrough()
								.optional(),
							active_eerl: z
								.object({
									file_name: z.string().optional(),
									file_path: z.string().optional(),
									id: z.string().optional(),
								})
								.passthrough()
								.optional(),
							allow_unmatched_cdp: z.boolean().optional(),
							blob: z.string().optional(),
							ca_type: z.string().optional(),
							cert_type: z.string().optional(),
							configuration: z
								.object({
									aia_issuer: z
										.object({
											domains: z
												.array(
													z
														.object({
															accounts: z
																.array(
																	z
																		.object({
																			id: z.string().optional(),
																			name: z.string().optional(),
																		})
																		.passthrough(),
																)
																.optional(),
															active: z.boolean().optional(),
															created_date: z.string().optional(),
															id: z.string().optional(),
															name: z.string().optional(),
															scheme: z
																.enum(['http', 'https', 'ldap'])
																.optional(),
															type: z.array(z.string()).optional(),
														})
														.passthrough(),
												)
												.optional(),
											include: z.string().optional(),
											override_global: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									allow_extended_validity: z.boolean().optional(),
									allow_pkcs7_operations: z.boolean().optional(),
									allowed_signature_algorithms: z.array(z.string()).optional(),
									available_signature_algorithms: z
										.array(z.string())
										.optional(),
									certificate_policies: z
										.object({
											allowed_sources: z.array(z.string()).optional(),
											default_policies: z
												.object({
													critical: z.boolean().optional(),
													policies: z
														.array(
															z
																.object({
																	cps_uri: z.string().optional(),
																	oid: z.string().optional(),
																	user_notice: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
												})
												.passthrough()
												.optional(),
											include: z.string().optional(),
											override_global: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									chains: z
										.array(
											z
												.object({
													certificates: z
														.array(
															z
																.object({
																	blob: z.string().optional(),
																	cert_type: z.string().optional(),
																	subject: z
																		.object({
																			common_name: z.string().optional(),
																			country: z.string().optional(),
																			custom_attributes: z
																				.array(
																					z
																						.object({
																							oid: z.string().optional(),
																							type: z.string().optional(),
																							values: z
																								.array(z.string())
																								.optional(),
																						})
																						.passthrough(),
																				)
																				.optional(),
																			description: z
																				.array(z.string())
																				.optional(),
																			dn_qualifier: z.string().optional(),
																			domain_component: z
																				.array(z.string())
																				.optional(),
																			email: z.string().optional(),
																			given_name: z
																				.array(z.string())
																				.optional(),
																			locality: z.string().optional(),
																			organization_identifier: z
																				.string()
																				.optional(),
																			organization_name: z.string().optional(),
																			organization_units: z
																				.array(z.string())
																				.optional(),
																			postal_code: z.string().optional(),
																			product_identifier: z.string().optional(),
																			pseudonym: z.string().optional(),
																			serial_number: z.string().optional(),
																			state: z.string().optional(),
																			street_address: z
																				.array(z.string())
																				.optional(),
																			subject_order: z
																				.array(z.string())
																				.optional(),
																			surname: z.array(z.string()).optional(),
																			title: z.array(z.string()).optional(),
																			unique_identifier: z.string().optional(),
																			unstructured_address: z
																				.array(z.string())
																				.optional(),
																			unstructured_name: z
																				.array(z.string())
																				.optional(),
																			user_identifier: z.string().optional(),
																			vendor_identifier: z.string().optional(),
																		})
																		.passthrough()
																		.optional(),
																})
																.passthrough(),
														)
														.optional(),
													default: z.boolean().optional(),
													id: z.string().optional(),
													name: z.string().optional(),
												})
												.passthrough(),
										)
										.optional(),
									crl: z
										.object({
											domains: z
												.array(
													z
														.object({
															accounts: z
																.array(
																	z
																		.object({
																			id: z.string().optional(),
																			name: z.string().optional(),
																		})
																		.passthrough(),
																)
																.optional(),
															active: z.boolean().optional(),
															created_date: z.string().optional(),
															id: z.string().optional(),
															name: z.string().optional(),
															scheme: z
																.enum(['http', 'https', 'ldap'])
																.optional(),
															type: z.array(z.string()).optional(),
														})
														.passthrough(),
												)
												.optional(),
											end_validity_years: z.number().int().optional(),
											include: z.string().optional(),
											override_global: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									include_all_certificates_in_crl: z.boolean().optional(),
									issue_end_entities: z.boolean().optional(),
									issue_ica_intermediates: z.boolean().optional(),
									issue_types: z.array(z.string()).optional(),
									issue_unmanaged_ca: z.boolean().optional(),
									ocsp: z
										.object({
											domains: z
												.array(
													z
														.object({
															accounts: z
																.array(
																	z
																		.object({
																			id: z.string().optional(),
																			name: z.string().optional(),
																		})
																		.passthrough(),
																)
																.optional(),
															active: z.boolean().optional(),
															created_date: z.string().optional(),
															id: z.string().optional(),
															name: z.string().optional(),
															scheme: z
																.enum(['http', 'https', 'ldap'])
																.optional(),
															type: z.array(z.string()).optional(),
														})
														.passthrough(),
												)
												.optional(),
											include: z.string().optional(),
											override_global: z.boolean().optional(),
											uri_path: z.string().optional(),
										})
										.passthrough()
										.optional(),
									ocsp_responder: z
										.object({
											certificate_policies: z
												.array(
													z
														.object({
															cps_uri: z.string().optional(),
															oid: z.string().optional(),
															user_notice: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											certificate_template: z
												.object({
													access: z.string().optional(),
													accounts: z
														.array(
															z
																.object({
																	id: z.string().optional(),
																	name: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
													active: z.boolean().optional(),
													category: z.string().optional(),
													cert_type: z
														.enum(['root', 'intermediate', 'end_entity'])
														.optional(),
													created_date: z.string().optional(),
													id: z.string().optional(),
													install_type: z.string().optional(),
													issue_types: z.array(z.string()).optional(),
													kind: z.string().optional(),
													name: z.string().optional(),
													template_json: z.string().optional(),
													trust_type: z.string().optional(),
													updated_date: z.string().optional(),
												})
												.passthrough()
												.optional(),
											delete_expired_responders: z.boolean().optional(),
											generation_enabled: z.boolean().optional(),
											hsm_partition: z
												.object({
													display_name: z.string().optional(),
													id: z.string().optional(),
													partition_name: z.string().optional(),
													provider_name: z.string().optional(),
													security_level: z
														.enum(['level_1', 'level_2', 'level_3', 'level_4'])
														.optional(),
												})
												.passthrough()
												.optional(),
											override_global: z.boolean().optional(),
											responder_create_within_days: z.number().int().optional(),
											responder_validity_days: z.number().int().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough()
								.optional(),
							create_default_aia_issuer: z.boolean().optional(),
							create_default_crl: z.boolean().optional(),
							create_preview_cert: z.boolean().optional(),
							csr: z.string().optional(),
							exportable: z.boolean().optional(),
							extensions: z
								.object({
									adobe_archive_rev_info: z
										.object({ version: z.number().int().optional() })
										.passthrough()
										.optional(),
									adobe_timestamp: z
										.object({
											location: z.string().optional(),
											requires_auth: z.boolean().optional(),
											version: z.number().int().optional(),
										})
										.passthrough()
										.optional(),
									aia: z
										.object({ issuer_urls: z.array(z.string()).optional() })
										.passthrough()
										.optional(),
									aki: z
										.object({
											authority_name_serial_number: z.boolean().optional(),
											include: z.string().optional(),
											key_identifier: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									basic_constraints: z
										.object({
											ca: z.boolean().optional(),
											critical: z.boolean().optional(),
											path_length: z.number().int().optional(),
										})
										.passthrough()
										.optional(),
									cabf_organization_identifier: z
										.object({
											country: z.string().optional(),
											reference: z.string().optional(),
											scheme: z.string().optional(),
											state: z.string().optional(),
										})
										.passthrough()
										.optional(),
									cdp: z
										.object({ urls: z.array(z.string()).optional() })
										.passthrough()
										.optional(),
									certificate_policies: z
										.array(
											z
												.object({
													cps_uri: z.string().optional(),
													oid: z.string().optional(),
													user_notice: z.string().optional(),
												})
												.passthrough(),
										)
										.optional(),
									extended_key_usage: z
										.object({
											additional_values: z.array(z.string()).optional(),
											critical: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									extensions_order: z.array(z.string()).optional(),
									issuer_alt_name: z
										.object({
											directory_names: z
												.array(
													z
														.object({
															common_name: z.string().optional(),
															country: z.string().optional(),
															custom_attributes: z
																.array(
																	z
																		.object({
																			oid: z.string().optional(),
																			type: z.string().optional(),
																			values: z.array(z.string()).optional(),
																		})
																		.passthrough(),
																)
																.optional(),
															description: z.array(z.string()).optional(),
															dn_qualifier: z.string().optional(),
															domain_component: z.array(z.string()).optional(),
															email: z.string().optional(),
															given_name: z.array(z.string()).optional(),
															locality: z.string().optional(),
															organization_identifier: z.string().optional(),
															organization_name: z.string().optional(),
															organization_units: z
																.array(z.string())
																.optional(),
															postal_code: z.string().optional(),
															product_identifier: z.string().optional(),
															pseudonym: z.string().optional(),
															serial_number: z.string().optional(),
															state: z.string().optional(),
															street_address: z.array(z.string()).optional(),
															subject_order: z.array(z.string()).optional(),
															surname: z.array(z.string()).optional(),
															title: z.array(z.string()).optional(),
															unique_identifier: z.string().optional(),
															unstructured_address: z
																.array(z.string())
																.optional(),
															unstructured_name: z.array(z.string()).optional(),
															user_identifier: z.string().optional(),
															vendor_identifier: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											dns_names: z.array(z.string()).optional(),
											emails: z.array(z.string()).optional(),
											ip_addresses: z.array(z.string()).optional(),
											other_names: z
												.object({
													domain_controller_id: z.array(z.string()).optional(),
													guid: z.array(z.string()).optional(),
													hardware_module_name: z
														.array(
															z
																.object({
																	serial_num: z
																		.array(z.number().int())
																		.optional(),
																	type: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
													raw_other_names: z
														.array(
															z
																.object({
																	oid: z.string().optional(),
																	value: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
												})
												.passthrough()
												.optional(),
											uris: z.array(z.string()).optional(),
											user_principal_names: z.array(z.string()).optional(),
										})
										.passthrough()
										.optional(),
									key_usage: z
										.object({
											additional_values: z.array(z.string()).optional(),
											critical: z.boolean().optional(),
											skip_validation: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									lei: z
										.object({ value: z.string().optional() })
										.passthrough()
										.optional(),
									lei_role: z
										.object({ value: z.string().optional() })
										.passthrough()
										.optional(),
									microsoft_application_certificate_policies: z
										.object({
											additional_values: z.array(z.string()).optional(),
											critical: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									microsoft_certificate_template_name: z.string().optional(),
									microsoft_certificate_template_v2: z
										.object({
											major_version: z.number().int().optional(),
											minor_version: z.number().int().optional(),
											oid: z.string().optional(),
										})
										.passthrough()
										.optional(),
									private_key_usage_period: z
										.object({
											critical: unspecifiedProviderValue().optional(),
											not_after: z.string().optional(),
											not_before: z.string().optional(),
										})
										.passthrough()
										.optional(),
									qc_statements: z
										.object({
											critical: z.boolean().optional(),
											'etsi-psd2-qcStatement': z.array(z.string()).optional(),
											'id-etsi-qcs-QcPDS': z
												.array(
													z
														.object({
															language: z.string().optional(),
															uri: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											'id-etsi-qcs-QcRetentionPeriod': z
												.number()
												.int()
												.optional(),
											'id-etsi-qcs-QcType': z.array(z.string()).optional(),
											'id-qcs-pkixQCSyntax-v2': z
												.object({ semantics_id: z.string().optional() })
												.passthrough()
												.optional(),
											oids: z.array(z.string()).optional(),
										})
										.passthrough()
										.optional(),
									san: z
										.object({
											directory_names: z
												.array(
													z
														.object({
															common_name: z.string().optional(),
															country: z.string().optional(),
															custom_attributes: z
																.array(
																	z
																		.object({
																			oid: z.string().optional(),
																			type: z.string().optional(),
																			values: z.array(z.string()).optional(),
																		})
																		.passthrough(),
																)
																.optional(),
															description: z.array(z.string()).optional(),
															dn_qualifier: z.string().optional(),
															domain_component: z.array(z.string()).optional(),
															email: z.string().optional(),
															given_name: z.array(z.string()).optional(),
															locality: z.string().optional(),
															organization_identifier: z.string().optional(),
															organization_name: z.string().optional(),
															organization_units: z
																.array(z.string())
																.optional(),
															postal_code: z.string().optional(),
															product_identifier: z.string().optional(),
															pseudonym: z.string().optional(),
															serial_number: z.string().optional(),
															state: z.string().optional(),
															street_address: z.array(z.string()).optional(),
															subject_order: z.array(z.string()).optional(),
															surname: z.array(z.string()).optional(),
															title: z.array(z.string()).optional(),
															unique_identifier: z.string().optional(),
															unstructured_address: z
																.array(z.string())
																.optional(),
															unstructured_name: z.array(z.string()).optional(),
															user_identifier: z.string().optional(),
															vendor_identifier: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											dns_names: z.array(z.string()).optional(),
											emails: z.array(z.string()).optional(),
											ip_addresses: z.array(z.string()).optional(),
											other_names: z
												.object({
													domain_controller_id: z.array(z.string()).optional(),
													guid: z.array(z.string()).optional(),
													hardware_module_name: z
														.array(
															z
																.object({
																	serial_num: z
																		.array(z.number().int())
																		.optional(),
																	type: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
													raw_other_names: z
														.array(
															z
																.object({
																	oid: z.string().optional(),
																	value: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
												})
												.passthrough()
												.optional(),
											uris: z.array(z.string()).optional(),
											user_principal_names: z.array(z.string()).optional(),
										})
										.passthrough()
										.optional(),
									security_identifier: z
										.array(
											z
												.object({
													oid: z.string().optional(),
													value: z.string().optional(),
												})
												.passthrough(),
										)
										.optional(),
									ski: z
										.object({
											include: z.string().optional(),
											method: z.string().optional(),
										})
										.passthrough()
										.optional(),
									ski_extension: z.string().optional(),
									smime_capabilities: z
										.object({ values: z.array(z.string()).optional() })
										.passthrough()
										.optional(),
									subject_directory_attributes: z
										.object({
											encoded_value: z.array(z.number().int()).optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough()
								.optional(),
							hosted_type: z
								.enum(['online', 'offline', 'external', 'third_party'])
								.optional(),
							hsm_key_label: z.string().optional(),
							hsm_partition: z
								.object({
									display_name: z.string().optional(),
									id: z.string().optional(),
									partition_name: z.string().optional(),
									provider_name: z.string().optional(),
									security_level: z
										.enum(['level_1', 'level_2', 'level_3', 'level_4'])
										.optional(),
								})
								.passthrough()
								.optional(),
							id: z.string().optional(),
							is_composite_ca: z.boolean().optional(),
							issue_types: z.array(z.string()).optional(),
							issuer: z
								.object({
									hosted_type: z
										.enum(['online', 'offline', 'third_party'])
										.optional(),
									id: z.string().optional(),
									name: z.string().optional(),
									valid_from: z.string().optional(),
									valid_to: z.string().optional(),
								})
								.passthrough()
								.optional(),
							key_generation: z
								.object({
									dilithium_key_size: z.string().optional(),
									ecc_curve: z.string().optional(),
									ecdsa_curve: z.string().optional(),
									falcon_key_size: z.string().optional(),
									key_type: z.string().optional(),
									rsa_key_bits: z.number().int().optional(),
									sphincs_key_size: z.string().optional(),
								})
								.passthrough()
								.optional(),
							key_type: z.enum(['rsa', 'ecc']).or(z.string()).optional(),
							name: z.string().optional(),
							notification: z
								.object({
									enabled: z.boolean().optional(),
									frequency: z.array(z.number().int()).optional(),
									recipients: z.array(z.string()).optional(),
								})
								.passthrough()
								.optional(),
							number_of_ica: z.number().int().optional(),
							pem: z.string().optional(),
							private_key: z
								.object({
									password: z.string().optional(),
									pkcs12: z.array(z.number().int()).optional(),
									pre_installed: z.boolean().optional(),
								})
								.passthrough()
								.optional(),
							recertification_links: z
								.array(
									z
										.object({
											created_date: z.string().optional(),
											link_type: z.string().optional(),
											linked_ca: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							reinstate_requests: z
								.array(
									z
										.object({
											comments: z.string().optional(),
											id: z.string().optional(),
											requester_user_id: z.string().optional(),
											requester_username: z.string().optional(),
											reviewer_user_id: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							revocation: z
								.object({
									comments: z.string().optional(),
									reason: z.string().optional(),
									revoke_date: z.string().optional(),
									revoked: z.boolean().optional(),
								})
								.passthrough()
								.optional(),
							revocation_requests: z
								.array(
									z
										.object({
											comments: z.string().optional(),
											id: z.string().optional(),
											reason: z.string().optional(),
											requester_user_id: z.string().optional(),
											requester_username: z.string().optional(),
											reviewer_user_id: z.string().optional(),
											revocation_date: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							serial_number: z.string().optional(),
							signature_algorithm: z.string().optional(),
							status: z
								.enum(['active', 'pending_sign', 'disabled'])
								.or(z.string())
								.optional(),
							subject: z
								.object({
									common_name: z.string().optional(),
									country: z.string().optional(),
									custom_attributes: z
										.array(
											z
												.object({
													oid: z.string().optional(),
													type: z.string().optional(),
													values: z.array(z.string()).optional(),
												})
												.passthrough(),
										)
										.optional(),
									description: z.array(z.string()).optional(),
									dn_qualifier: z.string().optional(),
									domain_component: z.array(z.string()).optional(),
									email: z.string().optional(),
									given_name: z.array(z.string()).optional(),
									locality: z.string().optional(),
									organization_identifier: z.string().optional(),
									organization_name: z.string().optional(),
									organization_units: z.array(z.string()).optional(),
									postal_code: z.string().optional(),
									product_identifier: z.string().optional(),
									pseudonym: z.string().optional(),
									serial_number: z.string().optional(),
									state: z.string().optional(),
									street_address: z.array(z.string()).optional(),
									subject_order: z.array(z.string()).optional(),
									surname: z.array(z.string()).optional(),
									title: z.array(z.string()).optional(),
									unique_identifier: z.string().optional(),
									unstructured_address: z.array(z.string()).optional(),
									unstructured_name: z.array(z.string()).optional(),
									user_identifier: z.string().optional(),
									vendor_identifier: z.string().optional(),
								})
								.passthrough()
								.optional(),
							template: z.string().optional(),
							template_id: z.string().optional(),
							thumbprint_sha256: z.string().optional(),
							trust_type: z.string().optional(),
							trust_types: z.array(z.string()).optional(),
							validity: z
								.object({
									duration_unit: z.string().optional(),
									duration_value: z.number().int().optional(),
									valid_from: z.string().optional(),
									valid_to: z.string().optional(),
								})
								.passthrough()
								.optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_bb6316690c68Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_assignments: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				active_aia_issuer: z
					.object({
						file_name: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_arl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_crl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_crl_cdps: z
					.object({ cdps: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				active_eerl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				allow_unmatched_cdp: z.boolean().optional(),
				blob: z.string().optional(),
				ca_type: z.string().optional(),
				cert_type: z.string().optional(),
				configuration: z
					.object({
						aia_issuer: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						allow_extended_validity: z.boolean().optional(),
						allow_pkcs7_operations: z.boolean().optional(),
						allowed_signature_algorithms: z.array(z.string()).optional(),
						available_signature_algorithms: z.array(z.string()).optional(),
						certificate_policies: z
							.object({
								allowed_sources: z.array(z.string()).optional(),
								default_policies: z
									.object({
										critical: z.boolean().optional(),
										policies: z
											.array(
												z
													.object({
														cps_uri: z.string().optional(),
														oid: z.string().optional(),
														user_notice: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						chains: z
							.array(
								z
									.object({
										certificates: z
											.array(
												z
													.object({
														blob: z.string().optional(),
														cert_type: z.string().optional(),
														subject: z
															.object({
																common_name: z.string().optional(),
																country: z.string().optional(),
																custom_attributes: z
																	.array(
																		z
																			.object({
																				oid: z.string().optional(),
																				type: z.string().optional(),
																				values: z.array(z.string()).optional(),
																			})
																			.passthrough(),
																	)
																	.optional(),
																description: z.array(z.string()).optional(),
																dn_qualifier: z.string().optional(),
																domain_component: z
																	.array(z.string())
																	.optional(),
																email: z.string().optional(),
																given_name: z.array(z.string()).optional(),
																locality: z.string().optional(),
																organization_identifier: z.string().optional(),
																organization_name: z.string().optional(),
																organization_units: z
																	.array(z.string())
																	.optional(),
																postal_code: z.string().optional(),
																product_identifier: z.string().optional(),
																pseudonym: z.string().optional(),
																serial_number: z.string().optional(),
																state: z.string().optional(),
																street_address: z.array(z.string()).optional(),
																subject_order: z.array(z.string()).optional(),
																surname: z.array(z.string()).optional(),
																title: z.array(z.string()).optional(),
																unique_identifier: z.string().optional(),
																unstructured_address: z
																	.array(z.string())
																	.optional(),
																unstructured_name: z
																	.array(z.string())
																	.optional(),
																user_identifier: z.string().optional(),
																vendor_identifier: z.string().optional(),
															})
															.passthrough()
															.optional(),
													})
													.passthrough(),
											)
											.optional(),
										default: z.boolean().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						crl: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								end_validity_years: z.number().int().optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						include_all_certificates_in_crl: z.boolean().optional(),
						issue_end_entities: z.boolean().optional(),
						issue_ica_intermediates: z.boolean().optional(),
						issue_types: z.array(z.string()).optional(),
						issue_unmanaged_ca: z.boolean().optional(),
						ocsp: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
								uri_path: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ocsp_responder: z
							.object({
								certificate_policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								certificate_template: z
									.object({
										access: z.string().optional(),
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										category: z.string().optional(),
										cert_type: z
											.enum(['root', 'intermediate', 'end_entity'])
											.optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										install_type: z.string().optional(),
										issue_types: z.array(z.string()).optional(),
										kind: z.string().optional(),
										name: z.string().optional(),
										template_json: z.string().optional(),
										trust_type: z.string().optional(),
										updated_date: z.string().optional(),
									})
									.passthrough()
									.optional(),
								delete_expired_responders: z.boolean().optional(),
								generation_enabled: z.boolean().optional(),
								hsm_partition: z
									.object({
										display_name: z.string().optional(),
										id: z.string().optional(),
										partition_name: z.string().optional(),
										provider_name: z.string().optional(),
										security_level: z
											.enum(['level_1', 'level_2', 'level_3', 'level_4'])
											.optional(),
									})
									.passthrough()
									.optional(),
								override_global: z.boolean().optional(),
								responder_create_within_days: z.number().int().optional(),
								responder_validity_days: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				create_default_aia_issuer: z.boolean().optional(),
				create_default_crl: z.boolean().optional(),
				create_preview_cert: z.boolean().optional(),
				csr: z.string().optional(),
				exportable: z.boolean().optional(),
				extensions: z
					.object({
						adobe_archive_rev_info: z
							.object({ version: z.number().int().optional() })
							.passthrough()
							.optional(),
						adobe_timestamp: z
							.object({
								location: z.string().optional(),
								requires_auth: z.boolean().optional(),
								version: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						aia: z
							.object({ issuer_urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						aki: z
							.object({
								authority_name_serial_number: z.boolean().optional(),
								include: z.string().optional(),
								key_identifier: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						basic_constraints: z
							.object({
								ca: z.boolean().optional(),
								critical: z.boolean().optional(),
								path_length: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						cabf_organization_identifier: z
							.object({
								country: z.string().optional(),
								reference: z.string().optional(),
								scheme: z.string().optional(),
								state: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cdp: z
							.object({ urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						extended_key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						extensions_order: z.array(z.string()).optional(),
						issuer_alt_name: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
								skip_validation: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						lei: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						lei_role: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						microsoft_application_certificate_policies: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						microsoft_certificate_template_name: z.string().optional(),
						microsoft_certificate_template_v2: z
							.object({
								major_version: z.number().int().optional(),
								minor_version: z.number().int().optional(),
								oid: z.string().optional(),
							})
							.passthrough()
							.optional(),
						private_key_usage_period: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								not_after: z.string().optional(),
								not_before: z.string().optional(),
							})
							.passthrough()
							.optional(),
						qc_statements: z
							.object({
								critical: z.boolean().optional(),
								'etsi-psd2-qcStatement': z.array(z.string()).optional(),
								'id-etsi-qcs-QcPDS': z
									.array(
										z
											.object({
												language: z.string().optional(),
												uri: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
								'id-etsi-qcs-QcType': z.array(z.string()).optional(),
								'id-qcs-pkixQCSyntax-v2': z
									.object({ semantics_id: z.string().optional() })
									.passthrough()
									.optional(),
								oids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						san: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						ski: z
							.object({
								include: z.string().optional(),
								method: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ski_extension: z.string().optional(),
						smime_capabilities: z
							.object({ values: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						subject_directory_attributes: z
							.object({ encoded_value: z.array(z.number().int()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				hosted_type: z
					.enum(['online', 'offline', 'external', 'third_party'])
					.optional(),
				hsm_key_label: z.string().optional(),
				hsm_partition: z
					.object({
						display_name: z.string().optional(),
						id: z.string().optional(),
						partition_name: z.string().optional(),
						provider_name: z.string().optional(),
						security_level: z
							.enum(['level_1', 'level_2', 'level_3', 'level_4'])
							.optional(),
					})
					.passthrough()
					.optional(),
				id: z.string().optional(),
				is_composite_ca: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issuer: z
					.object({
						hosted_type: z
							.enum(['online', 'offline', 'third_party'])
							.optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_generation: z
					.object({
						dilithium_key_size: z.string().optional(),
						ecc_curve: z.string().optional(),
						ecdsa_curve: z.string().optional(),
						falcon_key_size: z.string().optional(),
						key_type: z.string().optional(),
						rsa_key_bits: z.number().int().optional(),
						sphincs_key_size: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_type: z.enum(['rsa', 'ecc']).optional(),
				name: z.string().optional(),
				notification: z
					.object({
						enabled: z.boolean().optional(),
						frequency: z.array(z.number().int()).optional(),
						recipients: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				number_of_ica: z.number().int().optional(),
				pem: z.string().optional(),
				private_key: z
					.object({
						password: z.string().optional(),
						pkcs12: z.array(z.number().int()).optional(),
						pre_installed: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				recertification_links: z
					.array(
						z
							.object({
								created_date: z.string().optional(),
								link_type: z.string().optional(),
								linked_ca: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				reinstate_requests: z
					.array(
						z
							.object({
								comments: z.string().optional(),
								id: z.string().optional(),
								requester_user_id: z.string().optional(),
								requester_username: z.string().optional(),
								reviewer_user_id: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				revocation: z
					.object({
						comments: z.string().optional(),
						reason: z.string().optional(),
						revoke_date: z.string().optional(),
						revoked: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				revocation_requests: z
					.array(
						z
							.object({
								comments: z.string().optional(),
								id: z.string().optional(),
								reason: z.string().optional(),
								requester_user_id: z.string().optional(),
								requester_username: z.string().optional(),
								reviewer_user_id: z.string().optional(),
								revocation_date: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				serial_number: z.string().optional(),
				signature_algorithm: z.string().optional(),
				status: z.enum(['active', 'pending_sign', 'disabled']).optional(),
				subject: z
					.object({
						common_name: z.string().optional(),
						country: z.string().optional(),
						custom_attributes: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										type: z.string().optional(),
										values: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						description: z.array(z.string()).optional(),
						dn_qualifier: z.string().optional(),
						domain_component: z.array(z.string()).optional(),
						email: z.string().optional(),
						given_name: z.array(z.string()).optional(),
						locality: z.string().optional(),
						organization_identifier: z.string().optional(),
						organization_name: z.string().optional(),
						organization_units: z.array(z.string()).optional(),
						postal_code: z.string().optional(),
						product_identifier: z.string().optional(),
						pseudonym: z.string().optional(),
						serial_number: z.string().optional(),
						state: z.string().optional(),
						street_address: z.array(z.string()).optional(),
						subject_order: z.array(z.string()).optional(),
						surname: z.array(z.string()).optional(),
						title: z.array(z.string()).optional(),
						unique_identifier: z.string().optional(),
						unstructured_address: z.array(z.string()).optional(),
						unstructured_name: z.array(z.string()).optional(),
						user_identifier: z.string().optional(),
						vendor_identifier: z.string().optional(),
					})
					.passthrough()
					.optional(),
				template: z.string().optional(),
				template_id: z.string().optional(),
				thumbprint_sha256: z.string().optional(),
				trust_type: z.string().optional(),
				trust_types: z.array(z.string()).optional(),
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_bb6316690c68Output = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active_aia_issuer: z
			.object({ file_name: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		active_arl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl_cdps: z
			.object({ cdps: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
		active_eerl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		allow_unmatched_cdp: z.boolean().optional(),
		blob: z.string().optional(),
		ca_type: z.string().optional(),
		cert_type: z.string().optional(),
		configuration: z
			.object({
				aia_issuer: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				allow_extended_validity: z.boolean().optional(),
				allow_pkcs7_operations: z.boolean().optional(),
				allowed_signature_algorithms: z.array(z.string()).optional(),
				available_signature_algorithms: z.array(z.string()).optional(),
				certificate_policies: z
					.object({
						allowed_sources: z.array(z.string()).optional(),
						default_policies: z
							.object({
								critical: z.boolean().optional(),
								policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				chains: z
					.array(
						z
							.object({
								certificates: z
									.array(
										z
											.object({
												blob: z.string().optional(),
												cert_type: z.string().optional(),
												subject: z
													.object({
														common_name: z.string().optional(),
														country: z.string().optional(),
														custom_attributes: z
															.array(
																z
																	.object({
																		oid: z.string().optional(),
																		type: z.string().optional(),
																		values: z.array(z.string()).optional(),
																	})
																	.passthrough(),
															)
															.optional(),
														description: z.array(z.string()).optional(),
														dn_qualifier: z.string().optional(),
														domain_component: z.array(z.string()).optional(),
														email: z.string().optional(),
														given_name: z.array(z.string()).optional(),
														locality: z.string().optional(),
														organization_identifier: z.string().optional(),
														organization_name: z.string().optional(),
														organization_units: z.array(z.string()).optional(),
														postal_code: z.string().optional(),
														product_identifier: z.string().optional(),
														pseudonym: z.string().optional(),
														serial_number: z.string().optional(),
														state: z.string().optional(),
														street_address: z.array(z.string()).optional(),
														subject_order: z.array(z.string()).optional(),
														surname: z.array(z.string()).optional(),
														title: z.array(z.string()).optional(),
														unique_identifier: z.string().optional(),
														unstructured_address: z
															.array(z.string())
															.optional(),
														unstructured_name: z.array(z.string()).optional(),
														user_identifier: z.string().optional(),
														vendor_identifier: z.string().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								default: z.boolean().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				crl: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						end_validity_years: z.number().int().optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				include_all_certificates_in_crl: z.boolean().optional(),
				issue_end_entities: z.boolean().optional(),
				issue_ica_intermediates: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issue_unmanaged_ca: z.boolean().optional(),
				ocsp: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
						uri_path: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ocsp_responder: z
					.object({
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						certificate_template: z
							.object({
								access: z.string().optional(),
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								category: z.string().optional(),
								cert_type: z
									.enum(['root', 'intermediate', 'end_entity'])
									.optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								install_type: z.string().optional(),
								issue_types: z.array(z.string()).optional(),
								kind: z.string().optional(),
								name: z.string().optional(),
								template_json: z.string().optional(),
								trust_type: z.string().optional(),
								updated_date: z.string().optional(),
							})
							.passthrough()
							.optional(),
						delete_expired_responders: z.boolean().optional(),
						generation_enabled: z.boolean().optional(),
						hsm_partition: z
							.object({
								display_name: z.string().optional(),
								id: z.string().optional(),
								partition_name: z.string().optional(),
								provider_name: z.string().optional(),
								security_level: z
									.enum(['level_1', 'level_2', 'level_3', 'level_4'])
									.optional(),
							})
							.passthrough()
							.optional(),
						override_global: z.boolean().optional(),
						responder_create_within_days: z.number().int().optional(),
						responder_validity_days: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		create_default_aia_issuer: z.boolean().optional(),
		create_default_crl: z.boolean().optional(),
		create_preview_cert: z.boolean().optional(),
		csr: z.string().optional(),
		exportable: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z
			.enum(['online', 'offline', 'external', 'third_party'])
			.optional(),
		hsm_key_label: z.string().optional(),
		hsm_partition: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		is_composite_ca: z.boolean().optional(),
		issue_types: z.array(z.string()).optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_type: z.enum(['rsa', 'ecc']).or(z.string()).optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		number_of_ica: z.number().int().optional(),
		pem: z.string().optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		recertification_links: z
			.array(
				z
					.object({
						created_date: z.string().optional(),
						link_type: z.string().optional(),
						linked_ca: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		reinstate_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		revocation_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						reason: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
						revocation_date: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z
			.enum(['active', 'pending_sign', 'disabled'])
			.or(z.string())
			.optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		trust_types: z.array(z.string()).optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_6e1b2f5805e5Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_6e1b2f5805e5Output = z.undefined();
const r_e2d08c123889Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_e2d08c123889Output = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active_aia_issuer: z
			.object({ file_name: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		active_arl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl_cdps: z
			.object({ cdps: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
		active_eerl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		allow_unmatched_cdp: z.boolean().optional(),
		blob: z.string().optional(),
		ca_type: z.string().optional(),
		cert_type: z.string().optional(),
		configuration: z
			.object({
				aia_issuer: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				allow_extended_validity: z.boolean().optional(),
				allow_pkcs7_operations: z.boolean().optional(),
				allowed_signature_algorithms: z.array(z.string()).optional(),
				available_signature_algorithms: z.array(z.string()).optional(),
				certificate_policies: z
					.object({
						allowed_sources: z.array(z.string()).optional(),
						default_policies: z
							.object({
								critical: z.boolean().optional(),
								policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				chains: z
					.array(
						z
							.object({
								certificates: z
									.array(
										z
											.object({
												blob: z.string().optional(),
												cert_type: z.string().optional(),
												subject: z
													.object({
														common_name: z.string().optional(),
														country: z.string().optional(),
														custom_attributes: z
															.array(
																z
																	.object({
																		oid: z.string().optional(),
																		type: z.string().optional(),
																		values: z.array(z.string()).optional(),
																	})
																	.passthrough(),
															)
															.optional(),
														description: z.array(z.string()).optional(),
														dn_qualifier: z.string().optional(),
														domain_component: z.array(z.string()).optional(),
														email: z.string().optional(),
														given_name: z.array(z.string()).optional(),
														locality: z.string().optional(),
														organization_identifier: z.string().optional(),
														organization_name: z.string().optional(),
														organization_units: z.array(z.string()).optional(),
														postal_code: z.string().optional(),
														product_identifier: z.string().optional(),
														pseudonym: z.string().optional(),
														serial_number: z.string().optional(),
														state: z.string().optional(),
														street_address: z.array(z.string()).optional(),
														subject_order: z.array(z.string()).optional(),
														surname: z.array(z.string()).optional(),
														title: z.array(z.string()).optional(),
														unique_identifier: z.string().optional(),
														unstructured_address: z
															.array(z.string())
															.optional(),
														unstructured_name: z.array(z.string()).optional(),
														user_identifier: z.string().optional(),
														vendor_identifier: z.string().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								default: z.boolean().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				crl: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						end_validity_years: z.number().int().optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				include_all_certificates_in_crl: z.boolean().optional(),
				issue_end_entities: z.boolean().optional(),
				issue_ica_intermediates: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issue_unmanaged_ca: z.boolean().optional(),
				ocsp: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
						uri_path: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ocsp_responder: z
					.object({
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						certificate_template: z
							.object({
								access: z.string().optional(),
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								category: z.string().optional(),
								cert_type: z
									.enum(['root', 'intermediate', 'end_entity'])
									.optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								install_type: z.string().optional(),
								issue_types: z.array(z.string()).optional(),
								kind: z.string().optional(),
								name: z.string().optional(),
								template_json: z.string().optional(),
								trust_type: z.string().optional(),
								updated_date: z.string().optional(),
							})
							.passthrough()
							.optional(),
						delete_expired_responders: z.boolean().optional(),
						generation_enabled: z.boolean().optional(),
						hsm_partition: z
							.object({
								display_name: z.string().optional(),
								id: z.string().optional(),
								partition_name: z.string().optional(),
								provider_name: z.string().optional(),
								security_level: z
									.enum(['level_1', 'level_2', 'level_3', 'level_4'])
									.optional(),
							})
							.passthrough()
							.optional(),
						override_global: z.boolean().optional(),
						responder_create_within_days: z.number().int().optional(),
						responder_validity_days: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		create_default_aia_issuer: z.boolean().optional(),
		create_default_crl: z.boolean().optional(),
		create_preview_cert: z.boolean().optional(),
		csr: z.string().optional(),
		exportable: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z
			.enum(['online', 'offline', 'external', 'third_party'])
			.optional(),
		hsm_key_label: z.string().optional(),
		hsm_partition: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		is_composite_ca: z.boolean().optional(),
		issue_types: z.array(z.string()).optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_type: z.enum(['rsa', 'ecc']).or(z.string()).optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		number_of_ica: z.number().int().optional(),
		pem: z.string().optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		recertification_links: z
			.array(
				z
					.object({
						created_date: z.string().optional(),
						link_type: z.string().optional(),
						linked_ca: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		reinstate_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		revocation_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						reason: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
						revocation_date: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z
			.enum(['active', 'pending_sign', 'disabled'])
			.or(z.string())
			.optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		trust_types: z.array(z.string()).optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_a4505158d331Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ accounts: z.array(z.string()).optional() }).passthrough(),
	})
	.strict();
const r_a4505158d331Output = z.undefined();
const r_1d77ab47e7b6Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ accounts: z.array(z.string()).optional() }).passthrough(),
	})
	.strict();
const r_1d77ab47e7b6Output = z.undefined();
const r_ec4a0752b7d5Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ accounts: z.array(z.string()).optional() }).passthrough(),
	})
	.strict();
const r_ec4a0752b7d5Output = z.undefined();
const r_a78f5194d416Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ file_name: z.string().optional(), id: z.string().optional() })
			.passthrough(),
	})
	.strict();
const r_a78f5194d416Output = z.undefined();
const r_22401761d689Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_22401761d689Output = z.undefined();
const r_7fcf865bc7c5Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ blobs: z.array(z.string()).optional() }).passthrough(),
	})
	.strict();
const r_7fcf865bc7c5Output = z.undefined();
const r_aa5e92b5e9cdInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_aa5e92b5e9cdOutput = z
	.object({
		domains: z
			.array(
				z
					.object({
						accounts: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						active: z.boolean().optional(),
						created_date: z.string().optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						scheme: z.enum(['http', 'https', 'ldap']).or(z.string()).optional(),
						type: z.array(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		include: z.string().optional(),
		override_global: z.boolean().optional(),
	})
	.passthrough();
const r_74dc2333e88bInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				domains: z
					.array(
						z
							.object({
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
								scheme: z.enum(['http', 'https', 'ldap']).optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				include: z.string().optional(),
				override_global: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_74dc2333e88bOutput = z.undefined();
const r_f16d00fee5aeInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_f16d00fee5aeOutput = z
	.object({
		allowed_sources: z.array(z.string()).optional(),
		default_policies: z
			.object({
				critical: z.boolean().optional(),
				policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		include: z.string().optional(),
		override_global: z.boolean().optional(),
	})
	.passthrough();
const r_86bed8b7c460Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				allowed_sources: z.array(z.string()).optional(),
				default_policies: z
					.object({
						critical: z.boolean().optional(),
						policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				include: z.string().optional(),
				override_global: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_86bed8b7c460Output = z.undefined();
const r_2ff5d2e16aebInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				issue_end_entities: unspecifiedProviderValue().optional(),
				issue_ica_intermediates: unspecifiedProviderValue().optional(),
				issue_unmanaged_ca: unspecifiedProviderValue().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_2ff5d2e16aebOutput = z.undefined();
const r_dade4aa006edInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_dade4aa006edOutput = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							certificates: z
								.array(
									z
										.object({
											blob: z.string().optional(),
											cert_type: z.string().optional(),
											subject: z
												.object({
													common_name: z.string().optional(),
													country: z.string().optional(),
													custom_attributes: z
														.array(
															z
																.object({
																	oid: z.string().optional(),
																	type: z.string().optional(),
																	values: z.array(z.string()).optional(),
																})
																.passthrough(),
														)
														.optional(),
													description: z.array(z.string()).optional(),
													dn_qualifier: z.string().optional(),
													domain_component: z.array(z.string()).optional(),
													email: z.string().optional(),
													given_name: z.array(z.string()).optional(),
													locality: z.string().optional(),
													organization_identifier: z.string().optional(),
													organization_name: z.string().optional(),
													organization_units: z.array(z.string()).optional(),
													postal_code: z.string().optional(),
													product_identifier: z.string().optional(),
													pseudonym: z.string().optional(),
													serial_number: z.string().optional(),
													state: z.string().optional(),
													street_address: z.array(z.string()).optional(),
													subject_order: z.array(z.string()).optional(),
													surname: z.array(z.string()).optional(),
													title: z.array(z.string()).optional(),
													unique_identifier: z.string().optional(),
													unstructured_address: z.array(z.string()).optional(),
													unstructured_name: z.array(z.string()).optional(),
													user_identifier: z.string().optional(),
													vendor_identifier: z.string().optional(),
												})
												.passthrough()
												.optional(),
										})
										.passthrough(),
								)
								.optional(),
							default: z.boolean().optional(),
							id: z.string().optional(),
							name: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_15e6335cf9bcInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificates: z
					.array(
						z
							.object({
								blob: z.string().optional(),
								cert_type: z.string().optional(),
								subject: z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				default: z.boolean().optional(),
				id: z.string().optional(),
				name: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_15e6335cf9bcOutput = z.intersection(
	z
		.object({
			items: z.object({}).passthrough().optional(),
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.object({
					certificates: z
						.array(
							z
								.object({
									blob: z.string().optional(),
									cert_type: z.string().optional(),
									subject: z
										.object({
											common_name: z.string().optional(),
											country: z.string().optional(),
											custom_attributes: z
												.array(
													z
														.object({
															oid: z.string().optional(),
															type: z.string().optional(),
															values: z.array(z.string()).optional(),
														})
														.passthrough(),
												)
												.optional(),
											description: z.array(z.string()).optional(),
											dn_qualifier: z.string().optional(),
											domain_component: z.array(z.string()).optional(),
											email: z.string().optional(),
											given_name: z.array(z.string()).optional(),
											locality: z.string().optional(),
											organization_identifier: z.string().optional(),
											organization_name: z.string().optional(),
											organization_units: z.array(z.string()).optional(),
											postal_code: z.string().optional(),
											product_identifier: z.string().optional(),
											pseudonym: z.string().optional(),
											serial_number: z.string().optional(),
											state: z.string().optional(),
											street_address: z.array(z.string()).optional(),
											subject_order: z.array(z.string()).optional(),
											surname: z.array(z.string()).optional(),
											title: z.array(z.string()).optional(),
											unique_identifier: z.string().optional(),
											unstructured_address: z.array(z.string()).optional(),
											unstructured_name: z.array(z.string()).optional(),
											user_identifier: z.string().optional(),
											vendor_identifier: z.string().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
						)
						.optional(),
					default: z.boolean().optional(),
					id: z.string().optional(),
					name: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
);
const r_ef0e548901a2Input = z
	.object({
		path: z.object({ id: z.string(), chainID: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ef0e548901a2Output = z.undefined();
const r_56ca5f9f8d8eInput = z
	.object({
		path: z.object({ id: z.string(), chainID: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_56ca5f9f8d8eOutput = z
	.object({
		certificates: z
			.array(
				z
					.object({
						blob: z.string().optional(),
						cert_type: z.string().optional(),
						subject: z
							.object({
								common_name: z.string().optional(),
								country: z.string().optional(),
								custom_attributes: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												type: z.string().optional(),
												values: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								description: z.array(z.string()).optional(),
								dn_qualifier: z.string().optional(),
								domain_component: z.array(z.string()).optional(),
								email: z.string().optional(),
								given_name: z.array(z.string()).optional(),
								locality: z.string().optional(),
								organization_identifier: z.string().optional(),
								organization_name: z.string().optional(),
								organization_units: z.array(z.string()).optional(),
								postal_code: z.string().optional(),
								product_identifier: z.string().optional(),
								pseudonym: z.string().optional(),
								serial_number: z.string().optional(),
								state: z.string().optional(),
								street_address: z.array(z.string()).optional(),
								subject_order: z.array(z.string()).optional(),
								surname: z.array(z.string()).optional(),
								title: z.array(z.string()).optional(),
								unique_identifier: z.string().optional(),
								unstructured_address: z.array(z.string()).optional(),
								unstructured_name: z.array(z.string()).optional(),
								user_identifier: z.string().optional(),
								vendor_identifier: z.string().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		default: z.boolean().optional(),
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();
const r_3fb14506f402Input = z
	.object({
		path: z.object({ id: z.string(), chainID: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificates: z
					.array(
						z
							.object({
								blob: z.string().optional(),
								cert_type: z.string().optional(),
								subject: z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				default: z.boolean().optional(),
				id: z.string().optional(),
				name: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_3fb14506f402Output = z.undefined();
const r_f328ec91fc11Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ enabled: z.boolean().optional() }).passthrough(),
	})
	.strict();
const r_f328ec91fc11Output = z.undefined();
const r_fbe03c239006Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_fbe03c239006Output = z
	.object({
		domains: z
			.array(
				z
					.object({
						accounts: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						active: z.boolean().optional(),
						created_date: z.string().optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						scheme: z.enum(['http', 'https', 'ldap']).or(z.string()).optional(),
						type: z.array(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		end_validity_years: z.number().int().optional(),
		include: z.string().optional(),
		override_global: z.boolean().optional(),
	})
	.passthrough();
const r_b532e61d0366Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				domains: z
					.array(
						z
							.object({
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
								scheme: z.enum(['http', 'https', 'ldap']).optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				end_validity_years: z.number().int().optional(),
				include: z.string().optional(),
				override_global: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_b532e61d0366Output = z.undefined();
const r_d4dfd7f5559cInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_d4dfd7f5559cOutput = z
	.object({
		delegated: z.boolean().optional(),
		generation_frequency_hours: z.number().int().optional(),
		include_chain: z.boolean().optional(),
		offline_cas_option: z
			.enum([
				'sign_with_ca_key_and_fallback',
				'sign_with_responder_and_fallback',
				'sign_only_with_responder',
				'sign_only_with_ca_key',
			])
			.optional(),
		on_demand: z.boolean().optional(),
		online_cas_option: z
			.enum([
				'sign_with_ca_key_and_fallback',
				'sign_with_responder_and_fallback',
				'sign_only_with_responder',
				'sign_only_with_ca_key',
			])
			.optional(),
		override_global: z.boolean().optional(),
		response_duration_hours: z.number().int().optional(),
	})
	.passthrough();
const r_614145d2f693Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				delegated: z.boolean().optional(),
				generation_frequency_hours: z.number().int().optional(),
				include_chain: z.boolean().optional(),
				offline_cas_option: z
					.enum([
						'sign_with_ca_key_and_fallback',
						'sign_with_responder_and_fallback',
						'sign_only_with_responder',
						'sign_only_with_ca_key',
					])
					.optional(),
				on_demand: z.boolean().optional(),
				online_cas_option: z
					.enum([
						'sign_with_ca_key_and_fallback',
						'sign_with_responder_and_fallback',
						'sign_only_with_responder',
						'sign_only_with_ca_key',
					])
					.optional(),
				override_global: z.boolean().optional(),
				response_duration_hours: z.number().int().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_614145d2f693Output = z.undefined();
const r_efc423513ee6Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_efc423513ee6Output = z
	.object({
		domains: z
			.array(
				z
					.object({
						accounts: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						active: z.boolean().optional(),
						created_date: z.string().optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						scheme: z.enum(['http', 'https', 'ldap']).or(z.string()).optional(),
						type: z.array(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		include: z.string().optional(),
		override_global: z.boolean().optional(),
		uri_path: z.string().optional(),
	})
	.passthrough();
const r_ae80f0a2884cInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				domains: z
					.array(
						z
							.object({
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
								scheme: z.enum(['http', 'https', 'ldap']).optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				include: z.string().optional(),
				override_global: z.boolean().optional(),
				uri_path: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_ae80f0a2884cOutput = z.undefined();
const r_09525a87a3feInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_09525a87a3feOutput = z
	.object({
		certificate_policies: z
			.array(
				z
					.object({
						cps_uri: z.string().optional(),
						oid: z.string().optional(),
						user_notice: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		certificate_template: z
			.object({
				access: z.string().optional(),
				accounts: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				active: z.boolean().optional(),
				category: z.string().optional(),
				cert_type: z
					.enum(['root', 'intermediate', 'end_entity'])
					.or(z.string())
					.optional(),
				created_date: z.string().optional(),
				id: z.string().optional(),
				install_type: z.string().optional(),
				issue_types: z.array(z.string()).optional(),
				kind: z.string().optional(),
				name: z.string().optional(),
				template_json: z.string().optional(),
				trust_type: z.string().optional(),
				updated_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		delete_expired_responders: z.boolean().optional(),
		generation_enabled: z.boolean().optional(),
		hsm_partition: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		override_global: z.boolean().optional(),
		responder_create_within_days: z.number().int().optional(),
		responder_validity_days: z.number().int().optional(),
	})
	.passthrough();
const r_39f8c394d7dcInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				certificate_template: z
					.object({
						access: z.string().optional(),
						accounts: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						active: z.boolean().optional(),
						category: z.string().optional(),
						cert_type: z
							.enum(['root', 'intermediate', 'end_entity'])
							.optional(),
						created_date: z.string().optional(),
						id: z.string().optional(),
						install_type: z.string().optional(),
						issue_types: z.array(z.string()).optional(),
						kind: z.string().optional(),
						name: z.string().optional(),
						template_json: z.string().optional(),
						trust_type: z.string().optional(),
						updated_date: z.string().optional(),
					})
					.passthrough()
					.optional(),
				delete_expired_responders: z.boolean().optional(),
				generation_enabled: z.boolean().optional(),
				hsm_partition: z
					.object({
						display_name: z.string().optional(),
						id: z.string().optional(),
						partition_name: z.string().optional(),
						provider_name: z.string().optional(),
						security_level: z
							.enum(['level_1', 'level_2', 'level_3', 'level_4'])
							.optional(),
					})
					.passthrough()
					.optional(),
				override_global: z.boolean().optional(),
				responder_create_within_days: z.number().int().optional(),
				responder_validity_days: z.number().int().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_39f8c394d7dcOutput = z.undefined();
const r_56a0935ca4e1Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				allow_extended_validity: z.boolean().optional(),
				allow_pkcs7_operations: z.boolean().optional(),
				allowed_signature_algorithms: z.array(z.string()).optional(),
			})
			.passthrough(),
	})
	.strict();
const r_56a0935ca4e1Output = z.undefined();
const r_c1a00107ddd8Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c1a00107ddd8Output = z
	.object({ csr: z.string().optional() })
	.passthrough();
const r_f1ac9a204fdbInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ pkcs7: z.array(z.number().int()).optional() })
			.passthrough(),
	})
	.strict();
const r_f1ac9a204fdbOutput = z
	.object({
		content_data: z.array(z.number().int()).optional(),
		content_type: z.string().optional(),
		encryption_algorithm: z.string().optional(),
		signers: z
			.array(
				z
					.object({
						authenticated_attributes: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										raw_value: z.array(z.number().int()).optional(),
										simple_value: z.string().optional(),
										value_type: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						certificate: z.array(z.number().int()).optional(),
						signature_algorithm: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_91c5268bb884Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ format: z.string().optional() }).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_91c5268bb884Output = z.array(z.number().int());
const r_cf67da15ce78Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ pkcs7: z.array(z.number().int()).optional() })
			.passthrough(),
	})
	.strict();
const r_cf67da15ce78Output = z
	.object({ pkcs7: z.array(z.number().int()).optional() })
	.passthrough();
const r_85b7ca4c4f50Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_85b7ca4c4f50Output = z
	.object({
		cert_blob: z.array(z.number().int()).optional(),
		cert_type: z.string().optional(),
		children: z
			.array(z.record(z.string(), unspecifiedProviderValue()))
			.optional(),
		id: z.string().optional(),
		name: z.string().optional(),
		parsed_subject: z
			.object({
				common_name: z.string().optional(),
				country: z.array(z.string()).optional(),
				extra_names: z
					.array(
						z
							.object({
								type: z.array(z.number().int()).optional(),
								value: unspecifiedProviderValue().optional(),
							})
							.passthrough(),
					)
					.optional(),
				locality: z.array(z.string()).optional(),
				names: z
					.array(
						z
							.object({
								type: z.array(z.number().int()).optional(),
								value: unspecifiedProviderValue().optional(),
							})
							.passthrough(),
					)
					.optional(),
				organization: z.array(z.string()).optional(),
				organizational_unit: z.array(z.string()).optional(),
				postal_code: z.array(z.string()).optional(),
				province: z.array(z.string()).optional(),
				serial_number: z.string().optional(),
				street_address: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		status: z.string().optional(),
		subject_dn: z.string().optional(),
		valid_from: z.string().optional(),
		valid_to: z.string().optional(),
	})
	.passthrough();
const r_49bc49df9e00Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z
			.object({
				offset: z.number().int().optional(),
				limit: z.number().int().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_49bc49df9e00Output = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							created_date: z.string().optional(),
							id: z.string().optional(),
							text: z.string().optional(),
							user_email: z.string().optional(),
							user_full_name: z.string().optional(),
							user_id: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_7ecf8015ce52Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				created_date: z.string().optional(),
				id: z.string().optional(),
				text: z.string().optional(),
				user_email: z.string().optional(),
				user_full_name: z.string().optional(),
				user_id: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_7ecf8015ce52Output = z.undefined();
const r_c91c378818a5Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c91c378818a5Output = z
	.object({
		domains: z
			.array(
				z
					.object({
						accounts: z
							.array(
								z
									.object({
										id: z.string().optional(),
										name: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						active: z.boolean().optional(),
						created_date: z.string().optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						scheme: z.enum(['http', 'https', 'ldap']).or(z.string()).optional(),
						type: z.array(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		include: z.string().optional(),
		override_global: z.boolean().optional(),
		uri_path: z.string().optional(),
	})
	.passthrough();
const r_47971e5aadf2Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_47971e5aadf2Output = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active_aia_issuer: z
			.object({ file_name: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		active_arl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl_cdps: z
			.object({ cdps: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
		active_eerl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		allow_unmatched_cdp: z.boolean().optional(),
		blob: z.string().optional(),
		ca_type: z.string().optional(),
		cert_type: z.string().optional(),
		configuration: z
			.object({
				aia_issuer: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				allow_extended_validity: z.boolean().optional(),
				allow_pkcs7_operations: z.boolean().optional(),
				allowed_signature_algorithms: z.array(z.string()).optional(),
				available_signature_algorithms: z.array(z.string()).optional(),
				certificate_policies: z
					.object({
						allowed_sources: z.array(z.string()).optional(),
						default_policies: z
							.object({
								critical: z.boolean().optional(),
								policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				chains: z
					.array(
						z
							.object({
								certificates: z
									.array(
										z
											.object({
												blob: z.string().optional(),
												cert_type: z.string().optional(),
												subject: z
													.object({
														common_name: z.string().optional(),
														country: z.string().optional(),
														custom_attributes: z
															.array(
																z
																	.object({
																		oid: z.string().optional(),
																		type: z.string().optional(),
																		values: z.array(z.string()).optional(),
																	})
																	.passthrough(),
															)
															.optional(),
														description: z.array(z.string()).optional(),
														dn_qualifier: z.string().optional(),
														domain_component: z.array(z.string()).optional(),
														email: z.string().optional(),
														given_name: z.array(z.string()).optional(),
														locality: z.string().optional(),
														organization_identifier: z.string().optional(),
														organization_name: z.string().optional(),
														organization_units: z.array(z.string()).optional(),
														postal_code: z.string().optional(),
														product_identifier: z.string().optional(),
														pseudonym: z.string().optional(),
														serial_number: z.string().optional(),
														state: z.string().optional(),
														street_address: z.array(z.string()).optional(),
														subject_order: z.array(z.string()).optional(),
														surname: z.array(z.string()).optional(),
														title: z.array(z.string()).optional(),
														unique_identifier: z.string().optional(),
														unstructured_address: z
															.array(z.string())
															.optional(),
														unstructured_name: z.array(z.string()).optional(),
														user_identifier: z.string().optional(),
														vendor_identifier: z.string().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								default: z.boolean().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				crl: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						end_validity_years: z.number().int().optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				include_all_certificates_in_crl: z.boolean().optional(),
				issue_end_entities: z.boolean().optional(),
				issue_ica_intermediates: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issue_unmanaged_ca: z.boolean().optional(),
				ocsp: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
						uri_path: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ocsp_responder: z
					.object({
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						certificate_template: z
							.object({
								access: z.string().optional(),
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								category: z.string().optional(),
								cert_type: z
									.enum(['root', 'intermediate', 'end_entity'])
									.optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								install_type: z.string().optional(),
								issue_types: z.array(z.string()).optional(),
								kind: z.string().optional(),
								name: z.string().optional(),
								template_json: z.string().optional(),
								trust_type: z.string().optional(),
								updated_date: z.string().optional(),
							})
							.passthrough()
							.optional(),
						delete_expired_responders: z.boolean().optional(),
						generation_enabled: z.boolean().optional(),
						hsm_partition: z
							.object({
								display_name: z.string().optional(),
								id: z.string().optional(),
								partition_name: z.string().optional(),
								provider_name: z.string().optional(),
								security_level: z
									.enum(['level_1', 'level_2', 'level_3', 'level_4'])
									.optional(),
							})
							.passthrough()
							.optional(),
						override_global: z.boolean().optional(),
						responder_create_within_days: z.number().int().optional(),
						responder_validity_days: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		create_default_aia_issuer: z.boolean().optional(),
		create_default_crl: z.boolean().optional(),
		create_preview_cert: z.boolean().optional(),
		csr: z.string().optional(),
		exportable: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z
			.enum(['online', 'offline', 'external', 'third_party'])
			.optional(),
		hsm_key_label: z.string().optional(),
		hsm_partition: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		is_composite_ca: z.boolean().optional(),
		issue_types: z.array(z.string()).optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_type: z.enum(['rsa', 'ecc']).or(z.string()).optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		number_of_ica: z.number().int().optional(),
		pem: z.string().optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		recertification_links: z
			.array(
				z
					.object({
						created_date: z.string().optional(),
						link_type: z.string().optional(),
						linked_ca: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		reinstate_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		revocation_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						reason: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
						revocation_date: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z
			.enum(['active', 'pending_sign', 'disabled'])
			.or(z.string())
			.optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		trust_types: z.array(z.string()).optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_81b7e6e852baInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ blob: z.string().optional() }).passthrough(),
	})
	.strict();
const r_81b7e6e852baOutput = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active_aia_issuer: z
			.object({ file_name: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		active_arl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl_cdps: z
			.object({ cdps: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
		active_eerl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		allow_unmatched_cdp: z.boolean().optional(),
		blob: z.string().optional(),
		ca_type: z.string().optional(),
		cert_type: z.string().optional(),
		configuration: z
			.object({
				aia_issuer: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				allow_extended_validity: z.boolean().optional(),
				allow_pkcs7_operations: z.boolean().optional(),
				allowed_signature_algorithms: z.array(z.string()).optional(),
				available_signature_algorithms: z.array(z.string()).optional(),
				certificate_policies: z
					.object({
						allowed_sources: z.array(z.string()).optional(),
						default_policies: z
							.object({
								critical: z.boolean().optional(),
								policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				chains: z
					.array(
						z
							.object({
								certificates: z
									.array(
										z
											.object({
												blob: z.string().optional(),
												cert_type: z.string().optional(),
												subject: z
													.object({
														common_name: z.string().optional(),
														country: z.string().optional(),
														custom_attributes: z
															.array(
																z
																	.object({
																		oid: z.string().optional(),
																		type: z.string().optional(),
																		values: z.array(z.string()).optional(),
																	})
																	.passthrough(),
															)
															.optional(),
														description: z.array(z.string()).optional(),
														dn_qualifier: z.string().optional(),
														domain_component: z.array(z.string()).optional(),
														email: z.string().optional(),
														given_name: z.array(z.string()).optional(),
														locality: z.string().optional(),
														organization_identifier: z.string().optional(),
														organization_name: z.string().optional(),
														organization_units: z.array(z.string()).optional(),
														postal_code: z.string().optional(),
														product_identifier: z.string().optional(),
														pseudonym: z.string().optional(),
														serial_number: z.string().optional(),
														state: z.string().optional(),
														street_address: z.array(z.string()).optional(),
														subject_order: z.array(z.string()).optional(),
														surname: z.array(z.string()).optional(),
														title: z.array(z.string()).optional(),
														unique_identifier: z.string().optional(),
														unstructured_address: z
															.array(z.string())
															.optional(),
														unstructured_name: z.array(z.string()).optional(),
														user_identifier: z.string().optional(),
														vendor_identifier: z.string().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								default: z.boolean().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				crl: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						end_validity_years: z.number().int().optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				include_all_certificates_in_crl: z.boolean().optional(),
				issue_end_entities: z.boolean().optional(),
				issue_ica_intermediates: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issue_unmanaged_ca: z.boolean().optional(),
				ocsp: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
						uri_path: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ocsp_responder: z
					.object({
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						certificate_template: z
							.object({
								access: z.string().optional(),
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								category: z.string().optional(),
								cert_type: z
									.enum(['root', 'intermediate', 'end_entity'])
									.optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								install_type: z.string().optional(),
								issue_types: z.array(z.string()).optional(),
								kind: z.string().optional(),
								name: z.string().optional(),
								template_json: z.string().optional(),
								trust_type: z.string().optional(),
								updated_date: z.string().optional(),
							})
							.passthrough()
							.optional(),
						delete_expired_responders: z.boolean().optional(),
						generation_enabled: z.boolean().optional(),
						hsm_partition: z
							.object({
								display_name: z.string().optional(),
								id: z.string().optional(),
								partition_name: z.string().optional(),
								provider_name: z.string().optional(),
								security_level: z
									.enum(['level_1', 'level_2', 'level_3', 'level_4'])
									.optional(),
							})
							.passthrough()
							.optional(),
						override_global: z.boolean().optional(),
						responder_create_within_days: z.number().int().optional(),
						responder_validity_days: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		create_default_aia_issuer: z.boolean().optional(),
		create_default_crl: z.boolean().optional(),
		create_preview_cert: z.boolean().optional(),
		csr: z.string().optional(),
		exportable: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z
			.enum(['online', 'offline', 'external', 'third_party'])
			.optional(),
		hsm_key_label: z.string().optional(),
		hsm_partition: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		is_composite_ca: z.boolean().optional(),
		issue_types: z.array(z.string()).optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_type: z.enum(['rsa', 'ecc']).or(z.string()).optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		number_of_ica: z.number().int().optional(),
		pem: z.string().optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		recertification_links: z
			.array(
				z
					.object({
						created_date: z.string().optional(),
						link_type: z.string().optional(),
						linked_ca: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		reinstate_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		revocation_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						reason: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
						revocation_date: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z
			.enum(['active', 'pending_sign', 'disabled'])
			.or(z.string())
			.optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		trust_types: z.array(z.string()).optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_4530bfcae9b5Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				comments: z.string().optional(),
				id: z.string().optional(),
				requester_user_id: z.string().optional(),
				requester_username: z.string().optional(),
				reviewer_user_id: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_4530bfcae9b5Output = z
	.object({
		comments: z.string().optional(),
		id: z.string().optional(),
		requester_user_id: z.string().optional(),
		requester_username: z.string().optional(),
		reviewer_user_id: z.string().optional(),
	})
	.passthrough();
const r_0bd21da7c4c2Input = z
	.object({
		path: z.object({ id: z.string(), requestId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_0bd21da7c4c2Output = z
	.object({
		comments: z.string().optional(),
		id: z.string().optional(),
		requester_user_id: z.string().optional(),
		requester_username: z.string().optional(),
		reviewer_user_id: z.string().optional(),
	})
	.passthrough();
const r_40ec0307a789Input = z
	.object({
		path: z.object({ id: z.string(), requestId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_40ec0307a789Output = z.undefined();
const r_811c3aab6f1aInput = z
	.object({
		path: z.object({ id: z.string(), requestId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_811c3aab6f1aOutput = z.undefined();
const r_d98516ab704fInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				comments: z.string().optional(),
				id: z.string().optional(),
				reason: z.string().optional(),
				requester_user_id: z.string().optional(),
				requester_username: z.string().optional(),
				reviewer_user_id: z.string().optional(),
				revocation_date: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_d98516ab704fOutput = z
	.object({
		comments: z.string().optional(),
		id: z.string().optional(),
		reason: z.string().optional(),
		requester_user_id: z.string().optional(),
		requester_username: z.string().optional(),
		reviewer_user_id: z.string().optional(),
		revocation_date: z.string().optional(),
	})
	.passthrough();
const r_a4e740425499Input = z
	.object({
		path: z.object({ id: z.string(), requestId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a4e740425499Output = z
	.object({
		comments: z.string().optional(),
		id: z.string().optional(),
		reason: z.string().optional(),
		requester_user_id: z.string().optional(),
		requester_username: z.string().optional(),
		reviewer_user_id: z.string().optional(),
		revocation_date: z.string().optional(),
	})
	.passthrough();
const r_08eb17056280Input = z
	.object({
		path: z.object({ id: z.string(), requestId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_08eb17056280Output = z.undefined();
const r_59ccb057dbe7Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				protected_part: z.array(z.number().int()).optional(),
				signature: z.string().optional(),
				signature_algorithm: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_59ccb057dbe7Output = z
	.object({
		protected_part: z.array(z.number().int()).optional(),
		signature: z.string().optional(),
		signature_algorithm: z.string().optional(),
	})
	.passthrough();
const r_1050c0a3587aInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				protected_part: z.array(z.number().int()).optional(),
				signature: z.string().optional(),
				signature_algorithm: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_1050c0a3587aOutput = z
	.object({
		protected_part: z.array(z.number().int()).optional(),
		signature: z.string().optional(),
		signature_algorithm: z.string().optional(),
	})
	.passthrough();
const r_13f16d161bfeInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate_type: z.string().optional(),
				create_certificate: z.boolean().optional(),
				csr: z.string().optional(),
				ecdsa: z.boolean().optional(),
				id: z.string().optional(),
				protected_part: z.array(z.number().int()).optional(),
				signature: z.string().optional(),
				signature_algorithm: z.string().optional(),
				signature_length: z.number().int().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_13f16d161bfeOutput = z
	.object({
		certificate_type: z.string().optional(),
		create_certificate: z.boolean().optional(),
		csr: z.string().optional(),
		ecdsa: z.boolean().optional(),
		id: z.string().optional(),
		protected_part: z.array(z.number().int()).optional(),
		signature: z.string().optional(),
		signature_algorithm: z.string().optional(),
		signature_length: z.number().int().optional(),
	})
	.passthrough();
const r_bfe1b8b2129aInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_bfe1b8b2129aOutput = z
	.object({ status: z.string().optional() })
	.passthrough();
const r_1028c694e4f8Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ active_status: z.enum(['active', 'disabled']) }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_1028c694e4f8Output = z.undefined();
const r_79d35f25e203Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_79d35f25e203Output = z.number().int();
const r_adc5dc353665Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.number().int().optional(),
				limit: z.number().int().optional(),
				certType: z.string().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_adc5dc353665Output = z
	.object({
		items: z.array(z.object({}).passthrough()).optional(),
		limit: z.number().int().optional(),
		offset: z.number().int().optional(),
		total: z.number().int().optional(),
	})
	.passthrough();
const r_2e0b14749b40Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_assignments: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				active_aia_issuer: z
					.object({
						file_name: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_arl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_crl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_crl_cdps: z
					.object({ cdps: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				active_eerl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				allow_unmatched_cdp: z.boolean().optional(),
				blob: z.string().optional(),
				ca_type: z.string().optional(),
				cert_type: z.string().optional(),
				configuration: z
					.object({
						aia_issuer: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						allow_extended_validity: z.boolean().optional(),
						allow_pkcs7_operations: z.boolean().optional(),
						allowed_signature_algorithms: z.array(z.string()).optional(),
						available_signature_algorithms: z.array(z.string()).optional(),
						certificate_policies: z
							.object({
								allowed_sources: z.array(z.string()).optional(),
								default_policies: z
									.object({
										critical: z.boolean().optional(),
										policies: z
											.array(
												z
													.object({
														cps_uri: z.string().optional(),
														oid: z.string().optional(),
														user_notice: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						chains: z
							.array(
								z
									.object({
										certificates: z
											.array(
												z
													.object({
														blob: z.string().optional(),
														cert_type: z.string().optional(),
														subject: z
															.object({
																common_name: z.string().optional(),
																country: z.string().optional(),
																custom_attributes: z
																	.array(
																		z
																			.object({
																				oid: z.string().optional(),
																				type: z.string().optional(),
																				values: z.array(z.string()).optional(),
																			})
																			.passthrough(),
																	)
																	.optional(),
																description: z.array(z.string()).optional(),
																dn_qualifier: z.string().optional(),
																domain_component: z
																	.array(z.string())
																	.optional(),
																email: z.string().optional(),
																given_name: z.array(z.string()).optional(),
																locality: z.string().optional(),
																organization_identifier: z.string().optional(),
																organization_name: z.string().optional(),
																organization_units: z
																	.array(z.string())
																	.optional(),
																postal_code: z.string().optional(),
																product_identifier: z.string().optional(),
																pseudonym: z.string().optional(),
																serial_number: z.string().optional(),
																state: z.string().optional(),
																street_address: z.array(z.string()).optional(),
																subject_order: z.array(z.string()).optional(),
																surname: z.array(z.string()).optional(),
																title: z.array(z.string()).optional(),
																unique_identifier: z.string().optional(),
																unstructured_address: z
																	.array(z.string())
																	.optional(),
																unstructured_name: z
																	.array(z.string())
																	.optional(),
																user_identifier: z.string().optional(),
																vendor_identifier: z.string().optional(),
															})
															.passthrough()
															.optional(),
													})
													.passthrough(),
											)
											.optional(),
										default: z.boolean().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						crl: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								end_validity_years: z.number().int().optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						include_all_certificates_in_crl: z.boolean().optional(),
						issue_end_entities: z.boolean().optional(),
						issue_ica_intermediates: z.boolean().optional(),
						issue_types: z.array(z.string()).optional(),
						issue_unmanaged_ca: z.boolean().optional(),
						ocsp: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
								uri_path: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ocsp_responder: z
							.object({
								certificate_policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								certificate_template: z
									.object({
										access: z.string().optional(),
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										category: z.string().optional(),
										cert_type: z
											.enum(['root', 'intermediate', 'end_entity'])
											.optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										install_type: z.string().optional(),
										issue_types: z.array(z.string()).optional(),
										kind: z.string().optional(),
										name: z.string().optional(),
										template_json: z.string().optional(),
										trust_type: z.string().optional(),
										updated_date: z.string().optional(),
									})
									.passthrough()
									.optional(),
								delete_expired_responders: z.boolean().optional(),
								generation_enabled: z.boolean().optional(),
								hsm_partition: z
									.object({
										display_name: z.string().optional(),
										id: z.string().optional(),
										partition_name: z.string().optional(),
										provider_name: z.string().optional(),
										security_level: z
											.enum(['level_1', 'level_2', 'level_3', 'level_4'])
											.optional(),
									})
									.passthrough()
									.optional(),
								override_global: z.boolean().optional(),
								responder_create_within_days: z.number().int().optional(),
								responder_validity_days: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				create_default_aia_issuer: z.boolean().optional(),
				create_default_crl: z.boolean().optional(),
				create_preview_cert: z.boolean().optional(),
				csr: z.string().optional(),
				exportable: z.boolean().optional(),
				extensions: z
					.object({
						adobe_archive_rev_info: z
							.object({ version: z.number().int().optional() })
							.passthrough()
							.optional(),
						adobe_timestamp: z
							.object({
								location: z.string().optional(),
								requires_auth: z.boolean().optional(),
								version: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						aia: z
							.object({ issuer_urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						aki: z
							.object({
								authority_name_serial_number: z.boolean().optional(),
								include: z.string().optional(),
								key_identifier: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						basic_constraints: z
							.object({
								ca: z.boolean().optional(),
								critical: z.boolean().optional(),
								path_length: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						cabf_organization_identifier: z
							.object({
								country: z.string().optional(),
								reference: z.string().optional(),
								scheme: z.string().optional(),
								state: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cdp: z
							.object({ urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						extended_key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						extensions_order: z.array(z.string()).optional(),
						issuer_alt_name: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
								skip_validation: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						lei: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						lei_role: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						microsoft_application_certificate_policies: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						microsoft_certificate_template_name: z.string().optional(),
						microsoft_certificate_template_v2: z
							.object({
								major_version: z.number().int().optional(),
								minor_version: z.number().int().optional(),
								oid: z.string().optional(),
							})
							.passthrough()
							.optional(),
						private_key_usage_period: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								not_after: z.string().optional(),
								not_before: z.string().optional(),
							})
							.passthrough()
							.optional(),
						qc_statements: z
							.object({
								critical: z.boolean().optional(),
								'etsi-psd2-qcStatement': z.array(z.string()).optional(),
								'id-etsi-qcs-QcPDS': z
									.array(
										z
											.object({
												language: z.string().optional(),
												uri: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
								'id-etsi-qcs-QcType': z.array(z.string()).optional(),
								'id-qcs-pkixQCSyntax-v2': z
									.object({ semantics_id: z.string().optional() })
									.passthrough()
									.optional(),
								oids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						san: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						ski: z
							.object({
								include: z.string().optional(),
								method: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ski_extension: z.string().optional(),
						smime_capabilities: z
							.object({ values: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						subject_directory_attributes: z
							.object({ encoded_value: z.array(z.number().int()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				hosted_type: z
					.enum(['online', 'offline', 'external', 'third_party'])
					.optional(),
				hsm_key_label: z.string().optional(),
				hsm_partition: z
					.object({
						display_name: z.string().optional(),
						id: z.string().optional(),
						partition_name: z.string().optional(),
						provider_name: z.string().optional(),
						security_level: z
							.enum(['level_1', 'level_2', 'level_3', 'level_4'])
							.optional(),
					})
					.passthrough()
					.optional(),
				id: z.string().optional(),
				is_composite_ca: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issuer: z
					.object({
						hosted_type: z
							.enum(['online', 'offline', 'third_party'])
							.optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_generation: z
					.object({
						dilithium_key_size: z.string().optional(),
						ecc_curve: z.string().optional(),
						ecdsa_curve: z.string().optional(),
						falcon_key_size: z.string().optional(),
						key_type: z.string().optional(),
						rsa_key_bits: z.number().int().optional(),
						sphincs_key_size: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_type: z.enum(['rsa', 'ecc']).optional(),
				name: z.string().optional(),
				notification: z
					.object({
						enabled: z.boolean().optional(),
						frequency: z.array(z.number().int()).optional(),
						recipients: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				number_of_ica: z.number().int().optional(),
				pem: z.string().optional(),
				private_key: z
					.object({
						password: z.string().optional(),
						pkcs12: z.array(z.number().int()).optional(),
						pre_installed: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				recertification_links: z
					.array(
						z
							.object({
								created_date: z.string().optional(),
								link_type: z.string().optional(),
								linked_ca: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				reinstate_requests: z
					.array(
						z
							.object({
								comments: z.string().optional(),
								id: z.string().optional(),
								requester_user_id: z.string().optional(),
								requester_username: z.string().optional(),
								reviewer_user_id: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				revocation: z
					.object({
						comments: z.string().optional(),
						reason: z.string().optional(),
						revoke_date: z.string().optional(),
						revoked: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				revocation_requests: z
					.array(
						z
							.object({
								comments: z.string().optional(),
								id: z.string().optional(),
								reason: z.string().optional(),
								requester_user_id: z.string().optional(),
								requester_username: z.string().optional(),
								reviewer_user_id: z.string().optional(),
								revocation_date: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				serial_number: z.string().optional(),
				signature_algorithm: z.string().optional(),
				status: z.enum(['active', 'pending_sign', 'disabled']).optional(),
				subject: z
					.object({
						common_name: z.string().optional(),
						country: z.string().optional(),
						custom_attributes: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										type: z.string().optional(),
										values: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						description: z.array(z.string()).optional(),
						dn_qualifier: z.string().optional(),
						domain_component: z.array(z.string()).optional(),
						email: z.string().optional(),
						given_name: z.array(z.string()).optional(),
						locality: z.string().optional(),
						organization_identifier: z.string().optional(),
						organization_name: z.string().optional(),
						organization_units: z.array(z.string()).optional(),
						postal_code: z.string().optional(),
						product_identifier: z.string().optional(),
						pseudonym: z.string().optional(),
						serial_number: z.string().optional(),
						state: z.string().optional(),
						street_address: z.array(z.string()).optional(),
						subject_order: z.array(z.string()).optional(),
						surname: z.array(z.string()).optional(),
						title: z.array(z.string()).optional(),
						unique_identifier: z.string().optional(),
						unstructured_address: z.array(z.string()).optional(),
						unstructured_name: z.array(z.string()).optional(),
						user_identifier: z.string().optional(),
						vendor_identifier: z.string().optional(),
					})
					.passthrough()
					.optional(),
				template: z.string().optional(),
				template_id: z.string().optional(),
				thumbprint_sha256: z.string().optional(),
				trust_type: z.string().optional(),
				trust_types: z.array(z.string()).optional(),
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_2e0b14749b40Output = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active_aia_issuer: z
			.object({ file_name: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		active_arl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl_cdps: z
			.object({ cdps: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
		active_eerl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		allow_unmatched_cdp: z.boolean().optional(),
		blob: z.string().optional(),
		ca_type: z.string().optional(),
		cert_type: z.string().optional(),
		configuration: z
			.object({
				aia_issuer: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				allow_extended_validity: z.boolean().optional(),
				allow_pkcs7_operations: z.boolean().optional(),
				allowed_signature_algorithms: z.array(z.string()).optional(),
				available_signature_algorithms: z.array(z.string()).optional(),
				certificate_policies: z
					.object({
						allowed_sources: z.array(z.string()).optional(),
						default_policies: z
							.object({
								critical: z.boolean().optional(),
								policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				chains: z
					.array(
						z
							.object({
								certificates: z
									.array(
										z
											.object({
												blob: z.string().optional(),
												cert_type: z.string().optional(),
												subject: z
													.object({
														common_name: z.string().optional(),
														country: z.string().optional(),
														custom_attributes: z
															.array(
																z
																	.object({
																		oid: z.string().optional(),
																		type: z.string().optional(),
																		values: z.array(z.string()).optional(),
																	})
																	.passthrough(),
															)
															.optional(),
														description: z.array(z.string()).optional(),
														dn_qualifier: z.string().optional(),
														domain_component: z.array(z.string()).optional(),
														email: z.string().optional(),
														given_name: z.array(z.string()).optional(),
														locality: z.string().optional(),
														organization_identifier: z.string().optional(),
														organization_name: z.string().optional(),
														organization_units: z.array(z.string()).optional(),
														postal_code: z.string().optional(),
														product_identifier: z.string().optional(),
														pseudonym: z.string().optional(),
														serial_number: z.string().optional(),
														state: z.string().optional(),
														street_address: z.array(z.string()).optional(),
														subject_order: z.array(z.string()).optional(),
														surname: z.array(z.string()).optional(),
														title: z.array(z.string()).optional(),
														unique_identifier: z.string().optional(),
														unstructured_address: z
															.array(z.string())
															.optional(),
														unstructured_name: z.array(z.string()).optional(),
														user_identifier: z.string().optional(),
														vendor_identifier: z.string().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								default: z.boolean().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				crl: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						end_validity_years: z.number().int().optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				include_all_certificates_in_crl: z.boolean().optional(),
				issue_end_entities: z.boolean().optional(),
				issue_ica_intermediates: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issue_unmanaged_ca: z.boolean().optional(),
				ocsp: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
						uri_path: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ocsp_responder: z
					.object({
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						certificate_template: z
							.object({
								access: z.string().optional(),
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								category: z.string().optional(),
								cert_type: z
									.enum(['root', 'intermediate', 'end_entity'])
									.optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								install_type: z.string().optional(),
								issue_types: z.array(z.string()).optional(),
								kind: z.string().optional(),
								name: z.string().optional(),
								template_json: z.string().optional(),
								trust_type: z.string().optional(),
								updated_date: z.string().optional(),
							})
							.passthrough()
							.optional(),
						delete_expired_responders: z.boolean().optional(),
						generation_enabled: z.boolean().optional(),
						hsm_partition: z
							.object({
								display_name: z.string().optional(),
								id: z.string().optional(),
								partition_name: z.string().optional(),
								provider_name: z.string().optional(),
								security_level: z
									.enum(['level_1', 'level_2', 'level_3', 'level_4'])
									.optional(),
							})
							.passthrough()
							.optional(),
						override_global: z.boolean().optional(),
						responder_create_within_days: z.number().int().optional(),
						responder_validity_days: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		create_default_aia_issuer: z.boolean().optional(),
		create_default_crl: z.boolean().optional(),
		create_preview_cert: z.boolean().optional(),
		csr: z.string().optional(),
		exportable: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z
			.enum(['online', 'offline', 'external', 'third_party'])
			.optional(),
		hsm_key_label: z.string().optional(),
		hsm_partition: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		is_composite_ca: z.boolean().optional(),
		issue_types: z.array(z.string()).optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_type: z.enum(['rsa', 'ecc']).or(z.string()).optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		number_of_ica: z.number().int().optional(),
		pem: z.string().optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		recertification_links: z
			.array(
				z
					.object({
						created_date: z.string().optional(),
						link_type: z.string().optional(),
						linked_ca: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		reinstate_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		revocation_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						reason: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
						revocation_date: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z
			.enum(['active', 'pending_sign', 'disabled'])
			.or(z.string())
			.optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		trust_types: z.array(z.string()).optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_bed51bae8a4dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_assignments: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				active_aia_issuer: z
					.object({
						file_name: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_arl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_crl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_crl_cdps: z
					.object({ cdps: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				active_eerl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				allow_unmatched_cdp: z.boolean().optional(),
				blob: z.string().optional(),
				ca_type: z.string().optional(),
				cert_type: z.string().optional(),
				configuration: z
					.object({
						aia_issuer: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						allow_extended_validity: z.boolean().optional(),
						allow_pkcs7_operations: z.boolean().optional(),
						allowed_signature_algorithms: z.array(z.string()).optional(),
						available_signature_algorithms: z.array(z.string()).optional(),
						certificate_policies: z
							.object({
								allowed_sources: z.array(z.string()).optional(),
								default_policies: z
									.object({
										critical: z.boolean().optional(),
										policies: z
											.array(
												z
													.object({
														cps_uri: z.string().optional(),
														oid: z.string().optional(),
														user_notice: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						chains: z
							.array(
								z
									.object({
										certificates: z
											.array(
												z
													.object({
														blob: z.string().optional(),
														cert_type: z.string().optional(),
														subject: z
															.object({
																common_name: z.string().optional(),
																country: z.string().optional(),
																custom_attributes: z
																	.array(
																		z
																			.object({
																				oid: z.string().optional(),
																				type: z.string().optional(),
																				values: z.array(z.string()).optional(),
																			})
																			.passthrough(),
																	)
																	.optional(),
																description: z.array(z.string()).optional(),
																dn_qualifier: z.string().optional(),
																domain_component: z
																	.array(z.string())
																	.optional(),
																email: z.string().optional(),
																given_name: z.array(z.string()).optional(),
																locality: z.string().optional(),
																organization_identifier: z.string().optional(),
																organization_name: z.string().optional(),
																organization_units: z
																	.array(z.string())
																	.optional(),
																postal_code: z.string().optional(),
																product_identifier: z.string().optional(),
																pseudonym: z.string().optional(),
																serial_number: z.string().optional(),
																state: z.string().optional(),
																street_address: z.array(z.string()).optional(),
																subject_order: z.array(z.string()).optional(),
																surname: z.array(z.string()).optional(),
																title: z.array(z.string()).optional(),
																unique_identifier: z.string().optional(),
																unstructured_address: z
																	.array(z.string())
																	.optional(),
																unstructured_name: z
																	.array(z.string())
																	.optional(),
																user_identifier: z.string().optional(),
																vendor_identifier: z.string().optional(),
															})
															.passthrough()
															.optional(),
													})
													.passthrough(),
											)
											.optional(),
										default: z.boolean().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						crl: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								end_validity_years: z.number().int().optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						include_all_certificates_in_crl: z.boolean().optional(),
						issue_end_entities: z.boolean().optional(),
						issue_ica_intermediates: z.boolean().optional(),
						issue_types: z.array(z.string()).optional(),
						issue_unmanaged_ca: z.boolean().optional(),
						ocsp: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
								uri_path: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ocsp_responder: z
							.object({
								certificate_policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								certificate_template: z
									.object({
										access: z.string().optional(),
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										category: z.string().optional(),
										cert_type: z
											.enum(['root', 'intermediate', 'end_entity'])
											.optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										install_type: z.string().optional(),
										issue_types: z.array(z.string()).optional(),
										kind: z.string().optional(),
										name: z.string().optional(),
										template_json: z.string().optional(),
										trust_type: z.string().optional(),
										updated_date: z.string().optional(),
									})
									.passthrough()
									.optional(),
								delete_expired_responders: z.boolean().optional(),
								generation_enabled: z.boolean().optional(),
								hsm_partition: z
									.object({
										display_name: z.string().optional(),
										id: z.string().optional(),
										partition_name: z.string().optional(),
										provider_name: z.string().optional(),
										security_level: z
											.enum(['level_1', 'level_2', 'level_3', 'level_4'])
											.optional(),
									})
									.passthrough()
									.optional(),
								override_global: z.boolean().optional(),
								responder_create_within_days: z.number().int().optional(),
								responder_validity_days: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				create_default_aia_issuer: z.boolean().optional(),
				create_default_crl: z.boolean().optional(),
				create_preview_cert: z.boolean().optional(),
				csr: z.string().optional(),
				exportable: z.boolean().optional(),
				extensions: z
					.object({
						adobe_archive_rev_info: z
							.object({ version: z.number().int().optional() })
							.passthrough()
							.optional(),
						adobe_timestamp: z
							.object({
								location: z.string().optional(),
								requires_auth: z.boolean().optional(),
								version: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						aia: z
							.object({ issuer_urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						aki: z
							.object({
								authority_name_serial_number: z.boolean().optional(),
								include: z.string().optional(),
								key_identifier: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						basic_constraints: z
							.object({
								ca: z.boolean().optional(),
								critical: z.boolean().optional(),
								path_length: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						cabf_organization_identifier: z
							.object({
								country: z.string().optional(),
								reference: z.string().optional(),
								scheme: z.string().optional(),
								state: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cdp: z
							.object({ urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						extended_key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						extensions_order: z.array(z.string()).optional(),
						issuer_alt_name: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
								skip_validation: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						lei: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						lei_role: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						microsoft_application_certificate_policies: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						microsoft_certificate_template_name: z.string().optional(),
						microsoft_certificate_template_v2: z
							.object({
								major_version: z.number().int().optional(),
								minor_version: z.number().int().optional(),
								oid: z.string().optional(),
							})
							.passthrough()
							.optional(),
						private_key_usage_period: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								not_after: z.string().optional(),
								not_before: z.string().optional(),
							})
							.passthrough()
							.optional(),
						qc_statements: z
							.object({
								critical: z.boolean().optional(),
								'etsi-psd2-qcStatement': z.array(z.string()).optional(),
								'id-etsi-qcs-QcPDS': z
									.array(
										z
											.object({
												language: z.string().optional(),
												uri: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
								'id-etsi-qcs-QcType': z.array(z.string()).optional(),
								'id-qcs-pkixQCSyntax-v2': z
									.object({ semantics_id: z.string().optional() })
									.passthrough()
									.optional(),
								oids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						san: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						ski: z
							.object({
								include: z.string().optional(),
								method: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ski_extension: z.string().optional(),
						smime_capabilities: z
							.object({ values: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						subject_directory_attributes: z
							.object({ encoded_value: z.array(z.number().int()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				hosted_type: z
					.enum(['online', 'offline', 'external', 'third_party'])
					.optional(),
				hsm_key_label: z.string().optional(),
				hsm_partition: z
					.object({
						display_name: z.string().optional(),
						id: z.string().optional(),
						partition_name: z.string().optional(),
						provider_name: z.string().optional(),
						security_level: z
							.enum(['level_1', 'level_2', 'level_3', 'level_4'])
							.optional(),
					})
					.passthrough()
					.optional(),
				id: z.string().optional(),
				is_composite_ca: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issuer: z
					.object({
						hosted_type: z
							.enum(['online', 'offline', 'third_party'])
							.optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_generation: z
					.object({
						dilithium_key_size: z.string().optional(),
						ecc_curve: z.string().optional(),
						ecdsa_curve: z.string().optional(),
						falcon_key_size: z.string().optional(),
						key_type: z.string().optional(),
						rsa_key_bits: z.number().int().optional(),
						sphincs_key_size: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_type: z.enum(['rsa', 'ecc']).optional(),
				name: z.string().optional(),
				notification: z
					.object({
						enabled: z.boolean().optional(),
						frequency: z.array(z.number().int()).optional(),
						recipients: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				number_of_ica: z.number().int().optional(),
				pem: z.string().optional(),
				private_key: z
					.object({
						password: z.string().optional(),
						pkcs12: z.array(z.number().int()).optional(),
						pre_installed: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				recertification_links: z
					.array(
						z
							.object({
								created_date: z.string().optional(),
								link_type: z.string().optional(),
								linked_ca: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				reinstate_requests: z
					.array(
						z
							.object({
								comments: z.string().optional(),
								id: z.string().optional(),
								requester_user_id: z.string().optional(),
								requester_username: z.string().optional(),
								reviewer_user_id: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				revocation: z
					.object({
						comments: z.string().optional(),
						reason: z.string().optional(),
						revoke_date: z.string().optional(),
						revoked: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				revocation_requests: z
					.array(
						z
							.object({
								comments: z.string().optional(),
								id: z.string().optional(),
								reason: z.string().optional(),
								requester_user_id: z.string().optional(),
								requester_username: z.string().optional(),
								reviewer_user_id: z.string().optional(),
								revocation_date: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				serial_number: z.string().optional(),
				signature_algorithm: z.string().optional(),
				status: z.enum(['active', 'pending_sign', 'disabled']).optional(),
				subject: z
					.object({
						common_name: z.string().optional(),
						country: z.string().optional(),
						custom_attributes: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										type: z.string().optional(),
										values: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						description: z.array(z.string()).optional(),
						dn_qualifier: z.string().optional(),
						domain_component: z.array(z.string()).optional(),
						email: z.string().optional(),
						given_name: z.array(z.string()).optional(),
						locality: z.string().optional(),
						organization_identifier: z.string().optional(),
						organization_name: z.string().optional(),
						organization_units: z.array(z.string()).optional(),
						postal_code: z.string().optional(),
						product_identifier: z.string().optional(),
						pseudonym: z.string().optional(),
						serial_number: z.string().optional(),
						state: z.string().optional(),
						street_address: z.array(z.string()).optional(),
						subject_order: z.array(z.string()).optional(),
						surname: z.array(z.string()).optional(),
						title: z.array(z.string()).optional(),
						unique_identifier: z.string().optional(),
						unstructured_address: z.array(z.string()).optional(),
						unstructured_name: z.array(z.string()).optional(),
						user_identifier: z.string().optional(),
						vendor_identifier: z.string().optional(),
					})
					.passthrough()
					.optional(),
				template: z.string().optional(),
				template_id: z.string().optional(),
				thumbprint_sha256: z.string().optional(),
				trust_type: z.string().optional(),
				trust_types: z.array(z.string()).optional(),
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_bed51bae8a4dOutput = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active_aia_issuer: z
			.object({ file_name: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		active_arl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl_cdps: z
			.object({ cdps: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
		active_eerl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		allow_unmatched_cdp: z.boolean().optional(),
		blob: z.string().optional(),
		ca_type: z.string().optional(),
		cert_type: z.string().optional(),
		configuration: z
			.object({
				aia_issuer: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				allow_extended_validity: z.boolean().optional(),
				allow_pkcs7_operations: z.boolean().optional(),
				allowed_signature_algorithms: z.array(z.string()).optional(),
				available_signature_algorithms: z.array(z.string()).optional(),
				certificate_policies: z
					.object({
						allowed_sources: z.array(z.string()).optional(),
						default_policies: z
							.object({
								critical: z.boolean().optional(),
								policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				chains: z
					.array(
						z
							.object({
								certificates: z
									.array(
										z
											.object({
												blob: z.string().optional(),
												cert_type: z.string().optional(),
												subject: z
													.object({
														common_name: z.string().optional(),
														country: z.string().optional(),
														custom_attributes: z
															.array(
																z
																	.object({
																		oid: z.string().optional(),
																		type: z.string().optional(),
																		values: z.array(z.string()).optional(),
																	})
																	.passthrough(),
															)
															.optional(),
														description: z.array(z.string()).optional(),
														dn_qualifier: z.string().optional(),
														domain_component: z.array(z.string()).optional(),
														email: z.string().optional(),
														given_name: z.array(z.string()).optional(),
														locality: z.string().optional(),
														organization_identifier: z.string().optional(),
														organization_name: z.string().optional(),
														organization_units: z.array(z.string()).optional(),
														postal_code: z.string().optional(),
														product_identifier: z.string().optional(),
														pseudonym: z.string().optional(),
														serial_number: z.string().optional(),
														state: z.string().optional(),
														street_address: z.array(z.string()).optional(),
														subject_order: z.array(z.string()).optional(),
														surname: z.array(z.string()).optional(),
														title: z.array(z.string()).optional(),
														unique_identifier: z.string().optional(),
														unstructured_address: z
															.array(z.string())
															.optional(),
														unstructured_name: z.array(z.string()).optional(),
														user_identifier: z.string().optional(),
														vendor_identifier: z.string().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								default: z.boolean().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				crl: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						end_validity_years: z.number().int().optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				include_all_certificates_in_crl: z.boolean().optional(),
				issue_end_entities: z.boolean().optional(),
				issue_ica_intermediates: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issue_unmanaged_ca: z.boolean().optional(),
				ocsp: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
						uri_path: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ocsp_responder: z
					.object({
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						certificate_template: z
							.object({
								access: z.string().optional(),
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								category: z.string().optional(),
								cert_type: z
									.enum(['root', 'intermediate', 'end_entity'])
									.optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								install_type: z.string().optional(),
								issue_types: z.array(z.string()).optional(),
								kind: z.string().optional(),
								name: z.string().optional(),
								template_json: z.string().optional(),
								trust_type: z.string().optional(),
								updated_date: z.string().optional(),
							})
							.passthrough()
							.optional(),
						delete_expired_responders: z.boolean().optional(),
						generation_enabled: z.boolean().optional(),
						hsm_partition: z
							.object({
								display_name: z.string().optional(),
								id: z.string().optional(),
								partition_name: z.string().optional(),
								provider_name: z.string().optional(),
								security_level: z
									.enum(['level_1', 'level_2', 'level_3', 'level_4'])
									.optional(),
							})
							.passthrough()
							.optional(),
						override_global: z.boolean().optional(),
						responder_create_within_days: z.number().int().optional(),
						responder_validity_days: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		create_default_aia_issuer: z.boolean().optional(),
		create_default_crl: z.boolean().optional(),
		create_preview_cert: z.boolean().optional(),
		csr: z.string().optional(),
		exportable: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z
			.enum(['online', 'offline', 'external', 'third_party'])
			.optional(),
		hsm_key_label: z.string().optional(),
		hsm_partition: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		is_composite_ca: z.boolean().optional(),
		issue_types: z.array(z.string()).optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_type: z.enum(['rsa', 'ecc']).or(z.string()).optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		number_of_ica: z.number().int().optional(),
		pem: z.string().optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		recertification_links: z
			.array(
				z
					.object({
						created_date: z.string().optional(),
						link_type: z.string().optional(),
						linked_ca: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		reinstate_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		revocation_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						reason: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
						revocation_date: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z
			.enum(['active', 'pending_sign', 'disabled'])
			.or(z.string())
			.optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		trust_types: z.array(z.string()).optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_9a3dba0916b3Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_assignments: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				active_aia_issuer: z
					.object({
						file_name: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_arl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_crl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_crl_cdps: z
					.object({ cdps: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				active_eerl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				allow_unmatched_cdp: z.boolean().optional(),
				blob: z.string().optional(),
				ca_type: z.string().optional(),
				cert_type: z.string().optional(),
				configuration: z
					.object({
						aia_issuer: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						allow_extended_validity: z.boolean().optional(),
						allow_pkcs7_operations: z.boolean().optional(),
						allowed_signature_algorithms: z.array(z.string()).optional(),
						available_signature_algorithms: z.array(z.string()).optional(),
						certificate_policies: z
							.object({
								allowed_sources: z.array(z.string()).optional(),
								default_policies: z
									.object({
										critical: z.boolean().optional(),
										policies: z
											.array(
												z
													.object({
														cps_uri: z.string().optional(),
														oid: z.string().optional(),
														user_notice: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						chains: z
							.array(
								z
									.object({
										certificates: z
											.array(
												z
													.object({
														blob: z.string().optional(),
														cert_type: z.string().optional(),
														subject: z
															.object({
																common_name: z.string().optional(),
																country: z.string().optional(),
																custom_attributes: z
																	.array(
																		z
																			.object({
																				oid: z.string().optional(),
																				type: z.string().optional(),
																				values: z.array(z.string()).optional(),
																			})
																			.passthrough(),
																	)
																	.optional(),
																description: z.array(z.string()).optional(),
																dn_qualifier: z.string().optional(),
																domain_component: z
																	.array(z.string())
																	.optional(),
																email: z.string().optional(),
																given_name: z.array(z.string()).optional(),
																locality: z.string().optional(),
																organization_identifier: z.string().optional(),
																organization_name: z.string().optional(),
																organization_units: z
																	.array(z.string())
																	.optional(),
																postal_code: z.string().optional(),
																product_identifier: z.string().optional(),
																pseudonym: z.string().optional(),
																serial_number: z.string().optional(),
																state: z.string().optional(),
																street_address: z.array(z.string()).optional(),
																subject_order: z.array(z.string()).optional(),
																surname: z.array(z.string()).optional(),
																title: z.array(z.string()).optional(),
																unique_identifier: z.string().optional(),
																unstructured_address: z
																	.array(z.string())
																	.optional(),
																unstructured_name: z
																	.array(z.string())
																	.optional(),
																user_identifier: z.string().optional(),
																vendor_identifier: z.string().optional(),
															})
															.passthrough()
															.optional(),
													})
													.passthrough(),
											)
											.optional(),
										default: z.boolean().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						crl: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								end_validity_years: z.number().int().optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						include_all_certificates_in_crl: z.boolean().optional(),
						issue_end_entities: z.boolean().optional(),
						issue_ica_intermediates: z.boolean().optional(),
						issue_types: z.array(z.string()).optional(),
						issue_unmanaged_ca: z.boolean().optional(),
						ocsp: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
								uri_path: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ocsp_responder: z
							.object({
								certificate_policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								certificate_template: z
									.object({
										access: z.string().optional(),
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										category: z.string().optional(),
										cert_type: z
											.enum(['root', 'intermediate', 'end_entity'])
											.optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										install_type: z.string().optional(),
										issue_types: z.array(z.string()).optional(),
										kind: z.string().optional(),
										name: z.string().optional(),
										template_json: z.string().optional(),
										trust_type: z.string().optional(),
										updated_date: z.string().optional(),
									})
									.passthrough()
									.optional(),
								delete_expired_responders: z.boolean().optional(),
								generation_enabled: z.boolean().optional(),
								hsm_partition: z
									.object({
										display_name: z.string().optional(),
										id: z.string().optional(),
										partition_name: z.string().optional(),
										provider_name: z.string().optional(),
										security_level: z
											.enum(['level_1', 'level_2', 'level_3', 'level_4'])
											.optional(),
									})
									.passthrough()
									.optional(),
								override_global: z.boolean().optional(),
								responder_create_within_days: z.number().int().optional(),
								responder_validity_days: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				create_default_aia_issuer: z.boolean().optional(),
				create_default_crl: z.boolean().optional(),
				create_preview_cert: z.boolean().optional(),
				csr: z.string().optional(),
				exportable: z.boolean().optional(),
				extensions: z
					.object({
						adobe_archive_rev_info: z
							.object({ version: z.number().int().optional() })
							.passthrough()
							.optional(),
						adobe_timestamp: z
							.object({
								location: z.string().optional(),
								requires_auth: z.boolean().optional(),
								version: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						aia: z
							.object({ issuer_urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						aki: z
							.object({
								authority_name_serial_number: z.boolean().optional(),
								include: z.string().optional(),
								key_identifier: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						basic_constraints: z
							.object({
								ca: z.boolean().optional(),
								critical: z.boolean().optional(),
								path_length: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						cabf_organization_identifier: z
							.object({
								country: z.string().optional(),
								reference: z.string().optional(),
								scheme: z.string().optional(),
								state: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cdp: z
							.object({ urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						extended_key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						extensions_order: z.array(z.string()).optional(),
						issuer_alt_name: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
								skip_validation: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						lei: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						lei_role: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						microsoft_application_certificate_policies: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						microsoft_certificate_template_name: z.string().optional(),
						microsoft_certificate_template_v2: z
							.object({
								major_version: z.number().int().optional(),
								minor_version: z.number().int().optional(),
								oid: z.string().optional(),
							})
							.passthrough()
							.optional(),
						private_key_usage_period: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								not_after: z.string().optional(),
								not_before: z.string().optional(),
							})
							.passthrough()
							.optional(),
						qc_statements: z
							.object({
								critical: z.boolean().optional(),
								'etsi-psd2-qcStatement': z.array(z.string()).optional(),
								'id-etsi-qcs-QcPDS': z
									.array(
										z
											.object({
												language: z.string().optional(),
												uri: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
								'id-etsi-qcs-QcType': z.array(z.string()).optional(),
								'id-qcs-pkixQCSyntax-v2': z
									.object({ semantics_id: z.string().optional() })
									.passthrough()
									.optional(),
								oids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						san: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						ski: z
							.object({
								include: z.string().optional(),
								method: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ski_extension: z.string().optional(),
						smime_capabilities: z
							.object({ values: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						subject_directory_attributes: z
							.object({ encoded_value: z.array(z.number().int()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				hosted_type: z
					.enum(['online', 'offline', 'external', 'third_party'])
					.optional(),
				hsm_key_label: z.string().optional(),
				hsm_partition: z
					.object({
						display_name: z.string().optional(),
						id: z.string().optional(),
						partition_name: z.string().optional(),
						provider_name: z.string().optional(),
						security_level: z
							.enum(['level_1', 'level_2', 'level_3', 'level_4'])
							.optional(),
					})
					.passthrough()
					.optional(),
				id: z.string().optional(),
				is_composite_ca: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issuer: z
					.object({
						hosted_type: z
							.enum(['online', 'offline', 'third_party'])
							.optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_generation: z
					.object({
						dilithium_key_size: z.string().optional(),
						ecc_curve: z.string().optional(),
						ecdsa_curve: z.string().optional(),
						falcon_key_size: z.string().optional(),
						key_type: z.string().optional(),
						rsa_key_bits: z.number().int().optional(),
						sphincs_key_size: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_type: z.enum(['rsa', 'ecc']).optional(),
				name: z.string().optional(),
				notification: z
					.object({
						enabled: z.boolean().optional(),
						frequency: z.array(z.number().int()).optional(),
						recipients: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				number_of_ica: z.number().int().optional(),
				pem: z.string().optional(),
				private_key: z
					.object({
						password: z.string().optional(),
						pkcs12: z.array(z.number().int()).optional(),
						pre_installed: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				recertification_links: z
					.array(
						z
							.object({
								created_date: z.string().optional(),
								link_type: z.string().optional(),
								linked_ca: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				reinstate_requests: z
					.array(
						z
							.object({
								comments: z.string().optional(),
								id: z.string().optional(),
								requester_user_id: z.string().optional(),
								requester_username: z.string().optional(),
								reviewer_user_id: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				revocation: z
					.object({
						comments: z.string().optional(),
						reason: z.string().optional(),
						revoke_date: z.string().optional(),
						revoked: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				revocation_requests: z
					.array(
						z
							.object({
								comments: z.string().optional(),
								id: z.string().optional(),
								reason: z.string().optional(),
								requester_user_id: z.string().optional(),
								requester_username: z.string().optional(),
								reviewer_user_id: z.string().optional(),
								revocation_date: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				serial_number: z.string().optional(),
				signature_algorithm: z.string().optional(),
				status: z.enum(['active', 'pending_sign', 'disabled']).optional(),
				subject: z
					.object({
						common_name: z.string().optional(),
						country: z.string().optional(),
						custom_attributes: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										type: z.string().optional(),
										values: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						description: z.array(z.string()).optional(),
						dn_qualifier: z.string().optional(),
						domain_component: z.array(z.string()).optional(),
						email: z.string().optional(),
						given_name: z.array(z.string()).optional(),
						locality: z.string().optional(),
						organization_identifier: z.string().optional(),
						organization_name: z.string().optional(),
						organization_units: z.array(z.string()).optional(),
						postal_code: z.string().optional(),
						product_identifier: z.string().optional(),
						pseudonym: z.string().optional(),
						serial_number: z.string().optional(),
						state: z.string().optional(),
						street_address: z.array(z.string()).optional(),
						subject_order: z.array(z.string()).optional(),
						surname: z.array(z.string()).optional(),
						title: z.array(z.string()).optional(),
						unique_identifier: z.string().optional(),
						unstructured_address: z.array(z.string()).optional(),
						unstructured_name: z.array(z.string()).optional(),
						user_identifier: z.string().optional(),
						vendor_identifier: z.string().optional(),
					})
					.passthrough()
					.optional(),
				template: z.string().optional(),
				template_id: z.string().optional(),
				thumbprint_sha256: z.string().optional(),
				trust_type: z.string().optional(),
				trust_types: z.array(z.string()).optional(),
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_9a3dba0916b3Output = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active_aia_issuer: z
			.object({ file_name: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		active_arl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl_cdps: z
			.object({ cdps: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
		active_eerl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		allow_unmatched_cdp: z.boolean().optional(),
		blob: z.string().optional(),
		ca_type: z.string().optional(),
		cert_type: z.string().optional(),
		configuration: z
			.object({
				aia_issuer: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				allow_extended_validity: z.boolean().optional(),
				allow_pkcs7_operations: z.boolean().optional(),
				allowed_signature_algorithms: z.array(z.string()).optional(),
				available_signature_algorithms: z.array(z.string()).optional(),
				certificate_policies: z
					.object({
						allowed_sources: z.array(z.string()).optional(),
						default_policies: z
							.object({
								critical: z.boolean().optional(),
								policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				chains: z
					.array(
						z
							.object({
								certificates: z
									.array(
										z
											.object({
												blob: z.string().optional(),
												cert_type: z.string().optional(),
												subject: z
													.object({
														common_name: z.string().optional(),
														country: z.string().optional(),
														custom_attributes: z
															.array(
																z
																	.object({
																		oid: z.string().optional(),
																		type: z.string().optional(),
																		values: z.array(z.string()).optional(),
																	})
																	.passthrough(),
															)
															.optional(),
														description: z.array(z.string()).optional(),
														dn_qualifier: z.string().optional(),
														domain_component: z.array(z.string()).optional(),
														email: z.string().optional(),
														given_name: z.array(z.string()).optional(),
														locality: z.string().optional(),
														organization_identifier: z.string().optional(),
														organization_name: z.string().optional(),
														organization_units: z.array(z.string()).optional(),
														postal_code: z.string().optional(),
														product_identifier: z.string().optional(),
														pseudonym: z.string().optional(),
														serial_number: z.string().optional(),
														state: z.string().optional(),
														street_address: z.array(z.string()).optional(),
														subject_order: z.array(z.string()).optional(),
														surname: z.array(z.string()).optional(),
														title: z.array(z.string()).optional(),
														unique_identifier: z.string().optional(),
														unstructured_address: z
															.array(z.string())
															.optional(),
														unstructured_name: z.array(z.string()).optional(),
														user_identifier: z.string().optional(),
														vendor_identifier: z.string().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								default: z.boolean().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				crl: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						end_validity_years: z.number().int().optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				include_all_certificates_in_crl: z.boolean().optional(),
				issue_end_entities: z.boolean().optional(),
				issue_ica_intermediates: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issue_unmanaged_ca: z.boolean().optional(),
				ocsp: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
						uri_path: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ocsp_responder: z
					.object({
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						certificate_template: z
							.object({
								access: z.string().optional(),
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								category: z.string().optional(),
								cert_type: z
									.enum(['root', 'intermediate', 'end_entity'])
									.optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								install_type: z.string().optional(),
								issue_types: z.array(z.string()).optional(),
								kind: z.string().optional(),
								name: z.string().optional(),
								template_json: z.string().optional(),
								trust_type: z.string().optional(),
								updated_date: z.string().optional(),
							})
							.passthrough()
							.optional(),
						delete_expired_responders: z.boolean().optional(),
						generation_enabled: z.boolean().optional(),
						hsm_partition: z
							.object({
								display_name: z.string().optional(),
								id: z.string().optional(),
								partition_name: z.string().optional(),
								provider_name: z.string().optional(),
								security_level: z
									.enum(['level_1', 'level_2', 'level_3', 'level_4'])
									.optional(),
							})
							.passthrough()
							.optional(),
						override_global: z.boolean().optional(),
						responder_create_within_days: z.number().int().optional(),
						responder_validity_days: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		create_default_aia_issuer: z.boolean().optional(),
		create_default_crl: z.boolean().optional(),
		create_preview_cert: z.boolean().optional(),
		csr: z.string().optional(),
		exportable: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z
			.enum(['online', 'offline', 'external', 'third_party'])
			.optional(),
		hsm_key_label: z.string().optional(),
		hsm_partition: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		is_composite_ca: z.boolean().optional(),
		issue_types: z.array(z.string()).optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_type: z.enum(['rsa', 'ecc']).or(z.string()).optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		number_of_ica: z.number().int().optional(),
		pem: z.string().optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		recertification_links: z
			.array(
				z
					.object({
						created_date: z.string().optional(),
						link_type: z.string().optional(),
						linked_ca: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		reinstate_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		revocation_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						reason: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
						revocation_date: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z
			.enum(['active', 'pending_sign', 'disabled'])
			.or(z.string())
			.optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		trust_types: z.array(z.string()).optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_39765268d88fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_assignments: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				active_aia_issuer: z
					.object({
						file_name: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_arl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_crl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				active_crl_cdps: z
					.object({ cdps: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				active_eerl: z
					.object({
						file_name: z.string().optional(),
						file_path: z.string().optional(),
						id: z.string().optional(),
					})
					.passthrough()
					.optional(),
				allow_unmatched_cdp: z.boolean().optional(),
				blob: z.string().optional(),
				ca_type: z.string().optional(),
				cert_type: z.string().optional(),
				configuration: z
					.object({
						aia_issuer: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						allow_extended_validity: z.boolean().optional(),
						allow_pkcs7_operations: z.boolean().optional(),
						allowed_signature_algorithms: z.array(z.string()).optional(),
						available_signature_algorithms: z.array(z.string()).optional(),
						certificate_policies: z
							.object({
								allowed_sources: z.array(z.string()).optional(),
								default_policies: z
									.object({
										critical: z.boolean().optional(),
										policies: z
											.array(
												z
													.object({
														cps_uri: z.string().optional(),
														oid: z.string().optional(),
														user_notice: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						chains: z
							.array(
								z
									.object({
										certificates: z
											.array(
												z
													.object({
														blob: z.string().optional(),
														cert_type: z.string().optional(),
														subject: z
															.object({
																common_name: z.string().optional(),
																country: z.string().optional(),
																custom_attributes: z
																	.array(
																		z
																			.object({
																				oid: z.string().optional(),
																				type: z.string().optional(),
																				values: z.array(z.string()).optional(),
																			})
																			.passthrough(),
																	)
																	.optional(),
																description: z.array(z.string()).optional(),
																dn_qualifier: z.string().optional(),
																domain_component: z
																	.array(z.string())
																	.optional(),
																email: z.string().optional(),
																given_name: z.array(z.string()).optional(),
																locality: z.string().optional(),
																organization_identifier: z.string().optional(),
																organization_name: z.string().optional(),
																organization_units: z
																	.array(z.string())
																	.optional(),
																postal_code: z.string().optional(),
																product_identifier: z.string().optional(),
																pseudonym: z.string().optional(),
																serial_number: z.string().optional(),
																state: z.string().optional(),
																street_address: z.array(z.string()).optional(),
																subject_order: z.array(z.string()).optional(),
																surname: z.array(z.string()).optional(),
																title: z.array(z.string()).optional(),
																unique_identifier: z.string().optional(),
																unstructured_address: z
																	.array(z.string())
																	.optional(),
																unstructured_name: z
																	.array(z.string())
																	.optional(),
																user_identifier: z.string().optional(),
																vendor_identifier: z.string().optional(),
															})
															.passthrough()
															.optional(),
													})
													.passthrough(),
											)
											.optional(),
										default: z.boolean().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						crl: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								end_validity_years: z.number().int().optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						include_all_certificates_in_crl: z.boolean().optional(),
						issue_end_entities: z.boolean().optional(),
						issue_ica_intermediates: z.boolean().optional(),
						issue_types: z.array(z.string()).optional(),
						issue_unmanaged_ca: z.boolean().optional(),
						ocsp: z
							.object({
								domains: z
									.array(
										z
											.object({
												accounts: z
													.array(
														z
															.object({
																id: z.string().optional(),
																name: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active: z.boolean().optional(),
												created_date: z.string().optional(),
												id: z.string().optional(),
												name: z.string().optional(),
												scheme: z.enum(['http', 'https', 'ldap']).optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								include: z.string().optional(),
								override_global: z.boolean().optional(),
								uri_path: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ocsp_responder: z
							.object({
								certificate_policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								certificate_template: z
									.object({
										access: z.string().optional(),
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										category: z.string().optional(),
										cert_type: z
											.enum(['root', 'intermediate', 'end_entity'])
											.optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										install_type: z.string().optional(),
										issue_types: z.array(z.string()).optional(),
										kind: z.string().optional(),
										name: z.string().optional(),
										template_json: z.string().optional(),
										trust_type: z.string().optional(),
										updated_date: z.string().optional(),
									})
									.passthrough()
									.optional(),
								delete_expired_responders: z.boolean().optional(),
								generation_enabled: z.boolean().optional(),
								hsm_partition: z
									.object({
										display_name: z.string().optional(),
										id: z.string().optional(),
										partition_name: z.string().optional(),
										provider_name: z.string().optional(),
										security_level: z
											.enum(['level_1', 'level_2', 'level_3', 'level_4'])
											.optional(),
									})
									.passthrough()
									.optional(),
								override_global: z.boolean().optional(),
								responder_create_within_days: z.number().int().optional(),
								responder_validity_days: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				create_default_aia_issuer: z.boolean().optional(),
				create_default_crl: z.boolean().optional(),
				create_preview_cert: z.boolean().optional(),
				csr: z.string().optional(),
				exportable: z.boolean().optional(),
				extensions: z
					.object({
						adobe_archive_rev_info: z
							.object({ version: z.number().int().optional() })
							.passthrough()
							.optional(),
						adobe_timestamp: z
							.object({
								location: z.string().optional(),
								requires_auth: z.boolean().optional(),
								version: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						aia: z
							.object({ issuer_urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						aki: z
							.object({
								authority_name_serial_number: z.boolean().optional(),
								include: z.string().optional(),
								key_identifier: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						basic_constraints: z
							.object({
								ca: z.boolean().optional(),
								critical: z.boolean().optional(),
								path_length: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						cabf_organization_identifier: z
							.object({
								country: z.string().optional(),
								reference: z.string().optional(),
								scheme: z.string().optional(),
								state: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cdp: z
							.object({ urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						extended_key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						extensions_order: z.array(z.string()).optional(),
						issuer_alt_name: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
								skip_validation: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						lei: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						lei_role: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						microsoft_application_certificate_policies: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						microsoft_certificate_template_name: z.string().optional(),
						microsoft_certificate_template_v2: z
							.object({
								major_version: z.number().int().optional(),
								minor_version: z.number().int().optional(),
								oid: z.string().optional(),
							})
							.passthrough()
							.optional(),
						private_key_usage_period: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								not_after: z.string().optional(),
								not_before: z.string().optional(),
							})
							.passthrough()
							.optional(),
						qc_statements: z
							.object({
								critical: z.boolean().optional(),
								'etsi-psd2-qcStatement': z.array(z.string()).optional(),
								'id-etsi-qcs-QcPDS': z
									.array(
										z
											.object({
												language: z.string().optional(),
												uri: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
								'id-etsi-qcs-QcType': z.array(z.string()).optional(),
								'id-qcs-pkixQCSyntax-v2': z
									.object({ semantics_id: z.string().optional() })
									.passthrough()
									.optional(),
								oids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						san: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						ski: z
							.object({
								include: z.string().optional(),
								method: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ski_extension: z.string().optional(),
						smime_capabilities: z
							.object({ values: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						subject_directory_attributes: z
							.object({ encoded_value: z.array(z.number().int()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				hosted_type: z
					.enum(['online', 'offline', 'external', 'third_party'])
					.optional(),
				hsm_key_label: z.string().optional(),
				hsm_partition: z
					.object({
						display_name: z.string().optional(),
						id: z.string().optional(),
						partition_name: z.string().optional(),
						provider_name: z.string().optional(),
						security_level: z
							.enum(['level_1', 'level_2', 'level_3', 'level_4'])
							.optional(),
					})
					.passthrough()
					.optional(),
				id: z.string().optional(),
				is_composite_ca: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issuer: z
					.object({
						hosted_type: z
							.enum(['online', 'offline', 'third_party'])
							.optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_generation: z
					.object({
						dilithium_key_size: z.string().optional(),
						ecc_curve: z.string().optional(),
						ecdsa_curve: z.string().optional(),
						falcon_key_size: z.string().optional(),
						key_type: z.string().optional(),
						rsa_key_bits: z.number().int().optional(),
						sphincs_key_size: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_type: z.enum(['rsa', 'ecc']).optional(),
				name: z.string().optional(),
				notification: z
					.object({
						enabled: z.boolean().optional(),
						frequency: z.array(z.number().int()).optional(),
						recipients: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				number_of_ica: z.number().int().optional(),
				pem: z.string().optional(),
				private_key: z
					.object({
						password: z.string().optional(),
						pkcs12: z.array(z.number().int()).optional(),
						pre_installed: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				recertification_links: z
					.array(
						z
							.object({
								created_date: z.string().optional(),
								link_type: z.string().optional(),
								linked_ca: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				reinstate_requests: z
					.array(
						z
							.object({
								comments: z.string().optional(),
								id: z.string().optional(),
								requester_user_id: z.string().optional(),
								requester_username: z.string().optional(),
								reviewer_user_id: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				revocation: z
					.object({
						comments: z.string().optional(),
						reason: z.string().optional(),
						revoke_date: z.string().optional(),
						revoked: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				revocation_requests: z
					.array(
						z
							.object({
								comments: z.string().optional(),
								id: z.string().optional(),
								reason: z.string().optional(),
								requester_user_id: z.string().optional(),
								requester_username: z.string().optional(),
								reviewer_user_id: z.string().optional(),
								revocation_date: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				serial_number: z.string().optional(),
				signature_algorithm: z.string().optional(),
				status: z.enum(['active', 'pending_sign', 'disabled']).optional(),
				subject: z
					.object({
						common_name: z.string().optional(),
						country: z.string().optional(),
						custom_attributes: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										type: z.string().optional(),
										values: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						description: z.array(z.string()).optional(),
						dn_qualifier: z.string().optional(),
						domain_component: z.array(z.string()).optional(),
						email: z.string().optional(),
						given_name: z.array(z.string()).optional(),
						locality: z.string().optional(),
						organization_identifier: z.string().optional(),
						organization_name: z.string().optional(),
						organization_units: z.array(z.string()).optional(),
						postal_code: z.string().optional(),
						product_identifier: z.string().optional(),
						pseudonym: z.string().optional(),
						serial_number: z.string().optional(),
						state: z.string().optional(),
						street_address: z.array(z.string()).optional(),
						subject_order: z.array(z.string()).optional(),
						surname: z.array(z.string()).optional(),
						title: z.array(z.string()).optional(),
						unique_identifier: z.string().optional(),
						unstructured_address: z.array(z.string()).optional(),
						unstructured_name: z.array(z.string()).optional(),
						user_identifier: z.string().optional(),
						vendor_identifier: z.string().optional(),
					})
					.passthrough()
					.optional(),
				template: z.string().optional(),
				template_id: z.string().optional(),
				thumbprint_sha256: z.string().optional(),
				trust_type: z.string().optional(),
				trust_types: z.array(z.string()).optional(),
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_39765268d88fOutput = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active_aia_issuer: z
			.object({ file_name: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		active_arl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		active_crl_cdps: z
			.object({ cdps: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
		active_eerl: z
			.object({
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		allow_unmatched_cdp: z.boolean().optional(),
		blob: z.string().optional(),
		ca_type: z.string().optional(),
		cert_type: z.string().optional(),
		configuration: z
			.object({
				aia_issuer: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				allow_extended_validity: z.boolean().optional(),
				allow_pkcs7_operations: z.boolean().optional(),
				allowed_signature_algorithms: z.array(z.string()).optional(),
				available_signature_algorithms: z.array(z.string()).optional(),
				certificate_policies: z
					.object({
						allowed_sources: z.array(z.string()).optional(),
						default_policies: z
							.object({
								critical: z.boolean().optional(),
								policies: z
									.array(
										z
											.object({
												cps_uri: z.string().optional(),
												oid: z.string().optional(),
												user_notice: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				chains: z
					.array(
						z
							.object({
								certificates: z
									.array(
										z
											.object({
												blob: z.string().optional(),
												cert_type: z.string().optional(),
												subject: z
													.object({
														common_name: z.string().optional(),
														country: z.string().optional(),
														custom_attributes: z
															.array(
																z
																	.object({
																		oid: z.string().optional(),
																		type: z.string().optional(),
																		values: z.array(z.string()).optional(),
																	})
																	.passthrough(),
															)
															.optional(),
														description: z.array(z.string()).optional(),
														dn_qualifier: z.string().optional(),
														domain_component: z.array(z.string()).optional(),
														email: z.string().optional(),
														given_name: z.array(z.string()).optional(),
														locality: z.string().optional(),
														organization_identifier: z.string().optional(),
														organization_name: z.string().optional(),
														organization_units: z.array(z.string()).optional(),
														postal_code: z.string().optional(),
														product_identifier: z.string().optional(),
														pseudonym: z.string().optional(),
														serial_number: z.string().optional(),
														state: z.string().optional(),
														street_address: z.array(z.string()).optional(),
														subject_order: z.array(z.string()).optional(),
														surname: z.array(z.string()).optional(),
														title: z.array(z.string()).optional(),
														unique_identifier: z.string().optional(),
														unstructured_address: z
															.array(z.string())
															.optional(),
														unstructured_name: z.array(z.string()).optional(),
														user_identifier: z.string().optional(),
														vendor_identifier: z.string().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								default: z.boolean().optional(),
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				crl: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						end_validity_years: z.number().int().optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				include_all_certificates_in_crl: z.boolean().optional(),
				issue_end_entities: z.boolean().optional(),
				issue_ica_intermediates: z.boolean().optional(),
				issue_types: z.array(z.string()).optional(),
				issue_unmanaged_ca: z.boolean().optional(),
				ocsp: z
					.object({
						domains: z
							.array(
								z
									.object({
										accounts: z
											.array(
												z
													.object({
														id: z.string().optional(),
														name: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active: z.boolean().optional(),
										created_date: z.string().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										scheme: z
											.enum(['http', 'https', 'ldap'])
											.or(z.string())
											.optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						include: z.string().optional(),
						override_global: z.boolean().optional(),
						uri_path: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ocsp_responder: z
					.object({
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						certificate_template: z
							.object({
								access: z.string().optional(),
								accounts: z
									.array(
										z
											.object({
												id: z.string().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active: z.boolean().optional(),
								category: z.string().optional(),
								cert_type: z
									.enum(['root', 'intermediate', 'end_entity'])
									.optional(),
								created_date: z.string().optional(),
								id: z.string().optional(),
								install_type: z.string().optional(),
								issue_types: z.array(z.string()).optional(),
								kind: z.string().optional(),
								name: z.string().optional(),
								template_json: z.string().optional(),
								trust_type: z.string().optional(),
								updated_date: z.string().optional(),
							})
							.passthrough()
							.optional(),
						delete_expired_responders: z.boolean().optional(),
						generation_enabled: z.boolean().optional(),
						hsm_partition: z
							.object({
								display_name: z.string().optional(),
								id: z.string().optional(),
								partition_name: z.string().optional(),
								provider_name: z.string().optional(),
								security_level: z
									.enum(['level_1', 'level_2', 'level_3', 'level_4'])
									.optional(),
							})
							.passthrough()
							.optional(),
						override_global: z.boolean().optional(),
						responder_create_within_days: z.number().int().optional(),
						responder_validity_days: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		create_default_aia_issuer: z.boolean().optional(),
		create_default_crl: z.boolean().optional(),
		create_preview_cert: z.boolean().optional(),
		csr: z.string().optional(),
		exportable: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z
			.enum(['online', 'offline', 'external', 'third_party'])
			.optional(),
		hsm_key_label: z.string().optional(),
		hsm_partition: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		is_composite_ca: z.boolean().optional(),
		issue_types: z.array(z.string()).optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_type: z.enum(['rsa', 'ecc']).or(z.string()).optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		number_of_ica: z.number().int().optional(),
		pem: z.string().optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		recertification_links: z
			.array(
				z
					.object({
						created_date: z.string().optional(),
						link_type: z.string().optional(),
						linked_ca: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		reinstate_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		revocation_requests: z
			.array(
				z
					.object({
						comments: z.string().optional(),
						id: z.string().optional(),
						reason: z.string().optional(),
						requester_user_id: z.string().optional(),
						requester_username: z.string().optional(),
						reviewer_user_id: z.string().optional(),
						revocation_date: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z
			.enum(['active', 'pending_sign', 'disabled'])
			.or(z.string())
			.optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		trust_types: z.array(z.string()).optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_96e6bdf242a9Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				blob: z.string().optional(),
				created_date: z.string().optional(),
				csr: z.array(z.number().int()).optional(),
				csr_blob: z.string().optional(),
				delegated_scope: z
					.object({
						ica_rules: z
							.object({})
							.catchall(
								z
									.object({
										allow_ee: z.boolean().optional(),
										allow_intermediate: z.boolean().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				extensions: z
					.object({
						adobe_archive_rev_info: z
							.object({ version: z.number().int().optional() })
							.passthrough()
							.optional(),
						adobe_timestamp: z
							.object({
								location: z.string().optional(),
								requires_auth: z.boolean().optional(),
								version: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						aia: z
							.object({ issuer_urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						aki: z
							.object({
								authority_name_serial_number: z.boolean().optional(),
								include: z.string().optional(),
								key_identifier: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						basic_constraints: z
							.object({
								ca: z.boolean().optional(),
								critical: z.boolean().optional(),
								path_length: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						cabf_organization_identifier: z
							.object({
								country: z.string().optional(),
								reference: z.string().optional(),
								scheme: z.string().optional(),
								state: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cdp: z
							.object({ urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						extended_key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						extensions_order: z.array(z.string()).optional(),
						issuer_alt_name: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
								skip_validation: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						lei: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						lei_role: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						microsoft_application_certificate_policies: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						microsoft_certificate_template_name: z.string().optional(),
						microsoft_certificate_template_v2: z
							.object({
								major_version: z.number().int().optional(),
								minor_version: z.number().int().optional(),
								oid: z.string().optional(),
							})
							.passthrough()
							.optional(),
						private_key_usage_period: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								not_after: z.string().optional(),
								not_before: z.string().optional(),
							})
							.passthrough()
							.optional(),
						qc_statements: z
							.object({
								critical: z.boolean().optional(),
								'etsi-psd2-qcStatement': z.array(z.string()).optional(),
								'id-etsi-qcs-QcPDS': z
									.array(
										z
											.object({
												language: z.string().optional(),
												uri: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
								'id-etsi-qcs-QcType': z.array(z.string()).optional(),
								'id-qcs-pkixQCSyntax-v2': z
									.object({ semantics_id: z.string().optional() })
									.passthrough()
									.optional(),
								oids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						san: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						ski: z
							.object({
								include: z.string().optional(),
								method: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ski_extension: z.string().optional(),
						smime_capabilities: z
							.object({ values: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						subject_directory_attributes: z
							.object({ encoded_value: z.array(z.number().int()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				hsm_provider: z
					.object({
						display_name: z.string().optional(),
						id: z.string().optional(),
						partition_name: z.string().optional(),
						provider_name: z.string().optional(),
						security_level: z
							.enum(['level_1', 'level_2', 'level_3', 'level_4'])
							.optional(),
					})
					.passthrough()
					.optional(),
				id: z.string().optional(),
				issuer: z
					.object({
						hosted_type: z
							.enum(['online', 'offline', 'third_party'])
							.optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_generation: z
					.object({
						dilithium_key_size: z.string().optional(),
						ecc_curve: z.string().optional(),
						ecdsa_curve: z.string().optional(),
						falcon_key_size: z.string().optional(),
						key_type: z.string().optional(),
						rsa_key_bits: z.number().int().optional(),
						sphincs_key_size: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_name: z.string().optional(),
				name: z.string().optional(),
				notification: z
					.object({
						enabled: z.boolean().optional(),
						frequency: z.array(z.number().int()).optional(),
						recipients: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				private_key: z
					.object({
						password: z.string().optional(),
						pkcs12: z.array(z.number().int()).optional(),
						pre_installed: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				responder_type: z.string().optional(),
				serial_number: z.string().optional(),
				signature_algorithm: z.string().optional(),
				status: z.string().optional(),
				updated_date: z.string().optional(),
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				validity_truncate: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_96e6bdf242a9Output = z
	.object({
		blob: z.string().optional(),
		created_date: z.string().optional(),
		csr: z.array(z.number().int()).optional(),
		csr_blob: z.string().optional(),
		delegated_scope: z
			.object({
				ica_rules: z
					.object({})
					.catchall(
						z
							.object({
								allow_ee: z.boolean().optional(),
								allow_intermediate: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hsm_provider: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_name: z.string().optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		responder_type: z.string().optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z.string().optional(),
		updated_date: z.string().optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validity_truncate: z.boolean().optional(),
	})
	.passthrough();
const r_672dcfb0f9e0Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.number().int().optional(),
				limit: z.number().int().optional(),
				sort: z.string().optional(),
				filters: z.string().optional(),
				serial_number: z.string().optional(),
				subject_key_id: z.string().optional(),
				subject_public_key: z.string().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_672dcfb0f9e0Output = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							account_assignments: z
								.array(
									z
										.object({
											id: z.string().optional(),
											name: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							account_id: z.string().optional(),
							blob: z.array(z.number().int()).optional(),
							cert_type: z.string().optional(),
							chain: z
								.array(
									z
										.object({
											blob: z.string().optional(),
											cert_type: z.string().optional(),
											subject: z
												.object({
													common_name: z.string().optional(),
													country: z.string().optional(),
													custom_attributes: z
														.array(
															z
																.object({
																	oid: z.string().optional(),
																	type: z.string().optional(),
																	values: z.array(z.string()).optional(),
																})
																.passthrough(),
														)
														.optional(),
													description: z.array(z.string()).optional(),
													dn_qualifier: z.string().optional(),
													domain_component: z.array(z.string()).optional(),
													email: z.string().optional(),
													given_name: z.array(z.string()).optional(),
													locality: z.string().optional(),
													organization_identifier: z.string().optional(),
													organization_name: z.string().optional(),
													organization_units: z.array(z.string()).optional(),
													postal_code: z.string().optional(),
													product_identifier: z.string().optional(),
													pseudonym: z.string().optional(),
													serial_number: z.string().optional(),
													state: z.string().optional(),
													street_address: z.array(z.string()).optional(),
													subject_order: z.array(z.string()).optional(),
													surname: z.array(z.string()).optional(),
													title: z.array(z.string()).optional(),
													unique_identifier: z.string().optional(),
													unstructured_address: z.array(z.string()).optional(),
													unstructured_name: z.array(z.string()).optional(),
													user_identifier: z.string().optional(),
													vendor_identifier: z.string().optional(),
												})
												.passthrough()
												.optional(),
										})
										.passthrough(),
								)
								.optional(),
							csr: z.string().optional(),
							csr_type: z.string().optional(),
							custom_values: z.object({}).passthrough().optional(),
							escrow_private_key: z.boolean().optional(),
							extensions: z
								.object({
									adobe_archive_rev_info: z
										.object({ version: z.number().int().optional() })
										.passthrough()
										.optional(),
									adobe_timestamp: z
										.object({
											location: z.string().optional(),
											requires_auth: z.boolean().optional(),
											version: z.number().int().optional(),
										})
										.passthrough()
										.optional(),
									aia: z
										.object({ issuer_urls: z.array(z.string()).optional() })
										.passthrough()
										.optional(),
									aki: z
										.object({
											authority_name_serial_number: z.boolean().optional(),
											include: z.string().optional(),
											key_identifier: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									basic_constraints: z
										.object({
											ca: z.boolean().optional(),
											critical: z.boolean().optional(),
											path_length: z.number().int().optional(),
										})
										.passthrough()
										.optional(),
									cabf_organization_identifier: z
										.object({
											country: z.string().optional(),
											reference: z.string().optional(),
											scheme: z.string().optional(),
											state: z.string().optional(),
										})
										.passthrough()
										.optional(),
									cdp: z
										.object({ urls: z.array(z.string()).optional() })
										.passthrough()
										.optional(),
									certificate_policies: z
										.array(
											z
												.object({
													cps_uri: z.string().optional(),
													oid: z.string().optional(),
													user_notice: z.string().optional(),
												})
												.passthrough(),
										)
										.optional(),
									extended_key_usage: z
										.object({
											additional_values: z.array(z.string()).optional(),
											critical: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									extensions_order: z.array(z.string()).optional(),
									issuer_alt_name: z
										.object({
											directory_names: z
												.array(
													z
														.object({
															common_name: z.string().optional(),
															country: z.string().optional(),
															custom_attributes: z
																.array(
																	z
																		.object({
																			oid: z.string().optional(),
																			type: z.string().optional(),
																			values: z.array(z.string()).optional(),
																		})
																		.passthrough(),
																)
																.optional(),
															description: z.array(z.string()).optional(),
															dn_qualifier: z.string().optional(),
															domain_component: z.array(z.string()).optional(),
															email: z.string().optional(),
															given_name: z.array(z.string()).optional(),
															locality: z.string().optional(),
															organization_identifier: z.string().optional(),
															organization_name: z.string().optional(),
															organization_units: z
																.array(z.string())
																.optional(),
															postal_code: z.string().optional(),
															product_identifier: z.string().optional(),
															pseudonym: z.string().optional(),
															serial_number: z.string().optional(),
															state: z.string().optional(),
															street_address: z.array(z.string()).optional(),
															subject_order: z.array(z.string()).optional(),
															surname: z.array(z.string()).optional(),
															title: z.array(z.string()).optional(),
															unique_identifier: z.string().optional(),
															unstructured_address: z
																.array(z.string())
																.optional(),
															unstructured_name: z.array(z.string()).optional(),
															user_identifier: z.string().optional(),
															vendor_identifier: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											dns_names: z.array(z.string()).optional(),
											emails: z.array(z.string()).optional(),
											ip_addresses: z.array(z.string()).optional(),
											other_names: z
												.object({
													domain_controller_id: z.array(z.string()).optional(),
													guid: z.array(z.string()).optional(),
													hardware_module_name: z
														.array(
															z
																.object({
																	serial_num: z
																		.array(z.number().int())
																		.optional(),
																	type: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
													raw_other_names: z
														.array(
															z
																.object({
																	oid: z.string().optional(),
																	value: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
												})
												.passthrough()
												.optional(),
											uris: z.array(z.string()).optional(),
											user_principal_names: z.array(z.string()).optional(),
										})
										.passthrough()
										.optional(),
									key_usage: z
										.object({
											additional_values: z.array(z.string()).optional(),
											critical: z.boolean().optional(),
											skip_validation: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									lei: z
										.object({ value: z.string().optional() })
										.passthrough()
										.optional(),
									lei_role: z
										.object({ value: z.string().optional() })
										.passthrough()
										.optional(),
									microsoft_application_certificate_policies: z
										.object({
											additional_values: z.array(z.string()).optional(),
											critical: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									microsoft_certificate_template_name: z.string().optional(),
									microsoft_certificate_template_v2: z
										.object({
											major_version: z.number().int().optional(),
											minor_version: z.number().int().optional(),
											oid: z.string().optional(),
										})
										.passthrough()
										.optional(),
									private_key_usage_period: z
										.object({
											critical: unspecifiedProviderValue().optional(),
											not_after: z.string().optional(),
											not_before: z.string().optional(),
										})
										.passthrough()
										.optional(),
									qc_statements: z
										.object({
											critical: z.boolean().optional(),
											'etsi-psd2-qcStatement': z.array(z.string()).optional(),
											'id-etsi-qcs-QcPDS': z
												.array(
													z
														.object({
															language: z.string().optional(),
															uri: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											'id-etsi-qcs-QcRetentionPeriod': z
												.number()
												.int()
												.optional(),
											'id-etsi-qcs-QcType': z.array(z.string()).optional(),
											'id-qcs-pkixQCSyntax-v2': z
												.object({ semantics_id: z.string().optional() })
												.passthrough()
												.optional(),
											oids: z.array(z.string()).optional(),
										})
										.passthrough()
										.optional(),
									san: z
										.object({
											directory_names: z
												.array(
													z
														.object({
															common_name: z.string().optional(),
															country: z.string().optional(),
															custom_attributes: z
																.array(
																	z
																		.object({
																			oid: z.string().optional(),
																			type: z.string().optional(),
																			values: z.array(z.string()).optional(),
																		})
																		.passthrough(),
																)
																.optional(),
															description: z.array(z.string()).optional(),
															dn_qualifier: z.string().optional(),
															domain_component: z.array(z.string()).optional(),
															email: z.string().optional(),
															given_name: z.array(z.string()).optional(),
															locality: z.string().optional(),
															organization_identifier: z.string().optional(),
															organization_name: z.string().optional(),
															organization_units: z
																.array(z.string())
																.optional(),
															postal_code: z.string().optional(),
															product_identifier: z.string().optional(),
															pseudonym: z.string().optional(),
															serial_number: z.string().optional(),
															state: z.string().optional(),
															street_address: z.array(z.string()).optional(),
															subject_order: z.array(z.string()).optional(),
															surname: z.array(z.string()).optional(),
															title: z.array(z.string()).optional(),
															unique_identifier: z.string().optional(),
															unstructured_address: z
																.array(z.string())
																.optional(),
															unstructured_name: z.array(z.string()).optional(),
															user_identifier: z.string().optional(),
															vendor_identifier: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											dns_names: z.array(z.string()).optional(),
											emails: z.array(z.string()).optional(),
											ip_addresses: z.array(z.string()).optional(),
											other_names: z
												.object({
													domain_controller_id: z.array(z.string()).optional(),
													guid: z.array(z.string()).optional(),
													hardware_module_name: z
														.array(
															z
																.object({
																	serial_num: z
																		.array(z.number().int())
																		.optional(),
																	type: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
													raw_other_names: z
														.array(
															z
																.object({
																	oid: z.string().optional(),
																	value: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
												})
												.passthrough()
												.optional(),
											uris: z.array(z.string()).optional(),
											user_principal_names: z.array(z.string()).optional(),
										})
										.passthrough()
										.optional(),
									security_identifier: z
										.array(
											z
												.object({
													oid: z.string().optional(),
													value: z.string().optional(),
												})
												.passthrough(),
										)
										.optional(),
									ski: z
										.object({
											include: z.string().optional(),
											method: z.string().optional(),
										})
										.passthrough()
										.optional(),
									ski_extension: z.string().optional(),
									smime_capabilities: z
										.object({ values: z.array(z.string()).optional() })
										.passthrough()
										.optional(),
									subject_directory_attributes: z
										.object({
											encoded_value: z.array(z.number().int()).optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough()
								.optional(),
							hosted_type: z.string().optional(),
							id: z.string().optional(),
							issuer: z
								.object({
									id: z.string().optional(),
									name: z.string().optional(),
									trust_type: z.string().optional(),
								})
								.passthrough()
								.optional(),
							issuer_subject: z
								.object({
									common_name: z.string().optional(),
									country: z.string().optional(),
									custom_attributes: z
										.array(
											z
												.object({
													oid: z.string().optional(),
													type: z.string().optional(),
													values: z.array(z.string()).optional(),
												})
												.passthrough(),
										)
										.optional(),
									description: z.array(z.string()).optional(),
									dn_qualifier: z.string().optional(),
									domain_component: z.array(z.string()).optional(),
									email: z.string().optional(),
									given_name: z.array(z.string()).optional(),
									locality: z.string().optional(),
									organization_identifier: z.string().optional(),
									organization_name: z.string().optional(),
									organization_units: z.array(z.string()).optional(),
									postal_code: z.string().optional(),
									product_identifier: z.string().optional(),
									pseudonym: z.string().optional(),
									serial_number: z.string().optional(),
									state: z.string().optional(),
									street_address: z.array(z.string()).optional(),
									subject_order: z.array(z.string()).optional(),
									surname: z.array(z.string()).optional(),
									title: z.array(z.string()).optional(),
									unique_identifier: z.string().optional(),
									unstructured_address: z.array(z.string()).optional(),
									unstructured_name: z.array(z.string()).optional(),
									user_identifier: z.string().optional(),
									vendor_identifier: z.string().optional(),
								})
								.passthrough()
								.optional(),
							key_generation: z
								.object({
									dilithium_key_size: z.string().optional(),
									ecc_curve: z.string().optional(),
									ecdsa_curve: z.string().optional(),
									falcon_key_size: z.string().optional(),
									key_type: z.string().optional(),
									rsa_key_bits: z.number().int().optional(),
									sphincs_key_size: z.string().optional(),
								})
								.passthrough()
								.optional(),
							kind: z.string().optional(),
							notification: z
								.object({
									enabled: z.boolean().optional(),
									frequency: z.array(z.number().int()).optional(),
									recipients: z.array(z.string()).optional(),
								})
								.passthrough()
								.optional(),
							ocsp_key_hash_alg: z.string().optional(),
							options: z
								.object({ chain_name: z.string().optional() })
								.passthrough()
								.optional(),
							revocation: z
								.object({
									comments: z.string().optional(),
									reason: z.string().optional(),
									revoke_date: z.string().optional(),
									revoked: z.boolean().optional(),
								})
								.passthrough()
								.optional(),
							serial_number: z.string().optional(),
							signature_algorithm: z.string().optional(),
							subject: z
								.object({
									common_name: z.string().optional(),
									country: z.string().optional(),
									custom_attributes: z
										.array(
											z
												.object({
													oid: z.string().optional(),
													type: z.string().optional(),
													values: z.array(z.string()).optional(),
												})
												.passthrough(),
										)
										.optional(),
									description: z.array(z.string()).optional(),
									dn_qualifier: z.string().optional(),
									domain_component: z.array(z.string()).optional(),
									email: z.string().optional(),
									given_name: z.array(z.string()).optional(),
									locality: z.string().optional(),
									organization_identifier: z.string().optional(),
									organization_name: z.string().optional(),
									organization_units: z.array(z.string()).optional(),
									postal_code: z.string().optional(),
									product_identifier: z.string().optional(),
									pseudonym: z.string().optional(),
									serial_number: z.string().optional(),
									state: z.string().optional(),
									street_address: z.array(z.string()).optional(),
									subject_order: z.array(z.string()).optional(),
									surname: z.array(z.string()).optional(),
									title: z.array(z.string()).optional(),
									unique_identifier: z.string().optional(),
									unstructured_address: z.array(z.string()).optional(),
									unstructured_name: z.array(z.string()).optional(),
									user_identifier: z.string().optional(),
									vendor_identifier: z.string().optional(),
								})
								.passthrough()
								.optional(),
							template: z.string().optional(),
							template_id: z.string().optional(),
							thumbprint_sha256: z.string().optional(),
							trust_type: z.string().optional(),
							validity: z
								.object({
									duration_unit: z.string().optional(),
									duration_value: z.number().int().optional(),
									valid_from: z.string().optional(),
									valid_to: z.string().optional(),
								})
								.passthrough()
								.optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_62e5e3240f68Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_assignments: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				account_id: z.string().optional(),
				blob: z.array(z.number().int()).optional(),
				cert_type: z.string().optional(),
				chain: z
					.array(
						z
							.object({
								blob: z.string().optional(),
								cert_type: z.string().optional(),
								subject: z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				csr: z.string().optional(),
				csr_type: z.string().optional(),
				custom_values: z.object({}).passthrough().optional(),
				escrow_private_key: z.boolean().optional(),
				extensions: z
					.object({
						adobe_archive_rev_info: z
							.object({ version: z.number().int().optional() })
							.passthrough()
							.optional(),
						adobe_timestamp: z
							.object({
								location: z.string().optional(),
								requires_auth: z.boolean().optional(),
								version: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						aia: z
							.object({ issuer_urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						aki: z
							.object({
								authority_name_serial_number: z.boolean().optional(),
								include: z.string().optional(),
								key_identifier: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						basic_constraints: z
							.object({
								ca: z.boolean().optional(),
								critical: z.boolean().optional(),
								path_length: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						cabf_organization_identifier: z
							.object({
								country: z.string().optional(),
								reference: z.string().optional(),
								scheme: z.string().optional(),
								state: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cdp: z
							.object({ urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						extended_key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						extensions_order: z.array(z.string()).optional(),
						issuer_alt_name: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
								skip_validation: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						lei: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						lei_role: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						microsoft_application_certificate_policies: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						microsoft_certificate_template_name: z.string().optional(),
						microsoft_certificate_template_v2: z
							.object({
								major_version: z.number().int().optional(),
								minor_version: z.number().int().optional(),
								oid: z.string().optional(),
							})
							.passthrough()
							.optional(),
						private_key_usage_period: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								not_after: z.string().optional(),
								not_before: z.string().optional(),
							})
							.passthrough()
							.optional(),
						qc_statements: z
							.object({
								critical: z.boolean().optional(),
								'etsi-psd2-qcStatement': z.array(z.string()).optional(),
								'id-etsi-qcs-QcPDS': z
									.array(
										z
											.object({
												language: z.string().optional(),
												uri: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
								'id-etsi-qcs-QcType': z.array(z.string()).optional(),
								'id-qcs-pkixQCSyntax-v2': z
									.object({ semantics_id: z.string().optional() })
									.passthrough()
									.optional(),
								oids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						san: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						ski: z
							.object({
								include: z.string().optional(),
								method: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ski_extension: z.string().optional(),
						smime_capabilities: z
							.object({ values: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						subject_directory_attributes: z
							.object({ encoded_value: z.array(z.number().int()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				hosted_type: z.string().optional(),
				id: z.string().optional(),
				issuer: z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						trust_type: z.string().optional(),
					})
					.passthrough()
					.optional(),
				issuer_subject: z
					.object({
						common_name: z.string().optional(),
						country: z.string().optional(),
						custom_attributes: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										type: z.string().optional(),
										values: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						description: z.array(z.string()).optional(),
						dn_qualifier: z.string().optional(),
						domain_component: z.array(z.string()).optional(),
						email: z.string().optional(),
						given_name: z.array(z.string()).optional(),
						locality: z.string().optional(),
						organization_identifier: z.string().optional(),
						organization_name: z.string().optional(),
						organization_units: z.array(z.string()).optional(),
						postal_code: z.string().optional(),
						product_identifier: z.string().optional(),
						pseudonym: z.string().optional(),
						serial_number: z.string().optional(),
						state: z.string().optional(),
						street_address: z.array(z.string()).optional(),
						subject_order: z.array(z.string()).optional(),
						surname: z.array(z.string()).optional(),
						title: z.array(z.string()).optional(),
						unique_identifier: z.string().optional(),
						unstructured_address: z.array(z.string()).optional(),
						unstructured_name: z.array(z.string()).optional(),
						user_identifier: z.string().optional(),
						vendor_identifier: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_generation: z
					.object({
						dilithium_key_size: z.string().optional(),
						ecc_curve: z.string().optional(),
						ecdsa_curve: z.string().optional(),
						falcon_key_size: z.string().optional(),
						key_type: z.string().optional(),
						rsa_key_bits: z.number().int().optional(),
						sphincs_key_size: z.string().optional(),
					})
					.passthrough()
					.optional(),
				kind: z.string().optional(),
				notification: z
					.object({
						enabled: z.boolean().optional(),
						frequency: z.array(z.number().int()).optional(),
						recipients: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				ocsp_key_hash_alg: z.string().optional(),
				options: z
					.object({ chain_name: z.string().optional() })
					.passthrough()
					.optional(),
				revocation: z
					.object({
						comments: z.string().optional(),
						reason: z.string().optional(),
						revoke_date: z.string().optional(),
						revoked: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				serial_number: z.string().optional(),
				signature_algorithm: z.string().optional(),
				subject: z
					.object({
						common_name: z.string().optional(),
						country: z.string().optional(),
						custom_attributes: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										type: z.string().optional(),
										values: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						description: z.array(z.string()).optional(),
						dn_qualifier: z.string().optional(),
						domain_component: z.array(z.string()).optional(),
						email: z.string().optional(),
						given_name: z.array(z.string()).optional(),
						locality: z.string().optional(),
						organization_identifier: z.string().optional(),
						organization_name: z.string().optional(),
						organization_units: z.array(z.string()).optional(),
						postal_code: z.string().optional(),
						product_identifier: z.string().optional(),
						pseudonym: z.string().optional(),
						serial_number: z.string().optional(),
						state: z.string().optional(),
						street_address: z.array(z.string()).optional(),
						subject_order: z.array(z.string()).optional(),
						surname: z.array(z.string()).optional(),
						title: z.array(z.string()).optional(),
						unique_identifier: z.string().optional(),
						unstructured_address: z.array(z.string()).optional(),
						unstructured_name: z.array(z.string()).optional(),
						user_identifier: z.string().optional(),
						vendor_identifier: z.string().optional(),
					})
					.passthrough()
					.optional(),
				template: z.string().optional(),
				template_id: z.string().optional(),
				thumbprint_sha256: z.string().optional(),
				trust_type: z.string().optional(),
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_62e5e3240f68Output = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		account_id: z.string().optional(),
		blob: z.array(z.number().int()).optional(),
		cert_type: z.string().optional(),
		chain: z
			.array(
				z
					.object({
						blob: z.string().optional(),
						cert_type: z.string().optional(),
						subject: z
							.object({
								common_name: z.string().optional(),
								country: z.string().optional(),
								custom_attributes: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												type: z.string().optional(),
												values: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								description: z.array(z.string()).optional(),
								dn_qualifier: z.string().optional(),
								domain_component: z.array(z.string()).optional(),
								email: z.string().optional(),
								given_name: z.array(z.string()).optional(),
								locality: z.string().optional(),
								organization_identifier: z.string().optional(),
								organization_name: z.string().optional(),
								organization_units: z.array(z.string()).optional(),
								postal_code: z.string().optional(),
								product_identifier: z.string().optional(),
								pseudonym: z.string().optional(),
								serial_number: z.string().optional(),
								state: z.string().optional(),
								street_address: z.array(z.string()).optional(),
								subject_order: z.array(z.string()).optional(),
								surname: z.array(z.string()).optional(),
								title: z.array(z.string()).optional(),
								unique_identifier: z.string().optional(),
								unstructured_address: z.array(z.string()).optional(),
								unstructured_name: z.array(z.string()).optional(),
								user_identifier: z.string().optional(),
								vendor_identifier: z.string().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		csr: z.string().optional(),
		csr_type: z.string().optional(),
		custom_values: z.object({}).passthrough().optional(),
		escrow_private_key: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z.string().optional(),
		id: z.string().optional(),
		issuer: z
			.object({
				id: z.string().optional(),
				name: z.string().optional(),
				trust_type: z.string().optional(),
			})
			.passthrough()
			.optional(),
		issuer_subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		kind: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		ocsp_key_hash_alg: z.string().optional(),
		options: z
			.object({ chain_name: z.string().optional() })
			.passthrough()
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_652f18b2b4b6Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ chain_name: z.string().optional() }).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();

export const generatedOpenApiSchemasA = {
	r_2db205955e7eInput: r_2db205955e7eInput,
	r_2db205955e7eOutput: r_2db205955e7eOutput,
	r_e8f57cffa958Input: r_e8f57cffa958Input,
	r_e8f57cffa958Output: r_e8f57cffa958Output,
	r_4c5572cd02e5Input: r_4c5572cd02e5Input,
	r_4c5572cd02e5Output: r_4c5572cd02e5Output,
	r_601a73f00551Input: r_601a73f00551Input,
	r_601a73f00551Output: r_601a73f00551Output,
	r_4ad10b0eab03Input: r_4ad10b0eab03Input,
	r_4ad10b0eab03Output: r_4ad10b0eab03Output,
	r_0e428a8d097bInput: r_0e428a8d097bInput,
	r_0e428a8d097bOutput: r_0e428a8d097bOutput,
	r_1628177be371Input: r_1628177be371Input,
	r_1628177be371Output: r_1628177be371Output,
	r_e9990a55db83Input: r_e9990a55db83Input,
	r_e9990a55db83Output: r_e9990a55db83Output,
	r_15fb6b740e87Input: r_15fb6b740e87Input,
	r_15fb6b740e87Output: r_15fb6b740e87Output,
	r_a85d7ecc25d2Input: r_a85d7ecc25d2Input,
	r_a85d7ecc25d2Output: r_a85d7ecc25d2Output,
	r_ee246cdb3f55Input: r_ee246cdb3f55Input,
	r_ee246cdb3f55Output: r_ee246cdb3f55Output,
	r_5f5cde1e7cc7Input: r_5f5cde1e7cc7Input,
	r_5f5cde1e7cc7Output: r_5f5cde1e7cc7Output,
	r_06d703452777Input: r_06d703452777Input,
	r_06d703452777Output: r_06d703452777Output,
	r_91d0541033a3Input: r_91d0541033a3Input,
	r_91d0541033a3Output: r_91d0541033a3Output,
	r_c8653461a11eInput: r_c8653461a11eInput,
	r_c8653461a11eOutput: r_c8653461a11eOutput,
	r_f05dba0a427dInput: r_f05dba0a427dInput,
	r_f05dba0a427dOutput: r_f05dba0a427dOutput,
	r_b3e6d7c8268cInput: r_b3e6d7c8268cInput,
	r_b3e6d7c8268cOutput: r_b3e6d7c8268cOutput,
	r_bcad0157f637Input: r_bcad0157f637Input,
	r_bcad0157f637Output: r_bcad0157f637Output,
	r_fbfdfcedaba1Input: r_fbfdfcedaba1Input,
	r_fbfdfcedaba1Output: r_fbfdfcedaba1Output,
	r_97a1d92f48f0Input: r_97a1d92f48f0Input,
	r_97a1d92f48f0Output: r_97a1d92f48f0Output,
	r_40f39944750fInput: r_40f39944750fInput,
	r_40f39944750fOutput: r_40f39944750fOutput,
	r_b224a0eca017Input: r_b224a0eca017Input,
	r_b224a0eca017Output: r_b224a0eca017Output,
	r_d37ec173c239Input: r_d37ec173c239Input,
	r_d37ec173c239Output: r_d37ec173c239Output,
	r_836448818f1bInput: r_836448818f1bInput,
	r_836448818f1bOutput: r_836448818f1bOutput,
	r_450b135c4c8bInput: r_450b135c4c8bInput,
	r_450b135c4c8bOutput: r_450b135c4c8bOutput,
	r_a497c207ff38Input: r_a497c207ff38Input,
	r_a497c207ff38Output: r_a497c207ff38Output,
	r_4413aec93603Input: r_4413aec93603Input,
	r_4413aec93603Output: r_4413aec93603Output,
	r_d2466ae03b22Input: r_d2466ae03b22Input,
	r_d2466ae03b22Output: r_d2466ae03b22Output,
	r_7edc4cabae54Input: r_7edc4cabae54Input,
	r_7edc4cabae54Output: r_7edc4cabae54Output,
	r_ca00d8bde2a5Input: r_ca00d8bde2a5Input,
	r_ca00d8bde2a5Output: r_ca00d8bde2a5Output,
	r_5f4fc2d8f440Input: r_5f4fc2d8f440Input,
	r_5f4fc2d8f440Output: r_5f4fc2d8f440Output,
	r_30806dc12876Input: r_30806dc12876Input,
	r_30806dc12876Output: r_30806dc12876Output,
	r_9cd2e581f2a1Input: r_9cd2e581f2a1Input,
	r_9cd2e581f2a1Output: r_9cd2e581f2a1Output,
	r_35f6309030acInput: r_35f6309030acInput,
	r_35f6309030acOutput: r_35f6309030acOutput,
	r_6ab53e3e6059Input: r_6ab53e3e6059Input,
	r_6ab53e3e6059Output: r_6ab53e3e6059Output,
	r_a48e8840fc8cInput: r_a48e8840fc8cInput,
	r_a48e8840fc8cOutput: r_a48e8840fc8cOutput,
	r_9e9cfb59b47aInput: r_9e9cfb59b47aInput,
	r_9e9cfb59b47aOutput: r_9e9cfb59b47aOutput,
	r_b4af3ae8430dInput: r_b4af3ae8430dInput,
	r_b4af3ae8430dOutput: r_b4af3ae8430dOutput,
	r_2053c0b686d7Input: r_2053c0b686d7Input,
	r_2053c0b686d7Output: r_2053c0b686d7Output,
	r_419129d1877aInput: r_419129d1877aInput,
	r_419129d1877aOutput: r_419129d1877aOutput,
	r_bb6316690c68Input: r_bb6316690c68Input,
	r_bb6316690c68Output: r_bb6316690c68Output,
	r_6e1b2f5805e5Input: r_6e1b2f5805e5Input,
	r_6e1b2f5805e5Output: r_6e1b2f5805e5Output,
	r_e2d08c123889Input: r_e2d08c123889Input,
	r_e2d08c123889Output: r_e2d08c123889Output,
	r_a4505158d331Input: r_a4505158d331Input,
	r_a4505158d331Output: r_a4505158d331Output,
	r_1d77ab47e7b6Input: r_1d77ab47e7b6Input,
	r_1d77ab47e7b6Output: r_1d77ab47e7b6Output,
	r_ec4a0752b7d5Input: r_ec4a0752b7d5Input,
	r_ec4a0752b7d5Output: r_ec4a0752b7d5Output,
	r_a78f5194d416Input: r_a78f5194d416Input,
	r_a78f5194d416Output: r_a78f5194d416Output,
	r_22401761d689Input: r_22401761d689Input,
	r_22401761d689Output: r_22401761d689Output,
	r_7fcf865bc7c5Input: r_7fcf865bc7c5Input,
	r_7fcf865bc7c5Output: r_7fcf865bc7c5Output,
	r_aa5e92b5e9cdInput: r_aa5e92b5e9cdInput,
	r_aa5e92b5e9cdOutput: r_aa5e92b5e9cdOutput,
	r_74dc2333e88bInput: r_74dc2333e88bInput,
	r_74dc2333e88bOutput: r_74dc2333e88bOutput,
	r_f16d00fee5aeInput: r_f16d00fee5aeInput,
	r_f16d00fee5aeOutput: r_f16d00fee5aeOutput,
	r_86bed8b7c460Input: r_86bed8b7c460Input,
	r_86bed8b7c460Output: r_86bed8b7c460Output,
	r_2ff5d2e16aebInput: r_2ff5d2e16aebInput,
	r_2ff5d2e16aebOutput: r_2ff5d2e16aebOutput,
	r_dade4aa006edInput: r_dade4aa006edInput,
	r_dade4aa006edOutput: r_dade4aa006edOutput,
	r_15e6335cf9bcInput: r_15e6335cf9bcInput,
	r_15e6335cf9bcOutput: r_15e6335cf9bcOutput,
	r_ef0e548901a2Input: r_ef0e548901a2Input,
	r_ef0e548901a2Output: r_ef0e548901a2Output,
	r_56ca5f9f8d8eInput: r_56ca5f9f8d8eInput,
	r_56ca5f9f8d8eOutput: r_56ca5f9f8d8eOutput,
	r_3fb14506f402Input: r_3fb14506f402Input,
	r_3fb14506f402Output: r_3fb14506f402Output,
	r_f328ec91fc11Input: r_f328ec91fc11Input,
	r_f328ec91fc11Output: r_f328ec91fc11Output,
	r_fbe03c239006Input: r_fbe03c239006Input,
	r_fbe03c239006Output: r_fbe03c239006Output,
	r_b532e61d0366Input: r_b532e61d0366Input,
	r_b532e61d0366Output: r_b532e61d0366Output,
	r_d4dfd7f5559cInput: r_d4dfd7f5559cInput,
	r_d4dfd7f5559cOutput: r_d4dfd7f5559cOutput,
	r_614145d2f693Input: r_614145d2f693Input,
	r_614145d2f693Output: r_614145d2f693Output,
	r_efc423513ee6Input: r_efc423513ee6Input,
	r_efc423513ee6Output: r_efc423513ee6Output,
	r_ae80f0a2884cInput: r_ae80f0a2884cInput,
	r_ae80f0a2884cOutput: r_ae80f0a2884cOutput,
	r_09525a87a3feInput: r_09525a87a3feInput,
	r_09525a87a3feOutput: r_09525a87a3feOutput,
	r_39f8c394d7dcInput: r_39f8c394d7dcInput,
	r_39f8c394d7dcOutput: r_39f8c394d7dcOutput,
	r_56a0935ca4e1Input: r_56a0935ca4e1Input,
	r_56a0935ca4e1Output: r_56a0935ca4e1Output,
	r_c1a00107ddd8Input: r_c1a00107ddd8Input,
	r_c1a00107ddd8Output: r_c1a00107ddd8Output,
	r_f1ac9a204fdbInput: r_f1ac9a204fdbInput,
	r_f1ac9a204fdbOutput: r_f1ac9a204fdbOutput,
	r_91c5268bb884Input: r_91c5268bb884Input,
	r_91c5268bb884Output: r_91c5268bb884Output,
	r_cf67da15ce78Input: r_cf67da15ce78Input,
	r_cf67da15ce78Output: r_cf67da15ce78Output,
	r_85b7ca4c4f50Input: r_85b7ca4c4f50Input,
	r_85b7ca4c4f50Output: r_85b7ca4c4f50Output,
	r_49bc49df9e00Input: r_49bc49df9e00Input,
	r_49bc49df9e00Output: r_49bc49df9e00Output,
	r_7ecf8015ce52Input: r_7ecf8015ce52Input,
	r_7ecf8015ce52Output: r_7ecf8015ce52Output,
	r_c91c378818a5Input: r_c91c378818a5Input,
	r_c91c378818a5Output: r_c91c378818a5Output,
	r_47971e5aadf2Input: r_47971e5aadf2Input,
	r_47971e5aadf2Output: r_47971e5aadf2Output,
	r_81b7e6e852baInput: r_81b7e6e852baInput,
	r_81b7e6e852baOutput: r_81b7e6e852baOutput,
	r_4530bfcae9b5Input: r_4530bfcae9b5Input,
	r_4530bfcae9b5Output: r_4530bfcae9b5Output,
	r_0bd21da7c4c2Input: r_0bd21da7c4c2Input,
	r_0bd21da7c4c2Output: r_0bd21da7c4c2Output,
	r_40ec0307a789Input: r_40ec0307a789Input,
	r_40ec0307a789Output: r_40ec0307a789Output,
	r_811c3aab6f1aInput: r_811c3aab6f1aInput,
	r_811c3aab6f1aOutput: r_811c3aab6f1aOutput,
	r_d98516ab704fInput: r_d98516ab704fInput,
	r_d98516ab704fOutput: r_d98516ab704fOutput,
	r_a4e740425499Input: r_a4e740425499Input,
	r_a4e740425499Output: r_a4e740425499Output,
	r_08eb17056280Input: r_08eb17056280Input,
	r_08eb17056280Output: r_08eb17056280Output,
	r_59ccb057dbe7Input: r_59ccb057dbe7Input,
	r_59ccb057dbe7Output: r_59ccb057dbe7Output,
	r_1050c0a3587aInput: r_1050c0a3587aInput,
	r_1050c0a3587aOutput: r_1050c0a3587aOutput,
	r_13f16d161bfeInput: r_13f16d161bfeInput,
	r_13f16d161bfeOutput: r_13f16d161bfeOutput,
	r_bfe1b8b2129aInput: r_bfe1b8b2129aInput,
	r_bfe1b8b2129aOutput: r_bfe1b8b2129aOutput,
	r_1028c694e4f8Input: r_1028c694e4f8Input,
	r_1028c694e4f8Output: r_1028c694e4f8Output,
	r_79d35f25e203Input: r_79d35f25e203Input,
	r_79d35f25e203Output: r_79d35f25e203Output,
	r_adc5dc353665Input: r_adc5dc353665Input,
	r_adc5dc353665Output: r_adc5dc353665Output,
	r_2e0b14749b40Input: r_2e0b14749b40Input,
	r_2e0b14749b40Output: r_2e0b14749b40Output,
	r_bed51bae8a4dInput: r_bed51bae8a4dInput,
	r_bed51bae8a4dOutput: r_bed51bae8a4dOutput,
	r_9a3dba0916b3Input: r_9a3dba0916b3Input,
	r_9a3dba0916b3Output: r_9a3dba0916b3Output,
	r_39765268d88fInput: r_39765268d88fInput,
	r_39765268d88fOutput: r_39765268d88fOutput,
	r_96e6bdf242a9Input: r_96e6bdf242a9Input,
	r_96e6bdf242a9Output: r_96e6bdf242a9Output,
	r_672dcfb0f9e0Input: r_672dcfb0f9e0Input,
	r_672dcfb0f9e0Output: r_672dcfb0f9e0Output,
	r_62e5e3240f68Input: r_62e5e3240f68Input,
	r_62e5e3240f68Output: r_62e5e3240f68Output,
	r_652f18b2b4b6Input: r_652f18b2b4b6Input,
};
