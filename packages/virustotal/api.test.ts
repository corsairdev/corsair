/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `VIRUSTOTAL_API_KEY=... pnpm --filter @corsair-dev/virustotal test:live`.
 * Read-only: the free tier allows four requests a minute, so the suite makes five
 * calls, spaced at least 15 s apart, and does not submit new scans or post
 * comments.
 */
import { Comments, Domains, Files, Urls } from './endpoints';
import type { VirustotalContext } from './index';

const apiKey = process.env.VIRUSTOTAL_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'VIRUSTOTAL_API_KEY is not set: the live VirusTotal suite is skipped, not passing.',
	);
}

// The public key allows four requests a minute; one every 15.5 s stays under it.
const MIN_GAP_MS = 15_500;
let lastCall = 0;

async function paced<T>(run: () => Promise<T>): Promise<T> {
	const wait = lastCall + MIN_GAP_MS - Date.now();
	if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
	lastCall = Date.now();
	return run();
}

function liveContext(): VirustotalContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as VirustotalContext;
}

// A well-known file, so the read is stable: the EICAR test string's SHA-256.
const EICAR_SHA256 =
	'275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f';

jest.setTimeout(30_000);

describeIfKey('live VirusTotal API', () => {
	// The file report is read once and reused by the key-exposure check below.
	let fileReport: Awaited<ReturnType<typeof Files.get>> | undefined;

	it('reads a file report through the output schema', async () => {
		const result = await paced(() =>
			Files.get(liveContext() as never, { id: EICAR_SHA256 } as never),
		);
		fileReport = result;

		// The reported id is the SHA-256 used to look it up.
		expect(result.data?.id).toBe(EICAR_SHA256);
		expect(result.data?.attributes?.sha256).toBe(EICAR_SHA256);
		// `last_analysis_stats` is what callers branch on.
		expect(typeof result.data?.attributes?.last_analysis_stats).toBe('object');
	});

	it('reads a domain report through the output schema', async () => {
		const result = await paced(() =>
			Domains.get(
				liveContext() as never,
				{ domain: 'virustotal.com' } as never,
			),
		);

		expect(result.data?.id).toBe('virustotal.com');
	});

	it('reads an IP address report through the output schema', async () => {
		const result = await paced(() =>
			Domains.ipGet(liveContext() as never, { ip: '8.8.8.8' } as never),
		);

		expect(typeof result.data?.id).toBe('string');
	});

	it('reads a URL report through the output schema', async () => {
		// The URL id is the unpadded base64url of the URL itself.
		const id = Buffer.from('https://www.virustotal.com')
			.toString('base64url')
			.replace(/=+$/, '');
		const result = await paced(() =>
			Urls.get(liveContext() as never, { id } as never),
		);

		expect(typeof result.data?.id).toBe('string');
	});

	it('lists comments through the output schema', async () => {
		const result = await paced(() =>
			Comments.list(liveContext() as never, { limit: 5 } as never),
		);

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('never exposes the API key in a returned object', () => {
		// Reuses the first read: a sixth request would pass the minute quota.
		expect(fileReport).toBeDefined();
		expect(JSON.stringify(fileReport)).not.toContain(apiKey as string);
	});
});
