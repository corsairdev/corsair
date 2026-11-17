import { z } from 'zod';
import {
	HealthSchema,
	PlayCatalogSchema,
	PlayRunPackageSchema,
	PlaySchema,
	RunChildrenPageSchema,
	RunRowHistoryPageSchema,
	ToolCatalogSchema,
	ToolDescriptionSchema,
	ToolExecutionLookupSchema,
	ToolSearchSchema,
} from './models';
export const PathSegmentSchema = z
	.string()
	.min(1)
	.refine((v) => v !== '.' && v !== '..', {
		message: 'Dot path segments are not valid identifiers',
	});
// Open records are provider-defined JSON described by tools.get or plays.get.
export const GetRuntimeHealthInputSchema = z.record(z.string(), z.unknown());
export const GetRuntimeHealthOutputSchema = HealthSchema;
export const ListToolsInputSchema = z.strictObject({
	categories: z
		.string()
		.optional()
		.describe('Comma-separated tool categories to include.'),
	tags: z.string().optional().describe('Comma-separated tool tags to include.'),
	grep: z
		.string()
		.optional()
		.describe('Literal terms to match against tool metadata.'),
	compact: z
		.boolean()
		.optional()
		.describe('Set false to include input and output schemas.'),
	grep_mode: z
		.enum(['all', 'any', 'phrase'])
		.optional()
		.describe('How to combine literal grep terms.'),
});
export const ListToolsOutputSchema = ToolCatalogSchema;
export const SearchToolsInputSchema = z.strictObject({
	q: z
		.string()
		.optional()
		.describe(
			'The task or capability to search for. Omit when filtering only by categories or search_terms.',
		),
	categories: z
		.string()
		.optional()
		.describe('Comma-separated tool categories to filter.'),
	search_terms: z
		.string()
		.optional()
		.describe(
			'Comma-separated capability terms to rank and filter by, including when q is empty.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Maximum ranked tools to return.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-based offset into the ranked result set.'),
	task: z
		.string()
		.optional()
		.describe(
			'Optional. What the caller is trying to accomplish, in one sentence: the input it has and the result it needs, not a restatement of q. Used to rank candidates; up to 300 characters are used.',
		),
});
export const SearchToolsOutputSchema = ToolSearchSchema;
export const SearchInputSchema = z.strictObject({
	q: z
		.string()
		.optional()
		.describe(
			'The task or capability to search for. Omit when filtering only by categories or search_terms.',
		),
	types: z
		.string()
		.optional()
		.describe(
			'Comma-separated kinds to search: tools, monitors, prebuilts, custom, plays (prebuilts and custom), or docs. Omit to search everything.',
		),
	exclude: z
		.string()
		.optional()
		.describe(
			'Comma-separated kinds to leave out, using the same names as types. Applied after types.',
		),
	categories: z
		.string()
		.optional()
		.describe('Comma-separated tool categories to filter.'),
	search_terms: z
		.string()
		.optional()
		.describe(
			'Comma-separated capability terms to rank and filter by, including when q is empty.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Maximum ranked results to return.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-based offset into the ranked result set.'),
	task: z
		.string()
		.optional()
		.describe(
			'Optional. What the caller is trying to accomplish, in one sentence: the input it has and the result it needs, not a restatement of q. Used to rank candidates; up to 300 characters are used.',
		),
});
export const SearchOutputSchema = z.looseObject({
	results: z.array(
		z.looseObject({
			id: z.string(),
			kind: z.string(),
			displayName: z.string().nullish(),
			description: z.string().nullish(),
		}),
	),
	kinds: z.array(z.string()),
	search_ref: z.string().nullish(),
	count: z.number().nullish(),
	total: z.number().nullish(),
	offset: z.number().nullish(),
	limit: z.number().nullish(),
	next_offset: z.number().nullish(),
	total_is_exact: z.boolean().nullish(),
	may_have_more: z.boolean().nullish(),
	truncated: z.boolean().nullish(),
	query: z.string().nullish(),
	categories: z.array(z.string()).nullish(),
	search_terms: z.array(z.string()).nullish(),
});
export const GetToolInputSchema = z.strictObject({
	toolId: PathSegmentSchema.describe(
		'The toolId returned by the related Deepline API call.',
	),
});
export const GetToolOutputSchema = ToolDescriptionSchema;
export const ExecuteToolInputSchema = z.strictObject({
	toolId: PathSegmentSchema.describe(
		'The toolId returned by the related Deepline API call.',
	),
	idempotencyKey: z
		.string()
		.min(1)
		.max(200)
		.regex(new RegExp('^[A-Za-z0-9._:-]+$'))
		.optional()
		.describe(
			'Optional caller-owned execution key. Case-sensitive, 1\u2013200 ASCII letters, digits, period, underscore, colon, or hyphen. Persist before dispatch. Changed input conflicts; expired keys cannot be reused.',
		),
	payload: z
		.record(z.string(), z.unknown())
		.describe('Input matching the selected tool input schema.'),
});
export const ExecuteToolOutputSchema = z
	.looseObject({
		status: z.string(),
		job_id: z.string().nullish(),
		meta: z.record(z.string(), z.unknown()).nullish(),
		// Native tools return result; provider-backed tools return toolResponse.
		result: z.unknown().optional(),
		toolResponse: z
			.looseObject({
				rawV2: z.unknown().nullish(),
				view: z.string().nullish(),
				responseMeta: z.record(z.string(), z.unknown()).nullish(),
			})
			.nullish(),
		extractedLists: z.record(z.string(), z.unknown()).nullish(),
		extractedValues: z.record(z.string(), z.unknown()).nullish(),
		billing: z
			.looseObject({
				credits_charged: z.number().nullish(),
				cost_usd: z.number().nullish(),
				pricing_status: z.string().nullish(),
				settlement_status: z.string().nullish(),
				estimated_credits: z.number().nullish(),
				estimated_cost_usd: z.number().nullish(),
			})
			.nullish(),
	})
	.refine(
		(value) =>
			value.toolResponse != null ||
			Object.hasOwn(value, 'result') ||
			(['queued', 'running'].includes(value.status) && Boolean(value.job_id)),
		{
			message:
				'Expected toolResponse, native result, or an active execution identity',
		},
	);
