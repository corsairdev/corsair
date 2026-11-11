import { SalesflareEndpointInputSchemas } from './endpoints/types';
import { salesflare, salesflareEndpointSchemas } from './index';
import { SalesflareSchema } from './schema';

jest.mock('./client', () => ({
	makeSalesflareRequest: jest.fn(),
}));

import { makeSalesflareRequest } from './client';

// unknown: zod v4 field internals are read to derive type-appropriate
// boundary values; stricter typing would couple the tests to zod internals.
type ZodField = {
	isOptional: () => boolean;
	_zod: { def: { type: string; element?: ZodField } };
};

function requiredKeys(schema: { shape: Record<string, ZodField> }): string[] {
	return Object.keys(schema.shape).filter(
		// unknown: zod v4 field records are read structurally; optional chaining
		// guards the indexed access under noUncheckedIndexedAccess.
		(key) => schema.shape[key]?.isOptional() === false,
	);
}

function scalarFor(field: ZodField, key: string): unknown {
	// unknown: builds a type-appropriate scalar from zod runtime defs
	const type = field._zod.def.type;
	if (type === 'number') {
		return 1;
	}
	if (type === 'boolean') {
		return true;
	}
	if (type === 'array') {
		// unknown: zod v4 array element defs are read structurally to build a
		// type-appropriate scalar; stricter typing would couple the test to
		// zod internals.
		const element = field._zod.def.element;
		return [element ? scalarFor(element, key) : 'test-' + key];
	}
	return 'test-' + key;
}

// Meeting and call updates accept one of two body forms (calendar-synced or
// logged), so no single field is required; a valid input picks the logged
// form.
// unknown: per-operation extra fields keyed by operation name.
const refinedFormInputs: Record<string, Record<string, unknown>> = {
	updateMeeting: { participants: [1] },
	updateCall: { participants: [1] },
};

function buildValidInput(
	schema: {
		shape: Record<string, ZodField>;
	},
	operation?: string,
): Record<string, unknown> {
	// unknown: minimal valid inputs mix scalar kinds per required field
	// Minimal valid input: only required fields get values. Optional fields
	// stay absent — placeholder strings would violate enum and array
	// contracts and test nothing about the required-field boundary.
	const input: Record<string, unknown> = {}; // unknown: caller-shaped values keyed by schema field
	for (const [key, field] of Object.entries(schema.shape)) {
		if (field.isOptional()) continue;
		input[key] = scalarFor(field, key);
	}
	return { ...input, ...(operation ? refinedFormInputs[operation] : {}) };
}

