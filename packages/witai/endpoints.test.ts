/**
 * Exercises all 32 endpoint wrappers: the HTTP method and path each one
 * builds, and what reaches the event log. Network access is mocked, so
 * this runs in CI without a real Wit.ai token.
 */
import { logEventFromContext } from 'corsair/core';
import {
	Apps,
	Entities,
	Intents,
	Message,
	Traits,
	Utterances,
	Voices,
} from './endpoints';
import { witAiEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof Apps.listApps>[0];

function makeCtx() {
	// Cast, not a claim this satisfies the full Ctx shape: only `key`,
	// which every witai endpoint reads, is built.
	return { key: 'test-witai-key' } as unknown as Ctx;
}

let lastUrl = '';
let lastMethod = '';
let lastBody: unknown;
type Call = { url: string; method: string; body: unknown };
let calls: Call[] = [];

const RESPONSE_BODY = {
	id: 'test-id',
	name: 'test',
	entities: {},
	traits: {},
	intents: [],
	confidence: 1,
	detected_locales: [],
};

beforeEach(() => {
	mockLogEvent.mockClear();
	calls = [];
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = init?.body ? JSON.parse(init.body as string) : undefined;
		calls.push({ url: lastUrl, method: lastMethod, body: lastBody });
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => RESPONSE_BODY,
			text: async () => JSON.stringify(RESPONSE_BODY),
		};
	}) as unknown as typeof global.fetch;
});

