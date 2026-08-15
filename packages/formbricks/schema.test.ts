/**
 * Covers schema fidelity.
 *
 * The key lists below are field names **enumerated from live responses** on a Formbricks Cloud
 * workspace on 2026-08-15, not from documentation. That distinction is the whole point of this file:
 * on a previous integration a nested shape was invented from docs and passed both the type checker
 * and its own test, because the fixture matched the invention and the object was `.loose()`. Only a
 * real response caught it.
 *
 * Where a shape could not be observed it is marked `verified: false` with the reason, rather than
 * asserted as though it had been seen.
 *
 * All values here are fictional: placeholder ids and `@example.com` addresses.
 */
import { FormbricksEndpointInputSchemas } from './endpoints/types';
import { FormbricksSchema } from './schema';
import {
	FormbricksActionClassEntity,
	FormbricksContactAttributeKeyEntity,
	FormbricksSurveyEntity,
	FormbricksTeamEntity,
	FormbricksWebhookEntity,
} from './schema/database';
import * as responses from './schema/responses';
import {
	DeleteResultSchema,
	FormbricksBulkUploadResult,
	FormbricksClientEnvironment,
	FormbricksClientUserState,
	FormbricksContact,
	FormbricksContactAttribute,
	FormbricksDisplay,
	FormbricksHealth,
	FormbricksListMeta,
	FormbricksManagementMe,
	FormbricksMe,
	FormbricksResponse,
	FormbricksRole,
	FormbricksUploadResult,
	FormbricksWorkspaceTeam,
} from './schema/responses';

/** Field names observed on live responses, per mirrored entity. */
const CAPTURED_KEYS = {
	surveys: [
		'id',
		'createdAt',
		'updatedAt',
		'name',
		'type',
		'workspaceId',
		'createdBy',
		'status',
		'welcomeCard',
		'questions',
		'blocks',
		'endings',
		'hiddenFields',
		'variables',
		'displayOption',
		'recontactDays',
		'displayLimit',
		'autoClose',
		'delay',
		'displayPercentage',
		'autoComplete',
		'publishOn',
		'closeOn',
		'archivedAt',
		'isVerifyEmailEnabled',
		'isSingleResponsePerEmailEnabled',
		'isBackButtonHidden',
		'isAutoProgressingEnabled',
		'isCaptureIpEnabled',
		'redirectUrl',
		'workspaceOverwrites',
		'styling',
		'surveyClosedMessage',
		'singleUse',
		'pin',
		'showLanguageSwitch',
		'recaptcha',
		'metadata',
		'customHeadScripts',
		'customHeadScriptsMode',
		'languages',
		'triggers',
		'segment',
		'followUps',
		'slug',
		'projectOverwrites',
	],
	actionClasses: [
		'id',
		'createdAt',
		'updatedAt',
		'name',
		'description',
		'type',
		'key',
		'noCodeConfig',
		'workspaceId',
	],
	webhooks: [
		'id',
		'name',
		'createdAt',
		'updatedAt',
		'url',
		'source',
		'workspaceId',
		'triggers',
		'surveyIds',
		// Returned only on a create response. A credential - see the mirroring test below.
		'secret',
	],
	contactAttributeKeys: [
		'id',
		'createdAt',
		'updatedAt',
		'isUnique',
		'key',
		'name',
		'description',
		'type',
		'dataType',
		'workspaceId',
	],
	teams: ['id', 'createdAt', 'updatedAt', 'name', 'organizationId'],
} as const;

const ENTITIES = {
	surveys: FormbricksSurveyEntity,
	actionClasses: FormbricksActionClassEntity,
	webhooks: FormbricksWebhookEntity,
	contactAttributeKeys: FormbricksContactAttributeKeyEntity,
	teams: FormbricksTeamEntity,
} as const;

describe('captured fields are declared', () => {
	/**
	 * Guards the guard: if the two tables diverge the loop below would quietly stop covering an
	 * entity, so the pairing is asserted first.
	 */
	it('covers every registered entity', () => {
		expect(Object.keys(CAPTURED_KEYS).sort()).toEqual(
			Object.keys(ENTITIES).sort(),
		);
		expect(Object.keys(ENTITIES)).toHaveLength(5);
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
		// Surveys carry 46 live fields; a partial declaration would drop data silently.
		expect(CAPTURED_KEYS.surveys).toHaveLength(46);
		expect(
			Object.keys(FormbricksSurveyEntity.shape).length,
		).toBeGreaterThanOrEqual(46);
	});
});

