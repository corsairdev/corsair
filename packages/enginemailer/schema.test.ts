import type { ZodTypeAny } from 'zod';
import {
	EnginemailerEndpointInputSchemas,
	EnginemailerEndpointOutputSchemas,
} from './endpoints/types';

// String-keyed views of the schema maps (a widening annotation, not a cast),
// so the table-driven tests below can look schemas up by operation name.
const inputSchemas: Record<string, ZodTypeAny> =
	EnginemailerEndpointInputSchemas;
const outputSchemas: Record<string, ZodTypeAny> =
	EnginemailerEndpointOutputSchemas;

import { EnginemailerSchema } from './schema';

describe('Enginemailer schema', () => {
	it('declares a semver version', () => {
		expect(EnginemailerSchema.version).toBeDefined();
		expect(EnginemailerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EnginemailerSchema.entities).toBe('object');
		expect(EnginemailerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EnginemailerSchema.entities))).toBe(true);
		for (const entity of Object.values(EnginemailerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Enginemailer endpoint schemas', () => {
	// Minimal inputs keyed by operation; each is parsed by its own schema below.
	const inputs: Record<string, unknown> = {
		getSubscriber: { email: 'person@example.com' },
		activateSubscriber: { email: 'person@example.com' },
		insertSubscriber: { email: 'person@example.com' },
		updateSubscriber: { email: 'person@example.com' },
		unsubscribeSubscriber: { email: 'person@example.com' },
		getSubcategories: {},
		updateCategory: { categoryID: 1, categoryName: 'Customers' },
		getCustomFields: {},
		batchUpdateSubscribers: { subscribers: [{ email: 'person@example.com' }] },
		batchUpdateStatus: { ID: 1 },
		deleteSubscriber: { email: 'person@example.com' },
		listCampaigns: {},
		createCampaign: {
			CampaignName: 'Test',
			SenderName: 'Sender',
			SenderEmail: 'sender@example.com',
			Subject: 'Subject',
			Content: '<p>Hi</p>',
		},
		updateCampaign: {
			CampaignID: 1,
			CampaignName: 'Test',
			SenderName: 'Sender',
			SenderEmail: 'sender@example.com',
			Subject: 'Subject',
			Content: '<p>Hi</p>',
		},
		deleteCampaign: { campaignid: 1 },
		assignRecipientList: { campaignid: 1 },
		deleteRecipientList: { campaignid: 1 },
		pauseCampaign: { campaignid: 1 },
		sendCampaign: { campaignid: 1 },
		addOrUpdateSubscriber: { email: 'person@example.com' },
		findSubscriber: { email: 'person@example.com' },
		deactivateSubscriber: { email: 'person@example.com' },
		deleteN8nSubscriber: { email: 'person@example.com' },
		sendEmail: { email: 'person@example.com', type: 'html' },
		tagSubscriber: { email: 'person@example.com', subcategories: [1] },
		untagSubscriber: { email: 'person@example.com', subcategories: [1] },
		newSubscribers: {},
		unsubscribedSubscribers: {},
		taggedSubscribers: {},
		deletedSubscribers: {},
		untaggedSubscribers: {},
		modifiedSubscribers: {},
		autoresponderTriggered: {},
		autoresponderCompleted: {},
		connect: {},
		listForms: {},
		listPages: {},
		listPopups: {},
	};

	it.each(Object.keys(EnginemailerEndpointInputSchemas))(
		'%s accepts its minimal valid input',
		(name) => {
			expect(inputSchemas[name]?.safeParse(inputs[name])?.success).toBe(true);
			const rawArrayOperations = new Set([
				'newSubscribers',
				'unsubscribedSubscribers',
				'taggedSubscribers',
				'deletedSubscribers',
				'untaggedSubscribers',
				'modifiedSubscribers',
				'autoresponderTriggered',
				'autoresponderCompleted',
				'listForms',
				'listPages',
				'listPopups',
			]);
			const rawOperations = new Set([
				'addOrUpdateSubscriber',
				'findSubscriber',
				'deactivateSubscriber',
				'deleteN8nSubscriber',
				'sendEmail',
				'tagSubscriber',
				'untagSubscriber',
				'connect',
			]);
			const output = rawArrayOperations.has(name)
				? []
				: rawOperations.has(name)
					? { ok: true }
					: { Result: {} };
			expect(outputSchemas[name]?.safeParse(output)?.success).toBe(true);
		},
	);

	it.each([
		'getSubscriber',
		'activateSubscriber',
		'insertSubscriber',
		'updateSubscriber',
		'unsubscribeSubscriber',
		'deleteSubscriber',
	])('%s rejects a missing email', (name) => {
		expect(inputSchemas[name]?.safeParse({})?.success).toBe(false);
	});

	it('preserves new-subscriber source filters', () => {
		const input = {
			filter_form: 1,
			filter_page: 2,
			filter_popups: 3,
		};

		expect(
			EnginemailerEndpointInputSchemas.newSubscribers.parse(input),
		).toEqual(input);
	});

	it('accepts the official N8N All filter value', () => {
		expect(
			EnginemailerEndpointInputSchemas.newSubscribers.parse({
				filter_form: 'All',
				filter_page: 12,
				filter_popups: 'All',
			}),
		).toEqual({
			filter_form: 'All',
			filter_page: 12,
			filter_popups: 'All',
		});
	});

	it('accepts the documented bare batchUpdateStatus body', () => {
		for (const body of [
			{ Status: 'Completed', StatusCode: '200' },
			{ Status: 'Processing', StatusCode: '201' },
		]) {
			expect(
				EnginemailerEndpointOutputSchemas.batchUpdateStatus.parse(body),
			).toEqual(body);
		}
	});

	it('keeps unsubscribed autoresponder and campaign filters', () => {
		const input = {
			filter: 'Campaign' as const,
			filter_campaign: 42,
			filter_autoresponder: 'All' as const,
		};

		expect(
			EnginemailerEndpointInputSchemas.unsubscribedSubscribers.parse(input),
		).toEqual(input);
	});

	it('caps polling limit at the 50 records the API returns', () => {
		expect(
			EnginemailerEndpointInputSchemas.deletedSubscribers.safeParse({
				limit: 51,
			}).success,
		).toBe(false);
	});

	it('takes substitution tags as the list of Key/Value pairs n8n sends', () => {
		const base = { email: 'person@example.com', type: 'template' as const };
		expect(
			EnginemailerEndpointInputSchemas.sendEmail.safeParse({
				...base,
				template_id: 7,
				substitution_tags: [{ Key: 'firstname', Value: 'John' }],
			}).success,
		).toBe(true);
		expect(
			EnginemailerEndpointInputSchemas.sendEmail.safeParse({
				...base,
				substitution_tags: { firstname: 'John' },
			}).success,
		).toBe(false);
	});

	it('requires a key on every custom field', () => {
		expect(
			EnginemailerEndpointInputSchemas.insertSubscriber.safeParse({
				email: 'person@example.com',
				customfields: [{ customfield_value: 'KL' }],
			}).success,
		).toBe(false);
	});

	it('requires CategoryList and FilterType in a recipient filter', () => {
		expect(
			EnginemailerEndpointInputSchemas.assignRecipientList.safeParse({
				campaignid: 1,
				FilterBy: 2,
				data: { CategoryList: [1, 2], FilterType: 'OR' },
			}).success,
		).toBe(true);
		expect(
			EnginemailerEndpointInputSchemas.assignRecipientList.safeParse({
				campaignid: 1,
				FilterBy: 2,
				data: { CategoryList: [1, 2], FilterType: 'XOR' },
			}).success,
		).toBe(false);
	});

	it.each(['2026-10-29T12:34:56.000Z', '2026-10-29 12:34:56'])(
		'accepts polling timestamp %s unchanged',
		(lastpollingdate) => {
			expect(
				EnginemailerEndpointInputSchemas.newSubscribers.parse({
					lastpollingdate,
				}),
			).toEqual({ lastpollingdate });
		},
	);
});
