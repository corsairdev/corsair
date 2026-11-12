// Generated from DeployHQ official OpenAPI documentation. Do not edit by hand.
// Source: https://api.deployhq.com/docs.json
import { z } from 'zod';

export const NamePermalinkTimeZoneObjectSchema = z
	.object({
		name: z.string().optional(),
		permalink: z.string().optional(),
		time_zone: z.string().optional(),
		package: z.string().optional(),
		trialling: z.boolean().optional(),
		suspended: z.boolean().optional(),
		project_count: z.number().int().optional(),
		project_limit: z.number().int().optional(),
		users_allowed: z.boolean().optional(),
		ai_features_disabled: z.boolean().optional(),
	})
	.strict();
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
		package: z.string().optional(),
		frequency: z.number().int().optional(),
		trialling: z.boolean().optional(),
		suspended: z.boolean().optional(),
		scheduled_change: z
			.object({
				target_package: z.string().optional(),
				target_frequency: z.number().int().optional(),
				effective_at: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const NumberKindCurrencyListSchema = z.array(
	z
		.object({
			number: z.number().int().optional(),
			kind: z.string().optional(),
			currency: z.string().optional(),
			total: z.string().optional(),
			vat: z.string().optional(),
			paid: z.boolean().optional(),
			paid_at: z.string().optional(),
			created_at: z.string().optional(),
			download_url: z.string().optional(),
		})
		.strict(),
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
			id: z.number().int().optional(),
			created_at: z.string().optional(),
			identifier: z.string().optional(),
			name: z.string().optional(),
			online: z.boolean().optional(),
			revoked_at: z.union([z.null(), z.string()]).optional(),
			updated_at: z.string().optional(),
		})
		.strict(),
);
export const AgentObjectSchema = z
	.object({ agent: z.object({ claim_code: z.string() }).strict() })
	.strict();
export const AgentSchema = z
	.object({
		id: z.number().int().optional(),
		created_at: z.string().optional(),
		identifier: z.string().optional(),
		name: z.string().optional(),
		online: z.boolean().optional(),
		revoked_at: z.union([z.null(), z.string()]).optional(),
		updated_at: z.string().optional(),
	})
	.strict();
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
	.object({ status: z.string().optional() })
	.strict();
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
		account: z.record(z.string(), z.json()).optional(),
		api_key: z.string().optional(),
		ssh_public_key: z.record(z.string(), z.json()).optional(),
		oauth_urls: z.record(z.string(), z.json()).optional(),
		mcp_config: z.record(z.string(), z.json()).optional(),
		email_verified: z.boolean().optional(),
		client: z.string().optional(),
	})
	.strict();
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
		enrolled: z.boolean().optional(),
		beta_features: z.boolean().optional(),
	})
	.strict();
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
		stack: z.string().optional(),
		version: z.string().optional(),
		evidence: z.array(z.string()).optional(),
		description: z.string().optional(),
		suggested_protocol: z.string().optional(),
		static_hosting: z
			.object({
				eligibility: z.string().optional(),
				root_path: z.string().optional(),
				spa_mode: z.boolean().optional(),
				confidence: z.string().optional(),
			})
			.strict()
			.optional(),
		build_commands: z
			.array(
				z
					.object({
						description: z.string().optional(),
						command: z.string().optional(),
						halt_on_error: z.boolean().optional(),
						template_name: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
		excluded_files: z
			.array(z.object({ path: z.string().optional() }).strict())
			.optional(),
		build_cache_files: z
			.array(z.object({ path: z.string().optional() }).strict())
			.optional(),
		ai_assisted: z.boolean().optional(),
	})
	.strict();
export const ErrorObjectSchema = z.object({ error: z.string() }).strict();
export const IdentifierNamePositionListSchema = z.array(
	z
		.object({
			identifier: z.string().optional(),
			name: z.string().optional(),
			position: z.number().int().optional(),
			projects_count: z.number().int().optional(),
		})
		.strict(),
);
export const FolderObjectSchema = z
	.object({ folder: z.object({ name: z.string() }).strict() })
	.strict();
export const IdentifierNamePositionObjectSchema = z
	.object({
		identifier: z.string().optional(),
		name: z.string().optional(),
		position: z.number().int().optional(),
		projects_count: z.number().int().optional(),
	})
	.strict();
export const FieldWithErrorObject3Schema = z
	.object({ field_with_error: z.array(z.string()).optional() })
	.strict();
export const BuildCommandListSchema = z.array(
	z
		.object({
			id: z.number().int().optional(),
			project_id: z.union([z.null(), z.number().int()]).optional(),
			description: z.string().optional(),
			command: z.string().optional(),
			halt_on_error: z.boolean().optional(),
			position: z.number().int().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			identifier: z.string().optional(),
			parent_type: z.string().optional(),
			parent_id: z.number().int().optional(),
			template_name: z.string().optional(),
			enabled: z.boolean().optional(),
			watch_files: z.string().optional(),
			source: z.string().optional(),
		})
		.strict(),
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
		id: z.number().int().optional(),
		project_id: z.union([z.null(), z.number().int()]).optional(),
		description: z.string().optional(),
		command: z.string().optional(),
		halt_on_error: z.boolean().optional(),
		position: z.number().int().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		identifier: z.string().optional(),
		parent_type: z.string().optional(),
		parent_id: z.number().int().optional(),
		template_name: z.string().optional(),
		enabled: z.boolean().optional(),
		watch_files: z.string().optional(),
		source: z.string().optional(),
	})
	.strict();
