/**
 * Asserts every key captured live is declared in `schema/database.ts`.
 *
 * Every entity is `.loose()`, so a response with an undeclared key parses
 * cleanly - `safeParse` alone would never notice a field the schema forgot.
 * The key sets below are compared by name, captured live on 2026-08-16 from
 * a real account. No values from that account appear here - every fixture in
 * this package is fictional.
 */

import { CircleCISchema } from './schema';
import {
	CircleCIContextEntity,
	CircleCIContextEnvVarEntity,
	CircleCIContextRestrictionEntity,
	CircleCIGroupEntity,
	CircleCIOrbAllowlistEntryEntity,
	CircleCIProjectEntity,
	CircleCIProjectEnvVarEntity,
	CircleCIScheduleEntity,
	CircleCIVcsInfo,
} from './schema/database';

const PROJECT_KEYS = [
	'slug',
	'organization_name',
	'organization_id',
	'name',
	'id',
	'organization_slug',
	'vcs_info',
];
const VCS_INFO_KEYS = ['vcs_url', 'default_branch', 'provider'];
const CONTEXT_KEYS = ['id', 'name', 'created_at'];
const CONTEXT_ENV_VAR_KEYS = [
	'variable',
	'context_id',
	'created_at',
	'updated_at',
	'truncated_value',
];
const CONTEXT_RESTRICTION_KEYS = [
	'context_id',
	'id',
	'name',
	'restriction_type',
	'restriction_value',
	'project_id',
];
const PROJECT_ENV_VAR_KEYS = ['name', 'value', 'created-at', 'created_at'];
/** kebab-case, confirmed live - the one entity in this plugin that is not snake_case. */
const SCHEDULE_KEYS = [
	'description',
	'updated-at',
	'name',
	'id',
	'project-slug',
	'created-at',
	'parameters',
	'actor',
	'timetable',
];
/** Only `{id, message}` confirmed on creation; `name`/`prefix`/`auth` are declared from the request body per the spec. */
const ORB_ALLOWLIST_KEYS = ['id'];

describe('CircleCI schema', () => {
	it('declares a semver version', () => {
		expect(CircleCISchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('mirrors exactly the entities this plugin persists', () => {
		expect(Object.keys(CircleCISchema.entities).sort()).toEqual(
			[
				'contexts',
				'groups',
				'orbAllowlistEntries',
				'pipelineDefinitions',
				'projectEnvVars',
				'projects',
				'schedules',
			].sort(),
		);
	});

	describe('every live-captured key is declared', () => {
		const cases: [string, { shape: Record<string, unknown> }, string[]][] = [
			['project', CircleCIProjectEntity, PROJECT_KEYS],
			['vcs info', CircleCIVcsInfo, VCS_INFO_KEYS],
			['context', CircleCIContextEntity, CONTEXT_KEYS],
			['context env var', CircleCIContextEnvVarEntity, CONTEXT_ENV_VAR_KEYS],
			[
				'context restriction',
				CircleCIContextRestrictionEntity,
				CONTEXT_RESTRICTION_KEYS,
			],
			['project env var', CircleCIProjectEnvVarEntity, PROJECT_ENV_VAR_KEYS],
			['schedule', CircleCIScheduleEntity, SCHEDULE_KEYS],
			[
				'orb allow-list entry',
				CircleCIOrbAllowlistEntryEntity,
				ORB_ALLOWLIST_KEYS,
			],
		];

		for (const [label, entity, capturedKeys] of cases) {
			it(`declares every ${label} key`, () => {
				const declared = Object.keys(entity.shape);
				const undeclared = capturedKeys.filter((k) => !declared.includes(k));
				expect(undeclared).toEqual([]);
			});
		}
	});

	it('catches an undeclared key, so the check above is not vacuous', () => {
		const declared = Object.keys(CircleCIGroupEntity.shape);
		expect(declared).not.toContain('aKeyNobodyDeclared');
		expect(
			CircleCIGroupEntity.safeParse({ id: 'group-1', aKeyNobodyDeclared: 1 })
				.success,
		).toBe(true);
	});

	it('requires only the primary key', () => {
		expect(CircleCIProjectEntity.safeParse({ id: 'project-1' }).success).toBe(
			true,
		);
		expect(CircleCIContextEntity.safeParse({ id: 'context-1' }).success).toBe(
			true,
		);
		expect(CircleCIGroupEntity.safeParse({ id: 'group-1' }).success).toBe(true);
		expect(CircleCIScheduleEntity.safeParse({ id: 'schedule-1' }).success).toBe(
			true,
		);
		expect(
			CircleCIOrbAllowlistEntryEntity.safeParse({ id: 'entry-1' }).success,
		).toBe(true);
		expect(
			CircleCIProjectEnvVarEntity.safeParse({ name: 'MY_VAR' }).success,
		).toBe(true);
		expect(
			CircleCIContextEnvVarEntity.safeParse({ variable: 'MY_VAR' }).success,
		).toBe(true);
	});

	it('rejects a record with no primary key at all', () => {
		expect(
			CircleCIProjectEntity.safeParse({ name: 'no id here' }).success,
		).toBe(false);
	});

	it('accepts null for fields CircleCI omits rather than always populates', () => {
		const parsed = CircleCIContextEntity.safeParse({
			id: 'context-1',
			environment_variables: null,
			restrictions: null,
		});
		expect(parsed.success).toBe(true);
	});

	it("keys a context restriction by its own id even though the default row's id equals the org id", () => {
		// Confirmed live: creating a context auto-creates a restriction whose
		// `id` field equals the org's own id, not a restriction-specific one.
		// The schema still declares `id` as the primary key - this test pins
		// that the shape parses, not that the value is unique in any way the
		// schema could check.
		const parsed = CircleCIContextRestrictionEntity.parse({
			id: 'org-1',
			restriction_value: 'org-1',
			restriction_type: 'group',
		});
		expect(parsed.id).toBe('org-1');
	});
});
