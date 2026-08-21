/**
 * Covers schema fidelity.
 *
 * The key lists below are the field names enumerated from live responses on
 * 2026-08-14. The first block asserts every one of them is declared, so an entity
 * cannot silently lose a field the API actually returns.
 *
 * All values are fictional: placeholder ids and `@example.com` addresses.
 */
import { BugsnagEndpointInputSchemas } from './endpoints/types';
import { BugsnagSchema } from './schema';
import {
	BugsnagCollaboratorEntity,
	BugsnagOrganizationEntity,
	BugsnagProjectEntity,
	BugsnagStabilityTarget,
	BugsnagTeamEntity,
} from './schema/database';
import * as responses from './schema/responses';
import {
	BugsnagBulkUpdateResult,
	BugsnagConfiguredIntegration,
	BugsnagError,
	BugsnagEvent,
	BugsnagEventDataDeletion,
	BugsnagEventDataRequest,
	BugsnagEventField,
	BugsnagFeatureFlag,
	BugsnagFeatureFlagSummary,
	BugsnagIntegrationTestResult,
	BugsnagNetworkEndpointGrouping,
	BugsnagPivot,
	BugsnagPivotValue,
	BugsnagProjectAccess,
	BugsnagProjectAccessCount,
	BugsnagRelease,
	BugsnagReleaseGroup,
	BugsnagSavedSearch,
	BugsnagSavedSearchUsageSummary,
	BugsnagSupportedIntegration,
	BugsnagTrendBucket,
} from './schema/responses';

/** Field names observed on live responses, per entity. */
const CAPTURED_KEYS = {
	organizations: [
		'id',
		'name',
		'api_key',
		'slug',
		'creator',
		'collaborators_url',
		'projects_url',
		'created_at',
		'updated_at',
		'auto_upgrade',
		'upgrade_url',
		'can_start_pro_trial',
		'pro_trial_ends_at',
		'pro_trial_feature',
		'managed_by_platform_services',
		'billing_emails',
	],
	projects: [
		'id',
		'organization_id',
		'slug',
		'name',
		'api_key',
		'upload_api_key',
		'must_use_upload_api_key',
		'type',
		'is_full_view',
		'release_stages',
		'language',
		'created_at',
		'updated_at',
		'errors_url',
		'events_url',
		'url',
		'html_url',
		'open_error_count',
		'for_review_error_count',
		'collaborators_count',
		'teams_count',
		'global_grouping',
		'location_grouping',
		'discarded_app_versions',
		'discarded_errors',
		'custom_event_fields_used',
		'resolve_on_deploy',
		'performance_display_type',
		'default_performance_percentile',
		'target_stability',
		'critical_stability',
		'stability_target_type',
	],
	collaborators: [
		'id',
		'name',
		'email',
		'two_factor_enabled',
		'two_factor_enabled_on',
		'password_updated_on',
		'show_time_in_utc',
		'heroku',
		'recovery_codes_remaining',
		'created_at',
		'is_admin',
		'pending_invitation',
		'last_request_at',
		'project_ids',
		'paid_for',
		'project_roles',
		'team_ids',
		'managed_by_smartbear_id',
	],
	/**
	 * Only 4 fields, and that is the whole record - there is no members array. Enumerated
	 * from a live create and read on a team made for the purpose.
	 */
	teams: ['id', 'name', 'collaborator_count', 'project_count'],
} as const;

const ENTITIES = {
	organizations: BugsnagOrganizationEntity,
	projects: BugsnagProjectEntity,
	collaborators: BugsnagCollaboratorEntity,
	teams: BugsnagTeamEntity,
} as const;

