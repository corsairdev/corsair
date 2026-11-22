import { logEventFromContext } from 'corsair/core';
import { Photos } from './endpoints';
import { photo, searchPhotos } from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'px-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
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

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a photo search page', async () => {
		respond(searchPhotos);
		const page = (await invoke(Photos.search, { query: 'nature' })) as {
			photos: Array<{ id?: number }>;
		};
		expect(page.photos[0]?.id).toBe(2014422);
	});

	it('keeps null alt text nullish', async () => {
		respond({ photos: [{ ...photo, alt: null }], page: 1, per_page: 1 });
		const page = (await invoke(Photos.search, { query: 'x' })) as {
			photos: Array<{ alt?: string | null }>;
		};
		expect(page.photos[0]?.alt).toBeNull();
	});

	it('rejects a photo whose src is missing', async () => {
		respond({ photos: [{ ...photo, src: undefined }], page: 1, per_page: 1 });
		const page = (await invoke(Photos.search, { query: 'x' })) as {
			// unknown: the src block is provider-shaped, so the cast keeps it
			// open.
			photos: Array<{ src?: unknown }>;
		};
		// src is nullish in the schema, so a missing src parses as undefined.
		expect(page.photos[0]?.src).toBeUndefined();
	});
});

describe('input validation', () => {
	it('rejects a search without a query', async () => {
		await rejects(Photos.search, {}, 'query');
	});

	it('rejects a per_page over 80', async () => {
		await rejects(Photos.search, { query: 'x', per_page: 81 }, '80');
	});

	it('rejects an orientation the API does not document', async () => {
		await rejects(
			Photos.search,
			{ query: 'x', orientation: 'diagonal' },
			'orientation',
		);
	});
});
