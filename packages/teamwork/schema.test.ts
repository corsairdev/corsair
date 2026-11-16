import {
	teamworkInputSchemas,
	teamworkOutputSchemas,
} from './endpoints/openapi-schema';
import type { TeamworkEndpointInputs } from './endpoints/operation-types';
import { TEAMWORK_OPERATION_IDS } from './endpoints/operation-types';
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

	it('keeps the typed operation ID list in sync with the provider manifest', () => {
		expect([...TEAMWORK_OPERATION_IDS]).toEqual(
			teamworkOperations.map((operation) => operation.id),
		);
	});

	// Trimmed from the live run on a Teamwork trial site (11-16). Each one failed the spec-built schema.
	it.each([
		[
			'v3_get_projects_api_v3_projects_projectid_json',
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
			'v3_get_projects_api_v3_tasks_taskid_json',
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
			'v3_get_projects_api_v3_me_json',
			{ person: { id: 753865, firstName: 'Corsair', createdBy: null } },
		],
		[
			'v2_get_projects_api_v2_tasks_taskid_json',
			{
				STATUS: 'OK',
				task: {
					id: 51453032,
					crmDealIds: null,
					teamsFollowingChanges: null,
					companiesFollowingComments: null,
				},
			},
		],
		[
			'v1_get_projects_id_json',
			{
				STATUS: 'OK',
				project: {
					id: '1470497',
					name: 'corsair-plugin-test',
					'harvest-timers-enabled': false,
					integrations: { xero: { connected: false } },
				},
			},
		],
		[
			'v1_get_tasklists_id_json',
			{ STATUS: 'OK', 'todo-list': { id: '4073104', tasks: null } },
		],
		// Sparse fieldsets leave out every unselected field, on any resource.
		[
			'v3_get_projects_api_v3_tasks_json',
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
		'v3_get_projects_api_v3_milestones_metrics_deadlines_json',
		'v3_get_projects_api_v3_people_metrics_performance_json',
		'v3_get_projects_api_v3_people_utilization_json',
		'v3_get_projects_api_v3_projects_metrics_billable_json',
		'v3_get_projects_api_v3_reporting_precanned_usertaskcompletion_json',
		'v3_get_projects_api_v3_time_report_json',
		'v3_get_projects_api_v3_time_report_totals_json',
	])(
		'%s requires startDate and endDate, which Teamwork rejects a call without',
		(id) => {
			const schema = teamworkInputSchemas[id];
			expect(schema?.safeParse({ query: {} }).success).toBe(false);
			expect(
				schema?.safeParse({ query: { startDate: '2026-11-01' } }).success,
			).toBe(false);
			// The time report also refuses a call without its grouping type.
			const query =
				id === 'v3_get_projects_api_v3_time_report_json'
					? { startDate: '2026-11-01', endDate: '2026-11-16', type: 'user' }
					: { startDate: '2026-11-01', endDate: '2026-11-16' };
			expect(schema?.safeParse({ query }).success).toBe(true);
			if (id === 'v3_get_projects_api_v3_time_report_json') {
				const { type: _type, ...withoutType } = query as { type?: string };
				expect(schema?.safeParse({ query: withoutType }).success).toBe(false);
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
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_people_utilization_json'
			]?.safeParse(body).success,
		).toBe(true);
	});

	it('still rejects a response that is not the documented top-level shape', () => {
		const schema =
			teamworkOutputSchemas['v3_get_projects_api_v3_projects_projectid_json'];
		expect(schema?.safeParse(null).success).toBe(false);
		expect(schema?.safeParse('<!DOCTYPE html>').success).toBe(false);
		expect(schema?.safeParse({ project: 'not an object' }).success).toBe(false);
	});

	it('lets V1 bodies carry fields the V1 spec leaves out, and still checks the documented ones', () => {
		const createMilestone =
			teamworkInputSchemas['v1_post_projects_id_milestones_json'];
		const createTasklist =
			teamworkInputSchemas['v1_post_projects_id_tasklists_json'];
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

	it('validates documented numeric maps without allowing unrelated body fields', () => {
		const ratesSchema =
			teamworkInputSchemas[
				'v3_patch_projects_api_v3_companies_companyid_rates_json'
			];
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
				body: {
					clientRateByRoleId: { '123': 100 },
					undocumented: true,
				},
			}).success,
		).toBe(false);
	});

	it('accepts the official V3 create-task example with plain array inputs', () => {
		const createTaskSchema =
			teamworkInputSchemas[
				'v3_post_projects_api_v3_tasklists_tasklistid_tasks_json'
			];
		const input: TeamworkEndpointInputs['v3_post_projects_api_v3_tasklists_tasklistid_tasks_json'] =
			{
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
				body: {
					...input.body,
					task: { ...input.body.task, undocumented: true },
				},
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
				expect(outputSchema?.safeParse({}).success).toBe(false);
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
