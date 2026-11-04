import { logEventFromContext } from 'corsair/core';
import { makeSaperlyRecordingRequest, makeSaperlyRequest } from './client';
import {
	Assistant,
	Calls,
	Connections,
	Consent,
	Health,
	Keys,
	Languages,
	Messages,
	Numbers,
	Pricing,
	Usage,
	Voices,
} from './endpoints';
import type { SaperlyContext } from './index';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeSaperlyRequest: jest.fn(),
		makeSaperlyRecordingRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeSaperlyRequest);
const mockRecording = jest.mocked(makeSaperlyRecordingRequest);

const number = {
	id: 'num_1',
	phoneNumber: '+14155550100',
	connectionId: null,
	webhookUrl: null,
	country: 'US',
	numberType: 'local',
	monthlyPriceCents: 100,
	currency: 'USD',
	nextChargeAt: null,
	releasedAt: null,
	createdAt: '2026-01-01T00:00:00.000Z',
};

const connection = {
	id: 'con_1',
	name: 'Front desk',
	mode: 'hosted',
	instructions: 'Be brief',
	llm: null,
	language: null,
	mcpServers: null,
	callControl: null,
	complianceEnabled: true,
	smsAutoReply: false,
	disclosure: 'This is an AI.',
	recordingEnabled: true,
	openaiRealtime: null,
	manualSecret: null,
	manualWebhookUrl: null,
	createdAt: '2026-01-01T00:00:00.000Z',
	backend: 'network',
	tts: null,
};

const message = {
	id: 'msg_1',
	numberId: 'num_1',
	direction: 'outbound',
	to: '+14155550123',
	from: '+14155550100',
	body: 'hello',
	segments: 1,
	status: 'queued',
	createdAt: '2026-01-01T00:00:00.000Z',
};

const call = {
	id: 'call_1',
	numberId: 'num_1',
	direction: 'outbound',
	to: '+14155550123',
	from: '+14155550100',
	status: 'initiated',
	rateCentsPerMin: 2,
	durationSec: null,
	costCents: null,
	hasRecording: false,
	hasTranscript: false,
	createdAt: '2026-01-01T00:00:00.000Z',
};

const voice = {
	id: 'voice_1',
	name: 'Clara',
	gender: 'female',
	language: 'en-US',
};

const customVoice = {
	id: 'cv_1',
	name: 'Mine',
	language: 'en',
	gender: 'neutral',
	status: 'pending',
	failureReason: null,
	createdAt: '2026-01-01T00:00:00.000Z',
	updatedAt: '2026-01-01T00:00:00.000Z',
};

const consent = {
	id: 'cns_1',
	numberId: 'num_1',
	peerNumber: '+14155550123',
	consentType: 'explicit_outbound',
	source: 'signup_form',
	grantedAt: '2026-01-01T00:00:00.000Z',
	revokedAt: null,
};

const token = {
	id: 'key_1',
	name: 'agent',
	token: 'sap_sk_live_returned',
	prefix: 'sap_sk_live',
	scopes: ['read'],
	lastUsedAt: null,
	createdAt: '2026-01-01T00:00:00.000Z',
};

// Endpoint functions only read key and options.
function ctx(): SaperlyContext {
	return { key: 'x_key_test', options: {} } as SaperlyContext;
}

