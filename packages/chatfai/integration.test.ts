import {
	CHATFAI_API_BASE,
	ChatfaiAPIError,
	makeChatfaiRequest,
} from './client';
import { ChatfaiCharacter } from './schema';

const LIVE_KEY = process.env.CHATFAI_API_KEY;
const runLive = process.env.CHATFAI_LIVE_TESTS === 'true';
const describeLive = runLive ? describe : describe.skip;
const describeIfKey = LIVE_KEY && runLive ? describe : describe.skip;

describeLive('ChatFAI live REST v1', () => {
	it('rejects missing auth on GET /v1/conversations', async () => {
		const res = await fetch(`${CHATFAI_API_BASE}/conversations`, {
			headers: { Accept: 'application/json' },
		});
		expect(res.status).toBe(401);
	});

	it('searches public characters via GET /v1/characters/search', async () => {
		const res = await fetch(`${CHATFAI_API_BASE}/characters/search?q=gandalf`, {
			headers: { Accept: 'application/json' },
		});
		expect(res.status).toBe(200);
		const raw: unknown = await res.json();
		expect(Array.isArray(raw)).toBe(true);
		const first = ChatfaiCharacter.parse((raw as unknown[])[0]);
		expect(first.id.length).toBeGreaterThan(0);
		expect(first.name.toLowerCase()).toContain('gandalf');
	});

	it('gets a public character via GET /v1/characters/{id}', async () => {
		const searchRes = await fetch(
			`${CHATFAI_API_BASE}/characters/search?q=gandalf`,
			{ headers: { Accept: 'application/json' } },
		);
		const rows = (await searchRes.json()) as Array<{ id: string }>;
		const id = rows[0]?.id;
		expect(id).toBeDefined();
		const res = await fetch(
			`${CHATFAI_API_BASE}/characters/${encodeURIComponent(id as string)}`,
			{ headers: { Accept: 'application/json' } },
		);
		expect(res.status).toBe(200);
		const character = ChatfaiCharacter.parse(await res.json());
		expect(character.id).toBe(id);
	});
});

describeIfKey('ChatFAI live REST v1 (authenticated)', () => {
	it('lists conversations for the API key', async () => {
		const raw = await makeChatfaiRequest<unknown>(
			'/conversations',
			LIVE_KEY as string,
			{ query: { limit: 5 } },
		);
		expect(raw === null || typeof raw === 'object').toBe(true);
	});

	it('maps a bad key to ChatfaiAPIError 401', async () => {
		const err = await makeChatfaiRequest('/conversations', 'invalid-key').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(ChatfaiAPIError);
		expect((err as ChatfaiAPIError).status).toBe(401);
	});
});
