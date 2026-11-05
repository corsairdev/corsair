/**
 * Live tests against a real Doppler account.
 *
 * Excluded from a default run by `testPathIgnorePatterns` in
 * `jest.config.cjs`, excluded from CI by the same flag on the command line,
 * and self-skipping when no token is present, so a checkout without one
 * still runs green.
 *
 * **Paced at one request every 700ms.** Doppler's own docs give real
 * per-minute limits by bucket (reads/secret-reads/writes are separate); the
 * tightest, `secret reads` at 120/min, is the one this suite paces against -
 * 700ms of headroom per request comfortably clears that even accounting for
 * other traffic on the same token.
 *
 * Read-only throughout except two throwaway writes, both cleaned up (or
 * self-expiring) rather than left behind:
 * - a config, created under the configured project's `dev` environment then
 *   deleted;
 * - a Doppler Share link, created with the default `expire_views`/
 *   `expire_days` (1/1) rather than read back, so it expires on its own.
 *
 * Deliberately never exercised live:
 * - `secrets.get`/`secrets.list`/`secrets.download` - real secret values on
 *   this account, however low-stakes, are not worth reading just to prove
 *   the route works; `secrets.names` (names only) stands in for it.
 * - `projects.delete`/`environments.delete` - irreversible against the one
 *   configured project this suite has to work with.
 * - `changeRequests.list`/`groups.deleteMember` - confirmed 403 (plan-gated)
 *   during recon; re-confirming on every run spends a request to learn
 *   nothing new. Covered by mocked tests instead.
 * - `share.createEncrypted` - would need a real client-side AES-256-GCM/
 *   PBKDF2 implementation in the test itself just to produce a valid
 *   ciphertext; the route's request/response shape is covered by
 *   `endpoints.test.ts` instead.
 *
 * To run:
 *   DOPPLER_TOKEN=<token> DOPPLER_PROJECT=<slug> pnpm test:live
 */
import {
	Auth,
	Configs,
	Environments,
	Projects,
	Secrets,
	Share,
	Workplace,
} from './endpoints';
import { DopplerConfigEntity, DopplerProjectEntity } from './schema/database';

const token = process.env.DOPPLER_TOKEN;
const project = process.env.DOPPLER_PROJECT;

const describeLive = token && project ? describe : describe.skip;

/**
 * `describeLive` already gates the whole suite on `project` being truthy,
 * but that gate is not a type guard - `project` is still typed
 * `string | undefined` everywhere below it without this. Narrowed once here
 * instead of repeating `project ?? ''` at every call site.
 */
const projectSlug = project ?? '';

const PACE_MS = 700;
let lastCall = 0;
async function paced<T>(operation: () => Promise<T>): Promise<T> {
	const wait = lastCall + PACE_MS - Date.now();
	if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
	lastCall = Date.now();
	return await operation();
}

function makeCtx() {
	// `db` is left undefined on purpose: `cacheEntity`/`cacheEntities` no-op
	// cleanly on a missing store (see `endpoints/persist.ts`), so mirroring
	// is exercised for control flow without a real table to write into.
	return {
		key: token ?? '',
		db: {},
	} as unknown as Parameters<typeof Workplace.get>[0];
}

const PROBE = 'dev_corsair_integration_probe_delete_me';

describeLive('Doppler live API', () => {
	it('returns information about the authenticated token', async () => {
		const ctx = makeCtx();
		const me = await paced(() => Auth.me(ctx, {}));
		expect(typeof me.slug).toBe('string');
	});

	it('returns the workplace', async () => {
		const ctx = makeCtx();
		const workplace = await paced(() => Workplace.get(ctx, {}));
		expect(typeof workplace.id).toBe('string');
	});

	it('returns a project list including the configured project', async () => {
		const ctx = makeCtx();
		const result = await paced(() => Projects.list(ctx, {}));
		expect(result.projects.some((p) => p.slug === project)).toBe(true);
	});

	it('returns a project that parses as the project entity', async () => {
		const ctx = makeCtx();
		const found = await paced(() =>
			Projects.get(ctx, { project: projectSlug }),
		);
		const parsed = DopplerProjectEntity.safeParse(found);
		if (!parsed.success) console.error(parsed.error.issues);
		expect(parsed.success).toBe(true);
	});

	it('returns environments including dev', async () => {
		const ctx = makeCtx();
		const environments = await paced(() =>
			Environments.list(ctx, { project: projectSlug }),
		);
		expect(environments.some((e) => e.id === 'dev')).toBe(true);
	});

	it('returns configs for dev', async () => {
		const ctx = makeCtx();
		const result = await paced(() =>
			Configs.list(ctx, { project: projectSlug, environment: 'dev' }),
		);
		expect(Array.isArray(result.configs)).toBe(true);
	});

	it('returns secret names without values', async () => {
		const ctx = makeCtx();
		const names = await paced(() =>
			Secrets.names(ctx, { project: projectSlug, config: 'dev' }),
		);
		expect(Array.isArray(names)).toBe(true);
	});

	it('creates then deletes a config, and the config entity parses', async () => {
		const ctx = makeCtx();
		let created = false;
		try {
			const config = await paced(() =>
				Configs.create(ctx, {
					project: projectSlug,
					environment: 'dev',
					name: PROBE,
				}),
			);
			created = true;
			const parsed = DopplerConfigEntity.safeParse(config);
			if (!parsed.success) console.error(parsed.error.issues);
			expect(parsed.success).toBe(true);
			expect(config.name).toBe(PROBE);
		} finally {
			if (created) {
				await paced(() =>
					Configs.remove(ctx, { project: projectSlug, config: PROBE }),
				);
			}
		}
	});

	/**
	 * Not read back and not deleted - `expire_views`/`expire_days` default to
	 * 1/1, so the link is already effectively spent for any real use by the
	 * time this test returns. Nothing sensitive is asserted beyond shape.
	 */
	it('creates a self-expiring Doppler Share link', async () => {
		const ctx = makeCtx();
		const link = await paced(() =>
			Share.createPlain(ctx, {
				secret: 'corsair-integration-test-fictional-value',
				expireViews: 1,
				expireDays: 1,
			}),
		);
		expect(typeof link.url).toBe('string');
		expect(link.url).toMatch(/^https:\/\/share\.doppler\.com\//);
	});
});
