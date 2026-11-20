import { logEventFromContext } from 'corsair/core';
import {
	Account,
	Addresses,
	Campaigns,
	Events,
	Files,
	Groups,
	Letters,
	Postcards,
	Recipients,
	Reporting,
	Selections,
	Sms,
	Tools,
} from './endpoints';
import {
	availableDates,
	badKey,
	balance,
	campaign,
	campaignCost,
	folder,
	group,
	letter,
	mailpieceCreated,
	postcard,
	recipient,
	recipientCreated,
	reportingMailpiece,
	reportingSummary,
	sms,
	template,
	topup,
	validatedAddress,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'sp-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key and
	// ctx.options.region).
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const params = new URLSearchParams(String(init.body));
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		form: Object.fromEntries(params),
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api-us1.stannp.com');
	expect(sent.headers.get('authorization')).toBe(
		`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
	);
}

beforeEach(() => {
	// Queued responses come first; any request beyond them fails instead of
	// reaching the real API.
	fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockRejectedValue(new Error('unexpected request in a unit test'));
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account', () => {
	it('balance GETs v1/accounts/balance and unwraps the envelope', async () => {
		respond({ success: true, data: balance });

		await expect(invoke(Account.balance, {})).resolves.toEqual(balance);
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/accounts/balance',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'stannp.account.balance',
			{ balance: '214.4200' },
			'completed',
		);
	});

	it('topup POSTs the amount to v1/accounts/topup', async () => {
		respond({ success: true, data: topup });

		await expect(invoke(Account.topup, { net: '10.00' })).resolves.toEqual(
			topup,
		);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/accounts/topup',
			form: { net: '10.00' },
		});
	});

	it('sends the idempotency key as a header when set', async () => {
		respond({ success: true, data: topup });

		await invoke(Account.topup, { net: '10.00', idempotencyKey: 'key-1' });

		expect(lastRequest().headers.get('x-idempotency-key')).toBe('key-1');
	});
});

describe('addresses', () => {
	it('validate POSTs the address fields', async () => {
		respond({ success: true, data: validatedAddress });

		await expect(
			invoke(Addresses.validate, {
				address1: '1000 N west street',
				city: 'Wilmington',
				zipcode: '19801',
				country: 'US',
			}),
		).resolves.toEqual(validatedAddress);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/addresses/validate',
			form: {
				address1: '1000 N west street',
				city: 'Wilmington',
				zipcode: '19801',
				country: 'US',
			},
		});
	});

	it('rejects an address with no city, postcode or zipcode before sending', async () => {
		respond({ success: true, data: validatedAddress });

		await expect(
			invoke(Addresses.validate, { address1: '1000 N west street' }),
		).rejects.toThrow('Provide city, postcode (UK) or zipcode');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('postcards', () => {
	it('create POSTs size, images and the recipient object as bracket fields', async () => {
		respond({ success: true, data: mailpieceCreated });

		await expect(
			invoke(Postcards.create, {
				size: '4x6',
				test: true,
				front: 'https://example.com/front.webp',
				back: 'https://example.com/back.webp',
				message: 'hello world',
				tags: 'used.for.reporting',
				recipient: {
					firstname: 'John',
					lastname: 'Smith',
					address1: '123 Sample Street',
					city: 'Sampletown',
					zipcode: '12345',
					country: 'US',
					order_id: 'A22',
				},
			}),
		).resolves.toEqual(mailpieceCreated);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/postcards/create',
			form: {
				size: '4x6',
				test: 'true',
				front: 'https://example.com/front.webp',
				back: 'https://example.com/back.webp',
				message: 'hello world',
				tags: 'used.for.reporting',
				'recipient[firstname]': 'John',
				'recipient[lastname]': 'Smith',
				'recipient[address1]': '123 Sample Street',
				'recipient[city]': 'Sampletown',
				'recipient[zipcode]': '12345',
				'recipient[country]': 'US',
				'recipient[order_id]': 'A22',
			},
		});
	});

	it('sends an existing recipient id as the bare recipient field', async () => {
		respond({ success: true, data: mailpieceCreated });

		await invoke(Postcards.create, {
			template: 195,
			recipient: 1943,
		});

		expect(lastRequest().form).toEqual({
			template: '195',
			recipient: '1943',
		});
	});

	it('rejects a postcard with neither template nor front', async () => {
		respond({ success: true, data: mailpieceCreated });

		await expect(invoke(Postcards.create, { recipient: 1943 })).rejects.toThrow(
			'Provide a template id or a front image',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an undocumented size before sending', async () => {
		respond({ success: true, data: mailpieceCreated });

		await expect(
			invoke(Postcards.create, {
				size: '5x7',
				front: 'https://example.com/front.webp',
				recipient: 1943,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('get GETs the mailpiece by id', async () => {
		respond({ success: true, data: postcard });

		await expect(invoke(Postcards.get, { id: 16818211 })).resolves.toEqual(
			postcard,
		);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/postcards/get/16818211',
		});
	});

	it('cancel POSTs the id', async () => {
		respond({ success: true, data: 1 });

		await expect(invoke(Postcards.cancel, { id: 12345 })).resolves.toBe(1);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/postcards/cancel',
			form: { id: '12345' },
		});
	});
});

describe('letters', () => {
	it('create POSTs the file and recipient object', async () => {
		respond({ success: true, data: mailpieceCreated });

		await expect(
			invoke(Letters.create, {
				test: true,
				file: 'https://example.com/letter.pdf',
				recipient: { firstname: 'John', address1: '123 Sample Street' },
				addons: 'FIRST_CLASS,CONFIDENTIAL',
			}),
		).resolves.toEqual(mailpieceCreated);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/letters/create',
			form: {
				test: 'true',
				file: 'https://example.com/letter.pdf',
				'recipient[firstname]': 'John',
				'recipient[address1]': '123 Sample Street',
				addons: 'FIRST_CLASS,CONFIDENTIAL',
			},
		});
	});

	it('rejects a letter with no template, file or pages', async () => {
		respond({ success: true, data: mailpieceCreated });

		await expect(invoke(Letters.create, { recipient: 1943 })).rejects.toThrow(
			'Provide a template id, a file or pages',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('post POSTs the country and pdf', async () => {
		respond({ success: true, data: mailpieceCreated });

		await expect(
			invoke(Letters.post, {
				test: true,
				country: 'GB',
				pdf: 'https://example.com/merged.pdf',
			}),
		).resolves.toEqual(mailpieceCreated);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/letters/post',
			form: {
				test: 'true',
				country: 'GB',
				pdf: 'https://example.com/merged.pdf',
			},
		});
	});

	it('requires a two-letter country on post', async () => {
		respond({ success: true, data: mailpieceCreated });

		await expect(
			invoke(Letters.post, { country: 'USA', pdf: 'https://x.pdf' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('get returns the letter mailpiece', async () => {
		respond({ success: true, data: letter });

		await expect(invoke(Letters.get, { id: 16818210 })).resolves.toEqual(
			letter,
		);
		expect(lastRequest().path).toBe('/v1/letters/get/16818210');
	});

	it('cancel POSTs the id', async () => {
		respond({ success: true, data: 1 });

		await expect(invoke(Letters.cancel, { id: 12345 })).resolves.toBe(1);
		expect(lastRequest().path).toBe('/v1/letters/cancel');
	});
});

describe('recipients', () => {
	it('list GETs with group and paging query params', async () => {
		respond({ success: true, data: [recipient] });

		await expect(
			invoke(Recipients.list, { group_id: 5, offset: 0, limit: 50 }),
		).resolves.toEqual([recipient]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/recipients/list',
			query: { group_id: '5', offset: '0', limit: '50' },
		});
	});

	it('omits empty query params and keeps the documented field shapes', async () => {
		respond({ success: true, data: [] });

		await invoke(Recipients.list, {});

		expect(lastRequest().query).toEqual({});
	});

	it('get GETs one recipient whose id comes back as a string', async () => {
		respond({ success: true, data: recipient });

		const result = (await invoke(Recipients.get, { id: 1943 })) as {
			id: string;
		};
		expect(result.id).toBe('1943');
		expect(lastRequest().path).toBe('/v1/recipients/get/1943');
	});

	it('create POSTs the recipient fields with custom fields alongside', async () => {
		respond({ success: true, data: recipientCreated });

		await expect(
			invoke(Recipients.create, {
				group_id: 123,
				firstname: 'John',
				lastname: 'Smith',
				address1: '123 Main Street',
				city: 'New York',
				zipcode: '10001',
				country: 'US',
				email: 'john.smith@example.com',
				ref_id: 'JS12345',
				on_duplicate: 'update',
				test_level: 'ref_id',
				customFields: { total_spent: '300', vip: true },
			}),
		).resolves.toEqual(recipientCreated);
		expect(lastRequest().form).toMatchObject({
			group_id: '123',
			firstname: 'John',
			lastname: 'Smith',
			address1: '123 Main Street',
			city: 'New York',
			zipcode: '10001',
			country: 'US',
			email: 'john.smith@example.com',
			ref_id: 'JS12345',
			on_duplicate: 'update',
			test_level: 'ref_id',
			total_spent: '300',
			vip: 'true',
		});
	});

	it('rejects custom fields that overwrite built-in recipient fields', async () => {
		respond({ success: true, data: recipientCreated });

		await expect(
			invoke(Recipients.create, {
				firstname: 'John',
				customFields: { firstname: 'Jane' },
			}),
		).rejects.toThrow('built-in recipient field');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('delete POSTs the id and returns 1', async () => {
		respond({ success: true, data: 1 });

		await expect(invoke(Recipients.remove, { id: 12345 })).resolves.toBe(1);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/recipients/delete',
			form: { id: '12345' },
		});
	});

	it('import POSTs the file url and mappings', async () => {
		respond({ success: true, data: '1' });

		await expect(
			invoke(Recipients.importFile, {
				file: 'https://example.com/data.csv',
				group_id: 123,
				duplicates: 'update',
				mappings: 'title,firstname,skip',
			}),
		).resolves.toBe('1');
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/recipients/import',
			form: {
				file: 'https://example.com/data.csv',
				group_id: '123',
				duplicates: 'update',
				mappings: 'title,firstname,skip',
			},
		});
	});

	it('rejects an unknown on_duplicate value before sending', async () => {
		respond({ success: true, data: recipientCreated });

		await expect(
			invoke(Recipients.create, { on_duplicate: 'replace' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('groups', () => {
	it('list GETs with paging params', async () => {
		respond({ success: true, data: [group] });

		await expect(invoke(Groups.list, { limit: 20 })).resolves.toEqual([group]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/groups/list',
			query: { limit: '20' },
		});
	});

	it('create POSTs the name and returns the string id', async () => {
		respond({ success: true, data: '39' });

		await expect(invoke(Groups.create, { name: 'My Group' })).resolves.toBe(
			'39',
		);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/groups/new',
			form: { name: 'My Group' },
		});
	});

	it('addRecipients joins ids comma-separated into the path route', async () => {
		respond({ success: true, data: 2 });

		await expect(
			invoke(Groups.addRecipients, {
				group_id: 39,
				recipients: [45112, 45113],
			}),
		).resolves.toBe(2);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/groups/add/39',
			form: { recipients: '45112,45113' },
		});
	});

	it('removeRecipients POSTs to the remove route', async () => {
		respond({ success: true, data: 1 });

		await expect(
			invoke(Groups.removeRecipients, {
				group_id: 39,
				recipients: [45112],
			}),
		).resolves.toBe(1);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/groups/remove/39',
			form: { recipients: '45112' },
		});
	});

	it('purge POSTs the id and delete_recipients', async () => {
		respond({ success: true, data: true });

		await expect(
			invoke(Groups.purge, { id: 123, delete_recipients: false }),
		).resolves.toBe(true);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/groups/purge',
			form: { id: '123', delete_recipients: 'false' },
		});
	});

	it('calculate POSTs to the calculate route with no body', async () => {
		respond({ success: true, data: true });

		await expect(invoke(Groups.calculate, { group_id: 123 })).resolves.toBe(
			true,
		);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/groups/calculate/123',
			form: {},
		});
	});

	it('delete POSTs the id and returns true', async () => {
		respond({ success: true, data: true });

		await expect(invoke(Groups.remove, { id: 123 })).resolves.toBe(true);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/groups/delete',
			form: { id: '123' },
		});
	});
});

describe('campaigns', () => {
	it('list GETs all campaigns', async () => {
		respond({ success: true, data: [campaign] });

		await expect(invoke(Campaigns.list, {})).resolves.toEqual([campaign]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/campaigns/list',
		});
	});

	it('get GETs one campaign keeping null image fields', async () => {
		respond({ success: true, data: campaign });

		await expect(invoke(Campaigns.get, { id: 126 })).resolves.toEqual(campaign);
		expect(lastRequest().path).toBe('/v1/campaigns/get/126');
	});

	it('create POSTs name, type and group', async () => {
		respond({ success: true, data: { id: '266' } });

		await expect(
			invoke(Campaigns.create, {
				name: 'My Campaign',
				type: 'a6-postcard',
				template_id: 12345,
				group_id: 12345,
			}),
		).resolves.toEqual({ id: '266' });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/campaigns/create',
			form: {
				name: 'My Campaign',
				type: 'a6-postcard',
				template_id: '12345',
				group_id: '12345',
			},
		});
	});

	it('accepts the capitalised type spelling the curl example uses', async () => {
		respond({ success: true, data: { id: '266' } });

		await invoke(Campaigns.create, {
			name: 'My Campaign',
			type: 'A6-postcard',
			group_id: 1,
		});

		expect(lastRequest().form.type).toBe('A6-postcard');
	});

	it('rejects an unknown campaign type before sending', async () => {
		respond({ success: true, data: { id: '266' } });

		await expect(
			invoke(Campaigns.create, {
				name: 'x',
				type: 'greeting-card',
				group_id: 1,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sample returns the pdf url', async () => {
		respond({
			success: true,
			data: 'https://stannpstorage.blob.core.windows.net/pdf-samples/sample.pdf',
		});

		await expect(invoke(Campaigns.sample, { id: 123 })).resolves.toBe(
			'https://stannpstorage.blob.core.windows.net/pdf-samples/sample.pdf',
		);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/campaigns/sample',
			form: { id: '123' },
		});
	});

	it('approve POSTs the id', async () => {
		respond({ success: true, data: true });

		await expect(invoke(Campaigns.approve, { id: 123 })).resolves.toBe(true);
		expect(lastRequest().path).toBe('/v1/campaigns/approve');
	});

	it('cost returns the documented breakdown', async () => {
		respond({ success: true, data: campaignCost });

		await expect(invoke(Campaigns.cost, { id: 123 })).resolves.toEqual(
			campaignCost,
		);
		expect(lastRequest().path).toBe('/v1/campaigns/cost');
	});

	it('availableDates returns the date array', async () => {
		respond({ success: true, data: availableDates });

		await expect(
			invoke(Campaigns.availableDates, {
				start: '2026-01-22',
				end: '2026-02-21',
			}),
		).resolves.toEqual(availableDates);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/campaigns/availableDates',
			form: { start: '2026-01-22', end: '2026-02-21' },
		});
	});

	it('rejects a malformed date before sending', async () => {
		respond({ success: true, data: availableDates });

		await expect(
			invoke(Campaigns.availableDates, { start: '01/22/2026' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('book POSTs the send date and payment options', async () => {
		respond({ success: true, data: true });

		await expect(
			invoke(Campaigns.book, {
				id: 123,
				send_date: '2026-01-22',
				use_balance: true,
			}),
		).resolves.toBe(true);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/campaigns/book',
			form: {
				id: '123',
				send_date: '2026-01-22',
				use_balance: 'true',
			},
		});
	});

	it('delete returns 1 as the US page documents', async () => {
		respond({ success: true, data: 1 });

		await expect(invoke(Campaigns.remove, { id: 123 })).resolves.toBe(1);
		expect(lastRequest().path).toBe('/v1/campaigns/delete');
	});
});

describe('events and selections', () => {
	it('events.create POSTs the event and returns its id', async () => {
		respond({ success: true, data: 266 });

		await expect(
			invoke(Events.create, {
				recipient_id: '12345',
				name: 'PURCHASE',
				value: '24.99',
				conversion: true,
			}),
		).resolves.toBe(266);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/recipientEvents/create',
			form: {
				recipient_id: '12345',
				name: 'PURCHASE',
				value: '24.99',
				conversion: 'true',
			},
		});
	});

	it('selections.create returns the id list', async () => {
		respond({ success: true, data: [{ id: '1234' }] });

		await expect(
			invoke(Selections.create, {
				group_id: 1,
				name: 'update',
				filters: 'total_spent:::more_than:::300',
			}),
		).resolves.toEqual([{ id: '1234' }]);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/selections/new',
			form: {
				group_id: '1',
				name: 'update',
				filters: 'total_spent:::more_than:::300',
			},
		});
	});
});

describe('reporting', () => {
	it('summary GETs the date path and returns the counts', async () => {
		respond({ success: true, data: reportingSummary });

		await expect(
			invoke(Reporting.summary, {
				startdate: '2024-01-01',
				enddate: '2024-01-31',
			}),
		).resolves.toEqual(reportingSummary);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/reporting/summary/2024-01-01/2024-01-31',
		});
	});

	it('list omits absent status and tag path segments', async () => {
		respond({ success: true, data: { singles: [reportingMailpiece] } });

		await expect(
			invoke(Reporting.list, {
				startdate: '2024-01-01',
				enddate: '2024-01-31',
			}),
		).resolves.toEqual({ singles: [reportingMailpiece] });
		expect(lastRequest().path).toBe('/v1/reporting/list/2024-01-01/2024-01-31');
	});

	it('list appends status and tag segments when both are set', async () => {
		respond({ success: true, data: { singles: [] } });

		await invoke(Reporting.list, {
			startdate: '2024-01-01',
			enddate: '2024-01-31',
			status: 'delivered',
			tag: 'tag123',
		});

		expect(lastRequest().path).toBe(
			'/v1/reporting/list/2024-01-01/2024-01-31/delivered/tag123',
		);
	});

	it('list with only status skips the tag segment', async () => {
		respond({ success: true, data: { singles: [] } });

		await invoke(Reporting.list, {
			startdate: '2024-01-01',
			enddate: '2024-01-31',
			status: 'returned',
		});

		expect(lastRequest().path).toBe(
			'/v1/reporting/list/2024-01-01/2024-01-31/returned',
		);
	});
});

describe('files, sms and tools', () => {
	it('files.upload POSTs the file url', async () => {
		respond({ success: true, data: { id: '342' } });

		await expect(
			invoke(Files.upload, {
				file: 'https://example.com/letter-heading.webp',
				folder: 2,
			}),
		).resolves.toEqual({ id: '342' });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/files/upload',
			form: {
				file: 'https://example.com/letter-heading.webp',
				folder: '2',
			},
		});
	});

	it('files.createFolder returns the string folder id', async () => {
		respond({ success: true, data: '342' });

		await expect(
			invoke(Files.createFolder, { name: 'Test Folder' }),
		).resolves.toBe('342');
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/files/createFolder',
			form: { name: 'Test Folder' },
		});
	});

	it('files.listFolders GETs the folder array', async () => {
		respond({ success: true, data: [folder] });

		await expect(invoke(Files.listFolders, {})).resolves.toEqual([folder]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/files/folders',
		});
	});

	it('sms.create POSTs the message with one recipient form', async () => {
		respond({ success: true, data: sms });

		await expect(
			invoke(Sms.create, {
				test: true,
				recipient_id: 12345,
				message: 'Hi {firstname}, your order has shipped',
			}),
		).resolves.toEqual(sms);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/sms/create',
			form: {
				test: 'true',
				recipient_id: '12345',
				message: 'Hi {firstname}, your order has shipped',
			},
		});
	});

	it('sms.create rejects a request with neither phone nor recipient', async () => {
		respond({ success: true, data: sms });

		await expect(invoke(Sms.create, { message: 'hello' })).rejects.toThrow(
			'Provide phone_number or recipient_id',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('tools.templates GETs the template array', async () => {
		respond({ success: true, data: [template] });

		await expect(invoke(Tools.templates, {})).resolves.toEqual([template]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/templates/list',
		});
	});

	it('tools.pdfMerge sends indexed file fields', async () => {
		respond({ success: true, data: 'https://merged.pdf' });

		await expect(
			invoke(Tools.pdfMerge, {
				files: ['https://file1.pdf', 'https://file2.pdf'],
			}),
		).resolves.toBe('https://merged.pdf');
		const sent = lastRequest();
		expect(sent.path).toBe('/v1/pdf/merge');
		expect(sent.form).toEqual({
			'files[0]': 'https://file1.pdf',
			'files[1]': 'https://file2.pdf',
		});
	});
});

describe('error surfaces', () => {
	it.each([
		['GET', 401],
		['POST', 401],
		['POST', 404],
		['POST', 500],
	])(
		'throws a StannpAPIError carrying status and body on %s %i',
		async (method, status) => {
			respond(badKey, status);

			const promise =
				method === 'GET'
					? invoke(Account.balance, {})
					: invoke(Campaigns.approve, { id: 1 });

			await expect(promise).rejects.toMatchObject({
				name: 'StannpAPIError',
				status,
			});
		},
	);

	it('rejects a malformed known field before sending', async () => {
		respond({ success: true, data: 1 });

		await expect(
			invoke(Recipients.remove, { id: 'not-a-number' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('fails loudly when the answer is not the documented shape', async () => {
		respond({ success: true, data: 'unexpected-string' });

		// A string where the summary object belongs must not parse into a
		// fake all-zero page.
		await expect(
			invoke(Reporting.summary, {
				startdate: '2024-01-01',
				enddate: '2024-01-31',
			}),
		).rejects.toThrow();
	});
});
