import {
	TogglClientSchema,
	TogglEndpointInputSchemas,
	TogglEndpointOutputSchemas,
	TogglProjectSchema,
	TogglTagSchema,
	TogglTimeEntrySchema,
	TogglUserSchema,
	TogglWorkspaceSchema,
} from './endpoints/types';
import { TogglSchema } from './schema';

describe('Toggl schema', () => {
	it('declares a semver version', () => {
		expect(TogglSchema.version).toBeDefined();
		expect(TogglSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('persists only the slow-changing structural entities', () => {
		expect(Object.keys(TogglSchema.entities).sort()).toEqual([
			'clients',
			'projects',
			'tags',
			'workspaces',
		]);
	});

	it('does not persist time entries', () => {
		expect(TogglSchema.entities).not.toHaveProperty('timeEntries');
	});
});

describe('entity schemas', () => {
	// Captured from live Toggl Track API v9 responses.
	const user = {
		id: 1000001,
		email: 'user@example.com',
		fullname: 'Example User',
		timezone: 'Asia/Colombo',
		default_workspace_id: null,
		beginning_of_week: 1,
		country_id: 102,
		has_password: false,
		oauth_providers: ['google'],
		created_at: '2026-08-12T09:38:11.608139Z',
	};

	const workspace = {
		id: 3000001,
		organization_id: 2000001,
		name: 'Workspace',
		premium: true,
		admin: true,
		role: 'admin',
		default_currency: 'USD',
		default_hourly_rate: null,
		suspended_at: null,
		at: '2026-08-12T09:48:00+00:00',
	};

	const client = {
		id: 4000001,
		wid: 3000001,
		archived: false,
		name: 'Acme Corp',
		creator_id: 1000001,
		at: '2026-08-12T09:50:41+00:00',
	};

	const project = {
		id: 5000001,
		workspace_id: 3000001,
		client_id: 4000001,
		name: 'Website Redesign',
		is_private: false,
		active: true,
		server_deleted_at: null,
		at: '2026-08-12T09:50:42+00:00',
	};

	const tag = {
		id: 6000001,
		workspace_id: 3000001,
		name: 'billable',
		creator_id: 1000001,
		at: '2026-08-12T09:50:42.542251Z',
	};

	const timeEntry = {
		id: 7000001,
		workspace_id: 3000001,
		project_id: 5000001,
		task_id: null,
		billable: false,
		start: '2026-08-09T09:50:42Z',
		stop: '2026-08-09T10:50:42Z',
		duration: 3600,
		description: 'Design review',
		tags: ['billable'],
	};

	it('accepts a real /me payload', () => {
		expect(TogglUserSchema.parse(user).id).toBe(1000001);
	});

	it('strips api_token out of a profile payload', () => {
		// Toggl returns the account credential on /me; it must never survive
		// into a value handed back to an endpoint consumer.
		const parsed = TogglUserSchema.parse({
			...user,
			api_token: 'a-reusable-account-credential',
		});
		expect(parsed).not.toHaveProperty('api_token');
	});

	it('accepts a real workspace payload', () => {
		const parsed = TogglWorkspaceSchema.parse(workspace);
		expect(parsed.organization_id).toBe(2000001);
		expect(parsed.role).toBe('admin');
	});

	it('accepts a real client payload', () => {
		expect(TogglClientSchema.parse(client).name).toBe('Acme Corp');
	});

	it('accepts a real project payload', () => {
		expect(TogglProjectSchema.parse(project).client_id).toBe(4000001);
	});

	it('accepts a real tag payload', () => {
		expect(TogglTagSchema.parse(tag).name).toBe('billable');
	});

	it('accepts a real time entry payload', () => {
		const parsed = TogglTimeEntrySchema.parse(timeEntry);
		expect(parsed.duration).toBe(3600);
		expect(parsed.tags).toEqual(['billable']);
	});

	it('tolerates the nulls Toggl returns instead of omitting fields', () => {
		const parsed = TogglWorkspaceSchema.parse({
			...workspace,
			default_hourly_rate: null,
			suspended_at: null,
			logo_url: null,
		});
		expect(parsed.default_hourly_rate).toBeNull();
	});

	it('rejects a payload missing a required id', () => {
		expect(() => TogglClientSchema.parse({ name: 'No id' })).toThrow();
	});

	it('rejects a time entry with a non-numeric duration', () => {
		expect(() =>
			TogglTimeEntrySchema.parse({ ...timeEntry, duration: 'an hour' }),
		).toThrow();
	});
});

describe('endpoint schema registry', () => {
	const inputKeys = Object.keys(TogglEndpointInputSchemas).sort();
	const outputKeys = Object.keys(TogglEndpointOutputSchemas).sort();

	it('declares matching input and output schemas for every operation', () => {
		expect(inputKeys).toEqual(outputKeys);
	});

	const groups = [
		'clients',
		'me',
		'organizations',
		'projects',
		'reference',
		'smail',
		'tags',
		'tasks',
		'timeEntries',
		'webhooks',
		'workspaces',
	];

	it('has at least one operation in every resource group', () => {
		for (const group of groups) {
			expect(inputKeys.some((key) => key.startsWith(group))).toBe(true);
		}
	});

	it('assigns every operation to a known resource group', () => {
		for (const key of inputKeys) {
			expect(groups.some((group) => key.startsWith(group))).toBe(true);
		}
	});

	it('declares a zod schema, not a bare object, for each side', () => {
		for (const key of inputKeys) {
			const input = (TogglEndpointInputSchemas as Record<string, unknown>)[key];
			const output = (TogglEndpointOutputSchemas as Record<string, unknown>)[
				key
			];
			expect(typeof (input as { parse?: unknown })?.parse).toBe('function');
			expect(typeof (output as { parse?: unknown })?.parse).toBe('function');
		}
	});
});

describe('input validation', () => {
	it('requires a workspace id when creating a client', () => {
		expect(() =>
			TogglEndpointInputSchemas.clientsCreate.parse({ name: 'Acme' }),
		).toThrow();
	});

	it('rejects an empty client name', () => {
		expect(() =>
			TogglEndpointInputSchemas.clientsCreate.parse({
				workspace_id: 1,
				name: '',
			}),
		).toThrow();
	});

	it('requires start and duration when creating a time entry', () => {
		expect(() =>
			TogglEndpointInputSchemas.timeEntriesCreate.parse({
				workspace_id: 1,
				description: 'no start',
			}),
		).toThrow();
	});

	it('accepts a negative duration to mark a running timer', () => {
		const parsed = TogglEndpointInputSchemas.timeEntriesCreate.parse({
			workspace_id: 3000001,
			start: '2026-08-12T10:00:00Z',
			duration: -1,
		});
		expect(parsed.duration).toBe(-1);
	});

	it('rejects a fractional resource id', () => {
		expect(() =>
			TogglEndpointInputSchemas.clientsGet.parse({
				workspace_id: 1,
				client_id: 1.5,
			}),
		).toThrow();
	});

	it('rejects a non-RFC3339 time entry start', () => {
		expect(() =>
			TogglEndpointInputSchemas.timeEntriesCreate.parse({
				workspace_id: 1,
				start: '12/08/2026',
				// A plainly valid duration, so only `start` can fail the parse.
				duration: 60,
			}),
		).toThrow();
	});

	it('accepts an offset timestamp as well as plain UTC', () => {
		const parsed = TogglEndpointInputSchemas.timeEntriesCreate.parse({
			workspace_id: 1,
			start: '2026-08-12T10:00:00+02:00',
			duration: 60,
		});
		expect(parsed.start).toBe('2026-08-12T10:00:00+02:00');
	});

	it('rejects a fractional duration', () => {
		expect(() =>
			TogglEndpointInputSchemas.timeEntriesCreate.parse({
				workspace_id: 1,
				start: '2026-08-12T10:00:00Z',
				duration: 1.5,
			}),
		).toThrow();
	});

	it('requires a value on add and replace bulk-edit operations', () => {
		const base = { workspace_id: 1, time_entry_ids: [1] };
		for (const op of ['add', 'replace'] as const) {
			expect(() =>
				TogglEndpointInputSchemas.timeEntriesBulkEdit.parse({
					...base,
					operations: [{ op, path: '/description' }],
				}),
			).toThrow();
		}
		// remove carries no value, per RFC 6902.
		expect(
			TogglEndpointInputSchemas.timeEntriesBulkEdit.parse({
				...base,
				operations: [{ op: 'remove', path: '/description' }],
			}).operations,
		).toHaveLength(1);
	});

	it('accepts an unscoped quota record', () => {
		const parsed = TogglEndpointOutputSchemas.meGetQuota.parse([
			{ organization_id: null, remaining: 600, total: 600 },
		]);
		expect(parsed[0]?.organization_id).toBeNull();
	});

	it('accepts either archive response shape', () => {
		expect(
			TogglEndpointOutputSchemas.clientsArchive.parse({ items: [1, 2] }),
		).toMatchObject({ items: [1, 2] });
		expect(
			TogglEndpointOutputSchemas.clientsArchive.parse({
				id: 1,
				name: 'Acme',
				archived: true,
			}),
		).toMatchObject({ id: 1, archived: true });
	});

	it('caps project pagination at Toggl’s per_page maximum', () => {
		expect(() =>
			TogglEndpointInputSchemas.projectsList.parse({
				workspace_id: 1,
				per_page: 500,
			}),
		).toThrow();
		expect(
			TogglEndpointInputSchemas.projectsList.parse({
				workspace_id: 1,
				per_page: 200,
			}).per_page,
		).toBe(200);
	});

	it('constrains beginning_of_week to a weekday index', () => {
		expect(() =>
			TogglEndpointInputSchemas.meUpdate.parse({ beginning_of_week: 9 }),
		).toThrow();
	});

	it('models a delete result as an explicit typed value', () => {
		const parsed = TogglEndpointOutputSchemas.clientsDelete.parse({
			deleted: true,
			id: 4000001,
		});
		expect(parsed).toEqual({ deleted: true, id: 4000001 });
	});

	it('allows a null current time entry when no timer runs', () => {
		expect(
			TogglEndpointOutputSchemas.timeEntriesGetCurrent.parse(null),
		).toBeNull();
	});

	it('requires start_date and end_date to be supplied together', () => {
		const schema = TogglEndpointInputSchemas.timeEntriesList;
		expect(() => schema.parse({ start_date: '2026-08-01' })).toThrow();
		expect(() => schema.parse({ end_date: '2026-08-12' })).toThrow();
		expect(
			schema.parse({ start_date: '2026-08-01', end_date: '2026-08-12' })
				.start_date,
		).toBe('2026-08-01');
		// Neither supplied is fine — it just means "recent entries".
		expect(schema.parse({})).toEqual({});
	});

	it('accepts pagination on the tag list', () => {
		const parsed = TogglEndpointInputSchemas.tagsList.parse({
			workspace_id: 1,
			page: 2,
			per_page: 50,
		});
		expect(parsed.per_page).toBe(50);
	});

	it('makes project_id optional on the task list', () => {
		expect(
			TogglEndpointInputSchemas.tasksList.parse({ workspace_id: 1 }).project_id,
		).toBeUndefined();
	});

	it('requires a name on every client update', () => {
		expect(() =>
			TogglEndpointInputSchemas.clientsUpdate.parse({
				workspace_id: 1,
				client_id: 2,
				notes: 'only notes',
			}),
		).toThrow();
	});
});

describe('schema strictness', () => {
	it('keeps unknown provider fields on entity schemas', () => {
		// Toggl adds fields over time; dropping them would make the plugin lossy.
		const parsed = TogglClientSchema.parse({
			id: 1,
			name: 'Acme',
			some_new_toggl_field: 'kept',
		}) as Record<string, unknown>;
		expect(parsed.some_new_toggl_field).toBe('kept');
	});

	it('still strips api_token from the user schema', () => {
		// The one schema that must stay strict.
		const parsed = TogglUserSchema.parse({
			id: 1,
			email: 'user@example.com',
			api_token: 'a-reusable-account-credential',
		});
		expect(parsed).not.toHaveProperty('api_token');
	});
});
