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
		id: 13388076,
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
		id: 21597802,
		organization_id: 21598573,
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
		id: 69027594,
		wid: 21597802,
		archived: false,
		name: 'Acme Corp',
		creator_id: 13388076,
		at: '2026-08-12T09:50:41+00:00',
	};

	const project = {
		id: 221374378,
		workspace_id: 21597802,
		client_id: 69027594,
		name: 'Website Redesign',
		is_private: false,
		active: true,
		server_deleted_at: null,
		at: '2026-08-12T09:50:42+00:00',
	};

	const tag = {
		id: 20781248,
		workspace_id: 21597802,
		name: 'billable',
		creator_id: 13388076,
		at: '2026-08-12T09:50:42.542251Z',
	};

	const timeEntry = {
		id: 4514813464,
		workspace_id: 21597802,
		project_id: 221374378,
		task_id: null,
		billable: false,
		start: '2026-08-09T09:50:42Z',
		stop: '2026-08-09T10:50:42Z',
		duration: 3600,
		description: 'Design review',
		tags: ['billable'],
	};

	it('accepts a real /me payload', () => {
		expect(TogglUserSchema.parse(user).id).toBe(13388076);
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
		expect(parsed.organization_id).toBe(21598573);
		expect(parsed.role).toBe('admin');
	});

	it('accepts a real client payload', () => {
		expect(TogglClientSchema.parse(client).name).toBe('Acme Corp');
	});

	it('accepts a real project payload', () => {
		expect(TogglProjectSchema.parse(project).client_id).toBe(69027594);
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
	const expectedKeys = [
		'meGet',
		'meUpdate',
		'meGetPreferences',
		'meUpdatePreferences',
		'workspacesList',
		'workspacesGet',
		'workspacesUpdate',
		'workspacesGetUsers',
		'organizationsGet',
		'organizationsUpdate',
		'organizationsGetWorkspaces',
		'clientsList',
		'clientsGet',
		'clientsCreate',
		'clientsUpdate',
		'clientsDelete',
		'projectsList',
		'projectsGet',
		'projectsCreate',
		'projectsUpdate',
		'projectsDelete',
		'tasksList',
		'tasksGet',
		'tasksCreate',
		'tasksUpdate',
		'tasksDelete',
		'tagsList',
		'tagsCreate',
		'tagsUpdate',
		'tagsDelete',
		'timeEntriesList',
		'timeEntriesGetCurrent',
		'timeEntriesGet',
		'timeEntriesCreate',
		'timeEntriesUpdate',
		'timeEntriesStop',
		'timeEntriesDelete',
	];

	it('declares an input schema for every operation', () => {
		expect(Object.keys(TogglEndpointInputSchemas).sort()).toEqual(
			[...expectedKeys].sort(),
		);
	});

	it('declares an output schema for every operation', () => {
		expect(Object.keys(TogglEndpointOutputSchemas).sort()).toEqual(
			[...expectedKeys].sort(),
		);
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
			workspace_id: 21597802,
			start: '2026-08-12T10:00:00Z',
			duration: -1,
		});
		expect(parsed.duration).toBe(-1);
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
			id: 69027594,
		});
		expect(parsed).toEqual({ deleted: true, id: 69027594 });
	});

	it('allows a null current time entry when no timer runs', () => {
		expect(
			TogglEndpointOutputSchemas.timeEntriesGetCurrent.parse(null),
		).toBeNull();
	});
});