describe('captured fields are declared', () => {
	/**
	 * Guards the guard: if the two tables diverge the loop below would quietly stop
	 * covering an entity, so the pairing is asserted first.
	 */
	it('covers every registered entity', () => {
		expect(Object.keys(CAPTURED_KEYS).sort()).toEqual(
			Object.keys(ENTITIES).sort(),
		);
		expect(Object.keys(ENTITIES)).toHaveLength(4);
	});

	for (const [name, entity] of Object.entries(ENTITIES)) {
		it(`declares every captured ${name} field`, () => {
			const declared = Object.keys(entity.shape);
			const captured = CAPTURED_KEYS[name as keyof typeof CAPTURED_KEYS];

			expect(captured.length).toBeGreaterThan(0);
			for (const key of captured) {
				expect(declared).toContain(key);
			}
		});
	}

	it('declares the widest entity in full', () => {
		// Projects carry 32 live fields; a partial declaration here would drop data
		// silently rather than failing.
		expect(CAPTURED_KEYS.projects).toHaveLength(32);
		expect(
			Object.keys(BugsnagProjectEntity.shape).length,
		).toBeGreaterThanOrEqual(32);
	});
});

describe('only the primary key is required', () => {
	/**
	 * BugSnag nulls or omits fields depending on plan and on which features an
	 * organization has enabled, so a record carrying nothing but its key has to
	 * parse. A stricter schema rejects valid rows, and a rejected row is a lost row.
	 */
	const KEY_ONLY = [
		['organizations', BugsnagOrganizationEntity],
		['projects', BugsnagProjectEntity],
		['collaborators', BugsnagCollaboratorEntity],
		['teams', BugsnagTeamEntity],
	] as const;

	it('covers every registered entity', () => {
		expect(KEY_ONLY.map(([name]) => name).sort()).toEqual(
			Object.keys(ENTITIES).sort(),
		);
	});

	for (const [name, entity] of KEY_ONLY) {
		it(`parses a ${name} record carrying only its id`, () => {
			expect(entity.safeParse({ id: `${name}-1` }).success).toBe(true);
		});

		it(`rejects a ${name} record with no id`, () => {
			expect(entity.safeParse({ name: 'no id here' }).success).toBe(false);
		});
	}

	it('accepts null in place of any non-key field', () => {
		const parsed = BugsnagCollaboratorEntity.safeParse({
			id: 'collaborator-1',
			name: null,
			email: null,
			two_factor_enabled: null,
			last_request_at: null,
		});

		expect(parsed.success).toBe(true);
	});
});

describe('entities tolerate unrecognised fields', () => {
	/**
	 * `.loose()` everywhere, so a field BugSnag adds later survives instead of being
	 * dropped.
	 */
	it('keeps a field the schema does not declare', () => {
		const parsed = BugsnagProjectEntity.parse({
			id: 'project-1',
			name: 'Example',
			a_field_added_later: 'kept',
		});

		expect(parsed).toMatchObject({ a_field_added_later: 'kept' });
	});
});

