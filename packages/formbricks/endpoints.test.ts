/**
 * Covers every operation: the version and path it calls, what it writes to the local mirror, what
 * it evicts, and exactly what reaches the event log.
 *
 * Four sweeps make this hard to leave incomplete, and each exists because something slipped past a
 * narrower check on a previous integration:
 *
 * - **Coverage** asserts the operations exercised here are precisely the ones registered.
 * - **Privacy** runs every operation against a response poisoned with respondent data and a webhook
 *   secret, and asserts none of it reaches the event log. A per-operation assertion only covers the
 *   operations someone remembered.
 * - **Retry safety** asserts every name in the non-idempotent set is a registered operation, so an
 *   entry cannot outlive the endpoint it describes.
 * - **Error routing** asserts no handler claims a status-bearing error on the strength of its
 *   message.
 *
 * All ids and values are fictional.
 */
import { readFileSync } from 'node:fs';
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	Account,
	ActionClasses,
	ClientApi,
	Contacts,
	Organization,
	Responses,
	Storage,
	Surveys,
	Webhooks,
} from './endpoints';
import {
	FormbricksMirrorEvictionError,
	stripSecrets,
} from './endpoints/persist';
import { withQuery } from './endpoints/shared';
import { FormbricksEndpointInputSchemas } from './endpoints/types';
import {
	describeValidationFailure,
	errorHandlers,
	isNonIdempotent,
	isResourceAbsent,
	NON_IDEMPOTENT_OPERATIONS,
} from './error-handlers';
import { formbricksEndpointMeta } from './index';

// The event-log payload is asserted directly: it is the one place respondent data or a webhook
// secret could reach durable storage, so it is inspected rather than inferred.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const HOST = 'https://app.formbricks.com/api';
const WORKSPACE = 'workspace-1';
const ORG = 'organization-1';
const SURVEY = 'survey-1';
const RESPONSE = 'response-1';
const CONTACT = 'contact-1';
const KEY_ID = 'attribute-key-1';
const WEBHOOK = 'webhook-1';
const TEAM = 'team-1';

/** The number of operations registered. Declared once so the assertions cannot disagree. */
const EXPECTED_ENDPOINTS = 47;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

const makeStore = (): Store => ({
	upsertByEntityId: jest.fn(async () => undefined),
	deleteByEntityId: jest.fn(async () => true),
});

type Ctx = Parameters<typeof Surveys.list>[0];

function makeCtx() {
	const db = {
		surveys: makeStore(),
		actionClasses: makeStore(),
		webhooks: makeStore(),
		contactAttributeKeys: makeStore(),
		teams: makeStore(),
	};
	const ctx = { key: 'test-key', db } as unknown as Ctx;
	return { ctx, db };
}

let captured: { url: string; method: string; body?: string } | undefined;

/** The real `fetch`, restored after the suite so no stub leaks into another file. */
const originalFetch = global.fetch;

afterAll(() => {
	global.fetch = originalFetch;
});

/**
 * Answers every request with `payload`, wrapped in the `{ data }` envelope the API uses.
 *
 * The envelope is applied here rather than in each fixture because forgetting it would make every
 * assertion test the unwrapping rather than the endpoint.
 */
function mockFetch(
	payload: unknown,
	status = 200,
	opts: { raw?: boolean } = {},
) {
	captured = undefined;
	const body = opts.raw ? payload : { data: payload };
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as unknown as typeof global.fetch;
}

/* ------------------------------ canned records ---------------------------- */

const survey = {
	id: SURVEY,
	name: 'Example survey',
	workspaceId: WORKSPACE,
	status: 'inProgress',
};
const response = {
	id: RESPONSE,
	surveyId: SURVEY,
	finished: true,
	data: { q1: 'the respondent typed this' },
	meta: { url: 'https://example.com/page', country: 'GB' },
	contactAttributes: { email: 'respondent@example.com' },
};
const actionClass = {
	id: 'action-1',
	name: 'Example action',
	type: 'code',
	key: 'example_action',
};
const contact = {
	id: CONTACT,
	workspaceId: WORKSPACE,
	attributes: { email: 'respondent@example.com' },
};
const attributeKey = {
	id: KEY_ID,
	key: 'email',
	name: 'Email',
	workspaceId: WORKSPACE,
};
const contactAttribute = {
	id: 'attr-1',
	attributeKeyId: KEY_ID,
	contactId: CONTACT,
	value: 'respondent@example.com',
};
const webhook = {
	id: WEBHOOK,
	name: 'Example webhook',
	url: 'https://example.com/hook',
	source: 'user',
	workspaceId: WORKSPACE,
	triggers: ['responseCreated'],
	surveyIds: [],
	// Returned only on a create. A credential.
	secret: 'whsec_example_not_a_real_secret',
};
const team = { id: TEAM, name: 'Example team', organizationId: ORG };
const me = {
	organizationId: ORG,
	workspacePermissions: [{ workspaceId: WORKSPACE }],
};
const health = { main_database: true, cache_database: true };
/** The v1 environment payload: type, project and setup flag, which v2 does not return. */
const managementMe = {
	id: 'environment-1',
	type: 'production',
	appSetupCompleted: true,
	workspace: { id: WORKSPACE, name: 'Example workspace' },
	project: { id: 'project-1', name: 'Example project' },
};
const clientEnvironment = { data: {}, expiresAt: '2026-08-16T00:00:00.000Z' };
/**
 * What `POST client/{workspaceId}/user` answers on both versions - respondent **state**, not a
 * contact record. Three operations share this route and this shape.
 */
const clientUserState = {
	state: {
		data: {
			contactId: CONTACT,
			userId: 'user-1',
			segments: [],
			displays: [],
			responses: [],
			lastDisplayAt: null,
		},
		expiresAt: '2026-08-16T00:00:00.000Z',
	},
};
/** `{id, contactId, surveyId}`, and no timestamps. `contactId` is null when unlinked. */
const display = { id: 'display-1', contactId: null, surveyId: SURVEY };
/** The S3 presigned POST grant. `presignedFields` carries the signature - a credential. */
const uploadResult = {
	signedUrl: 'https://example.com/upload',
	presignedFields: {
		'Content-Type': 'image/png',
		key: 'workspace/logo.png',
		Policy: 'eyJleGFtcGxlIjoicG9saWN5In0=',
		'X-Amz-Signature': 'example-signature-not-a-real-credential',
	},
	fileUrl: 'https://example.com/files/logo.png',
};
/** A bulk upload answers `{status, message}` - never the uploaded contacts. */
const bulkResult = {
	status: 'success',
	message: 'Contacts bulk upload successful',
};

/** Every registered operation with the request it is expected to make. */
const OPERATIONS: Array<
	[
		op: string,
		method: string,
		path: string,
		run: (ctx: Ctx) => Promise<unknown>,
		payload: unknown,
	]