describe('Salesflare schema', () => {
	it('declares a semver version', () => {
		expect(SalesflareSchema.version).toBeDefined();
		expect(SalesflareSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SalesflareSchema.entities).toBe('object');
		expect(SalesflareSchema.entities).not.toBeNull();
	});

	it('registers the full current Salesflare operation catalog', () => {
		expect(
			Object.keys(salesflareEndpointSchemas).length,
		).toBeGreaterThanOrEqual(70);
	});

	it('exposes message feedback once, on the canonical plural route', () => {
		// The spec ships POST /message/{id}/feedback and
		// POST /messages/{id}/feedback with identical contracts; only the
		// plural route (matching every other message route) is public.
		const feedbackOps = Object.keys(salesflareEndpointSchemas).filter((op) =>
			op.toLowerCase().includes('feedback'),
		);
		expect(feedbackOps).toEqual(['messages.createMessageFeedback']);
	});

	it('provides executable input and output contracts for every operation', () => {
		for (const schemas of Object.values(salesflareEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps every registered endpoint behind a schema boundary', () => {
		const plugin = salesflare({ key: 'secret' });
		const paths: string[] = [];
		// unknown: the walk covers heterogeneous tree levels (functions and
		// group objects) before any Zod parsing, so a single stricter type
		// cannot describe both shapes.
		// unknown: the walk covers heterogeneous tree levels (functions and
		// group objects) before any zod parsing.
		const visit = (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				paths.push(prefix.join('.'));
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					visit(child, [...prefix, key]);
				}
			}
		};

		visit(plugin.endpoints);
		expect(paths).toHaveLength(Object.keys(salesflareEndpointSchemas).length);
		for (const path of paths) {
			expect(
				salesflareEndpointSchemas[
					path as keyof typeof salesflareEndpointSchemas
				],
			).toBeDefined();
		}
	});

	it('requires required fields at the schema boundary for every operation', () => {
		for (const [operation, rawSchema] of Object.entries(
			SalesflareEndpointInputSchemas,
		)) {
			// unknown: zod v4 schema objects are accessed structurally to derive
			// the required-field table; stricter typing would couple the test to
			// zod internals.
			// unknown: zod v4 schema internals are read structurally to derive
			// the required-field table; stricter typing would couple to zod.
			const schema = rawSchema as unknown as {
				shape: Record<string, ZodField>;
				safeParse: (value: unknown) => { success: boolean }; // unknown: values are provider-shaped fixtures, not typed inputs
			};
			const required = requiredKeys(schema);
			if (!required.length) continue;
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse(buildValidInput(schema, operation)).success).toBe(
				true,
			);
		}
	});

	it('rejects unsafe path identifiers at the endpoint boundary', async () => {
		const plugin = salesflare({ key: 'secret' });
		// never: the fixture provides exactly the context fields these
		// handlers read (key, options, $getAccountId); omitted runtime
		// services are not exercised by this plugin endpoints.
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		const unsafe = '../users';
		// unknown: only two representative tree leaves are exercised here and
		// the plugin tree nests every family recursively, so the test narrows
		// the two accessed leaves instead of naming the full recursive type.
		await expect(
			(
				plugin.endpoints as unknown as {
					accounts: {
						retrieveAccount: (ctx: unknown, input: unknown) => Promise<unknown>;
					};
				}
			).accounts.retrieveAccount(ctx, { accountId: unsafe }),
		).rejects.toThrow('Invalid Salesflare account_id');
		await expect(
			(
				plugin.endpoints as unknown as {
					tasks: {
						deleteTask: (ctx: unknown, input: unknown) => Promise<unknown>;
					};
				}
			).tasks.deleteTask(ctx, { id: '.' }),
		).rejects.toThrow('Invalid Salesflare id');
	});

	it('accepts both meeting update forms and rejects neither', () => {
		for (const op of ['updateMeeting', 'updateCall'] as const) {
			const schema = SalesflareEndpointInputSchemas[op];
			// Logged meetings (created in Salesflare or via the API).
			expect(
				schema.safeParse({ meetingId: '1', participants: [2], notes: 'n' })
					.success,
			).toBe(true);
			// Calendar-synced meetings: only the notes can change.
			expect(
				schema.safeParse({
					meetingId: '1',
					calendar_id: 'c',
					external_id: 'e',
					notes: 'n',
				}).success,
			).toBe(true);
			expect(schema.safeParse({ meetingId: '1', notes: 'n' }).success).toBe(
				false,
			);
			expect(
				schema.safeParse({ meetingId: '1', participants: [] }).success,
			).toBe(false);
		}
	});

	it('accepts the array responses of array-bodied writes', async () => {
		const request = jest.mocked(makeSalesflareRequest);
		const plugin = salesflare({ key: 'secret' });
		// never: the fixture provides exactly the context fields these
		// handlers read; omitted runtime services are not exercised.
		const ctx = { key: 'secret', options: {} } as never;
		// unknown: the plugin tree nests every family recursively; only the
		// accessed leaves are narrowed here.
		type Leaf = (ctx: unknown, input: unknown) => Promise<unknown>;
		const endpoints = plugin.endpoints as unknown as {
			contacts: { createContact: Leaf };
			meetings: { createMeeting: Leaf };
			accounts: { addAccountContacts: Leaf };
		};

		// POST /contacts: live single-object create returns { id }; the spec
		// documents [{ id }] (the array-body form). Both must parse.
		request.mockResolvedValueOnce({ id: 42 });
		await expect(
			endpoints.contacts.createContact(ctx, { email: 'a@example.com' }),
		).resolves.toEqual({ id: 42 });
		request.mockResolvedValueOnce([{ id: 42 }]);
		await expect(
			endpoints.contacts.createContact(ctx, { email: 'a@example.com' }),
		).resolves.toEqual([{ id: 42 }]);

		// Undocumented responses of array-bodied writes: list or record.
		request.mockResolvedValueOnce([{ id: 7 }]);
		await expect(
			endpoints.meetings.createMeeting(ctx, {
				date: '2024-01-01T00:00:00.000Z',
				participants: [1],
			}),
		).resolves.toEqual([{ id: 7 }]);
		request.mockResolvedValueOnce({ id: 7 });
		await expect(
			endpoints.accounts.addAccountContacts(ctx, { accountId: '1', id: 2 }),
		).resolves.toEqual({ id: 7 });
	});

	// Per the plugin endpoint-test rule, this table-driven traversal invokes
	// every registered operation and asserts one request plus response parsing.
	it('exercises every registered operation through its public boundary', async () => {
		const request = jest.mocked(makeSalesflareRequest);
		request.mockClear();
		const plugin = salesflare({ key: 'secret' });
		// never: the fixture provides exactly the context fields these
		// handlers read (key, options, $getAccountId); omitted runtime
		// services are not exercised by this plugin endpoints.
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		// Fixed provider-shaped responses, one per operation, derived from the
		// spec's resource shape and deliberately independent of the output
		// schemas: a contract that rejects a genuine payload fails here
		// instead of hiding the mistake behind a schema-chosen mock.
		// unknown: spec-derived mocks, one per operation, keyed by operation path.
		const fixedOutputs: Record<string, unknown> = {
			'accounts.listAccounts': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'accounts.createAccount': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'contacts.listContacts': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			// Live single-object create returns { id }; the spec says [{ id }].
			'contacts.createContact': { id: 1 },
			'currencies.listCurrencies': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'groups.listGroups': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'me.retrieveCurrentUser': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'opportunities.listOpportunities': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'opportunities.createOpportunity': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'persons.listPersons': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'pipelines.listPipelines': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'stages.listStages': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'tags.listTags': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'tags.createTag': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'tasks.listTasks': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'tasks.createTask': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'users.listUsers': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'workflows.listWorkflows': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'workflows.createWorkflow': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'accounts.retrieveAccount': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'accounts.updateAccount': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'accounts.deleteAccount': undefined,
			'campaigns.listCampaignMergeFields': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'contacts.retrieveContact': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'contacts.updateContact': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'contacts.deleteContact': undefined,
			'customfields.listCustomFieldTypes': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'customfields.listCustomFields': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'customfields.createCustomFieldSub': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'datasources.listEmailDataSources': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'filterfields.listFilterFields': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'groups.retrieveGroup': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'me.listMyContacts': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'meetings.retrieveMeeting': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'meetings.updateMeeting': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'meetings.deleteMeeting': undefined,
			'opportunities.retrieveOpportunity': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'opportunities.updateOpportunity': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'opportunities.deleteOpportunity': undefined,
			'settings.retrieveAiSettings': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'settings.updateAiSettings': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'stages.retrieveStage': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'tags.retrieveTag': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'tags.updateTag': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'tags.deleteTag': undefined,
			'users.retrieveUser': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'workflows.retrieveWorkflow': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'workflows.updateWorkflow': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'accounts.listAccountMessages': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'accounts.listAccountFeed': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'customfields.retrieveCustomField': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			// Live response: the bare custom field id.
			'customfields.updateCustomField': 99544,
			'customfields.deleteCustomField': undefined,
			// Live response shape (2026-11-07 trial).
			'tags.listTagUsage': { workflows: [], savedFilters: [], reports: [] },
			'customfields.listCustomFieldOptions': [
				{
					id: 1,
					name: 'Real record',
					created: '2024-01-01T00:00:00.000Z',
					updated: '2024-01-01T00:00:00.000Z',
				},
			],
			'calls.createCall': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'meetings.createMeeting': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'messages.createMessage': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'accounts.addAccountUsers': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'accounts.updateAccountUsers': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'accounts.addAccountContacts': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'accounts.updateAccountContacts': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'messages.createMessageFeedback': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'calls.updateCall': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'messages.updateMessage': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'messages.deleteMessage': undefined,
			'tasks.updateTask': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'tasks.deleteTask': undefined,
			'datasources.updateEmailDataSource': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
			'workflows.updateWorkflowAudience': {
				id: 1,
				name: 'Real record',
				created: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
			},
		};
		let invokedOperations = 0;
		// unknown: the walk covers functions and group objects across the
		// plugin tree; the endpoint contract only exists after the group path
		// is joined, so a single stricter type cannot describe both shapes.
		// unknown: the walk covers functions and group objects across the
		// plugin tree; the contract resolves only after the path joins.
		const visit = async (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				invokedOperations += 1;
				const path = prefix.join('.') as keyof typeof salesflareEndpointSchemas;
				const contract = salesflareEndpointSchemas[path];
				if (!contract) throw new Error(`Missing contract for ${path}`);
				if (!contract.input || !contract.output) {
					throw new Error(`Missing input or output contract for ${path}`);
				}
				// unknown: zod v4 schema objects are read structurally to build a
				// valid input; stricter typing would couple the test to zod.
				const shape = (
					contract.input as unknown as {
						shape: Record<string, ZodField>;
					}
				).shape;
				const input: Record<string, unknown> = {}; // unknown: caller-shaped values keyed by schema field
				for (const [key, field] of Object.entries(shape)) {
					if (field.isOptional()) continue;
					input[key] = scalarFor(field, key);
				}
				Object.assign(input, refinedFormInputs[path.split('.')[1] ?? '']);
				if (!(path in fixedOutputs)) {
					throw new Error(
						'No fixed provider-shaped response registered for ' + String(path),
					);
				}
				const output = fixedOutputs[path];
				request.mockResolvedValue(output);
				// unknown: the walked node is a validated endpoint function whose
				// signature the heterogeneous tree does not expose; this call is
				// the schema boundary under test.
				const result =
					await // unknown: walked leaf invoked at the boundary under test
					(value as (context: unknown, args: unknown) => Promise<unknown>)(
						ctx,
						input,
					);
				if (output === undefined) {
					expect(result).toBeUndefined();
				} else {
					expect(result).toEqual(output);
				}
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					await visit(child, [...prefix, key]);
				}
			}
		};

		await visit(plugin.endpoints);
		expect(invokedOperations).toBe(
			Object.keys(salesflareEndpointSchemas).length,
		);
		expect(request).toHaveBeenCalledTimes(invokedOperations);
	});
});

