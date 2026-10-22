import * as messages from './messages';
import * as threads from './threads';

// Gmail reads metadataHeaders and labelIds as repeated query parameters. Joined
// into one comma-separated value, metadataHeaders=Subject,From matches a header
// literally named "Subject,From", so a metadata read returns no headers at all.

type AnyEndpoint = (ctx: any, input: any) => Promise<unknown>;

let urls: URL[] = [];

beforeEach(() => {
	urls = [];
	jest.spyOn(console, 'warn').mockImplementation(() => {});
	global.fetch = jest.fn(async (input: any) => {
		urls.push(new URL(typeof input === 'string' ? input : input.url));
		return new Response(JSON.stringify({}), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	}) as typeof fetch;
});

afterEach(() => {
	jest.restoreAllMocks();
});

const ctx = { key: 'test-token', db: {} };

async function lastQuery(endpoint: AnyEndpoint, input: object) {
	await endpoint(ctx, input);
	const url = urls.at(-1);
	if (!url) throw new Error('no request was made');
	return url.searchParams;
}

test('messages.get sends each metadata header as its own parameter', async () => {
	const params = await lastQuery(messages.get as AnyEndpoint, {
		id: 'm1',
		format: 'metadata',
		metadataHeaders: ['Subject', 'From'],
	});
	expect(params.getAll('metadataHeaders')).toEqual(['Subject', 'From']);
	expect(params.get('format')).toBe('metadata');
});

test('threads.get sends each metadata header as its own parameter', async () => {
	const params = await lastQuery(threads.get as AnyEndpoint, {
		id: 't1',
		format: 'metadata',
		metadataHeaders: ['Subject', 'From'],
	});
	expect(params.getAll('metadataHeaders')).toEqual(['Subject', 'From']);
});

test('messages.list and threads.list send each label as its own parameter', async () => {
	for (const endpoint of [messages.list, threads.list]) {
		const params = await lastQuery(endpoint as AnyEndpoint, {
			labelIds: ['INBOX', 'UNREAD'],
		});
		expect(params.getAll('labelIds')).toEqual(['INBOX', 'UNREAD']);
	}
});

test('omitted list parameters are left out of the query', async () => {
	const params = await lastQuery(messages.get as AnyEndpoint, { id: 'm1' });
	expect(params.has('metadataHeaders')).toBe(false);
});