export const GetToolExecutionByKeyInputSchema = z.strictObject({
	key: PathSegmentSchema.describe(
		'The key returned by the related Deepline API call.',
	),
});
export const GetToolExecutionByKeyOutputSchema = ToolExecutionLookupSchema;
export const StartPlayRunInputSchema = z.strictObject({
	name: z.string().min(1).describe('Saved or prebuilt Play reference.'),
	input: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Input matching the selected Play schema.'),
	revisionId: z
		.string()
		.optional()
		.describe('Run a specific saved revision belonging to the named Play.'),
	force: z
		.boolean()
		.optional()
		.describe('Compatibility flag. Active sibling runs are allowed.'),
	forceToolRefresh: z
		.boolean()
		.optional()
		.describe('Bypass cached dataset and tool-call reuse.'),
	maxCredits: z
		.number()
		.gt(0)
		.optional()
		.describe(
			'Per-run Deepline-credit cap. Replaces the Play\u2019s declared maxCreditsPerRun for this run.',
		),
	maxConcurrentExternalCalls: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe(
			'Per-run ceiling on concurrently resident provider-tool executions and direct HTTP calls.',
		),
	maxConcurrentRows: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe(
			'Run-wide default and ceiling for live dataset-map row resolvers.',
		),
	waitForCompletionMs: z
		.number()
		.int()
		.min(0)
		.max(15000)
		.optional()
		.describe(
			'Briefly wait for completion. A timeout returns the existing run, not a new execution.',
		),
	terminalStatus: z
		.enum(['full'])
		.optional()
		.describe(
			'With a completion wait, request the full terminal detail wrapper.',
		),
});
// A start that waits for completion with terminalStatus 'full' returns the
// terminal detail wrapper instead of the compact package, same as runs.get.
const PlayRunEnvelopeSchema = z.union([
	PlayRunPackageSchema,
	z.looseObject({
		status: z.string(),
		result: z.unknown().nullish(),
		package: PlayRunPackageSchema,
	}),
	z.looseObject({
		runId: z.string(),
		snapshot: z.record(z.string(), z.unknown()),
		terminalStatus: z.unknown().nullish(),
	}),
]);
export const StartPlayRunOutputSchema = PlayRunEnvelopeSchema;
export const ListPlaysInputSchema = z.strictObject({
	cursor: z
		.string()
		.optional()
		.describe('Continue with the previous page cursor and the same filters.'),
	origin: z.enum(['prebuilt', 'owned']).optional(),

	summary_only: z
		.enum(['1'])
		.optional()
		.describe(
			'Load compact metadata without source or revisions. Cost and category requests still load the data they require.',
		),
	search: z
		.string()
		.optional()
		.describe(
			'Text to match against callable Play metadata and contracts. Returns every match in one response; cursor and inventory paging apply only without search.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Maximum Plays to return.'),
});
export const ListPlaysOutputSchema = PlayCatalogSchema;
export const GetPlaysActivityInputSchema = z.strictObject({
	timeZone: z.string().optional(),
	days: z.number().int().min(1).max(45).optional(),
	endDate: z.string().date().optional(),
	groupBy: z.enum(['kind', 'trigger_source']).optional(),
});
export const GetPlaysActivityOutputSchema = z.looseObject({
	timeZone: z.string(),
	groupBy: z.string(),
	endDate: z.string(),
	asOfAt: z.number().nullish(),
	buckets: z.array(
		z.looseObject({
			key: z.string(),
			label: z.string(),
			startAt: z.number(),
			endAt: z.number(),
			groups: z.array(z.looseObject({ group: z.string(), count: z.number() })),
			failedPlayRuns: z.number(),
			complete: z.looseObject({
				playRuns: z.boolean(),
				monitorDeliveries: z.boolean(),
			}),
		}),
	),
	coverage: z.looseObject({
		playRunsEarliestCompleteAt: z.union([z.number(), z.null()]),
		monitorDeliveriesEarliestCompleteAt: z.union([z.number(), z.null()]),
		monitorDeliveriesCompleteThroughAt: z.union([z.number(), z.null()]),
		projectionPending: z.boolean(),
		earliestPendingAt: z.union([z.number(), z.null()]),
	}),
});
export const GetRunsHistoryInputSchema = z
	.strictObject({
		search: z
			.string()
			.max(200)
			.optional()
			.describe('Case-insensitive substring, at most 200 characters.'),
		cursor: z
			.string()
			.optional()
			.describe('Opaque continuation bound to the same workspace and search.'),
		type: z
			.enum(['all', 'plays', 'monitors'])
			.optional()
			.describe(
				'Search all, Play or Monitor runs by recorded trigger metadata; requires search.',
			),
		limit: z
			.number()
			.int()
			.min(1)
			.max(30)
			.optional()
			.describe('Maximum indexed history entries examined in this page.'),
	})
	.refine((v) => v.type === undefined || Boolean(v.search), {
		message: 'type requires search',
	});