/** [registry path, invocation, expected method, expected URL substring] */
const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	['apps.listApps', (c) => Apps.listApps(c, {}), 'GET', '/apps'],
	['apps.getApp', (c) => Apps.getApp(c, { app_id: 'a1' }), 'GET', '/apps/a1'],
	[
		'apps.createApp',
		(c) => Apps.createApp(c, { name: 'My App', lang: 'en' }),
		'POST',
		'/apps',
	],
	[
		'apps.updateApp',
		(c) => Apps.updateApp(c, { app_id: 'a1', name: 'Renamed' }),
		'PUT',
		'/apps/a1',
	],
	[
		'apps.deleteApp',
		(c) => Apps.deleteApp(c, { app_id: 'a1' }),
		'DELETE',
		'/apps/a1',
	],
	[
		'apps.exportApp',
		(c) => Apps.exportApp(c, { app_id: 'a1' }),
		'GET',
		'/apps/a1/export',
	],
	[
		'apps.listTags',
		(c) => Apps.listTags(c, { app_id: 'a1' }),
		'GET',
		'/apps/a1/tags',
	],
	[
		'message.getMessage',
		(c) => Message.getMessage(c, { q: 'hello' }),
		'GET',
		'/message',
	],
	[
		'message.detectLanguage',
		(c) => Message.detectLanguage(c, { q: 'bonjour' }),
		'GET',
		'/language',
	],
	['intents.listIntents', (c) => Intents.listIntents(c, {}), 'GET', '/intents'],
	[
		'intents.getIntent',
		(c) => Intents.getIntent(c, { intent: 'book_flight' }),
		'GET',
		'/intents/book_flight',
	],
	[
		'intents.createIntent',
		(c) => Intents.createIntent(c, { name: 'book_flight' }),
		'POST',
		'/intents',
	],
	[
		'intents.deleteIntent',
		(c) => Intents.deleteIntent(c, { intent: 'book_flight' }),
		'DELETE',
		'/intents/book_flight',
	],
	[
		'entities.listEntities',
		(c) => Entities.listEntities(c, {}),
		'GET',
		'/entities',
	],
	[
		'entities.getEntity',
		(c) => Entities.getEntity(c, { entity: 'wit$location' }),
		'GET',
		'/entities/wit$location',
	],
	[
		'entities.createEntity',
		(c) => Entities.createEntity(c, { name: 'city' }),
		'POST',
		'/entities',
	],
	[
		'entities.deleteEntity',
		(c) => Entities.deleteEntity(c, { entity: 'city' }),
		'DELETE',
		'/entities/city',
	],
	[
		'entities.addKeyword',
		(c) =>
			Entities.addKeyword(c, {
				entity: 'city',
				keyword: 'paris',
				synonyms: ['paname'],
			}),
		'POST',
		'/entities/city/keywords',
	],
	[
		'entities.deleteKeyword',
		(c) => Entities.deleteKeyword(c, { entity: 'city', keyword: 'paris' }),
		'DELETE',
		'/entities/city/keywords/paris',
	],
	[
		'entities.addSynonym',
		(c) =>
			Entities.addSynonym(c, {
				entity: 'city',
				keyword: 'paris',
				synonym: 'paname',
			}),
		'POST',
		'/entities/city/keywords/paris/synonyms',
	],
	[
		'entities.deleteSynonym',
		(c) =>
			Entities.deleteSynonym(c, {
				entity: 'city',
				keyword: 'paris',
				synonym: 'paname',
			}),
		'DELETE',
		'/entities/city/keywords/paris/synonyms/paname',
	],
	[
		'entities.deleteRole',
		(c) => Entities.deleteRole(c, { entity: 'city', role: 'origin' }),
		'DELETE',
		'/entities/city:origin',
	],
	['traits.listTraits', (c) => Traits.listTraits(c, {}), 'GET', '/traits'],
	[
		'traits.getTrait',
		(c) => Traits.getTrait(c, { trait: 'sentiment' }),
		'GET',
		'/traits/sentiment',
	],
	[
		'traits.createTrait',
		(c) => Traits.createTrait(c, { name: 'sentiment' }),
		'POST',
		'/traits',
	],
	[
		'traits.deleteTrait',
		(c) => Traits.deleteTrait(c, { trait: 'sentiment' }),
		'DELETE',
		'/traits/sentiment',
	],
	[
		'traits.addValue',
		(c) => Traits.addValue(c, { trait: 'sentiment', value: 'positive' }),
		'POST',
		'/traits/sentiment/values',
	],
	[
		'utterances.listUtterances',
		(c) => Utterances.listUtterances(c, {}),
		'GET',
		'/utterances',
	],
	[
		'utterances.createUtterances',
		(c) =>
			Utterances.createUtterances(c, {
				utterances: [{ text: 'book a flight', intent: 'book_flight' }],
			}),
		'POST',
		'/utterances',
	],
	[
		'utterances.deleteUtterances',
		(c) => Utterances.deleteUtterances(c, { texts: ['book a flight'] }),
		'DELETE',
		'/utterances',
	],
	['voices.listVoices', (c) => Voices.listVoices(c, {}), 'GET', '/voices'],
	[
		'voices.getVoice',
		(c) => Voices.getVoice(c, { voice: 'Rosie' }),
		'GET',
		'/voices/Rosie',
	],
];

describe('operation routing', () => {
	for (const [name, invoke, method, pathSubstring] of OPERATIONS) {
		it(`${name} issues ${method} ${pathSubstring}`, async () => {
			const ctx = makeCtx();
			await invoke(ctx);

			expect(calls[0]?.method).toBe(method);
			expect(calls[0]?.url).toContain(pathSubstring);
			// Every request must carry the Wit.ai API version query param.
			expect(calls[0]?.url).toContain('v=');
		});
	}
});

describe('DELETE requests with a body', () => {
	it('utterances.deleteUtterances sends the selected texts in the body', async () => {
		const ctx = makeCtx();
		await Utterances.deleteUtterances(ctx, { texts: ['book a flight'] });

		expect(calls[0]?.method).toBe('DELETE');
		expect(calls[0]?.body).toEqual([{ text: 'book a flight' }]);
	});
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = new Set(Object.keys(witAiEndpointSchemas));
		const exercised = new Set(OPERATIONS.map(([name]) => name));

		expect(registered.size).toBe(32);
		expect([...registered].sort()).toEqual([...exercised].sort());
	});
});

describe('event logging', () => {
	it('logs a completed event for a successful call', async () => {
		const ctx = makeCtx();
		await Apps.listApps(ctx, {});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'witai.apps.listApps',
			{},
			'completed',
		);
	});
});
