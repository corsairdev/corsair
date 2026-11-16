import { ZodError } from 'zod';
import {
	JotformEndpointInputSchemas,
	JotformEndpointOutputSchemas,
} from './endpoints/types';
import { jotform, jotformEndpointSchemas } from './index';

describe('Jotform Schemas & Registry Consistency', () => {
	it('keeps endpoint registry, schema map and metadata in sync', () => {
		const plugin = jotform();
		const nestedOps: string[] = [];
		const endpoints = plugin.endpoints ?? {};

		for (const [groupKey, groupVal] of Object.entries(endpoints)) {
			if (typeof groupVal === 'object' && groupVal !== null) {
				for (const opKey of Object.keys(groupVal)) {
					nestedOps.push(`${groupKey}.${opKey}`);
				}
			}
		}

		const schemaKeys = Object.keys(jotformEndpointSchemas).sort();
		const metaKeys = Object.keys(plugin.endpointMeta ?? {}).sort();
		const inputSchemaKeys = Object.keys(JotformEndpointInputSchemas).sort();
		const outputSchemaKeys = Object.keys(JotformEndpointOutputSchemas).sort();
		const registeredOps = nestedOps.sort();

		expect(schemaKeys).toEqual(registeredOps);
		expect(metaKeys).toEqual(registeredOps);
		expect(inputSchemaKeys).toEqual(registeredOps);
		expect(outputSchemaKeys).toEqual(registeredOps);
		expect(registeredOps.length).toBe(45);
	});

	it('validates user input and output schemas', () => {
		// Valid user.get input
		expect(JotformEndpointInputSchemas['user.get'].parse({})).toEqual({});
		expect(() =>
			JotformEndpointInputSchemas['user.get'].parse({ extra: 'field' }),
		).toThrow(ZodError);

		// Valid user.getForms pagination input
		expect(
			JotformEndpointInputSchemas['user.getForms'].parse({
				offset: 20,
				limit: 50,
				filter: '{"new":"1"}',
				orderby: 'created_at',
			}),
		).toEqual({
			offset: 20,
			limit: 50,
			filter: '{"new":"1"}',
			orderby: 'created_at',
		});

		// Negative offset rejected
		expect(() =>
			JotformEndpointInputSchemas['user.getForms'].parse({ offset: -1 }),
		).toThrow(ZodError);

		// Limit exceeding 1000 rejected
		expect(() =>
			JotformEndpointInputSchemas['user.getForms'].parse({ limit: 1001 }),
		).toThrow(ZodError);

		// Output schema parses user response
		const validUserResponse = {
			responseCode: 200,
			message: 'success',
			content: {
				username: 'johnsmith',
				name: 'John Smith',
				email: 'john@example.com',
				website: 'https://example.com',
				status: 'ACTIVE',
			},
			'limit-left': 4999,
		};
		expect(
			JotformEndpointOutputSchemas['user.get'].parse(validUserResponse),
		).toMatchObject(validUserResponse);

		// Invalid output rejected (missing required responseCode/message/content)
		expect(() =>
			JotformEndpointOutputSchemas['user.get'].parse({ invalid: true }),
		).toThrow(ZodError);
	});

	it('validates form input and output schemas', () => {
		expect(
			JotformEndpointInputSchemas['forms.get'].parse({ id: '123456789' }),
		).toEqual({ id: '123456789' });

		// Empty ID rejected
		expect(() =>
			JotformEndpointInputSchemas['forms.get'].parse({ id: '' }),
		).toThrow(ZodError);

		// Valid form creation input
		const validCreateForm = {
			questions: [
				{
					type: 'control_head',
					text: 'Form Title',
					order: '1',
					name: 'Header',
				},
			],
			properties: {
				title: 'New Contact Form',
				height: '600',
			},
		};
		expect(
			JotformEndpointInputSchemas['forms.create'].parse(validCreateForm),
		).toEqual(validCreateForm);

		// Valid forms.get output
		const validFormResponse = {
			responseCode: 200,
			message: 'success',
			content: {
				id: '123456789',
				title: 'Contact Form',
				status: 'ENABLED',
				created_at: '2026-01-01 12:00:00',
			},
			'limit-left': 4990,
		};
		expect(
			JotformEndpointOutputSchemas['forms.get'].parse(validFormResponse),
		).toMatchObject(validFormResponse);
	});

	it('validates submissions, reports and labels schemas', () => {
		// Submissions
		expect(
			JotformEndpointInputSchemas['submissions.get'].parse({
				id: 'sub-123',
			}),
		).toEqual({ id: 'sub-123' });

		expect(
			JotformEndpointInputSchemas['submissions.update'].parse({
				id: 'sub-123',
				submission: { '1': 'Updated Answer' },
			}),
		).toEqual({
			id: 'sub-123',
			submission: { '1': 'Updated Answer' },
		});

		// Reports
		expect(
			JotformEndpointInputSchemas['reports.get'].parse({
				id: 'rep-123',
			}),
		).toEqual({ id: 'rep-123' });

		// Labels
		expect(
			JotformEndpointInputSchemas['labels.addResources'].parse({
				id: 'label-123',
				resources: [{ id: 'form-123', type: 'form' }],
			}),
		).toEqual({
			id: 'label-123',
			resources: [{ id: 'form-123', type: 'form' }],
		});

		// System
		expect(
			JotformEndpointInputSchemas['system.getPlan'].parse({
				planName: 'FREE',
			}),
		).toEqual({ planName: 'FREE' });
	});
});

