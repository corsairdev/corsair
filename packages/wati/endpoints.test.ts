import { logEventFromContext } from 'corsair/core';
import { WatiAPIError } from './client';
import {
	Contacts,
	Conversations,
	Messages,
	Templates,
	Webhooks,
	Workspace,
} from './endpoints';
import {
	broadcast,
	broadcastList,
	channelList,
	contact,
	contactCount,
	contactList,
	conversationList,
	credits,
	deleted,
	invalidToken,
	messageList,
	recipientList,
	segment,
	segmentEvaluation,
	segmentList,
	sent,
	template,
	templateList,
	templateSent,
	templateSentWithErrors,
	webhook,
	webhookDeleted,
	webhookList,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
} from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});

describe('contacts', () => {
	it('creates a contact with custom attributes as pairs', async () => {
		respond(fetchMock, contact);

		const result = await invoke(Contacts.create, {
			whatsapp_number: '1234567890',
			name: 'John Doe',
			custom_params: [{ name: 'age', value: '30' }],
		});

		expect(result).toEqual(contact);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/ext/v3/contacts');
		expect(sent.body).toEqual({
			whatsapp_number: '1234567890',
			name: 'John Doe',
			custom_params: [{ name: 'age', value: '30' }],
		});
	});

	it('never logs the phone number', async () => {
		respond(fetchMock, contact);

		await invoke(Contacts.create, {
			whatsapp_number: '1234567890',
			name: 'John Doe',
		});

		// unknown: the log payload is a free-form record; only the keys asserted
		// below are relied on, and a stricter type would restate every log field.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('whatsapp_number');
		expect(logged).not.toHaveProperty('phone');
	});

	it('reads a contact by target', async () => {
		respond(fetchMock, contact);

		await invoke(Contacts.get, { target: '1234567890' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/ext/v3/contacts/1234567890');
	});

	it('encodes a leading + in the target, keeping it one segment', async () => {
		respond(fetchMock, contact);

		await invoke(Contacts.get, { target: '+1234567890' });

		expect(lastRequest(fetchMock).path).toBe(
			'/api/ext/v3/contacts/%2B1234567890',
		);
	});

	it('lists contacts with paging', async () => {
		respond(fetchMock, contactList);

		await invoke(Contacts.list, { page_number: 1, page_size: 20 });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/ext/v3/contacts');
		expect(sent.query.page_number).toBe('1');
		expect(sent.query.page_size).toBe('20');
	});

	it('rejects a page size above 100', async () => {
		await expect(
			invoke(Contacts.list, { page_number: 1, page_size: 101 }),
		).rejects.toThrow();
	});

	it('counts contacts from contact_count, the field WATI returns', async () => {
		respond(fetchMock, contactCount);

		const result = (await invoke(Contacts.count, {})) as {
			contact_count?: number;
		};

		expect(result.contact_count).toBe(100);
		expect(lastRequest(fetchMock).path).toBe('/api/ext/v3/contacts/count');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wati.contacts.count',
			{ count: 100 },
			'completed',
		);
	});

	it('states a delete plainly, and does not log the target', async () => {
		respond(fetchMock, deleted);

		const result = await invoke(Contacts.remove, { target: '+1234567890' });

		expect(result).toMatchObject({ success: true, deleted: true });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
		// unknown: the log payload is a free-form record; only the keys asserted
		// below are relied on, and a stricter type would restate every log field.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('target');
	});

	it('surfaces a bad token as a WatiAPIError', async () => {
		respond(fetchMock, invalidToken, 401);

		await expect(
			invoke(Contacts.get, { target: '1234567890' }),
		).rejects.toBeInstanceOf(WatiAPIError);
	});
});

describe('conversations', () => {
	it('lists conversations, filtered by channel', async () => {
		respond(fetchMock, conversationList);

		await invoke(Conversations.list, {
			page_number: 1,
			channel_type: 'whatsapp',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/ext/v3/conversations');
		expect(sent.query.channel_type).toBe('whatsapp');
	});

	it('reads the messages in a conversation', async () => {
		respond(fetchMock, messageList);

		const result = await invoke(Conversations.messages, {
			target: 'conv-1',
			page_number: 1,
		});

		expect(result).toEqual(messageList);
		expect(lastRequest(fetchMock).path).toBe(
			'/api/ext/v3/conversations/conv-1/messages',
		);
	});
});

describe('sending', () => {
	it('sends a text message to a conversation', async () => {
		respond(fetchMock, sent);

		const result = await invoke(Messages.sendText, {
			target: 'conv-1',
			text: 'Your order shipped.',
		});

		// The queued message comes back as an object under `message`.
		expect(result).toEqual(sent);
		const sentRequest = lastRequest(fetchMock);
		expect(sentRequest.method).toBe('POST');
		expect(sentRequest.path).toBe('/api/ext/v3/conversations/messages/text');
		expect(sentRequest.body).toEqual({
			target: 'conv-1',
			text: 'Your order shipped.',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wati.messages.sendText',
			{ id: 'msg-2', status: 'sending' },
			'completed',
		);
	});

	it('sends a + target as given in the JSON body, not URL-encoded', async () => {
		respond(fetchMock, sent);

		await invoke(Messages.sendText, { target: '+1234567890', text: 'Hi' });

		expect(lastRequest(fetchMock).body).toMatchObject({
			target: '+1234567890',
		});
	});

	it('never logs the message text', async () => {
		respond(fetchMock, sent);

		await invoke(Messages.sendText, {
			target: 'conv-1',
			text: 'Your order shipped.',
		});

		// unknown: the log payload is a free-form record; only the keys asserted
		// below are relied on, and a stricter type would restate every log field.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('text');
	});

	it('sends a template with bound parameters', async () => {
		respond(fetchMock, templateSent);

		const result = (await invoke(Messages.sendTemplate, {
			whatsapp_number: '1234567890',
			template_name: 'order_update',
			broadcast_name: 'shipping-updates',
			parameters: [
				{ name: '1', value: 'Jordan' },
				{ name: '2', value: 'SHIPPED' },
			],
		})) as { broadcast_id?: string };

		expect(result.broadcast_id).toBe('broadcast_123456');
		const sentRequest = lastRequest(fetchMock);
		expect(sentRequest.method).toBe('POST');
		expect(sentRequest.path).toBe('/api/ext/v3/messageTemplates/send');
		expect(sentRequest.body).toMatchObject({
			template_name: 'order_update',
			broadcast_name: 'shipping-updates',
			recipients: [
				{
					target: '1234567890',
					custom_params: [
						{ name: '1', value: 'Jordan' },
						{ name: '2', value: 'SHIPPED' },
					],
				},
			],
		});
	});

	it('logs the parameter count, never the values', async () => {
		respond(fetchMock, templateSent);

		await invoke(Messages.sendTemplate, {
			whatsapp_number: '1234567890',
			template_name: 'order_update',
			broadcast_name: 'shipping-updates',
			parameters: [{ name: '1', value: 'Jordan' }],
		});

		// unknown: the log payload is a free-form record; only the keys asserted
		// below are relied on, and a stricter type would restate every log field.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged.parameters).toBe(1);
		expect(logged).not.toHaveProperty('whatsapp_number');
	});

	it('groups a template send into a campaign by name', async () => {
		respond(fetchMock, templateSent);

		await invoke(Messages.sendTemplate, {
			whatsapp_number: '1234567890',
			template_name: 'june_promo',
			broadcast_name: 'June promo',
			parameters: [{ name: '1', value: 'June' }],
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			broadcast_name: 'June promo',
		});
	});

	it('accepts a template with no placeholders, which takes no parameters', async () => {
		respond(fetchMock, templateSent);

		await invoke(Messages.sendTemplate, {
			whatsapp_number: '1234567890',
			template_name: 'june_promo',
			broadcast_name: 'June promo',
		});

		const body = lastRequest(fetchMock).body as {
			// unknown: only presence of custom_params is asserted, not its contents.
			recipients?: { custom_params?: unknown }[];
		};
		expect(body.recipients?.[0]?.custom_params).toBeUndefined();
	});

	it('sends a + recipient as given in the template body', async () => {
		respond(fetchMock, templateSent);

		await invoke(Messages.sendTemplate, {
			whatsapp_number: '+1234567890',
			template_name: 'june_promo',
			broadcast_name: 'June promo',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			recipients: [{ target: '+1234567890' }],
		});
	});

	it('returns a refused template send and logs the recipient errors', async () => {
		respond(fetchMock, templateSentWithErrors);

		const result = (await invoke(Messages.sendTemplate, {
			whatsapp_number: '1234567890',
			template_name: 'june_promo',
			broadcast_name: 'June promo',
		})) as { success?: boolean; error?: string };

		expect(result.success).toBe(false);
		expect(result.error).toBe('Template not approved');
		// unknown: the log payload is a free-form record; only the keys asserted
		// below are relied on, and a stricter type would restate every log field.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged.recipientErrors).toBe(1);
		expect(logged.success).toBe(false);
	});

	it('sends a file from a public URL', async () => {
		respond(fetchMock, sent);

		await invoke(Messages.sendFile, {
			target: 'conv-1',
			url: 'https://acme.example/invoice.pdf',
			caption: 'Your invoice',
		});

		const sentRequest = lastRequest(fetchMock);
		expect(sentRequest.path).toBe(
			'/api/ext/v3/conversations/messages/fileViaUrl',
		);
		// V3 takes exactly these fields; there is no file name.
		expect(sentRequest.body).toEqual({
			target: 'conv-1',
			file_url: 'https://acme.example/invoice.pdf',
			caption: 'Your invoice',
		});
	});
});

describe('templates', () => {
	it('lists templates', async () => {
		respond(fetchMock, templateList);

		const result = (await invoke(Templates.list, {})) as {
			// unknown: only the list length is asserted.
			templates?: unknown[];
		};

		// V3 puts the list under `templates`.
		expect(result.templates).toHaveLength(1);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wati.templates.list',
			{ count: 1, total: 1 },
			'completed',
		);
		expect(lastRequest(fetchMock).path).toBe('/api/ext/v3/messageTemplates');
	});

	it('reads one template', async () => {
		respond(fetchMock, template);

		const result = (await invoke(Templates.get, { template_id: 'tpl-1' })) as {
			name?: string;
			status?: string;
		};

		expect(result.name).toBe('order_update');
		expect(result.status).toBe('APPROVED');
		expect(lastRequest(fetchMock).path).toBe(
			'/api/ext/v3/messageTemplates/tpl-1',
		);
	});
});

describe('workspace', () => {
	it('lists channels', async () => {
		respond(fetchMock, channelList);

		await invoke(Workspace.channels, {});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/ext/v3/channels');
		// Both paging fields are required on this route.
		expect(request.query).toEqual({ page_number: '1', page_size: '20' });
	});

	it('reads the credit balance', async () => {
		respond(fetchMock, credits);

		const result = (await invoke(Workspace.credits, {})) as { credit?: number };

		expect(result).toEqual(credits);
		expect(result.credit).toBe(12.5);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wati.account.credits',
			{ credit: 12.5 },
			'completed',
		);
		expect(lastRequest(fetchMock).path).toBe('/api/ext/v3/account/credits');
	});

	it('lists campaigns', async () => {
		respond(fetchMock, broadcastList);

		await invoke(Workspace.broadcasts, { page_number: 1, channel: 'Support' });

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/ext/v3/broadcasts');
		expect(request.query.channel).toBe('Support');
	});

	it('reads one campaign', async () => {
		respond(fetchMock, broadcast);

		const result = (await invoke(Workspace.broadcast, {
			broadcast_id: 'bc-1',
		})) as { name?: string; status?: string };

		expect(result.name).toBe('June promo');
		expect(result.status).toBe('COMPLETED');
		expect(lastRequest(fetchMock).path).toBe('/api/ext/v3/broadcasts/bc-1');
	});

	it('reads campaign recipients', async () => {
		respond(fetchMock, recipientList);

		await invoke(Workspace.recipients, { broadcast_id: 'bc-1' });

		expect(lastRequest(fetchMock).path).toBe(
			'/api/ext/v3/broadcasts/bc-1/recipients',
		);
		// This route names its total `total_count`.
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wati.broadcasts.recipients',
			{ count: 1, total: 1 },
			'completed',
		);
	});

	it('lists segments', async () => {
		respond(fetchMock, segmentList);

		await invoke(Workspace.segments, {});

		expect(lastRequest(fetchMock).path).toBe('/api/ext/v3/segments');
	});

	it('reads one segment', async () => {
		respond(fetchMock, segment);

		const result = (await invoke(Workspace.segmentGet, {
			segmentId: 'seg-1',
		})) as { name?: string };

		expect(result.name).toBe('Active customers');
		expect(lastRequest(fetchMock).path).toBe('/api/ext/v3/segments/seg-1');
	});

	it('evaluates a segment without saving anything', async () => {
		respond(fetchMock, segmentEvaluation);

		const result = (await invoke(Workspace.evaluate, {
			groups: [
				{
					operator: 'AND',
					conditions: [
						{ attribute: 'contact_status', operator: 'eq', value: 'active' },
					],
				},
			],
			page_number: 2,
			page_size: 50,
		})) as { total?: number };

		expect(result.total).toBe(420);
		const sent = lastRequest(fetchMock);
		// V3 evaluates supplied filters with a POST; the per-id GET does not exist.
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/ext/v3/segments/evaluate');
		// This route pages in the body, in camelCase.
		expect(sent.body).toMatchObject({
			groups: [{ operator: 'AND' }],
			pageNumber: 2,
			pageSize: 50,
		});
		expect(sent.query).toEqual({});
	});
});

describe('webhooks', () => {
	it('lists webhook subscriptions', async () => {
		respond(fetchMock, webhookList);

		const result = (await invoke(Webhooks.list, {})) as {
			// unknown: only the list length is asserted.
			webhooks?: unknown[];
		};

		// V3 answers a bare array, which the plugin wraps.
		expect(result.webhooks).toHaveLength(1);
		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/ext/v3/webhooks');
		expect(request.query).toEqual({});
	});

	it('reads one subscription with its events', async () => {
		respond(fetchMock, webhook);

		await invoke(Webhooks.get, { id: 'wh-1' });

		expect(lastRequest(fetchMock).path).toBe('/api/ext/v3/webhooks/wh-1');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wati.webhooks.get',
			{ id: 'wh-1', events: 2 },
			'completed',
		);
	});

	it('deletes a subscription', async () => {
		respond(fetchMock, webhookDeleted);

		const result = await invoke(Webhooks.remove, { id: 'wh-1' });

		expect(result).toMatchObject({ success: true, id: 'wh-1' });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});
