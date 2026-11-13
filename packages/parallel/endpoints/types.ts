import { z } from 'zod';

const excerptSettings = z
	.object({ max_chars_per_result: z.number().int().nullable().optional() })
	.strict();
const fetchPolicy = z.object({
	max_age_seconds: z.number().int().nullable().optional(),
	timeout_seconds: z.number().nullable().optional(),
	disable_cache_fallback: z.boolean().optional(),
});
const sourcePolicy = z.object({
	include_domains: z.array(z.string()).optional(),
	exclude_domains: z.array(z.string()).optional(),
	after_date: z.string().nullable().optional(),
});
const searchSettings = z
	.object({
		source_policy: sourcePolicy.nullable().optional(),
		fetch_policy: fetchPolicy.nullable().optional(),
		excerpt_settings: excerptSettings.nullable().optional(),
		location: z.string().nullable().optional(),
		max_results: z.number().int().nullable().optional(),
	})
	.strict();
const extractSettings = z
	.object({
		fetch_policy: fetchPolicy.nullable().optional(),
		excerpt_settings: excerptSettings.nullable().optional(),
		full_content: z
			.union([
				z.boolean(),
				z.object({
					max_chars_per_result: z.number().int().nullable().optional(),
				}),
			])
			.optional(),
		links: z.boolean().nullable().optional(),
	})
	.strict();

export const SearchInput = z
	.object({
		objective: z.string().nullable().optional(),
		search_queries: z.array(z.string()).min(1),
		mode: z.enum(['turbo', 'fast', 'basic', 'advanced']).nullable().optional(),
		max_chars_total: z.number().int().nullable().optional(),
		session_id: z.string().max(1000).nullable().optional(),
		client_model: z.string().nullable().optional(),
		advanced_settings: searchSettings.nullable().optional(),
	})
	.strict();

export const ExtractInput = z
	.object({
		urls: z.array(z.string()).max(20),
		objective: z.string().nullable().optional(),
		search_queries: z.array(z.string()).nullable().optional(),
		max_chars_total: z.number().int().nullable().optional(),
		session_id: z.string().max(1000).nullable().optional(),
		client_model: z.string().nullable().optional(),
		advanced_settings: extractSettings.nullable().optional(),
	})
	.strict();

const result = z
	.object({
		url: z.string(),
		title: z.string().nullable().optional(),
		publish_date: z.string().nullable().optional(),
		excerpts: z.array(z.string()),
	})
	.passthrough();