> = [
	/* -------------------------------- surveys ------------------------------- */
	[
		'surveys.list',
		'GET',
		'v1/management/surveys',
		(c) => Surveys.list(c, {}),
		[survey],
	],
	[
		'surveys.create',
		'POST',
		'v1/management/surveys',
		(c) =>
			Surveys.create(c, { workspaceId: WORKSPACE, name: 'Example survey' }),
		survey,
	],
	[
		'surveys.update',
		'PUT',
		`v1/management/surveys/${SURVEY}`,
		(c) => Surveys.update(c, { surveyId: SURVEY, name: 'Renamed' }),
		survey,
	],
	[
		'surveys.delete',
		'DELETE',
		`v1/management/surveys/${SURVEY}`,
		(c) => Surveys.remove(c, { surveyId: SURVEY }),
		survey,
	],

	/* ------------------------------- responses ------------------------------ */
	[
		'responses.list',
		'GET',
		'v1/management/responses',
		(c) => Responses.list(c, {}),
		[response],
	],
	[
		'responses.create',
		'POST',
		'v1/management/responses',
		(c) =>
			Responses.create(c, {
				workspaceId: WORKSPACE,
				surveyId: SURVEY,
				data: { q1: 'an answer' },
			}),
		response,
	],
	[
		'responses.update',
		'PUT',
		`v1/management/responses/${RESPONSE}`,
		(c) =>
			Responses.update(c, { responseId: RESPONSE, data: { q1: 'edited' } }),
		response,
	],
	[
		'responses.delete',
		'DELETE',
		`v1/management/responses/${RESPONSE}`,
		(c) => Responses.remove(c, { responseId: RESPONSE }),
		response,
	],

	/* ----------------------------- action classes --------------------------- */
	[
		'actionClasses.list',
		'GET',
		'v1/management/action-classes',
		(c) => ActionClasses.list(c, {}),
		[actionClass],
	],
	[
		'actionClasses.create',
		'POST',
		'v1/management/action-classes',
		(c) =>
			ActionClasses.create(c, {
				workspaceId: WORKSPACE,
				name: 'Example action',
				type: 'code',
				key: 'example_action',
			}),
		actionClass,
	],

	/* -------------------------------- contacts ------------------------------ */
	[
		'contacts.list',
		'GET',
		'v1/management/contacts',
		(c) => Contacts.list(c, {}),
		[contact],
	],
	[
		'contacts.listPeople',
		'GET',
		'v1/management/contacts',
		(c) => Contacts.listPeople(c, {}),
		[contact],
	],
	[
		'contacts.get',
		'GET',
		`v1/management/contacts/${CONTACT}`,
		(c) => Contacts.get(c, { contactId: CONTACT }),
		contact,
	],
	[
		'contacts.getPerson',
		'GET',
		`v1/management/contacts/${CONTACT}`,
		(c) => Contacts.getPerson(c, { contactId: CONTACT }),
		contact,
	],
	[
		'contacts.updateAttributes',
		'POST',
		// The client route, because no management route sets a contact's attribute values.
		`v2/client/${WORKSPACE}/user`,
		(c) =>
			Contacts.updateAttributes(c, {
				workspaceId: WORKSPACE,
				userId: 'user-1',
				attributes: { firstName: 'Example' },
			}),
		clientUserState,
	],
	[
		'contacts.create',
		'POST',
		'v2/management/contacts',
		(c) =>
			Contacts.create(c, {
				workspaceId: WORKSPACE,
				attributes: { email: 'respondent@example.com' },
			}),
		contact,
	],
	[
		'contacts.uploadBulk',
		'PUT',
		'v2/management/contacts/bulk',
		(c) =>
			Contacts.uploadBulk(c, {
				workspaceId: WORKSPACE,
				contacts: [
					{
						attributes: [
							{
								attributeKey: { key: 'email', name: 'Email' },
								value: 'a@example.com',
							},
						],
					},
				],
			}),
		[contact],
	],
	[
		'contacts.delete',
		'DELETE',
		`v1/management/contacts/${CONTACT}`,
		(c) => Contacts.remove(c, { contactId: CONTACT }),
		contact,
	],

	/* -------------------------- contact attribute keys ---------------------- */
	[
		'contactAttributeKeys.list',
		'GET',
		// v2, because only v2 pages - v1 ignores `limit` and returns every key.
		'v2/management/contact-attribute-keys',
		(c) => Contacts.listAttributeKeys(c, {}),
		[attributeKey],
	],
	[
		'contactAttributeKeys.listClasses',
		'GET',
		'v2/management/contact-attribute-keys',
		(c) => Contacts.listAttributeClasses(c, {}),
		[attributeKey],
	],
	[
		'contactAttributeKeys.get',
		'GET',
		`v1/management/contact-attribute-keys/${KEY_ID}`,
		(c) => Contacts.getAttributeKey(c, { contactAttributeKeyId: KEY_ID }),
		attributeKey,
	],
	[
		'contactAttributeKeys.getClass',
		'GET',
		`v1/management/contact-attribute-keys/${KEY_ID}`,
		(c) => Contacts.getAttributeClass(c, { contactAttributeKeyId: KEY_ID }),
		attributeKey,
	],
	[
		'contactAttributeKeys.create',
		'POST',
		'v2/management/contact-attribute-keys',
		(c) =>
			Contacts.createAttributeKey(c, {
				workspaceId: WORKSPACE,
				key: 'plan',
				name: 'Plan',
				description: 'The plan the account is on',
			}),
		attributeKey,
	],
	[
		'contactAttributeKeys.update',
		'PUT',
		// v1: only v1 accepts a partial body. v2 re-validates the whole object and 422s when either
		// `name` or `description` is absent, which is what this operation used to do.
		`v1/management/contact-attribute-keys/${KEY_ID}`,
		(c) =>
			Contacts.updateAttributeKey(c, {
				contactAttributeKeyId: KEY_ID,
				name: 'Renamed',
			}),
		attributeKey,
	],
	[
		'contactAttributeKeys.delete',
		'DELETE',
		`v2/management/contact-attribute-keys/${KEY_ID}`,
		(c) => Contacts.removeAttributeKey(c, { contactAttributeKeyId: KEY_ID }),
		attributeKey,
	],

	/* --------------------------- contact attributes ------------------------- */
	[
		'contactAttributes.list',
		'GET',
		'v1/management/contact-attributes',
		(c) => Contacts.listAttributes(c, {}),
		[contactAttribute],
	],

	/* -------------------------------- webhooks ------------------------------ */
	[
		'webhooks.list',
		'GET',
		'v2/management/webhooks',
		(c) => Webhooks.list(c, {}),
		[webhook],
	],
	[
		'webhooks.get',
		'GET',
		`v2/management/webhooks/${WEBHOOK}`,
		(c) => Webhooks.get(c, { webhookId: WEBHOOK }),
		webhook,
	],
	[
		'webhooks.create',
		'POST',
		'v2/management/webhooks',
		(c) =>
			Webhooks.create(c, {
				workspaceId: WORKSPACE,
				name: 'Example webhook',
				url: 'https://example.com/hook',
				source: 'user',
				triggers: ['responseCreated'],
				surveyIds: [],
			}),
		webhook,
	],
	[
		'webhooks.update',
		'PUT',
		`v2/management/webhooks/${WEBHOOK}`,
		(c) =>
			Webhooks.update(c, {
				webhookId: WEBHOOK,
				workspaceId: WORKSPACE,
				name: 'Example webhook',
				url: 'https://example.com/new',
				source: 'user',
				triggers: ['responseCreated'],
				surveyIds: [],
			}),
		webhook,
	],
	[
		'webhooks.delete',
		'DELETE',
		`v2/management/webhooks/${WEBHOOK}`,
		(c) => Webhooks.remove(c, { webhookId: WEBHOOK }),
		webhook,
	],

	/* --------------------------------- teams -------------------------------- */
	[
		'teams.list',
		'GET',
		`v2/organizations/${ORG}/teams`,
		(c) => Organization.listTeams(c, { organizationId: ORG }),
		[team],
	],
	[
		'teams.delete',
		'DELETE',
		`v2/organizations/${ORG}/teams/${TEAM}`,
		(c) => Organization.removeTeam(c, { organizationId: ORG, teamId: TEAM }),
		team,
	],
	[
		'teams.listWorkspaceTeams',
		'GET',
		`v2/organizations/${ORG}/workspace-teams`,
		(c) => Organization.listWorkspaceTeams(c, { organizationId: ORG }),
		[],
	],

	/* --------------------------------- roles -------------------------------- */
	[
		'roles.list',
		'GET',
		'v2/roles',
		(c) => Organization.listRoles(c, {}),
		['owner', 'member'],
	],

	/* ---------------------------------- me ---------------------------------- */
	['me.get', 'GET', 'v2/me', (c) => Account.getMe(c, {}), me],
	[
		'me.getManagement',
		'GET',
		'v1/management/me',
		(c) => Account.getManagementMe(c, {}),
		managementMe,
	],
	[
		'me.getAccountInfo',
		'GET',
		// v1: the catalog describes environment type, project and setup status, which only v1 returns.
		'v1/management/me',
		(c) => Account.getAccountInfo(c, {}),
		managementMe,
	],

	/* -------------------------------- health -------------------------------- */
	[
		'health.check',
		'GET',
		'v2/health',
		(c) => Account.checkHealth(c, {}),
		health,
	],
	['health.list', 'GET', 'v2/health', (c) => Account.listHealth(c, {}), health],

	/* ------------------------------- client API ----------------------------- */
	[
		'client.createDisplay',
		'POST',
		`v1/client/${WORKSPACE}/displays`,
		(c) =>
			ClientApi.createDisplay(c, { workspaceId: WORKSPACE, surveyId: SURVEY }),
		display,
	],
	[
		'client.createUser',
		'POST',
		`v1/client/${WORKSPACE}/user`,
		(c) =>
			ClientApi.createUser(c, { workspaceId: WORKSPACE, userId: 'user-1' }),
		contact,
	],
	[
		'client.identifyUser',
		'POST',
		`v2/client/${WORKSPACE}/user`,
		(c) =>
			ClientApi.identifyUser(c, { workspaceId: WORKSPACE, userId: 'user-1' }),
		contact,
	],
	[
		'client.environment',
		'GET',
		`v1/client/${WORKSPACE}/environment`,
		(c) => ClientApi.environment(c, { workspaceId: WORKSPACE }),
		clientEnvironment,
	],
	[
		'client.contactsState',
		'POST',
		`v2/client/${WORKSPACE}/user`,
		(c) =>
			ClientApi.contactsState(c, { workspaceId: WORKSPACE, userId: 'user-1' }),
		clientUserState,
	],

	/* -------------------------------- storage ------------------------------- */
	[
		'storage.uploadPublic',
		'POST',
		'v1/management/storage',
		(c) =>
			Storage.uploadPublic(c, {
				workspaceId: WORKSPACE,
				fileName: 'logo.png',
				fileType: 'image/png',
			}),
		uploadResult,
	],
	[
		'storage.uploadPrivate',
		'POST',
		// The same route as the public upload; `accessType` is what differs. The client-scoped route
		// this used to call answers 400 to every body.
		'v1/management/storage',
		(c) =>
			Storage.uploadPrivate(c, {
				workspaceId: WORKSPACE,
				fileName: 'answer.pdf',
				fileType: 'application/pdf',
			}),
		uploadResult,
	],
];

