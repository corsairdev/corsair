import { createCorsair } from 'corsair/core';
import { nutshell } from './index';

// Responses recorded from a Nutshell trial account on 2026-11-10, trimmed to
// the fields that matter and with sample names kept. Each one failed the
// plugin's response schema before the fix it sits next to.
const corsair = createCorsair({
	plugins: [nutshell({ key: 'owner@example.com:api-key' })],
});
const api = corsair.nutshell.api;

const meta = { instanceId: '390528', siteId: '' };

function reply(body: unknown, contentType = 'application/json') {
	jest.spyOn(global, 'fetch').mockImplementationOnce(
		async () =>
			new Response(typeof body === 'string' ? body : JSON.stringify(body), {
				status: 200,
				headers: { 'content-type': contentType },
			}),
	);
}

const sampleLead = {
	id: '1001-leads',
	type: 'leads',
	name: 'Lead-1001',
	number: '1001',
	value: { amount: '900.00', currency: 'USD', formatted: '$900.00' },
	dueTime: {
		absoluteLocalizedString: 'November 16, 2026',
		timestamp: 1794831237,
		value: 'November 16, 2026',
	},
	anticipatedClosedTime: {
		absoluteLocalizedString: 'November 16, 2026',
		timestamp: 1794831237,
		value: 'November 16, 2026',
	},
	status: 'open',
	confidence: 20,
	isOverdue: false,
};

// A lead created through the API with no value yet.
const newLead = {
	...sampleLead,
	id: '1004-leads',
	number: '1004',
	value: { amount: 0, currency: 'USD', formatted: '' },
	attributionTracking: {
		gclid: [],
		fbclid: [],
		msclkid: [],
		lifatid: [],
		wbraid: [],
		gbraid: [],
	},
};

const listItem = {
	id: '1001-leads',
	type: 'leads',
	primaryName: 'Lead-1001',
	primaryContact: {
		id: '3-contacts',
		name: 'Morgan Taylor [Sample]',
		htmlUrl: 'https://app.nutshell.com/person/3',
		htmlUrlPath: '/person/3',
		type: 'contacts',
	},
	primaryAccount: {
		id: '3-accounts',
		name: 'EcoTech Solutions [Sample]',
		htmlUrl: 'https://app.nutshell.com/company/3',
		htmlUrlPath: '/company/3',
		type: 'accounts',
	},
	latlon: ['41.8789', '-87.6293'],
	isDeleted: false,
	fields: {
		name: { value: 'Lead-1001' },
		status: { value: { value: 'Open', description: null } },
		createdTime: {
			absoluteLocalizedString: 'November 10, 2026',
			timestamp: 1794312838,
			value: 'Today',
		},
	},
};

const product = {
	id: '1-products',
	type: 'products',
	name: 'corsair-plugin-test',
	productType: 'product',
	prices: {
		'1-markets': {
			amount: '10.00',
			currency: 'USD',
			formatted: '$10.00',
			currencySymbol: '$',
			isAvailable: true,
		},
	},
	price: {
		amount: '10.00',
		currency: 'USD',
		formatted: '$10.00',
		currencySymbol: '$',
		isAvailable: true,
	},
};

const contact = {
	id: '6-contacts',
	type: 'contacts',
	name: 'corsair-plugin-test (renamed)',
	deletedTime: null,
};