export const GetRunsHistoryOutputSchema = z.looseObject({
	runs: z.array(
		z.looseObject({
			runId: z.string(),
			workflowId: z.string(),
			workflowName: z.string(),
			playScope: z.union([z.string(), z.null()]).nullish(),
			status: z.string(),
			createdAt: z.number(),
			updatedAt: z.number(),
			callerName: z.union([z.string(), z.null()]).nullish(),
			callerEmail: z.union([z.string(), z.null()]).nullish(),
			authorName: z.union([z.string(), z.null()]).nullish(),
			authorEmail: z.union([z.string(), z.null()]).nullish(),
			callerAgent: z.union([z.string(), z.null()]).nullish(),
			executionMode: z.union([z.string(), z.null()]).nullish(),
			bindingId: z.union([z.string(), z.null()]).nullish(),
			parentWorkflowName: z.union([z.string(), z.null()]).nullish(),
			outputRowCount: z.union([z.number(), z.null()]).nullish(),
			hasOutput: z.boolean().nullish(),
			billingTotalCredits: z.number().nullish(),
			triggerSource: z.string().nullish(),
		}),
	),
	nextCursor: z.union([z.string(), z.null()]),
	hasMore: z.boolean(),
	avatarsByName: z.record(z.string(), z.string()).nullish(),
});
export const GetPlayInputSchema = z.strictObject({
	name: PathSegmentSchema.describe(
		'The name returned by the related Deepline API call.',
	),
});
export const GetPlayOutputSchema = z.looseObject({
	play: PlaySchema,
	latestRuns: z.array(z.record(z.string(), z.unknown())),
	source: z.string().nullish(),
});
export const GetRunInputSchema = z.strictObject({
	runId: PathSegmentSchema.describe(
		'The runId returned by the related Deepline API call.',
	),
	full: z
		.boolean()
		.optional()
		.describe(
			'true selects the legacy detail wrapper: status and result are top-level, and the compact package is nested under package.',
		),
	include: z
		.string()
		.optional()
		.describe(
			'Optional comma-separated expansions: nodeStates, runInsights, configuration.',
		),
	billing: z
		.boolean()
		.optional()
		.describe('false omits billing enrichment from full or runInsights reads.'),
	watchSnapshot: z
		.boolean()
		.optional()
		.describe('true returns the bounded status snapshot used by SDK watch.'),
});
export const GetRunOutputSchema = PlayRunEnvelopeSchema;
export const ListRunChildrenInputSchema = z.strictObject({
	runId: PathSegmentSchema.describe(
		'The runId returned by the related Deepline API call.',
	),
	launchKey: z.string().describe('Authored ctx.runPlayAsync launch key.'),
	cursor: z
		.string()
		.optional()
		.describe('Opaque cursor returned by the previous page.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Page size from 1 through 50; defaults to 50.'),
});
export const ListRunChildrenOutputSchema = RunChildrenPageSchema;
export const GetBillingEntitlementsInputSchema = z.record(
	z.string(),
	z.unknown(),
);
export const GetBillingEntitlementsOutputSchema = z.looseObject({
	org_id: z.string(),
	as_of: z.number(),
	plan: z.union([
		z.looseObject({
			sku: z.string().nullish(),
			name: z.string().nullish(),
			catalog_revision: z.union([z.string(), z.null()]).nullish(),
			included_credits: z.number().nullish(),
			interval: z.union([z.string(), z.null()]).nullish(),
		}),
		z.null(),
	]),
	benefits: z.looseObject({
		quickenrichUnlimited: z
			.looseObject({
				status: z.string(),
				value: z.looseObject({
					enabled: z.boolean(),
					requestsPerMinute: z.number(),
				}),
				expiresAt: z.number().nullish(),
			})
			.nullish(),
		peopleSearch: z
			.looseObject({
				status: z.string(),
				value: z.looseObject({
					enabled: z.boolean(),
					requestsPerMinute: z.number(),
					profilesPerMonth: z.number(),
					overageCreditsPerProfile: z.number().nullish(),
				}),
				expiresAt: z.number().nullish(),
				usage: z.looseObject({
					month: z.string(),
					periodStartsAt: z.number().nullish(),
					resetsAt: z.number().nullish(),
					resetsOn: z.string().nullish(),
					limit: z.number(),
					consumed: z.number(),
					remaining: z.number(),
				}),
			})
			.nullish(),
		includedStorage: z
			.looseObject({
				status: z.string(),
				usage: z.looseObject({
					limit: z.number(),
					consumed: z.number(),
					remaining: z.number(),
					measuredDay: z.string(),
					overageCharged: z.boolean(),
				}),
			})
			.nullish(),
	}),
	effective_limits: z.looseObject({
		quickenrichUnlimited: z
			.looseObject({
				baseline: z.number(),
				effective: z.number(),
				source: z.string(),
				override_expires_at: z.number().nullish(),
			})
			.nullish(),
	}),
});
export const GetBillingBalanceInputSchema = z.strictObject({
	view: z
		.enum(['pill'])
		.optional()
		.describe(
			'Set pill for the compact display response; omit for the full balance and exposure breakdown.',
		),
});
export const GetBillingBalanceOutputSchema = z.union([
	z.looseObject({
		org_id: z.string(),
		balance: z.number(),
		balance_display: z.string().nullish(),
		rough_usd_balance: z.number().nullish(),
		posted_balance_credits: z.union([z.number(), z.null()]).nullish(),
		pending_spend_credits: z.union([z.number(), z.null()]).nullish(),
		spendable_balance_credits: z.union([z.number(), z.null()]),
		spendable_balance_status: z.string(),
		spendable_balance_checked_at: z.union([z.string(), z.null()]).nullish(),
		spendable_balance_message: z.string().nullish(),
		temporary_hold_credits: z.union([z.number(), z.null()]).nullish(),
		temporary_hold_credits_truncated: z
			.union([z.boolean(), z.null()])
			.nullish(),
		rough_usd_temporary_holds: z.union([z.number(), z.null()]).nullish(),
		estimated_hold_credits: z.union([z.number(), z.null()]).nullish(),
		incurred_unsettled_credits: z.union([z.number(), z.null()]).nullish(),
		pending_wallet_debit_credits: z.union([z.number(), z.null()]).nullish(),
		pending_wallet_refund_credits: z.union([z.number(), z.null()]).nullish(),
		unpriced_unsettled_reservation_count: z
			.union([z.number(), z.null()])
			.nullish(),
		exposure_status: z.string(),
		exposure_message: z.string().nullish(),
		temporary_hold_message: z.string().nullish(),
		balance_status: z.string().nullish(),
		has_payment_method: z.boolean().nullish(),
		payment_method: z
			.union([z.record(z.string(), z.unknown()), z.null()])
			.nullish(),
		recovery: z.record(z.string(), z.unknown()).nullish(),
		updated_at: z.union([z.string(), z.null()]).nullish(),
	}),
	z.looseObject({
		org_id: z.string(),
		view: z.literal('pill'),
		balance: z.number(),
		balance_display: z.string(),
		rough_usd_balance: z.number(),
		balance_status: z.string(),
		updated_at: z.union([z.string(), z.null()]),
	}),
]);
export const GetBillingUsageInputSchema = z
	.strictObject({
		run_id: z
			.string()
			.optional()
			.describe(
				'Filter recent charges and include spend for this exact public run ID.',
			),
		request_id: z
			.string()
			.optional()
			.describe(
				'Exact call lookup, at most 200 characters. Cannot be combined with run_id, recent_cursor, or recent_offset. Returns only org_id and recent.',
			),
		recent_limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe(
				'Recent page size; default 10, clamped to 100. Ignored for request_id.',
			),
		recent_offset: z
			.number()
			.int()
			.min(0)
			.max(500)
			.optional()
			.describe(
				'Zero-based recent activity offset, at most 500. Follow recent.next_offset while recent.has_more is true.',
			),
		recent_cursor: z
			.string()
			.optional()
			.describe(
				'Legacy cursor input. Prefer recent_offset; cannot be combined with request_id.',
			),
	})
	.refine(
		(v) =>
			!v.request_id ||
			(v.run_id === undefined &&
				v.recent_cursor === undefined &&
				v.recent_offset === undefined),
		{
			message:
				'request_id cannot be combined with run_id or pagination cursors',
		},
	);