describe('only the primary key is required', () => {
	/**
	 * Formbricks nulls or omits fields depending on survey type, plan and enabled features, so a
	 * record carrying nothing but its key has to parse. A stricter schema rejects valid rows, and the
	 * persistence layer skips anything that fails - so a rejected row is a lost row.
	 */
	it('covers every registered entity', () => {
		expect(Object.keys(ENTITIES)).toHaveLength(5);
	});

	for (const [name, entity] of Object.entries(ENTITIES)) {
		it(`parses a ${name} record carrying only its id`, () => {
			expect(entity.safeParse({ id: `${name}-1` }).success).toBe(true);
		});

		it(`rejects a ${name} record with no id`, () => {
			expect(entity.safeParse({ name: 'no id here' }).success).toBe(false);
		});
	}

	it('accepts null in place of any non-key field', () => {
		const parsed = FormbricksSurveyEntity.safeParse({
			id: 'survey-1',
			name: null,
			status: null,
			questions: null,
			autoClose: null,
		});
		expect(parsed.success).toBe(true);
	});
});

describe('entities tolerate unrecognised fields', () => {
	it('keeps a field the schema does not declare', () => {
		const parsed = FormbricksSurveyEntity.parse({
			id: 'survey-1',
			a_field_added_later: 'kept',
		});
		expect(parsed).toMatchObject({ a_field_added_later: 'kept' });
	});
});

describe('the schema registry', () => {
	it('registers configuration and nothing collected from respondents', () => {
		const names = Object.keys(FormbricksSchema.entities);

		expect(names).toHaveLength(5);
		// Respondent data. Never mirrored - see schema/responses.ts.
		expect(names).not.toContain('responses');
		expect(names).not.toContain('contacts');
		expect(names).not.toContain('contactAttributes');
		expect(names).not.toContain('displays');
	});

	/**
	 * The distinction that is easiest to get wrong in this API: attribute *keys* are configuration
	 * and are mirrored, attribute *values* are personal data and are not.
	 */
	it('mirrors attribute keys but not attribute values', () => {
		const names = Object.keys(FormbricksSchema.entities);
		expect(names).toContain('contactAttributeKeys');
		expect(names).not.toContain('contactAttributes');
	});
});

