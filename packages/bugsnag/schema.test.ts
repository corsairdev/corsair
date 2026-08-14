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
} from './schema/database';

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
} as const;

const ENTITIES = {
	organizations: BugsnagOrganizationEntity,
	projects: BugsnagProjectEntity,
	collaborators: BugsnagCollaboratorEntity,
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
		expect(Object.keys(ENTITIES)).toHaveLength(3);
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
	] as const;

	it('covers all three entities', () => {
		expect(KEY_ONLY).toHaveLength(3);
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

		expect(names).toHaveLength(3);
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