export const GetBillingUsageOutputSchema = z.looseObject({
	org_id: z.string(),
	balance: z.number().nullish(),
	balance_display: z.string().nullish(),
	rough_usd_balance: z.number().nullish(),
	balance_updated_at: z.union([z.string(), z.null()]).nullish(),
	plan: z
		.looseObject({ public_name: z.string(), usd_per_credit: z.number() })
		.nullish(),
	managed_usd_per_email: z.union([z.number(), z.null()]).nullish(),
	has_payment_method: z.boolean().nullish(),
	payment_method: z
		.union([z.record(z.string(), z.unknown()), z.null()])
		.nullish(),
	usage: z
		.looseObject({
			month_spent_credits: z.number(),
			rough_usd_spent: z.number(),
			last_30_days_usage_credits: z.number(),
			rough_usd_last_30_days_usage: z.number(),
			temporary_hold_credits: z.number(),
			temporary_hold_credits_truncated: z.boolean(),
			rough_usd_temporary_holds: z.number(),
			period_start_at: z.string(),
			period_end_at: z.string(),
		})
		.nullish(),
	run: z
		.union([
			z.looseObject({
				run_id: z.string().nullish(),
				spent_credits: z.number().nullish(),
				rough_usd_spent: z.number().nullish(),
				event_count: z.number().nullish(),
			}),
			z.null(),
		])
		.nullish(),
	quota: z
		.looseObject({
			enabled: z.boolean(),
			monthly_credits_limit: z.union([z.number(), z.null()]),
			monthly_rough_usd_limit: z.union([z.number(), z.null()]),
			remaining_credits: z.union([z.number(), z.null()]),
			remaining_rough_usd: z.union([z.number(), z.null()]),
			updated_at: z.union([z.string(), z.null()]),
		})
		.nullish(),
	autobill: z.record(z.string(), z.unknown()).nullish(),
	recent: z.looseObject({
		run_id: z.union([z.string(), z.null()]),
		request_id: z.string().nullish(),
		total: z.number(),
		total_is_exact: z.boolean().nullish(),
		total_lower_bound: z.number().nullish(),
		offset: z.number(),
		limit: z.number(),
		next_offset: z.number(),
		next_cursor: z.union([z.string(), z.null()]),
		has_more: z.boolean(),
		incomplete: z.boolean(),
		entries: z.array(
			z.looseObject({
				id: z.string(),
				provider: z.string(),
				operation: z.string(),
				status: z.string(),
				request_id: z.string(),
				run_id: z.union([z.string(), z.null()]),
				play_run_id: z.union([z.string(), z.null()]).nullish(),
				workflow_id: z.union([z.string(), z.null()]).nullish(),
				billing_run_id: z.union([z.string(), z.null()]).nullish(),
				execution_run_id: z.union([z.string(), z.null()]).nullish(),
				included_in_run_id: z.union([z.string(), z.null()]).nullish(),
				billing_scope: z.union([z.string(), z.null()]).nullish(),
				step_block_id: z.union([z.string(), z.null()]).nullish(),
				step_alias: z.union([z.string(), z.null()]).nullish(),
				auth_type: z.union([z.string(), z.null()]).nullish(),
				user_id: z.union([z.string(), z.null()]).nullish(),
				api_key_id: z.union([z.string(), z.null()]).nullish(),
				credits: z.number(),
				billing_mode: z.union([z.string(), z.null()]).nullish(),
				pricing_model: z.union([z.string(), z.null()]).nullish(),
				pricing_basis: z.union([z.string(), z.null()]).nullish(),
				pricing_unit_amount: z.union([z.number(), z.null()]).nullish(),
				outcome: z.union([z.string(), z.null()]).nullish(),
				policy_id: z.union([z.string(), z.null()]).nullish(),
				provider_units: z.union([z.number(), z.null()]).nullish(),
				batch_count: z.union([z.number(), z.null()]).nullish(),
				total_results: z.union([z.number(), z.null()]).nullish(),
				delta: z.union([z.number(), z.null()]).nullish(),
				reason: z.union([z.string(), z.null()]).nullish(),
				stripe_session_id: z.union([z.string(), z.null()]).nullish(),
				metadata: z
					.union([z.record(z.string(), z.unknown()), z.null()])
					.nullish(),
				billing_note: z.union([z.string(), z.null()]).nullish(),
				charge_state: z.string(),
				charge_finality: z.string().nullish(),
				rough_usd_cost: z.union([z.number(), z.null()]).nullish(),
				created_at: z.string().nullish(),
			}),
		),
	}),
});
export const GetBillingLedgerInputSchema = z.strictObject({
	limit: z
		.number()
		.int()
		.min(1)
		.max(5000)
		.optional()
		.describe(
			'JSON page size; default 50, clamped to 5000. CSV export ignores the requested page limit.',
		),
	since_at: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Lower creation-time bound as Unix milliseconds.'),
	before_at: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Upper creation-time bound as Unix milliseconds.'),
	cursor: z
		.string()
		.optional()
		.describe(
			'Opaque next_cursor from the previous JSON page. Preserve all filters. Ignored for CSV.',
		),
	run_id: z.string().optional().describe('Exact public run ID.'),
	operation: z.string().optional().describe('Exact billed operation name.'),
});
export const GetBillingLedgerOutputSchema = z.looseObject({
	org_id: z.string(),
	scope: z.looseObject({ kind: z.literal('org') }),
	entries: z.array(
		z.looseObject({
			id: z.string(),
			delta: z.number(),
			reason: z.string(),
			provider: z.union([z.string(), z.null()]),
			operation: z.union([z.string(), z.null()]),
			request_id: z.union([z.string(), z.null()]),
			run_id: z.union([z.string(), z.null()]),
			billing_stage: z.union([z.string(), z.null()]),
			charge_state: z.union([z.string(), z.null()]),
			billing_mode: z.union([z.string(), z.null()]),
			pricing_model: z.union([z.string(), z.null()]),
			pricing_basis: z.union([z.string(), z.null()]),
			charge_credits: z.number(),
			outcome: z.union([z.string(), z.null()]),
			result_count: z.union([z.number(), z.null()]),
			deepline_rough_usd: z.union([z.number(), z.null()]),
			api_key_id: z.union([z.string(), z.null()]),
			metadata: z.union([z.record(z.string(), z.unknown()), z.null()]),
			billing_audit: z.record(z.string(), z.unknown()),
			stripe_session_id: z.union([z.string(), z.null()]),
			created_at: z.string(),
		}),
	),
	has_more: z.boolean(),
	next_cursor: z.union([z.string(), z.null()]),
	next_before_at: z.null(),
});

