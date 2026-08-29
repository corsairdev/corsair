/**
 * Checks the built bundle, not the source.
 *
 * A package can typecheck and test green and still ship a broken artifact: an
 * external that got inlined, an export that got renamed, a registry that got
 * tree-shaken because nothing statically referenced it. These 129 endpoints are
 * reachable only through an object literal, which is the shape a bundler is
 * most likely to prune.
 *
 * The bundle is ESM and these tests run as CommonJS, so the runtime checks are
 * executed in a real Node ESM process and this file asserts on what it reports.
 * Everything else is a text check against the bundle itself.
 *
 * Skipped when `dist/` has not been built, so `jest` on a fresh checkout still
 * passes; CI builds before it tests, so it runs there.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = join(__dirname, 'dist', 'index.js');
const describeBuild = existsSync(DIST) ? describe : describe.skip;

/** Runs a module in a real Node process and returns the JSON it printed. */
function inNodeEsm(body: string): Record<string, unknown> {
	const source = `
		const { apininjas } = await import(${JSON.stringify(pathToFileURL(DIST).href)});
		const plugin = apininjas();
		${body}
	`;

	let output: string;
	try {
		output = execFileSync(
			process.execPath,
			['--input-type=module', '-e', source],
			{
				encoding: 'utf8',
				// stderr is captured rather than inherited: a subprocess must not be
				// able to print into the middle of the jest report. It is re-raised
				// below if the process actually failed.
				stdio: ['ignore', 'pipe', 'pipe'],
			},
		);
	} catch (error) {
		const failure = error as { stderr?: string; message: string };
		throw new Error(
			`the bundle failed to run: ${failure.stderr?.trim() || failure.message}`,
		);
	}

	const lastLine = output.trim().split('\n').pop() ?? '';
	try {
		return JSON.parse(lastLine);
	} catch {
		// Anything the bundle printed before its JSON - a warning, a stray log -
		// would otherwise surface only as an opaque parse error.
		throw new Error(
			`the bundle did not print parseable JSON. Full output:\n${output.trim()}`,
		);
	}
}

/**
 * The parts of an endpoint context these checks need.
 *
 * `$getAccountId` matters: the core's event logger calls it on every operation
 * and reports its own failure to stderr rather than throwing, so a context
 * without it produces a passing test and a page of stack traces.
 */
const CTX = `{
	key: 'bundle-check-key',
	database: undefined,
	$getAccountId: async () => 'build-check',
}`;