export const ConfigFileListSchema = z.array(
	z
		.object({
			identifier: z.string().optional(),
			description: z.union([z.null(), z.string()]).optional(),
			path: z.string().optional(),
			body: z.string().optional(),
			build: z.boolean().optional(),
			servers: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							identifier: z.string().optional(),
							name: z.string().optional(),
							protocol_type: z.string().optional(),
							server_path: z.string().optional(),
							last_revision: z.union([z.null(), z.string()]).optional(),
							preferred_branch: z.string().optional(),
							branch: z.union([z.null(), z.string()]).optional(),
							notify_email: z.string().optional(),
							server_group_identifier: z.string().optional(),
							auto_deploy: z.boolean().optional(),
							environment: z.string().optional(),
							enabled: z.boolean().optional(),
							agent: z
								.object({
									id: z.number().int().optional(),
									created_at: z.string().optional(),
									identifier: z.string().optional(),
									name: z.string().optional(),
									online: z.boolean().optional(),
									revoked_at: z.union([z.null(), z.string()]).optional(),
									updated_at: z.string().optional(),
								})
								.strict()
								.optional(),
							atomic: z.boolean().optional(),
							atomic_strategy: z.string().optional(),
							atomic_retention: z.number().int().optional(),
							use_compression: z.boolean().optional(),
							use_accelerated_transfer: z.boolean().optional(),
							use_parallel_upload: z.boolean().optional(),
							root_path: z.union([z.null(), z.string()]).optional(),
							position: z.number().int().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							connection_checked_at: z.union([z.null(), z.string()]).optional(),
							connection_error_message: z
								.union([z.null(), z.string()])
								.optional(),
							hostname: z.string().optional(),
							username: z.string().optional(),
							port: z.string().optional(),
							use_ssh_keys: z.boolean().optional(),
							host_key: z.string().optional(),
							unlink_before_upload: z.boolean().optional(),
							global_key_pair_id: z.string().optional(),
						})
						.strict(),
				)
				.optional(),
		})
		.strict(),
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
		identifier: z.string().optional(),
		description: z.union([z.null(), z.string()]).optional(),
		path: z.string().optional(),
		body: z.string().optional(),
		build: z.boolean().optional(),
		servers: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						identifier: z.string().optional(),
						name: z.string().optional(),
						protocol_type: z.string().optional(),
						server_path: z.string().optional(),
						last_revision: z.union([z.null(), z.string()]).optional(),
						preferred_branch: z.string().optional(),
						branch: z.union([z.null(), z.string()]).optional(),
						notify_email: z.string().optional(),
						server_group_identifier: z.string().optional(),
						auto_deploy: z.boolean().optional(),
						environment: z.string().optional(),
						enabled: z.boolean().optional(),
						agent: z
							.object({
								id: z.number().int().optional(),
								created_at: z.string().optional(),
								identifier: z.string().optional(),
								name: z.string().optional(),
								online: z.boolean().optional(),
								revoked_at: z.union([z.null(), z.string()]).optional(),
								updated_at: z.string().optional(),
							})
							.strict()
							.optional(),
						atomic: z.boolean().optional(),
						atomic_strategy: z.string().optional(),
						atomic_retention: z.number().int().optional(),
						use_compression: z.boolean().optional(),
						use_accelerated_transfer: z.boolean().optional(),
						use_parallel_upload: z.boolean().optional(),
						root_path: z.union([z.null(), z.string()]).optional(),
						position: z.number().int().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						connection_checked_at: z.union([z.null(), z.string()]).optional(),
						connection_error_message: z
							.union([z.null(), z.string()])
							.optional(),
						hostname: z.string().optional(),
						username: z.string().optional(),
						port: z.string().optional(),
						use_ssh_keys: z.boolean().optional(),
						host_key: z.string().optional(),
						unlink_before_upload: z.boolean().optional(),
						global_key_pair_id: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const EnvironmentVariableListSchema = z.array(
	z
		.object({
			identifier: z.number().int().optional(),
			name: z.string().optional(),
			masked_value: z.string().optional(),
			locked: z.boolean().optional(),
			build_pipeline: z.boolean().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.strict(),
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
		identifier: z.number().int().optional(),
		name: z.string().optional(),
		masked_value: z.string().optional(),
		locked: z.boolean().optional(),
		build_pipeline: z.boolean().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.strict();
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
			id: z.number().int().optional(),
			identifier: z.string().optional(),
			name: z.string().optional(),
			protocol_type: z.string().optional(),
			server_path: z.string().optional(),
			last_revision: z.union([z.null(), z.string()]).optional(),
			preferred_branch: z.string().optional(),
			branch: z.string().optional(),
			notify_email: z.string().optional(),
			server_group_identifier: z.union([z.null(), z.string()]).optional(),
			auto_deploy: z.boolean().optional(),
			environment: z.string().optional(),
			enabled: z.boolean().optional(),
			agent: z.union([z.null(), z.string()]).optional(),
			atomic: z.boolean().optional(),
			atomic_strategy: z.string().optional(),
			atomic_retention: z.number().int().optional(),
			use_compression: z.boolean().optional(),
			use_accelerated_transfer: z.boolean().optional(),
			use_parallel_upload: z.boolean().optional(),
			root_path: z.string().optional(),
			position: z.number().int().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			connection_checked_at: z.union([z.null(), z.string()]).optional(),
			connection_error_message: z.union([z.null(), z.string()]).optional(),
			hostname: z.string().optional(),
			username: z.string().optional(),
			port: z.string().optional(),
			use_ssh_keys: z.boolean().optional(),
			host_key: z.string().optional(),
			unlink_before_upload: z.boolean().optional(),
		})
		.strict(),
);
export const ServerRegionSizeObjectSchema = z
	.object({
		server: z
			.object({
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
		id: z.number().int().optional(),
		identifier: z.string().optional(),
		name: z.string().optional(),
		protocol_type: z.string().optional(),
		server_path: z.string().optional(),
		last_revision: z.union([z.null(), z.string()]).optional(),
		preferred_branch: z.string().optional(),
		branch: z.string().optional(),
		notify_email: z.string().optional(),
		server_group_identifier: z.union([z.null(), z.string()]).optional(),
		auto_deploy: z.boolean().optional(),
		environment: z.string().optional(),
		enabled: z.boolean().optional(),
		agent: z.union([z.null(), z.string()]).optional(),
		atomic: z.boolean().optional(),
		atomic_strategy: z.string().optional(),
		atomic_retention: z.number().int().optional(),
		use_compression: z.boolean().optional(),
		use_accelerated_transfer: z.boolean().optional(),
		use_parallel_upload: z.boolean().optional(),
		root_path: z.string().optional(),
		position: z.number().int().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		connection_checked_at: z.union([z.null(), z.string()]).optional(),
		connection_error_message: z.union([z.null(), z.string()]).optional(),
		hostname: z.string().optional(),
		username: z.string().optional(),
		port: z.string().optional(),
		use_ssh_keys: z.boolean().optional(),
		host_key: z.string().optional(),
		unlink_before_upload: z.boolean().optional(),
	})
	.strict();
export const IdIdentifierNameObjectSchema = z
	.object({
		id: z.number().int().optional(),
		identifier: z.string().optional(),
		name: z.string().optional(),
		protocol_type: z.string().optional(),
		enabled: z.boolean().optional(),
		managed_vps: z
			.object({
				hosted_resource_identifier: z.string().optional(),
				status: z.string().optional(),
				ip_address: z.string().optional(),
				region: z.string().optional(),
				size: z.string().optional(),
				ssh_key: z
					.object({
						identifier: z.string().optional(),
						title: z.string().optional(),
						fingerprint: z.string().optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const ServerObjectSchema = z
	.object({
		server: z
			.object({
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
			identifier: z.string().optional(),
			cback: z.string().optional(),
			position: z.number().int().optional(),
			description: z.string().optional(),
			command: z.string().optional(),
			halt_on_error: z.boolean().optional(),
			servers: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							identifier: z.string().optional(),
							name: z.string().optional(),
							protocol_type: z.string().optional(),
							server_path: z.string().optional(),
							last_revision: z.string().optional(),
							preferred_branch: z.string().optional(),
							branch: z.string().optional(),
							notify_email: z.string().optional(),
							server_group_identifier: z
								.union([z.null(), z.string()])
								.optional(),
							auto_deploy: z.boolean().optional(),
							environment: z.string().optional(),
							enabled: z.boolean().optional(),
							agent: z.union([z.null(), z.string()]).optional(),
							atomic: z.boolean().optional(),
							atomic_strategy: z.string().optional(),
							atomic_retention: z.number().int().optional(),
							use_compression: z.boolean().optional(),
							use_accelerated_transfer: z.boolean().optional(),
							use_parallel_upload: z.boolean().optional(),
							root_path: z.string().optional(),
							position: z.number().int().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							connection_checked_at: z.union([z.null(), z.string()]).optional(),
							connection_error_message: z
								.union([z.null(), z.string()])
								.optional(),
							hostname: z.string().optional(),
							username: z.string().optional(),
							port: z.string().optional(),
							use_ssh_keys: z.boolean().optional(),
							host_key: z.string().optional(),
							unlink_before_upload: z.boolean().optional(),
						})
						.strict(),
				)
				.optional(),
			timing: z.string().optional(),
			timeout: z.number().int().optional(),
			enabled: z.boolean().optional(),
		})
		.strict(),
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
		identifier: z.string().optional(),
		cback: z.string().optional(),
		position: z.number().int().optional(),
		description: z.string().optional(),
		command: z.string().optional(),
		halt_on_error: z.boolean().optional(),
		servers: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						identifier: z.string().optional(),
						name: z.string().optional(),
						protocol_type: z.string().optional(),
						server_path: z.string().optional(),
						last_revision: z.string().optional(),
						preferred_branch: z.string().optional(),
						branch: z.string().optional(),
						notify_email: z.string().optional(),
						server_group_identifier: z.union([z.null(), z.string()]).optional(),
						auto_deploy: z.boolean().optional(),
						environment: z.string().optional(),
						enabled: z.boolean().optional(),
						agent: z.union([z.null(), z.string()]).optional(),
						atomic: z.boolean().optional(),
						atomic_strategy: z.string().optional(),
						atomic_retention: z.number().int().optional(),
						use_compression: z.boolean().optional(),
						use_accelerated_transfer: z.boolean().optional(),
						use_parallel_upload: z.boolean().optional(),
						root_path: z.string().optional(),
						position: z.number().int().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						connection_checked_at: z.union([z.null(), z.string()]).optional(),
						connection_error_message: z
							.union([z.null(), z.string()])
							.optional(),
						hostname: z.string().optional(),
						username: z.string().optional(),
						port: z.string().optional(),
						use_ssh_keys: z.boolean().optional(),
						host_key: z.string().optional(),
						unlink_before_upload: z.boolean().optional(),
					})
					.strict(),
			)
			.optional(),
		timing: z.string().optional(),
		timeout: z.number().int().optional(),
		enabled: z.boolean().optional(),
	})
	.strict();
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
			kind: z.string().optional(),
			identifier: z.string().optional(),
			name: z.string().optional(),
			status: z.string().optional(),
			monthly_cost: z.json().optional(),
			region: z.string().optional(),
			size: z.string().optional(),
			ip_address: z.string().optional(),
			ssh_key: z
				.object({
					identifier: z.string().optional(),
					title: z.string().optional(),
					public_key: z.string().optional(),
					key_type: z.string().optional(),
					fingerprint: z.string().optional(),
					account: z.string().optional(),
				})
				.strict()
				.optional(),
			subdomain: z.string().optional(),
			spa_mode: z.boolean().optional(),
			storage_bytes_total: z.number().int().optional(),
			active_deployment_uuid: z.string().optional(),
			deployment_count: z.number().int().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.strict(),
);
export const KindIdentifierNameObjectSchema = z
	.object({
		kind: z.string().optional(),
		identifier: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		monthly_cost: z.json().optional(),
		region: z.string().optional(),
		size: z.string().optional(),
		ip_address: z.string().optional(),
		ssh_key: z
			.object({
				identifier: z.string().optional(),
				title: z.string().optional(),
				public_key: z.string().optional(),
				key_type: z.string().optional(),
				fingerprint: z.string().optional(),
				account: z.string().optional(),
			})
			.strict()
			.optional(),
		subdomain: z.string().optional(),
		spa_mode: z.boolean().optional(),
		storage_bytes_total: z.number().int().optional(),
		active_deployment_uuid: z.string().optional(),
		deployment_count: z.number().int().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.strict();
export const ErrorObject2Schema = z
	.object({ error: z.string().optional() })
	.strict();
export const SharedZonesNetworkAgentObjectSchema = z
	.object({
		shared: z
			.object({
				ipv4: z.array(z.string()).optional(),
				ipv6: z.array(z.string()).optional(),
			})
			.strict()
			.optional(),
		zones: z
			.object({
				uk: z
					.object({
						name: z.string().optional(),
						ipv4: z.array(z.string()).optional(),
						ipv6: z.array(z.string()).optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		network_agent: z
			.object({
				ipv4: z.array(z.string()).optional(),
				ipv6: z.array(z.string()).optional(),
			})
			.strict()
			.optional(),
		all_ipv4: z.array(z.string()).optional(),
		all_ipv6: z.array(z.string()).optional(),
		ports: z
			.array(
				z
					.object({
						protocol: z.string().optional(),
						description: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const NodeRubyPhpObjectSchema = z
	.object({
		node: z.array(z.string()).optional(),
		ruby: z.array(z.string()).optional(),
		php: z.array(z.string()).optional(),
	})
	.strict();
export const GroupedRegionsObjectSchema = z
	.object({ grouped_regions: z.record(z.string(), z.json()).optional() })
	.strict();
export const SizesObjectSchema = z
	.object({
		sizes: z
			.array(
				z
					.object({
						slug: z.string().optional(),
						label: z.string().optional(),
						monthly_cost: z.json().optional(),
						currency: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const PermalinkNameCurrencyListSchema = z.array(
	z
		.object({
			permalink: z.string().optional(),
			name: z.string().optional(),
			currency: z.string().optional(),
			price: z.json().optional(),
			price_billed_annually: z.json().optional(),
			features: z.array(z.string()).optional(),
		})
		.strict(),
);
export const FirstNameLastNameEmailAddressObjectSchema = z
	.object({
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email_address: z.string().optional(),
		time_zone: z.string().optional(),
		account: z
			.object({
				name: z.string().optional(),
				permalink: z.string().optional(),
				time_zone: z.string().optional(),
				package: z.string().optional(),
				trialling: z.boolean().optional(),
				suspended: z.boolean().optional(),
				project_count: z.number().int().optional(),
				project_limit: z.number().int().optional(),
				users_allowed: z.boolean().optional(),
				beta_features: z.boolean().optional(),
				static_hosting_eligible: z.boolean().optional(),
				managed_vps_eligible: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
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
			name: z.string().optional(),
			permalink: z.string().optional(),
			identifier: z.string().optional(),
			public_key: z.string().optional(),
			repository: z.record(z.string(), z.json()).optional(),
			repository_url: z.string().optional(),
			zone: z.string().optional(),
			last_deployed_at: z.string().optional(),
			folder: z
				.object({
					identifier: z.string().optional(),
					name: z.string().optional(),
				})
				.strict()
				.optional(),
			auto_deploy_url: z.string().optional(),
			url: z.string().optional(),
			app_url: z.string().optional(),
			servers_url: z.string().optional(),
			deployments_url: z.string().optional(),
			config_files_url: z.string().optional(),
			environment_variables_url: z.string().optional(),
			build_commands_url: z.string().optional(),
			starred: z.boolean().optional(),
		})
		.strict(),
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
		name: z.string().optional(),
		permalink: z.string().optional(),
		identifier: z.string().optional(),
		public_key: z.string().optional(),
		repository: z
			.object({
				scm_type: z.string().optional(),
				url: z.string().optional(),
				port: z.union([z.null(), z.number().int()]).optional(),
				username: z.union([z.null(), z.string()]).optional(),
				branch: z.string().optional(),
				cached: z.boolean().optional(),
				hosting_service: z
					.object({
						name: z.string().optional(),
						url: z.string().optional(),
						tree_url: z.string().optional(),
						commits_url: z.string().optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		repository_url: z.string().optional(),
		zone: z.string().optional(),
		last_deployed_at: z.union([z.null(), z.string()]).optional(),
		folder: z.union([z.null(), z.string()]).optional(),
		auto_deploy_url: z.string().optional(),
	})
	.strict();
export const NamePermalinkIdentifierObjectSchema = z
	.object({
		name: z.string().optional(),
		permalink: z.string().optional(),
		identifier: z.string().optional(),
		public_key: z.string().optional(),
		repository: z.record(z.string(), z.json()).optional(),
		repository_url: z.string().optional(),
		zone: z.string().optional(),
		last_deployed_at: z.string().optional(),
		folder: z
			.object({
				identifier: z.string().optional(),
				name: z.string().optional(),
			})
			.strict()
			.optional(),
		auto_deploy_url: z.string().optional(),
		url: z.string().optional(),
		app_url: z.string().optional(),
		servers_url: z.string().optional(),
		deployments_url: z.string().optional(),
		config_files_url: z.string().optional(),
		environment_variables_url: z.string().optional(),
		build_commands_url: z.string().optional(),
		capabilities: z
			.array(
				z
					.object({
						name: z.string().optional(),
						enabled: z.boolean().optional(),
						url: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
		starred: z.boolean().optional(),
	})
	.strict();
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
	.strict();
export const SuccessErrorObjectSchema = z
	.object({ success: z.boolean(), error: z.string() })
	.strict();
export const PeriodServersSummaryObjectSchema = z
	.object({
		period: z.number().int().optional(),
		servers: z
			.array(
				z
					.object({
						identifier: z.string().optional(),
						name: z.string().optional(),
						group: z.boolean().optional(),
						latest_status: z.string().optional(),
						recent_deploys: z
							.array(
								z
									.object({
										status: z.string().optional(),
										duration: z.number().int().optional(),
									})
									.strict(),
							)
							.optional(),
						speed: z.number().int().optional(),
						reliability: z.json().optional(),
						deploys_per_week: z.json().optional(),
						total: z.number().int().optional(),
					})
					.strict(),
			)
			.optional(),
		summary: z
			.object({
				total_deploys: z
					.object({
						value: z.number().int().optional(),
						delta: z.json().optional(),
					})
					.strict()
					.optional(),
				success_rate: z
					.object({ value: z.json().optional(), delta: z.json().optional() })
					.strict()
					.optional(),
				avg_duration: z
					.object({
						value: z.number().int().optional(),
						delta: z.json().optional(),
					})
					.strict()
					.optional(),
				active_servers: z
					.object({
						value: z.number().int().optional(),
						delta: z.string().optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const ProjectObject3Schema = z
	.object({
		project: z.object({ key_type: z.string().optional() }).strict().optional(),
	})
	.strict();
export const PublicKeyObjectSchema = z
	.object({ public_key: z.string() })
	.strict();
export const StringListSchema = z.array(z.string());
export const MessageStarredObjectSchema = z
	.object({ message: z.string().optional(), starred: z.boolean().optional() })
	.strict();
export const CountTruncatedLatestDeployedRevisionObjectSchema = z
	.object({
		count: z.number().int(),
		truncated: z.boolean(),
		latest_deployed_revision: z.string().optional(),
		current_revision: z.string().optional(),
		last_checked_at: z.string().optional(),
		check_in_progress: z.boolean(),
		check_fail_message: z.string().optional(),
		commits: z
			.array(
				z
					.object({
						ref: z.string().optional(),
						author: z.string().optional(),
						email: z.string().optional(),
						timestamp: z.string().optional(),
						message: z.string().optional(),
						short_message: z.string().optional(),
						url: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const ProjectObject4Schema = z
	.object({ project: z.object({ custom_private_key: z.string() }).strict() })
	.strict();
export const WebhookUrlDeployablesObjectSchema = z
	.object({
		webhook_url: z.string().optional(),
		deployables: z
			.array(
				z
					.object({
						identifier: z.string().optional(),
						name: z.string().optional(),
						type: z.string().optional(),
						auto_deploy: z.boolean().optional(),
						command_deployable: z.boolean().optional(),
						preferred_branch: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
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
						identifier: z.string().optional(),
						name: z.string().optional(),
						type: z.string().optional(),
						auto_deploy: z.boolean().optional(),
						command_deployable: z.boolean().optional(),
						preferred_branch: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
		skipped: z.array(z.string()).optional(),
	})
	.strict();
export const BuildCacheFileListSchema = z.array(
	z
		.object({
			id: z.number().int().optional(),
			project_id: z.union([z.null(), z.number().int()]).optional(),
			identifier: z.string().optional(),
			path: z.string().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			parent_type: z.string().optional(),
			parent_id: z.number().int().optional(),
		})
		.strict(),
);
export const BuildCacheFileObjectSchema = z
	.object({ build_cache_file: z.object({ path: z.string() }).strict() })
	.strict();
export const BuildCacheFileSchema = z
	.object({
		id: z.number().int().optional(),
		project_id: z.union([z.null(), z.number().int()]).optional(),
		identifier: z.string().optional(),
		path: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		parent_type: z.string().optional(),
		parent_id: z.number().int().optional(),
	})
	.strict();
export const IdentifierSourceDescriptionListSchema = z.array(
	z
		.object({
			identifier: z.string().optional(),
			source: z.string().optional(),
			description: z.string().optional(),
			command: z.string().optional(),
			halt_on_error: z.boolean().optional(),
			enabled: z.boolean().optional(),
			position: z.number().int().optional(),
			watch_files: z.string().optional(),
		})
		.strict(),
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
		identifier: z.string().optional(),
		packages: z
			.object({
				ruby: z.string().optional(),
				php: z.string().optional(),
				composer: z.string().optional(),
				java: z.string().optional(),
				dotnet: z.string().optional(),
				go: z.string().optional(),
				python2: z.string().optional(),
				python3: z.string().optional(),
				node: z.string().optional(),
				phantomjs: z.string().optional(),
			})
			.strict()
			.optional(),
		default: z.boolean().optional(),
		servers: z.array(z.json()).optional(),
	})
	.strict();
export const BuildEnvironmentListSchema = z.array(
	z
		.object({
			identifier: z.string().optional(),
			packages: z
				.object({
					ruby: z.string().optional(),
					php: z.string().optional(),
					composer: z.string().optional(),
					java: z.string().optional(),
					dotnet: z.string().optional(),
					go: z.string().optional(),
					python2: z.string().optional(),
					python3: z.string().optional(),
					node: z.string().optional(),
					phantomjs: z.string().optional(),
				})
				.strict()
				.optional(),
			default: z.boolean().optional(),
			servers: z.array(z.json()).optional(),
		})
		.strict(),
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
			identifier: z.string().optional(),
			hostname: z.string().optional(),
			fingerprint: z.string().optional(),
		})
		.strict(),
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
		identifier: z.string().optional(),
		hostname: z.string().optional(),
		fingerprint: z.string().optional(),
	})
	.strict();
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
			identifier: z.string().optional(),
			name: z.string().optional(),
			stage: z.string().optional(),
			check_type: z.string().optional(),
			enabled: z.boolean().optional(),
			position: z.number().int().optional(),
			command: z.string().optional(),
			servers: z.array(z.string()).optional(),
			http_method: z.string().optional(),
			http_url: z.string().optional(),
			http_expected_status: z.number().int().optional(),
			http_body_match: z.string().optional(),
			timeout_seconds: z.number().int().optional(),
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
		identifier: z.string().optional(),
		name: z.string().optional(),
		stage: z.string().optional(),
		check_type: z.string().optional(),
		enabled: z.boolean().optional(),
		position: z.number().int().optional(),
		command: z.string().optional(),
		servers: z.array(z.string()).optional(),
		http_method: z.string().optional(),
		http_url: z.string().optional(),
		http_expected_status: z.number().int().optional(),
		http_body_match: z.string().optional(),
		timeout_seconds: z.number().int().optional(),
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
	.strict();
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
		identifier: z.string().optional(),
		servers: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						identifier: z.string().optional(),
						name: z.string().optional(),
						protocol_type: z.string().optional(),
						server_path: z.string().optional(),
						last_revision: z.string().optional(),
						preferred_branch: z.string().optional(),
						branch: z.string().optional(),
						notify_email: z.string().optional(),
						server_group_identifier: z.union([z.null(), z.string()]).optional(),
						auto_deploy: z.boolean().optional(),
						environment: z.string().optional(),
						enabled: z.boolean().optional(),
						agent: z.union([z.null(), z.string()]).optional(),
						atomic: z.boolean().optional(),
						atomic_strategy: z.string().optional(),
						atomic_retention: z.number().int().optional(),
						use_compression: z.boolean().optional(),
						use_accelerated_transfer: z.boolean().optional(),
						use_parallel_upload: z.boolean().optional(),
						root_path: z.string().optional(),
						position: z.number().int().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						connection_checked_at: z.union([z.null(), z.string()]).optional(),
						connection_error_message: z
							.union([z.null(), z.string()])
							.optional(),
						hostname: z.string().optional(),
						username: z.string().optional(),
						port: z.string().optional(),
						use_ssh_keys: z.boolean().optional(),
						host_key: z.string().optional(),
						unlink_before_upload: z.boolean().optional(),
					})
					.strict(),
			)
			.optional(),
		project: z
			.object({
				name: z.string().optional(),
				permalink: z.string().optional(),
				identifier: z.string().optional(),
				public_key: z.string().optional(),
				repository: z
					.object({
						scm_type: z.string().optional(),
						url: z.string().optional(),
						port: z.union([z.null(), z.number().int()]).optional(),
						username: z.union([z.null(), z.string()]).optional(),
						branch: z.string().optional(),
						cached: z.boolean().optional(),
						hosting_service: z
							.object({
								name: z.string().optional(),
								url: z.string().optional(),
								tree_url: z.string().optional(),
								commits_url: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				repository_url: z.string().optional(),
				zone: z.string().optional(),
				last_deployed_at: z.string().optional(),
				folder: z.union([z.null(), z.string()]).optional(),
				auto_deploy_url: z.string().optional(),
			})
			.strict()
			.optional(),
		deployer: z.union([z.null(), z.string()]).optional(),
		deployer_avatar: z.union([z.null(), z.string()]).optional(),
		branch: z.string().optional(),
		start_revision: z
			.object({ ref: z.string().optional() })
			.strict()
			.optional(),
		end_revision: z.object({ ref: z.string().optional() }).strict().optional(),
		status: z.string().optional(),
		timestamps: z
			.object({
				queued_at: z.string().optional(),
				started_at: z.union([z.null(), z.string()]).optional(),
				completed_at: z.union([z.null(), z.string()]).optional(),
				duration: z.union([z.null(), z.string()]).optional(),
				runs_at: z.string().optional(),
			})
			.strict()
			.optional(),
		files: z
			.object({
				'e12cdd12-a7ea-4939-82b4-227ff1865199': z
					.object({
						changed: z.array(z.json()).optional(),
						removed: z.array(z.json()).optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		configuration: z
			.object({
				copy_config_files: z.boolean().optional(),
				notification_addresses: z.string().optional(),
				skip_project_files: z.boolean().optional(),
			})
			.strict()
			.optional(),
		legacy: z.boolean().optional(),
		deferred: z.boolean().optional(),
		config_files_deployment: z.boolean().optional(),
		overview: z.union([z.null(), z.string()]).optional(),
		metadata: z.object({}).strict().optional(),
		archived: z.boolean().optional(),
		archived_at: z.union([z.null(), z.string()]).optional(),
		log_summary: z.union([z.null(), z.string()]).optional(),
		steps: z
			.array(
				z
					.object({
						step: z.string().optional(),
						stage: z.string().optional(),
						identifier: z.string().optional(),
						server: z.union([z.null(), z.string()]).optional(),
						total_items: z.union([z.null(), z.string()]).optional(),
						completed_items: z.union([z.null(), z.string()]).optional(),
						description: z.string().optional(),
						status: z.string().optional(),
						logs: z.boolean().optional(),
						explainable: z.boolean().optional(),
						deployment_started_at: z.union([z.null(), z.string()]).optional(),
						updated_at: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const PaginationRecordsObjectSchema = z
	.object({
		pagination: z
			.object({
				current_page: z.number().int().optional(),
				total_pages: z.number().int().optional(),
				offset: z.number().int().optional(),
				total_records: z.number().int().optional(),
			})
			.strict()
			.optional(),
		records: z
			.array(
				z
					.object({
						identifier: z.string().optional(),
						servers: z
							.array(
								z
									.object({
										id: z.number().int().optional(),
										identifier: z.string().optional(),
										name: z.string().optional(),
										protocol_type: z.string().optional(),
										server_path: z.string().optional(),
										last_revision: z.string().optional(),
										preferred_branch: z.string().optional(),
										branch: z.string().optional(),
										notify_email: z.string().optional(),
										server_group_identifier: z
											.union([z.null(), z.string()])
											.optional(),
										auto_deploy: z.boolean().optional(),
										environment: z.string().optional(),
										enabled: z.boolean().optional(),
										agent: z.union([z.null(), z.string()]).optional(),
										atomic: z.boolean().optional(),
										atomic_strategy: z.string().optional(),
										atomic_retention: z.number().int().optional(),
										use_compression: z.boolean().optional(),
										use_accelerated_transfer: z.boolean().optional(),
										use_parallel_upload: z.boolean().optional(),
										root_path: z.string().optional(),
										position: z.number().int().optional(),
										created_at: z.string().optional(),
										updated_at: z.string().optional(),
										connection_checked_at: z
											.union([z.null(), z.string()])
											.optional(),
										connection_error_message: z
											.union([z.null(), z.string()])
											.optional(),
										hostname: z.string().optional(),
										username: z.string().optional(),
										port: z.string().optional(),
										use_ssh_keys: z.boolean().optional(),
										host_key: z.string().optional(),
										unlink_before_upload: z.boolean().optional(),
									})
									.strict(),
							)
							.optional(),
						project: z
							.object({
								name: z.string().optional(),
								permalink: z.string().optional(),
								identifier: z.string().optional(),
								public_key: z.string().optional(),
								repository: z
									.object({
										scm_type: z.string().optional(),
										url: z.string().optional(),
										port: z.union([z.null(), z.number().int()]).optional(),
										username: z.union([z.null(), z.string()]).optional(),
										branch: z.string().optional(),
										cached: z.boolean().optional(),
										hosting_service: z
											.object({
												name: z.string().optional(),
												url: z.string().optional(),
												tree_url: z.string().optional(),
												commits_url: z.string().optional(),
											})
											.strict()
											.optional(),
									})
									.strict()
									.optional(),
								repository_url: z.string().optional(),
								zone: z.string().optional(),
								last_deployed_at: z.string().optional(),
								folder: z.union([z.null(), z.string()]).optional(),
								auto_deploy_url: z.string().optional(),
							})
							.strict()
							.optional(),
						deployer: z.union([z.null(), z.string()]).optional(),
						deployer_avatar: z.union([z.null(), z.string()]).optional(),
						branch: z.string().optional(),
						start_revision: z
							.object({ ref: z.string().optional() })
							.strict()
							.optional(),
						end_revision: z
							.object({ ref: z.string().optional() })
							.strict()
							.optional(),
						status: z.string().optional(),
						timestamps: z
							.object({
								queued_at: z.string().optional(),
								started_at: z.union([z.null(), z.string()]).optional(),
								completed_at: z.union([z.null(), z.string()]).optional(),
								duration: z.union([z.null(), z.string()]).optional(),
								runs_at: z.string().optional(),
							})
							.strict()
							.optional(),
						files: z
							.object({
								'e12cdd12-a7ea-4939-82b4-227ff1865199': z
									.object({
										changed: z.array(z.json()).optional(),
										removed: z.array(z.json()).optional(),
									})
									.strict()
									.optional(),
							})
							.strict()
							.optional(),
						configuration: z
							.object({
								copy_config_files: z.boolean().optional(),
								notification_addresses: z.string().optional(),
								skip_project_files: z.boolean().optional(),
							})
							.strict()
							.optional(),
						legacy: z.boolean().optional(),
						deferred: z.boolean().optional(),
						config_files_deployment: z.boolean().optional(),
						overview: z.union([z.null(), z.string()]).optional(),
						metadata: z.object({}).strict().optional(),
						archived: z.boolean().optional(),
						archived_at: z.union([z.null(), z.string()]).optional(),
						log_summary: z.union([z.null(), z.string()]).optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const IdStepMessageListSchema = z.array(
	z
		.object({
			id: z.number().int().optional(),
			step: z.string().optional(),
			message: z.string().optional(),
			detail: z.string().optional(),
			type: z.string().optional(),
		})
		.strict(),
);
export const ExcludedFileListSchema = z.array(
	z
		.object({
			identifier: z.string().optional(),
			path: z.string().optional(),
			servers: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							identifier: z.string().optional(),
							name: z.string().optional(),
							protocol_type: z.string().optional(),
							server_path: z.string().optional(),
							last_revision: z.string().optional(),
							preferred_branch: z.string().optional(),
							branch: z.string().optional(),
							notify_email: z.string().optional(),
							server_group_identifier: z
								.union([z.null(), z.string()])
								.optional(),
							auto_deploy: z.boolean().optional(),
							environment: z.string().optional(),
							enabled: z.boolean().optional(),
							agent: z.union([z.null(), z.string()]).optional(),
							atomic: z.union([z.null(), z.string()]).optional(),
							atomic_strategy: z.string().optional(),
							atomic_retention: z.number().int().optional(),
							use_compression: z.boolean().optional(),
							use_accelerated_transfer: z.boolean().optional(),
							use_parallel_upload: z.boolean().optional(),
							root_path: z.string().optional(),
							position: z.number().int().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							connection_checked_at: z.union([z.null(), z.string()]).optional(),
							connection_error_message: z
								.union([z.null(), z.string()])
								.optional(),
							static_hosting: z
								.object({
									hosted_website_identifier: z.string().optional(),
									subdomain: z.string().optional(),
									url: z.string().optional(),
									spa_mode: z.boolean().optional(),
									status: z.string().optional(),
									active_deployment_uuid: z.string().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				)
				.optional(),
		})
		.strict(),
);
export const ExcludedFileObjectSchema = z
	.object({ excluded_file: z.object({ path: z.string() }).strict() })
	.strict();
export const ExcludedFileSchema = z
	.object({
		identifier: z.string().optional(),
		path: z.string().optional(),
		servers: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						identifier: z.string().optional(),
						name: z.string().optional(),
						protocol_type: z.string().optional(),
						server_path: z.string().optional(),
						last_revision: z.string().optional(),
						preferred_branch: z.string().optional(),
						branch: z.string().optional(),
						notify_email: z.string().optional(),
						server_group_identifier: z.union([z.null(), z.string()]).optional(),
						auto_deploy: z.boolean().optional(),
						environment: z.string().optional(),
						enabled: z.boolean().optional(),
						agent: z.union([z.null(), z.string()]).optional(),
						atomic: z.union([z.null(), z.string()]).optional(),
						atomic_strategy: z.string().optional(),
						atomic_retention: z.number().int().optional(),
						use_compression: z.boolean().optional(),
						use_accelerated_transfer: z.boolean().optional(),
						use_parallel_upload: z.boolean().optional(),
						root_path: z.string().optional(),
						position: z.number().int().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						connection_checked_at: z.union([z.null(), z.string()]).optional(),
						connection_error_message: z
							.union([z.null(), z.string()])
							.optional(),
						static_hosting: z
							.object({
								hosted_website_identifier: z.string().optional(),
								subdomain: z.string().optional(),
								url: z.string().optional(),
								spa_mode: z.boolean().optional(),
								status: z.string().optional(),
								active_deployment_uuid: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
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
			identifier: z.string().optional(),
			hook_type: z.string().optional(),
			name: z.string().optional(),
			send_on_start: z.boolean().optional(),
			send_on_completion: z.boolean().optional(),
			send_on_failure: z.boolean().optional(),
			send_on_check_failed: z.boolean().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.strict(),
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
		identifier: z.string().optional(),
		hook_type: z.string().optional(),
		name: z.string().optional(),
		send_on_start: z.boolean().optional(),
		send_on_completion: z.boolean().optional(),
		send_on_failure: z.boolean().optional(),
		send_on_check_failed: z.boolean().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.strict();
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
		node: z.string().optional(),
		ruby: z.string().optional(),
		php: z.string().optional(),
	})
	.strict();
export const RepositorySchema = z
	.object({
		scm_type: z.string().optional(),
		url: z.string().optional(),
		port: z.union([z.null(), z.number().int()]).optional(),
		username: z.union([z.null(), z.string()]).optional(),
		branch: z.string().optional(),
		cached: z.boolean().optional(),
		hosting_service: z
			.object({
				name: z.string().optional(),
				url: z.string().optional(),
				tree_url: z.string().optional(),
				commits_url: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
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
		timestamp: z.string().optional(),
		message: z.string().optional(),
		short_message: z.string().optional(),
		tags: z.array(z.string()).optional(),
		avatar_url: z.string().optional(),
	})
	.strict();
export const MessageObjectSchema = z
	.object({ message: z.string().optional() })
	.strict();
export const RefObjectSchema = z
	.object({ ref: z.string().optional() })
	.strict();
export const CommitsTagsReleasesObjectSchema = z
	.object({
		commits: z
			.array(
				z
					.object({
						ref: z.string(),
						author: z.string(),
						email: z.string(),
						timestamp: z.string().optional(),
						message: z.string().optional(),
						short_message: z.string().optional(),
						tags: z.array(z.string()).optional(),
						avatar_url: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
		tags: z
			.array(
				z
					.object({ name: z.string(), ref: z.string(), message: z.string() })
					.strict(),
			)
			.optional(),
		releases: z
			.array(
				z
					.object({ name: z.string().optional(), ref: z.string().optional() })
					.strict(),
			)
			.optional(),
	})
	.strict();
export const ScheduledDeploymentListSchema = z.array(
	z
		.object({
			identifier: z.string().optional(),
			server: z
				.object({
					identifier: z.string().optional(),
					name: z.string().optional(),
					servers: z
						.array(
							z
								.object({
									id: z.number().int().optional(),
									identifier: z.string().optional(),
									name: z.string().optional(),
									protocol_type: z.string().optional(),
									server_path: z.string().optional(),
									last_revision: z.string().optional(),
									preferred_branch: z.string().optional(),
									branch: z.string().optional(),
									notify_email: z.string().optional(),
									server_group_identifier: z.string().optional(),
									auto_deploy: z.boolean().optional(),
									environment: z.string().optional(),
									enabled: z.boolean().optional(),
									agent: z.union([z.null(), z.string()]).optional(),
									atomic: z.union([z.null(), z.string()]).optional(),
									atomic_strategy: z.string().optional(),
									atomic_retention: z.number().int().optional(),
									use_compression: z.boolean().optional(),
									use_accelerated_transfer: z.boolean().optional(),
									use_parallel_upload: z.boolean().optional(),
									root_path: z.string().optional(),
									position: z.number().int().optional(),
									created_at: z.string().optional(),
									updated_at: z.string().optional(),
									connection_checked_at: z
										.union([z.null(), z.string()])
										.optional(),
									connection_error_message: z
										.union([z.null(), z.string()])
										.optional(),
									hostname: z.string().optional(),
									username: z.string().optional(),
									port: z.string().optional(),
									passive: z.boolean().optional(),
									force_hidden_files: z.boolean().optional(),
									implicit: z.boolean().optional(),
									ignore_certificate_errors: z.boolean().optional(),
									tls_version: z.string().optional(),
								})
								.strict(),
						)
						.optional(),
					preferred_branch: z.string().optional(),
					last_revision: z.string().optional(),
					environment: z.string().optional(),
					transfer_order: z.string().optional(),
				})
				.strict()
				.optional(),
			start_revision: z.string().optional(),
			end_revision: z.string().optional(),
			frequency: z.string().optional(),
			at: z
				.object({
					day: z.number().int().optional(),
					month: z.number().int().optional(),
					year: z.number().int().optional(),
					hour: z.number().int().optional(),
					minute: z.number().int().optional(),
				})
				.strict()
				.optional(),
			next_deployment_at: z.string().optional(),
			copy_config_files: z.boolean().optional(),
			run_build_commands: z.boolean().optional(),
			use_build_cache: z.boolean().optional(),
			skip_project_files: z.boolean().optional(),
			config_files_deployment: z.boolean().optional(),
		})
		.strict(),
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
		identifier: z.string().optional(),
		server: z
			.object({
				identifier: z.string().optional(),
				name: z.string().optional(),
				servers: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								identifier: z.string().optional(),
								name: z.string().optional(),
								protocol_type: z.string().optional(),
								server_path: z.string().optional(),
								last_revision: z.string().optional(),
								preferred_branch: z.string().optional(),
								branch: z.string().optional(),
								notify_email: z.string().optional(),
								server_group_identifier: z.string().optional(),
								auto_deploy: z.boolean().optional(),
								environment: z.string().optional(),
								enabled: z.boolean().optional(),
								agent: z.union([z.null(), z.string()]).optional(),
								atomic: z.union([z.null(), z.string()]).optional(),
								atomic_strategy: z.string().optional(),
								atomic_retention: z.number().int().optional(),
								use_compression: z.boolean().optional(),
								use_accelerated_transfer: z.boolean().optional(),
								use_parallel_upload: z.boolean().optional(),
								root_path: z.string().optional(),
								position: z.number().int().optional(),
								created_at: z.string().optional(),
								updated_at: z.string().optional(),
								connection_checked_at: z
									.union([z.null(), z.string()])
									.optional(),
								connection_error_message: z
									.union([z.null(), z.string()])
									.optional(),
								hostname: z.string().optional(),
								username: z.string().optional(),
								port: z.string().optional(),
								passive: z.boolean().optional(),
								force_hidden_files: z.boolean().optional(),
								implicit: z.boolean().optional(),
								ignore_certificate_errors: z.boolean().optional(),
								tls_version: z.string().optional(),
							})
							.strict(),
					)
					.optional(),
				preferred_branch: z.string().optional(),
				last_revision: z.string().optional(),
				environment: z.string().optional(),
				transfer_order: z.string().optional(),
			})
			.strict()
			.optional(),
		start_revision: z.string().optional(),
		end_revision: z.string().optional(),
		frequency: z.string().optional(),
		at: z
			.object({
				day: z.number().int().optional(),
				month: z.number().int().optional(),
				year: z.number().int().optional(),
				hour: z.number().int().optional(),
				minute: z.number().int().optional(),
			})
			.strict()
			.optional(),
		next_deployment_at: z.string().optional(),
		copy_config_files: z.boolean().optional(),
		run_build_commands: z.boolean().optional(),
		use_build_cache: z.boolean().optional(),
		skip_project_files: z.boolean().optional(),
		config_files_deployment: z.boolean().optional(),
	})
	.strict();
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
			identifier: z.string().optional(),
			name: z.string().optional(),
			servers: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							identifier: z.string().optional(),
							name: z.string().optional(),
							protocol_type: z.string().optional(),
							server_path: z.string().optional(),
							last_revision: z.union([z.null(), z.string()]).optional(),
							preferred_branch: z.string().optional(),
							branch: z.string().optional(),
							notify_email: z.string().optional(),
							server_group_identifier: z.string().optional(),
							auto_deploy: z.boolean().optional(),
							environment: z.string().optional(),
							enabled: z.boolean().optional(),
							agent: z.union([z.null(), z.string()]).optional(),
							atomic: z.boolean().optional(),
							atomic_strategy: z.string().optional(),
							atomic_retention: z.number().int().optional(),
							use_compression: z.boolean().optional(),
							use_accelerated_transfer: z.boolean().optional(),
							use_parallel_upload: z.boolean().optional(),
							root_path: z.string().optional(),
							position: z.number().int().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							connection_checked_at: z.union([z.null(), z.string()]).optional(),
							connection_error_message: z
								.union([z.null(), z.string()])
								.optional(),
							hostname: z.string().optional(),
							username: z.string().optional(),
							port: z.string().optional(),
							use_ssh_keys: z.boolean().optional(),
							host_key: z.string().optional(),
							unlink_before_upload: z.boolean().optional(),
							use_single_connection: z.boolean().optional(),
							global_key_pair_id: z.string().optional(),
						})
						.strict(),
				)
				.optional(),
			preferred_branch: z.string().optional(),
			last_revision: z.union([z.null(), z.string()]).optional(),
			environment: z.string().optional(),
			transfer_order: z.string().optional(),
		})
		.strict(),
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
		identifier: z.string().optional(),
		name: z.string().optional(),
		servers: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						identifier: z.string().optional(),
						name: z.string().optional(),
						protocol_type: z.string().optional(),
						server_path: z.string().optional(),
						last_revision: z.union([z.null(), z.string()]).optional(),
						preferred_branch: z.string().optional(),
						branch: z.string().optional(),
						notify_email: z.string().optional(),
						server_group_identifier: z.string().optional(),
						auto_deploy: z.boolean().optional(),
						environment: z.string().optional(),
						enabled: z.boolean().optional(),
						agent: z.union([z.null(), z.string()]).optional(),
						atomic: z.boolean().optional(),
						atomic_strategy: z.string().optional(),
						atomic_retention: z.number().int().optional(),
						use_compression: z.boolean().optional(),
						use_accelerated_transfer: z.boolean().optional(),
						use_parallel_upload: z.boolean().optional(),
						root_path: z.string().optional(),
						position: z.number().int().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						connection_checked_at: z.union([z.null(), z.string()]).optional(),
						connection_error_message: z
							.union([z.null(), z.string()])
							.optional(),
						hostname: z.string().optional(),
						username: z.string().optional(),
						port: z.string().optional(),
						use_ssh_keys: z.boolean().optional(),
						host_key: z.string().optional(),
						unlink_before_upload: z.boolean().optional(),
						use_single_connection: z.boolean().optional(),
						global_key_pair_id: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
		preferred_branch: z.string().optional(),
		last_revision: z.union([z.null(), z.string()]).optional(),
		environment: z.string().optional(),
		transfer_order: z.string().optional(),
	})
	.strict();
export const ServerRegionSizeObject2Schema = z
	.object({
		server: z
			.object({
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
		id: z.number().int().optional(),
		identifier: z.string().optional(),
		name: z.string().optional(),
		protocol_type: z.string().optional(),
		enabled: z.boolean().optional(),
		static_hosting: z
			.object({
				hosted_website_identifier: z.string().optional(),
				subdomain: z.string().optional(),
				url: z.string().optional(),
				spa_mode: z.boolean().optional(),
				status: z.string().optional(),
				active_deployment_uuid: z.string().optional(),
			})
			.strict()
			.optional(),
		managed_vps: z
			.object({
				hosted_resource_identifier: z.string().optional(),
				status: z.string().optional(),
				ip_address: z.string().optional(),
				region: z.string().optional(),
				size: z.string().optional(),
				ssh_key: z
					.object({
						identifier: z.string().optional(),
						title: z.string().optional(),
						fingerprint: z.string().optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const ServerObject2Schema = z
	.object({
		server: z
			.object({
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
		cpu: z.record(z.string(), z.json()).optional(),
		memory: z.record(z.string(), z.json()).optional(),
		disk: z.record(z.string(), z.json()).optional(),
		uptime: z.string().optional(),
		profile: z.record(z.string(), z.json()).optional(),
	})
	.strict();
export const IdentifierStatusCreatedAtObjectSchema = z
	.object({
		identifier: z.string(),
		status: z.string(),
		created_at: z.string(),
	})
	.strict();
export const IdentifierStatusCreatedAtObject2Schema = z
	.object({
		identifier: z.string(),
		status: z.string(),
		created_at: z.string(),
		completed_at: z.string().optional(),
		results: z
			.object({
				repository: z
					.object({ status: z.string(), message: z.string().optional() })
					.strict()
					.optional(),
				servers: z
					.array(
						z
							.object({
								name: z.string(),
								identifier: z.string(),
								status: z.string(),
								message: z.string().optional(),
							})
							.strict(),
					)
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const EmailAddressObjectSchema = z
	.object({ email_address: z.string() })
	.strict();
export const StatusMessageObjectSchema = z
	.object({ status: z.string().optional(), message: z.string().optional() })
	.strict();
export const ApiKeyObjectSchema = z
	.object({
		api_key: z
			.object({ description: z.string(), read_only: z.boolean().optional() })
			.strict(),
	})
	.strict();
export const ApiKeyIdentifierDescriptionObjectSchema = z
	.object({
		api_key: z.string().optional(),
		identifier: z.string().optional(),
		description: z.string().optional(),
		user_id: z.number().int().optional(),
		device: z.string().optional(),
		read_only: z.boolean().optional(),
		html: z.string().optional(),
	})
	.strict();
export const IdentifierTitlePublicKeyListSchema = z.array(
	z
		.object({
			identifier: z.string().optional(),
			title: z.string().optional(),
			public_key: z.string().optional(),
			key_type: z.string().optional(),
			fingerprint: z.string().optional(),
			account: z.string().optional(),
		})
		.strict(),
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
		identifier: z.string().optional(),
		title: z.string().optional(),
		public_key: z.string().optional(),
		key_type: z.string().optional(),
		fingerprint: z.string().optional(),
		account: z.string().optional(),
	})
	.strict();
export const IdentifierNameIsAdminListSchema = z.array(
	z
		.object({
			identifier: z.string().optional(),
			name: z.string().optional(),
			is_admin: z.boolean().optional(),
			can_manage_users: z.boolean().optional(),
			can_manage_billing: z.boolean().optional(),
			can_manage_agents: z.boolean().optional(),
			can_create_projects: z.boolean().optional(),
			all_projects_allowed: z.boolean().optional(),
			members: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							identifier: z.string().optional(),
							first_name: z.string().optional(),
							last_name: z.string().optional(),
							email_address: z.string().optional(),
						})
						.strict(),
				)
				.optional(),
			project_assignments: z
				.array(
					z
						.object({
							name: z.string().optional(),
							identifier: z.string().optional(),
							can_deploy_all: z.boolean().optional(),
							can_update_config: z.boolean().optional(),
							can_manage_config_files: z.boolean().optional(),
						})
						.strict(),
				)
				.optional(),
		})
		.strict(),
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
		identifier: z.string().optional(),
		name: z.string().optional(),
		is_admin: z.boolean().optional(),
		can_manage_users: z.boolean().optional(),
		can_manage_billing: z.boolean().optional(),
		can_manage_agents: z.boolean().optional(),
		can_create_projects: z.boolean().optional(),
		all_projects_allowed: z.boolean().optional(),
		members: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						identifier: z.string().optional(),
						first_name: z.string().optional(),
						last_name: z.string().optional(),
						email_address: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
		project_assignments: z
			.array(
				z
					.object({
						name: z.string().optional(),
						identifier: z.string().optional(),
						can_deploy_all: z.boolean().optional(),
						can_update_config: z.boolean().optional(),
						can_manage_config_files: z.boolean().optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
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
			name: z.string().optional(),
			permalink: z.string().optional(),
			description: z.string().optional(),
		})
		.strict(),
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
		name: z.string().optional(),
		permalink: z.string().optional(),
		description: z.string().optional(),
	})
	.strict();
export const IdPermalinkNameListSchema = z.array(
	z
		.object({
			id: z.number().int().optional(),
			permalink: z.string().optional(),
			name: z.string().optional(),
			description: z.string().optional(),
			framework_type: z.string().optional(),
			version: z.string().optional(),
			public: z.boolean().optional(),
		})
		.strict(),
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
		id: z.number().int().optional(),
		permalink: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		framework_type: z.string().optional(),
		version: z.string().optional(),
		features: z.array(z.string()).optional(),
		build_commands: z
			.array(
				z
					.object({
						command: z.string().optional(),
						description: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
		ssh_commands: z
			.array(
				z
					.object({
						command: z.string().optional(),
						description: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
		excluded_files: z.array(z.string()).optional(),
		config_files: z
			.array(
				z
					.object({ path: z.string().optional(), body: z.string().optional() })
					.strict(),
			)
			.optional(),
	})
	.strict();
export const UserListSchema = z.array(
	z
		.object({
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			email_address: z.string().optional(),
			time_zone: z.union([z.null(), z.string()]).optional(),
			id: z.number().int().optional(),
			identifier: z.string().optional(),
			account_administrator: z.boolean().optional(),
			activated: z.boolean().optional(),
			can_manage_users: z.boolean().optional(),
			can_manage_billing: z.boolean().optional(),
			can_create_projects: z.boolean().optional(),
			can_manage_agents: z.boolean().optional(),
			all_projects_allowed: z.boolean().optional(),
		})
		.strict(),
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
		id: z.number().int().optional(),
		identifier: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email_address: z.string().optional(),
		time_zone: z.string().optional(),
		account_administrator: z.boolean().optional(),
		activated: z.boolean().optional(),
		can_manage_users: z.boolean().optional(),
		can_manage_billing: z.boolean().optional(),
		can_create_projects: z.boolean().optional(),
		can_manage_agents: z.boolean().optional(),
		all_projects_allowed: z.boolean().optional(),
	})
	.strict();
export const UserSchema = z
	.object({
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email_address: z.string().optional(),
		time_zone: z.union([z.null(), z.string()]).optional(),
		id: z.number().int().optional(),
		identifier: z.string().optional(),
		account_administrator: z.boolean().optional(),
		activated: z.boolean().optional(),
		can_manage_users: z.boolean().optional(),
		can_manage_billing: z.boolean().optional(),
		can_create_projects: z.boolean().optional(),
		can_manage_agents: z.boolean().optional(),
		all_projects_allowed: z.boolean().optional(),
	})
	.strict();
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
			identifier: z.string().optional(),
			description: z.string().optional(),
		})
		.strict(),
);