beforeEach(() => {
	mockLogEvent.mockClear();
});

describe('routing', () => {
	for (const [op, method, path, run, payload] of OPERATIONS) {
		it(`${op} calls ${method} ${path}`, async () => {
			mockFetch(payload);
			const { ctx } = makeCtx();

			await run(ctx);

			expect(captured?.method).toBe(method);
			expect(decodeURIComponent(captured?.url ?? '')).toBe(`${HOST}/${path}`);
		});
	}

	/**
	 * The version split is the defining feature of this plugin's surface, so it is asserted rather
	 * than left implicit. Sending a v2-only request to v1 produces a 404 that looks like a missing
	 * record.
	 */
	it('sends each operation to the API version that serves it', () => {
		const v2Only = [
			'contacts.create',
			'contacts.updateAttributes',
			'contacts.uploadBulk',
			'contactAttributeKeys.listClasses',
			'contactAttributeKeys.create',
			// `contactAttributeKeys.update` is deliberately NOT here - it is the one operation in this
			// family on v1, because only v1 accepts a partial body.
			'contactAttributeKeys.delete',
			'webhooks.list',
			'webhooks.get',
			'webhooks.create',
			'webhooks.update',
			'webhooks.delete',
			'teams.list',
			'teams.delete',
			'teams.listWorkspaceTeams',
			'roles.list',
			'me.get',
			'contactAttributeKeys.list',
			'health.check',
			'health.list',
			'client.identifyUser',
			'client.contactsState',
		];

		for (const [op, , path] of OPERATIONS) {
			const expected = v2Only.includes(op) ? 'v2/' : 'v1/';
			if (!path.startsWith(expected)) {
				throw new Error(
					`${op} calls ${path}, expected it to start with ${expected}`,
				);
			}
		}
		// Guards the list itself: a v2 operation removed from the registry would leave a dead entry
		// here and quietly narrow the check.
		const registered = new Set(OPERATIONS.map(([op]) => op));
		for (const op of v2Only) expect(registered.has(op)).toBe(true);
	});

	/**
	 * Both client user routes exist, in both versions, and the catalog lists two ids for them. The
	 * split is deliberate - asserted so a later "simplification" to one version cannot silently drop
	 * a catalog operation.
	 */
	it('splits the two client user operations across versions', () => {
		const byOp = Object.fromEntries(
			OPERATIONS.map(([op, , path]) => [op, path]),
		);
		expect(byOp['client.createUser']).toBe(`v1/client/${WORKSPACE}/user`);
		expect(byOp['client.identifyUser']).toBe(`v2/client/${WORKSPACE}/user`);
	});

	/**
	 * The v2 OpenAPI document names a `workspace-state` operation, and that path 404s.
	 */
	it('never calls the spec-only workspace-state path', () => {
		for (const [, , path] of OPERATIONS) {
			expect(path).not.toContain('workspace-state');
		}
	});

	/**
	 * Contact state and the environment bundle are **different payloads**, and an earlier version of
	 * this plugin pointed both operations at `environment`. The catalog describes contact state as a
	 * respondent's "segment memberships, survey displays, and response history", which only
	 * `POST client/{workspaceId}/user` returns - every `GET .../state` shape 404s.
	 */
	it('reads contact state from the client user route, not the environment bundle', () => {
		const byOp = Object.fromEntries(
			OPERATIONS.map(([op, method, path]) => [op, { method, path }]),
		);
		expect(byOp['client.contactsState']).toEqual({
			method: 'POST',
			path: `v2/client/${WORKSPACE}/user`,
		});
		expect(byOp['client.environment']?.path).toContain('/environment');
		// The two must not converge again: same route would mean the distinction was lost.
		expect(byOp['client.contactsState']?.path).not.toBe(
			byOp['client.environment']?.path,
		);
	});
});