describe('response schemas match the live responses', () => {
	/**
	 * Resolves a schema back to its exported name, since a zod schema carries none of its own. Used so
	 * the coverage check can compare the table against the module's actual exports rather than a
	 * hand-written count - a magic number passes forever after someone adds a family and forgets the
	 * table.
	 */
	const schemaName = (schema: unknown): string =>
		Object.entries(responses).find(([, value]) => value === schema)?.[0] ??
		'UNKNOWN_SCHEMA';

	const CAPTURED = [
		{
			name: 'response',
			schema: FormbricksResponse,
			verified: true,
			keys: [
				'id',
				'createdAt',
				'updatedAt',
				'surveyId',
				'finished',
				'endingId',
				'data',
				'meta',
				'ttc',
				'variables',
				'contactAttributes',
				'singleUseId',
				'language',
				'displayId',
				'contact',
				'tags',
			],
		},
		{
			name: 'contact',
			schema: FormbricksContact,
			verified: true,
			// Union of both routes: the create returns `attributes`, the reads return `updatedAt`, and
			// neither returns the other. `updatedAt` was missing until a live re-check against the read
			// route caught it - the original capture only looked at a create.
			keys: ['id', 'createdAt', 'updatedAt', 'workspaceId', 'attributes'],
		},
		{
			name: 'contact attribute',
			schema: FormbricksContactAttribute,
			verified: true,
			keys: [
				'id',
				'createdAt',
				'updatedAt',
				'attributeKeyId',
				'contactId',
				'value',
				'valueNumber',
				'valueDate',
			],
		},
		{
			name: 'client environment',
			schema: FormbricksClientEnvironment,
			verified: true,
			keys: ['data', 'expiresAt'],
		},
		{
			name: 'me',
			schema: FormbricksMe,
			verified: true,
			keys: [
				'organizationId',
				'workspacePermissions',
				'environmentPermissions',
				'organizationAccess',
			],
		},
		{
			name: 'health',
			schema: FormbricksHealth,
			verified: true,
			keys: ['main_database', 'cache_database'],
		},
		{
			name: 'list meta',
			schema: FormbricksListMeta,
			verified: true,
			keys: ['total', 'limit', 'offset'],
		},
		// Observed once the survey was set to `inProgress` - a `draft` survey answers
		// `403 "Survey is not accepting submissions"`, which is what made the first attempt conclude
		// respondent state was unreachable. Three fields and no timestamps.
		{
			name: 'display',
			schema: FormbricksDisplay,
			verified: true,
			keys: ['id', 'contactId', 'surveyId'],
		},
		// Observed. The earlier note said the v1 me route rejects an organization-scoped key, which is
		// true, and then concluded the shape was unobservable - which it was not: the workspace-scoped
		// key used everywhere else reads it fine.
		{
			name: 'management me',
			schema: FormbricksManagementMe,
			verified: true,
			keys: [
				'id',
				'type',
				'createdAt',
				'updatedAt',
				'appSetupCompleted',
				'workspace',
				'project',
			],
		},
		// Observed after seeding the join. The earlier note blamed an empty array on the join being
		// created by an unexposed operation; `POST organizations/{id}/workspace-teams` and
		// `POST organizations/{id}/teams` both exist, they are simply absent from the catalog.
		{
			name: 'workspace team',
			schema: FormbricksWorkspaceTeam,
			verified: true,
			keys: [
				'createdAt',
				'updatedAt',
				'workspaceId',
				'teamId',
				'permission',
				'projectId',
			],
		},
		// Observed. It is an S3 presigned POST grant, not the signed-PUT exchange assumed earlier -
		// and `presignedFields` carries the signature, so it is a credential.
		{
			name: 'upload result',
			schema: FormbricksUploadResult,
			verified: true,
			keys: ['signedUrl', 'presignedFields', 'fileUrl'],
		},
		// Observed on both versions. Respondent state, not a contact record - which is why the three
		// operations sharing this route no longer declare a contact shape.
		{
			name: 'client user state',
			schema: FormbricksClientUserState,
			verified: true,
			keys: ['state'],
		},
		// Observed: `{status, message}`, never the uploaded contacts.
		{
			name: 'bulk upload result',
			schema: FormbricksBulkUploadResult,
			verified: true,
			keys: ['status', 'message'],
		},
	] as const;

	it('covers every response family the module exports', () => {
		// Compared against the exports rather than a count, so a family added later cannot go
		// unchecked.
		const exported = Object.entries(responses)
			.filter(
				([name, value]) =>
					name.startsWith('Formbricks') &&
					typeof value === 'object' &&
					value !== null &&
					'safeParse' in value,
			)
			.map(([name]) => name);

		// `FormbricksRole` is a bare string schema, not a record family, and `DeleteResultSchema` is
		// the plugin's own result shape rather than one the API returns.
		const NOT_A_RESPONSE_FAMILY = ['FormbricksRole'];

		const expected = exported
			.filter((n) => !NOT_A_RESPONSE_FAMILY.includes(n))
			.sort();
		const covered = [
			...new Set(CAPTURED.map(({ schema }) => schemaName(schema))),
		].sort();

		expect(covered).toEqual(expected);
		for (const name of NOT_A_RESPONSE_FAMILY) expect(exported).toContain(name);
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

	it.each([
		['response', FormbricksResponse, { id: 'response-1' }],
		['contact', FormbricksContact, { id: 'contact-1' }],
		['contact attribute', FormbricksContactAttribute, { id: 'attr-1' }],
		['display', FormbricksDisplay, { id: 'display-1' }],
		['management me', FormbricksManagementMe, { id: 'user-1' }],
	])('parses a %s carrying only its key', (_name, schema, minimal) => {
		expect(schema.safeParse(minimal).success).toBe(true);
	});

	/**
	 * `roles` returns **bare strings**, not objects: `["owner","manager","member","billing"]`.
	 *
	 * Asserted because an earlier reading of the recon output reported this endpoint as having "6
	 * fields" - the reporter had printed `'string'.length`. A plausible number from a broken
	 * measurement, and exactly the kind of thing that turns into an invented object schema.
	 */
	it('models a role as a string rather than an object', () => {
		expect(FormbricksRole.safeParse('owner').success).toBe(true);
		expect(FormbricksRole.safeParse({ name: 'owner' }).success).toBe(false);
	});

	/**
	 * Health is the one snake_case shape in an otherwise camelCase API. Declared as observed rather
	 * than normalised - renaming a field is how a plugin starts describing something other than its
	 * provider.
	 */
	it('keeps the health field names as the API sends them', () => {
		const declared = Object.keys(FormbricksHealth.shape);
		expect(declared).toContain('main_database');
		expect(declared).not.toContain('mainDatabase');
	});

	/**
	 * A delete reports `already_absent`, so a caller can tell "I removed it" from "it was already
	 * gone" - which is what a replayed delete looks like.
	 */
	it('reports whether a delete found anything to remove', () => {
		expect(
			DeleteResultSchema.safeParse({
				success: true,
				id: 'x',
				already_absent: false,
			}).success,
		).toBe(true);
		// The flag is required: omitting it would let a caller assume a removal happened.
		expect(
			DeleteResultSchema.safeParse({ success: true, id: 'x' }).success,
		).toBe(false);
	});
});

describe('input validation', () => {
	/**
	 * `limit` is bounded client-side. v2 defaults it to 50 and no ceiling was observed, so an
	 * unbounded value would let one call pull an arbitrarily large page of respondent data.
	 */
	/** 250 is the ceiling the catalog documents. The API enforces none of its own. */
	it('bounds limit at 250 and rejects a negative offset', () => {
		const list = FormbricksEndpointInputSchemas.surveysList;

		expect(list.safeParse({ limit: 250 }).success).toBe(true);
		expect(list.safeParse({ limit: 251 }).success).toBe(false);
		expect(list.safeParse({ limit: 0 }).success).toBe(false);
		expect(list.safeParse({ offset: 0 }).success).toBe(true);
		expect(list.safeParse({ offset: -1 }).success).toBe(false);
	});

	/**
	 * `skip` is not a caller-facing name on any operation. The caller says `offset` everywhere and
	 * `listParams` translates it to whichever wire parameter the route honours - which is `skip` on all
	 * but one route. Accepting both names from the caller would make the pageable contract ambiguous.
	 */
	it('does not accept skip from the caller', () => {
		const parsed = FormbricksEndpointInputSchemas.surveysList.safeParse({
			skip: 10,
		} as never);
		// zod strips unknown keys by default rather than failing, so the assertion is that it does not
		// survive into the parsed value - it can never reach the query string.
		expect(parsed.success).toBe(true);
		expect(parsed.success && 'skip' in parsed.data).toBe(false);
	});

	/**
	 * The four lists whose routes ignore paging entirely accept **no** paging parameters.
	 *
	 * Verified by effect against the live API: three seeded rows, `?limit=1`, three rows back. An
	 * input field the provider discards is a promise this plugin cannot keep - a caller who sets
	 * `limit: 10` and receives every row has been misled by the plugin, not by Formbricks.
	 */
	it('omits paging parameters on the lists that cannot page', () => {
		for (const op of [
			'contactsList',
			'actionClassesList',
			'contactAttributesList',
		] as const) {
			const parsed = FormbricksEndpointInputSchemas[op].safeParse({
				limit: 10,
				offset: 5,
			} as never);
			expect(parsed.success).toBe(true);
			expect(parsed.success && 'limit' in parsed.data).toBe(false);
			expect(parsed.success && 'offset' in parsed.data).toBe(false);
		}
	});

	/**
	 * And the lists that *can* page still accept them, so the check above cannot pass by having
	 * stripped paging from everything.
	 */
	it('keeps paging parameters on the lists that can page', () => {
		for (const op of [
			'surveysList',
			'responsesList',
			'webhooksList',
			'contactAttributeKeysList',
		] as const) {
			const parsed = FormbricksEndpointInputSchemas[op].safeParse({
				limit: 10,
				offset: 5,
			});
			expect(parsed.success).toBe(true);
			expect(parsed.success && parsed.data.limit).toBe(10);
			expect(parsed.success && parsed.data.offset).toBe(5);
		}
	});

	it('requires workspaceId on the writes that need it', () => {
		expect(
			FormbricksEndpointInputSchemas.surveysCreate.safeParse({ name: 'x' })
				.success,
		).toBe(false);
		expect(
			FormbricksEndpointInputSchemas.surveysCreate.safeParse({
				workspaceId: 'workspace-1',
				name: 'x',
			}).success,
		).toBe(true);
	});

	/**
	 * `data` is required on a response update to work around a server bug: without it the API answers
	 * **500**, where every sibling endpoint answers 422. Requiring it turns the crash into a local
	 * validation error.
	 */
	it('requires data on a response update, because omitting it 500s upstream', () => {
		const update = FormbricksEndpointInputSchemas.responsesUpdate;

		expect(update.safeParse({ responseId: 'r1', finished: true }).success).toBe(
			false,
		);
		// An empty object satisfies it - the escape hatch for a caller who only wants `finished`.
		expect(
			update.safeParse({ responseId: 'r1', data: {}, finished: true }).success,
		).toBe(true);
	});

	/**
	 * `description` is required when creating an attribute key - a 422 without it, despite reading
	 * like documentation.
	 */
	it('requires description on an attribute key create', () => {
		const create = FormbricksEndpointInputSchemas.contactAttributeKeysCreate;

		expect(
			create.safeParse({ workspaceId: 'w', key: 'plan', name: 'Plan' }).success,
		).toBe(false);
		expect(
			create.safeParse({
				workspaceId: 'w',
				key: 'plan',
				name: 'Plan',
				description: 'the plan',
			}).success,
		).toBe(true);
	});

	/**
	 * A code action reports itself by `key`, so the pairing is enforced locally rather than leaving
	 * the API to reject it with an error that does not name the field.
	 */
	it('requires key for a code action class but not a noCode one', () => {
		const create = FormbricksEndpointInputSchemas.actionClassesCreate;

		expect(
			create.safeParse({ workspaceId: 'w', name: 'a', type: 'code' }).success,
		).toBe(false);
		expect(
			create.safeParse({ workspaceId: 'w', name: 'a', type: 'code', key: 'k' })
				.success,
		).toBe(true);
		expect(
			create.safeParse({ workspaceId: 'w', name: 'a', type: 'noCode' }).success,
		).toBe(true);
		// And an unknown type is refused rather than sent.
		expect(
			create.safeParse({ workspaceId: 'w', name: 'a', type: 'telepathy' })
				.success,
		).toBe(false);
	});

	/**
	 * The bulk upload's `attributes` is an array of `{attributeKey, value}`; the single create's is a
	 * plain object. Both asserted, because the asymmetry is the API's and a shared schema would break
	 * one of them.
	 */
	it('keeps the two attribute shapes distinct', () => {
		const bulk = FormbricksEndpointInputSchemas.contactsUploadBulk;

		expect(
			bulk.safeParse({
				workspaceId: 'w',
				contacts: [
					{
						attributes: [
							{ attributeKey: { key: 'email' }, value: 'a@example.com' },
						],
					},
				],
			}).success,
		).toBe(true);
		// The single-create shape is rejected here.
		expect(
			bulk.safeParse({
				workspaceId: 'w',
				contacts: [{ attributes: { email: 'a@example.com' } }],
			}).success,
		).toBe(false);
		// And an empty batch asks nothing.
		expect(bulk.safeParse({ workspaceId: 'w', contacts: [] }).success).toBe(
			false,
		);
	});

	/** `surveyIds` is required on a webhook create but may be empty, which means "all surveys". */
	it('requires surveyIds on a webhook create but allows it to be empty', () => {
		const create = FormbricksEndpointInputSchemas.webhooksCreate;
		const base = {
			workspaceId: 'w',
			name: 'n',
			url: 'https://example.com',
			source: 'user',
			triggers: ['responseCreated'],
		};

		expect(create.safeParse(base).success).toBe(false);
		expect(create.safeParse({ ...base, surveyIds: [] }).success).toBe(true);
		// But a trigger list must not be empty - a webhook that fires on nothing is a mistake.
		expect(
			create.safeParse({ ...base, triggers: [], surveyIds: [] }).success,
		).toBe(false);
	});

	it('rejects webhook urls that are not http or https', () => {
		const create = FormbricksEndpointInputSchemas.webhooksCreate;
		const update = FormbricksEndpointInputSchemas.webhooksUpdate;
		const base = {
			workspaceId: 'w',
			name: 'n',
			source: 'user' as const,
			triggers: ['responseCreated' as const],
			surveyIds: [] as string[],
		};

		expect(
			create.safeParse({ ...base, url: 'https://example.com/hook' }).success,
		).toBe(true);
		expect(
			create.safeParse({ ...base, url: 'http://example.com/hook' }).success,
		).toBe(true);
		expect(create.safeParse({ ...base, url: 'not-a-url' }).success).toBe(false);
		expect(
			create.safeParse({ ...base, url: 'javascript:alert(1)' }).success,
		).toBe(false);
		expect(
			create.safeParse({ ...base, url: 'ftp://example.com/hook' }).success,
		).toBe(false);

		expect(
			update.safeParse({
				...base,
				webhookId: 'wh-1',
				url: 'javascript:alert(1)',
			}).success,
		).toBe(false);
	});
});