// One routing row covers every endpoint, so the request fields stay open.
type RequestOptions = {
	method?: string;
	body?: unknown;
	query?: unknown;
	path?: unknown;
	headers?: unknown;
	formData?: unknown;
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('saperly routing', () => {
	const cases: Array<{
		name: string;
		run: () => Promise<unknown>;
		response: unknown;
		method: string;
		url: string;
		body?: unknown;
		query?: unknown;
		path?: unknown;
		headers?: unknown;
		formData?: unknown;
	}> = [
		{
			name: 'numbers.list',
			run: () => Numbers.list(ctx(), {}),
			response: [number],
			method: 'GET',
			url: '/numbers',
		},
		{
			name: 'numbers.provision',
			run: () =>
				Numbers.provision(ctx(), {
					areaCode: '415',
					idempotencyKey: 'idem-1',
				}),
			response: number,
			method: 'POST',
			url: '/numbers',
			body: { areaCode: '415' },
			headers: { 'Idempotency-Key': 'idem-1' },
		},
		{
			name: 'numbers.get',
			run: () => Numbers.get(ctx(), { id: 'num_1' }),
			response: number,
			method: 'GET',
			url: '/numbers/{id}',
			path: { id: 'num_1' },
		},
		{
			name: 'numbers.release',
			run: () => Numbers.release(ctx(), { id: 'num_1' }),
			response: { status: 'released' },
			method: 'POST',
			url: '/numbers/{id}/release',
			path: { id: 'num_1' },
		},
		{
			name: 'numbers.assignConnection',
			run: () =>
				Numbers.assignConnection(ctx(), {
					id: 'num_1',
					connectionId: 'con_1',
				}),
			response: number,
			method: 'POST',
			url: '/numbers/{id}/connection',
			path: { id: 'num_1' },
			body: { connectionId: 'con_1' },
		},
		{
			name: 'numbers.setWebhook',
			run: () =>
				Numbers.setWebhook(ctx(), {
					id: 'num_1',
					url: 'https://example.com/brain',
				}),
			response: number,
			method: 'POST',
			url: '/numbers/{id}/webhook',
			path: { id: 'num_1' },
			body: { url: 'https://example.com/brain' },
		},
		{
			name: 'numbers.setSmsSender',
			run: () =>
				Numbers.setSmsSender(ctx(), { id: 'num_1', smsSenderId: null }),
			response: number,
			method: 'POST',
			url: '/numbers/{id}/sms-sender',
			path: { id: 'num_1' },
			body: { smsSenderId: null },
		},
		{
			name: 'numbers.setCallerId',
			run: () =>
				Numbers.setCallerId(ctx(), { id: 'num_1', callerIdName: 'Front Desk' }),
			response: number,
			method: 'POST',
			url: '/numbers/{id}/caller-id',
			path: { id: 'num_1' },
			body: { callerIdName: 'Front Desk' },
		},
		{
			name: 'connections.list',
			run: () => Connections.list(ctx(), {}),
			response: [connection],
			method: 'GET',
			url: '/connections',
		},
		{
			name: 'connections.create',
			run: () => Connections.create(ctx(), { name: 'Front desk' }),
			response: connection,
			method: 'POST',
			url: '/connections',
			body: { name: 'Front desk' },
		},
		{
			name: 'connections.get',
			run: () => Connections.get(ctx(), { id: 'con_1' }),
			response: connection,
			method: 'GET',
			url: '/connections/{id}',
			path: { id: 'con_1' },
		},
		{
			name: 'connections.update',
			run: () =>
				Connections.update(ctx(), { id: 'con_1', instructions: 'Shorter' }),
			response: connection,
			method: 'PATCH',
			url: '/connections/{id}',
			body: { instructions: 'Shorter' },
		},
		{
			name: 'connections.delete',
			run: () => Connections.remove(ctx(), { id: 'con_1' }),
			response: { status: 'deleted' },
			method: 'DELETE',
			url: '/connections/{id}',
			path: { id: 'con_1' },
		},
		{
			name: 'messages.send',
			run: () =>
				Messages.send(ctx(), {
					fromNumberId: 'num_1',
					to: '+14155550123',
					body: 'hello',
				}),
			response: message,
			method: 'POST',
			url: '/messages',
			body: { fromNumberId: 'num_1', to: '+14155550123', body: 'hello' },
		},
		{
			name: 'messages.list',
			run: () => Messages.list(ctx(), { numberId: 'num_1' }),
			response: [message],
			method: 'GET',
			url: '/messages',
			query: { numberId: 'num_1' },
		},
		{
			name: 'calls.place',
			run: () =>
				Calls.place(ctx(), { fromNumberId: 'num_1', to: '+14155550123' }),
			response: call,
			method: 'POST',
			url: '/calls',
			body: { fromNumberId: 'num_1', to: '+14155550123' },
		},
		{
			name: 'calls.list',
			run: () => Calls.list(ctx(), {}),
			response: [],
			method: 'GET',
			url: '/calls',
		},
		{
			name: 'calls.get',
			run: () => Calls.get(ctx(), { id: 'call_1' }),
			response: call,
			method: 'GET',
			url: '/calls/{id}',
			path: { id: 'call_1' },
		},
		{
			name: 'calls.end',
			run: () => Calls.end(ctx(), { id: 'call_1' }),
			response: call,
			method: 'POST',
			url: '/calls/{id}/end',
			path: { id: 'call_1' },
		},
		{
			name: 'calls.transfer',
			run: () =>
				Calls.transfer(ctx(), { id: 'call_1', to: 'sip:agent@example.com' }),
			response: call,
			method: 'POST',
			url: '/calls/{id}/transfer',
			body: { to: 'sip:agent@example.com' },
		},
		{
			name: 'calls.transcript',
			run: () => Calls.transcript(ctx(), { id: 'call_1' }),
			response: [{ speaker: 'caller', text: 'hi' }],
			method: 'GET',
			url: '/calls/{id}/transcript',
			path: { id: 'call_1' },
		},
		{
			name: 'voices.list',
			run: () => Voices.list(ctx(), { language: 'en' }),
			response: [voice],
			method: 'GET',
			url: '/voices',
			query: { language: 'en' },
		},
		{
			name: 'customVoices.list',
			run: () => Voices.listCustom(ctx(), {}),
			response: [customVoice],
			method: 'GET',
			url: '/custom-voices',
		},
		{
			name: 'customVoices.get',
			run: () => Voices.getCustom(ctx(), { id: 'cv_1' }),
			response: customVoice,
			method: 'GET',
			url: '/custom-voices/{id}',
			path: { id: 'cv_1' },
		},
		{
			name: 'customVoices.delete',
			run: () => Voices.deleteCustom(ctx(), { id: 'cv_1' }),
			response: { status: 'deleted' },
			method: 'DELETE',
			url: '/custom-voices/{id}',
			path: { id: 'cv_1' },
		},
		{
			name: 'languages.list',
			run: () => Languages.list(ctx(), {}),
			response: [{ code: 'en', name: 'English' }],
			method: 'GET',
			url: '/languages',
		},
		{
			name: 'usage.summary',
			run: () => Usage.summary(ctx(), { since: '2026-01-01T00:00:00.000Z' }),
			response: {
				calls: { count: 0, totalCostCents: 0, totalDurationSec: 0 },
				messages: { count: 0 },
				balanceCents: 500,
			},
			method: 'GET',
			url: '/usage',
			query: { since: '2026-01-01T00:00:00.000Z' },
		},
		{
			name: 'consent.list',
			run: () => Consent.list(ctx(), {}),
			response: [consent],
			method: 'GET',
			url: '/consent',
		},
		{
			name: 'consent.record',
			run: () =>
				Consent.record(ctx(), {
					numberId: 'num_1',
					peerNumber: '+14155550123',
					consentType: 'explicit_outbound',
					source: 'signup_form',
				}),
			response: consent,
			method: 'POST',
			url: '/consent',
			body: {
				numberId: 'num_1',
				peerNumber: '+14155550123',
				consentType: 'explicit_outbound',
				source: 'signup_form',
			},
		},
		{
			name: 'consent.revoke',
			run: () =>
				Consent.revoke(ctx(), {
					numberId: 'num_1',
					peerNumber: '+14155550123',
				}),
			response: { status: 'revoked' },
			method: 'POST',
			url: '/consent/revoke',
			body: { numberId: 'num_1', peerNumber: '+14155550123' },
		},
		{
			name: 'consent.check',
			run: () =>
				Consent.check(ctx(), {
					numberId: 'num_1',
					peerNumber: '+14155550123',
				}),
			response: { hasConsent: true, type: 'explicit_outbound' },
			method: 'GET',
			url: '/consent/check',
			query: { numberId: 'num_1', peerNumber: '+14155550123' },
		},
		{
			name: 'pricing.quote',
			run: () => Pricing.quote(ctx(), { country: 'US', numberType: 'local' }),
			response: { customerMonthlyCents: 100, customerUpfrontCents: 0 },
			method: 'GET',
			url: '/pricing/quote',
			query: { country: 'US', numberType: 'local' },
		},
		{
			name: 'keys.list',
			run: () => Keys.list(ctx(), {}),
			response: [token],
			method: 'GET',
			url: '/api-tokens',
		},
		{
			name: 'keys.mint',
			run: () =>
				Keys.mint(ctx(), {
					name: 'agent',
					scopes: ['read', 'write'],
					spendLimitCents: 5000,
					spendLimitResetPeriod: 'monthly',
				}),
			response: token,
			method: 'POST',
			url: '/api-tokens',
			body: {
				name: 'agent',
				scopes: ['read', 'write'],
				spendLimitCents: 5000,
				spendLimitResetPeriod: 'monthly',
			},
		},
		{
			name: 'keys.revoke',
			run: () => Keys.revoke(ctx(), { id: 'key_1' }),
			response: { status: 'revoked' },
			method: 'POST',
			url: '/api-tokens/{id}/revoke',
			path: { id: 'key_1' },
		},
		{
			name: 'health.check',
			run: () => Health.check(ctx(), {}),
			response: { status: 'ok' },
			method: 'GET',
			url: '/health',
		},
		{
			name: 'assistant.answer',
			run: () =>
				Assistant.answer(ctx(), {
					workspaceSlug: 'acme',
					question: 'How many numbers?',
				}),
			response: {
				answer: 'One',
				provider: 'mock',
				modelId: 'mock',
				usedTools: [],
				assistantConfigured: true,
			},
			method: 'POST',
			url: '/assistant/answer',
			body: { workspaceSlug: 'acme', question: 'How many numbers?' },
		},
	];

	it.each(cases)(
		'$name calls $method $url',
		async ({ run, response, method, url, body, query, path, headers }) => {
			mockRequest.mockResolvedValue(response);
			await run();
			expect(mockRequest).toHaveBeenCalledTimes(1);
			const call = mockRequest.mock.calls[0];
			if (!call) throw new Error('request was not made');
			// jest's mock call tuple is untyped.
			const [calledUrl, key, options] = call as [
				string,
				string,
				RequestOptions,
			];
			expect(calledUrl).toBe(url);
			expect(key).toBe('x_key_test');
			expect(options.method ?? 'GET').toBe(method);
			if (body !== undefined) expect(options.body).toEqual(body);
			if (query !== undefined) expect(options.query).toEqual(query);
			if (path !== undefined) expect(options.path).toEqual(path);
			if (headers !== undefined) expect(options.headers).toEqual(headers);
			expect(logEventFromContext).toHaveBeenCalled();
		},
	);

	it('uploads a custom voice as multipart with a required idempotency key', async () => {
		mockRequest.mockResolvedValue(customVoice);
		const audio = new Blob(['hi'], { type: 'audio/wav' });
		await Voices.createCustom(ctx(), {
			name: 'Mine',
			language: 'en',
			gender: 'neutral',
			audio,
			idempotencyKey: 'upload-1',
		});
		const uploadCall = mockRequest.mock.calls[0];
		if (!uploadCall) throw new Error('request was not made');
		// jest's mock call tuple is untyped.
		const options = uploadCall[2] as RequestOptions;
		expect(uploadCall[0]).toBe('/custom-voices');
		expect(options.method).toBe('POST');
		expect(options.headers).toEqual({ 'Idempotency-Key': 'upload-1' });
		expect(options.formData).toEqual({
			name: 'Mine',
			language: 'en',
			gender: 'neutral',
			audio,
		});
		expect(options.body).toBeUndefined();
	});

	it('reads a recording through the redirect helper', async () => {
		mockRecording.mockResolvedValue({
			url: 'https://cdn.example/recording.wav',
		});
		await Calls.recording(ctx(), { id: 'call_1' });
		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockRecording).toHaveBeenCalledWith(
			'/calls/{id}/recording',
			'x_key_test',
			expect.objectContaining({ path: { id: 'call_1' } }),
		);
	});

	it('rejects an oversized SMS before any request', async () => {
		await expect(
			Messages.send(ctx(), {
				fromNumberId: 'num_1',
				to: '+14155550123',
				body: 'x'.repeat(1601),
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a missing API key before any request', async () => {
		// Empty key stands in for a context whose key builder found no API key.
		const bare = { key: '', options: {} } as SaperlyContext;
		await expect(Numbers.list(bare, {})).rejects.toThrow('saperly');
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