describe('coverage', () => {
	it('exercises every registered operation and no others', () => {
		const exercised = OPERATIONS.map(([op]) => op).sort();
		const registered = Object.keys(formbricksEndpointMeta).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(EXPECTED_ENDPOINTS);
	});

	it('has no duplicate entries in the routing table', () => {
		const ops = OPERATIONS.map(([op]) => op);
		expect(new Set(ops).size).toBe(ops.length);
	});

	it('assigns every operation a risk level and a description', () => {
		const entries = Object.entries(formbricksEndpointMeta);

		expect(entries).toHaveLength(EXPECTED_ENDPOINTS);
		for (const [op, meta] of entries) {
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(meta.description.length).toBeGreaterThan(0);
			expect(op).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});
});

describe('risk levels', () => {
	/**
	 * Every irreversible operation, listed explicitly rather than inferred from the name. A rule
	 * about names ending in `.delete` would miss nothing here, but it would also not explain why
	 * `webhooks.delete` is destructive - it invalidates a signing secret every receiver depends on.
	 */
	it('marks everything irreversible destructive', () => {
		const expected = [
			'surveys.delete',
			'responses.delete',
			'contacts.delete',
			'contactAttributeKeys.delete',
			'webhooks.delete',
			'teams.delete',
		];

		for (const op of expected) {
			expect(
				formbricksEndpointMeta[op as keyof typeof formbricksEndpointMeta]
					.riskLevel,
			).toBe('destructive');
		}

		const destructive = Object.entries(formbricksEndpointMeta)
			.filter(([, m]) => m.riskLevel === 'destructive')
			.map(([op]) => op)
			.sort();
		expect(destructive).toEqual([...expected].sort());
	});

	it('marks every GET read', () => {
		const gets = OPERATIONS.filter(([, method]) => method === 'GET');

		expect(gets.length).toBeGreaterThan(15);
		for (const [op] of gets) {
			expect(
				formbricksEndpointMeta[op as keyof typeof formbricksEndpointMeta]
					.riskLevel,
			).toBe('read');
		}
	});

	/** A bulk contact upload creates many people at once; it is not a read. */
	it('treats the bulk upload as a write', () => {
		expect(formbricksEndpointMeta['contacts.uploadBulk'].riskLevel).toBe(
			'write',
		);
	});
});

describe('retry safety', () => {
	it('names only registered operations in the non-idempotent set', () => {
		const registered = new Set(Object.keys(formbricksEndpointMeta));

		expect(NON_IDEMPOTENT_OPERATIONS.size).toBeGreaterThan(0);
		for (const op of NON_IDEMPOTENT_OPERATIONS) {
			if (!registered.has(op)) {
				throw new Error(
					`${op} is in NON_IDEMPOTENT_OPERATIONS but is not a registered operation`,
				);
			}
		}
	});

	it('treats every create as unsafe to replay', () => {
		for (const op of [
			'surveys.create',
			'responses.create',
			'actionClasses.create',
			'webhooks.create',
			'contacts.create',
			'contacts.uploadBulk',
			'contactAttributeKeys.create',
		]) {
			expect(isNonIdempotent(op)).toBe(true);
		}
	});

	/**
	 * Updates are idempotent in effect - applying the same body twice leaves the same state - and a
	 * delete of a named record reports not-found on the second attempt, which the delete flow reads
	 * as confirmed absence.
	 */
	it('treats updates and named deletes as safe to replay', () => {
		for (const op of [
			'surveys.update',
			'responses.update',
			'webhooks.update',
			'contactAttributeKeys.update',
			'surveys.delete',
			'responses.delete',
			'contacts.delete',
			'webhooks.delete',
			'teams.delete',
		]) {
			expect(isNonIdempotent(op)).toBe(false);
		}
	});

	it('never marks a read unsafe to replay', () => {
		const reads = OPERATIONS.filter(([, method]) => method === 'GET').map(
			([op]) => op,
		);

		expect(reads.length).toBeGreaterThan(15);
		for (const op of reads) {
			expect(isNonIdempotent(op)).toBe(false);
		}
	});

	it('does not match an operation name it does not know', () => {
		expect(isNonIdempotent('surveys.somethingElse')).toBe(false);
	});
});

describe('the envelope', () => {
	/**
	 * Every response is wrapped in `{ data }`. Unwrapping in one place means the output schemas
	 * describe the record rather than a wrapper - and asserting it here means a provider dropping the
	 * envelope shows up as one failure instead of forty.
	 */
	it('unwraps the data envelope', async () => {
		mockFetch(survey);
		const { ctx } = makeCtx();

		const result = await Surveys.update(ctx, {
			surveyId: SURVEY,
			name: 'Renamed',
		});

		expect(result).toMatchObject({ id: SURVEY });
		expect(result).not.toHaveProperty('data');
	});

	/**
	 * A response that is already the record - no envelope - has to pass through unchanged, because
	 * one endpoint could always differ and unwrapping a bare record would return undefined.
	 */
	it('passes through a response that carries no envelope', async () => {
		mockFetch(survey, 200, { raw: true });
		const { ctx } = makeCtx();

		const result = await Surveys.update(ctx, {
			surveyId: SURVEY,
			name: 'Renamed',
		});

		expect(result).toMatchObject({ id: SURVEY });
	});

	/** v2 lists add `meta`; it is dropped rather than surfaced, since v1 has none. */
	it('drops the v2 list meta rather than returning it', async () => {
		captured = undefined;
		global.fetch = (async () => ({
			ok: true,
			status: 200,
			statusText: 'OK',
			url: `${HOST}/v2/management/webhooks`,
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => ({
				data: [webhook],
				meta: { total: 1, limit: 50, offset: 0 },
			}),
			text: async () => '',
		})) as unknown as typeof global.fetch;
		const { ctx } = makeCtx();

		const result = await Webhooks.list(ctx, {});

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(1);
	});
});

describe('query construction', () => {
	it('sends limit and offset when given', async () => {
		mockFetch([survey]);
		const { ctx } = makeCtx();

		await Surveys.list(ctx, { limit: 10, offset: 20 });

		expect(captured?.url).toContain('limit=10');
		expect(captured?.url).toContain('offset=20');
	});

	it('sends no paging parameters when none are given', async () => {
		mockFetch([survey]);
		const { ctx } = makeCtx();

		await Surveys.list(ctx, {});

		expect(captured?.url).not.toContain('limit');
		expect(captured?.url).not.toContain('offset');
	});

	/** `surveyId` filters responses through a query parameter rather than a path segment. */
	it('filters responses by survey through the query', async () => {
		mockFetch([response]);
		const { ctx } = makeCtx();

		await Responses.list(ctx, { surveyId: SURVEY });

		expect(decodeURIComponent(captured?.url ?? '')).toContain(
			`surveyId=${SURVEY}`,
		);
	});

	it('rejects a non-scalar query value rather than stringifying it', () => {
		expect(() => withQuery('x', { a: [1, 2] as never })).toThrow(TypeError);
		expect(() => withQuery('x', { a: null as never })).toThrow(TypeError);
	});

	/**
	 * `NaN` and `Infinity` are numbers, and `String()` renders them as the text `"NaN"` and
	 * `"Infinity"` - values the API would match literally. A `typeof` check alone lets them through.
	 */
	it('rejects a non-finite number', () => {
		expect(() => withQuery('x', { limit: Number.NaN })).toThrow(/NaN/);
		expect(() => withQuery('x', { limit: Number.POSITIVE_INFINITY })).toThrow(
			/non-finite/,
		);
	});

	it('keeps a falsy scalar rather than dropping it', () => {
		expect(withQuery('x', { offset: 0 })).toBe('x?offset=0');
		expect(withQuery('x', { flag: false })).toBe('x?flag=false');
	});
});

describe('request bodies', () => {
	/**
	 * `workspaceId` is required in the body of most writes - not merely in the key's scope. Asserted
	 * per operation because the requirement is not universal, which is the part that caused a wrong
	 * generalisation during recon.
	 */
	it('sends workspaceId in the body where the API requires it', async () => {
		const cases: Array<[string, (c: Ctx) => Promise<unknown>, unknown]> = [
			[
				'surveys.create',
				(c) => Surveys.create(c, { workspaceId: WORKSPACE, name: 'x' }),
				survey,
			],
			[
				'responses.create',
				(c) =>
					Responses.create(c, {
						workspaceId: WORKSPACE,
						surveyId: SURVEY,
						data: {},
					}),
				response,
			],
			[
				'actionClasses.create',
				(c) =>
					ActionClasses.create(c, {
						workspaceId: WORKSPACE,
						name: 'x',
						type: 'code',
						key: 'k',
					}),
				actionClass,
			],
			[
				'contacts.create',
				(c) => Contacts.create(c, { workspaceId: WORKSPACE, attributes: {} }),
				contact,
			],
			[
				'webhooks.create',
				(c) =>
					Webhooks.create(c, {
						workspaceId: WORKSPACE,
						name: 'x',
						url: 'https://example.com',
						source: 'user',
						triggers: ['responseCreated'],
						surveyIds: [],
					}),
				webhook,
			],
		];

		for (const [op, run, payload] of cases) {
			mockFetch(payload);
			const { ctx } = makeCtx();
			await run(ctx);
			const body = JSON.parse(captured?.body ?? '{}');
			if (body.workspaceId !== WORKSPACE) {
				throw new Error(`${op} did not send workspaceId in the body`);
			}
		}
	});

	/**
	 * And the exception, verified live: `responses.update` accepts a body without `workspaceId`, so
	 * the plugin does not send one. Asserted so a later "consistency" change cannot add it back on
	 * the assumption that every write needs it.
	 */
	it('does not send workspaceId on the response update', async () => {
		mockFetch(response);
		const { ctx } = makeCtx();

		await Responses.update(ctx, { responseId: RESPONSE, data: { q1: 'x' } });

		expect(JSON.parse(captured?.body ?? '{}')).not.toHaveProperty(
			'workspaceId',
		);
	});

	/**
	 * The bulk upload takes `attributes` as an **array**; the single create takes an **object**. Same
	 * field name, two shapes, two endpoints - asserted because the asymmetry is the kind of thing a
	 * later refactor would "tidy".
	 */
	it('keeps the two attribute shapes distinct', async () => {
		mockFetch(contact);
		const { ctx } = makeCtx();
		await Contacts.create(ctx, {
			workspaceId: WORKSPACE,
			attributes: { email: 'a@example.com' },
		});
		expect(Array.isArray(JSON.parse(captured?.body ?? '{}').attributes)).toBe(
			false,
		);

		mockFetch([contact]);
		await Contacts.uploadBulk(ctx, {
			workspaceId: WORKSPACE,
			contacts: [
				{
					attributes: [
						{ attributeKey: { key: 'email' }, value: 'a@example.com' },
					],
				},
			],
		});
		const bulk = JSON.parse(captured?.body ?? '{}');
		expect(Array.isArray(bulk.contacts[0].attributes)).toBe(true);
	});

	it('omits unset fields rather than sending null', async () => {
		mockFetch(survey);
		const { ctx } = makeCtx();

		await Surveys.update(ctx, { surveyId: SURVEY, name: 'Renamed' });

		expect(JSON.parse(captured?.body ?? '{}')).toEqual({ name: 'Renamed' });
	});
});

describe('caching', () => {
	it('mirrors a fetched survey under its id', async () => {
		mockFetch(survey);
		const { ctx, db } = makeCtx();

		await Surveys.update(ctx, { surveyId: SURVEY, name: 'Renamed' });

		expect(db.surveys.upsertByEntityId).toHaveBeenCalledWith(
			SURVEY,
			expect.objectContaining({ id: SURVEY }),
		);
	});

	it('mirrors every row of a list response', async () => {
		mockFetch([survey, { ...survey, id: 'survey-2' }]);
		const { ctx, db } = makeCtx();

		await Surveys.list(ctx, {});

		expect(db.surveys.upsertByEntityId).toHaveBeenCalledTimes(2);
	});

	/**
	 * The most important assertion in this block. A webhook create returns a signing `secret`, and it
	 * must reach the caller but not the mirror.
	 */
	it('strips the webhook secret before mirroring it', async () => {
		mockFetch(webhook);
		const { ctx, db } = makeCtx();

		const result = await Webhooks.create(ctx, {
			workspaceId: WORKSPACE,
			name: 'Example webhook',
			url: 'https://example.com/hook',
			source: 'user',
			triggers: ['responseCreated'],
			surveyIds: [],
		});

		// The caller gets it - this is the only place it exists.
		expect(result.secret).toBe(webhook.secret);

		// The mirror does not.
		const [, mirrored] = db.webhooks.upsertByEntityId.mock.calls[0] ?? [];
		expect(mirrored).toBeDefined();
		expect(mirrored).not.toHaveProperty('secret');
		expect(JSON.stringify(mirrored)).not.toContain(webhook.secret);
	});

	it('strips secrets from any record, not just via the endpoints', () => {
		expect(stripSecrets({ id: 'x', secret: 's' })).toEqual({ id: 'x' });
		// Leaves a record without one untouched, and by identity so no needless copy is made.
		const clean = { id: 'x' };
		expect(stripSecrets(clean)).toBe(clean);
	});

	/**
	 * Responses, contacts and contact attributes are never mirrored - they are respondent data. A
	 * sweep rather than three assertions, so a new store added later is covered.
	 */
	it('mirrors nothing when respondent data is read', async () => {
		for (const [op, , , run, payload] of OPERATIONS) {
			if (
				!op.startsWith('responses.') &&
				!op.startsWith('contacts.') &&
				!op.startsWith('contactAttributes.')
			) {
				continue;
			}
			// The attribute *keys* are configuration and are mirrored; the values are not.
			if (op.startsWith('contactAttributeKeys.')) continue;

			mockFetch(payload);
			const { ctx, db } = makeCtx();
			await run(ctx);

			for (const [name, store] of Object.entries(db)) {
				if (store.upsertByEntityId.mock.calls.length > 0) {
					throw new Error(`${op} mirrored respondent data into ${name}`);
				}
			}
		}
	});

	it('skips a row the entity schema rejects rather than storing it', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		// No id, so the schema cannot accept it.
		mockFetch([{ name: 'Nameless' }]);
		const { ctx, db } = makeCtx();

		await Surveys.list(ctx, {});

		expect(db.surveys.upsertByEntityId).not.toHaveBeenCalled();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	/**
	 * The warning must name the field and the problem, and nothing else. Zod issues embed the
	 * offending value for several issue types, so logging them from a contact row would put an email
	 * address into durable log output.
	 */
	it('logs only path and code when a row fails its schema', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		mockFetch([{ id: 12345, name: 'wrong type for id' }]);
		const { ctx } = makeCtx();

		await Surveys.list(ctx, {});

		const logged = JSON.stringify(warn.mock.calls);
		expect(logged).toContain('code');
		expect(logged).not.toContain('12345');
		warn.mockRestore();
	});

	it('does not fail the call when a cache write throws', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		mockFetch(survey);
		const { ctx, db } = makeCtx();
		db.surveys.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));

		await expect(
			Surveys.update(ctx, { surveyId: SURVEY, name: 'Renamed' }),
		).resolves.toMatchObject({ id: SURVEY });
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('never evicts on a read', async () => {
		for (const [op, method, , run, payload] of OPERATIONS) {
			if (method !== 'GET') continue;
			mockFetch(payload);
			const { ctx, db } = makeCtx();

			await run(ctx);

			for (const [name, store] of Object.entries(db)) {
				if (store.deleteByEntityId.mock.calls.length > 0) {
					throw new Error(`${op} evicted from ${name} during a read`);
				}
			}
		}
	});
});

