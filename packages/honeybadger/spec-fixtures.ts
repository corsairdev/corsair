/**
 * Response documents built from the published OpenAPI spec, required fields
 * only, so a schema that demands more than the spec would fail here. Generated
 * once from https://docs.honeybadger.io/api/v3/openapi.json by walking each
 * response schema and keeping its required fields; committed so the check runs
 * offline.
 */
// unknown: each entry is a different operation's response document; the test
// looks up that operation's output schema and parses with it.
export const SPEC_RESPONSES: Array<{ operation: string; document: unknown }> = [
	{
		operation: 'projects.list',
		document: {
			data: [
				{
					id: 'x',
					account_id: 'x',
					name: 'x',
					asana_workspace_id: null,
					active: true,
					links: {
						web: 'x',
					},
					disable_public_links: true,
					environments: ['x'],
					language: null,
					resolve_errors_on_deploy: true,
					user_url: null,
					source_url: null,
					user_search_field: null,
					customer_throttle: null,
					fault_count: 1,
					unresolved_fault_count: 1,
					last_notice_at: null,
					earliest_notice_at: null,
					purge_days: null,
					created_at: '2026-01-01T00:00:00Z',
				},
			],
		},
	},
	{
		operation: 'projects.get',
		document: {
			data: {
				id: 'x',
				account_id: 'x',
				name: 'x',
				asana_workspace_id: null,
				active: true,
				links: {
					web: 'x',
				},
				disable_public_links: true,
				environments: ['x'],
				language: null,
				resolve_errors_on_deploy: true,
				user_url: null,
				source_url: null,
				user_search_field: null,
				customer_throttle: null,
				fault_count: 1,
				unresolved_fault_count: 1,
				last_notice_at: null,
				earliest_notice_at: null,
				purge_days: null,
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'projects.create',
		document: {
			data: {
				id: 'x',
				account_id: 'x',
				name: 'x',
				asana_workspace_id: null,
				active: true,
				links: {
					web: 'x',
				},
				disable_public_links: true,
				environments: ['x'],
				language: null,
				resolve_errors_on_deploy: true,
				user_url: null,
				source_url: null,
				user_search_field: null,
				customer_throttle: null,
				fault_count: 1,
				unresolved_fault_count: 1,
				last_notice_at: null,
				earliest_notice_at: null,
				purge_days: null,
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'projects.update',
		document: {
			data: {
				id: 'x',
				account_id: 'x',
				name: 'x',
				asana_workspace_id: null,
				active: true,
				links: {
					web: 'x',
				},
				disable_public_links: true,
				environments: ['x'],
				language: null,
				resolve_errors_on_deploy: true,
				user_url: null,
				source_url: null,
				user_search_field: null,
				customer_throttle: null,
				fault_count: 1,
				unresolved_fault_count: 1,
				last_notice_at: null,
				earliest_notice_at: null,
				purge_days: null,
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'projects.stats',
		document: {
			data: {
				id: 'x',
				fault_count: 1,
				unresolved_fault_count: 1,
				notice_count_today: 1,
				notice_count_week: 1,
				notice_count_month: 1,
			},
		},
	},
	{
		operation: 'projects.occurrences',
		document: {
			data: {
				project_id: 'x',
				buckets: [
					{
						timestamp: 1,
						count: 1,
					},
				],
			},
		},
	},
	{
		operation: 'occurrences.list',
		document: {
			data: [
				{
					project_id: 'x',
					buckets: [
						{
							timestamp: 1,
							count: 1,
						},
					],
				},
			],
		},
	},
	{
		operation: 'faults.list',
		document: {
			data: [
				{
					id: 'x',
					project_id: 'x',
					message: 'x',
					created_at: '2026-01-01T00:00:00Z',
					links: {
						web: 'x',
					},
				},
			],
		},
	},
	{
		operation: 'faults.get',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				message: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
			},
		},
	},
	{
		operation: 'faults.update',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				message: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
			},
		},
	},
	{
		operation: 'faults.resolve',
		document: {
			data: {
				count: 1,
				dry_run: true,
				fault_ids: ['x'],
			},
		},
	},
	{
		operation: 'faults.unresolve',
		document: {
			data: {
				count: 1,
				dry_run: true,
				fault_ids: ['x'],
			},
		},
	},
	{
		operation: 'faults.ignore',
		document: {
			data: {
				count: 1,
				dry_run: true,
				fault_ids: ['x'],
			},
		},
	},
	{
		operation: 'faults.unignore',
		document: {
			data: {
				count: 1,
				dry_run: true,
				fault_ids: ['x'],
			},
		},
	},
	{
		operation: 'faults.summary',
		document: {
			data: {
				total: 1,
				environments: [
					{
						environment: null,
						resolved: true,
						ignored: true,
						count: 1,
					},
				],
			},
		},
	},
	{
		operation: 'faults.assign',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				message: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
			},
		},
	},
	{
		operation: 'faults.unassign',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				message: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
			},
		},
	},
	{
		operation: 'faults.merge',
		document: {
			data: {
				batch_id: 'x',
				source_id: 'x',
				target_id: 'x',
			},
		},
	},
	{
		operation: 'faults.pauseRecording',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				message: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
			},
		},
	},
	{
		operation: 'faults.resumeRecording',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				message: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
			},
		},
	},
	{
		operation: 'faults.snooze',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				message: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
			},
		},
	},
	{
		operation: 'faults.unsnooze',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				message: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
			},
		},
	},
	{
		operation: 'faults.affectedUsers',
		document: {
			data: [
				{
					user: 'x',
					count: 1,
				},
			],
		},
	},
	{
		operation: 'faults.occurrences',
		document: {
			data: [
				{
					timestamp: 1,
					count: 1,
				},
			],
		},
	},
	{
		operation: 'notices.list',
		document: {
			data: [
				{
					id: '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47',
					fault_id: 'x',
					project_id: 'x',
					message: null,
					created_at: '2026-01-01T00:00:00Z',
				},
			],
		},
	},
	{
		operation: 'notices.get',
		document: {
			data: {
				id: '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47',
				fault_id: 'x',
				project_id: 'x',
				message: null,
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'comments.list',
		document: {
			data: [
				{
					id: 'x',
					fault_id: 'x',
					created_at: '2026-01-01T00:00:00Z',
					links: {
						web: 'x',
					},
					author: {},
					body: null,
					source: 'x',
					event: null,
				},
			],
		},
	},
	{
		operation: 'comments.get',
		document: {
			data: {
				id: 'x',
				fault_id: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
				author: {},
				body: null,
				source: 'x',
				event: null,
			},
		},
	},
	{
		operation: 'comments.create',
		document: {
			data: {
				id: 'x',
				fault_id: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
				author: {},
				body: null,
				source: 'x',
				event: null,
			},
		},
	},
	{
		operation: 'comments.update',
		document: {
			data: {
				id: 'x',
				fault_id: 'x',
				created_at: '2026-01-01T00:00:00Z',
				links: {
					web: 'x',
				},
				author: {},
				body: null,
				source: 'x',
				event: null,
			},
		},
	},
	{
		operation: 'deploys.list',
		document: {
			data: [
				{
					id: 'x',
					project_id: 'x',
					environment: null,
					revision: null,
					repository: null,
					local_username: null,
					created_at: '2026-01-01T00:00:00Z',
				},
			],
		},
	},
	{
		operation: 'deploys.get',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				environment: null,
				revision: null,
				repository: null,
				local_username: null,
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'environments.list',
		document: {
			data: [
				{
					id: 'x',
					project_id: 'x',
					name: 'x',
					notifications: true,
					created_at: null,
				},
			],
		},
	},
	{
		operation: 'environments.get',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				name: 'x',
				notifications: true,
				created_at: null,
			},
		},
	},
	{
		operation: 'environments.create',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				name: 'x',
				notifications: true,
				created_at: null,
			},
		},
	},
	{
		operation: 'environments.update',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				name: 'x',
				notifications: true,
				created_at: null,
			},
		},
	},
	{
		operation: 'environments.bulkDelete',
		document: {
			data: {
				count: 1,
			},
		},
	},
	{
		operation: 'environments.bulkUpdate',
		document: {
			data: {
				count: 1,
			},
		},
	},
	{
		operation: 'checkIns.list',
		document: {
			data: [
				{
					id: 'x',
					project_id: 'x',
					schedule_type: 'simple',
					links: {
						web: 'x',
					},
					name: null,
					slug: null,
					state: 'pending',
					reported_at: null,
					expected_at: null,
					missed_count: 1,
					grace_period: 'x',
					report_url: 'x',
					cron_timezone: 'x',
					created_at: '2026-01-01T00:00:00Z',
				},
			],
		},
	},
	{
		operation: 'checkIns.get',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				schedule_type: 'simple',
				links: {
					web: 'x',
				},
				name: null,
				slug: null,
				state: 'pending',
				reported_at: null,
				expected_at: null,
				missed_count: 1,
				grace_period: 'x',
				report_url: 'x',
				cron_timezone: 'x',
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'checkIns.create',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				schedule_type: 'simple',
				links: {
					web: 'x',
				},
				name: null,
				slug: null,
				state: 'pending',
				reported_at: null,
				expected_at: null,
				missed_count: 1,
				grace_period: 'x',
				report_url: 'x',
				cron_timezone: 'x',
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'checkIns.update',
		document: {
			data: {
				id: 'x',
				project_id: 'x',
				schedule_type: 'simple',
				links: {
					web: 'x',
				},
				name: null,
				slug: null,
				state: 'pending',
				reported_at: null,
				expected_at: null,
				missed_count: 1,
				grace_period: 'x',
				report_url: 'x',
				cron_timezone: 'x',
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'checkIns.replace',
		document: {
			data: [
				{
					operation: 'create',
					slug: 'x',
					success: true,
				},
			],
		},
	},
	{
		operation: 'checkIns.events',
		document: {
			data: [
				{
					check_in_id: 'x',
					state: 'reporting',
					created_at: '2026-01-01T00:00:00Z',
				},
			],
		},
	},
	{
		operation: 'sites.list',
		document: {
			data: [
				{
					id: '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47',
					project_id: 'x',
					name: 'x',
					url: 'x',
					active: true,
					links: {
						web: 'x',
					},
					state: 'pending',
					last_checked_at: null,
					match_type: 'success',
					match: null,
					request_method: 'GET',
					frequency: 1,
					locations: ['Virginia'],
					validate_ssl: true,
					request_headers: {},
					request_body: null,
					outage_threshold: null,
					timeout: null,
					created_at: '2026-01-01T00:00:00Z',
				},
			],
		},
	},
	{
		operation: 'sites.get',
		document: {
			data: {
				id: '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47',
				project_id: 'x',
				name: 'x',
				url: 'x',
				active: true,
				links: {
					web: 'x',
				},
				state: 'pending',
				last_checked_at: null,
				match_type: 'success',
				match: null,
				request_method: 'GET',
				frequency: 1,
				locations: ['Virginia'],
				validate_ssl: true,
				request_headers: {},
				request_body: null,
				outage_threshold: null,
				timeout: null,
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'sites.create',
		document: {
			data: {
				id: '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47',
				project_id: 'x',
				name: 'x',
				url: 'x',
				active: true,
				links: {
					web: 'x',
				},
				state: 'pending',
				last_checked_at: null,
				match_type: 'success',
				match: null,
				request_method: 'GET',
				frequency: 1,
				locations: ['Virginia'],
				validate_ssl: true,
				request_headers: {},
				request_body: null,
				outage_threshold: null,
				timeout: null,
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'sites.update',
		document: {
			data: {
				id: '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47',
				project_id: 'x',
				name: 'x',
				url: 'x',
				active: true,
				links: {
					web: 'x',
				},
				state: 'pending',
				last_checked_at: null,
				match_type: 'success',
				match: null,
				request_method: 'GET',
				frequency: 1,
				locations: ['Virginia'],
				validate_ssl: true,
				request_headers: {},
				request_body: null,
				outage_threshold: null,
				timeout: null,
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'sites.checks',
		document: {
			data: [
				{
					created_at: '2026-01-01T00:00:00Z',
				},
			],
		},
	},
	{
		operation: 'sites.outages',
		document: {
			data: [
				{
					id: '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47',
					site_id: '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47',
					down_at: '2026-01-01T00:00:00Z',
					status: null,
					reason: null,
					headers: {},
					created_at: '2026-01-01T00:00:00Z',
					up_at: null,
					duration_seconds: null,
				},
			],
		},
	},
	{
		operation: 'streams.list',
		document: {
			data: [{}],
		},
	},
	{
		operation: 'insights.query',
		document: {
			data: {},
			links: null,
		},
	},
	{
		operation: 'account.get',
		document: {
			data: {
				id: 'x',
				active: true,
				links: {
					web: 'x',
				},
				name: null,
				email: null,
				parked: true,
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	{
		operation: 'account.usage',
		document: {
			data: {
				id: 'x',
				quota: {
					errors_limit: 1,
					errors_consumed: 1,
					uptime_limit: null,
					uptime_consumed: 1,
					check_ins_limit: null,
					check_ins_consumed: 1,
				},
			},
		},
	},
	{
		operation: 'token.get',
		document: {
			data: {},
		},
	},
];
