import { logEventFromContext } from 'corsair/core';
import {
	Addresses,
	Campaigns,
	Events,
	Groups,
	Recipients,
	Reporting,
	Selections,
} from './endpoints';
import { resolveWebhookSecret, stannp } from './index';
import { StannpCampaignStatusSchema } from './webhooks/types';

// Response shapes captured from a live Stannp free account (11-20, UK
// platform), trimmed. They differ from the documented examples: numbers
// where the docs show strings, bare ids where they show objects.

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: 'sp-test-key', options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

const liveRecipient = {
	id: 367524931,
	account_id: 96038,
	email: null,
	title: null,
	firstname: 'Corsair',
	lastname: 'PluginTest',
	company: null,
	address1: 'Unit 12 Taw Trade Park',
	address2: null,
	address3: '',
	city: 'Barnstaple',
	country: 'GB',
	postcode: 'EX31 1JZ',
	blacklist: '0',
	created: '2026-11-20 11:37:19',
	updated: '2026-11-20 11:37:19',
	licenced: 0,
};

const liveCampaign = {
	id: 587001,
	account_id: 96038,
	name: 'corsair-plugin-test',
	template_id: 911680,
	type: 'a6-postcard',
	trigger_date: '',
	send_date: null,
	trigger_offset: 0,
	created: '2026-11-20T11:37:51Z',
	updated: '2026-11-20T11:37:51Z',
	status: 'draft',
	recipients_group: 565616,
	recipients_filter: '',
	recipients_validated: 'valid',
	recipients: 0,
	recipients_not_valid: 0,
	dispatched: 0,
	cost: 0,
	voucher_code: '',
	size: 'A6',
};

describe('live response shapes', () => {
	it('recipients.get accepts numeric ids and keeps them as strings', async () => {
		respond({ success: true, data: liveRecipient });

		const result = (await invoke(Recipients.get, { id: 367524931 })) as {
			id: string;
			account_id: string;
		};
		expect(result.id).toBe('367524931');
		expect(result.account_id).toBe('96038');
	});

	it('campaigns.get accepts numeric ids and counts', async () => {
		respond({ success: true, data: liveCampaign });

		const result = (await invoke(Campaigns.get, { id: 587001 })) as {
			id: string;
			recipients: string;
		};
		expect(result.id).toBe('587001');
		expect(result.recipients).toBe('0');
	});

	it('campaigns.create accepts the bare id the API returns', async () => {
		respond({ success: true, data: '587001' });

		await expect(
			invoke(Campaigns.create, {
				name: 'corsair-plugin-test',
				type: 'a6-postcard',
				front: 'https://example.com/front.jpg',
				size: 'A6',
				group_id: 565616,
			}),
		).resolves.toEqual({ id: '587001' });
	});

	it('campaigns.create still accepts the documented { id } object', async () => {
		respond({ success: true, data: { id: '266' } });

		await expect(
			invoke(Campaigns.create, {
				name: 'x',
				type: 'letter',
				group_id: 1,
			}),
		).resolves.toEqual({ id: '266' });
	});

	it('events.create accepts the string id the API returns', async () => {
		respond({ success: true, data: '0' });

		await expect(
			invoke(Events.create, {
				recipient_id: '367524931',
				name: 'CORSAIR_TEST',
			}),
		).resolves.toBe('0');
	});

	it('groups.delete accepts the 1 the API returns without delete_recipients', async () => {
		respond({ success: true, data: 1 });

		await expect(invoke(Groups.remove, { id: 565625 })).resolves.toBe(true);
	});

	it('selections.create accepts the boolean the API returns', async () => {
		respond({ success: true, data: true });

		await expect(
			invoke(Selections.create, { group_id: 565616, name: 'x' }),
		).resolves.toBe(true);
	});
});

describe('input checks', () => {
	it('campaigns.create refuses artwork without a size, before any request', async () => {
		await expect(
			invoke(Campaigns.create, {
				name: 'x',
				type: 'a6-postcard',
				front: 'https://example.com/front.jpg',
				group_id: 1,
			}),
		).rejects.toThrow(/size/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reporting.list refuses a tag without a status instead of dropping it', async () => {
		await expect(
			invoke(Reporting.list, {
				startdate: '2026-01-01',
				enddate: '2026-01-31',
				tag: 'tag123',
			}),
		).rejects.toThrow(/status/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('addresses.validate accepts a UK address with a postcode and no city', async () => {
		respond({
			success: true,
			data: { address1: 'Unit 12 Taw Trade Park', is_valid: true },
		});

		await invoke(Addresses.validate, {
			address1: 'Unit 12 Taw Trade Park',
			postcode: 'EX31 1JZ',
			country: 'GB',
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('webhooks', () => {
	it('rejects instead of accepting unverified when the stored secret cannot be read', async () => {
		const keys = {
			get_webhook_signature: jest
				.fn()
				.mockRejectedValue(new Error('decrypt failed')),
		};
		await expect(resolveWebhookSecret({}, keys)).rejects.toThrow(
			'decrypt failed',
		);
		const plugin = stannp();
		await expect(
			plugin.keyBuilder?.({ keys, authType: 'api_key' } as never, 'webhook'),
		).rejects.toThrow('decrypt failed');
	});

	it('still accepts deliveries unverified when no secret is stored', async () => {
		const keys = { get_webhook_signature: jest.fn().mockResolvedValue(null) };
		await expect(resolveWebhookSecret({}, keys)).resolves.toBeUndefined();
	});

	it('parses campaign deliveries with numeric ids', () => {
		const parsed = StannpCampaignStatusSchema.parse({
			webhook_id: 12,
			event: 'campaign_status',
			created: '2026-11-20T11:37:51Z',
			retries: 0,
			campaigns: [{ id: 123, template_id: 456, status: 'dispatched' }],
		});
		expect(parsed.campaigns[0]?.id).toBe('123');
		expect(parsed.campaigns[0]?.template_id).toBe('456');
	});
});
