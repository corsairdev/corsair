import { z } from 'zod';
import { pipedriveCatalogEndpointFunctions } from './endpoints/catalog-registry';
import { PipedriveCatalog } from './endpoints/catalog-schemas';
import {
	PipedriveCatalogOperationKeys,
	PipedriveCatalogTestCases,
} from './endpoints/catalog-test-cases';
import {
	PipedriveEndpointInputSchemas,
	PipedriveEndpointOutputSchemas,
} from './endpoints/types';
import { pipedrive, pipedriveEndpointSchemas } from './index';

const validDeal = {
	id: 42,
	title: 'Qualified opportunity',
	owner_id: 7,
	person_id: null,
	org_id: 3,
	pipeline_id: 1,
	stage_id: 2,
	value: 1250,
	currency: 'USD',
	add_time: '2025-01-01T10:00:00Z',
	update_time: null,
	stage_change_time: null,
	is_deleted: false,
	is_archived: false,
	status: 'open',
	probability: null,
	lost_reason: null,
	visible_to: 3,
	close_time: null,
	won_time: null,
	lost_time: null,
	expected_close_date: null,
	label_ids: [],
	origin: 'API',
	origin_id: null,
	channel: null,
	channel_id: null,
	source_lead_id: null,
	arr: null,
	mrr: null,
	acv: null,
	custom_fields: { priority: 'high' },
};

const validOrganization = {
	id: 23,
	name: 'Synthetic organization',
	owner_id: 7,
	add_time: '2025-01-01T10:00:00Z',
	update_time: null,
	is_deleted: false,
	visible_to: 3,
	address: null,
	label_ids: [],
	website: null,
	linkedin: null,
	industry: null,
	annual_revenue: null,
	employee_count: null,
	custom_fields: { segment: 'enterprise' },
};
const validActivity = {
	id: 31,
	subject: 'Synthetic follow-up',
	type: 'call',
	owner_id: 7,
	creator_user_id: 7,
	is_deleted: false,
	add_time: '2025-01-01T10:00:00Z',
	update_time: '2025-01-01T10:00:00Z',
	deal_id: null,
	lead_id: null,
	person_id: null,
	org_id: null,
	project_id: null,
	due_date: '2025-01-02',
	due_time: null,
	duration: null,
	busy: false,
	done: false,
	marked_as_done_time: null,
	location: null,
	participants: [],
	attendees: [],
	conference_meeting_client: '',
	conference_meeting_url: '',
	conference_meeting_id: '',
	public_description: '',
	priority: 0,
	outcome: null,
	note: '',
};
const validTask = {
	id: 42,
	title: 'Synthetic project task',
	creator_id: 7,
	description: null,
	project_id: 11,
	is_done: false,
	is_milestone: false,
	due_date: null,
	start_date: null,
	parent_task_id: null,
	assignee_ids: [],
	priority: null,
	add_time: '2025-01-01T10:00:00Z',
	update_time: '2025-01-01T10:00:00Z',
	marked_as_done_time: null,
};

