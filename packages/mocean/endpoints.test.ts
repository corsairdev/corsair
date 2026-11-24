import { logEventFromContext } from 'corsair/core';
import { Account, Lookup, Sms, Verify, Voice, WhatsApp } from './endpoints';
import { moceanEndpointSchemas } from './index';
import {
	balance,
	callStarted,
	hungUp,
	lookup,
	messageStatus,
	pricing,
	smsSent,
	template,
	verifyChecked,
	verifySent,
	whatsappSent,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const TOKEN = 'mocean-token-123';
const ctx = { key: TOKEN, options: {}, keys: {} };

// unknown: each endpoint resolves to its own output type; cases compare
// results with toEqual, so the shared return type stays open.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON test payloads.
function respond(body: unknown, status = 202) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondBytes(bytes: Uint8Array, contentType: string) {
	fetchMock.mockResolvedValueOnce(
		new Response(bytes, {
			status: 202,
			headers: { 'Content-Type': contentType },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const headers = new Headers(init.headers);
	const type = headers.get('Content-Type') ?? '';
	const raw = init.body ? String(init.body) : undefined;
	return {
		host: parsed.host,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		auth: headers.get('Authorization'),
		// unknown: a form body becomes a record, a JSON body is parsed.
		body: !raw
			? undefined
			: type.includes('json')
				? (JSON.parse(raw) as unknown)
				: Object.fromEntries(new URLSearchParams(raw)),
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

const JSON_FORMAT = { 'mocean-resp-format': 'json' };

type Case = {
	op: string;
	fn: AnyEndpoint;
	// unknown: each case passes its own operation's input.
	input: unknown;
	method: string;
	path: string;
	query?: Record<string, string>;
	// unknown: the expected form or JSON body.
	body?: unknown;
	// unknown: what Mocean answers.
	response: unknown;
	// unknown: the expected parsed output.
	expected: unknown;
};

const cases: Case[] = [
	{
		op: 'sms.send',
		fn: Sms.send,
		input: {
			mocean_from: 'Corsair',
			mocean_to: '60123456789',
			mocean_text: 'Hi',
		},
		method: 'POST',
		path: '/rest/2/sms',
		body: {
			'mocean-from': 'Corsair',
			'mocean-to': '60123456789',
			'mocean-text': 'Hi',
			...JSON_FORMAT,
		},
		response: smsSent,
		expected: smsSent,
	},
	{
		op: 'sms.status',
		fn: Sms.status,
		input: { mocean_msgid: 'nonexistent123' },
		method: 'GET',
		path: '/rest/2/report/message',
		query: { 'mocean-msgid': 'nonexistent123', ...JSON_FORMAT },
		response: messageStatus,
		expected: messageStatus,
	},
	{
		op: 'sms.reportConversion',
		fn: Sms.reportConversion,
		input: { mocean_msgid: 'm1', mocean_delivered: true },
		method: 'POST',
		path: '/rest/2/conversion',
		body: { 'mocean-msgid': 'm1', 'mocean-delivered': 'true', ...JSON_FORMAT },
		response: { status: 0 },
		expected: { status: 0 },
	},
	{
		op: 'account.balance',
		fn: Account.balance,
		input: {},
		method: 'GET',
		path: '/rest/2/account/balance',
		query: JSON_FORMAT,
		response: balance,
		expected: balance,
	},
	{
		op: 'account.pricing',
		fn: Account.pricing,
		input: {
			mocean_mcc: '502',
			mocean_mnc: '12',
			mocean_type: 'number-lookup',
		},
		method: 'GET',
		path: '/rest/2/account/pricing',
		query: {
			'mocean-mcc': '502',
			'mocean-mnc': '12',
			'mocean-type': 'number-lookup',
			...JSON_FORMAT,
		},
		response: pricing,
		expected: pricing,
	},
	{
		op: 'verify.request',
		fn: Verify.request,
		input: {
			mocean_to: '60123456789',
			mocean_brand: 'Corsair',
			mocean_code_length: 6,
		},
		method: 'POST',
		path: '/rest/2/verify/req/sms',
		body: {
			'mocean-to': '60123456789',
			'mocean-brand': 'Corsair',
			'mocean-code-length': '6',
			...JSON_FORMAT,
		},
		response: verifySent,
		expected: verifySent,
	},
	{
		op: 'verify.requestTelegram',
		fn: Verify.requestTelegram,
		input: {
			mocean_to: '123456',
			mocean_from: 'corsair_bot',
			mocean_brand: 'Corsair',
		},
		method: 'POST',
		path: '/rest/2/verify/req/telegram',
		body: {
			'mocean-to': '123456',
			'mocean-from': 'corsair_bot',
			'mocean-brand': 'Corsair',
			...JSON_FORMAT,
		},
		response: verifySent,
		expected: verifySent,
	},
	{
		op: 'verify.resend',
		fn: Verify.resend,
		input: { mocean_reqid: 'r1' },
		method: 'POST',
		path: '/rest/2/verify/resend/sms',
		body: { 'mocean-reqid': 'r1', ...JSON_FORMAT },
		response: { ...verifySent, resend_number: '1' },
		expected: { ...verifySent, resend_number: '1' },
	},
	{
		op: 'verify.check',
		fn: Verify.check,
		input: { mocean_reqid: 'r1', mocean_code: '1234' },
		method: 'POST',
		path: '/rest/2/verify/check',
		body: { 'mocean-reqid': 'r1', 'mocean-code': '1234', ...JSON_FORMAT },
		response: verifyChecked,
		expected: verifyChecked,
	},
	{
		op: 'lookup.request',
		fn: Lookup.request,
		input: { mocean_to: '60123456789' },
		method: 'POST',
		path: '/rest/2/nl',
		body: { 'mocean-to': '60123456789', ...JSON_FORMAT },
		response: lookup,
		expected: lookup,
	},
	{
		op: 'voice.dial',
		fn: Voice.dial,
		input: {
			mocean_to: '60123456789',
			mocean_command: [{ action: 'say', language: 'en-US', text: 'Hello' }],
		},
		method: 'POST',
		path: '/rest/2/voice/dial',
		body: {
			'mocean-to': '60123456789',
			'mocean-command': '[{"action":"say","language":"en-US","text":"Hello"}]',
			...JSON_FORMAT,
		},
		response: callStarted,
		expected: callStarted,
	},
	{
		op: 'voice.hangup',
		fn: Voice.hangup,
		input: { mocean_call_uuid: 'c1' },
		method: 'POST',
		path: '/rest/2/voice/hangup',
		body: { 'mocean-call-uuid': 'c1', ...JSON_FORMAT },
		response: hungUp,
		expected: hungUp,
	},
	{
		op: 'whatsapp.send',
		fn: WhatsApp.send,
		input: {
			mocean_from: '60111111111',
			mocean_to: '60123456789',
			mocean_content: { type: 'text', text: 'Hello' },
		},
		method: 'POST',
		path: '/rest/2/send-message/whatsapp',
		body: {
			'mocean-from': '60111111111',
			'mocean-to': '60123456789',
			'mocean-content': { type: 'text', text: 'Hello' },
		},
		response: whatsappSent,
		expected: whatsappSent,
	},
	{
		op: 'templates.list',
		fn: WhatsApp.listTemplates,
		input: { limit: 2, status: 'APPROVED' },
		method: 'GET',
		path: '/template/whatsapp/message_templates',
		query: { limit: '2', status: 'APPROVED' },
		response: { data: [template], paging: { cursors: { after: 'a' } } },
		expected: { data: [template], paging: { cursors: { after: 'a' } } },
	},
	{
		op: 'templates.get',
		fn: WhatsApp.getTemplate,
		input: { templateId: '5653923468721315' },
		method: 'GET',
		path: '/template/whatsapp/5653923468721315',
		response: template,
		expected: template,
	},
	{
		op: 'templates.create',
		fn: WhatsApp.createTemplate,
		input: {
			name: 'order_ready',
			language: 'en_US',
			category: 'UTILITY',
			components: [{ type: 'BODY', text: 'Your order {{1}} is ready' }],
		},
		method: 'POST',
		path: '/template/whatsapp/message_templates',
		body: {
			name: 'order_ready',
			language: 'en_US',
			category: 'UTILITY',
			components: [{ type: 'BODY', text: 'Your order {{1}} is ready' }],
		},
		response: template,
		expected: template,
	},
	{
		op: 'templates.edit',
		fn: WhatsApp.editTemplate,
		input: {
			templateId: '5653923468721315',
			name: 'order_ready',
			language: 'en_US',
			category: 'UTILITY',
			components: [{ type: 'BODY', text: 'Order {{1}} is ready' }],
		},
		method: 'POST',
		path: '/template/whatsapp/5653923468721315',
		body: {
			name: 'order_ready',
			language: 'en_US',
			category: 'UTILITY',
			components: [{ type: 'BODY', text: 'Order {{1}} is ready' }],
		},
		response: template,
		expected: template,
	},
	{
		op: 'templates.delete',
		fn: WhatsApp.deleteTemplate,
		input: { name: 'order_ready', hsm_id: '5653923468721315' },
		method: 'DELETE',
		path: '/template/whatsapp/message_templates',
		query: { name: 'order_ready', hsm_id: '5653923468721315' },
		response: { success: 'true' },
		expected: { success: 'true' },
	},
];

describe('every JSON operation', () => {
	it('has a request-mapping case (downloads are tested below)', () => {
		expect(cases.map((c) => c.op).sort()).toEqual(
			Object.keys(moceanEndpointSchemas)
				.filter(
					(op) => op !== 'voice.recording' && op !== 'whatsapp.downloadMedia',
				)
				.sort(),
		);
	});

	it.each(cases)(
		'$op sends the documented request and parses the answer',
		async (c) => {
			respond(c.response);

			const result = await invoke(c.fn, c.input);

			const sent = lastRequest();
			expect(sent.host).toBe('rest.moceanapi.com');
			expect(sent.auth).toBe(`Bearer ${TOKEN}`);
			expect(sent.method).toBe(c.method);
			expect(sent.path).toBe(c.path);
			expect(sent.query).toEqual(c.query ?? {});
			expect(sent.body).toEqual(c.body);
			expect(result).toEqual(c.expected);
			expect(mockLog).toHaveBeenCalledWith(
				expect.anything(),
				`mocean.${c.op}`,
				expect.anything(),
				'completed',
			);
		},
	);
});

describe('templates.list paging', () => {
	it('sends the after cursor from the previous page', async () => {
		respond({ data: [template], paging: { cursors: { after: 'QVFIUk' } } });
		const first = (await invoke(WhatsApp.listTemplates, { limit: 1 })) as {
			paging: { cursors: { after: string } };
		};
		respond({ data: [], paging: {} });
		await invoke(WhatsApp.listTemplates, {
			limit: 1,
			after: first.paging.cursors.after,
		});
		expect(lastRequest().query).toEqual({ limit: '1', after: 'QVFIUk' });
	});
});

describe('downloads', () => {
	it('voice.recording returns the audio as a file', async () => {
		respondBytes(new Uint8Array([73, 68, 51, 4]), 'audio/mpeg');
		const result = await invoke(Voice.recording, { mocean_call_uuid: 'c1' });
		expect(lastRequest()).toMatchObject({
			path: '/rest/2/voice/rec',
			query: { 'mocean-call-uuid': 'c1' },
		});
		expect(result).toMatchObject({
			contentType: 'audio/mpeg',
			byteLength: 4,
			filename: 'recording.mp3',
			contentBase64: 'SUQzBA==',
		});
	});

	it('voice.recording turns a JSON status answer into an error', async () => {
		// Seen live: the route answers a status object instead of audio.
		respond({ status: '1', err_msg: 'Authorization failed' });
		await expect(
			invoke(Voice.recording, { mocean_call_uuid: 'c1' }),
		).rejects.toMatchObject({ status: 401 });
	});

	it('whatsapp.downloadMedia returns the media as a file', async () => {
		respondBytes(new Uint8Array([255, 216, 255]), 'image/jpeg');
		const result = await invoke(WhatsApp.downloadMedia, {
			mocean_from: '60111111111',
			mocean_media_id: 'm1',
		});
		expect(lastRequest().query).toEqual({
			'mocean-from': '60111111111',
			'mocean-media-id': 'm1',
		});
		expect(result).toMatchObject({ contentType: 'image/jpeg', byteLength: 3 });
	});
});

describe('input validation', () => {
	it.each([
		['an MCC without an MNC', Account.pricing, { mocean_mcc: '502' }],
		[
			'a dlr mask without a URL',
			Sms.send,
			{
				mocean_from: 'C',
				mocean_to: '60123456789',
				mocean_text: 'x',
				mocean_dlr_mask: 1,
			},
		],
		[
			'an empty call flow',
			Voice.dial,
			{ mocean_to: '601', mocean_command: [] },
		],
		[
			'a template name with capitals',
			WhatsApp.createTemplate,
			{
				name: 'Order',
				language: 'en_US',
				category: 'UTILITY',
				components: [{ type: 'BODY', text: 'x' }],
			},
		],
		[
			'WhatsApp content without a type',
			WhatsApp.send,
			{
				mocean_from: '601',
				mocean_to: '602',
				mocean_content: { text: 'x' },
			},
		],
	] as const)('rejects %s before calling Mocean', async (_, fn, input) => {
		await expect(invoke(fn, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('outputs', () => {
	it('keeps a failed receiver in a send without failing the others', async () => {
		respond(smsSent);
		const result = (await invoke(Sms.send, {
			mocean_from: 'C',
			mocean_to: '60123456789,601',
			mocean_text: 'x',
		})) as { messages: { status: number | string }[] };
		expect(result.messages.map((m) => m.status)).toEqual([0, 28]);
	});

	it('does not log phone numbers or message text', async () => {
		respond(smsSent);
		await invoke(Sms.send, {
			mocean_from: 'C',
			mocean_to: '60123456789',
			mocean_text: 'secret text',
		});
		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('60123456789');
		expect(logged).not.toContain('secret text');
	});
});