describe('full records parse', () => {
	it('parses an organization with its nested creator', () => {
		const parsed = BugsnagOrganizationEntity.safeParse({
			id: 'organization-1',
			name: 'Example Org',
			slug: 'example-org',
			api_key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			creator: {
				id: 'collaborator-1',
				name: 'Test Tester',
				email: 'tester@example.com',
			},
			billing_emails: ['billing@example.com'],
			auto_upgrade: false,
			pro_trial_ends_at: null,
			created_at: '2026-08-14T00:00:00.000Z',
			updated_at: '2026-08-14T00:00:00.000Z',
		});

		expect(parsed.success).toBe(true);
		expect(parsed.success && parsed.data.creator?.email).toBe(
			'tester@example.com',
		);
	});

	/**
	 * The nested stability shape is taken from a real response, not from a guess.
	 * An earlier version of this test fed `{ target, type }` - names that do not
	 * exist - and passed, because the fixture matched the invented schema and the
	 * object is `.loose()`. A test and a schema can agree with each other while both
	 * being wrong about the API.
	 */
	it('parses a project with its nested stability targets', () => {
		const parsed = BugsnagProjectEntity.safeParse({
			id: 'project-1',
			organization_id: 'organization-1',
			name: 'Example App',
			type: 'android',
			release_stages: ['production'],
			target_stability: { value: 0.99, updated_at: null, updated_by_id: null },
			critical_stability: { value: 0.9, updated_at: null, updated_by_id: null },
			open_error_count: 3,
		});

		expect(parsed.success).toBe(true);
		expect(parsed.success && parsed.data.target_stability?.value).toBe(0.99);
	});

	it('declares the stability fields the API actually returns', () => {
		const declared = Object.keys(BugsnagStabilityTarget.shape);

		expect(declared).toEqual(
			expect.arrayContaining(['value', 'updated_at', 'updated_by_id']),
		);
		expect(declared).not.toContain('target');
		expect(declared).not.toContain('type');
	});

	/**
	 * `project_roles` is keyed by project id, so its shape depends on the account
	 * rather than being fixed. It is declared as a loose record for that reason.
	 */
	it('parses a collaborator whose project_roles vary by account', () => {
		const parsed = BugsnagCollaboratorEntity.safeParse({
			id: 'collaborator-1',
			name: 'Test Tester',
			email: 'tester@example.com',
			project_ids: ['project-1'],
			team_ids: [],
			project_roles: { 'project-1': { role: 'admin' } },
			is_admin: true,
		});

		expect(parsed.success).toBe(true);
	});
});

describe('the schema registry', () => {
	it('registers the structural entities and nothing transactional', () => {
		const names = Object.keys(BugsnagSchema.entities);

		expect(names).toHaveLength(4);
		expect(names).toContain('teams');
		// Errors and events arrive continuously and are only meaningful against a
		// time range, so they are deliberately not mirrored.
		expect(names).not.toContain('errors');
		expect(names).not.toContain('events');
		expect(names).not.toContain('trends');
	});
});