describe('a replayed delete still evicts the mirror', () => {
	/**
	 * The bug this prevents was found by a reviewer on a previous integration, and it is not obvious
	 * from either half.
	 *
	 * A delete of a named resource is safe to replay, so these operations are absent from the
	 * non-idempotent set and therefore **are** retried. If the first attempt succeeded remotely and
	 * only its response was lost, the replay gets a 404 - and if the request throws before the
	 * eviction runs, the caller is told it failed while the mirror still holds the record.
	 */
	const NOT_FOUND = { code: 'not_found', message: 'Not found' };

	const requiredEvictions = [
		[
			'webhook',
			'webhooks' as const,
			WEBHOOK,
			(ctx: Ctx) => Webhooks.remove(ctx, { webhookId: WEBHOOK }),
		],
		[
			'contact attribute key',
			'contactAttributeKeys' as const,
			KEY_ID,
			(ctx: Ctx) =>
				Contacts.removeAttributeKey(ctx, { contactAttributeKeyId: KEY_ID }),
		],
	] as const;

	for (const [label, storeName, entityId, run] of requiredEvictions) {
		it(`evicts the mirrored ${label} even when the API answers 404`, async () => {
			const warn = jest
				.spyOn(console, 'warn')
				.mockImplementation(() => undefined);
			mockFetch(NOT_FOUND, 404);
			const { ctx, db } = makeCtx();

			await expect(run(ctx)).resolves.toMatchObject({
				success: true,
				id: entityId,
				already_absent: true,
			});

			expect(db[storeName].deleteByEntityId).toHaveBeenCalledWith(entityId);
			warn.mockRestore();
		});

		it(`fails the ${label} delete when its required eviction fails`, async () => {
			const error = jest
				.spyOn(console, 'error')
				.mockImplementation(() => undefined);
			mockFetch(webhook);
			const { ctx, db } = makeCtx();
			db[storeName].deleteByEntityId.mockRejectedValueOnce(
				new Error('db down'),
			);

			await expect(run(ctx)).rejects.toBeInstanceOf(
				FormbricksMirrorEvictionError,
			);

			// The audit record survives the failure, reporting what actually happened.
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
				mirror_evicted: false,
			});
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('failed');
			error.mockRestore();
		});
	}

	it('records already_absent as false when the delete really removed something', async () => {
		mockFetch(survey);
		const { ctx } = makeCtx();

		await expect(
			Surveys.remove(ctx, { surveyId: SURVEY }),
		).resolves.toMatchObject({
			already_absent: false,
		});
	});

	/** Every other status stays an error - "treat 404 as absence" must not widen. */
	it.each([
		[500, { message: 'Something went wrong' }],
		[403, { message: 'Forbidden' }],
		[401, { message: 'Unauthorized' }],
		[422, { message: 'Unprocessable' }],
	])(
		'propagates a %i rather than reporting a deletion',
		async (status, body) => {
			mockFetch(body, status);
			const { ctx, db } = makeCtx();

			await expect(
				Webhooks.remove(ctx, { webhookId: WEBHOOK }),
			).rejects.toMatchObject({
				status,
			});
			expect(db.webhooks.deleteByEntityId).not.toHaveBeenCalled();
		},
	);

	/** The same tolerance applies to every delete, swept so a later one is covered. */
	it('treats a 404 as absence on every delete operation', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const deletes = OPERATIONS.filter(([, method]) => method === 'DELETE');

		expect(deletes.length).toBeGreaterThanOrEqual(6);
		for (const [op, , , run] of deletes) {
			mockFetch(NOT_FOUND, 404);
			const { ctx } = makeCtx();

			const result = await run(ctx).catch((error: unknown) => {
				throw new Error(
					`${op} rejected a 404 instead of reporting absence: ${error}`,
				);
			});
			expect(result).toMatchObject({ success: true, already_absent: true });
		}
		warn.mockRestore();
	});

	it('recognises absence only from a 404', () => {
		const apiError = (status: number) =>
			Object.assign(new ApiError({} as never, {} as never, 'boom'), { status });

		expect(isResourceAbsent(apiError(404))).toBe(true);
		expect(isResourceAbsent(apiError(500))).toBe(false);
		expect(isResourceAbsent(new Error('plain'))).toBe(false);
	});
});

describe('error routing', () => {
	/**
	 * No handler may claim an error that carries a status on the strength of its message.
	 *
	 * Corsair takes the first matching handler in declaration order, and `ApiError`'s message embeds
	 * the response body - so an unlucky body is all it takes. On a previous integration four handlers
	 * were gated and `NETWORK_ERROR` was missed while a comment claimed the class was covered, so
	 * this is a sweep rather than a list.
	 */
	const apiError = (status: number, body: unknown, message: string) =>
		Object.assign(new ApiError({} as never, {} as never, message), {
			status,
			body,
		});

	const TRIGGER_WORDS = [
		'too many requests',
		'unauthorized',
		'forbidden',
		'not found',
		'network',
		'connection',
		'econnrefused',
		'fetch failed',
	];

	/** Statuses no status-matching handler claims, so an ungated message matcher would be reached. */
	const UNCLAIMED = [402, 405, 409, 410, 451];

	const matchingHandler = (error: Error): string | undefined => {
		const context = { operation: 'surveys.list' } as never;
		return Object.keys(errorHandlers).find((name) =>
			(
				errorHandlers[name as keyof typeof errorHandlers] as {
					match: (e: Error, c: never) => boolean;
				}
			).match(error, context),
		);
	};

	it.each(UNCLAIMED)(
		'sends a %i to DEFAULT however its body reads',
		(status) => {
			for (const word of TRIGGER_WORDS) {
				const error = apiError(
					status,
					{ message: `something about ${word}` },
					`Generic Error: status: ${status}; body: {"message":"something about ${word}"}`,
				);
				const handler = matchingHandler(error);
				if (handler !== 'DEFAULT') {
					throw new Error(
						`a ${status} mentioning "${word}" was claimed by ${handler} on its message alone`,
					);
				}
			}
		},
	);

	it('still matches a statusless transport failure', () => {
		for (const message of ['fetch failed', 'ECONNREFUSED', 'network timeout']) {
			expect(
				errorHandlers.NETWORK_ERROR.match(new Error(message), {} as never),
			).toBe(true);
		}
	});

	it('routes each status to its own handler', () => {
		const cases: Array<[number, string]> = [
			[429, 'RATE_LIMIT_ERROR'],
			[401, 'AUTH_ERROR'],
			[403, 'PERMISSION_ERROR'],
			[404, 'NOT_FOUND_ERROR'],
			[400, 'VALIDATION_ERROR'],
			[422, 'VALIDATION_ERROR'],
			[500, 'SERVER_ERROR'],
		];
		for (const [status, expected] of cases) {
			expect(matchingHandler(apiError(status, { message: 'x' }, 'boom'))).toBe(
				expected,
			);
		}
	});

	/**
	 * v2 names the offending field in `details`; v1 gives a plain message. The handler reads either,
	 * because most Formbricks validation failures are a missing `workspaceId` and saying so is the
	 * difference between an actionable error and "Bad Request".
	 */
	it('names the offending field from either version envelope', () => {
		const v2 = apiError(
			400,
			{ error: { details: [{ field: 'workspaceId', issue: 'required' }] } },
			'boom',
		);
		expect(describeValidationFailure(v2)).toContain('workspaceId');

		const v1 = apiError(
			400,
			{ message: 'workspaceId must be provided' },
			'boom',
		);
		expect(describeValidationFailure(v1)).toContain(
			'workspaceId must be provided',
		);

		expect(describeValidationFailure(new Error('plain'))).toBe('');
	});

	it('does not retry a validation failure', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const result = await errorHandlers.VALIDATION_ERROR.handler(
			apiError(400, { message: 'workspaceId must be provided' }, 'boom'),
			{ operation: 'surveys.create' } as never,
		);
		expect(result.maxRetries).toBe(0);
		warn.mockRestore();
	});
});