describe('Salesflare documented alternative forms', () => {
	const inputs = SalesflareEndpointInputSchemas;

	it('takes the parent account as an id or as { id }', () => {
		for (const schema of [inputs.createAccount, inputs.updateAccount]) {
			const base = schema === inputs.updateAccount ? { accountId: '1' } : {};
			expect(schema.safeParse({ ...base, parent_account: 7 }).success).toBe(
				true,
			);
			expect(
				schema.safeParse({ ...base, parent_account: { id: 7 } }).success,
			).toBe(true);
			expect(
				schema.safeParse({ ...base, parent_account: { name: 'x' } }).success,
			).toBe(false);
		}
	});

	it('lets a contact update clear its account with null', () => {
		const parsed = inputs.updateContact.parse({
			contactId: '1',
			account: null,
		});
		expect(parsed).toEqual({ contactId: '1', account: null });
	});

	it('accepts one value or a list for the multi-valued opportunity filters', () => {
		const parsed = inputs.listOpportunities.parse({
			id: [1, 2],
			stage: [3],
			'stage.name': ['Won', 'Lost'],
			'tag.name': 'Hot',
		});
		expect(parsed).toEqual({
			id: [1, 2],
			stage: [3],
			'stage.name': ['Won', 'Lost'],
			'tag.name': 'Hot',
		});
		expect(inputs.listOpportunities.safeParse({ id: ['1'] }).success).toBe(
			false,
		);
	});

	it('accepts the string body the spec documents for deletes', () => {
		const output = salesflareEndpointSchemas['accounts.deleteAccount'].output;
		expect(output.safeParse('').success).toBe(true);
		expect(output.safeParse(undefined).success).toBe(true);
		expect(output.safeParse({}).success).toBe(true);
	});
});