const warning = z
	.object({
		// Parallel may add warning types, and warning details are provider-defined.
		type: z.string(),
		message: z.string(),
		detail: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.passthrough();
const usage = z
	.object({ name: z.string(), count: z.number().int() })
	.passthrough();
const shared = {
	warnings: z.array(warning).nullable().optional(),
	usage: z.array(usage).nullable().optional(),
	session_id: z.string(),
};
export const SearchOutput = z
	.object({
		search_id: z.string(),
		results: z.array(result),
		...shared,
	})
	.passthrough();
export const ExtractOutput = z
	.object({
		extract_id: z.string(),
		results: z.array(
			result.extend({
				full_content: z.string().nullable().optional(),
				acquired_at: z.string().nullable().optional(),
				links: z.array(z.string()).nullable().optional(),
			}),
		),
		errors: z.array(
			z
				.object({
					url: z.string(),
					error_type: z.string(),
					http_status_code: z.number().int().nullable(),
					content: z.string().nullable(),
				})
				.passthrough(),
		),
		...shared,
	})
	.passthrough();

const discoverySession = {
	session_id: z.string().max(1000).nullable().optional(),
	client_model: z.string().nullable().optional(),
};
const discoveryMode = z.enum(['fast', 'advanced']).nullable().optional();
export const ImageSearchInput = z
	.object({
		objective: z.string().max(5000).nullable().optional(),
		search_queries: z.array(z.string().max(200)).min(1).max(5),
		mode: discoveryMode,
		...discoverySession,
		advanced_settings: z
			.object({
				location: z.string().nullable().optional(),
				max_results: z.number().int().min(1).nullable().optional(),
			})
			.strict()
			.nullable()
			.optional(),
	})
	.strict();
export const ImageSearchOutput = z
	.object({
		search_id: z.string(),
		...shared,
		results: z.array(
			z
				.object({
					title: z.string(),
					image_url: z.string(),
					source_page_url: z.string(),
					width: z.number().int().nullable().optional(),
					height: z.number().int().nullable().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
const hourIntervals = z
	.array(z.object({ opens: z.string(), closes: z.string() }).passthrough())
	.nullable()
	.optional();
const weeklyHours = z
	.object({
		monday: hourIntervals,
		tuesday: hourIntervals,
		wednesday: hourIntervals,
		thursday: hourIntervals,
		friday: hourIntervals,
		saturday: hourIntervals,
		sunday: hourIntervals,
	})
	.passthrough();
export const PlaceSearchInput = z
	.object({
		query: z.string().min(1).max(200),
		location: z.string().min(2).max(200).nullable().optional(),
		latitude: z.number().min(-90).max(90).nullable().optional(),
		longitude: z.number().min(-180).max(180).nullable().optional(),
		max_distance_km: z.number().gt(0).max(200).nullable().optional(),
		open_now: z.boolean().optional(),
		max_results: z.number().int().min(1).nullable().optional(),
		mode: discoveryMode,
		...discoverySession,
	})
	.strict()
	.refine(
		(v) => (v.latitude != null) === (v.longitude != null),
		'latitude and longitude must be provided together',
	)
	.refine(
		(v) => v.location != null || (v.latitude != null && v.longitude != null),
		'location or coordinates are required',
	);
export const PlaceSearchOutput = z
	.object({
		search_id: z.string(),
		...shared,
		results: z.array(
			z
				.object({
					name: z.string(),
					url: z.string().nullable().optional(),
					address: z.string().nullable().optional(),
					phone: z.string().nullable().optional(),
					latitude: z.number().nullable().optional(),
					longitude: z.number().nullable().optional(),
					distance_km: z.number().nullable().optional(),
					rating: z
						.enum(['fair', 'good', 'great', 'excellent'])
						.nullable()
						.optional(),
					price_level: z.number().int().nullable().optional(),
					opening_hours: weeklyHours.nullable().optional(),
					timezone: z.string().nullable().optional(),
					open_now: z.boolean().nullable().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
const question = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('choice'),
		instructions: z.string(),
		criteria: z
			.record(z.string(), z.string())
			.refine(
				(v) => Object.keys(v).length >= 2 && Object.keys(v).length <= 255,
			),
	}),
	z.object({
		type: z.literal('score'),
		instructions: z.string(),
		criteria: z.array(z.string()).min(2).max(10),
	}),
	z.object({
		type: z.literal('noul'),
		instructions: z.string(),
		criteria: z
			.object({ true: z.string(), false: z.string() })
			.nullable()
			.optional(),
	}),
]);
export const DecisionInput = z
	.object({
		state: z.json(),
		questions: z
			.record(z.string().regex(/^[A-Za-z0-9_-]+$/), question)
			.refine(
				(v) => Object.keys(v).length >= 1 && Object.keys(v).length <= 100,
			),
		mode: z.literal('fast').optional(),
		advanced_settings: z
			.object({
				location: z.string().nullable().optional(),
				after_date: z.string().nullable().optional(),
				include_excerpts: z.boolean().optional(),
			})
			.strict()
			.refine((v) => Object.keys(v).length > 0)
			.nullable()
			.optional(),
	})
	.strict();
const probabilityMap = z.record(z.string(), z.number());
const decisionAnswer = z.union([
	z
		.object({
			type: z.literal('choice').optional(),
			choice: z.string(),
			probabilities: probabilityMap,
			confidence: z.number().nullable().optional(),
		})
		.passthrough(),
	z
		.object({
			type: z.literal('score').optional(),
			score: z.number(),
			legend: z.record(z.string(), z.string()),
			probabilities: probabilityMap,
			confidence: z.number().nullable().optional(),
		})
		.passthrough(),
	z
		.object({ type: z.literal('noul').optional(), noul: z.number() })
		.passthrough(),
	z.object({ type: z.literal('refusal') }).passthrough(),
]);
export const DecisionOutput = z
	.object({
		mode: z.literal('fast'),
		answers: z.record(z.string(), decisionAnswer),
		usage: z
			.object({ input_tokens: z.number().int(), output_tokens: z.literal(0) })
			.passthrough(),
		citations: z.array(
			z
				.object({
					url: z.string(),
					title: z.string().nullable().optional(),
					excerpts: z.array(z.string()),
				})
				.passthrough(),
		),
		decision_id: z.string(),
	})
	.passthrough();

const memoryKey = z
	.string()
	.min(1)
	.max(128)
	.regex(/^[a-zA-Z0-9_-]+$/);
const scope = { memory_scope_key: memoryKey.nullable().optional() };
const memoryKind = z.enum(['task', 'monitor', 'findall']);
export const MemoryClearInput = z.object(scope);
export const MemoryEvictInput = z.object({
	...scope,
	kind: memoryKind,
	id: memoryKey,
});
export const MemoryRetrieveInput = z.object({
	...scope,
	query: z.string().max(500).nullable().optional(),
	limit: z.number().int().min(1).max(25).optional(),
	kind: memoryKind.nullable().optional(),
	since: z.string().nullable().optional(),
});
const memoryCommon = {
	id: z.string(),
	updated_at: z.string(),
	input_excerpt: z.string(),
};
export const MemoryRetrieveOutput = z
	.object({
		results: z.array(
			z.discriminatedUnion('kind', [
				z
					.object({
						kind: z.literal('task'),
						...memoryCommon,
						output_excerpt: z.string(),
					})
					.passthrough(),
				z
					.object({
						kind: z.literal('monitor'),
						...memoryCommon,
						status: z.enum(['active', 'cancelled']),
						matched_events: z
							.array(
								z
									.object({
										event_id: z.string(),
										event_group_id: z.string(),
										detected_at: z.string(),
										excerpt: z.string(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough(),
				z
					.object({
						kind: z.literal('findall'),
						...memoryCommon,
						matched_count: z.number().int(),
					})
					.passthrough(),
			]),
		),
	})
	.passthrough();
export const NoContent = z.undefined();

export const safeId = z
	.string()
	.min(1)
	.refine(
		(v) => v !== '.' && v !== '..' && !/[\\/"']/.test(v),
		'unsafe path parameter',
	);
const monitorType = z.enum(['event_stream', 'snapshot']);
const monitorProcessor = z.enum(['lite', 'base', 'core']);
const monitorWebhook = z.object({
	url: z.string(),
	event_types: z
		.array(
			z.enum([
				'monitor.event.detected',
				'monitor.execution.completed',
				'monitor.execution.failed',
			]),
		)
		.optional(),
});
const monitorAdvanced = z.object({
	source_policy: sourcePolicy.nullable().optional(),
	location: z.string().nullable().optional(),
});
const monitorStreamSettings = z.object({
	query: z.string(),
	output_schema: z
		.object({
			json_schema: z.record(z.string(), z.json()),
			type: z.literal('json').optional(),
		})
		.nullable()
		.optional(),
	include_backfill: z.boolean().nullable().optional(),
	advanced_settings: monitorAdvanced.nullable().optional(),
});
const monitorCommon = {
	frequency: z.string(),
	processor: monitorProcessor.optional(),
	webhook: monitorWebhook.nullable().optional(),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
	memory_scope_key: memoryKey.nullable().optional(),
};
export const MonitorCreateInput = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('event_stream'),
		...monitorCommon,
		settings: monitorStreamSettings,
	}),
	z.object({
		type: z.literal('snapshot'),
		...monitorCommon,
		settings: z.object({ task_run_id: z.string() }),
	}),
]);
export const MonitorIdInput = z.object({ monitor_id: safeId });
export const MonitorListInput = z.object({
	cursor: z.string().nullable().optional(),
	limit: z.number().int().min(1).max(10000).nullable().optional(),
	type: z.array(monitorType).nullable().optional(),
	status: z
		.array(z.enum(['active', 'cancelled']))
		.nullable()
		.optional(),
});
export const MonitorEventsInput = z.object({
	monitor_id: safeId,
	event_group_id: z.string().nullable().optional(),
	cursor: z.string().nullable().optional(),
	limit: z.number().int().min(1).max(100).nullable().optional(),
	include_completions: z.boolean().optional(),
});
export const MonitorUpdateInput = z.object({
	monitor_id: safeId,
	body: z
		.object({
			type: z.literal('event_stream').optional(),
			frequency: z.string().optional(),
			processor: monitorProcessor.optional(),
			webhook: monitorWebhook.nullable().optional(),
			metadata: z.record(z.string(), z.string()).nullable().optional(),
			settings: z
				.object({
					query: z.string().optional(),
					advanced_settings: monitorAdvanced.nullable().optional(),
				})
				.optional(),
		})
		.refine((v) => Object.keys(v).length > 0)
		.refine((v) => !v.settings || v.type === 'event_stream'),
});
export const MonitorOutput = z
	.object({
		type: monitorType,
		monitor_id: z.string(),
		status: z.enum(['active', 'cancelled']),
		frequency: z.string(),
		processor: monitorProcessor,
		created_at: z.string(),
		webhook: monitorWebhook.nullable().optional(),
		metadata: z.record(z.string(), z.string()).nullable().optional(),
		last_run_at: z.string().nullable().optional(),
		settings: z.union([
			z.object({
				task_run_id: z.string(),
				query: z.string(),
				output_schema: z
					.object({
						json_schema: z.record(z.string(), z.json()),
						type: z.literal('json').optional(),
					})
					.nullable()
					.optional(),
			}),
			monitorStreamSettings,
		]),
		output: z
			.object({ latest_snapshot: z.json().nullable().optional() })
			.nullable()
			.optional(),
	})
	.passthrough();
export const MonitorListOutput = z
	.object({
		monitors: z.array(MonitorOutput),
		next_cursor: z.string().nullable().optional(),
	})
	.passthrough();
export const MonitorStatsOutput = z
	.object({
		total: z.number().int(),
		processor_counts: z.record(
			z.string(),
			z.record(z.string(), z.record(z.string(), z.number().int())),
		),
	})
	.passthrough();
// Event output is task-defined text or JSON, so retain the provider-defined value.
export const MonitorEventsOutput = z
	.object({
		events: z.array(
			z
				.object({
					event_type: z.enum([
						'event_stream',
						'snapshot',
						'completion',
						'error',
					]),
					event_id: z.string().optional(),
					event_group_id: z.string().optional(),
					event_date: z.string().nullable().optional(),
					timestamp: z.string().optional(),
					error_message: z.string().optional(),
					output: z.json().optional(),
					changed_output: z.json().optional(),
					previous_output: z.json().optional(),
				})
				.passthrough(),
		),
		next_cursor: z.string().nullable().optional(),
		warnings: z.array(warning).nullable().optional(),
	})
	.passthrough();
export const EmptyInput = z.object({});

const metadataValue = z.union([z.string(), z.number(), z.boolean()]);
const taskMetadata = z.record(z.string(), metadataValue);
const taskSchema = z.union([
	z.string(),
	z.object({
		json_schema: z.record(z.string(), z.json()),
		type: z.literal('json').optional(),
	}),
	z.object({ type: z.literal('auto') }),
	z.object({
		type: z.literal('text').optional(),
		description: z.string().nullable().optional(),
	}),
]);
const taskSpec = z.object({
	output_schema: taskSchema,
	input_schema: taskSchema.nullable().optional(),
});
const taskWebhook = z.object({
	url: z.string(),
	event_types: z.array(z.literal('task_run.status')).optional(),
});
export const TaskRunInput = z.object({
	processor: z.string(),
	input: z.union([z.string(), z.record(z.string(), z.json())]),
	metadata: taskMetadata.nullable().optional(),
	memory_scope_key: memoryKey.nullable().optional(),
	source_policy: sourcePolicy.nullable().optional(),
	advanced_settings: z
		.object({
			location: z.string().nullable().optional(),
			data_sources: z
				.object({
					pay_per_use: z.array(z.string()).optional(),
					free: z.array(z.string()).optional(),
					excluded: z.array(z.string()).optional(),
				})
				.strict()
				.nullable()
				.optional(),
		})
		.nullable()
		.optional(),
	task_spec: taskSpec.nullable().optional(),
	previous_interaction_id: z.string().nullable().optional(),
	mcp_servers: z
		.array(
			z.object({
				type: z.literal('url').optional(),
				url: z.string(),
				name: z.string(),
				headers: z.record(z.string(), z.string()).nullable().optional(),
				allowed_tools: z.array(z.string()).nullable().optional(),
			}),
		)
		.nullable()
		.optional(),
	enable_events: z.boolean().nullable().optional(),
	webhook: taskWebhook.nullable().optional(),
});
const taskStatus = z.enum([
	'queued',
	'action_required',
	'running',
	'completed',
	'failed',
	'cancelling',
	'cancelled',
]);
export const TaskRunOutput = z
	.object({
		run_id: z.string(),
		interaction_id: z.string(),
		status: taskStatus,
		is_active: z.boolean(),
		processor: z.string(),
		created_at: z.string().nullable(),
		modified_at: z.string().nullable(),
		warnings: z.array(warning).nullable().optional(),
		error: z
			.object({
				ref_id: z.string(),
				message: z.string(),
				detail: z.record(z.string(), z.json()).nullable().optional(),
			})
			.nullable()
			.optional(),
		metadata: taskMetadata.nullable().optional(),
		taskgroup_id: z.string().nullable().optional(),
	})
	.passthrough();
const taskGroupStatus = z
	.object({
		num_task_runs: z.number().int(),
		task_run_status_counts: z.record(z.string(), z.number().int()),
		is_active: z.boolean(),
		status_message: z.string().nullable(),
		modified_at: z.string().nullable(),
	})
	.passthrough();
export const TaskGroupCreateInput = z.object({
	metadata: taskMetadata.nullable().optional(),
});
export const TaskGroupOutput = z
	.object({
		taskgroup_id: z.string(),
		status: taskGroupStatus,
		created_at: z.string().nullable(),
		metadata: taskMetadata.nullable().optional(),
	})
	.passthrough();
export const TaskGroupIdInput = z.object({ taskgroup_id: safeId });
export const TaskGroupRunsInput = z.object({
	taskgroup_id: safeId,
	refresh_status: z.boolean().optional(),
	parallel_beta: z.string().optional(),
	body: z.object({
		default_task_spec: taskSpec.nullable().optional(),
		inputs: z.array(TaskRunInput).max(1000),
	}),
});
export const TaskGroupRunsOutput = z
	.object({
		status: taskGroupStatus,
		run_ids: z.array(z.string()),
		run_cursor: z.string().nullable(),
		event_cursor: z.string().nullable(),
	})
	.passthrough();
export const TaskGroupRunIdInput = z.object({
	taskgroup_id: safeId,
	run_id: safeId,
});
export const TaskRunCreateInput = z.object({
	body: TaskRunInput,
	parallel_beta: z.string().optional(),
});
export const TaskRunIdInput = z.object({ run_id: safeId });
export const TaskResultInput = z.object({
	run_id: safeId,
	timeout: z.number().int().optional(),
	parallel_beta: z.string().optional(),
});
const taskBasis = z
	.object({
		field: z.string(),
		reasoning: z.string(),
		confidence: z.string().nullable().optional(),
		citations: z
			.array(
				z
					.object({
						url: z.string(),
						title: z.string().nullable().optional(),
						excerpts: z.array(z.string()).nullable().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
// MCP tool call details are provider-defined nested data.
const taskOutput = z.discriminatedUnion('type', [
	z
		.object({
			type: z.literal('text'),
			basis: z.array(taskBasis),
			content: z.string(),
			mcp_tool_calls: z.array(z.json()).nullable().optional(),
		})
		.passthrough(),
	z
		.object({
			type: z.literal('json'),
			basis: z.array(taskBasis),
			content: z.record(z.string(), z.json()),
			output_schema: z.record(z.string(), z.json()).nullable().optional(),
			mcp_tool_calls: z.array(z.json()).nullable().optional(),
		})
		.passthrough(),
]);
export const TaskResultOutput = z
	.object({ run: TaskRunOutput, output: taskOutput })
	.passthrough();

const matchCondition = z.object({ name: z.string(), description: z.string() });
const findallGenerator = z.enum(['base', 'core', 'pro', 'preview']);
const mcpServer = z.object({
	type: z.literal('url').optional(),
	url: z.string(),
	name: z.string(),
	headers: z.record(z.string(), z.string()).nullable().optional(),
	allowed_tools: z.array(z.string()).nullable().optional(),
});
export const FindAllEntityInput = z.object({
	entity_type: z.enum(['people', 'companies']),
	objective: z.string(),
	match_limit: z.number().int().min(5).max(1000).optional(),
});
export const FindAllEntityOutput = z
	.object({
		entity_set_id: z.string(),
		entities: z.array(
			z
				.object({ name: z.string(), url: z.string(), description: z.string() })
				.passthrough(),
		),
	})
	.passthrough();
export const FindAllIngestInput = z.object({ objective: z.string() });
export const FindAllCreateInput = z.object({
	objective: z.string(),
	entity_type: z.string(),
	match_conditions: z.array(matchCondition),
	generator: findallGenerator,
	match_limit: z.number().int().min(5).max(1000),
	exclude_list: z
		.array(z.object({ name: z.string(), url: z.string() }))
		.max(10000)
		.nullable()
		.optional(),
	metadata: taskMetadata.nullable().optional(),
	webhook: taskWebhook.nullable().optional(),
	memory_scope_key: memoryKey.nullable().optional(),
});
export const FindAllIdInput = z.object({ findall_id: safeId });
const enrichBody = z.object({
	processor: z.string().optional(),
	output_schema: z.object({
		json_schema: z.record(z.string(), z.json()),
		type: z.literal('json').optional(),
	}),
	mcp_servers: z.array(mcpServer).nullable().optional(),
});
export const FindAllEnrichInput = z.object({
	findall_id: safeId,
	body: enrichBody,
});
export const FindAllExtendInput = z.object({
	findall_id: safeId,
	body: z.object({ additional_match_limit: z.number().int().gt(0) }),
});
export const FindAllSchemaOutput = z
	.object({
		objective: z.string(),
		entity_type: z.string(),
		match_conditions: z.array(matchCondition),
		enrichments: z.array(enrichBody).nullable().optional(),
		generator: findallGenerator.optional(),
		match_limit: z.number().int().nullable().optional(),
	})
	.passthrough();
export const FindAllRunOutput = z
	.object({
		findall_id: z.string(),
		generator: findallGenerator,
		status: z
			.object({
				status: taskStatus,
				is_active: z.boolean(),
				metrics: z
					.object({
						generated_candidates_count: z.number().int().optional(),
						matched_candidates_count: z.number().int().optional(),
					})
					.passthrough(),
				termination_reason: z
					.enum([
						'low_match_rate',
						'match_limit_met',
						'candidates_exhausted',
						'user_cancelled',
						'error_occurred',
						'timeout',
						'insufficient_funds',
					])
					.nullable()
					.optional(),
			})
			.passthrough(),
		metadata: taskMetadata.nullable().optional(),
		created_at: z.string().nullable().optional(),
		modified_at: z.string().nullable().optional(),
	})
	.passthrough();
export const FindAllResultOutput = z
	.object({
		run: FindAllRunOutput,
		candidates: z.array(
			z
				.object({
					candidate_id: z.string(),
					name: z.string(),
					url: z.string(),
					match_status: z.enum([
						'generated',
						'matched',
						'unmatched',
						'discarded',
					]),
					description: z.string().nullable().optional(),
					output: z.record(z.string(), z.json()).nullable().optional(),
					basis: z.array(taskBasis).nullable().optional(),
				})
				.passthrough(),
		),
		last_event_id: z.string().nullable().optional(),
	})
	.passthrough();

const nonStreaming = z.literal(false).nullable().optional();
export const ChatInput = z.object({
	model: z.string(),
	messages: z.array(
		z.object({
			role: z.enum(['system', 'user', 'assistant']),
			content: z.string(),
			name: z.string().nullable().optional(),
		}),
	),
	stream: nonStreaming,
	response_format: z.json().nullable().optional(),
	max_tokens: z.number().int().nullable().optional(),
	temperature: z.number().nullable().optional(),
	top_p: z.number().nullable().optional(),
	n: z.number().int().nullable().optional(),
	presence_penalty: z.number().nullable().optional(),
	frequency_penalty: z.number().nullable().optional(),
	previous_interaction_id: z.string().nullable().optional(),
});
export const ChatOutput = z
	.object({
		id: z.string(),
		choices: z.array(
			z
				.object({
					index: z.number().int(),
					delta: z
						.object({
							content: z.string().nullable().optional(),
							refusal: z.string().nullable().optional(),
							role: z.string().nullable().optional(),
						})
						.passthrough(),
					finish_reason: z.string().nullable().optional(),
					logprobs: z.json().nullable().optional(),
				})
				.passthrough(),
		),
		created: z.number().int(),
		model: z.string(),
		object: z.literal('chat.completion'),
		moderation: z.json().nullable().optional(),
		service_tier: z.string().nullable().optional(),
		system_fingerprint: z.string().nullable().optional(),
		usage: z.json().nullable().optional(),
		basis: z.array(taskBasis).optional(),
		interaction_id: z.string().nullable().optional(),
	})
	.passthrough();
const responseMessage = z.object({
	role: z.enum(['user', 'assistant', 'system', 'developer']),
	content: z.union([
		z.string(),
		z.array(
			z.object({
				type: z.string().nullable().optional(),
				text: z.string().nullable().optional(),
			}),
		),
	]),
});
export const ResponseInput = z
	.object({
		model: z.string(),
		input: z.union([z.string(), z.array(responseMessage)]),
		instructions: z.string().nullable().optional(),
		previous_response_id: z.string().nullable().optional(),
		stream: nonStreaming,
		text: z.record(z.string(), z.json()).nullable().optional(),
		metadata: z.record(z.string(), z.string()).nullable().optional(),
		reasoning: z
			.object({
				effort: z.enum(['low', 'medium', 'high', 'auto']).nullable().optional(),
			})
			.nullable()
			.optional(),
		background: z.literal(false).nullable().optional(),
		tools: z.array(z.record(z.string(), z.json())).nullable().optional(),
		data_sources: z
			.object({
				pay_per_use: z.array(z.string()).optional(),
				free: z.array(z.string()).optional(),
				excluded: z.array(z.string()).optional(),
			})
			.strict()
			.nullable()
			.optional(),
	})
	.passthrough();
// Output items vary by provider tool; preserve additional fields such as annotations and errors.
const responseItem = z.union([
	z
		.object({
			id: z.string(),
			type: z.literal('message'),
			role: z.literal('assistant'),
			status: z.string(),
			content: z.array(
				z
					.object({
						type: z.literal('output_text'),
						text: z.string(),
						annotations: z.array(z.json()),
					})
					.passthrough(),
			),
		})
		.passthrough(),
	z
		.object({
			id: z.string(),
			type: z.literal('web_search_call'),
			status: z.string(),
			action: z.record(z.string(), z.json()),
		})
		.passthrough(),
	z
		.object({
			id: z.string(),
			type: z.literal('mcp_call'),
			status: z.string(),
			arguments: z.string(),
			name: z.string(),
			server_label: z.string(),
			output: z.string().nullable().optional(),
			error: z.json().nullable().optional(),
		})
		.passthrough(),
	z
		.object({
			id: z.string(),
			type: z.literal('mcp_list_tools'),
			server_label: z.string(),
			tools: z.array(z.json()),
			error: z.string().nullable().optional(),
		})
		.passthrough(),
]);
export const ResponseOutput = z
	.object({
		id: z.string(),
		created_at: z.number(),
		object: z.literal('response'),
		output: z.array(responseItem),
		parallel_tool_calls: z.boolean(),
		model: z.literal('parallel').optional(),
		status: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.string()).nullable().optional(),
		previous_response_id: z.string().nullable().optional(),
		usage: z.null().optional(),
	})
	.passthrough();

export const EndpointInputSchemas = {
	'monitors.create': MonitorCreateInput,
	'monitors.list': MonitorListInput,
	'monitors.stats': EmptyInput,
	'monitors.get': MonitorIdInput,
	'monitors.cancel': MonitorIdInput,
	'monitors.trigger': MonitorIdInput,
	'monitors.events': MonitorEventsInput,
	'monitors.update': MonitorUpdateInput,
	'tasks.createGroup': TaskGroupCreateInput,
	'tasks.getGroup': TaskGroupIdInput,
	'tasks.addGroupRuns': TaskGroupRunsInput,
	'tasks.getGroupRun': TaskGroupRunIdInput,
	'tasks.createRun': TaskRunCreateInput,
	'tasks.getRun': TaskRunIdInput,
	'tasks.getRunInput': TaskRunIdInput,
	'tasks.getResult': TaskResultInput,
	'findall.entitySearch': FindAllEntityInput,
	'findall.ingest': FindAllIngestInput,
	'findall.createRun': FindAllCreateInput,
	'findall.getRun': FindAllIdInput,
	'findall.cancel': FindAllIdInput,
	'findall.enrich': FindAllEnrichInput,
	'findall.extend': FindAllExtendInput,
	'findall.result': FindAllIdInput,
	'findall.schema': FindAllIdInput,
	'chat.create': ChatInput,
	'responses.create': ResponseInput,
	'search.search': SearchInput,
	'images.search': ImageSearchInput,
	'places.search': PlaceSearchInput,
	'decisions.create': DecisionInput,
	'memory.clear': MemoryClearInput,
	'memory.evict': MemoryEvictInput,
	'memory.retrieve': MemoryRetrieveInput,
	'extract.extract': ExtractInput,
} as const;

export const EndpointOutputSchemas = {
	'monitors.create': MonitorOutput,
	'monitors.list': MonitorListOutput,
	'monitors.stats': MonitorStatsOutput,
	'monitors.get': MonitorOutput,
	'monitors.cancel': MonitorOutput,
	'monitors.trigger': NoContent,
	'monitors.events': MonitorEventsOutput,
	'monitors.update': MonitorOutput,
	'tasks.createGroup': TaskGroupOutput,
	'tasks.getGroup': TaskGroupOutput,
	'tasks.addGroupRuns': TaskGroupRunsOutput,
	'tasks.getGroupRun': TaskRunOutput,
	'tasks.createRun': TaskRunOutput,
	'tasks.getRun': TaskRunOutput,
	'tasks.getRunInput': TaskRunInput,
	'tasks.getResult': TaskResultOutput,
	'findall.entitySearch': FindAllEntityOutput,
	'findall.ingest': FindAllSchemaOutput,
	'findall.createRun': FindAllRunOutput,
	'findall.getRun': FindAllRunOutput,
	'findall.cancel': NoContent,
	'findall.enrich': FindAllSchemaOutput,
	'findall.extend': FindAllSchemaOutput,
	'findall.result': FindAllResultOutput,
	'findall.schema': FindAllSchemaOutput,
	'chat.create': ChatOutput,
	'responses.create': ResponseOutput,
	'search.search': SearchOutput,
	'images.search': ImageSearchOutput,
	'places.search': PlaceSearchOutput,
	'decisions.create': DecisionOutput,
	'memory.clear': NoContent,
	'memory.evict': NoContent,
	'memory.retrieve': MemoryRetrieveOutput,
	'extract.extract': ExtractOutput,
} as const;