describe('event payloads', () => {
	/**
	 * These assertions are the point of the file. Formbricks carries survey respondents' answers and
	 * identities, and `logEventFromContext` persists whatever it is handed.
	 */
	it('records a count rather than the rows when responses are listed', async () => {
		mockFetch([response, { ...response, id: 'response-2' }]);
		const { ctx } = makeCtx();

		await Responses.list(ctx, { surveyId: SURVEY });

		const logged = mockLogEvent.mock.calls[0]?.[2];
		expect(logged).toMatchObject({ response_count: 2 });
		expect(JSON.stringify(logged)).not.toContain('the respondent typed this');
	});

	/** Which questions were answered is auditable; what was answered is not. */
	it('records question ids but not answers when a response is created', async () => {
		mockFetch(response);
		const { ctx } = makeCtx();

		await Responses.create(ctx, {
			workspaceId: WORKSPACE,
			surveyId: SURVEY,
			data: { q1: 'a private answer', q2: 'another' },
		});

		const logged = mockLogEvent.mock.calls[0]?.[2];
		expect(logged).toMatchObject({ answered_question_ids: ['q1', 'q2'] });
		expect(JSON.stringify(logged)).not.toContain('a private answer');
	});

	it('records attribute key names but not values when a contact is created', async () => {
		mockFetch(contact);
		const { ctx } = makeCtx();

		await Contacts.create(ctx, {
			workspaceId: WORKSPACE,
			attributes: { email: 'someone@example.com', firstName: 'Someone' },
		});

		const logged = mockLogEvent.mock.calls[0]?.[2];
		expect(logged).toMatchObject({ attribute_keys: ['email', 'firstName'] });
		expect(JSON.stringify(logged)).not.toContain('someone@example.com');
	});

	/** A webhook secret must never appear, but that one was returned is worth knowing. */
	it('records that a secret was returned, never the secret', async () => {
		mockFetch(webhook);
		const { ctx } = makeCtx();

		await Webhooks.create(ctx, {
			workspaceId: WORKSPACE,
			name: 'Example webhook',
			url: 'https://example.com/hook',
			source: 'user',
			triggers: ['responseCreated'],
			surveyIds: [],
		});

		const logged = mockLogEvent.mock.calls[0]?.[2];
		expect(logged).toMatchObject({ secret_returned: true });
		expect(JSON.stringify(logged)).not.toContain(webhook.secret);
	});

	it('logs every operation exactly once, under its own event name', async () => {
		for (const [op, , , run, payload] of OPERATIONS) {
			mockLogEvent.mockClear();
			mockFetch(payload);
			const { ctx } = makeCtx();

			await run(ctx);

			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(`formbricks.${op}`);
		}
	});

	/**
	 * The sweep. Every operation runs against a response carrying planted respondent data and a
	 * planted secret, and none may appear in what is logged.
	 *
	 * A per-operation assertion only covers the operations someone thought of; this covers the ones
	 * nobody did, including any added later.
	 */
	describe('privacy sweep', () => {
		const POISON = {
			answer: 'PLANTED-SURVEY-ANSWER',
			email: 'planted.respondent@poison.invalid',
			name: 'Planted Respondentname',
			secret: 'PLANTED-WEBHOOK-SECRET-0123456789',
			ip: '203.0.113.42',
		};

		/** Adds the planted values to every object in a response. */
		const poison = (payload: unknown): unknown => {
			if (Array.isArray(payload)) return payload.map(poison);
			if (payload === null || typeof payload !== 'object') return payload;
			return {
				...(payload as Record<string, unknown>),
				data: { q1: POISON.answer },
				meta: { url: `https://poison.invalid/${POISON.answer}`, ip: POISON.ip },
				attributes: { email: POISON.email, firstName: POISON.name },
				contactAttributes: { email: POISON.email },
				secret: POISON.secret,
				name: POISON.name,
				email: POISON.email,
			};
		};

		for (const [op, , , run, payload] of OPERATIONS) {
			it(`${op} leaks nothing into the event log`, async () => {
				mockFetch(poison(payload));
				const { ctx } = makeCtx();

				await run(ctx);

				const logged = JSON.stringify(mockLogEvent.mock.calls[0]?.[2] ?? {});
				for (const [label, value] of Object.entries(POISON)) {
					if (logged.includes(value)) {
						throw new Error(
							`${op} wrote the planted ${label} into the event log: ${logged}`,
						);
					}
				}
			});
		}

		/**
		 * Guards the guard. If `poison` stopped injecting anything, every assertion above would pass
		 * vacuously.
		 */
		it('actually plants the values it searches for', () => {
			const poisoned = JSON.stringify(poison({ id: 'x' }));
			for (const value of Object.values(POISON)) {
				expect(poisoned).toContain(value);
			}
			expect(JSON.stringify(poison([{ id: 'a' }, { id: 'b' }]))).toContain(
				POISON.email,
			);
		});

		/**
		 * And the mirror, not just the log. A poisoned response must not put respondent data or a
		 * secret into a cached row either.
		 */
		it('leaks nothing into the mirror', async () => {
			for (const [op, , , run, payload] of OPERATIONS) {
				mockFetch(poison(payload));
				const { ctx, db } = makeCtx();
				await run(ctx);

				for (const [name, store] of Object.entries(db)) {
					const written = JSON.stringify(store.upsertByEntityId.mock.calls);
					if (written.includes(POISON.secret)) {
						throw new Error(`${op} wrote the planted secret into ${name}`);
					}
				}
			}
		});
	});
});