describe('input validation', () => {
	/**
	 * `per_page` is bounded client-side rather than by the API: `per_page=1000` was
	 * answered 200 live, so an unbounded value would let one call pull an arbitrarily
	 * large page.
	 */
	it('bounds per_page even though the API does not', () => {
		const list = BugsnagEndpointInputSchemas.organizationsList;

		expect(list.safeParse({ per_page: 100 }).success).toBe(true);
		expect(list.safeParse({ per_page: 101 }).success).toBe(false);
		expect(list.safeParse({ per_page: 0 }).success).toBe(false);
	});

	it('accepts an offset of zero and rejects a negative one', () => {
		const list = BugsnagEndpointInputSchemas.organizationsList;

		expect(list.safeParse({ offset: 0 }).success).toBe(true);
		expect(list.safeParse({ offset: -1 }).success).toBe(false);
	});

	it('requires the ids each operation is addressed by', () => {
		expect(BugsnagEndpointInputSchemas.projectsList.safeParse({}).success).toBe(
			false,
		);
		expect(
			BugsnagEndpointInputSchemas.projectsList.safeParse({
				organization_id: 'organization-1',
			}).success,
		).toBe(true);
		expect(
			BugsnagEndpointInputSchemas.collaboratorsGet.safeParse({
				organization_id: 'organization-1',
			}).success,
		).toBe(false);
	});

	/**
	 * The bulk-update operation vocabulary, pinned against what the API actually accepts.
	 *
	 * This test exists because the enum was wrong in two directions at once and both
	 * versions had twelve entries, so nothing about the count would have revealed it. Each
	 * name below was confirmed by a PATCH against a **non-existent error id** - a name the
	 * API rejects answers `"Operation is not included in the list"`, and anything else
	 * means the name is accepted.
	 */
	describe('the bulk update operation vocabulary', () => {
		const VALID = [
			'fix',
			'open',
			'ignore',
			'snooze',
			'discard',
			'undiscard',
			'delete',
			'override_severity',
			'assign',
			'create_issue',
			'link_issue',
			'unlink_issue',
		];

		/** Rejected by name when probed live, so they must not be accepted here. */
		const REJECTED_BY_THE_API = ['unassign', 'unsnooze', 'reopen', 'archive'];

		const parse = (operation: string, extra: Record<string, unknown> = {}) =>
			BugsnagEndpointInputSchemas.errorsBulkUpdate.safeParse({
				project_id: 'project-1',
				error_ids: ['error-1'],
				operation,
				...extra,
			});

		it.each(VALID)('accepts %s', (operation) => {
			// The companion fields each conditional operation needs, so this test measures
			// the enum rather than the refinements.
			const extra: Record<string, unknown> =
				{
					snooze: { reopen_rules: { type: 'time', value: '7d' } },
					link_issue: { issue_url: 'https://example.com/issue/1' },
					override_severity: { severity: 'info' },
					assign: { assigned_collaborator_id: 'collaborator-1' },
				}[operation] ?? {};

			expect(parse(operation, extra).success).toBe(true);
		});

		it.each(REJECTED_BY_THE_API)(
			'rejects %s, which the API rejects too',
			(operation) => {
				expect(parse(operation).success).toBe(false);
			},
		);

		it('accepts exactly the twelve live-verified operations and no others', () => {
			// Guards against the enum drifting by addition as well as by substitution.
			expect(VALID).toHaveLength(12);
			for (const operation of [...VALID, ...REJECTED_BY_THE_API]) {
				expect(
					parse(operation, {
						reopen_rules: { type: 'time' },
						issue_url: 'https://example.com/i/1',
						severity: 'info',
						assigned_collaborator_id: 'collaborator-1',
					}).success,
				).toBe(VALID.includes(operation));
			}
		});
	});

	/**
	 * Several operations need a companion field, and the API reports each separately. The
	 * refinements catch them locally, which matters more here than usual: the request
	 * applies to every id in the batch.
	 */
	describe('bulk update conditional requirements', () => {
		const base = { project_id: 'project-1', error_ids: ['error-1'] };
		const parse = (extra: Record<string, unknown>) =>
			BugsnagEndpointInputSchemas.errorsBulkUpdate.safeParse({
				...base,
				...extra,
			});

		it('requires reopen_rules for snooze', () => {
			expect(parse({ operation: 'snooze' }).success).toBe(false);
			expect(
				parse({ operation: 'snooze', reopen_rules: { type: 'time' } }).success,
			).toBe(true);
		});

		it('requires issue_url for link_issue', () => {
			expect(parse({ operation: 'link_issue' }).success).toBe(false);
			expect(
				parse({
					operation: 'link_issue',
					issue_url: 'https://example.com/issue/1',
				}).success,
			).toBe(true);
		});

		it('requires severity for override_severity', () => {
			expect(parse({ operation: 'override_severity' }).success).toBe(false);
			expect(
				parse({ operation: 'override_severity', severity: 'info' }).success,
			).toBe(true);
		});

		it('requires an assignee for assign, of either kind', () => {
			expect(parse({ operation: 'assign' }).success).toBe(false);
			expect(
				parse({
					operation: 'assign',
					assigned_collaborator_id: 'collaborator-1',
				}).success,
			).toBe(true);
			expect(
				parse({ operation: 'assign', assigned_team_id: 'team-1' }).success,
			).toBe(true);
		});

		it('leaves unconditional operations alone', () => {
			for (const operation of ['fix', 'open', 'ignore', 'discard', 'delete']) {
				expect(parse({ operation }).success).toBe(true);
			}
		});

		it('rejects an empty error_ids list whatever the operation', () => {
			// An empty batch with a destructive operation is the worst request to send by
			// accident, so it is refused rather than sent and ignored.
			expect(
				BugsnagEndpointInputSchemas.errorsBulkUpdate.safeParse({
					project_id: 'project-1',
					error_ids: [],
					operation: 'delete',
				}).success,
			).toBe(false);
		});
	});

	/**
	 * `type` selects the notifier platform and BugSnag uses it to decide how errors
	 * are grouped, so there is no sensible default and it is required.
	 */
	it('requires a name and type when creating a project', () => {
		const create = BugsnagEndpointInputSchemas.projectsCreate;

		expect(
			create.safeParse({ organization_id: 'organization-1', name: 'Example' })
				.success,
		).toBe(false);
		expect(
			create.safeParse({
				organization_id: 'organization-1',
				name: 'Example',
				type: 'android',
			}).success,
		).toBe(true);
		expect(
			create.safeParse({
				organization_id: 'organization-1',
				name: '',
				type: 'android',
			}).success,
		).toBe(false);
	});
});