describe('Nutshell responses recorded from a live account', () => {
	beforeEach(() => {
		jest.spyOn(global, 'fetch').mockImplementation(async (url) => {
			throw new Error(`unmocked fetch: ${String(url)}`);
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each([
		['audiences.list', 'emAudiences', () => api.audiences.list({})],
		['accountTypes.list', 'accountTypes', () => api.accountTypes.list({})],
		['industries.list', 'industries', () => api.industries.list({})],
		['territories.list', 'territories', () => api.territories.list({})],
		['outcomes.list', 'outcomes', () => api.outcomes.list({})],
		[
			'leads.customFieldAttributes',
			'leads',
			() => api.leads.customFieldAttributes({}),
		],
		[
			'contacts.customFieldAttributes',
			'contacts',
			() => api.contacts.customFieldAttributes({}),
		],
		[
			'accounts.customFieldAttributes',
			'accounts',
			() => api.accounts.customFieldAttributes({}),
		],
		[
			'leads.customfields',
			'customFields',
			() => api.leads.customfields({ id: '1001-leads' }),
		],
		[
			'contacts.customfields',
			'customFields',
			() => api.contacts.customfields({ id: '6-contacts' }),
		],
	] as const)(
		'%s returns the resource envelope, not a bare array',
		async (_op, key, call) => {
			const body = {
				meta,
				links: {},
				[key]: [
					{ id: `1-${key}`, type: key, name: 'Accounting', modifiedTime: 0 },
				],
			};
			reply(body);
			await expect(call()).resolves.toEqual(body);
		},
	);

	it('leads.list and leads.get return the lead number as a string and times as objects', async () => {
		const body = { meta, links: {}, leads: [sampleLead, newLead] };
		reply(body);
		await expect(api.leads.list({})).resolves.toEqual(body);
		reply({ meta, links: {}, leads: [newLead] });
		await expect(api.leads.get({ id: '1004-leads' })).resolves.toMatchObject({
			leads: [{ number: '1004', value: { amount: 0 } }],
		});
	});

	it.each([
		['leads', () => api.leads.listItems({})],
		['contacts', () => api.contacts.listItems({})],
		['accounts', () => api.accounts.listItems({})],
	] as const)(
		'%s.listItems returns contact objects, a lat/lon pair and a field map',
		async (_g, call) => {
			const body = { meta, links: {}, listItems: [listItem] };
			reply(body);
			await expect(call()).resolves.toEqual(body);
		},
	);

	it('events.list returns changes whose values are strings, null or objects', async () => {
		const body = {
			meta,
			links: {},
			events: [
				{
					id: '110-events',
					type: 'events',
					createdTime: 1794313113,
					actorType: 'users',
					payloadType: 'leads',
					action: 'update',
					changes: [
						{ attribute: 'status', oldValue: '0', newValue: '1' },
						{ attribute: 'log_note', oldValue: null, newValue: '2-notes' },
						{ attribute: 'value', oldValue: '', newValue: '$1,500.00' },
						{
							attribute: 'stage',
							oldValue: null,
							newValue: {
								id: '102-stages',
								type: 'stages',
								name: 'Pitch',
								position: 2,
							},
						},
					],
					count: null,
				},
			],
		};
		reply(body);
		await expect(api.events.list({})).resolves.toEqual(body);
	});

	it('stageSets.list returns a numeric status', async () => {
		const body = {
			meta,
			links: {},
			stagesets: [
				{
					id: '1-stagesets',
					type: 'stagesets',
					name: 'Default Pipeline',
					default: true,
					canAccess: true,
					status: 1,
					links: { stages: ['101-stages', '102-stages', '103-stages'] },
				},
			],
		};
		reply(body);
		await expect(api.stageSets.list({})).resolves.toEqual(body);
	});

	it('leads.stages returns each stage with a links object', async () => {
		const body = {
			meta,
			links: {},
			stages: [
				{
					id: '101-stages',
					type: 'stages',
					name: 'Qualify',
					position: 1,
					links: { stageset: '1-stagesets' },
				},
			],
		};
		reply(body);
		await expect(api.leads.stages({ id: '1004-leads' })).resolves.toEqual(body);
	});

	it('products.list and products.get return prices with a string amount', async () => {
		const body = { meta, links: {}, products: [product] };
		reply(body);
		await expect(api.products.list({})).resolves.toEqual(body);
		reply(body);
		await expect(api.products.get({ id: '1-products' })).resolves.toEqual(body);
	});

	it('a deleted lead or product carries deletedTime as a Unix time', async () => {
		const deletedProduct = {
			...product,
			modifiedTime: 1794313506,
			deletedTime: 1794313506,
		};
		const body = { meta, links: {}, products: [deletedProduct] };
		reply(body);
		await expect(api.products.delete({ id: '1-products' })).resolves.toEqual(
			body,
		);
		const deletedLead = { ...newLead, deletedTime: 1794313450 };
		reply({ meta, links: {}, leads: [deletedLead] });
		await expect(api.leads.get({ id: '1004-leads' })).resolves.toMatchObject({
			leads: [{ deletedTime: 1794313450 }],
		});
	});

	it.each([
		['leads', () => api.leads.listFields({})],
		['contacts', () => api.contacts.listFields({})],
		['accounts', () => api.accounts.listFields({})],
	] as const)(
		'%s.listFields parses the application/schema+json answer',
		async (_g, call) => {
			const schema = {
				$schema: 'http://json-schema.org/draft-04/schema#',
				type: 'object',
				description:
					'The schema for a single resource in the Nutshell JSON-API(ish) REST API',
				maxMergeCount: 3,
				properties: { id: { type: 'string' } },
			};
			reply(JSON.stringify(schema), 'application/schema+json');
			await expect(call()).resolves.toEqual(schema);
		},
	);

	it('tasks.update returns the task, not an empty body', async () => {
		const body = {
			meta,
			links: {},
			tasks: [
				{
					id: '2-tasks',
					type: 'tasks',
					title: 'corsair-plugin-test task (renamed)',
				},
			],
		};
		reply(body);
		await expect(
			api.tasks.update({
				id: '2-tasks',
				body: [
					{
						op: 'replace',
						path: '/tasks/0/title',
						value: 'corsair-plugin-test task (renamed)',
					},
				],
			}),
		).resolves.toEqual(body);
	});

	it('contacts.update and contacts.delete return the contact, not an empty body', async () => {
		const body = { meta, links: {}, contacts: [contact] };
		reply(body);
		await expect(
			api.contacts.update({
				id: '6-contacts',
				body: [
					{
						op: 'replace',
						path: '/contacts/0/name',
						value: 'corsair-plugin-test (renamed)',
					},
				],
			}),
		).resolves.toEqual(body);
		reply(body);
		await expect(api.contacts.delete({ id: '6-contacts' })).resolves.toEqual(
			body,
		);
	});
});