describe('Jotform risk levels (R8)', () => {
	it('marks submissions destructive because they run the form emails', () => {
		const meta = jotform().endpointMeta ?? {};
		expect(meta['forms.createSubmission']?.riskLevel).toBe('destructive');
		expect(meta['forms.createSubmissions']?.riskLevel).toBe('destructive');
	});

	it('takes no account password through tool input', () => {
		const ops = Object.keys(JotformEndpointInputSchemas);
		expect(ops).not.toContain('user.login');
		expect(ops).not.toContain('user.register');
	});

	it('has no folder operations: Jotform answers 400 "deprecated" on every folder route', () => {
		const ops = Object.keys(JotformEndpointInputSchemas);
		expect(ops.filter((op) => /folder/i.test(op))).toEqual([]);
		expect(Object.keys(jotform().endpoints ?? {})).not.toContain('folders');
	});

	it('accepts a null info field in the response envelope', () => {
		const parsed = JotformEndpointOutputSchemas['system.getPlan'].safeParse({
			responseCode: 200,
			message: 'success',
			content: { name: 'FREE' },
			info: null,
		});
		expect(parsed.success).toBe(true);
	});
});

describe('Jotform path segments', () => {
	it('rejects dot segments and non-numeric question ids before any request', () => {
		const del = JotformEndpointInputSchemas['forms.deleteQuestion'];
		expect(del.safeParse({ id: '123456789', qid: '..' }).success).toBe(false);
		expect(del.safeParse({ id: '..', qid: '3' }).success).toBe(false);
		expect(del.safeParse({ id: '123456789', qid: '3' }).success).toBe(true);
		expect(
			JotformEndpointInputSchemas['submissions.delete'].safeParse({ id: '.' })
				.success,
		).toBe(false);
	});
});

// Shapes seen on the live API (11-16): Jotform's PHP backend sends an empty
// array where it has nothing to return, and a list where we expected a map.
describe('Jotform live response shapes', () => {
	const envelope = (content: unknown) => ({
		responseCode: 200,
		message: 'success',
		content,
		duration: '30ms',
		info: null,
		'limit-left': 930,
	});

	it('user.getSettingByKey: {key: value} when set, [] when unset', () => {
		const schema = JotformEndpointOutputSchemas['user.getSettingByKey'];
		expect(
			schema.safeParse(envelope({ company: 'Corsair Plugin Test' })).success,
		).toBe(true);
		expect(schema.safeParse(envelope([])).success).toBe(true);
	});

	it('user.getLabels: [] before any label, then the root label with sublabels', () => {
		const schema = JotformEndpointOutputSchemas['user.getLabels'];
		expect(schema.safeParse(envelope([])).success).toBe(true);
		expect(
			schema.safeParse(
				envelope({
					id: 'root',
					owner: 'corsairtests',
					owner_type: 'USER',
					created_at: '2026-11-16 02:25:09',
					sublabels: [
						{
							id: 'l1',
							name: 'corsair-plugin-test',
							order: '0',
							color: '#F09E39',
							parent_label_id: 'root',
							sublabels: [],
						},
					],
				}),
			).success,
		).toBe(true);
	});

	it('forms.createQuestions: a list of the added questions', () => {
		const schema = JotformEndpointOutputSchemas['forms.createQuestions'];
		expect(
			schema.safeParse(
				envelope([
					{
						type: 'control_textarea',
						text: 'Bulk',
						order: '2',
						name: 'bulk',
						qid: 2,
					},
				]),
			).success,
		).toBe(true);
	});
});
