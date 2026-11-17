import {
	TeamworkManifestFileSchema,
	teamworkManifestFiles,
} from './endpoints/manifest';
import {
	getTeamworkInputSchema,
	getTeamworkOutputSchema,
	teamworkInputSchemas,
	teamworkOutputSchemas,
	teamworkSchemaEntry,
} from './endpoints/openapi-schema';
import type { TeamworkEndpointInputs } from './endpoints/operation-types';
import { TEAMWORK_OPERATION_IDS } from './endpoints/operation-types';
import { teamworkOperationsNested } from './endpoints/operations';
import { teamworkDefinitions, teamworkOperations } from './endpoints/types';
import { TeamworkSchema } from './schema';

// `unknown` is necessary because OpenAPI schemas are provider JSON data, not trusted TypeScript values.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` is necessary because test contract fixtures are built from untrusted OpenAPI JSON values.
function sampleValue(
	value: unknown,
	definitions: Record<string, Record<string, unknown>>,
	depth = 0,
): unknown {
	if (!isRecord(value) || depth > 16) return null;
	if (typeof value.$ref === 'string') {
		const name = value.$ref.replace(/^#\/definitions\//, '');
		return sampleValue(definitions[name], definitions, depth + 1);
	}
	if (Array.isArray(value.enum) && value.enum.length > 0) return value.enum[0];
	if (Array.isArray(value.allOf)) {
		// `unknown` is necessary because allOf members have dynamically declared response shapes.
		return value.allOf.reduce<Record<string, unknown>>((merged, member) => {
			const sample = sampleValue(member, definitions, depth + 1);
			return isRecord(sample) ? { ...merged, ...sample } : merged;
		}, {});
	}
	const union = Array.isArray(value.oneOf) ? value.oneOf : value.anyOf;
	if (Array.isArray(union) && union.length > 0) {
		return sampleValue(union[0], definitions, depth + 1);
	}
	if (value.type === 'string')
		return 'x'.repeat(Math.max(1, Number(value.minLength) || 1));
	if (value.type === 'integer')
		return typeof value.minimum === 'number' ? value.minimum : 1;
	if (value.type === 'number')
		return typeof value.minimum === 'number' ? value.minimum : 0;
	if (value.type === 'boolean') return true;
	if (value.type === 'array') {
		return isRecord(value.items)
			? [sampleValue(value.items, definitions, depth + 1)]
			: [];
	}
	if (value.type === 'object' || isRecord(value.properties)) {
		const properties = isRecord(value.properties) ? value.properties : {};
		const required = Array.isArray(value.required) ? value.required : [];
		return Object.fromEntries(
			required
				.filter((name): name is string => typeof name === 'string')
				.map((name) => [
					name,
					sampleValue(properties[name], definitions, depth + 1),
				]),
		);
	}
	// `unknown` is necessary because OpenAPI permits schema-free values in extension fields.
	return null;
}

describe('Teamwork OpenAPI contract schemas', () => {
	it('declares a semver database schema', () => {
		expect(TeamworkSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(TeamworkSchema.entities).toEqual({});
	});

	it('registers input and output schemas for every documented JSON operation', () => {
		expect(Object.keys(teamworkInputSchemas).sort()).toEqual(
			teamworkOperations.map((operation) => operation.id).sort(),
		);
		expect(Object.keys(teamworkOutputSchemas).sort()).toEqual(
			teamworkOperations.map((operation) => operation.id).sort(),
		);
	});

	it('checks each manifest file against its schema', () => {
		for (const file of Object.values(teamworkManifestFiles)) {
			expect(TeamworkManifestFileSchema.safeParse(file).success).toBe(true);
		}
	});

	it('names every operation resource.action, once, with a matching endpoint tree', () => {
		const ids = teamworkOperations.map((operation) => operation.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const id of ids) {
			expect(id).toMatch(/^[a-z][A-Za-z]+\.[a-z][A-Za-z]+$/);
			const [group, action] = id.split('.') as [string, string];
			const tree: Record<
				string,
				Record<string, unknown>
			> = teamworkOperationsNested;
			expect(typeof tree[group]?.[action]).toBe('function');
		}
		// One operation per HTTP route: no V1/V3 or PUT/PATCH pairs left for the same action.
		const routes = teamworkOperations.map(
			(operation) => `${operation.method} ${operation.path}`,
		);
		expect(new Set(routes).size).toBe(routes.length);
	});

	it('builds an operation schema on first use and reuses it', () => {
		expect(getTeamworkInputSchema('tasks.list')).toBe(
			getTeamworkInputSchema('tasks.list'),
		);
		expect(getTeamworkOutputSchema('tasks.list')).toBe(
			teamworkOutputSchemas['tasks.list'],
		);
		const entry = teamworkSchemaEntry('projects.get');
		expect(entry.input).toBe(getTeamworkInputSchema('projects.get'));
		expect(() => getTeamworkInputSchema('projects.nope')).toThrow(
			'Teamwork operation is unavailable',
		);
	});

	it('deletes task lists on the V1 route, since the V3 one answers 404 live', () => {
		const operation = teamworkOperations.find(
			(item) => item.id === 'tasklists.delete',
		);
		expect(operation).toMatchObject({
			version: 'v1',
			method: 'DELETE',
			path: '/tasklists/{id}.json',
		});
	});

	it('leaves the recipients out of a reminder update, which Teamwork refuses there', () => {
		const update = teamworkOperations.find(
			(item) => item.id === 'taskReminders.update',
		);
		expect(update?.body).toEqual({
			$ref: '#/definitions/reminder.UpdateRequest',
		});
		const reminder = teamworkDefinitions.v3['reminder.UpdateReminder'];
		const properties = Object.keys(
			(reminder?.properties ?? {}) as Record<string, unknown>,
		);
		expect(properties).toEqual(expect.arrayContaining(['remindAt', 'note']));
		expect(properties).not.toContain('userIds');
		expect(properties).not.toContain('teamIds');
		expect(
			teamworkInputSchemas['taskReminders.update']?.safeParse({
				path: { taskId: 1, reminderId: 2 },
				body: { reminder: { remindAt: '2026-12-09T09:00:00Z', note: 'x' } },
			}).success,
		).toBe(true);
	});

	it('takes integer enums the spec lists as strings as numbers', () => {
		const list = teamworkInputSchemas['tasks.list'];
		expect(list?.safeParse({ query: { projectHealths: [1, 3] } }).success).toBe(
			true,
		);
		expect(list?.safeParse({ query: { projectHealths: [4] } }).success).toBe(
			false,
		);
	});

	it('keeps the typed operation ID list in sync with the provider manifest', () => {
		expect([...TEAMWORK_OPERATION_IDS].sort()).toEqual(
			teamworkOperations.map((operation) => operation.id).sort(),
		);
	});

	// Trimmed from the live run on a Teamwork trial site (11-16). Each one failed the spec-built schema.
	it.each([
		[
			'projects.get',
			{
				project: {
					id: 1470497,
					name: 'corsair-plugin-test',
					status: 'active',
					type: 'normal',
					startAt: null,
					endAt: null,
					category: null,
					categoryId: null,
					completedAt: null,
					completedBy: null,
					archivedAt: null,
					archivedBy: null,
					tagIds: null,
					customFieldValueIds: null,
					timeBudget: null,
				},
			},
		],
		[
			'tasks.get',
			{
				task: {
					id: 51453032,
					name: 'corsair-plugin-test task',
					status: 'new',
					priority: 'high',
					tasklistId: 4073104,
					crmDealIds: null,
					parentTask: null,
					capacities: null,
					assigneeCompanyIds: null,
					assigneeTeamIds: null,
					assigneeJobRoleIds: null,
					deletedAt: null,
				},
			},
		],
		[
			'people.me',
			{ person: { id: 753865, firstName: 'Corsair', createdBy: null } },
		],
		// V1 answers ids and counts as strings and some flags as booleans (live run 11-17).
		[
			'projectCategories.get',
			{
				STATUS: 'OK',
				category: {
					elements_count: '0',
					color: '',
					id: '56260',
					type: 'ProjectCategory',
					'parent-id': '',
					name: 'corsair-plugin-test',
					count: '0',
				},
			},
		],
		[
			'teams.get',
			{
				STATUS: 'OK',
				projects: {},
				team: {
					deleted: false,
					id: '63157',
					canEdit: true,
					members: [{ id: '753865', type: 'user' }],
					parentTeam: {},
					numSubteams: '0',
					isPrivate: false,
					name: 'corsair-plugin-test team',
				},
			},
		],
		[
			'tasklists.create',
			{ STATUS: 'OK', LOCKDOWNID: '', TASKLISTID: '4073858' },
		],
		// Sparse fieldsets leave out every unselected field, on any resource.
		[
			'tasks.list',
			{ tasks: [{ id: 51453032 }], meta: { page: { hasMore: false } } },
		],
	])('%s parses a real response with nulls and loose V1 types', (id, body) => {
		const parsed = teamworkOutputSchemas[id]?.safeParse(body);
		expect(parsed?.success).toBe(true);
		// Unknown fields stay in the result rather than being dropped.
		expect(parsed?.data).toEqual(body);
	});

	it('ends every route in .json, as Teamwork serves them', () => {
		// The V1 spec lists /projects/estimatedtime/total.json. with a trailing dot, which answers HTML.
		for (const operation of teamworkOperations) {
			expect(operation.path).toMatch(/\.json$/);
		}
	});

	it.each([
		'milestones.listByDeadline',
		'people.performance',
		'people.utilization',
		'projectMetrics.billable',
		'people.taskCompletion',
		'time.report',
		'time.reportTotals',
		'time.reportByType',
	])(
		'%s requires startDate and endDate, which Teamwork rejects a call without',
		(id) => {
			const schema = teamworkInputSchemas[id];
			const path = id === 'time.reportByType' ? { type: 'user' } : {};
			expect(schema?.safeParse({}).success).toBe(false);
			expect(schema?.safeParse({ path, query: {} }).success).toBe(false);
			expect(
				schema?.safeParse({ path, query: { startDate: '2026-11-01' } }).success,
			).toBe(false);
			// The time report also refuses a call without its grouping type.
			const query =
				id === 'time.report'
					? { startDate: '2026-11-01', endDate: '2026-11-16', type: 'user' }
					: { startDate: '2026-11-01', endDate: '2026-11-16' };
			expect(schema?.safeParse({ path, query }).success).toBe(true);
			if (id === 'time.report') {
				const { type: _type, ...withoutType } = query as { type?: string };
				expect(schema?.safeParse({ path, query: withoutType }).success).toBe(
					false,
				);
			}
		},
	);

	it('accepts the per-user utilization array the API returns', () => {
		const body = {
			utilization: [
				{
					userId: 753865,
					user: { id: 753865, type: 'users' },
					data: [
						{
							startDate: '2026-11-01',
							endDate: '2026-11-16',
							availableMinutes: 480,
							utilizationTarget: null,
						},
					],
				},
			],
			meta: { page: { hasMore: false } },
		};
		expect(
			teamworkOutputSchemas['people.utilization']?.safeParse(body).success,
		).toBe(true);
	});

	it('accepts the body a V3 task delete answers although the spec says 204', () => {
		const schema = teamworkOutputSchemas['tasks.delete'];
		const body = { affected: { taskIds: [] } };
		expect(schema?.safeParse(body).data).toEqual(body);
		expect(schema?.safeParse(undefined).success).toBe(true);
	});

	it('still rejects a response that is not the documented top-level shape', () => {
		const schema = teamworkOutputSchemas['projects.get'];
		expect(schema?.safeParse(null).success).toBe(false);
		expect(schema?.safeParse('<!DOCTYPE html>').success).toBe(false);
		expect(schema?.safeParse({ project: 'not an object' }).success).toBe(false);
	});

	it('lets V1 bodies carry fields the V1 spec leaves out, and still checks the documented ones', () => {
		const createMilestone = teamworkInputSchemas['milestones.create'];
		const createTasklist = teamworkInputSchemas['tasklists.create'];
		// Teamwork's reference documents title and name; the V1 OpenAPI file omits them.
		expect(
			createMilestone?.safeParse({
				path: { id: '1' },
				body: {
					milestone: { title: 'Launch', deadline: '20261130', notify: false },
				},
			}).success,
		).toBe(true);
		expect(
			createTasklist?.safeParse({
				path: { id: '1' },
				body: { 'todo-list': { name: 'Backlog' } },
			}).success,
		).toBe(true);
		expect(
			createMilestone?.safeParse({
				path: { id: '1' },
				body: { milestone: { title: 'Launch', notify: 'yes' } },
			}).success,
		).toBe(false);
		expect(
			createMilestone?.safeParse({
				path: { id: '1', extra: '2' },
				body: { milestone: { title: 'Launch' } },
			}).success,
		).toBe(false);
	});

	it('takes V3 bodies the API accepts although the spec marks other fields required or leaves them out', () => {
		// Sent live on 11-16: Teamwork created this time entry without taskId, tags or timelogOptions.
		const createTime = teamworkInputSchemas['time.create'];
		expect(
			createTime?.safeParse({
				path: { projectId: 1 },
				body: {
					timelog: {
						description: 'Release notes',
						date: '2026-11-16',
						time: '09:00:00',
						hours: 0,
						minutes: 15,
						isBillable: false,
					},
				},
			}).success,
		).toBe(true);
		expect(
			createTime?.safeParse({
				path: { projectId: 1 },
				body: { timelog: { minutes: 'fifteen' } },
			}).success,
		).toBe(false);
		// The spec types remindAt as an empty object; the API wants a date-time string.
		const createReminder = teamworkInputSchemas['taskReminders.create'];
		expect(
			createReminder?.safeParse({
				path: { taskId: 1 },
				body: {
					reminder: {
						remindAt: '2026-12-01T09:00:00Z',
						type: 'email',
						userIds: [1],
						note: 'Check the draft',
					},
				},
			}).success,
		).toBe(true);
	});

	it('validates documented numeric maps', () => {
		const ratesSchema = teamworkInputSchemas['companies.setRates'];
		expect(
			ratesSchema?.safeParse({
				path: { companyId: 123 },
				query: {},
				body: { clientRateByRoleId: { '123': 100 } },
			}).success,
		).toBe(true);
		expect(
			ratesSchema?.safeParse({
				path: { companyId: 123 },
				query: {},
				body: { clientRateByRoleId: { '123': 'a lot' } },
			}).success,
		).toBe(false);
	});

	it('accepts the official V3 create-task example with plain array inputs', () => {
		const createTaskSchema = teamworkInputSchemas['tasks.create'];
		const input: TeamworkEndpointInputs['tasks.create'] = {
			path: { tasklistId: 123 },
			query: {},
			body: {
				task: {
					tasklistId: 123,
					name: 'Create a task from the Teamwork API',
					assignees: { userIds: [234], teamIds: [], companyIds: [] },
					priority: 'medium',
					startAt: '2024-04-16',
					dueAt: '2024-04-24',
					description: 'V3 create-task request',
					customFields: [
						{ customfieldId: 2794, value: 'QR5654' },
						{
							customfieldId: 6050,
							value: 'https://apidocs.teamwork.com/docs/teamwork',
							urlTextToDisplay: 'Teamwork.com API',
						},
					],
				},
				taskOptions: { notify: true },
				card: { columnId: 42 },
			},
		};
		expect(createTaskSchema?.safeParse(input).success).toBe(true);
		expect(
			createTaskSchema?.safeParse({
				...input,
				body: { ...input.body, task: { ...input.body.task, name: undefined } },
			}).success,
		).toBe(false);
		expect(
			createTaskSchema?.safeParse({
				...input,
				body: { ...input.body, task: { ...input.body.task, name: 5 } },
			}).success,
		).toBe(false);
		// notify must be chosen explicitly, so an agent decides whether assignees get an email.
		expect(
			createTaskSchema?.safeParse({
				...input,
				body: { ...input.body, taskOptions: {} },
			}).success,
		).toBe(false);
	});

	it.each(teamworkOperations)(
		'$id rejects extra input properties and malformed output',
		(operation) => {
			const inputSchema = teamworkInputSchemas[operation.id];
			const outputSchema = teamworkOutputSchemas[operation.id];
			expect(inputSchema).toBeDefined();
			expect(outputSchema).toBeDefined();
			expect(inputSchema?.safeParse({ unexpected: true }).success).toBe(false);
			if (operation.responseCode === '204') {
				expect(outputSchema?.safeParse(undefined).success).toBe(true);
				expect(outputSchema?.safeParse('unexpected text').success).toBe(false);
			} else {
				expect(outputSchema?.safeParse(null).success).toBe(false);
			}
			const documentedResponse = sampleValue(
				operation.response,
				teamworkDefinitions[operation.version] ?? {},
			);
			if (operation.responseCode !== '204') {
				const parsed = outputSchema?.safeParse(documentedResponse);
				expect(parsed?.success).toBe(true);
			}
		},
	);
});
