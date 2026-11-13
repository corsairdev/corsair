// Generated from DeployHQ official OpenAPI documentation. Do not edit by hand.
// Response schemas are loose and their optional fields nullish: the live API returns null
// for unset fields and more keys than the OpenAPI examples show (checked 11-13).
// Source: https://api.deployhq.com/docs.json
import { z } from 'zod';

// Per-protocol connection fields from DeployHQ's server API guide
// (https://www.deployhq.com/support/api/servers/create-a-new-server). The OpenAPI document
// omits them, so without them only custom_action servers could be created.
const ServerConnectionFields = {
	hostname: z.string().optional(),
	username: z.string().optional(),
	password: z.string().optional(),
	port: z.number().int().optional(),
	passive: z.boolean().optional(),
	force_hidden_files: z.boolean().optional(),
	use_parallel_upload: z.boolean().optional(),
	implicit: z.boolean().optional(),
	ignore_certificate_errors: z.boolean().optional(),
	use_ssh_keys: z.boolean().optional(),
	unlink_before_upload: z.boolean().optional(),
	use_accelerated_transfer: z.boolean().optional(),
	bucket_name: z.string().optional(),
	access_key_id: z.string().optional(),
	secret_access_key: z.string().optional(),
	custom_endpoint: z.string().optional(),
	api_key: z.string().optional(),
	region: z.string().optional(),
	container_name: z.string().optional(),
	personal_access_token: z.string().optional(),
	droplet_id: z.string().optional(),
	droplet_name: z.string().optional(),
	command: z.string().optional(),
	timeout: z.number().int().optional(),
	store_url: z.string().optional(),
	access_token: z.string().optional(),
	theme_name: z.string().optional(),
	site_id: z.string().optional(),
	app_name: z.string().optional(),
	api_key_heroku: z.string().optional(),
	application_name: z.string().optional(),
	environment_name: z.string().optional(),
};

export const NamePermalinkTimeZoneObjectSchema = z
	.object({
		name: z.string().nullish(),
		permalink: z.string().nullish(),
		time_zone: z.string().nullish(),
		package: z.string().nullish(),
		trialling: z.boolean().nullish(),
		suspended: z.boolean().nullish(),
		project_count: z.number().int().nullish(),
		project_limit: z.number().int().nullish(),
		users_allowed: z.boolean().nullish(),
		ai_features_disabled: z.boolean().nullish(),
	})
	.loose();
export const StatusErrorObjectSchema = z
	.object({ status: z.number().int(), error: z.string().optional() })
	.strict();