describeBuild('the built bundle', () => {
	const bundle = existsSync(DIST) ? readFileSync(DIST, 'utf8') : '';

	it('exports a plugin factory that builds a complete registry', () => {
		const report = inNodeEsm(`
			const groups = Object.keys(plugin.endpoints);
			const operations = groups.flatMap((group) =>
				Object.keys(plugin.endpoints[group]).map((leaf) => group + '.' + leaf),
			);
			console.log(JSON.stringify({
				id: plugin.id,
				groups: groups.length,
				operations: operations.length,
				callable: operations.every((path) => {
					const [group, leaf] = path.split('.');
					return typeof plugin.endpoints[group][leaf] === 'function';
				}),
				schemas: Object.keys(plugin.endpointSchemas).length,
				meta: Object.keys(plugin.endpointMeta).length,
				entities: Object.keys(plugin.schema.entities).length,
			}));
		`);

		expect(report).toEqual({
			id: 'apininjas',
			groups: 12,
			operations: 129,
			callable: true,
			schemas: 129,
			meta: 129,
			entities: 13,
		});
	});

	it('keeps the auth config, the webhook stance and the handler order', () => {
		const report = inNodeEsm(`
			console.log(JSON.stringify({
				authConfig: plugin.authConfig,
				webhooks: plugin.webhooks,
				matchesWebhooks: plugin.pluginWebhookMatcher(),
				handlers: Object.keys(plugin.errorHandlers),
			}));
		`);

		expect(report).toEqual({
			authConfig: { api_key: { account: ['one'] } },
			webhooks: {},
			matchesWebhooks: false,
			handlers: [
				'RATE_LIMIT_ERROR',
				'AUTH_ERROR',
				'PERMISSION_ERROR',
				'NOT_FOUND_ERROR',
				'BAD_REQUEST_ERROR',
				'SERVER_ERROR',
				'NETWORK_ERROR',
				'DEFAULT',
			],
		});
	});

	it('ships zod schemas that still validate', () => {
		const report = inNodeEsm(`
			const schema = plugin.endpointSchemas['text.sentiment'];
			console.log(JSON.stringify({
				acceptsResponse: schema.output.safeParse({ score: 0.59, sentiment: 'POSITIVE' }).success,
				rejectsEmptyInput: schema.input.safeParse({}).success === false,
			}));
		`);

		expect(report).toEqual({ acceptsResponse: true, rejectsEmptyInput: true });
	});

	it('issues a versioned, authenticated request from the bundle', () => {
		const report = inNodeEsm(`
			let call;
			globalThis.fetch = async (url, init) => {
				call = { url, key: new Headers(init.headers).get('X-Api-Key'), method: init.method };
				return {
					ok: true, status: 200, statusText: 'OK', url,
					headers: new Headers({ 'Content-Type': 'application/json' }),
					json: async () => ({ score: 0.5, sentiment: 'NEUTRAL' }),
					text: async () => '{"score":0.5,"sentiment":"NEUTRAL"}',
				};
			};
			const ctx = { ...${CTX}, db: {} };
			await plugin.endpoints.text.sentiment(ctx, { text: 'hello' });
			const v1 = call;
			await plugin.endpoints.entertainment.quoteOfTheDay(ctx, {});
			const v2 = call;
			await plugin.endpoints.health.recipes(ctx, { title: 'pasta' });
			const v3 = call;
			console.log(JSON.stringify({
				v1: v1.url.split('?')[0],
				v2: v2.url.split('?')[0],
				v3: v3.url.split('?')[0],
				keyInHeader: v1.key === 'bundle-check-key',
				keyInUrl: v1.url.includes('bundle-check-key'),
			}));
		`);

		expect(report).toEqual({
			v1: 'https://api.api-ninjas.com/v1/sentiment',
			v2: 'https://api.api-ninjas.com/v2/quoteoftheday',
			v3: 'https://api.api-ninjas.com/v3/recipe',
			keyInHeader: true,
			keyInUrl: false,
		});
	});

	it('still mirrors reference data from the bundle', () => {
		const report = inNodeEsm(`
			const written = [];
			globalThis.fetch = async (url) => ({
				ok: true, status: 200, statusText: 'OK', url,
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => [{ ident: 'EGLL', iata: 'LHR', name: 'London Heathrow' }],
				text: async () => '[]',
			});
			const ctx = {
				...${CTX},
				db: { airports: { upsertByEntityId: async (id) => { written.push(id); } } },
			};
			await plugin.endpoints.transport.airports(ctx, { iata: 'LHR' });
			console.log(JSON.stringify({ written }));
		`);

		expect(report).toEqual({ written: ['egll'] });
	});

	it('leaves corsair and zod as external imports', () => {
		// Inlining either would ship a second copy of the core to every consumer.
		expect(bundle).toMatch(/from\s*["']corsair\/(core|http)["']/);
		expect(bundle).toMatch(/from\s*["']zod["']/);
	});

	it('does not ship the test fixtures or the documentation contract', () => {
		// Both exist for the tests. Either becoming reachable from `index.ts` would
		// put a few hundred kilobytes of captured responses into every install.
		expect(bundle).not.toContain('CAPTURED_RESPONSES');
		expect(bundle).not.toContain('DOCUMENTED_OPERATIONS');
	});

	it('contains no credential', () => {
		// Real keys contain more than letters and digits, so the character class
		// has to allow the punctuation providers use.
		expect(bundle).not.toMatch(
			/X-Api-Key["']\s*:\s*["'][A-Za-z0-9\-_+/=]{20,}/,
		);
	});

	it('stays a reasonable size for what it carries', () => {
		// 129 operations with their schemas. A sudden jump means something got
		// inlined that should have stayed external.
		const kilobytes = statSync(DIST).size / 1024;

		expect(kilobytes).toBeGreaterThan(50);
		expect(kilobytes).toBeLessThan(400);
	});
});
