import { logEventFromContext } from 'corsair/core';
import { Campaigns, Stores } from './endpoints';
import {
	CAMPAIGN,
	CAMPAIGN_RUNNING,
	CAMPAIGN_TYPES,
	EMAIL_TEMPLATE,
	EMAIL_TEMPLATE_EDITOR,
	MASTER_TEMPLATES,
	PRODUCTS,
	RULE,
	RULES,
	SEGMENT_COUNT,
	SEGMENT_LIST,
	STORE,
	STORE_STATUS,
	STORE_STATUS_ERROR,
	TEMPLATE_VALIDATION_ERROR,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

const STORE_ID = 1;

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('stores.create', () => {
	it('posts the store with its own sync key', async () => {
		respond(fetchMock, STORE);

		const result = (await invoke(Stores.create, {
			name: 'My Store',
			apiKey: 'store-sync-key',
			platform: 'MAGENTO',
			domain: 'https://shop.example.com',
		})) as { id?: number; platform?: string };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/api/v1/stores');
		expect(request.bodyRecord).toMatchObject({
			name: 'My Store',
			apiKey: 'store-sync-key',
			platform: 'MAGENTO',
		});
		expect(result.id).toBe(1);
	});

	it('rejects a create with no sync key', async () => {
		await expect(invoke(Stores.create, { name: 'x' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('stores.update', () => {
	it('puts the id in the body, not the path', async () => {
		respond(fetchMock, STORE);

		await invoke(Stores.update, {
			id: 1,
			name: 'Renamed Store',
			apiKey: 'store-sync-key',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		// The route is PUT /stores with the id in the body.
		expect(request.path).toBe('/api/v1/stores');
		expect(request.bodyRecord).toMatchObject({ id: 1, name: 'Renamed Store' });
	});

	it('rejects an update with no id', async () => {
		await expect(
			invoke(Stores.update, { name: 'x', apiKey: 'k' }),
		).rejects.toThrow();
	});
});

describe('stores.get', () => {
	it('reads one store', async () => {
		respond(fetchMock, STORE);

		const result = (await invoke(Stores.get, { storeId: STORE_ID })) as {
			name?: string;
			platform?: string;
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v1/stores/1');
		expect(result.name).toBe('My Store');
		expect(result.platform).toBe('MAGENTO');
	});

	it('logs the store name and platform', async () => {
		respond(fetchMock, STORE);

		await invoke(Stores.get, { storeId: STORE_ID });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remarkety.stores.get',
			{ name: 'My Store', platform: 'MAGENTO' },
			'completed',
		);
	});

	it('rejects a non-integer store id', async () => {
		await expect(invoke(Stores.get, { storeId: 1.5 })).rejects.toThrow();
	});
});

describe('stores.delete', () => {
	it('deletes by store id', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await invoke(Stores.remove, { storeId: STORE_ID });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/api/v1/stores/1');
	});
});

describe('stores.status', () => {
	it('reads a healthy sync', async () => {
		respond(fetchMock, STORE_STATUS);

		const result = (await invoke(Stores.status, { storeId: STORE_ID })) as {
			syncStatus?: string;
			syncLastError?: string | null;
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v1/stores/1/status');
		expect(result.syncStatus).toBe('OK');
	});

	it('logs no error for a healthy store whose syncLastError holds a runner message', async () => {
		respond(fetchMock, STORE_STATUS);

		await invoke(Stores.status, { storeId: STORE_ID });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remarkety.stores.status',
			{ syncStatus: 'OK', hasError: false },
			'completed',
		);
	});

	it('keeps the sync error when the status is ERROR', async () => {
		respond(fetchMock, STORE_STATUS_ERROR);

		const result = (await invoke(Stores.status, { storeId: STORE_ID })) as {
			syncStatus?: string;
			syncLastError?: string | null;
		};

		expect(result.syncStatus).toBe('ERROR');
		expect(result.syncLastError).toContain('missing SKU column');
	});

	it('logs the status and whether an error is present', async () => {
		respond(fetchMock, STORE_STATUS_ERROR);

		await invoke(Stores.status, { storeId: STORE_ID });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remarkety.stores.status',
			{ syncStatus: 'ERROR', hasError: true },
			'completed',
		);
	});
});

describe('store ids', () => {
	it('takes the string store ID from the API Keys page', async () => {
		respond(fetchMock, STORE_STATUS);

		await invoke(Stores.status, { storeId: 'AbC123xy' });

		expect(lastRequest(fetchMock).path).toBe('/api/v1/stores/AbC123xy/status');
	});

	it('encodes a store ID that carries a path character', async () => {
		respond(fetchMock, STORE_STATUS);

		await invoke(Stores.status, { storeId: 'a/b' });

		expect(lastRequest(fetchMock).path).toBe('/api/v1/stores/a%2Fb/status');
	});

	it('rejects an empty store ID', async () => {
		await expect(invoke(Stores.status, { storeId: '' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('contacts.create', () => {
	it('posts the contact with its marketing flags', async () => {
		respond(fetchMock, {});

		await invoke(Stores.createContact, {
			storeId: STORE_ID,
			email: 'jane@example.com',
			firstName: 'Jane',
			tags: ['vip'],
			doubleOptin: true,
			allowedMarketing: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v1/stores/1/contacts');
		expect(request.bodyRecord).toMatchObject({
			email: 'jane@example.com',
			firstName: 'Jane',
			tags: ['vip'],
			doubleOptin: true,
			allowedMarketing: true,
		});
	});

	it('sends custom properties as one object, which is what Remarkety accepts', async () => {
		respond(fetchMock, {});

		await invoke(Stores.createContact, {
			storeId: STORE_ID,
			email: 'jane@example.com',
			properties: { country: 'US', rewardsPoints: 100 },
		});

		expect(lastRequest(fetchMock).bodyRecord?.properties).toEqual({
			country: 'US',
			rewardsPoints: 100,
		});
	});

	it('rejects properties as an array, which Remarkety answers with a 400', async () => {
		await expect(
			invoke(Stores.createContact, {
				storeId: STORE_ID,
				email: 'jane@example.com',
				properties: [{ country: 'US' }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a contact with no email', async () => {
		await expect(
			invoke(Stores.createContact, { storeId: STORE_ID }),
		).rejects.toThrow();
	});

	it('logs a count, never the email', async () => {
		respond(fetchMock, { status: 'OK' });

		await invoke(Stores.createContact, {
			storeId: STORE_ID,
			email: 'jane@example.com',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remarkety.contacts.create',
			{ keys: 1 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'jane@example.com',
		);
	});
});

describe('contacts.unsubscribe', () => {
	it('posts the email to the unsubscribe route', async () => {
		respond(fetchMock, {});

		await invoke(Stores.unsubscribe, {
			storeId: STORE_ID,
			email: 'jane@example.com',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v1/stores/1/contacts/unsubscribe');
		expect(request.bodyRecord).toEqual({ email: 'jane@example.com' });
	});
});

describe('campaigns.create', () => {
	it('posts the type and its email action', async () => {
		respond(fetchMock, CAMPAIGN);

		const result = (await invoke(Campaigns.create, {
			storeId: STORE_ID,
			type: 'abandoned-cart',
			actions: [
				{
					type: 'email',
					subject: 'Your cart misses you',
					baseTemplate: '<html></html>',
					rules: [{ type: 'delay', operator: 'eq', value: '1' }],
				},
			],
			mode: 'stop',
		})) as { id?: number; mode?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v1/stores/1/campaigns');
		const body = request.bodyRecord as {
			type?: string;
			actions?: { subject?: string; rules?: { type?: string }[] }[];
		};
		expect(body.type).toBe('abandoned-cart');
		expect(body.actions?.[0]?.subject).toBe('Your cart misses you');
		expect(body.actions?.[0]?.rules).toHaveLength(1);
		expect(result.id).toBe(7);
	});

	it('accepts an api action with a webhook', async () => {
		respond(fetchMock, CAMPAIGN);

		await invoke(Campaigns.create, {
			storeId: STORE_ID,
			type: 'abandoned-cart',
			actions: [
				{
					type: 'api',
					webhook: 'https://hooks.example.com/cart',
					rules: [{ type: 'delay', operator: 'eq', value: '1' }],
				},
			],
		});

		const body = lastRequest(fetchMock).bodyRecord as {
			actions?: { webhook?: string }[];
		};
		expect(body.actions?.[0]?.webhook).toBe('https://hooks.example.com/cart');
	});

	it('rejects an api action with no webhook', async () => {
		await expect(
			invoke(Campaigns.create, {
				storeId: STORE_ID,
				type: 'abandoned-cart',
				actions: [
					{
						type: 'api',
						rules: [{ type: 'delay', operator: 'eq', value: '1' }],
					},
				],
			}),
		).rejects.toThrow(/webhook/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an email action with no subject or template', async () => {
		await expect(
			invoke(Campaigns.create, {
				storeId: STORE_ID,
				type: 'abandoned-cart',
				actions: [
					{
						type: 'email',
						subject: 'Only a subject',
						rules: [{ type: 'delay', operator: 'eq', value: '1' }],
					},
				],
			}),
		).rejects.toThrow(/baseTemplate/);
	});

	it('rejects an action with no rules', async () => {
		await expect(
			invoke(Campaigns.create, {
				storeId: STORE_ID,
				type: 'abandoned-cart',
				actions: [
					{
						type: 'email',
						subject: 'x',
						baseTemplate: '<html></html>',
						rules: [],
					},
				],
			}),
		).rejects.toThrow();
	});

	it('rejects two actions, since this API version takes exactly one', async () => {
		const action = {
			type: 'api',
			webhook: 'https://hooks.example.com/cart',
			rules: [{ type: 'CART_FOLLOWUP_TIME', operator: 'is', value: '60' }],
		};
		await expect(
			invoke(Campaigns.create, {
				storeId: STORE_ID,
				type: 'TRIGGER_CART_RECOVERY',
				actions: [action, action],
			}),
		).rejects.toThrow();
		await expect(
			invoke(Campaigns.update, {
				storeId: STORE_ID,
				id: 7,
				actions: [action, action],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an action type the spec does not allow', async () => {
		await expect(
			invoke(Campaigns.create, {
				storeId: STORE_ID,
				type: 'abandoned-cart',
				actions: [
					{
						type: 'sms',
						rules: [{ type: 'delay', operator: 'eq', value: '1' }],
					},
				],
			}),
		).rejects.toThrow();
	});

	it('rejects a mode the API does not allow', async () => {
		await expect(
			invoke(Campaigns.create, {
				storeId: STORE_ID,
				type: 'x',
				actions: [
					{
						type: 'api',
						webhook: 'https://h.example.com',
						rules: [{ type: 'delay', operator: 'eq', value: '1' }],
					},
				],
				mode: 'pause',
			}),
		).rejects.toThrow();
	});
});

describe('campaigns.update', () => {
	it('puts the campaign id in the body on the store campaigns route', async () => {
		respond(fetchMock, CAMPAIGN_RUNNING);

		await invoke(Campaigns.update, { storeId: STORE_ID, id: 7, mode: 'run' });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe('/api/v1/stores/1/campaigns');
		expect(request.bodyRecord).toMatchObject({ id: 7, mode: 'run' });
	});

	it('logs the resulting mode, which is what a running campaign means', async () => {
		respond(fetchMock, CAMPAIGN_RUNNING);

		await invoke(Campaigns.update, { storeId: STORE_ID, id: 7, mode: 'run' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remarkety.campaigns.update',
			{ campaignId: 7, mode: 'run' },
			'completed',
		);
	});
});

describe('campaigns.get and delete', () => {
	it('reads one campaign', async () => {
		respond(fetchMock, CAMPAIGN);

		const result = (await invoke(Campaigns.get, {
			storeId: STORE_ID,
			campaignId: 7,
		})) as { type?: string; mode?: string };

		expect(lastRequest(fetchMock).path).toBe('/api/v1/stores/1/campaigns/7');
		expect(result.type).toBe('abandoned-cart');
		expect(result.mode).toBe('stop');
	});

	it('deletes one campaign', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await invoke(Campaigns.remove, { storeId: STORE_ID, campaignId: 7 });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/api/v1/stores/1/campaigns/7');
	});
});

describe('campaigns.types', () => {
	it('reads the map of campaign types', async () => {
		respond(fetchMock, CAMPAIGN_TYPES);

		const result = (await invoke(Campaigns.types, {
			storeId: STORE_ID,
		})) as Record<string, object>;

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v1/stores/1/campaigns/types',
		);
		expect(Object.keys(result)).toEqual(['abandoned-cart', 'post-purchase']);
	});

	it('passes a single type', async () => {
		respond(fetchMock, CAMPAIGN_TYPES);

		await invoke(Campaigns.types, {
			storeId: STORE_ID,
			type: 'abandoned-cart',
		});

		expect(lastRequest(fetchMock).query.type).toBe('abandoned-cart');
	});
});

describe('emailTemplates', () => {
	it('reads a rule template', async () => {
		respond(fetchMock, EMAIL_TEMPLATE);

		const result = (await invoke(Campaigns.template, {
			storeId: STORE_ID,
			campaignId: 7,
			ruleId: 1,
		})) as { type?: string; html?: string };

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v1/stores/1/campaigns/7/rule/1/email-template',
		);
		expect(result.type).toBe('html');
		expect(result.html).toContain('shopper.firstName');
	});

	it('keeps the master template of an editor-v1 template', async () => {
		respond(fetchMock, EMAIL_TEMPLATE_EDITOR);

		const result = (await invoke(Campaigns.template, {
			storeId: STORE_ID,
			campaignId: 7,
			ruleId: 1,
		})) as { type?: string; masterTemplate?: { id?: number } };

		expect(result.type).toBe('editor-v1');
		expect(result.masterTemplate?.id).toBe(3);
	});

	it('replaces a template with a POST', async () => {
		respond(fetchMock, EMAIL_TEMPLATE);

		await invoke(Campaigns.updateTemplate, {
			storeId: STORE_ID,
			campaignId: 7,
			ruleId: 1,
			type: 'html',
			html: '<html></html>',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.bodyRecord).toMatchObject({ type: 'html' });
	});

	it('surfaces the nested errors a bad template returns', async () => {
		respond(fetchMock, TEMPLATE_VALIDATION_ERROR, 400);

		await expect(
			invoke(Campaigns.updateTemplate, {
				storeId: STORE_ID,
				campaignId: 7,
				ruleId: 1,
				type: 'html',
				html: '',
			}),
		).rejects.toThrow('html must not be empty');
	});

	it('rejects a template update with no html', async () => {
		await expect(
			invoke(Campaigns.updateTemplate, {
				storeId: STORE_ID,
				campaignId: 7,
				ruleId: 1,
				type: 'html',
			}),
		).rejects.toThrow();
	});
});

describe('masterTemplates', () => {
	it('lists the templates', async () => {
		respond(fetchMock, MASTER_TEMPLATES);

		const result = (await invoke(Campaigns.masterTemplates, {
			storeId: STORE_ID,
		})) as { metadata?: { id?: number; name?: string; public?: boolean } }[];

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v1/stores/1/master-templates',
		);
		expect(result[0]?.metadata?.id).toBe(22690);
		expect(result[0]?.metadata?.name).toBe('Amazing Christmas For Everyone');
	});

	it('passes the search term', async () => {
		respond(fetchMock, MASTER_TEMPLATES);

		await invoke(Campaigns.masterTemplates, { storeId: STORE_ID, q: 'promo' });

		expect(lastRequest(fetchMock).query.q).toBe('promo');
	});
});

describe('products.list', () => {
	it('searches products with paging', async () => {
		respond(fetchMock, PRODUCTS);

		const result = (await invoke(Campaigns.products, {
			storeId: STORE_ID,
			q: 'T-Shirt',
			limit: 50,
			page: 1,
		})) as { sku?: string; price?: { amount?: number } }[];

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v1/stores/1/products');
		expect(request.query).toMatchObject({
			q: 'T-Shirt',
			limit: '50',
			page: '1',
		});
		expect(result[0]?.sku).toBe('TS-BLUE-M');
		expect(result[0]?.price?.amount).toBe(29.99);
	});

	it('rejects a limit over the documented 1000', async () => {
		await expect(
			invoke(Campaigns.products, { storeId: STORE_ID, limit: 1001 }),
		).rejects.toThrow();
	});
});

describe('rules', () => {
	it('lists every rule, keyed by rule type', async () => {
		respond(fetchMock, RULES);

		const result = (await invoke(Campaigns.rules, {
			storeId: STORE_ID,
		})) as Record<string, { operators?: string[]; possibleValues?: object }>;

		expect(lastRequest(fetchMock).path).toBe('/api/v1/stores/1/rules');
		expect(Object.keys(result)).toEqual([
			'CART_FOLLOWUP_TIME',
			'CAMPAIGN_ACTION',
		]);
		expect(result.CAMPAIGN_ACTION?.operators).toEqual(['is', 'is not']);
		expect(result.CAMPAIGN_ACTION?.possibleValues).toEqual({
			'1': 'Opened',
			'2': 'Clicked',
			'3': 'Purchase',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remarkety.rules.list',
			{ rules: 2 },
			'completed',
		);
	});

	it('reads one rule type, whose possibleValues may be a string', async () => {
		respond(fetchMock, RULE);

		const result = (await invoke(Campaigns.rule, {
			storeId: STORE_ID,
			ruleType: 'CART_FOLLOWUP_TIME',
		})) as { displayName?: string; possibleValues?: string };

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v1/stores/1/rules/CART_FOLLOWUP_TIME',
		);
		expect(result.displayName).toBe(
			'Number of hours since last modification of cart',
		);
		expect(result.possibleValues).toBe('');
	});
});

describe('segments', () => {
	it('counts the matching shoppers', async () => {
		respond(fetchMock, SEGMENT_COUNT);

		const result = (await invoke(Campaigns.segmentCount, {
			storeId: STORE_ID,
		})) as { count?: number };

		expect(lastRequest(fetchMock).path).toBe('/api/v1/stores/1/segments/count');
		expect(result.count).toBe(4213);
	});

	it('lists the matching emails with paging', async () => {
		respond(fetchMock, SEGMENT_LIST);

		const result = (await invoke(Campaigns.segmentList, {
			storeId: STORE_ID,
			page: 0,
			limit: 100,
		})) as { email?: string; firstName?: string }[];

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v1/stores/1/segments/list');
		expect(request.query).toMatchObject({ page: '0', limit: '100' });
		expect(result).toHaveLength(2);
	});

	it('rejects a negative page', async () => {
		await expect(
			invoke(Campaigns.segmentList, { storeId: STORE_ID, page: -1 }),
		).rejects.toThrow();
	});
});