describe('Pipedrive endpoint schemas', () => {
	it('keeps every official catalog operation registered with strict input and output schemas', () => {
		const plugin = pipedrive();
		const configuredScopes = new Set(plugin.oauthConfig?.scopes ?? []);
		expect(Object.keys(pipedriveCatalogEndpointFunctions).sort()).toEqual(
			[...PipedriveCatalogOperationKeys].sort(),
		);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			Object.keys(pipedriveEndpointSchemas).sort(),
		);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			Object.keys(pipedriveEndpointSchemas).sort(),
		);
		for (const key of PipedriveCatalogOperationKeys) {
			const route = PipedriveCatalog[key];
			const testCase = PipedriveCatalogTestCases[key];
			expect(route.tokenCost).toBeGreaterThan(0);
			expect(route.oauthScopes.length).toBeGreaterThan(0);
			expect(
				route.oauthScopes.every((scope) => configuredScopes.has(scope)),
			).toBe(true);
			const inputResult = route.input.safeParse(testCase.input);
			if (!inputResult.success) {
				throw new Error(`${key} input fixture: ${inputResult.error.message}`);
			}
			const outputResult = route.output.safeParse(testCase.response);
			if (!outputResult.success) {
				throw new Error(`${key} output fixture: ${outputResult.error.message}`);
			}
			expect(
				route.input.safeParse({
					...testCase.input,
					undocumented_callback: 'rejected',
				}).success,
			).toBe(false);
			expect(route.output.safeParse(null).success).toBe(false);
		}
	});

	it('accepts documented nested goal, filter, field-option, and role payloads strictly', () => {
		const goal = PipedriveCatalogTestCases['apiV1.goals.addGoal'].input;
		expect(
			PipedriveCatalog['apiV1.goals.addGoal'].input.safeParse(goal).success,
		).toBe(true);
		expect(
			PipedriveCatalog['apiV1.goals.addGoal'].input.safeParse({
				...goal,
				body: {
					...goal.body,
					assignee: { ...goal.body.assignee, callback: 'not documented' },
				},
			}).success,
		).toBe(false);

		const filter = PipedriveCatalogTestCases['apiV1.filters.addFilter'].input;
		expect(
			PipedriveCatalog['apiV1.filters.addFilter'].input.safeParse(filter)
				.success,
		).toBe(true);
		expect(
			PipedriveCatalog['apiV1.filters.addFilter'].input.safeParse({
				...filter,
				body: {
					...filter.body,
					conditions: { ...filter.body.conditions, callback: 'not documented' },
				},
			}).success,
		).toBe(false);

		const field =
			PipedriveCatalogTestCases['apiV1.dealFields.addDealField'].input;
		expect(
			PipedriveCatalog['apiV1.dealFields.addDealField'].input.safeParse(field)
				.success,
		).toBe(true);
		expect(
			PipedriveCatalog['apiV1.dealFields.addDealField'].input.safeParse({
				...field,
				body: {
					...field.body,
					options: [{ label: 'New option', callback: 'not documented' }],
				},
			}).success,
		).toBe(false);

		const role =
			PipedriveCatalogTestCases['apiV1.roles.updateRolePipelines'].input;
		expect(
			PipedriveCatalog['apiV1.roles.updateRolePipelines'].input.safeParse(role)
				.success,
		).toBe(true);
		expect(
			PipedriveCatalog['apiV1.roles.updateRolePipelines'].input.safeParse({
				...role,
				body: {
					visible_pipeline_ids: {
						...role.body.visible_pipeline_ids,
						callback: 'not documented',
					},
				},
			}).success,
		).toBe(false);
	});

	it('accepts open-ended durations in every goal response shape', () => {
		const openEndedGoal = {
			id: 'x',
			duration: { start: '2026-01-01', end: null },
		};
		const cases = [
			['apiV1.goals.addGoal', { success: true, data: { goal: openEndedGoal } }],
			[
				'apiV1.goals.getGoals',
				{ success: true, data: { goals: [openEndedGoal] } },
			],
			[
				'apiV1.goals.updateGoal',
				{ success: true, data: { goal: openEndedGoal } },
			],
			[
				'apiV1.goals.getGoalResult',
				{ success: true, data: { progress: 1, goal: openEndedGoal } },
			],
		] as const;

		for (const [key, response] of cases) {
			expect(PipedriveCatalog[key].output.safeParse(response).success).toBe(
				true,
			);
		}
	});

	it('accepts and bounds documented deal-list filters and pagination', () => {
		expect(
			PipedriveEndpointInputSchemas.dealList.parse({
				status: ['open', 'won'],
				include_fields: ['products_count'],
				custom_fields: ['abc'],
				limit: 500,
				cursor: 'opaque-cursor',
			}),
		).toMatchObject({ limit: 500, cursor: 'opaque-cursor' });
		expect(() =>
			PipedriveEndpointInputSchemas.dealList.parse({ limit: 501 }),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.dealList.parse({ status: ['pending'] }),
		).toThrow(z.ZodError);
	});

	it('rejects undocumented request properties and invalid IDs', () => {
		expect(() =>
			PipedriveEndpointInputSchemas.dealCreate.parse({
				title: 'X',
				callback: 'url',
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.dealGet.parse({ id: '1' }),
		).toThrow(z.ZodError);
	});

	it('requires create title and only permits false for restoring deleted deals', () => {
		expect(() => PipedriveEndpointInputSchemas.dealCreate.parse({})).toThrow(
			z.ZodError,
		);
		expect(() =>
			PipedriveEndpointInputSchemas.dealUpdate.parse({
				id: 1,
				is_deleted: true,
			}),
		).toThrow(z.ZodError);
	});

	it('parses documented nullable deal fields and rejects a malformed response', () => {
		expect(
			PipedriveEndpointOutputSchemas.dealGet.parse({
				success: true,
				data: validDeal,
			}),
		).toMatchObject({ data: { id: 42, person_id: null } });
		expect(() =>
			PipedriveEndpointOutputSchemas.dealGet.parse({
				success: 'yes',
				data: validDeal,
			}),
		).toThrow(z.ZodError);
	});

	it('validates pagination output and delete response shape', () => {
		expect(
			PipedriveEndpointOutputSchemas.dealList.parse({
				success: true,
				data: [validDeal],
				additional_data: { next_cursor: null },
			}),
		).toMatchObject({ additional_data: { next_cursor: null } });
		expect(() =>
			PipedriveEndpointOutputSchemas.dealDelete.parse({
				success: true,
				data: { id: '1' },
			}),
		).toThrow(z.ZodError);
	});

	it('keeps endpoint implementation, schema map, and metadata synchronized', () => {
		const plugin = pipedrive({});
		expect(Object.keys(pipedriveEndpointSchemas)).toHaveLength(365);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			Object.keys(pipedriveEndpointSchemas).sort(),
		);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			Object.keys(pipedriveEndpointSchemas).sort(),
		);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.endpoints?.deals.list).toBeDefined();
		expect(plugin.endpoints?.apiV1.deals.getArchivedDeals).toBeDefined();
		expect(plugin.endpoints?.apiV2.dealProducts.addDealProduct).toBeDefined();
		expect(plugin.endpointMeta?.['deals.delete']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['persons.delete']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpoints?.persons.list).toBeDefined();
		expect(plugin.endpoints?.organizations.list).toBeDefined();
		expect(plugin.endpointMeta?.['organizations.delete']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpoints?.activities.list).toBeDefined();
		expect(plugin.endpointMeta?.['activities.delete']?.riskLevel).toBe(
			'destructive',
		);
		// Attendees get calendar invitations (and updates) by email.
		expect(plugin.endpointMeta?.['activities.create']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['activities.update']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpoints?.tasks.list).toBeDefined();
		expect(plugin.endpointMeta?.['tasks.delete']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpoints?.products.list).toBeDefined();
		expect(plugin.endpoints?.products.variations.list).toBeDefined();
		expect(plugin.endpoints?.products.images.upload).toBeDefined();
		expect(plugin.endpoints?.products.followers.changelog).toBeDefined();
		expect(plugin.endpointMeta?.['products.delete']?.riskLevel).toBe(
			'destructive',
		);
	});

	it('validates activity filters, strict write fields, and nullable response fields', () => {
		expect(
			PipedriveEndpointInputSchemas.activityList.parse({
				ids: [31, 32],
				include_fields: ['attendees'],
				limit: 500,
				cursor: 'opaque',
			}),
		).toMatchObject({ limit: 500, cursor: 'opaque' });
		expect(() =>
			PipedriveEndpointInputSchemas.activityList.parse({ limit: 501 }),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.activityCreate.parse({
				subject: 'Call',
				person_id: 18,
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.activityUpdate.parse({
				id: 31,
				callback: 'x',
			}),
		).toThrow(z.ZodError);
		expect(
			PipedriveEndpointOutputSchemas.activityList.parse({
				success: true,
				data: [validActivity],
				additional_data: { next_cursor: null },
			}),
		).toMatchObject({
			data: [{ outcome: null }],
			additional_data: { next_cursor: null },
		});
		expect(() =>
			PipedriveEndpointOutputSchemas.activityGet.parse({
				success: 'yes',
				data: validActivity,
			}),
		).toThrow(z.ZodError);
		expect(
			PipedriveEndpointOutputSchemas.activityCreate.parse({
				success: true,
				data: validActivity,
			}),
		).toMatchObject({ data: { id: 31 } });
		expect(
			PipedriveEndpointOutputSchemas.activityUpdate.parse({
				success: true,
				data: validActivity,
			}),
		).toMatchObject({ data: { id: 31 } });
		expect(
			PipedriveEndpointOutputSchemas.activityDelete.parse({
				success: true,
				data: { id: 31 },
			}),
		).toMatchObject({ data: { id: 31 } });
	});

	it('validates task beta resource request constraints and response envelopes', () => {
		expect(
			PipedriveEndpointInputSchemas.taskList.parse({
				parent_task_id: null,
				limit: 500,
				cursor: 'opaque',
			}),
		).toMatchObject({ parent_task_id: null, limit: 500 });
		expect(() =>
			PipedriveEndpointInputSchemas.taskList.parse({ limit: 501 }),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.taskCreate.parse({
				title: 'Missing project',
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.taskCreate.parse({
				title: 'Task',
				project_id: 11,
				done: true,
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.taskUpdate.parse({
				id: 42,
				assignee_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.taskUpdate.parse({
				id: 42,
				due_date: '2025-02-30',
			}),
		).toThrow(z.ZodError);
		expect(
			PipedriveEndpointOutputSchemas.taskList.parse({
				success: true,
				data: [validTask],
				additional_data: { next_cursor: null },
			}),
		).toMatchObject({
			data: [{ due_date: null }],
			additional_data: { next_cursor: null },
		});
		for (const schema of [
			PipedriveEndpointOutputSchemas.taskGet,
			PipedriveEndpointOutputSchemas.taskCreate,
			PipedriveEndpointOutputSchemas.taskUpdate,
		]) {
			expect(
				schema.parse({
					success: true,
					data: validTask,
					additional_data: null,
				}),
			).toMatchObject({ data: { id: 42 }, additional_data: null });
		}
		expect(
			PipedriveEndpointOutputSchemas.taskDelete.parse({
				success: true,
				data: { id: 42 },
				additional_data: null,
			}),
		).toMatchObject({ data: { id: 42 }, additional_data: null });
		// Responses are parsed leniently: a value outside the documented range
		// still reads instead of failing the whole call.
		expect(() =>
			PipedriveEndpointOutputSchemas.taskGet.parse({
				success: true,
				data: { ...validTask, priority: -1 },
				additional_data: null,
			}),
		).not.toThrow();
	});

	it('validates person pagination, enum constraints, strict writes, and nullable response fields', () => {
		expect(
			PipedriveEndpointInputSchemas.personList.parse({
				ids: [1, 2],
				include_fields: ['open_deals_count'],
				limit: 500,
				cursor: 'opaque',
			}),
		).toMatchObject({ limit: 500, cursor: 'opaque' });
		expect(() =>
			PipedriveEndpointInputSchemas.personList.parse({ limit: 501 }),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.personGet.parse({
				id: 1,
				include_fields: ['not_a_person_field'],
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.personCreate.parse({
				name: 'Synthetic person',
				callback: 'url',
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.personCreate.parse({
				name: 'Synthetic person',
				marketing_status: 'pending',
			}),
		).toThrow(z.ZodError);
		expect(
			PipedriveEndpointOutputSchemas.personGet.parse({
				success: true,
				data: {
					id: 1,
					name: 'Synthetic person',
					update_time: null,
					picture_id: null,
					postal_address: null,
					provider_added_field: 'retained',
				},
			}),
		).toMatchObject({
			data: {
				update_time: null,
				postal_address: null,
				provider_added_field: 'retained',
			},
		});
		expect(() =>
			PipedriveEndpointOutputSchemas.personGet.parse({
				success: 'yes',
				data: { id: 1 },
			}),
		).toThrow(z.ZodError);
	});

	it('validates organization filters, cursor bounds, include fields, and strict writes', () => {
		expect(
			PipedriveEndpointInputSchemas.organizationList.parse({
				ids: [23, 24],
				include_fields: ['people_count'],
				custom_fields: ['company_size'],
				limit: 500,
				cursor: 'opaque',
			}),
		).toMatchObject({ limit: 500, cursor: 'opaque' });
		expect(() =>
			PipedriveEndpointInputSchemas.organizationList.parse({ limit: 501 }),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.organizationGet.parse({
				id: 23,
				include_fields: ['unknown_field'],
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.organizationCreate.parse({}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.organizationCreate.parse({
				name: 'Synthetic organization',
				callback: 'url',
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.organizationUpdate.parse({
				id: 23,
				address: { country: 7 },
			}),
		).toThrow(z.ZodError);
	});

	it('parses organization list and nullable response fields and rejects malformed envelopes', () => {
		expect(
			PipedriveEndpointOutputSchemas.organizationList.parse({
				success: true,
				data: [validOrganization],
				additional_data: { next_cursor: null },
			}),
		).toMatchObject({
			data: [{ address: null, update_time: null }],
			additional_data: { next_cursor: null },
		});
		expect(
			PipedriveEndpointOutputSchemas.organizationGet.parse({
				success: true,
				data: { ...validOrganization, provider_added_field: 'retained' },
			}),
		).toMatchObject({ data: { provider_added_field: 'retained' } });
		expect(() =>
			PipedriveEndpointOutputSchemas.organizationUpdate.parse({
				success: 'yes',
				data: validOrganization,
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointOutputSchemas.organizationDelete.parse({
				success: true,
				data: { id: '23' },
			}),
		).toThrow(z.ZodError);
	});

	it('validates product filters, writes, search rules, and binary image input', () => {
		expect(
			PipedriveEndpointInputSchemas.productList.parse({
				ids: [52, 53],
				custom_fields: ['field-a'],
				limit: 500,
				sort_by: 'name',
				cursor: 'opaque',
			}),
		).toMatchObject({ limit: 500, cursor: 'opaque' });
		expect(() =>
			PipedriveEndpointInputSchemas.productList.parse({ limit: 501 }),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.productCreate.parse({ name: '' }),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.productCreate.parse({
				name: 'Product',
				visible_to: 2,
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.productUpdate.parse({
				id: 52,
				billing_frequency_cycles: 209,
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.productSearch.parse({ term: 'a' }),
		).toThrow(z.ZodError);
		expect(
			PipedriveEndpointInputSchemas.productSearch.parse({
				term: 'a',
				exact_match: true,
				fields: ['name', 'code'],
				limit: 100,
			}),
		).toMatchObject({ exact_match: true, limit: 100 });
		expect(() =>
			PipedriveEndpointInputSchemas.productVariationCreate.parse({ id: 52 }),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.productVariationUpdate.parse({
				id: 52,
				product_variation_id: 53,
				callback: 'url',
			}),
		).toThrow(z.ZodError);
		const image = new Blob(['image bytes'], { type: 'image/png' });
		expect(
			PipedriveEndpointInputSchemas.productImageUpload.parse({
				id: 52,
				data: image,
			}),
		).toMatchObject({ id: 52, data: image });
		// An agent's JSON carries a link or base64 in place of a Blob.
		expect(
			PipedriveEndpointInputSchemas.productImageUpload.parse({
				id: 52,
				data: { base64: 'aW1hZ2UgYnl0ZXM=', contentType: 'image/png' },
			}),
		).toMatchObject({ id: 52, data: { base64: 'aW1hZ2UgYnl0ZXM=' } });
		expect(() =>
			PipedriveEndpointInputSchemas.productImageUpload.parse({
				id: 52,
				data: 42,
			}),
		).toThrow(z.ZodError);
	});

	it('validates each product response envelope and documented pagination shape', () => {
		const product = {
			id: 52,
			name: 'Synthetic product',
			category: null,
			billing_frequency_cycles: null,
			prices: [{ price: 20, currency: 'USD', product_id: 52 }],
			custom_fields: { tag: ['synthetic'] },
		};
		expect(
			PipedriveEndpointOutputSchemas.productList.parse({
				success: true,
				data: [product],
				additional_data: { next_cursor: null },
			}),
		).toMatchObject({
			data: [{ category: null }],
			additional_data: { next_cursor: null },
		});
		for (const schema of [
			PipedriveEndpointOutputSchemas.productCreate,
			PipedriveEndpointOutputSchemas.productGet,
			PipedriveEndpointOutputSchemas.productUpdate,
			PipedriveEndpointOutputSchemas.productDuplicate,
		]) {
			expect(schema.parse({ success: true, data: product })).toMatchObject({
				data: { id: 52, billing_frequency_cycles: null },
			});
		}
		expect(
			PipedriveEndpointOutputSchemas.productSearch.parse({
				success: true,
				data: { items: [{ result_score: 0.9, item: { id: 52, code: null } }] },
				additional_data: { next_cursor: null },
			}),
		).toMatchObject({ data: { items: [{ item: { code: null } }] } });
		expect(
			PipedriveEndpointOutputSchemas.productDelete.parse({
				success: true,
				data: { id: 52 },
			}),
		).toMatchObject({ data: { id: 52 } });
		const variation = {
			id: 53,
			name: 'Small',
			product_id: 52,
			prices: [{ price: 20, currency: 'USD', product_variation_id: 53 }],
		};
		expect(
			PipedriveEndpointOutputSchemas.productVariationList.parse({
				success: true,
				data: [variation],
				additional_data: { next_cursor: null },
			}),
		).toMatchObject({ data: [{ id: 53 }] });
		for (const schema of [
			PipedriveEndpointOutputSchemas.productVariationCreate,
			PipedriveEndpointOutputSchemas.productVariationUpdate,
		]) {
			expect(schema.parse({ success: true, data: variation })).toMatchObject({
				data: { id: 53 },
			});
		}
		expect(
			PipedriveEndpointOutputSchemas.productVariationDelete.parse({
				success: true,
				data: { id: 53 },
			}),
		).toMatchObject({ data: { id: 53 } });
		const image = {
			id: 54,
			product_id: 52,
			company_id: 'company',
			public_url: 'https://images.example.test/product.png',
			add_time: '2025-01-01T00:00:00Z',
			mime_type: 'image/png',
			name: 'product.png',
		};
		for (const schema of [
			PipedriveEndpointOutputSchemas.productImageGet,
			PipedriveEndpointOutputSchemas.productImageUpload,
			PipedriveEndpointOutputSchemas.productImageUpdate,
		]) {
			expect(schema.parse({ success: true, data: image })).toMatchObject({
				data: { id: 54, product_id: 52 },
			});
		}
		expect(
			PipedriveEndpointOutputSchemas.productImageDelete.parse({
				success: true,
				data: { id: 54 },
			}),
		).toMatchObject({ data: { id: 54 } });
		const follower = { user_id: 7, add_time: '2025-01-01T00:00:00Z' };
		expect(
			PipedriveEndpointOutputSchemas.productFollowerList.parse({
				success: true,
				data: [follower],
				additional_data: { next_cursor: null },
			}),
		).toMatchObject({ data: [follower] });
		expect(
			PipedriveEndpointOutputSchemas.productFollowerCreate.parse({
				success: true,
				data: follower,
			}),
		).toMatchObject({ data: follower });
		expect(
			PipedriveEndpointOutputSchemas.productFollowerChangelog.parse({
				success: true,
				data: [
					{
						action: 'added',
						actor_user_id: 7,
						follower_user_id: 8,
						time: 'now',
					},
				],
				additional_data: { next_cursor: null },
			}),
		).toMatchObject({ data: [{ action: 'added' }] });
		expect(
			PipedriveEndpointOutputSchemas.productFollowerDelete.parse({
				success: true,
				data: { user_id: 7 },
			}),
		).toMatchObject({ data: { user_id: 7 } });
		expect(() =>
			PipedriveEndpointOutputSchemas.productGet.parse({
				success: 'yes',
				data: product,
			}),
		).toThrow(z.ZodError);
	});
});

describe('Pipedrive responses from the live API (sandbox, 11-16)', () => {
	// Trimmed from real api/v2 responses: null custom_fields and conference fields.
	const liveDeal = {
		id: 1,
		title: 'corsair-plugin-test deal',
		creator_user_id: 1,
		value: 1000,
		person_id: null,
		org_id: null,
		stage_id: 1,
		currency: 'USD',
		status: 'open',
		probability: null,
		local_won_date: null,
		custom_fields: null,
		owner_id: 1,
		label_ids: [],
		is_deleted: false,
		origin: 'API',
		origin_id: null,
		channel: null,
		is_archived: false,
		archive_time: null,
	};
	const liveOrganization = {
		id: 1,
		name: 'corsair-plugin-test org',
		custom_fields: null,
		owner_id: 1,
		label_ids: [],
		website: 'https://example.com',
		linkedin: null,
		industry: null,
		annual_revenue: null,
		employee_count: null,
		is_deleted: false,
		address: null,
	};
	const liveActivity = {
		id: 1,
		subject: 'corsair-plugin-test call',
		type: 'call',
		owner_id: 1,
		deal_id: null,
		due_date: '2026-11-16',
		due_time: null,
		done: false,
		busy: false,
		location: null,
		participants: [],
		conference_meeting_client: null,
		conference_meeting_url: null,
		conference_meeting_id: null,
		public_description: null,
		priority: null,
		outcome: null,
		note: 'plugin test',
		private: false,
		custom_fields: null,
	};

	it('parses deals, organizations and activities with null fields', () => {
		// `unknown`: wraps each fixture (deal, organization, activity) in a list envelope.
		const list = (data: unknown) => ({
			success: true,
			data: [data],
			additional_data: { next_cursor: null },
		});
		expect(() =>
			PipedriveEndpointOutputSchemas.dealList.parse(list(liveDeal)),
		).not.toThrow();
		expect(() =>
			PipedriveEndpointOutputSchemas.dealCreate.parse({
				success: true,
				data: liveDeal,
			}),
		).not.toThrow();
		expect(() =>
			PipedriveEndpointOutputSchemas.organizationList.parse(
				list(liveOrganization),
			),
		).not.toThrow();
		expect(() =>
			PipedriveEndpointOutputSchemas.activityList.parse(list(liveActivity)),
		).not.toThrow();
		expect(() =>
			PipedriveEndpointOutputSchemas.activityCreate.parse({
				success: true,
				data: liveActivity,
			}),
		).not.toThrow();
	});
});
