import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gorgiasEndpointSchemas } from './index';

type OperationKey = keyof typeof gorgiasEndpointSchemas;

// `unknown` because the fixture holds raw example responses copied from the Gorgias reference.
const referenceResponses: Record<string, unknown> = JSON.parse(
	readFileSync(join(__dirname, 'reference-responses.json'), 'utf8'),
);

// Cursor-paginated lists. Gorgias wraps them in { data, object, uri, meta }
// (https://developers.gorgias.com/reference/pagination), even where a reference
// page shows only the bare array of items.
const paginatedLists: OperationKey[] = [
	'customers.listCustomers',
	'events.listEvents',
	'macros.listMacros',
	'rules.listRules',
	'satisfactionSurveys.listSatisfactionSurveys',
	'teams.listTeams',
	'users.listUsers',
	'voiceCallEvents.listVoiceCallEvents',
	'voiceCallRecordings.listVoiceCallRecordings',
	'widgets.listWidgets',
	'customFields.listCustomFields',
	'integrations.listIntegrations',
	'jobs.listJobs',
	'tags.listTags',
	'tickets.listTickets',
	'ticketMessages.listMessages',
	'ticketMessages.listTicketMessages',
	'views.listViews',
	'voiceCalls.listVoiceCalls',
];

function isOperationKey(key: string): key is OperationKey {
	return key in gorgiasEndpointSchemas;
}

// `unknown` because the envelope wraps whichever item type the operation lists.
function envelope(data: unknown, uri: string) {
	return {
		data,
		object: 'list',
		uri,
		meta: { prev_cursor: null, next_cursor: 'WyJuZXh0IiwgMjksIDkyOV0=' },
	};
}

describe('Gorgias response schemas', () => {
	it.each(Object.entries(referenceResponses))(
		'%s parses the example response from the Gorgias reference',
		(key, example) => {
			if (!isOperationKey(key)) throw new Error(`Unknown operation ${key}`);
			const response =
				paginatedLists.includes(key) && Array.isArray(example)
					? envelope(example, '/api/example')
					: example;
			const result = gorgiasEndpointSchemas[key].output.safeParse(response);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);

	it.each(paginatedLists)(
		'%s parses the paginated list envelope with a relative uri',
		(key) => {
			const result = gorgiasEndpointSchemas[key].output.safeParse(
				envelope([], '/api/example?limit=30'),
			);
			expect(result.error?.issues ?? []).toEqual([]);
			expect(result.data).toMatchObject({
				meta: { next_cursor: 'WyJuZXh0IiwgMjksIDkyOV0=' },
			});
		},
	);

	it('keeps a ticket readable when Gorgias adds fields or enum values', () => {
		const ticket = {
			id: 1,
			status: 'pending-review',
			channel: 'tiktok-shop-new',
			via: 'api',
			created_datetime: '2019-11-16T15:59:41.966927',
			undocumented_field: { nested: true },
		};
		const result =
			gorgiasEndpointSchemas['tickets.getTicket'].output.safeParse(ticket);
		expect(result.error?.issues ?? []).toEqual([]);
	});

	it('still rejects unknown input fields', () => {
		const result = gorgiasEndpointSchemas['tickets.getTicket'].input.safeParse({
			path: { id: 1 },
			unexpected: true,
		});
		expect(result.success).toBe(false);
	});
});

// Real responses from a Gorgias trial account (live run, 11-15), trimmed. Sub-resource
// lists come back as { data: [...] } without object/uri/meta, and custom field values
// are the stored scalar (a string here), not an object.
const liveResponses: Record<string, unknown> = JSON.parse(
	readFileSync(join(__dirname, 'live-responses.json'), 'utf8'),
);

describe('Gorgias live responses', () => {
	it.each(Object.entries(liveResponses))(
		'%s parses the response the live API returned',
		(key, response) => {
			if (!isOperationKey(key)) throw new Error(`Unknown operation ${key}`);
			const result = gorgiasEndpointSchemas[key].output.safeParse(response);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);

	it('accepts scalar values when setting customer custom fields in bulk', () => {
		const result = gorgiasEndpointSchemas[
			'customers.updateCustomerCustomFieldValues'
		].input.safeParse({
			path: { customer_id: 1 },
			body: [
				{ id: 1, value: 'gold' },
				{ id: 2, value: 3 },
				{ id: 3, value: true },
			],
		});
		expect(result.error?.issues ?? []).toEqual([]);
	});

	it('accepts a null deactivated_datetime to restore an archived custom field', () => {
		const result = gorgiasEndpointSchemas[
			'customFields.updateCustomField'
		].input.safeParse({
			path: { id: 1 },
			body: { deactivated_datetime: null },
		});
		expect(result.error?.issues ?? []).toEqual([]);
	});

	it('accepts null to restore a trashed ticket or reactivate a rule, integration or widget', () => {
		const cases: [OperationKey, object][] = [
			[
				'tickets.updateTicket',
				{ path: { id: 1 }, body: { trashed_datetime: null } },
			],
			[
				'rules.createRule',
				{ body: { name: 'r', code: 'x', deactivated_datetime: null } },
			],
			[
				'rules.updateRule',
				{ path: { id: 1 }, body: { deactivated_datetime: null } },
			],
			[
				'integrations.updateIntegration',
				{ path: { id: 1 }, body: { deactivated_datetime: null } },
			],
			[
				'widgets.updateWidget',
				{ path: { id: 1 }, body: { deactivated_datetime: null } },
			],
		];
		for (const [key, input] of cases) {
			const issues =
				gorgiasEndpointSchemas[key].input.safeParse(input).error?.issues ?? [];
			expect(
				issues.filter(
					(issue) =>
						issue.path.includes('deactivated_datetime') ||
						issue.path.includes('trashed_datetime'),
				),
			).toEqual([]);
		}
	});

	it('parses fractional reporting values such as an average survey score', () => {
		const result = gorgiasEndpointSchemas[
			'reportingStatistics.getStatistic'
		].output.safeParse({
			object: 'list',
			data: [{ averageSurveyScore: 4.25, count: 3 }],
		});
		expect(result.error?.issues ?? []).toEqual([]);
	});

	it('parses the reference CustomField definition without data_type', () => {
		const result = gorgiasEndpointSchemas[
			'customFields.getCustomField'
		].output.safeParse({
			id: 1,
			label: 'Order id',
			definition: { input_settings: { placeholder: 'ABC-123' } },
		});
		expect(result.error?.issues ?? []).toEqual([]);
	});

	it('validates a 20 MiB base64 upload without overflowing the regex stack', () => {
		const schema = gorgiasEndpointSchemas['files.uploadFiles'].input;
		const file = (contentBase64: string) => ({
			body: {
				files: [
					{
						filename: 'a.bin',
						contentType: 'application/octet-stream',
						contentBase64,
					},
				],
			},
		});
		const big = Buffer.alloc(20 * 1024 * 1024, 7).toString('base64');
		expect(schema.safeParse(file(big)).success).toBe(true);
		for (const ok of ['', 'QQ==', 'QUI=', 'QUJD'])
			expect(schema.safeParse(file(ok)).success).toBe(true);
		for (const bad of ['QQ', 'QQ=', 'Q===', 'QQ==QQ==', 'QU!D'])
			expect(schema.safeParse(file(bad)).success).toBe(false);
	});
});