describe('the plugin is honest about its scope', () => {
	/**
	 * **47 operations covering all 46 catalog ids**, and the arithmetic is worth stating precisely
	 * because it is not 47 distinct capabilities:
	 *
	 * - **41** operations each implement one catalog id against its own route.
	 * - **4** are aliases: `contacts.listPeople`, `contacts.getPerson`,
	 *   `contactAttributeKeys.listClasses`, `contactAttributeKeys.getClass`. Formbricks renamed
	 *   "people" to "contacts" and "attribute classes" to "contact attribute keys" and deleted the old
	 *   routes; the catalog still lists both names. Each alias calls the **same URL** as its primary
	 *   and exists so no catalog id 404s for a caller working from the older entries.
	 * - **1** is `contacts.updateAttributes`, which serves `UPDATE_CONTACT_ATTRIBUTES` over the client
	 *   user route - no management route sets a contact's attribute values.
	 * - **1** is `contactAttributeKeys.update`, which claims no catalog id: it edits an attribute key's
	 *   *definition*, which the catalog does not list.
	 *
	 * So 46 ids resolve, over **38 distinct routes** (see the route-count test below - aliases are not
	 * the only operations that share a URL). Asserted because a description that disagrees
	 * with the implementation is a P1 under `greptile.json` - and an earlier version of this accounting
	 * was wrong in the other direction, claiming `UPDATE_CONTACT_ATTRIBUTES` for the key-definition
	 * edit and making the surface look more complete than it was.
	 */
	it('registers 47 operations covering the 46 catalog ids', () => {
		expect(Object.keys(formbricksEndpointMeta)).toHaveLength(
			EXPECTED_ENDPOINTS,
		);
	});

	/**
	 * Each alias must call **exactly** the route its primary calls.
	 *
	 * If one ever diverges, the plugin has quietly grown a second implementation of one capability -
	 * which is the outcome registering both names was supposed to avoid.
	 */
	/**
	 * How many genuinely distinct URLs the 47 operations call.
	 *
	 * Reported as a number rather than asserted loosely, because "47 operations" overstates the
	 * surface: four are declared aliases, and several non-aliases share a route too - the two health
	 * ids, the two v1 `me` ids, and the three operations that post to the client user route. This is
	 * the figure the PR should quote alongside the id count.
	 */
	it('calls 38 distinct routes across its 47 operations', () => {
		const routes = new Set(
			OPERATIONS.map(([, method, path]) => `${method} ${path}`),
		);
		expect(OPERATIONS).toHaveLength(EXPECTED_ENDPOINTS);
		expect(routes.size).toBe(38);
	});

	it('points every alias at the same route as its primary', () => {
		const byOp = Object.fromEntries(
			OPERATIONS.map(([op, method, path]) => [op, `${method} ${path}`]),
		);

		const PAIRS: Array<[alias: string, primary: string]> = [
			['contacts.listPeople', 'contacts.list'],
			['contacts.getPerson', 'contacts.get'],
			['contactAttributeKeys.listClasses', 'contactAttributeKeys.list'],
			['contactAttributeKeys.getClass', 'contactAttributeKeys.get'],
		];
		for (const [alias, primary] of PAIRS) {
			// Both sides must exist, or a renamed operation would make this pass by comparing two
			// undefineds.
			expect(byOp[primary]).toBeDefined();
			expect(byOp[alias]).toBe(byOp[primary]);
		}
	});

	/**
	 * ...and must still be distinguishable in the audit log.
	 *
	 * Sharing a route is fine; sharing an event name would mean an operator could not tell which id a
	 * caller invoked, which is the one thing the alias has to preserve.
	 */
	it('gives every alias its own audit event', async () => {
		const seen: string[] = [];

		for (const [run, payload] of [
			[(c: Ctx) => Contacts.list(c, {}), [contact]],
			[(c: Ctx) => Contacts.listPeople(c, {}), [contact]],
			[(c: Ctx) => Contacts.get(c, { contactId: CONTACT }), contact],
			[(c: Ctx) => Contacts.getPerson(c, { contactId: CONTACT }), contact],
			[(c: Ctx) => Contacts.listAttributeKeys(c, {}), [attributeKey]],
			[(c: Ctx) => Contacts.listAttributeClasses(c, {}), [attributeKey]],
			[
				(c: Ctx) =>
					Contacts.getAttributeKey(c, { contactAttributeKeyId: KEY_ID }),
				attributeKey,
			],
			[
				(c: Ctx) =>
					Contacts.getAttributeClass(c, { contactAttributeKeyId: KEY_ID }),
				attributeKey,
			],
		] as Array<[(c: Ctx) => Promise<unknown>, unknown]>) {
			mockFetch(payload);
			mockLogEvent.mockClear();
			const { ctx } = makeCtx();

			await run(ctx);

			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			seen.push(String(mockLogEvent.mock.calls[0]?.[1]));
		}

		// Eight calls, eight distinct event names.
		expect(new Set(seen).size).toBe(seen.length);
	});

	/** The three renamed ids are implemented rather than counted as absent. */
	it('implements the renamed operations rather than dropping them', () => {
		const registered = Object.keys(formbricksEndpointMeta);
		// DELETE_PERSON, CREATE_ATTRIBUTE_CLASS, DELETE_ATTRIBUTE_CLASS.
		expect(registered).toContain('contacts.delete');
		expect(registered).toContain('contactAttributeKeys.create');
		expect(registered).toContain('contactAttributeKeys.delete');
	});

	/**
	 * The two operations that between them serve `UPDATE_CONTACT_ATTRIBUTES` must stay registered,
	 * because that id has no route of its own and this is the only way a caller can reach it.
	 */
	it('keeps the operations that stand in for UPDATE_CONTACT_ATTRIBUTES', () => {
		const registered = Object.keys(formbricksEndpointMeta);
		expect(registered).toContain('client.identifyUser');
		expect(registered).toContain('contacts.uploadBulk');
		// And the key-definition edit stays too - a real capability the catalog omits.
		expect(registered).toContain('contactAttributeKeys.update');
	});

	it('carries no generator or template residue', () => {
		for (const file of [
			'client.ts',
			'error-handlers.ts',
			'index.ts',
			'endpoints/shared.ts',
			'endpoints/persist.ts',
			'endpoints/logging.ts',
			'endpoints/delete-flow.ts',
			'schema/database.ts',
			'schema/responses.ts',
			'schema/primitives.ts',
		]) {
			const source = readFileSync(`${__dirname}/${file}`, 'utf8');
			expect(source).not.toMatch(
				/TODO|FIXME|api\.example\.com|bugsnag|loyverse/i,
			);
		}
	});
});

/**
 * Guards for the defects the first draft of this plugin shipped.
 *
 * Every case here passed the previous suite while being wrong against the live API, and the reason is
 * uniform: the routing table asserted **method and path**, and nothing asserted the **request body**
 * or the **query parameter names**. Formbricks accepts a wrong parameter with a 200 and discards it,
 * so nothing short of an explicit assertion separates "sent correctly" from "sent, ignored, and
 * reported as success".
 *
 * Each test states the observed behaviour it encodes, so a change that reintroduces the bug fails
 * with the reason attached rather than as a bare diff.
 */
