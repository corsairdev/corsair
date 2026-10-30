import type { AbyssaleContext } from './index';
import { abyssale } from './index';
import {
	AbyssaleDesign,
	AbyssaleFont,
	AbyssaleProject,
} from './schema/database';

/**
 * Live suite against api.abyssale.com. Excluded from CI by path; enable with:
 *
 *   ABYSSALE_API_KEY=… LIVE_TEST=1 pnpm --filter @corsair-dev/abyssale test
 *
 * Read-only: it never creates a project, because Abyssale exposes no
 * `DELETE /projects/{id}` to clean one up afterwards.
 */
const KEY = process.env.ABYSSALE_API_KEY;
const LIVE = process.env.LIVE_TEST === '1' || process.env.LIVE_TEST === 'true';
const suite = KEY && LIVE ? describe : describe.skip;

type Ops = Record<
	string,
	Record<string, (c: AbyssaleContext, i: unknown) => Promise<unknown>>
>;

function op(group: string, name: string, key: string | undefined = KEY) {
	// The key must reach the factory, not just the ctx, so the rejection test
	// exercises a genuinely unauthenticated client.
	const fn = (abyssale({ key }).endpoints as unknown as Ops)[group]?.[name];
	if (!fn) throw new Error(`missing endpoint ${group}.${name}`);
	return fn;
}

const ctx = { key: KEY, options: {}, db: {} } as unknown as AbyssaleContext;

jest.setTimeout(60_000);

suite('Abyssale live API', () => {
	it('testAuth confirms the key and returns the workspace', async () => {
		const res = (await op('auth', 'test')(ctx, {})) as { company: string };
		expect(typeof res.company).toBe('string');
		expect(res.company.length).toBeGreaterThan(0);
	});

	it('getFonts returns fonts matching the entity schema', async () => {
		const res = (await op('fonts', 'list')(ctx, {})) as unknown[];
		expect(Array.isArray(res)).toBe(true);
		for (const font of res.slice(0, 25)) {
			expect(() => AbyssaleFont.parse(font)).not.toThrow();
		}
	});

	it('getFonts honours the type filter', async () => {
		const google = (await op('fonts', 'list')(ctx, {
			type: 'google',
		})) as unknown[];
		expect(google.length).toBeGreaterThan(0);
		// Fail if the endpoint returns fonts of another type.
		for (const font of google.slice(0, 50)) {
			expect(AbyssaleFont.parse(font).type).toBe('google');
		}
	});

	it('getDesigns returns designs matching the entity schema', async () => {
		const res = (await op('designs', 'list')(ctx, {})) as unknown[];
		expect(Array.isArray(res)).toBe(true);
		for (const design of res.slice(0, 25)) {
			expect(() => AbyssaleDesign.parse(design)).not.toThrow();
		}
	});

	it('getDesigns accepts the documented type filter', async () => {
		const res = (await op('designs', 'list')(ctx, {
			type: 'static',
		})) as unknown[];
		expect(Array.isArray(res)).toBe(true);
		for (const design of res.slice(0, 25)) {
			expect(AbyssaleDesign.parse(design).type).toBe('static');
		}
	});

	it('rejects an invalid API key', async () => {
		const badCtx = {
			key: 'invalid-key',
			options: {},
			db: {},
		} as unknown as AbyssaleContext;
		await expect(
			op('auth', 'test', 'invalid-key')(badCtx, {}),
		).rejects.toThrow();
	});
});

/** Sanity check that cached project payloads still parse. */
describe('project entity', () => {
	it('parses the documented create-project response', () => {
		expect(() =>
			AbyssaleProject.parse({
				id: '08eafd16-9d61-11f1-b748-06b6ae795cdb',
				name: 'example',
				created_at_ts: 1787317551,
			}),
		).not.toThrow();
	});
});