/* -------------------------------------------------------------------------- */
/*                        Response shapes that stay remote                    */
/* -------------------------------------------------------------------------- */

/**
 * Resolves a schema back to its exported name.
 *
 * Needed because a zod schema carries no name of its own, and the coverage check compares
 * the table against the module's actual exports rather than against a hand-written count.
 */
const schemaName = (schema: unknown): string =>
	Object.entries(responses).find(([, value]) => value === schema)?.[0] ??
	'UNKNOWN_SCHEMA';

describe('response schemas match the live responses', () => {
	/**
	 * Field names enumerated from live responses on 2026-08-14, for the families that
	 * are returned but not mirrored.
	 *
	 * The `verified: false` entries are the honest part: those shapes could not be
	 * observed, either because the recon account held no such record or because
	 * producing one would have been destructive. They are asserted only for their key,
	 * because asserting documented field names would be asserting a guess - which is
	 * exactly how `target_stability` was wrong for two rounds.
	 */
	const CAPTURED = [
		{
			name: 'error',
			schema: BugsnagError,
			verified: true,
			keys: [
				'id',
				'project_id',
				'error_class',
				'message',
				'status',
				'events',
				'users',
				'first_seen',
				'last_seen',
				'assigned_collaborator_id',
				'grouping_reason',
			],
		},
		{
			name: 'event',
			schema: BugsnagEvent,
			verified: true,
			keys: [
				'id',
				'url',
				'project_url',
				'is_full_report',
				'error_id',
				'received_at',
				'exceptions',
				'severity',
				'context',
				'unhandled',
				'app',
			],
		},
		{
			// The wide form of the same record, present only with full reports. Every
			// field here is personal data or application-supplied context.
			name: 'event (full report)',
			schema: BugsnagEvent,
			verified: true,
			keys: [
				'threads',
				'metaData',
				'request',
				'device',
				'user',
				'breadcrumbs',
				'feature_flags',
				'correlation',
				'session',
			],
		},
		{
			name: 'event field',
			schema: BugsnagEventField,
			verified: true,
			keys: [
				'display_id',
				'custom',
				'pivot_options',
				'path',
				'filter_options',
				'reindex_in_progress',
				'reindex_percentage',
			],
		},
		{
			name: 'pivot',
			schema: BugsnagPivot,
			verified: true,
			keys: ['event_field_display_id', 'name', 'cardinality'],
		},
		{
			name: 'pivot value',
			schema: BugsnagPivotValue,
			verified: true,
			keys: [
				'event_field_value',
				'events',
				'proportion',
				'first_seen',
				'last_seen',
				'fields',
				'aggregates',
			],
		},
		{
			name: 'trend bucket',
			schema: BugsnagTrendBucket,
			verified: true,
			keys: ['from', 'to', 'events_count'],
		},
		{
			name: 'release',
			schema: BugsnagRelease,
			verified: true,
			keys: [
				'id',
				'project_id',
				'release_group_id',
				'release_time',
				'app_version',
				'errors_introduced_count',
				'total_sessions_count',
			],
		},
		{
			name: 'release group',
			schema: BugsnagReleaseGroup,
			verified: true,
			keys: [
				'id',
				'project_id',
				'release_stage_name',
				'app_version',
				'first_released_at',
				'releases_count',
			],
		},
		{
			name: 'saved search',
			schema: BugsnagSavedSearch,
			verified: true,
			keys: [
				'id',
				'user_id',
				'project_id',
				'name',
				'filters',
				'shared',
				'project_default',
				'open_error_inclusion',
				'advanced_filters',
			],
		},
		{
			name: 'saved search usage summary',
			schema: BugsnagSavedSearchUsageSummary,
			verified: true,
			keys: [
				'project_notifications_count',
				'current_user_using_for_email_notification',
				'collaborator_email_notifications_count',
				'performance_monitor_count',
			],
		},
		{
			name: 'supported integration',
			schema: BugsnagSupportedIntegration,
			verified: true,
			keys: ['key', 'name', 'url', 'type', 'description', 'fields', 'icon_url'],
		},
		{
			name: 'project access',
			schema: BugsnagProjectAccess,
			verified: true,
			keys: [
				'project_summary',
				'team_count',
				'is_admin',
				'project_role',
				'individual_project_role',
				'team_project_role',
			],
		},
		{
			name: 'project access count',
			schema: BugsnagProjectAccessCount,
			verified: true,
			keys: ['collaborator_id', 'project_count', 'is_admin'],
		},
		{
			name: 'network endpoint grouping',
			schema: BugsnagNetworkEndpointGrouping,
			verified: true,
			keys: ['project_id', 'endpoints'],
		},
		// Not observed: no integration is configured on the account, and configuring one
		// requires real third-party credentials.
		{
			name: 'configured integration',
			schema: BugsnagConfiguredIntegration,
			verified: false,
			keys: [],
		},
		// Not observed: the account has no feature flags, so the list returned empty.
		{
			name: 'feature flag',
			schema: BugsnagFeatureFlag,
			verified: false,
			keys: [],
		},
		{
			name: 'feature flag summary',
			schema: BugsnagFeatureFlagSummary,
			verified: false,
			keys: [],
		},
		// Not observed: creating one would export or destroy real event data.
		{
			name: 'event data request',
			schema: BugsnagEventDataRequest,
			verified: false,
			keys: [],
		},
		{
			name: 'event data deletion',
			schema: BugsnagEventDataDeletion,
			verified: false,
			keys: [],
		},
		// Not observed: testing an integration needs real third-party credentials, so the
		// route was confirmed by its validation response rather than by a success. This
		// entry was missing until the coverage check started comparing the table against
		// the module's exports instead of against a hand-written count - which is the
		// whole reason for that change.
		{
			name: 'integration test result',
			schema: BugsnagIntegrationTestResult,
			verified: false,
			keys: [],
		},
	] as const;

	it('covers every response family the plugin returns', () => {
		// Guards the table itself, by comparing it against what the module actually
		// exports rather than against a number written by hand.
		//
		// An earlier version asserted `toHaveLength(20)`. That would have passed
		// unchanged after a new response family was added to `schema/responses.ts` and
		// forgotten here - the count is only a proxy for coverage, and the thing being
		// guarded is coverage.
		const exportedSchemas = Object.entries(responses)
			.filter(
				([name, value]) =>
					// Zod schemas only: the module also exports the inferred types, which
					// disappear at runtime, and helpers that are not response families.
					name.startsWith('Bugsnag') &&
					typeof value === 'object' &&
					value !== null &&
					'safeParse' in value,
			)
			.map(([name]) => name);

		// Not a response family in its own right: the bulk-update result is the response
		// of one operation rather than a record shape, and `BugsnagProjectSummary` is a
		// nested stub inside `BugsnagProjectAccess` rather than a top-level response.
		const NOT_A_RESPONSE_FAMILY = [
			'BugsnagBulkUpdateResult',
			'BugsnagProjectSummary',
		];

		const expected = exportedSchemas
			.filter((name) => !NOT_A_RESPONSE_FAMILY.includes(name))
			.sort();

		// `BugsnagEvent` appears twice in the table - once for the narrow list shape and
		// once for the wide full-report shape - so the comparison is on the set.
		const covered = [
			...new Set(CAPTURED.map(({ schema }) => schemaName(schema))),
		].sort();

		expect(covered).toEqual(expected);

		// And the exclusions must still exist, so a renamed export cannot leave a dead
		// entry silently widening the check.
		for (const name of NOT_A_RESPONSE_FAMILY) {
			expect(exportedSchemas).toContain(name);
		}
	});

	for (const { name, schema, keys, verified } of CAPTURED) {
		if (!verified) continue;
		it(`declares every captured ${name} field`, () => {
			const declared = Object.keys(schema.shape);

			expect(keys.length).toBeGreaterThan(0);
			for (const key of keys) {
				expect(declared).toContain(key);
			}
		});
	}

	/**
	 * Every response shape is `.loose()` with only its key required, for the same reason
	 * the entities are: BugSnag omits fields by plan and by feature, and a rejected row
	 * is a lost row.
	 */
	it.each([
		['error', BugsnagError, { id: 'error-1' }],
		['event', BugsnagEvent, { id: 'event-1' }],
		['event field', BugsnagEventField, { display_id: 'metaData.x' }],
		['pivot', BugsnagPivot, { event_field_display_id: 'error' }],
		['release', BugsnagRelease, { id: 'release-1' }],
		['release group', BugsnagReleaseGroup, { id: 'release-group-1' }],
		['saved search', BugsnagSavedSearch, { id: 'saved-search-1' }],
		['supported integration', BugsnagSupportedIntegration, { key: 'slack' }],
		['configured integration', BugsnagConfiguredIntegration, { id: 'ci-1' }],
		['feature flag', BugsnagFeatureFlag, { name: 'flag' }],
		['event data request', BugsnagEventDataRequest, { id: 'r-1' }],
		['event data deletion', BugsnagEventDataDeletion, { id: 'd-1' }],
	])('parses a %s carrying only its key', (_name, schema, minimal) => {
		expect(schema.safeParse(minimal).success).toBe(true);
	});

	it('keeps a field a response schema does not declare', () => {
		const parsed = BugsnagError.parse({
			id: 'error-1',
			a_field_added_later: 'kept',
		});

		expect(parsed).toMatchObject({ a_field_added_later: 'kept' });
	});

	/**
	 * A pivot has no `id`. Asserted because addressing one by `id` or by `name` is what
	 * mis-mapped the pivot values path during recon: the human-readable name returned a
	 * resource-missing 404, which reads as a missing record rather than a wrong key.
	 */
	it('identifies a pivot by its event field display id, not an id', () => {
		const declared = Object.keys(BugsnagPivot.shape);

		expect(declared).toContain('event_field_display_id');
		expect(declared).not.toContain('id');
		expect(BugsnagPivot.safeParse({ name: 'Errors' }).success).toBe(false);
	});

	/**
	 * A team record tells the whole membership story it can: two counts, no member list.
	 * Asserted so the mirror is never assumed to answer "who is on this team".
	 */
	it('gives a team counts rather than a member list', () => {
		const declared = Object.keys(BugsnagTeamEntity.shape);

		expect(declared).toContain('collaborator_count');
		expect(declared).not.toContain('collaborators');
		expect(declared).not.toContain('collaborator_ids');
	});

	/**
	 * The bulk update result is deliberately minimal. The catalog records that the live
	 * API returns only the operation name rather than the per-error results its own
	 * specification documents, so modelling per-error results would promise data that
	 * never arrives.
	 */
	it('models the bulk update result as the API actually answers it', () => {
		const declared = Object.keys(BugsnagBulkUpdateResult.shape);

		expect(declared).toEqual(['operation']);
		expect(
			BugsnagBulkUpdateResult.safeParse({ operation: 'fix' }).success,
		).toBe(true);
	});
});