describe('regressions against verified API behaviour', () => {
	/** The query string of the single captured request. */
	function capturedQuery(): URLSearchParams {
		return new URL(captured?.url ?? 'https://example.com').searchParams;
	}

	/**
	 * `v1 management/surveys` is the **only** route in this API that pages by `offset`. Every other
	 * pageable route honours `skip` and ignores `offset`, verified by effect on seeded rows. The first
	 * draft sent `offset` everywhere, having tested surveys alone, so six list operations returned
	 * page one forever - with a 200 each time.
	 */
	it.each([
		['surveys.list', 'offset', (c: Ctx) => Surveys.list(c, { offset: 2 })],
		['responses.list', 'skip', (c: Ctx) => Responses.list(c, { offset: 2 })],
		['webhooks.list', 'skip', (c: Ctx) => Webhooks.list(c, { offset: 2 })],
		[
			'teams.list',
			'skip',
			(c: Ctx) => Organization.listTeams(c, { organizationId: ORG, offset: 2 }),
		],
		[
			'teams.listWorkspaceTeams',
			'skip',
			(c: Ctx) =>
				Organization.listWorkspaceTeams(c, { organizationId: ORG, offset: 2 }),
		],
		[
			'contactAttributeKeys.list',
			'skip',
			(c: Ctx) => Contacts.listAttributeKeys(c, { offset: 2 }),
		],
	])('%s pages with %s on the wire', async (_op, wireParam, run) => {
		mockFetch([]);
		const { ctx } = makeCtx();

		await run(ctx);

		const query = capturedQuery();
		const ignoredName = wireParam === 'skip' ? 'offset' : 'skip';
		expect(query.get(wireParam)).toBe('2');
		// The other name must be absent rather than merely unused: sending both would double-advance
		// on any route that happened to honour both.
		expect(query.has(ignoredName)).toBe(false);
	});

	/**
	 * The routes that ignore `limit` as well as both cursor names must emit no paging query at all, so
	 * a caller cannot come away believing a page size was applied.
	 */
	it.each([
		['contacts.list', (c: Ctx) => Contacts.list(c, {})],
		['actionClasses.list', (c: Ctx) => ActionClasses.list(c, {})],
		['contactAttributes.list', (c: Ctx) => Contacts.listAttributes(c, {})],
	])('%s sends no paging parameters', async (_op, run) => {
		mockFetch([]);
		const { ctx } = makeCtx();

		await run(ctx);

		const query = capturedQuery();
		for (const name of ['limit', 'offset', 'skip']) {
			expect(query.has(name)).toBe(false);
		}
	});

	/**
	 * `PUT v2/management/webhooks/{id}` re-validates the whole body. The first draft omitted `source`
	 * from both the input schema and the request body, so the operation answered
	 * `422 'source: Invalid option'` on **every** call - and the suite passed, because it only checked
	 * that a PUT reached the right path.
	 */
	it('sends every required field on a webhook update, source included', async () => {
		mockFetch(webhook);
		const { ctx } = makeCtx();

		await Webhooks.update(ctx, {
			webhookId: WEBHOOK,
			workspaceId: WORKSPACE,
			name: 'Renamed',
			url: 'https://example.com/new',
			source: 'user',
			triggers: ['responseFinished'],
			surveyIds: [],
		});

		const body = JSON.parse(captured?.body ?? '{}');
		for (const field of ['name', 'url', 'source', 'triggers', 'surveyIds']) {
			expect(body[field]).toBeDefined();
		}
		expect(body.source).toBe('user');
	});

	/**
	 * The attribute-key update must go to **v1**, and must send only what the caller supplied.
	 *
	 * The same defect as the webhook update, in a second place: this operation declares `name` and
	 * `description` optional, but called v2 - which re-validates the whole object and answers
	 * `422 "expected string, received undefined"` when either is missing. So updating one field failed
	 * every time. v1 accepts a partial body and preserves the field that was not sent.
	 *
	 * Found by diffing the input schemas against Formbricks' published OpenAPI document, not by a
	 * test - which is why this guard exists now.
	 */
	it('sends a partial attribute-key update to v1, not v2', async () => {
		mockFetch(attributeKey);
		const { ctx } = makeCtx();

		await Contacts.updateAttributeKey(ctx, {
			contactAttributeKeyId: KEY_ID,
			name: 'Renamed',
		});

		expect(captured?.url).toContain('v1/management/contact-attribute-keys');
		expect(captured?.url).not.toContain('v2/management/contact-attribute-keys');

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body.name).toBe('Renamed');
		// The unsent field must stay unsent - sending `description: null` would clear it, and sending
		// `undefined` is what `compactBody` exists to prevent.
		expect('description' in body).toBe(false);
	});

	/**
	 * The display route links by **`userId`** - the caller's own identifier. `contactId` is accepted
	 * with a 200 and ignored, storing the display unlinked, and `contactId` is what the first draft
	 * sent.
	 */
	it('links a display by userId and never sends contactId', async () => {
		mockFetch(display);
		const { ctx } = makeCtx();

		await ClientApi.createDisplay(ctx, {
			workspaceId: WORKSPACE,
			surveyId: SURVEY,
			userId: 'user-1',
		});

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body.userId).toBe('user-1');
		expect('contactId' in body).toBe(false);
	});

	/**
	 * Both uploads use `POST v1/management/storage`, distinguished only by `accessType`. The
	 * client-scoped route the first draft used for private uploads answers 400 to every body tried, so
	 * that operation could not succeed at all.
	 *
	 * `accessType` is asserted on the public upload too: omitting it happens to produce a public grant
	 * today, and a changed default would silently publish private files.
	 */
	it.each([
		[
			'public',
			(c: Ctx) =>
				Storage.uploadPublic(c, {
					workspaceId: WORKSPACE,
					fileName: 'logo.png',
					fileType: 'image/png',
				}),
		],
		[
			'private',
			(c: Ctx) =>
				Storage.uploadPrivate(c, {
					workspaceId: WORKSPACE,
					fileName: 'answer.pdf',
					fileType: 'application/pdf',
				}),
		],
	])(
		'sends accessType %s to the management storage route',
		async (kind, run) => {
			mockFetch(uploadResult);
			const { ctx } = makeCtx();

			await run(ctx);

			expect(captured?.url).toContain('v1/management/storage');
			expect(captured?.url).not.toContain('/client/');
			const body = JSON.parse(captured?.body ?? '{}');
			expect(body.accessType).toBe(kind);
			expect(body.workspaceId).toBe(WORKSPACE);
		},
	);

	/**
	 * `presignedFields` is an S3 signature - a short-lived grant to write into the bucket. It reaches
	 * the caller, who cannot upload without it, and must never reach an event payload. Same treatment
	 * as a webhook signing secret.
	 */
	it('never logs the upload signature or the filename', async () => {
		mockFetch(uploadResult);
		const { ctx } = makeCtx();

		await Storage.uploadPublic(ctx, {
			workspaceId: WORKSPACE,
			fileName: 'logo.png',
			fileType: 'image/png',
		});

		const logged = JSON.stringify(mockLogEvent.mock.calls);
		expect(logged).not.toContain('X-Amz-Signature');
		expect(logged).not.toContain(
			uploadResult.presignedFields['X-Amz-Signature'],
		);
		expect(logged).not.toContain(uploadResult.signedUrl);
		// A filename is caller-authored text describing a respondent's file, so it is not logged.
		expect(logged).not.toContain('logo.png');
	});

	/**
	 * Bulk upload rejects a batch over 250 rows and a row without an email, both locally, using the
	 * API's own wording so the local error is as useful as the remote one.
	 */
	it('bounds a bulk upload at 250 rows and requires an email on each', () => {
		const schema = FormbricksEndpointInputSchemas.contactsUploadBulk;
		const row = (email: string) => ({
			attributes: [
				{ attributeKey: { key: 'email', name: 'Email' }, value: email },
			],
		});

		expect(
			schema.safeParse({
				workspaceId: WORKSPACE,
				contacts: Array.from({ length: 250 }, (_, i) =>
					row(`p${i}@example.com`),
				),
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({
				workspaceId: WORKSPACE,
				contacts: Array.from({ length: 251 }, (_, i) =>
					row(`p${i}@example.com`),
				),
			}).success,
		).toBe(false);

		const noEmail = schema.safeParse({
			workspaceId: WORKSPACE,
			contacts: [
				row('first@example.com'),
				{
					attributes: [
						{ attributeKey: { key: 'userId', name: 'User Id' }, value: 'u-1' },
					],
				},
			],
		});
		expect(noEmail.success).toBe(false);
		// The index is named, as the API does: "Email attribute is required for contact at index 1".
		expect(JSON.stringify(noEmail.error?.issues)).toContain('index 1');
	});

	/**
	 * Only the values the API accepts. Both enums were read from its rejection messages, so a typo is
	 * a local error naming the options rather than a round trip returning a 422.
	 */
	it('accepts only the observed webhook source and trigger values', () => {
		const schema = FormbricksEndpointInputSchemas.webhooksCreate;
		const base = {
			workspaceId: WORKSPACE,
			name: 'x',
			url: 'https://example.com',
			surveyIds: [],
		};

		for (const source of ['user', 'zapier', 'make', 'n8n']) {
			expect(
				schema.safeParse({ ...base, source, triggers: ['responseCreated'] })
					.success,
			).toBe(true);
		}
		expect(
			schema.safeParse({
				...base,
				source: 'webhook',
				triggers: ['responseCreated'],
			}).success,
		).toBe(false);

		for (const trigger of [
			'responseFinished',
			'responseCreated',
			'responseUpdated',
		]) {
			expect(
				schema.safeParse({ ...base, source: 'user', triggers: [trigger] })
					.success,
			).toBe(true);
		}
		expect(
			schema.safeParse({
				...base,
				source: 'user',
				triggers: ['responseDeleted'],
			}).success,
		).toBe(false);
	});

	/**
	 * Reading a respondent's state needs a POST that upserts the contact, because every `GET` shape
	 * 404s. A caller must not be able to reach it without naming whose state they want - the first
	 * draft took only a `workspaceId`, because it was reading the workspace-wide environment bundle
	 * instead.
	 */
	it('requires a userId to read contact state', () => {
		const schema = FormbricksEndpointInputSchemas.clientContactsState;
		expect(schema.safeParse({ workspaceId: WORKSPACE }).success).toBe(false);
		expect(
			schema.safeParse({ workspaceId: WORKSPACE, userId: 'user-1' }).success,
		).toBe(true);
	});

	/**
	 * `userId` identifies a person. It is sent, because these operations cannot work without it, and
	 * it is never logged.
	 */
	it('never logs a respondent userId', async () => {
		const identifier = 'respondent-identifier-9137';
		const cases: Array<(c: Ctx) => Promise<unknown>> = [
			(c) =>
				ClientApi.contactsState(c, {
					workspaceId: WORKSPACE,
					userId: identifier,
				}),
			(c) =>
				ClientApi.createDisplay(c, {
					workspaceId: WORKSPACE,
					surveyId: SURVEY,
					userId: identifier,
				}),
			(c) =>
				ClientApi.createUser(c, { workspaceId: WORKSPACE, userId: identifier }),
		];

		for (const run of cases) {
			mockFetch(clientUserState);
			mockLogEvent.mockClear();
			const { ctx } = makeCtx();

			await run(ctx);

			// Sent, because the call needs it; absent from the audit, because it names a person.
			expect(captured?.body).toContain(identifier);
			expect(JSON.stringify(mockLogEvent.mock.calls)).not.toContain(identifier);
		}
	});

	/**
	 * The account-info operation reads v1, not v2. Its catalog description names environment type,
	 * project and setup status - three fields only v1 returns - and the first draft pointed it at v2,
	 * matching the one field the description never mentions.
	 */
	it('reads account info from the v1 route that returns project and setup status', async () => {
		mockFetch(managementMe);
		const { ctx } = makeCtx();

		const result = await Account.getAccountInfo(ctx, {});

		expect(captured?.url).toContain('v1/management/me');
		expect(result.type).toBe('production');
		expect(result.project).toBeDefined();
		// The workspace and project names identify the account and are not logged.
		const logged = JSON.stringify(mockLogEvent.mock.calls);
		expect(logged).not.toContain('Example workspace');
		expect(logged).not.toContain('Example project');
	});
});