export const AccountObjectSchema = z
	.object({
		account: z
			.object({
				name: z.string().optional(),
				permalink: z.string().optional(),
				time_zone: z.string().optional(),
				ip_restricted: z.boolean().optional(),
				two_factor_auth_required: z.boolean().optional(),
				strong_password_required: z.boolean().optional(),
				ai_features_disabled: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const FieldWithErrorObjectSchema = z
	.object({ field_with_error: z.string() })
	.strict();
export const PackageFrequencyTriallingObjectSchema = z
	.object({
		package: z.string().nullish(),
		frequency: z.number().int().nullish(),
		trialling: z.boolean().nullish(),
		suspended: z.boolean().nullish(),
		scheduled_change: z
			.object({
				target_package: z.string().nullish(),
				target_frequency: z.number().int().nullish(),
				effective_at: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export const NumberKindCurrencyListSchema = z.array(
	z
		.object({
			number: z.number().int().nullish(),
			kind: z.string().nullish(),
			currency: z.string().nullish(),
			total: z.string().nullish(),
			vat: z.string().nullish(),
			paid: z.boolean().nullish(),
			paid_at: z.string().nullish(),
			created_at: z.string().nullish(),
			download_url: z.string().nullish(),
		})
		.loose(),
);
export const StatusSuspensionTypeSuspensionReasonObjectSchema = z
	.object({
		status: z.string().optional(),
		suspension_type: z.string().optional(),
		suspension_reason: z.string().optional(),
	})
	.strict();
export const StringValueSchema = z.string();
export const AgentListSchema = z.array(
	z
		.object({
			id: z.number().int().nullish(),
			created_at: z.string().nullish(),
			identifier: z.string().nullish(),
			name: z.string().nullish(),
			online: z.boolean().nullish(),
			revoked_at: z.union([z.null(), z.string()]).nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
);
export const AgentObjectSchema = z
	.object({ agent: z.object({ claim_code: z.string() }).strict() })
	.strict();
export const AgentSchema = z
	.object({
		id: z.number().int().nullish(),
		created_at: z.string().nullish(),
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		online: z.boolean().nullish(),
		revoked_at: z.union([z.null(), z.string()]).nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();
export const ClaimCodeObjectSchema = z
	.object({ claim_code: z.array(z.string()) })
	.strict();
export const AgentObject2Schema = z
	.object({ agent: z.object({ name: z.string().optional() }).strict() })
	.strict();
export const ErrorsObjectSchema = z
	.object({ errors: z.array(z.string()) })
	.strict();
export const StatusObjectSchema = z
	.object({ status: z.string().nullish() })
	.loose();
export const FieldWithErrorObject2Schema = z
	.object({ field_with_error: z.string().optional() })
	.strict();
export const EmailPasswordTermsAcceptedObjectSchema = z
	.object({
		email: z.string(),
		password: z.string(),
		terms_accepted: z.boolean(),
		account_name: z.string().optional(),
		full_name: z.string().optional(),
		package: z.string().optional(),
		coupon: z.string().optional(),
		newsletter_opt_in: z.boolean().optional(),
		signup_source: z.string().optional(),
		client: z.string().optional(),
		utm_params: z.record(z.string(), z.json()).optional(),
	})
	.strict();
export const AccountApiKeySshPublicKeyObjectSchema = z
	.object({
		account: z.record(z.string(), z.json()).nullish(),
		api_key: z.string().nullish(),
		ssh_public_key: z.record(z.string(), z.json()).nullish(),
		oauth_urls: z.record(z.string(), z.json()).nullish(),
		mcp_config: z.record(z.string(), z.json()).nullish(),
		email_verified: z.boolean().nullish(),
		client: z.string().nullish(),
	})
	.loose();
export const StatusErrorsObjectSchema = z
	.object({
		status: z.string().optional(),
		errors: z.array(z.string()).optional(),
	})
	.strict();
export const ProtocolObjectSchema = z
	.object({ protocol: z.string().optional() })
	.strict();
export const EnrolledBetaFeaturesObjectSchema = z
	.object({
		enrolled: z.boolean().nullish(),
		beta_features: z.boolean().nullish(),
	})
	.loose();
export const ErrorMessageBetaUrlObjectSchema = z
	.object({
		error: z.string().optional(),
		message: z.string().optional(),
		beta_url: z.string().optional(),
	})
	.strict();
export const ErrorMessageObjectSchema = z
	.object({ error: z.string().optional(), message: z.string().optional() })
	.strict();
export const DetectionObjectSchema = z
	.object({
		detection: z
			.object({
				filenames: z.array(z.string()).optional(),
				files: z.record(z.string(), z.json()).optional(),
				repository_url: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const StackVersionEvidenceObjectSchema = z
	.object({
		stack: z.string().nullish(),
		version: z.string().nullish(),
		evidence: z.array(z.string()).nullish(),
		description: z.string().nullish(),
		suggested_protocol: z.string().nullish(),
		static_hosting: z
			.object({
				eligibility: z.string().nullish(),
				root_path: z.string().nullish(),
				spa_mode: z.boolean().nullish(),
				confidence: z.string().nullish(),
			})
			.loose()
			.nullish(),
		build_commands: z
			.array(
				z
					.object({
						description: z.string().nullish(),
						command: z.string().nullish(),
						halt_on_error: z.boolean().nullish(),
						template_name: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		excluded_files: z
			.array(z.object({ path: z.string().nullish() }).loose())
			.nullish(),
		build_cache_files: z
			.array(z.object({ path: z.string().nullish() }).loose())
			.nullish(),
		ai_assisted: z.boolean().nullish(),
	})
	.loose();
export const ErrorObjectSchema = z.object({ error: z.string() }).strict();
export const IdentifierNamePositionListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			name: z.string().nullish(),
			position: z.number().int().nullish(),
			projects_count: z.number().int().nullish(),
		})
		.loose(),
);
export const FolderObjectSchema = z
	.object({ folder: z.object({ name: z.string() }).strict() })
	.strict();
export const IdentifierNamePositionObjectSchema = z
	.object({
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		position: z.number().int().nullish(),
		projects_count: z.number().int().nullish(),
	})
	.loose();
export const FieldWithErrorObject3Schema = z
	.object({ field_with_error: z.array(z.string()).optional() })
	.strict();
export const BuildCommandListSchema = z.array(
	z
		.object({
			id: z.number().int().nullish(),
			project_id: z.union([z.null(), z.number().int()]).nullish(),
			description: z.string().nullish(),
			command: z.string().nullish(),
			halt_on_error: z.boolean().nullish(),
			position: z.number().int().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			identifier: z.string().nullish(),
			parent_type: z.string().nullish(),
			parent_id: z.number().int().nullish(),
			template_name: z.string().nullish(),
			enabled: z.boolean().nullish(),
			watch_files: z.string().nullish(),
			source: z.string().nullish(),
		})
		.loose(),
);
export const BuildCommandObjectSchema = z
	.object({
		build_command: z
			.object({
				description: z.string().optional(),
				command: z.string(),
				template_name: z.string().optional(),
				halt_on_error: z.boolean().optional(),
				watch_files: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const BuildCommandSchema = z
	.object({
		id: z.number().int().nullish(),
		project_id: z.union([z.null(), z.number().int()]).nullish(),
		description: z.string().nullish(),
		command: z.string().nullish(),
		halt_on_error: z.boolean().nullish(),
		position: z.number().int().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		identifier: z.string().nullish(),
		parent_type: z.string().nullish(),
		parent_id: z.number().int().nullish(),
		template_name: z.string().nullish(),
		enabled: z.boolean().nullish(),
		watch_files: z.string().nullish(),
		source: z.string().nullish(),
	})
	.loose();
export const ConfigFileListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			description: z.union([z.null(), z.string()]).nullish(),
			path: z.string().nullish(),
			body: z.string().nullish(),
			build: z.boolean().nullish(),
			servers: z
				.array(
					z
						.object({
							id: z.number().int().nullish(),
							identifier: z.string().nullish(),
							name: z.string().nullish(),
							protocol_type: z.string().nullish(),
							server_path: z.string().nullish(),
							last_revision: z.union([z.null(), z.string()]).nullish(),
							preferred_branch: z.string().nullish(),
							branch: z.union([z.null(), z.string()]).nullish(),
							notify_email: z.string().nullish(),
							server_group_identifier: z.string().nullish(),
							auto_deploy: z.boolean().nullish(),
							environment: z.string().nullish(),
							enabled: z.boolean().nullish(),
							agent: z
								.object({
									id: z.number().int().nullish(),
									created_at: z.string().nullish(),
									identifier: z.string().nullish(),
									name: z.string().nullish(),
									online: z.boolean().nullish(),
									revoked_at: z.union([z.null(), z.string()]).nullish(),
									updated_at: z.string().nullish(),
								})
								.loose()
								.nullish(),
							atomic: z.boolean().nullish(),
							atomic_strategy: z.string().nullish(),
							atomic_retention: z.number().int().nullish(),
							use_compression: z.boolean().nullish(),
							use_accelerated_transfer: z.boolean().nullish(),
							use_parallel_upload: z.boolean().nullish(),
							root_path: z.union([z.null(), z.string()]).nullish(),
							position: z.number().int().nullish(),
							created_at: z.string().nullish(),
							updated_at: z.string().nullish(),
							connection_checked_at: z.union([z.null(), z.string()]).nullish(),
							connection_error_message: z
								.union([z.null(), z.string()])
								.nullish(),
							hostname: z.string().nullish(),
							username: z.string().nullish(),
							port: z.union([z.string(), z.number()]).nullish(),
							use_ssh_keys: z.boolean().nullish(),
							host_key: z.string().nullish(),
							unlink_before_upload: z.boolean().nullish(),
							global_key_pair_id: z.string().nullish(),
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
);
export const ConfigFileObjectSchema = z
	.object({
		config_file: z
			.object({
				path: z.string().optional(),
				body: z.string().optional(),
				build: z.boolean().optional(),
				language: z.string().optional(),
				description: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const ConfigFileSchema = z
	.object({
		identifier: z.string().nullish(),
		description: z.union([z.null(), z.string()]).nullish(),
		path: z.string().nullish(),
		body: z.string().nullish(),
		build: z.boolean().nullish(),
		servers: z
			.array(
				z
					.object({
						id: z.number().int().nullish(),
						identifier: z.string().nullish(),
						name: z.string().nullish(),
						protocol_type: z.string().nullish(),
						server_path: z.string().nullish(),
						last_revision: z.union([z.null(), z.string()]).nullish(),
						preferred_branch: z.string().nullish(),
						branch: z.union([z.null(), z.string()]).nullish(),
						notify_email: z.string().nullish(),
						server_group_identifier: z.string().nullish(),
						auto_deploy: z.boolean().nullish(),
						environment: z.string().nullish(),
						enabled: z.boolean().nullish(),
						agent: z
							.object({
								id: z.number().int().nullish(),
								created_at: z.string().nullish(),
								identifier: z.string().nullish(),
								name: z.string().nullish(),
								online: z.boolean().nullish(),
								revoked_at: z.union([z.null(), z.string()]).nullish(),
								updated_at: z.string().nullish(),
							})
							.loose()
							.nullish(),
						atomic: z.boolean().nullish(),
						atomic_strategy: z.string().nullish(),
						atomic_retention: z.number().int().nullish(),
						use_compression: z.boolean().nullish(),
						use_accelerated_transfer: z.boolean().nullish(),
						use_parallel_upload: z.boolean().nullish(),
						root_path: z.union([z.null(), z.string()]).nullish(),
						position: z.number().int().nullish(),
						created_at: z.string().nullish(),
						updated_at: z.string().nullish(),
						connection_checked_at: z.union([z.null(), z.string()]).nullish(),
						connection_error_message: z.union([z.null(), z.string()]).nullish(),
						hostname: z.string().nullish(),
						username: z.string().nullish(),
						port: z.union([z.string(), z.number()]).nullish(),
						use_ssh_keys: z.boolean().nullish(),
						host_key: z.string().nullish(),
						unlink_before_upload: z.boolean().nullish(),
						global_key_pair_id: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const EnvironmentVariableListSchema = z.array(
	z
		.object({
			identifier: z.number().int().nullish(),
			name: z.string().nullish(),
			masked_value: z.string().nullish(),
			locked: z.boolean().nullish(),
			build_pipeline: z.boolean().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
);
export const EnvironmentVariableObjectSchema = z
	.object({
		environment_variable: z
			.object({
				name: z.string(),
				value: z.string(),
				locked: z.boolean().optional(),
				build_pipeline: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const EnvironmentVariableSchema = z
	.object({
		identifier: z.number().int().nullish(),
		name: z.string().nullish(),
		masked_value: z.string().nullish(),
		locked: z.boolean().nullish(),
		build_pipeline: z.boolean().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();
export const ErrorsObject2Schema = z
	.object({ errors: z.array(z.string()).optional() })
	.strict();
export const EnvironmentVariableObject2Schema = z
	.object({
		environment_variable: z
			.object({
				name: z.string().optional(),
				value: z.string().optional(),
				locked: z.boolean().optional(),
				build_pipeline: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const ServerListSchema = z.array(
	z
		.object({
			id: z.number().int().nullish(),
			identifier: z.string().nullish(),
			name: z.string().nullish(),
			protocol_type: z.string().nullish(),
			server_path: z.string().nullish(),
			last_revision: z.union([z.null(), z.string()]).nullish(),
			preferred_branch: z.string().nullish(),
			branch: z.string().nullish(),
			notify_email: z.string().nullish(),
			server_group_identifier: z.union([z.null(), z.string()]).nullish(),
			auto_deploy: z.boolean().nullish(),
			environment: z.string().nullish(),
			enabled: z.boolean().nullish(),
			agent: z.union([z.null(), z.string()]).nullish(),
			atomic: z.boolean().nullish(),
			atomic_strategy: z.string().nullish(),
			atomic_retention: z.number().int().nullish(),
			use_compression: z.boolean().nullish(),
			use_accelerated_transfer: z.boolean().nullish(),
			use_parallel_upload: z.boolean().nullish(),
			root_path: z.string().nullish(),
			position: z.number().int().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			connection_checked_at: z.union([z.null(), z.string()]).nullish(),
			connection_error_message: z.union([z.null(), z.string()]).nullish(),
			hostname: z.string().nullish(),
			username: z.string().nullish(),
			port: z.union([z.string(), z.number()]).nullish(),
			use_ssh_keys: z.boolean().nullish(),
			host_key: z.string().nullish(),
			unlink_before_upload: z.boolean().nullish(),
		})
		.loose(),
);
export const ServerRegionSizeObjectSchema = z
	.object({
		server: z
			.object({
				...ServerConnectionFields,
				name: z.string().optional(),
				protocol_type: z.string().optional(),
				server_path: z.string().optional(),
				environment: z.string().optional(),
				root_path: z.string().optional(),
				agent_id: z.string().optional(),
				enabled: z.boolean().optional(),
				global_key_pair_id: z.string().optional(),
				atomic: z.boolean().optional(),
				atomic_strategy: z.string().optional(),
				atomic_retention: z.number().int().optional(),
			})
			.strict(),
		region: z.string().optional(),
		size: z.string().optional(),
		os_image: z.string().optional(),
		key_pair_identifier: z.string().optional(),
	})
	.strict();
export const ServerSchema = z
	.object({
		id: z.number().int().nullish(),
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		protocol_type: z.string().nullish(),
		server_path: z.string().nullish(),
		last_revision: z.union([z.null(), z.string()]).nullish(),
		preferred_branch: z.string().nullish(),
		branch: z.string().nullish(),
		notify_email: z.string().nullish(),
		server_group_identifier: z.union([z.null(), z.string()]).nullish(),
		auto_deploy: z.boolean().nullish(),
		environment: z.string().nullish(),
		enabled: z.boolean().nullish(),
		agent: z.union([z.null(), z.string()]).nullish(),
		atomic: z.boolean().nullish(),
		atomic_strategy: z.string().nullish(),
		atomic_retention: z.number().int().nullish(),
		use_compression: z.boolean().nullish(),
		use_accelerated_transfer: z.boolean().nullish(),
		use_parallel_upload: z.boolean().nullish(),
		root_path: z.string().nullish(),
		position: z.number().int().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		connection_checked_at: z.union([z.null(), z.string()]).nullish(),
		connection_error_message: z.union([z.null(), z.string()]).nullish(),
		hostname: z.string().nullish(),
		username: z.string().nullish(),
		port: z.union([z.string(), z.number()]).nullish(),
		use_ssh_keys: z.boolean().nullish(),
		host_key: z.string().nullish(),
		unlink_before_upload: z.boolean().nullish(),
	})
	.loose();
export const IdIdentifierNameObjectSchema = z
	.object({
		id: z.number().int().nullish(),
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		protocol_type: z.string().nullish(),
		enabled: z.boolean().nullish(),
		managed_vps: z
			.object({
				hosted_resource_identifier: z.string().nullish(),
				status: z.string().nullish(),
				ip_address: z.string().nullish(),
				region: z.string().nullish(),
				size: z.string().nullish(),
				ssh_key: z
					.object({
						identifier: z.string().nullish(),
						title: z.string().nullish(),
						fingerprint: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export const ServerObjectSchema = z
	.object({
		server: z
			.object({
				...ServerConnectionFields,
				name: z.string().optional(),
				protocol_type: z.string().optional(),
				server_path: z.string().optional(),
				environment: z.string().optional(),
				root_path: z.string().optional(),
				agent_id: z.string().optional(),
				enabled: z.boolean().optional(),
				global_key_pair_id: z.string().optional(),
				atomic: z.boolean().optional(),
				atomic_strategy: z.string().optional(),
				atomic_retention: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
export const CommandListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			cback: z.string().nullish(),
			position: z.number().int().nullish(),
			description: z.string().nullish(),
			command: z.string().nullish(),
			halt_on_error: z.boolean().nullish(),
			servers: z
				.array(
					z
						.object({
							id: z.number().int().nullish(),
							identifier: z.string().nullish(),
							name: z.string().nullish(),
							protocol_type: z.string().nullish(),
							server_path: z.string().nullish(),
							last_revision: z.string().nullish(),
							preferred_branch: z.string().nullish(),
							branch: z.string().nullish(),
							notify_email: z.string().nullish(),
							server_group_identifier: z
								.union([z.null(), z.string()])
								.nullish(),
							auto_deploy: z.boolean().nullish(),
							environment: z.string().nullish(),
							enabled: z.boolean().nullish(),
							agent: z.union([z.null(), z.string()]).nullish(),
							atomic: z.boolean().nullish(),
							atomic_strategy: z.string().nullish(),
							atomic_retention: z.number().int().nullish(),
							use_compression: z.boolean().nullish(),
							use_accelerated_transfer: z.boolean().nullish(),
							use_parallel_upload: z.boolean().nullish(),
							root_path: z.string().nullish(),
							position: z.number().int().nullish(),
							created_at: z.string().nullish(),
							updated_at: z.string().nullish(),
							connection_checked_at: z.union([z.null(), z.string()]).nullish(),
							connection_error_message: z
								.union([z.null(), z.string()])
								.nullish(),
							hostname: z.string().nullish(),
							username: z.string().nullish(),
							port: z.union([z.string(), z.number()]).nullish(),
							use_ssh_keys: z.boolean().nullish(),
							host_key: z.string().nullish(),
							unlink_before_upload: z.boolean().nullish(),
						})
						.loose(),
				)
				.nullish(),
			timing: z.string().nullish(),
			timeout: z.number().int().nullish(),
			enabled: z.boolean().nullish(),
		})
		.loose(),
);
export const CommandObjectSchema = z
	.object({
		command: z
			.object({
				description: z.string(),
				command: z.string(),
				halt_on_error: z.boolean().optional(),
				timeout: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
export const CommandSchema = z
	.object({
		identifier: z.string().nullish(),
		cback: z.string().nullish(),
		position: z.number().int().nullish(),
		description: z.string().nullish(),
		command: z.string().nullish(),
		halt_on_error: z.boolean().nullish(),
		servers: z
			.array(
				z
					.object({
						id: z.number().int().nullish(),
						identifier: z.string().nullish(),
						name: z.string().nullish(),
						protocol_type: z.string().nullish(),
						server_path: z.string().nullish(),
						last_revision: z.string().nullish(),
						preferred_branch: z.string().nullish(),
						branch: z.string().nullish(),
						notify_email: z.string().nullish(),
						server_group_identifier: z.union([z.null(), z.string()]).nullish(),
						auto_deploy: z.boolean().nullish(),
						environment: z.string().nullish(),
						enabled: z.boolean().nullish(),
						agent: z.union([z.null(), z.string()]).nullish(),
						atomic: z.boolean().nullish(),
						atomic_strategy: z.string().nullish(),
						atomic_retention: z.number().int().nullish(),
						use_compression: z.boolean().nullish(),
						use_accelerated_transfer: z.boolean().nullish(),
						use_parallel_upload: z.boolean().nullish(),
						root_path: z.string().nullish(),
						position: z.number().int().nullish(),
						created_at: z.string().nullish(),
						updated_at: z.string().nullish(),
						connection_checked_at: z.union([z.null(), z.string()]).nullish(),
						connection_error_message: z.union([z.null(), z.string()]).nullish(),
						hostname: z.string().nullish(),
						username: z.string().nullish(),
						port: z.union([z.string(), z.number()]).nullish(),
						use_ssh_keys: z.boolean().nullish(),
						host_key: z.string().nullish(),
						unlink_before_upload: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
		timing: z.string().nullish(),
		timeout: z.number().int().nullish(),
		enabled: z.boolean().nullish(),
	})
	.loose();
export const CommandObject2Schema = z
	.object({
		command: z
			.object({
				description: z.string().optional(),
				command: z.string().optional(),
				halt_on_error: z.boolean().optional(),
				timeout: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
export const KindIdentifierNameListSchema = z.array(
	z
		.object({
			kind: z.string().nullish(),
			identifier: z.string().nullish(),
			name: z.string().nullish(),
			status: z.string().nullish(),
			monthly_cost: z.json().nullish(),
			region: z.string().nullish(),
			size: z.string().nullish(),
			ip_address: z.string().nullish(),
			ssh_key: z
				.object({
					identifier: z.string().nullish(),
					title: z.string().nullish(),
					public_key: z.string().nullish(),
					key_type: z.string().nullish(),
					fingerprint: z.string().nullish(),
					account: z.string().nullish(),
				})
				.loose()
				.nullish(),
			subdomain: z.string().nullish(),
			spa_mode: z.boolean().nullish(),
			storage_bytes_total: z.number().int().nullish(),
			active_deployment_uuid: z.string().nullish(),
			deployment_count: z.number().int().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
);
export const KindIdentifierNameObjectSchema = z
	.object({
		kind: z.string().nullish(),
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		monthly_cost: z.json().nullish(),
		region: z.string().nullish(),
		size: z.string().nullish(),
		ip_address: z.string().nullish(),
		ssh_key: z
			.object({
				identifier: z.string().nullish(),
				title: z.string().nullish(),
				public_key: z.string().nullish(),
				key_type: z.string().nullish(),
				fingerprint: z.string().nullish(),
				account: z.string().nullish(),
			})
			.loose()
			.nullish(),
		subdomain: z.string().nullish(),
		spa_mode: z.boolean().nullish(),
		storage_bytes_total: z.number().int().nullish(),
		active_deployment_uuid: z.string().nullish(),
		deployment_count: z.number().int().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();
export const ErrorObject2Schema = z
	.object({ error: z.string().optional() })
	.strict();
export const SharedZonesNetworkAgentObjectSchema = z
	.object({
		shared: z
			.object({
				ipv4: z.array(z.string()).nullish(),
				ipv6: z.array(z.string()).nullish(),
			})
			.loose()
			.nullish(),
		zones: z
			.object({
				uk: z
					.object({
						name: z.string().nullish(),
						ipv4: z.array(z.string()).nullish(),
						ipv6: z.array(z.string()).nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		network_agent: z
			.object({
				ipv4: z.array(z.string()).nullish(),
				ipv6: z.array(z.string()).nullish(),
			})
			.loose()
			.nullish(),
		all_ipv4: z.array(z.string()).nullish(),
		all_ipv6: z.array(z.string()).nullish(),
		ports: z
			.array(
				z
					.object({
						protocol: z.string().nullish(),
						description: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const NodeRubyPhpObjectSchema = z
	.object({
		node: z.array(z.string()).nullish(),
		ruby: z.array(z.string()).nullish(),
		php: z.array(z.string()).nullish(),
	})
	.loose();
export const GroupedRegionsObjectSchema = z
	.object({ grouped_regions: z.record(z.string(), z.json()).nullish() })
	.loose();
export const SizesObjectSchema = z
	.object({
		sizes: z
			.array(
				z
					.object({
						slug: z.string().nullish(),
						label: z.string().nullish(),
						monthly_cost: z.json().nullish(),
						currency: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const PermalinkNameCurrencyListSchema = z.array(
	z
		.object({
			permalink: z.string().nullish(),
			name: z.string().nullish(),
			currency: z.string().nullish(),
			price: z.json().nullish(),
			price_billed_annually: z.json().nullish(),
			features: z.array(z.string()).nullish(),
		})
		.loose(),
);
export const FirstNameLastNameEmailAddressObjectSchema = z
	.object({
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email_address: z.string().nullish(),
		time_zone: z.string().nullish(),
		account: z
			.object({
				name: z.string().nullish(),
				permalink: z.string().nullish(),
				time_zone: z.string().nullish(),
				package: z.string().nullish(),
				trialling: z.boolean().nullish(),
				suspended: z.boolean().nullish(),
				project_count: z.number().int().nullish(),
				project_limit: z.number().int().nullish(),
				users_allowed: z.boolean().nullish(),
				beta_features: z.boolean().nullish(),
				static_hosting_eligible: z.boolean().nullish(),
				managed_vps_eligible: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export const UserObjectSchema = z
	.object({
		user: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email_address: z.string().optional(),
				time_zone: z.string().optional(),
				alphabetic_sort: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const NamePermalinkIdentifierListSchema = z.array(
	z
		.object({
			name: z.string().nullish(),
			permalink: z.string().nullish(),
			identifier: z.string().nullish(),
			public_key: z.string().nullish(),
			repository: z.record(z.string(), z.json()).nullish(),
			repository_url: z.string().nullish(),
			zone: z.string().nullish(),
			last_deployed_at: z.string().nullish(),
			folder: z
				.object({
					identifier: z.string().nullish(),
					name: z.string().nullish(),
				})
				.loose()
				.nullish(),
			auto_deploy_url: z.string().nullish(),
			url: z.string().nullish(),
			app_url: z.string().nullish(),
			servers_url: z.string().nullish(),
			deployments_url: z.string().nullish(),
			config_files_url: z.string().nullish(),
			environment_variables_url: z.string().nullish(),
			build_commands_url: z.string().nullish(),
			starred: z.boolean().nullish(),
		})
		.loose(),
);
export const ProjectObjectSchema = z
	.object({
		project: z
			.object({
				name: z.string().optional(),
				keypair_identifier: z.string().optional(),
				zone_id: z.string().optional(),
				template_id: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const ProjectSchema = z
	.object({
		name: z.string().nullish(),
		permalink: z.string().nullish(),
		identifier: z.string().nullish(),
		public_key: z.string().nullish(),
		repository: z
			.object({
				scm_type: z.string().nullish(),
				url: z.string().nullish(),
				port: z.union([z.null(), z.number().int()]).nullish(),
				username: z.union([z.null(), z.string()]).nullish(),
				branch: z.string().nullish(),
				cached: z.boolean().nullish(),
				hosting_service: z
					.object({
						name: z.string().nullish(),
						url: z.string().nullish(),
						tree_url: z.string().nullish(),
						commits_url: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		repository_url: z.string().nullish(),
		zone: z.string().nullish(),
		last_deployed_at: z.union([z.null(), z.string()]).nullish(),
		folder: z.union([z.null(), z.string()]).nullish(),
		auto_deploy_url: z.string().nullish(),
	})
	.loose();
export const NamePermalinkIdentifierObjectSchema = z
	.object({
		name: z.string().nullish(),
		permalink: z.string().nullish(),
		identifier: z.string().nullish(),
		public_key: z.string().nullish(),
		repository: z.record(z.string(), z.json()).nullish(),
		repository_url: z.string().nullish(),
		zone: z.string().nullish(),
		last_deployed_at: z.string().nullish(),
		folder: z
			.object({
				identifier: z.string().nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
		auto_deploy_url: z.string().nullish(),
		url: z.string().nullish(),
		app_url: z.string().nullish(),
		servers_url: z.string().nullish(),
		deployments_url: z.string().nullish(),
		config_files_url: z.string().nullish(),
		environment_variables_url: z.string().nullish(),
		build_commands_url: z.string().nullish(),
		capabilities: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						enabled: z.boolean().nullish(),
						url: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		starred: z.boolean().nullish(),
	})
	.loose();
export const ProjectObject2Schema = z
	.object({
		project: z
			.object({
				name: z.string().optional(),
				email_notify_on: z.string().optional(),
				notification_email: z.string().optional(),
				notify_committer: z.boolean().optional(),
				zone_id: z.string().optional(),
				permalink: z.string().optional(),
				custom_private_key: z.string().optional(),
				check_undeployed_changes: z.string().optional(),
				store_artifacts_enabled: z.string().optional(),
				ai_overview_custom_instructions: z.string().optional(),
				folder: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const BaseObjectSchema = z
	.object({ base: z.array(z.string()).optional() })
	.strict();
export const StartRefEndRefObjectSchema = z
	.object({ start_ref: z.string().optional(), end_ref: z.string() })
	.strict();
export const SuccessOverviewObjectSchema = z
	.object({ success: z.boolean(), overview: z.string() })
	.loose();
export const SuccessErrorObjectSchema = z
	.object({ success: z.boolean(), error: z.string() })
	.strict();
export const PeriodServersSummaryObjectSchema = z
	.object({
		period: z.number().int().nullish(),
		servers: z
			.array(
				z
					.object({
						identifier: z.string().nullish(),
						name: z.string().nullish(),
						group: z.boolean().nullish(),
						latest_status: z.string().nullish(),
						recent_deploys: z
							.array(
								z
									.object({
										status: z.string().nullish(),
										duration: z.number().int().nullish(),
									})
									.loose(),
							)
							.nullish(),
						speed: z.number().int().nullish(),
						reliability: z.json().nullish(),
						deploys_per_week: z.json().nullish(),
						total: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
		summary: z
			.object({
				total_deploys: z
					.object({
						value: z.number().int().nullish(),
						delta: z.json().nullish(),
					})
					.loose()
					.nullish(),
				success_rate: z
					.object({ value: z.json().nullish(), delta: z.json().nullish() })
					.loose()
					.nullish(),
				avg_duration: z
					.object({
						value: z.number().int().nullish(),
						delta: z.json().nullish(),
					})
					.loose()
					.nullish(),
				active_servers: z
					.object({
						value: z.number().int().nullish(),
						delta: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export const ProjectObject3Schema = z
	.object({
		project: z.object({ key_type: z.string().optional() }).strict().optional(),
	})
	.strict();
export const PublicKeyObjectSchema = z
	.object({ public_key: z.string() })
	.loose();
export const StringListSchema = z.array(z.string());
export const MessageStarredObjectSchema = z
	.object({ message: z.string().nullish(), starred: z.boolean().nullish() })
	.loose();
export const CountTruncatedLatestDeployedRevisionObjectSchema = z
	.object({
		count: z.number().int(),
		truncated: z.boolean(),
		latest_deployed_revision: z.string().nullish(),
		current_revision: z.string().nullish(),
		last_checked_at: z.string().nullish(),
		check_in_progress: z.boolean(),
		check_fail_message: z.string().nullish(),
		commits: z
			.array(
				z
					.object({
						ref: z.string().nullish(),
						author: z.string().nullish(),
						email: z.string().nullish(),
						timestamp: z.string().nullish(),
						message: z.string().nullish(),
						short_message: z.string().nullish(),
						url: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const ProjectObject4Schema = z
	.object({ project: z.object({ custom_private_key: z.string() }).strict() })
	.strict();
export const WebhookUrlDeployablesObjectSchema = z
	.object({
		webhook_url: z.string().nullish(),
		deployables: z
			.array(
				z
					.object({
						identifier: z.string().nullish(),
						name: z.string().nullish(),
						type: z.string().nullish(),
						auto_deploy: z.boolean().nullish(),
						command_deployable: z.boolean().nullish(),
						preferred_branch: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const DeployablesObjectSchema = z
	.object({
		deployables: z
			.array(
				z
					.object({
						identifier: z.string().optional(),
						auto_deploy: z.boolean().optional(),
						command_deployable: z.boolean().optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const DeployablesSkippedObjectSchema = z
	.object({
		deployables: z
			.array(
				z
					.object({
						identifier: z.string().nullish(),
						name: z.string().nullish(),
						type: z.string().nullish(),
						auto_deploy: z.boolean().nullish(),
						command_deployable: z.boolean().nullish(),
						preferred_branch: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		skipped: z.array(z.string()).nullish(),
	})
	.loose();
export const BuildCacheFileListSchema = z.array(
	z
		.object({
			id: z.number().int().nullish(),
			project_id: z.union([z.null(), z.number().int()]).nullish(),
			identifier: z.string().nullish(),
			path: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			parent_type: z.string().nullish(),
			parent_id: z.number().int().nullish(),
		})
		.loose(),
);
export const BuildCacheFileObjectSchema = z
	.object({ build_cache_file: z.object({ path: z.string() }).strict() })
	.strict();
export const BuildCacheFileSchema = z
	.object({
		id: z.number().int().nullish(),
		project_id: z.union([z.null(), z.number().int()]).nullish(),
		identifier: z.string().nullish(),
		path: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		parent_type: z.string().nullish(),
		parent_id: z.number().int().nullish(),
	})
	.loose();
export const IdentifierSourceDescriptionListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			source: z.string().nullish(),
			description: z.string().nullish(),
			command: z.string().nullish(),
			halt_on_error: z.boolean().nullish(),
			enabled: z.boolean().nullish(),
			position: z.number().int().nullish(),
			watch_files: z.string().nullish(),
		})
		.loose(),
);
export const BuildCommandObject2Schema = z
	.object({
		build_command: z
			.object({
				description: z.string().optional(),
				command: z.string(),
				template_name: z.string().optional(),
				halt_on_error: z.boolean().optional(),
				enabled: z.boolean().optional(),
				watch_files: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const BuildEnvironmentSchema = z
	.object({
		identifier: z.string().nullish(),
		packages: z
			.object({
				ruby: z.string().nullish(),
				php: z.string().nullish(),
				composer: z.string().nullish(),
				java: z.string().nullish(),
				dotnet: z.string().nullish(),
				go: z.string().nullish(),
				python2: z.string().nullish(),
				python3: z.string().nullish(),
				node: z.string().nullish(),
				phantomjs: z.string().nullish(),
			})
			.loose()
			.nullish(),
		default: z.boolean().nullish(),
		servers: z.array(z.json()).nullish(),
	})
	.loose();
export const BuildEnvironmentListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			packages: z
				.object({
					ruby: z.string().nullish(),
					php: z.string().nullish(),
					composer: z.string().nullish(),
					java: z.string().nullish(),
					dotnet: z.string().nullish(),
					go: z.string().nullish(),
					python2: z.string().nullish(),
					python3: z.string().nullish(),
					node: z.string().nullish(),
					phantomjs: z.string().nullish(),
				})
				.loose()
				.nullish(),
			default: z.boolean().nullish(),
			servers: z.array(z.json()).nullish(),
		})
		.loose(),
);
export const BuildEnvironmentObjectSchema = z
	.object({
		build_environment: z
			.object({ server_identifiers: z.array(z.string()).optional() })
			.strict(),
	})
	.strict();
export const BuildEnvironmentObject2Schema = z
	.object({ build_environment: z.object({ version: z.string() }).strict() })
	.strict();
export const BuildKnownHostListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			hostname: z.string().nullish(),
			fingerprint: z.string().nullish(),
		})
		.loose(),
);
export const BuildKnownHostObjectSchema = z
	.object({
		build_known_host: z
			.object({ hostname: z.string(), public_key: z.string() })
			.strict(),
	})
	.strict();
export const BuildKnownHostSchema = z
	.object({
		identifier: z.string().nullish(),
		hostname: z.string().nullish(),
		fingerprint: z.string().nullish(),
	})
	.loose();
export const CommandObject3Schema = z
	.object({
		command: z
			.object({
				cback: z.string().optional(),
				position: z.number().int().optional(),
				description: z.string(),
				command: z.string(),
				halt_on_error: z.boolean().optional(),
				timing: z.string(),
				timeout: z.number().int(),
				enabled: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const CommandObject4Schema = z
	.object({
		command: z
			.object({
				cback: z.string().optional(),
				position: z.number().int().optional(),
				description: z.string().optional(),
				command: z.string().optional(),
				halt_on_error: z.boolean().optional(),
				timing: z.string().optional(),
				timeout: z.number().int().optional(),
				enabled: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const ConfigFileObject2Schema = z
	.object({
		config_file: z
			.object({
				path: z.string().optional(),
				body: z.string().optional(),
				build: z.boolean().optional(),
				language: z.string().optional(),
				description: z.string().optional(),
				all_servers: z.boolean().optional(),
				server_identifiers: z.array(z.string()).optional(),
			})
			.strict(),
	})
	.strict();
export const IdentifierNameStageListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			name: z.string().nullish(),
			stage: z.string().nullish(),
			check_type: z.string().nullish(),
			enabled: z.boolean().nullish(),
			position: z.number().int().nullish(),
			command: z.string().nullish(),
			servers: z.array(z.string()).nullish(),
			http_method: z.string().nullish(),
			http_url: z.string().nullish(),
			http_expected_status: z.number().int().nullish(),
			http_body_match: z.string().nullish(),
			timeout_seconds: z.number().int().nullish(),
			scanner: z.string().nullish(),
			scan_target_kind: z.string().nullish(),
			scan_target: z.string().nullish(),
			severity_threshold: z.string().nullish(),
			fail_on_unfixed_only: z.boolean().nullish(),
			sarif_output_path: z.string().nullish(),
			integration_identifier: z.string().nullish(),
			window_minutes: z.number().int().nullish(),
			match_by_release: z.boolean().nullish(),
		})
		.loose(),
);
export const DeploymentCheckObjectSchema = z
	.object({
		deployment_check: z
			.object({
				name: z.string(),
				description: z.string().optional(),
				stage: z.string(),
				check_type: z.string(),
				enabled: z.boolean().optional(),
				timeout_seconds: z.number().int().optional(),
				command: z.string().optional(),
				servers: z.array(z.string()).optional(),
				http_method: z.string().optional(),
				http_url: z.string().optional(),
				http_expected_status: z.number().int().optional(),
				http_body_match: z.string().optional(),
				scanner: z.string().optional(),
				scan_target_kind: z.string().optional(),
				scan_target: z.string().optional(),
				severity_threshold: z.string().optional(),
				fail_on_unfixed_only: z.boolean().optional(),
				sarif_output_path: z.string().optional(),
				integration_identifier: z.string().optional(),
				window_minutes: z.number().int().optional(),
				match_by_release: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const IdentifierNameStageObjectSchema = z
	.object({
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		stage: z.string().nullish(),
		check_type: z.string().nullish(),
		enabled: z.boolean().nullish(),
		position: z.number().int().nullish(),
		command: z.string().nullish(),
		servers: z.array(z.string()).nullish(),
		http_method: z.string().nullish(),
		http_url: z.string().nullish(),
		http_expected_status: z.number().int().nullish(),
		http_body_match: z.string().nullish(),
		timeout_seconds: z.number().int().nullish(),
		scanner: z.string().nullish(),
		scan_target_kind: z.string().nullish(),
		scan_target: z.string().nullish(),
		severity_threshold: z.string().nullish(),
		fail_on_unfixed_only: z.boolean().nullish(),
		sarif_output_path: z.string().nullish(),
		integration_identifier: z.string().nullish(),
		window_minutes: z.number().int().nullish(),
		match_by_release: z.boolean().nullish(),
	})
	.loose();
export const DeploymentCheckObject2Schema = z
	.object({
		deployment_check: z
			.object({
				name: z.string().optional(),
				description: z.string().optional(),
				stage: z.string().optional(),
				check_type: z.string().optional(),
				enabled: z.boolean().optional(),
				timeout_seconds: z.number().int().optional(),
				command: z.string().optional(),
				servers: z.array(z.string()).optional(),
				http_method: z.string().optional(),
				http_url: z.string().optional(),
				http_expected_status: z.number().int().optional(),
				http_body_match: z.string().optional(),
				scanner: z.string().optional(),
				scan_target_kind: z.string().optional(),
				scan_target: z.string().optional(),
				severity_threshold: z.string().optional(),
				fail_on_unfixed_only: z.boolean().optional(),
				sarif_output_path: z.string().optional(),
				integration_identifier: z.string().optional(),
				window_minutes: z.number().int().optional(),
				match_by_release: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const DeploymentScheduleSaveServerBranchObjectSchema = z
	.object({
		deployment: z
			.object({
				start_revision: z.string().optional(),
				end_revision: z.string().optional(),
				copy_config_files: z.boolean().optional(),
				notification_addresses: z.string().optional(),
				branch: z.string().optional(),
				parent_identifier: z.string().optional(),
				server_identifier: z.string().optional(),
				run_build_commands: z.boolean().optional(),
				use_build_cache: z.boolean().optional(),
				config_files_deployment: z.boolean().optional(),
				mode: z.string().optional(),
				use_latest: z.boolean().optional(),
				skip_if_not_changes: z.boolean().optional(),
			})
			.strict(),
		schedule: z
			.object({
				frequency: z.string().optional(),
				future: z
					.object({
						day: z.number().int().optional(),
						month: z.number().int().optional(),
						year: z.number().int().optional(),
						hour: z.number().int().optional(),
						minute: z.number().int().optional(),
					})
					.strict()
					.optional(),
				daily: z
					.object({
						hour: z.number().int().optional(),
						minute: z.number().int().optional(),
					})
					.strict()
					.optional(),
				weekly: z
					.object({
						weekday: z.number().int().optional(),
						hour: z.number().int().optional(),
						minute: z.number().int().optional(),
					})
					.strict()
					.optional(),
				monthly: z
					.object({
						day: z.number().int().optional(),
						hour: z.number().int().optional(),
						minute: z.number().int().optional(),
					})
					.strict()
					.optional(),
				custom: z
					.object({
						schedule: z.string().optional(),
						hour: z.number().int().optional(),
						minute: z.number().int().optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		save_server_branch: z.string().optional(),
		deployment_overview: z.string().optional(),
	})
	.strict();
export const StatusIdentifierObjectSchema = z
	.object({ status: z.string().optional(), identifier: z.string().optional() })
	.strict();
export const ScheduledDeploymentObjectSchema = z
	.object({ scheduled_deployment: z.record(z.string(), z.json()).optional() })
	.strict();
export const DeploymentSchema = z
	.object({
		identifier: z.string().nullish(),
		servers: z
			.array(
				z
					.object({
						id: z.number().int().nullish(),
						identifier: z.string().nullish(),
						name: z.string().nullish(),
						protocol_type: z.string().nullish(),
						server_path: z.string().nullish(),
						last_revision: z.string().nullish(),
						preferred_branch: z.string().nullish(),
						branch: z.string().nullish(),
						notify_email: z.string().nullish(),
						server_group_identifier: z.union([z.null(), z.string()]).nullish(),
						auto_deploy: z.boolean().nullish(),
						environment: z.string().nullish(),
						enabled: z.boolean().nullish(),
						agent: z.union([z.null(), z.string()]).nullish(),
						atomic: z.boolean().nullish(),
						atomic_strategy: z.string().nullish(),
						atomic_retention: z.number().int().nullish(),
						use_compression: z.boolean().nullish(),
						use_accelerated_transfer: z.boolean().nullish(),
						use_parallel_upload: z.boolean().nullish(),
						root_path: z.string().nullish(),
						position: z.number().int().nullish(),
						created_at: z.string().nullish(),
						updated_at: z.string().nullish(),
						connection_checked_at: z.union([z.null(), z.string()]).nullish(),
						connection_error_message: z.union([z.null(), z.string()]).nullish(),
						hostname: z.string().nullish(),
						username: z.string().nullish(),
						port: z.union([z.string(), z.number()]).nullish(),
						use_ssh_keys: z.boolean().nullish(),
						host_key: z.string().nullish(),
						unlink_before_upload: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
		project: z
			.object({
				name: z.string().nullish(),
				permalink: z.string().nullish(),
				identifier: z.string().nullish(),
				public_key: z.string().nullish(),
				repository: z
					.object({
						scm_type: z.string().nullish(),
						url: z.string().nullish(),
						port: z.union([z.null(), z.number().int()]).nullish(),
						username: z.union([z.null(), z.string()]).nullish(),
						branch: z.string().nullish(),
						cached: z.boolean().nullish(),
						hosting_service: z
							.object({
								name: z.string().nullish(),
								url: z.string().nullish(),
								tree_url: z.string().nullish(),
								commits_url: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				repository_url: z.string().nullish(),
				zone: z.string().nullish(),
				last_deployed_at: z.string().nullish(),
				folder: z.union([z.null(), z.string()]).nullish(),
				auto_deploy_url: z.string().nullish(),
			})
			.loose()
			.nullish(),
		deployer: z.union([z.null(), z.string()]).nullish(),
		deployer_avatar: z.union([z.null(), z.string()]).nullish(),
		branch: z.string().nullish(),
		start_revision: z.object({ ref: z.string().nullish() }).loose().nullish(),
		end_revision: z.object({ ref: z.string().nullish() }).loose().nullish(),
		status: z.string().nullish(),
		timestamps: z
			.object({
				queued_at: z.string().nullish(),
				started_at: z.union([z.null(), z.string()]).nullish(),
				completed_at: z.union([z.null(), z.string()]).nullish(),
				duration: z.union([z.null(), z.string()]).nullish(),
				runs_at: z.string().nullish(),
			})
			.loose()
			.nullish(),
		// The OpenAPI document uses one sample UUID property; runtime entries are keyed by actual server identifiers.
		files: z
			.record(
				z.string(),
				z
					.object({
						changed: z.array(z.json()).nullish(),
						removed: z.array(z.json()).nullish(),
					})
					.loose(),
			)
			.nullish(),
		configuration: z
			.object({
				copy_config_files: z.boolean().nullish(),
				notification_addresses: z.string().nullish(),
				skip_project_files: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		legacy: z.boolean().nullish(),
		deferred: z.boolean().nullish(),
		config_files_deployment: z.boolean().nullish(),
		overview: z.union([z.null(), z.string()]).nullish(),
		metadata: z.object({}).loose().nullish(),
		archived: z.boolean().nullish(),
		archived_at: z.union([z.null(), z.string()]).nullish(),
		log_summary: z.union([z.null(), z.string()]).nullish(),
		steps: z
			.array(
				z
					.object({
						step: z.string().nullish(),
						stage: z.string().nullish(),
						identifier: z.string().nullish(),
						server: z.union([z.null(), z.string()]).nullish(),
						total_items: z.union([z.null(), z.string()]).nullish(),
						completed_items: z.union([z.null(), z.string()]).nullish(),
						description: z.string().nullish(),
						status: z.string().nullish(),
						logs: z.boolean().nullish(),
						explainable: z.boolean().nullish(),
						deployment_started_at: z.union([z.null(), z.string()]).nullish(),
						updated_at: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const PaginationRecordsObjectSchema = z
	.object({
		pagination: z
			.object({
				current_page: z.number().int().nullish(),
				total_pages: z.number().int().nullish(),
				offset: z.number().int().nullish(),
				total_records: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
		records: z
			.array(
				z
					.object({
						identifier: z.string().nullish(),
						servers: z
							.array(
								z
									.object({
										id: z.number().int().nullish(),
										identifier: z.string().nullish(),
										name: z.string().nullish(),
										protocol_type: z.string().nullish(),
										server_path: z.string().nullish(),
										last_revision: z.string().nullish(),
										preferred_branch: z.string().nullish(),
										branch: z.string().nullish(),
										notify_email: z.string().nullish(),
										server_group_identifier: z
											.union([z.null(), z.string()])
											.nullish(),
										auto_deploy: z.boolean().nullish(),
										environment: z.string().nullish(),
										enabled: z.boolean().nullish(),
										agent: z.union([z.null(), z.string()]).nullish(),
										atomic: z.boolean().nullish(),
										atomic_strategy: z.string().nullish(),
										atomic_retention: z.number().int().nullish(),
										use_compression: z.boolean().nullish(),
										use_accelerated_transfer: z.boolean().nullish(),
										use_parallel_upload: z.boolean().nullish(),
										root_path: z.string().nullish(),
										position: z.number().int().nullish(),
										created_at: z.string().nullish(),
										updated_at: z.string().nullish(),
										connection_checked_at: z
											.union([z.null(), z.string()])
											.nullish(),
										connection_error_message: z
											.union([z.null(), z.string()])
											.nullish(),
										hostname: z.string().nullish(),
										username: z.string().nullish(),
										port: z.union([z.string(), z.number()]).nullish(),
										use_ssh_keys: z.boolean().nullish(),
										host_key: z.string().nullish(),
										unlink_before_upload: z.boolean().nullish(),
									})
									.loose(),
							)
							.nullish(),
						project: z
							.object({
								name: z.string().nullish(),
								permalink: z.string().nullish(),
								identifier: z.string().nullish(),
								public_key: z.string().nullish(),
								repository: z
									.object({
										scm_type: z.string().nullish(),
										url: z.string().nullish(),
										port: z.union([z.null(), z.number().int()]).nullish(),
										username: z.union([z.null(), z.string()]).nullish(),
										branch: z.string().nullish(),
										cached: z.boolean().nullish(),
										hosting_service: z
											.object({
												name: z.string().nullish(),
												url: z.string().nullish(),
												tree_url: z.string().nullish(),
												commits_url: z.string().nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
								repository_url: z.string().nullish(),
								zone: z.string().nullish(),
								last_deployed_at: z.string().nullish(),
								folder: z.union([z.null(), z.string()]).nullish(),
								auto_deploy_url: z.string().nullish(),
							})
							.loose()
							.nullish(),
						deployer: z.union([z.null(), z.string()]).nullish(),
						deployer_avatar: z.union([z.null(), z.string()]).nullish(),
						branch: z.string().nullish(),
						start_revision: z
							.object({ ref: z.string().nullish() })
							.loose()
							.nullish(),
						end_revision: z
							.object({ ref: z.string().nullish() })
							.loose()
							.nullish(),
						status: z.string().nullish(),
						timestamps: z
							.object({
								queued_at: z.string().nullish(),
								started_at: z.union([z.null(), z.string()]).nullish(),
								completed_at: z.union([z.null(), z.string()]).nullish(),
								duration: z.union([z.null(), z.string()]).nullish(),
								runs_at: z.string().nullish(),
							})
							.loose()
							.nullish(),
						// The OpenAPI document uses one sample UUID property; runtime entries are keyed by actual server identifiers.
						files: z
							.record(
								z.string(),
								z
									.object({
										changed: z.array(z.json()).nullish(),
										removed: z.array(z.json()).nullish(),
									})
									.loose(),
							)
							.nullish(),
						configuration: z
							.object({
								copy_config_files: z.boolean().nullish(),
								notification_addresses: z.string().nullish(),
								skip_project_files: z.boolean().nullish(),
							})
							.loose()
							.nullish(),
						legacy: z.boolean().nullish(),
						deferred: z.boolean().nullish(),
						config_files_deployment: z.boolean().nullish(),
						overview: z.union([z.null(), z.string()]).nullish(),
						metadata: z.object({}).loose().nullish(),
						archived: z.boolean().nullish(),
						archived_at: z.union([z.null(), z.string()]).nullish(),
						log_summary: z.union([z.null(), z.string()]).nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const IdStepMessageListSchema = z.array(
	z
		.object({
			id: z.number().int().nullish(),
			step: z.string().nullish(),
			message: z.string().nullish(),
			detail: z.string().nullish(),
			type: z.string().nullish(),
		})
		.loose(),
);
export const ExcludedFileListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			path: z.string().nullish(),
			servers: z
				.array(
					z
						.object({
							id: z.number().int().nullish(),
							identifier: z.string().nullish(),
							name: z.string().nullish(),
							protocol_type: z.string().nullish(),
							server_path: z.string().nullish(),
							last_revision: z.string().nullish(),
							preferred_branch: z.string().nullish(),
							branch: z.string().nullish(),
							notify_email: z.string().nullish(),
							server_group_identifier: z
								.union([z.null(), z.string()])
								.nullish(),
							auto_deploy: z.boolean().nullish(),
							environment: z.string().nullish(),
							enabled: z.boolean().nullish(),
							agent: z.union([z.null(), z.string()]).nullish(),
							atomic: z.union([z.null(), z.string()]).nullish(),
							atomic_strategy: z.string().nullish(),
							atomic_retention: z.number().int().nullish(),
							use_compression: z.boolean().nullish(),
							use_accelerated_transfer: z.boolean().nullish(),
							use_parallel_upload: z.boolean().nullish(),
							root_path: z.string().nullish(),
							position: z.number().int().nullish(),
							created_at: z.string().nullish(),
							updated_at: z.string().nullish(),
							connection_checked_at: z.union([z.null(), z.string()]).nullish(),
							connection_error_message: z
								.union([z.null(), z.string()])
								.nullish(),
							static_hosting: z
								.object({
									hosted_website_identifier: z.string().nullish(),
									subdomain: z.string().nullish(),
									url: z.string().nullish(),
									spa_mode: z.boolean().nullish(),
									status: z.string().nullish(),
									active_deployment_uuid: z.string().nullish(),
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
);
export const ExcludedFileObjectSchema = z
	.object({ excluded_file: z.object({ path: z.string() }).strict() })
	.strict();
export const ExcludedFileSchema = z
	.object({
		identifier: z.string().nullish(),
		path: z.string().nullish(),
		servers: z
			.array(
				z
					.object({
						id: z.number().int().nullish(),
						identifier: z.string().nullish(),
						name: z.string().nullish(),
						protocol_type: z.string().nullish(),
						server_path: z.string().nullish(),
						last_revision: z.string().nullish(),
						preferred_branch: z.string().nullish(),
						branch: z.string().nullish(),
						notify_email: z.string().nullish(),
						server_group_identifier: z.union([z.null(), z.string()]).nullish(),
						auto_deploy: z.boolean().nullish(),
						environment: z.string().nullish(),
						enabled: z.boolean().nullish(),
						agent: z.union([z.null(), z.string()]).nullish(),
						atomic: z.union([z.null(), z.string()]).nullish(),
						atomic_strategy: z.string().nullish(),
						atomic_retention: z.number().int().nullish(),
						use_compression: z.boolean().nullish(),
						use_accelerated_transfer: z.boolean().nullish(),
						use_parallel_upload: z.boolean().nullish(),
						root_path: z.string().nullish(),
						position: z.number().int().nullish(),
						created_at: z.string().nullish(),
						updated_at: z.string().nullish(),
						connection_checked_at: z.union([z.null(), z.string()]).nullish(),
						connection_error_message: z.union([z.null(), z.string()]).nullish(),
						static_hosting: z
							.object({
								hosted_website_identifier: z.string().nullish(),
								subdomain: z.string().nullish(),
								url: z.string().nullish(),
								spa_mode: z.boolean().nullish(),
								status: z.string().nullish(),
								active_deployment_uuid: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const ExcludedFileObject2Schema = z
	.object({
		excluded_file: z
			.object({
				path: z.string(),
				all_servers: z.boolean().optional(),
				server_identifiers: z.array(z.string()).optional(),
			})
			.strict(),
	})
	.strict();
export const IntegrationListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			hook_type: z.string().nullish(),
			name: z.string().nullish(),
			send_on_start: z.boolean().nullish(),
			send_on_completion: z.boolean().nullish(),
			send_on_failure: z.boolean().nullish(),
			send_on_check_failed: z.boolean().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
);
export const IntegrationObjectSchema = z
	.object({
		integration: z
			.object({
				hook_type: z.string(),
				send_on_completion: z.boolean().optional(),
				send_on_failure: z.boolean().optional(),
				send_on_check_failed: z.boolean().optional(),
				send_on_start: z.boolean().optional(),
				name: z.string().optional(),
				properties: z.record(z.string(), z.json()).optional(),
			})
			.strict(),
	})
	.strict();
export const IntegrationSchema = z
	.object({
		identifier: z.string().nullish(),
		hook_type: z.string().nullish(),
		name: z.string().nullish(),
		send_on_start: z.boolean().nullish(),
		send_on_completion: z.boolean().nullish(),
		send_on_failure: z.boolean().nullish(),
		send_on_check_failed: z.boolean().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();
export const IntegrationObject2Schema = z
	.object({
		integration: z
			.object({
				send_on_completion: z.boolean().optional(),
				send_on_failure: z.boolean().optional(),
				send_on_check_failed: z.boolean().optional(),
				send_on_start: z.boolean().optional(),
				name: z.string().optional(),
				properties: z.record(z.string(), z.json()).optional(),
				all_servers: z.boolean().optional(),
				server_identifiers: z.array(z.string()).optional(),
			})
			.strict(),
	})
	.strict();
export const NodeRubyPhpObject2Schema = z
	.object({
		node: z.string().nullish(),
		ruby: z.string().nullish(),
		php: z.string().nullish(),
	})
	.loose();
export const RepositorySchema = z
	.object({
		scm_type: z.string().nullish(),
		url: z.string().nullish(),
		port: z.union([z.null(), z.number().int()]).nullish(),
		username: z.union([z.null(), z.string()]).nullish(),
		branch: z.string().nullish(),
		cached: z.boolean().nullish(),
		hosting_service: z
			.object({
				name: z.string().nullish(),
				url: z.string().nullish(),
				tree_url: z.string().nullish(),
				commits_url: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export const RepositoryObjectSchema = z
	.object({
		repository: z
			.object({
				branch: z.string().optional(),
				root_path: z.string().optional(),
				hosting_service_type: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const ErrorMessageErrorCodeObjectSchema = z
	.object({
		error: z.string().optional(),
		message: z.string().optional(),
		error_code: z.string().optional(),
		hint: z.string().optional(),
	})
	.strict();
export const RepositoryObject2Schema = z
	.object({
		repository: z
			.object({
				url: z.string().optional(),
				scm_type: z.string().optional(),
				username: z.string().optional(),
				password: z.string().optional(),
				branch: z.string().optional(),
				port: z.number().int().optional(),
				root_path: z.string().optional(),
				hosting_service_type: z.string().optional(),
				manual_config: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const a81c845cacc4c45e88a92b3134ba586bSchema = z.record(
	z.string(),
	z.json(),
);
export const ErrorErrorCodeHintObjectSchema = z
	.object({ error: z.string(), error_code: z.string(), hint: z.string() })
	.strict();
export const RefAuthorEmailObjectSchema = z
	.object({
		ref: z.string(),
		author: z.string(),
		email: z.string(),
		timestamp: z.string().nullish(),
		message: z.string().nullish(),
		short_message: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		avatar_url: z.string().nullish(),
	})
	.loose();
export const MessageObjectSchema = z
	.object({ message: z.string().optional() })
	.strict();
export const RefObjectSchema = z.object({ ref: z.string().nullish() }).loose();
export const CommitsTagsReleasesObjectSchema = z
	.object({
		commits: z
			.array(
				z
					.object({
						ref: z.string(),
						author: z.string(),
						email: z.string(),
						timestamp: z.string().nullish(),
						message: z.string().nullish(),
						short_message: z.string().nullish(),
						tags: z.array(z.string()).nullish(),
						avatar_url: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		tags: z
			.array(
				z
					.object({ name: z.string(), ref: z.string(), message: z.string() })
					.loose(),
			)
			.nullish(),
		releases: z
			.array(
				z
					.object({ name: z.string().nullish(), ref: z.string().nullish() })
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const ScheduledDeploymentListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			server: z
				.object({
					identifier: z.string().nullish(),
					name: z.string().nullish(),
					servers: z
						.array(
							z
								.object({
									id: z.number().int().nullish(),
									identifier: z.string().nullish(),
									name: z.string().nullish(),
									protocol_type: z.string().nullish(),
									server_path: z.string().nullish(),
									last_revision: z.string().nullish(),
									preferred_branch: z.string().nullish(),
									branch: z.string().nullish(),
									notify_email: z.string().nullish(),
									server_group_identifier: z.string().nullish(),
									auto_deploy: z.boolean().nullish(),
									environment: z.string().nullish(),
									enabled: z.boolean().nullish(),
									agent: z.union([z.null(), z.string()]).nullish(),
									atomic: z.union([z.null(), z.string()]).nullish(),
									atomic_strategy: z.string().nullish(),
									atomic_retention: z.number().int().nullish(),
									use_compression: z.boolean().nullish(),
									use_accelerated_transfer: z.boolean().nullish(),
									use_parallel_upload: z.boolean().nullish(),
									root_path: z.string().nullish(),
									position: z.number().int().nullish(),
									created_at: z.string().nullish(),
									updated_at: z.string().nullish(),
									connection_checked_at: z
										.union([z.null(), z.string()])
										.nullish(),
									connection_error_message: z
										.union([z.null(), z.string()])
										.nullish(),
									hostname: z.string().nullish(),
									username: z.string().nullish(),
									port: z.union([z.string(), z.number()]).nullish(),
									passive: z.boolean().nullish(),
									force_hidden_files: z.boolean().nullish(),
									implicit: z.boolean().nullish(),
									ignore_certificate_errors: z.boolean().nullish(),
									tls_version: z.string().nullish(),
								})
								.loose(),
						)
						.nullish(),
					preferred_branch: z.string().nullish(),
					last_revision: z.string().nullish(),
					environment: z.string().nullish(),
					transfer_order: z.string().nullish(),
				})
				.loose()
				.nullish(),
			start_revision: z.string().nullish(),
			end_revision: z.string().nullish(),
			frequency: z.string().nullish(),
			at: z
				.object({
					day: z.number().int().nullish(),
					month: z.number().int().nullish(),
					year: z.number().int().nullish(),
					hour: z.number().int().nullish(),
					minute: z.number().int().nullish(),
				})
				.loose()
				.nullish(),
			next_deployment_at: z.string().nullish(),
			copy_config_files: z.boolean().nullish(),
			run_build_commands: z.boolean().nullish(),
			use_build_cache: z.boolean().nullish(),
			skip_project_files: z.boolean().nullish(),
			config_files_deployment: z.boolean().nullish(),
		})
		.loose(),
);
export const ScheduledDeploymentObject2Schema = z
	.object({
		scheduled_deployment: z
			.object({
				server_identifier: z.string(),
				frequency: z.string(),
				at: z.string().optional(),
				weekday: z.string().optional(),
				day: z.number().int().optional(),
				month: z.number().int().optional(),
				year: z.number().int().optional(),
				schedule: z.string().optional(),
				copy_config_files: z.boolean().optional(),
				run_build_commands: z.boolean().optional(),
				use_build_cache: z.boolean().optional(),
				skip_if_not_changes: z.boolean().optional(),
				start_revision: z.string().optional(),
				end_revision: z.string().optional(),
				use_latest: z.boolean().optional(),
				deploy_entire_repository: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const ScheduledDeploymentSchema = z
	.object({
		identifier: z.string().nullish(),
		server: z
			.object({
				identifier: z.string().nullish(),
				name: z.string().nullish(),
				servers: z
					.array(
						z
							.object({
								id: z.number().int().nullish(),
								identifier: z.string().nullish(),
								name: z.string().nullish(),
								protocol_type: z.string().nullish(),
								server_path: z.string().nullish(),
								last_revision: z.string().nullish(),
								preferred_branch: z.string().nullish(),
								branch: z.string().nullish(),
								notify_email: z.string().nullish(),
								server_group_identifier: z.string().nullish(),
								auto_deploy: z.boolean().nullish(),
								environment: z.string().nullish(),
								enabled: z.boolean().nullish(),
								agent: z.union([z.null(), z.string()]).nullish(),
								atomic: z.union([z.null(), z.string()]).nullish(),
								atomic_strategy: z.string().nullish(),
								atomic_retention: z.number().int().nullish(),
								use_compression: z.boolean().nullish(),
								use_accelerated_transfer: z.boolean().nullish(),
								use_parallel_upload: z.boolean().nullish(),
								root_path: z.string().nullish(),
								position: z.number().int().nullish(),
								created_at: z.string().nullish(),
								updated_at: z.string().nullish(),
								connection_checked_at: z
									.union([z.null(), z.string()])
									.nullish(),
								connection_error_message: z
									.union([z.null(), z.string()])
									.nullish(),
								hostname: z.string().nullish(),
								username: z.string().nullish(),
								port: z.union([z.string(), z.number()]).nullish(),
								passive: z.boolean().nullish(),
								force_hidden_files: z.boolean().nullish(),
								implicit: z.boolean().nullish(),
								ignore_certificate_errors: z.boolean().nullish(),
								tls_version: z.string().nullish(),
							})
							.loose(),
					)
					.nullish(),
				preferred_branch: z.string().nullish(),
				last_revision: z.string().nullish(),
				environment: z.string().nullish(),
				transfer_order: z.string().nullish(),
			})
			.loose()
			.nullish(),
		start_revision: z.string().nullish(),
		end_revision: z.string().nullish(),
		frequency: z.string().nullish(),
		at: z
			.object({
				day: z.number().int().nullish(),
				month: z.number().int().nullish(),
				year: z.number().int().nullish(),
				hour: z.number().int().nullish(),
				minute: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
		next_deployment_at: z.string().nullish(),
		copy_config_files: z.boolean().nullish(),
		run_build_commands: z.boolean().nullish(),
		use_build_cache: z.boolean().nullish(),
		skip_project_files: z.boolean().nullish(),
		config_files_deployment: z.boolean().nullish(),
	})
	.loose();
export const ScheduledDeploymentObject3Schema = z
	.object({
		scheduled_deployment: z
			.object({
				frequency: z.string().optional(),
				at: z.string().optional(),
				weekday: z.string().optional(),
				day: z.number().int().optional(),
				month: z.number().int().optional(),
				year: z.number().int().optional(),
				schedule: z.string().optional(),
				copy_config_files: z.boolean().optional(),
				run_build_commands: z.boolean().optional(),
				use_build_cache: z.boolean().optional(),
				skip_if_not_changes: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const ServerGroupListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			name: z.string().nullish(),
			servers: z
				.array(
					z
						.object({
							id: z.number().int().nullish(),
							identifier: z.string().nullish(),
							name: z.string().nullish(),
							protocol_type: z.string().nullish(),
							server_path: z.string().nullish(),
							last_revision: z.union([z.null(), z.string()]).nullish(),
							preferred_branch: z.string().nullish(),
							branch: z.string().nullish(),
							notify_email: z.string().nullish(),
							server_group_identifier: z.string().nullish(),
							auto_deploy: z.boolean().nullish(),
							environment: z.string().nullish(),
							enabled: z.boolean().nullish(),
							agent: z.union([z.null(), z.string()]).nullish(),
							atomic: z.boolean().nullish(),
							atomic_strategy: z.string().nullish(),
							atomic_retention: z.number().int().nullish(),
							use_compression: z.boolean().nullish(),
							use_accelerated_transfer: z.boolean().nullish(),
							use_parallel_upload: z.boolean().nullish(),
							root_path: z.string().nullish(),
							position: z.number().int().nullish(),
							created_at: z.string().nullish(),
							updated_at: z.string().nullish(),
							connection_checked_at: z.union([z.null(), z.string()]).nullish(),
							connection_error_message: z
								.union([z.null(), z.string()])
								.nullish(),
							hostname: z.string().nullish(),
							username: z.string().nullish(),
							port: z.union([z.string(), z.number()]).nullish(),
							use_ssh_keys: z.boolean().nullish(),
							host_key: z.string().nullish(),
							unlink_before_upload: z.boolean().nullish(),
							use_single_connection: z.boolean().nullish(),
							global_key_pair_id: z.string().nullish(),
						})
						.loose(),
				)
				.nullish(),
			preferred_branch: z.string().nullish(),
			last_revision: z.union([z.null(), z.string()]).nullish(),
			environment: z.string().nullish(),
			transfer_order: z.string().nullish(),
		})
		.loose(),
);
export const ServerGroupObjectSchema = z
	.object({
		server_group: z
			.object({
				name: z.string().optional(),
				branch: z.string().optional(),
				auto_deploy: z.boolean().optional(),
				email_notify_on: z.string().optional(),
				notification_email: z.string().optional(),
				transfer_order: z.string().optional(),
				environment: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const ServerGroupSchema = z
	.object({
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		servers: z
			.array(
				z
					.object({
						id: z.number().int().nullish(),
						identifier: z.string().nullish(),
						name: z.string().nullish(),
						protocol_type: z.string().nullish(),
						server_path: z.string().nullish(),
						last_revision: z.union([z.null(), z.string()]).nullish(),
						preferred_branch: z.string().nullish(),
						branch: z.string().nullish(),
						notify_email: z.string().nullish(),
						server_group_identifier: z.string().nullish(),
						auto_deploy: z.boolean().nullish(),
						environment: z.string().nullish(),
						enabled: z.boolean().nullish(),
						agent: z.union([z.null(), z.string()]).nullish(),
						atomic: z.boolean().nullish(),
						atomic_strategy: z.string().nullish(),
						atomic_retention: z.number().int().nullish(),
						use_compression: z.boolean().nullish(),
						use_accelerated_transfer: z.boolean().nullish(),
						use_parallel_upload: z.boolean().nullish(),
						root_path: z.string().nullish(),
						position: z.number().int().nullish(),
						created_at: z.string().nullish(),
						updated_at: z.string().nullish(),
						connection_checked_at: z.union([z.null(), z.string()]).nullish(),
						connection_error_message: z.union([z.null(), z.string()]).nullish(),
						hostname: z.string().nullish(),
						username: z.string().nullish(),
						port: z.union([z.string(), z.number()]).nullish(),
						use_ssh_keys: z.boolean().nullish(),
						host_key: z.string().nullish(),
						unlink_before_upload: z.boolean().nullish(),
						use_single_connection: z.boolean().nullish(),
						global_key_pair_id: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		preferred_branch: z.string().nullish(),
		last_revision: z.union([z.null(), z.string()]).nullish(),
		environment: z.string().nullish(),
		transfer_order: z.string().nullish(),
	})
	.loose();
export const ServerRegionSizeObject2Schema = z
	.object({
		server: z
			.object({
				...ServerConnectionFields,
				name: z.string().optional(),
				protocol_type: z.string().optional(),
				server_path: z.string().optional(),
				email_notify_on: z.string().optional(),
				root_path: z.string().optional(),
				auto_deploy: z.boolean().optional(),
				notification_email: z.string().optional(),
				branch: z.string().optional(),
				environment: z.string().optional(),
				server_group_identifier: z.string().optional(),
				agent_id: z.string().optional(),
				enabled: z.boolean().optional(),
				global_key_pair_id: z.string().optional(),
				atomic: z.boolean().optional(),
				atomic_strategy: z.string().optional(),
				atomic_retention: z.number().int().optional(),
				docker_image: z.string().optional(),
				docker_image_source: z.string().optional(),
				curated_template_id: z.string().optional(),
				commands: z.string().optional(),
				halt_on_error: z.boolean().optional(),
			})
			.strict(),
		region: z.string().optional(),
		size: z.string().optional(),
		os_image: z.string().optional(),
		key_pair_identifier: z.string().optional(),
		hosted_website_attributes: z
			.object({
				subdomain: z.string().optional(),
				spa_mode: z.boolean().optional(),
				subdirectory: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const IdIdentifierNameObject2Schema = z
	.object({
		id: z.number().int().nullish(),
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		protocol_type: z.string().nullish(),
		enabled: z.boolean().nullish(),
		static_hosting: z
			.object({
				hosted_website_identifier: z.string().nullish(),
				subdomain: z.string().nullish(),
				url: z.string().nullish(),
				spa_mode: z.boolean().nullish(),
				status: z.string().nullish(),
				active_deployment_uuid: z.string().nullish(),
			})
			.loose()
			.nullish(),
		managed_vps: z
			.object({
				hosted_resource_identifier: z.string().nullish(),
				status: z.string().nullish(),
				ip_address: z.string().nullish(),
				region: z.string().nullish(),
				size: z.string().nullish(),
				ssh_key: z
					.object({
						identifier: z.string().nullish(),
						title: z.string().nullish(),
						fingerprint: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export const ServerObject2Schema = z
	.object({
		server: z
			.object({
				...ServerConnectionFields,
				name: z.string().optional(),
				server_path: z.string().optional(),
				email_notify_on: z.string().optional(),
				root_path: z.string().optional(),
				auto_deploy: z.boolean().optional(),
				notification_email: z.string().optional(),
				branch: z.string().optional(),
				environment: z.string().optional(),
				server_group_identifier: z.string().optional(),
				agent_id: z.string().optional(),
				enabled: z.boolean().optional(),
				global_key_pair_id: z.string().optional(),
				atomic: z.boolean().optional(),
				atomic_strategy: z.string().optional(),
				atomic_retention: z.number().int().optional(),
				docker_image: z.string().optional(),
				docker_image_source: z.string().optional(),
				curated_template_id: z.string().optional(),
				commands: z.string().optional(),
				halt_on_error: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const CpuMemoryDiskObjectSchema = z
	.object({
		cpu: z.record(z.string(), z.json()).nullish(),
		memory: z.record(z.string(), z.json()).nullish(),
		disk: z.record(z.string(), z.json()).nullish(),
		uptime: z.string().nullish(),
		profile: z.record(z.string(), z.json()).nullish(),
	})
	.loose();
export const IdentifierStatusCreatedAtObjectSchema = z
	.object({
		identifier: z.string(),
		status: z.string(),
		created_at: z.string(),
	})
	.loose();
export const IdentifierStatusCreatedAtObject2Schema = z
	.object({
		identifier: z.string(),
		status: z.string(),
		created_at: z.string(),
		completed_at: z.string().nullish(),
		results: z
			.object({
				repository: z
					.object({ status: z.string(), message: z.string().nullish() })
					.loose()
					.nullish(),
				servers: z
					.array(
						z
							.object({
								name: z.string(),
								identifier: z.string(),
								status: z.string(),
								message: z.string().nullish(),
							})
							.loose(),
					)
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export const EmailAddressObjectSchema = z
	.object({ email_address: z.string() })
	.strict();
export const StatusMessageObjectSchema = z
	.object({ status: z.string().nullish(), message: z.string().nullish() })
	.loose();
export const ApiKeyObjectSchema = z
	.object({
		api_key: z
			.object({ description: z.string(), read_only: z.boolean().optional() })
			.strict(),
	})
	.strict();
export const ApiKeyIdentifierDescriptionObjectSchema = z
	.object({
		api_key: z.string().nullish(),
		identifier: z.string().nullish(),
		description: z.string().nullish(),
		user_id: z.number().int().nullish(),
		device: z.string().nullish(),
		read_only: z.boolean().nullish(),
		html: z.string().nullish(),
	})
	.loose();
export const IdentifierTitlePublicKeyListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			title: z.string().nullish(),
			public_key: z.string().nullish(),
			key_type: z.string().nullish(),
			fingerprint: z.string().nullish(),
			account: z.string().nullish(),
		})
		.loose(),
);
export const KeyPairObjectSchema = z
	.object({
		key_pair: z
			.object({
				title: z.string(),
				key_type: z.string().optional(),
				use_custom_key: z.boolean().optional(),
				custom_private_key: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const IdentifierTitlePublicKeyObjectSchema = z
	.object({
		identifier: z.string().nullish(),
		title: z.string().nullish(),
		public_key: z.string().nullish(),
		key_type: z.string().nullish(),
		fingerprint: z.string().nullish(),
		account: z.string().nullish(),
	})
	.loose();
export const IdentifierNameIsAdminListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			name: z.string().nullish(),
			is_admin: z.boolean().nullish(),
			can_manage_users: z.boolean().nullish(),
			can_manage_billing: z.boolean().nullish(),
			can_manage_agents: z.boolean().nullish(),
			can_create_projects: z.boolean().nullish(),
			all_projects_allowed: z.boolean().nullish(),
			members: z
				.array(
					z
						.object({
							id: z.number().int().nullish(),
							identifier: z.string().nullish(),
							first_name: z.string().nullish(),
							last_name: z.string().nullish(),
							email_address: z.string().nullish(),
						})
						.loose(),
				)
				.nullish(),
			project_assignments: z
				.array(
					z
						.object({
							name: z.string().nullish(),
							identifier: z.string().nullish(),
							can_deploy_all: z.boolean().nullish(),
							can_update_config: z.boolean().nullish(),
							can_manage_config_files: z.boolean().nullish(),
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
);
export const TeamObjectSchema = z
	.object({
		team: z
			.object({
				name: z.string(),
				is_admin: z.boolean().optional(),
				can_manage_users: z.boolean().optional(),
				can_manage_billing: z.boolean().optional(),
				can_manage_agents: z.boolean().optional(),
				can_create_projects: z.boolean().optional(),
				all_projects_allowed: z.boolean().optional(),
				user_ids: z.array(z.number().int()).optional(),
			})
			.strict(),
	})
	.strict();
export const IdentifierNameIsAdminObjectSchema = z
	.object({
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		is_admin: z.boolean().nullish(),
		can_manage_users: z.boolean().nullish(),
		can_manage_billing: z.boolean().nullish(),
		can_manage_agents: z.boolean().nullish(),
		can_create_projects: z.boolean().nullish(),
		all_projects_allowed: z.boolean().nullish(),
		members: z
			.array(
				z
					.object({
						id: z.number().int().nullish(),
						identifier: z.string().nullish(),
						first_name: z.string().nullish(),
						last_name: z.string().nullish(),
						email_address: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		project_assignments: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						identifier: z.string().nullish(),
						can_deploy_all: z.boolean().nullish(),
						can_update_config: z.boolean().nullish(),
						can_manage_config_files: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const TeamObject2Schema = z
	.object({
		team: z
			.object({
				name: z.string().optional(),
				is_admin: z.boolean().optional(),
				can_manage_users: z.boolean().optional(),
				can_manage_billing: z.boolean().optional(),
				can_manage_agents: z.boolean().optional(),
				can_create_projects: z.boolean().optional(),
				all_projects_allowed: z.boolean().optional(),
				user_ids: z.array(z.number().int()).optional(),
			})
			.strict(),
	})
	.strict();
export const TemplateListSchema = z.array(
	z
		.object({
			name: z.string().nullish(),
			permalink: z.string().nullish(),
			description: z.string().nullish(),
		})
		.loose(),
);
export const TemplateObjectSchema = z
	.object({
		template: z
			.object({
				name: z.string().optional(),
				notification_email: z.string().optional(),
				email_notify: z.boolean().optional(),
				project_id: z.string().optional(),
				description: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const TemplateSchema = z
	.object({
		name: z.string().nullish(),
		permalink: z.string().nullish(),
		description: z.string().nullish(),
	})
	.loose();
export const IdPermalinkNameListSchema = z.array(
	z
		.object({
			id: z.number().int().nullish(),
			permalink: z.string().nullish(),
			name: z.string().nullish(),
			description: z.string().nullish(),
			framework_type: z.string().nullish(),
			version: z.string().nullish(),
			public: z.boolean().nullish(),
		})
		.loose(),
);
export const TemplateObject2Schema = z
	.object({
		template: z
			.object({
				name: z.string().optional(),
				description: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const IdPermalinkNameObjectSchema = z
	.object({
		id: z.number().int().nullish(),
		permalink: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		framework_type: z.string().nullish(),
		version: z.string().nullish(),
		features: z.array(z.string()).nullish(),
		build_commands: z
			.array(
				z
					.object({
						command: z.string().nullish(),
						description: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		ssh_commands: z
			.array(
				z
					.object({
						command: z.string().nullish(),
						description: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		excluded_files: z.array(z.string()).nullish(),
		config_files: z
			.array(
				z
					.object({ path: z.string().nullish(), body: z.string().nullish() })
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const UserListSchema = z.array(
	z
		.object({
			first_name: z.string().nullish(),
			last_name: z.string().nullish(),
			email_address: z.string().nullish(),
			time_zone: z.union([z.null(), z.string()]).nullish(),
			id: z.number().int().nullish(),
			identifier: z.string().nullish(),
			account_administrator: z.boolean().nullish(),
			activated: z.boolean().nullish(),
			can_manage_users: z.boolean().nullish(),
			can_manage_billing: z.boolean().nullish(),
			can_create_projects: z.boolean().nullish(),
			can_manage_agents: z.boolean().nullish(),
			all_projects_allowed: z.boolean().nullish(),
		})
		.loose(),
);
export const UserObject2Schema = z
	.object({
		user: z
			.object({
				first_name: z.string(),
				last_name: z.string().optional(),
				email_address: z.string(),
				time_zone: z.string().optional(),
				account_administrator: z.boolean().optional(),
				can_manage_users: z.boolean().optional(),
				can_manage_billing: z.boolean().optional(),
				can_manage_agents: z.boolean().optional(),
				can_create_projects: z.boolean().optional(),
				all_projects_allowed: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const IdIdentifierFirstNameObjectSchema = z
	.object({
		id: z.number().int().nullish(),
		identifier: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email_address: z.string().nullish(),
		time_zone: z.string().nullish(),
		account_administrator: z.boolean().nullish(),
		activated: z.boolean().nullish(),
		can_manage_users: z.boolean().nullish(),
		can_manage_billing: z.boolean().nullish(),
		can_create_projects: z.boolean().nullish(),
		can_manage_agents: z.boolean().nullish(),
		all_projects_allowed: z.boolean().nullish(),
	})
	.loose();
export const UserSchema = z
	.object({
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email_address: z.string().nullish(),
		time_zone: z.union([z.null(), z.string()]).nullish(),
		id: z.number().int().nullish(),
		identifier: z.string().nullish(),
		account_administrator: z.boolean().nullish(),
		activated: z.boolean().nullish(),
		can_manage_users: z.boolean().nullish(),
		can_manage_billing: z.boolean().nullish(),
		can_create_projects: z.boolean().nullish(),
		can_manage_agents: z.boolean().nullish(),
		all_projects_allowed: z.boolean().nullish(),
	})
	.loose();
export const UserObject3Schema = z
	.object({
		user: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email_address: z.string().optional(),
				time_zone: z.string().optional(),
				account_administrator: z.boolean().optional(),
				can_manage_users: z.boolean().optional(),
				can_manage_billing: z.boolean().optional(),
				can_manage_agents: z.boolean().optional(),
				can_create_projects: z.boolean().optional(),
				all_projects_allowed: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const ErrorErrorCodeObjectSchema = z
	.object({ error: z.string().optional(), error_code: z.string().optional() })
	.strict();
export const IdentifierDescriptionListSchema = z.array(
	z
		.object({
			identifier: z.string().nullish(),
			description: z.string().nullish(),
		})
		.loose(),
);