// Dataset and log routes follow the official Deepline CLI/SDK 0.3.535.
export const ExportRowsInputSchema = z.strictObject({
	playName: PathSegmentSchema,
	tableNamespace: z.string().min(1),
	runId: z.string().min(1).optional(),
	limit: z.number().int().min(1).max(5000).optional(),
	offset: z.number().int().min(0).optional(),
	rowMode: z.enum(['output', 'all', 'live']).optional(),
	summary: z.enum(['full', 'counts']).optional(),
});
export const ExportRowsOutputSchema = z.looseObject({
	rows: z.array(
		z.looseObject({
			key: z.string().optional(),
			status: z.string().optional(),
			runId: z.string().nullish(),
			data: z.record(z.string(), z.unknown()).optional(),
		}),
	),
	scope: z
		.union([
			z.looseObject({ kind: z.literal('database') }),
			z.looseObject({ kind: z.literal('run'), runId: z.string() }),
		])
		.optional(),
	summaryMode: z.string().optional(),
	summary: z
		.looseObject({
			stats: z
				.looseObject({
					total: z.number().optional(),
					queued: z.number().optional(),
					running: z.number().optional(),
					completed: z.number().optional(),
					failed: z.number().optional(),
				})
				.optional(),
			columns: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),
	customerDbUrl: z.string().optional(),
	deltaCursor: z.number().optional(),
});
export const RowHistoryInputSchema = z.strictObject({
	playName: PathSegmentSchema,
	runId: z.string().min(1),
	tableNamespace: z.string().min(1),
	limit: z.number().int().min(1).max(1000).optional(),
	cursor: z.string().optional(),
});
export const RowHistoryOutputSchema = RunRowHistoryPageSchema;
export const RunLogsInputSchema = z
	.strictObject({
		runId: PathSegmentSchema,
		afterSeq: z.number().int().min(0).optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		view: z.enum(['failed']).optional(),
	})
	.refine((v) => v.view !== 'failed' || v.afterSeq === undefined, {
		message: 'The failed log window cannot be combined with afterSeq',
	});
export const RunLogsOutputSchema = z.looseObject({
	runId: z.string(),
	entries: z.array(z.looseObject({ seq: z.number(), line: z.string() })),
	totalLogCount: z.number().optional(),
	firstSeq: z.number().nullish(),
	lastSeq: z.number().nullish(),
	lastStoredSeq: z.number().optional(),
	hasMore: z.boolean().optional(),
	logsTruncated: z.boolean().optional(),
	view: z.string().optional(),
	association: z.string().optional(),
	warning: z.string().optional(),
});

export const DeeplineEndpointInputSchemas = {
	'datasets.rows': ExportRowsInputSchema,
	'datasets.history': RowHistoryInputSchema,
	'runs.logs': RunLogsInputSchema,
	'health.get': GetRuntimeHealthInputSchema,
	'tools.list': ListToolsInputSchema,
	'tools.search': SearchToolsInputSchema,
	'search.query': SearchInputSchema,
	'tools.get': GetToolInputSchema,
	'tools.execute': ExecuteToolInputSchema,
	'executions.getByKey': GetToolExecutionByKeyInputSchema,
	'plays.run': StartPlayRunInputSchema,
	'plays.list': ListPlaysInputSchema,
	'plays.activity': GetPlaysActivityInputSchema,
	'runs.history': GetRunsHistoryInputSchema,
	'plays.get': GetPlayInputSchema,
	'runs.get': GetRunInputSchema,
	'runs.children': ListRunChildrenInputSchema,
	'billing.entitlements': GetBillingEntitlementsInputSchema,
	'billing.balance': GetBillingBalanceInputSchema,
	'billing.usage': GetBillingUsageInputSchema,
	'billing.ledger': GetBillingLedgerInputSchema,
} as const;

export const DeeplineEndpointOutputSchemas = {
	'datasets.rows': ExportRowsOutputSchema,
	'datasets.history': RowHistoryOutputSchema,
	'runs.logs': RunLogsOutputSchema,
	'health.get': GetRuntimeHealthOutputSchema,
	'tools.list': ListToolsOutputSchema,
	'tools.search': SearchToolsOutputSchema,
	'search.query': SearchOutputSchema,
	'tools.get': GetToolOutputSchema,
	'tools.execute': ExecuteToolOutputSchema,
	'executions.getByKey': GetToolExecutionByKeyOutputSchema,
	'plays.run': StartPlayRunOutputSchema,
	'plays.list': ListPlaysOutputSchema,
	'plays.activity': GetPlaysActivityOutputSchema,
	'runs.history': GetRunsHistoryOutputSchema,
	'plays.get': GetPlayOutputSchema,
	'runs.get': GetRunOutputSchema,
	'runs.children': ListRunChildrenOutputSchema,
	'billing.entitlements': GetBillingEntitlementsOutputSchema,
	'billing.balance': GetBillingBalanceOutputSchema,
	'billing.usage': GetBillingUsageOutputSchema,
	'billing.ledger': GetBillingLedgerOutputSchema,
} as const;
